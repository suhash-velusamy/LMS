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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-2">Manage your laundry orders and account settings</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Offers */}
        {activeOffers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="h-5 w-5 mr-2 text-green-600" />
              Special Offers for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOffers.slice(0, 3).map((offer) => (
                <div key={offer.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
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
                        className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
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
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                  <Link 
                    to="/orders" 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View all
                  </Link>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {recentOrders.length > 0 ? (
                  recentOrders.map(order => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/services" 
                  className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-blue-700 font-medium">New Order</span>
                </Link>
                <Link 
                  to="/orders" 
                  className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Package className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-gray-700 font-medium">Track Orders</span>
                </Link>
                <Link 
                  to="/history" 
                  className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <History className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-gray-700 font-medium">Order History</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Calendar className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-gray-700 font-medium">Manage Profile</span>
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
