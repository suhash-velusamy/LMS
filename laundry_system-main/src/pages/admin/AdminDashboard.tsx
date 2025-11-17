import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ShoppingCart,
  Truck,
  UserCheck,
  Settings,
  Eye
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { orders, services, dressTypes, users } = useData();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Debug: Log to console to check if component is rendering
  console.log('AdminDashboard rendering:', {
    orders: orders?.length,
    services: services?.length,
    dressTypes: dressTypes?.length,
    users: users?.length,
    user: user?.email
  });

  // Early return if data is not loaded
  if (!orders || !services || !dressTypes || !users) {
    console.log('AdminDashboard: Missing data, showing loading state');
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
            <p className="text-sm text-gray-500 mt-2">
              Missing: {!orders ? 'orders ' : ''}{!services ? 'services ' : ''}{!dressTypes ? 'dressTypes ' : ''}{!users ? 'users ' : ''}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate comprehensive statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const inProgressOrders = orders.filter(order => 
    ['confirmed', 'picked-up', 'in-progress'].includes(order.status)
  ).length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const activeCustomers = users.filter(user => user.status === 'active').length;
  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.role === 'admin').length;
  const regularUsers = users.filter(user => user.role === 'user').length;

  // Calculate popular services
  const serviceStats = services.map(service => {
    const serviceOrders = orders.filter(order => 
      order.serviceItems?.some(item => item.serviceId === service.id)
    );
    const totalQuantity = serviceOrders.reduce((sum, order) => 
      sum + (order.serviceItems?.reduce((itemSum, item) => 
        item.serviceId === service.id ? itemSum + item.quantity : itemSum, 0) || 0), 0
    );
    return {
      service,
      orderCount: serviceOrders.length,
      totalQuantity,
      revenue: serviceOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    };
  }).sort((a, b) => b.orderCount - a.orderCount);

  // Calculate popular dress types
  const dressTypeStats = dressTypes.map(dressType => {
    const dressOrders = orders.filter(order => 
      order.serviceItems?.some(item => item.dressTypeId === dressType.id)
    );
    const totalQuantity = dressOrders.reduce((sum, order) => 
      sum + (order.serviceItems?.reduce((itemSum, item) => 
        item.dressTypeId === dressType.id ? itemSum + item.quantity : itemSum, 0) || 0), 0
    );
    return {
      dressType,
      orderCount: dressOrders.length,
      totalQuantity,
      revenue: dressOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    };
  }).sort((a, b) => b.orderCount - a.orderCount);

  // Daily revenue calculation
  const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === date.toDateString();
    });
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      orders: dayOrders.length
    };
  });

  // Recent orders for quick view
  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'picked-up': return 'text-indigo-600 bg-indigo-100';
      case 'in-progress': return 'text-purple-600 bg-purple-100';
      case 'out-for-delivery': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  console.log('AdminDashboard: Rendering main content');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive overview of your laundry business</p>
              <p className="text-sm text-green-600 mt-1">✅ Admin page is loading successfully!</p>
            </div>
            <div className="flex space-x-2">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-xs text-gray-500">{regularUsers} customers, {adminUsers} admins</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
                <p className="text-xs text-gray-500">Currently active users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                <p className="text-xs text-gray-500">Awaiting confirmation</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressOrders}</p>
                <p className="text-xs text-gray-500">Being processed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
                <p className="text-xs text-gray-500">Successfully delivered</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
                <p className="text-xs text-gray-500">Out for delivery</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12.5% from last month</span>
                </div>
              </div>
              
              {/* Simple bar chart representation */}
              <div className="space-y-4">
                {monthlyRevenue.map((data, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-12 text-sm text-gray-600">{data.month}</div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-6 relative">
                        <div 
                          className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(data.revenue / 25000) * 100}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            ${data.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Status Overview */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="font-medium">{pendingOrders}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">In Progress</span>
                  </div>
                  <span className="font-medium">{inProgressOrders}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="font-medium">{completedOrders}</span>
                </div>
              </div>

              {/* Progress visualization */}
              <div className="mt-6">
                <div className="flex text-xs text-gray-600 mb-2">
                  <span>Completion Rate</span>
                  <span className="ml-auto">{Math.round((completedOrders / totalOrders) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(completedOrders / totalOrders) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <a href="/admin/orders" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View all orders
                </a>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        User {order.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.serviceItems?.length || 0} item(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Urgent Actions</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">{pendingOrders} orders need confirmation</p>
              <p className="text-gray-600">{inProgressOrders} orders in progress</p>
              <a href="/admin/orders" className="text-blue-600 hover:text-blue-700 font-medium">
                Manage Orders →
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Customer Management</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">Manage user accounts</p>
              <p className="text-gray-600">View customer profiles</p>
              <a href="/admin/users" className="text-blue-600 hover:text-blue-700 font-medium">
                Manage Users →
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">System Settings</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">Configure services & pricing</p>
              <p className="text-gray-600">Update business settings</p>
              <a href="/admin/settings" className="text-blue-600 hover:text-blue-700 font-medium">
                Settings →
              </a>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Popular Services */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Popular Services</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {serviceStats.slice(0, 5).map((stat, index) => (
                <div key={stat.service.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{stat.service.name}</p>
                      <p className="text-sm text-gray-500">{stat.totalQuantity} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{stat.orderCount} orders</p>
                    <p className="text-sm text-green-600">₹{stat.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Dress Types */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Popular Dress Types</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {dressTypeStats.slice(0, 5).map((stat, index) => (
                <div key={stat.dressType.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{stat.dressType.name}</p>
                      <p className="text-sm text-gray-500">{stat.totalQuantity} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{stat.orderCount} orders</p>
                    <p className="text-sm text-green-600">₹{stat.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Revenue Chart */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Daily Revenue (Last 7 Days)</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {dailyRevenue.map((data, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">{data.day}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-6 relative">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.max((data.revenue / Math.max(...dailyRevenue.map(d => d.revenue))) * 100, 5)}%` }}
                      >
                        <span className="text-xs text-white font-medium">
                          ₹{data.revenue} ({data.orders} orders)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
