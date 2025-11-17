import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Package, Calendar, MapPin, Clock, CheckCircle, Truck, AlertCircle, Eye, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const { getUserOrders, services, dressTypes, reorderItems } = useData();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'amount'>('date');
  
  const userOrders = user ? getUserOrders(user.id) : [];
  
  // Sort orders based on selected criteria
  const sortedOrders = [...userOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'status':
        return a.status.localeCompare(b.status);
      case 'amount':
        return b.totalAmount - a.totalAmount;
      default:
        return 0;
    }
  });

  // Helper functions to get service and dress type details
  const getServiceDetails = (serviceId: string) => {
    return services.find(service => service.id === serviceId) || {
      id: serviceId,
      name: 'Unknown Service',
      description: 'Service not found',
      basePrice: 0,
      image: '/i1.jpg'
    };
  };

  const getDressTypeDetails = (dressTypeId: string) => {
    return dressTypes.find(dressType => dressType.id === dressTypeId) || {
      id: dressTypeId,
      name: 'Unknown Item',
      category: 'unknown',
      pricing: { wash: 0, iron: 0, washIron: 0, dryClean: 0 }
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'picked-up': return <Package className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'out-for-delivery': return <Truck className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'confirmed': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'picked-up': return 'text-indigo-600 bg-indigo-100 border-indigo-200';
      case 'in-progress': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'out-for-delivery': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleReorder = (orderId: string) => {
    reorderItems(orderId);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
              <p className="text-gray-600">View all your past laundry orders</p>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'amount')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date (Newest First)</option>
                <option value="status">Status</option>
                <option value="amount">Amount (Highest First)</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{userOrders.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userOrders.filter(o => o.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userOrders.filter(o => ['confirmed', 'picked-up', 'in-progress', 'out-for-delivery'].includes(o.status)).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center">
                <div className="h-8 w-8 text-blue-600 font-bold text-xl">₹</div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{userOrders.reduce((sum, order) => sum + order.totalAmount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {sortedOrders.length > 0 ? (
            sortedOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{formatStatus(order.status)}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Pickup: {new Date(order.pickupDate).toLocaleDateString()} at {order.pickupTime}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{order.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="h-4 w-4 mr-2" />
                      <span>{order.serviceItems?.length || 0} item(s)</span>
                    </div>
                  </div>

                  {/* Services Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {order.serviceItems?.slice(0, 3).map((serviceItem, index) => {
                        const service = getServiceDetails(serviceItem.serviceId);
                        const dressType = getDressTypeDetails(serviceItem.dressTypeId);
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {service.name} - {dressType.name} (x{serviceItem.quantity})
                          </span>
                        );
                      })}
                      {order.serviceItems && order.serviceItems.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                          +{order.serviceItems.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reorder Button for Completed Orders */}
                  {order.status === 'completed' && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <button 
                        onClick={() => handleReorder(order.id)}
                        className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reorder Same Items
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Order History</h3>
              <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
              <Link 
                to="/services" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Package className="h-4 w-4 mr-2" />
                Place Your First Order
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
