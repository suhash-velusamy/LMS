import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Search, Filter, Calendar, Package, Clock, CheckCircle, Truck, AlertCircle, CreditCard as Edit, Eye } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, users, services, dressTypes } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Stats for summary cards
  const totalOrders = orders.length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const inProgressCount = orders.filter(o => o.status === 'in-progress').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  // Helper function to get user details
  const getUserDetails = (userId: string) => {
    return users.find(user => user.id === userId) || {
      id: userId,
      firstName: 'Unknown',
      lastName: 'User',
      email: 'unknown@example.com',
      role: 'user'
    };
  };

  // Helper function to get service details
  const getServiceDetails = (serviceId: string) => {
    return services.find(service => service.id === serviceId) || {
      id: serviceId,
      name: 'Unknown Service',
      description: 'Service not found'
    };
  };

  // Helper function to get dress type details
  const getDressTypeDetails = (dressTypeId: string) => {
    return dressTypes.find(dressType => dressType.id === dressTypeId) || {
      id: dressTypeId,
      name: 'Unknown Dress Type',
      category: 'unknown'
    };
  };

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && new Date(order.createdAt).toDateString() === new Date().toDateString()) ||
                       (dateFilter === 'week' && new Date(order.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

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

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'picked-up', label: 'Picked Up' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-2xl font-semibold text-gray-900">{totalOrders}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-2xl font-semibold text-yellow-600">{pendingCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">In Progress</div>
            <div className="text-2xl font-semibold text-purple-600">{inProgressCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-2xl font-semibold text-green-600">{completedCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {dateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pickup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {getUserDetails(order.userId).firstName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getUserDetails(order.userId).firstName} {getUserDetails(order.userId).lastName}
                          </div>
                          <div className="text-sm text-gray-500">{getUserDetails(order.userId).email}</div>
                          <div className="text-xs text-gray-400">{order.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.serviceItems?.length || 0} item(s)</div>
                      <div className="text-sm text-gray-500">
                        {order.serviceItems?.map(item => {
                          const service = getServiceDetails(item.serviceId);
                          const dressType = getDressTypeDetails(item.dressTypeId);
                          return `${service.name} (${dressType.name})`;
                        }).join(', ') || 'No items'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.pickupDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{order.pickupTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {(() => {
                const order = orders.find(o => o.id === selectedOrder);
                if (!order) return null;

                return (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Order #{order.id}</h3>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Order Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Customer</h4>
                          <p className="text-gray-600">User {order.userId}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{formatStatus(order.status)}</span>
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Pickup Date</h4>
                          <p className="text-gray-600">
                            {new Date(order.pickupDate).toLocaleDateString()} at {order.pickupTime}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Total Amount</h4>
                          <p className="text-gray-600 font-semibold">${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Pickup Address</h4>
                        <p className="text-gray-600">{order.address}</p>
                      </div>

                      {/* Services */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Services ({order.serviceItems?.length || 0} items)</h4>
                        <div className="space-y-3">
                          {order.serviceItems?.map((serviceItem, index) => {
                            const service = getServiceDetails(serviceItem.serviceId);
                            const dressType = getDressTypeDetails(serviceItem.dressTypeId);
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                                      Qty: {serviceItem.quantity} | Quality: {serviceItem.quality}
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
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminOrders;
