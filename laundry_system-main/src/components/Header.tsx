import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Shirt, User, LogOut, Settings, BarChart3, History, Bell } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getUserNotifications, markNotificationAsRead } = useData();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const userNotifications = user ? getUserNotifications(user.id) : [];
  const unreadCount = userNotifications.filter(notif => !notif.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <Shirt className="relative h-10 w-10 text-white p-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-xl md:text-2xl font-bold gradient-text">LaundryPro</span>
          </Link>

          {/* Navigation & User Actions - All on Right Side */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200">
                Home
              </Link>
              <Link to="/services" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200">
                Services
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200">
                  Dashboard
                </Link>
              )}
              <Link to="/support" className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200">
                Support
              </Link>
            </nav>

            {/* Separator */}
            <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 glass rounded-2xl shadow-2xl border border-white/20 z-50 animate-scale-in">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {userNotifications.length > 0 ? (
                            userNotifications.slice(0, 5).map((notification) => (
                              <div
                                key={notification.id}
                                onClick={() => {
                                  if (!notification.isRead) {
                                    markNotificationAsRead(notification.id);
                                  }
                                }}
                                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                                  !notification.isRead ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    notification.type === 'offer' ? 'bg-green-500' :
                                    notification.type === 'order' ? 'bg-blue-500' :
                                    'bg-gray-500'
                                  }`} />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {new Date(notification.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center text-gray-500">
                              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">No notifications yet</p>
                            </div>
                          )}
                        </div>
                        {userNotifications.length > 5 && (
                          <div className="px-4 py-2 border-t border-gray-200">
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              View all notifications
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">{user?.firstName}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 glass rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 animate-scale-in">
                    <div className="py-1">
                      <Link 
                        to="/history" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <History className="h-4 w-4 mr-2" />
                        Order History
                      </Link>
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary px-6 py-2.5 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/20 bg-white/50 backdrop-blur-sm">
        <nav className="px-4 py-4 space-y-2">
          <Link to="/" className="block px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">
            Home
          </Link>
          <Link to="/services" className="block px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">
            Services
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="block px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">
                Dashboard
              </Link>
            </>
          )}
          <Link to="/support" className="block px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">
            Support
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;