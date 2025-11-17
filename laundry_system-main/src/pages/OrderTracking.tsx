import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Package, Clock, CheckCircle, Truck, AlertCircle, Calendar, MapPin, Filter } from 'lucide-react';

const OrderTracking: React.FC = () => {
  const { user } = useAuth();
  const { getUserOrders, services, dressTypes } = useData();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const userOrders = user ? getUserOrders(user.id) : [];
  
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
  
  const filteredOrders = selectedStatus === 'all' 
    ? userOrders 
    : userOrders.filter(order => order.status === selectedStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'confirmed': return <CheckCircle className="h-5 w-5" />;
      case 'picked-up': return <Package className="h-5 w-5" />;
      case 'in-progress': return <AlertCircle className="h-5 w-5" />;
      case 'out-for-delivery': return <Truck className="h-5 w-5" />;
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
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

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'confirmed': return 25;
      case 'picked-up': return 40;
      case 'in-progress': return 60;
      case 'out-for-delivery': return 80;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'picked-up', label: 'Picked Up' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Tracking</h1>
          
          {/* Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{formatStatus(order.status)}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Order Progress</span>
                      <span>{getProgressPercentage(order.status)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(order.status)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Pickup: {new Date(order.pickupDate).toLocaleDateString()} at {order.pickupTime}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{order.address}</span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Services ({order.serviceItems?.length || 0} items)</h4>
                  <div className="space-y-3">
                    {order.serviceItems?.map((serviceItem, index) => {
                      const service = getServiceDetails(serviceItem.serviceId);
                      const dressType = getDressTypeDetails(serviceItem.dressTypeId);
                      return (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={service.image || '/i1.jpg'} 
                              alt={service.name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {service.name} - {dressType.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                Quantity: {serviceItem.quantity} | Quality: {serviceItem.quality}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-gray-900">
                              Qty: {serviceItem.quantity}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {order.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <h5 className="font-medium text-gray-900 mb-1">Special Instructions:</h5>
                      <p className="text-sm text-gray-600">{order.notes}</p>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Order Timeline</h4>
                  <div className="space-y-2">
                    <div className={`flex items-center text-sm ${order.status === 'completed' || getProgressPercentage(order.status) >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Order completed</span>
                    </div>
                    <div className={`flex items-center text-sm ${getProgressPercentage(order.status) >= 80 ? 'text-blue-600' : 'text-gray-400'}`}>
                      <Truck className="h-4 w-4 mr-2" />
                      <span>Out for delivery</span>
                    </div>
                    <div className={`flex items-center text-sm ${getProgressPercentage(order.status) >= 60 ? 'text-purple-600' : 'text-gray-400'}`}>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>In progress</span>
                    </div>
                    <div className={`flex items-center text-sm ${getProgressPercentage(order.status) >= 40 ? 'text-indigo-600' : 'text-gray-400'}`}>
                      <Package className="h-4 w-4 mr-2" />
                      <span>Picked up</span>
                    </div>
                    <div className={`flex items-center text-sm ${getProgressPercentage(order.status) >= 25 ? 'text-blue-600' : 'text-gray-400'}`}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Order confirmed</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedStatus === 'all' ? 'No orders found' : `No ${selectedStatus} orders`}
              </h3>
              <p className="text-gray-500 mb-6">
                {selectedStatus === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `You don't have any ${selectedStatus} orders.`
                }
              </p>
              {selectedStatus === 'all' && (
                <a 
                  href="/services" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Place Your First Order
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
