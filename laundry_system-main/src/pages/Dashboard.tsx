import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Plus, Calendar, Eye, RefreshCw, History, Tag, Percent } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserOrders, getActiveOffers } = useData();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const userOrders = user ? getUserOrders(user.id) : [];
  const recentOrders = userOrders.slice(0, 5); // Show more recent orders
  const activeOffers = getActiveOffers();
  
  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);
  
  const orderStats = {
    total: userOrders.length,
    pending: userOrders.filter(o => o.status === 'pending').length,
    inProgress: userOrders.filter(o => ['confirmed', 'picked-up', 'in-progress'].includes(o.status)).length,
    completed: userOrders.filter(o => o.status === 'completed').length
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="gradient-text">{user?.firstName}!</span>
              </h1>
              <p className="text-sm text-gray-600">Manage your laundry orders and account settings</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-md">
              <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="card card-hover p-6 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-extrabold text-gray-900">{orderStats.total}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6 bg-gradient-to-br from-yellow-50 to-white">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-extrabold text-gray-900">{orderStats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6 bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-extrabold text-gray-900">{orderStats.completed}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover p-6 bg-gradient-to-br from-indigo-50 to-white">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-3xl font-extrabold text-gray-900">{orderStats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Offers */}
        {activeOffers.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Tag className="h-4 w-4 mr-2 text-green-600" />
              Special Offers for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOffers.slice(0, 3).map((offer) => (
                <div key={offer.id} className="card card-hover p-6 bg-gradient-to-br from-green-50 via-blue-50 to-violet-50 border-2 border-green-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {offer.discountType === 'percentage' ? (
                            <Percent className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <span className="text-green-600 font-bold mr-1">₹</span>
                          )}
                          <span className="text-lg font-bold text-green-600">
                            {offer.discountType === 'percentage' 
                              ? `${offer.discountValue}% OFF` 
                              : `₹${offer.discountValue} OFF`
                            }
                          </span>
                        </div>
                        {offer.couponCode && (
                          <span className="text-xs text-gray-500">
                            Code: {offer.couponCode}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Valid until {new Date(offer.validTo).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <Link
                        to="/services"
                        className="btn btn-primary px-4 py-2 text-sm"
                      >
                        Use Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                  <Link 
                    to="/orders" 
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-1"
                  >
                    <span>View all</span>
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {recentOrders.length > 0 ? (
                  recentOrders.map(order => (
                    <div key={order.id} className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              Order #{order.id}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {formatStatus(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {order.serviceItems?.length || 0} item(s) • ₹{order.totalAmount}
                          </p>
                          <p className="text-xs text-gray-500">
                            Pickup: {new Date(order.pickupDate).toLocaleDateString()} at {order.pickupTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No orders yet</p>
                    <Link 
                      to="/services" 
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Place Your First Order
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Subscription */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/services" 
                  className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-violet-50 hover:from-blue-100 hover:to-violet-100 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-blue-700 font-semibold">New Order</span>
                </Link>
                <Link 
                  to="/orders" 
                  className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Package className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-gray-700 font-semibold">Track Orders</span>
                </Link>
                <Link 
                  to="/history" 
                  className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <History className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-gray-700 font-semibold">Order History</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Calendar className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-gray-700 font-semibold">Manage Profile</span>
                </Link>
              </div>
            </div>

            {/* Subscription Info */}
            {user?.subscription && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Subscription</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Plan:</span>
                    <span className="font-medium text-gray-900">{user.subscription.plan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.subscription.status === 'active' 
                        ? 'text-green-700 bg-green-100' 
                        : 'text-gray-700 bg-gray-100'
                    }`}>
                      {user.subscription.status.charAt(0).toUpperCase() + user.subscription.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Next Billing:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(user.subscription.nextBilling).toLocaleDateString()}
                    </span>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium">
                    Manage Subscription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
