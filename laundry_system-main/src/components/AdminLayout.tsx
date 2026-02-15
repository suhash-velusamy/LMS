import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Package,
  Settings,
  ShoppingCart,
  Truck,
  X,
  LogOut,
  Tag,
  Shirt
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const BrandLogo = ({ className = '' }: { className?: string }) => (
    <Link
      to="/"
      className={`flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors ${className}`}
    >
      <Shirt className="h-6 w-6" />
      <span className="text-lg font-bold">LaundryPro</span>
    </Link>
  );

  const navigation = [
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Services', href: '/admin/services', icon: ShoppingCart },
    { name: 'Dress Types', href: '/admin/dress-types', icon: ShoppingCart },
    { name: 'Offers', href: '/admin/offers', icon: Tag },
    { name: 'Pickup', href: '/admin/pickup', icon: Truck },
    { name: 'Delivery', href: '/admin/delivery', icon: Truck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isCurrentPath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar disabled (using horizontal top navbar instead) */}
      <div className="hidden">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <BrandLogo />
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isCurrentPath(item.href)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm font-medium text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar disabled to use horizontal navbar */}
      <div className="hidden">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <BrandLogo />
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isCurrentPath(item.href)
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <Icon className="mr-3 h-6 w-6" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs font-medium text-gray-500">Administrator</p>
                </div>
                <button
                  onClick={logout}
                  className="ml-3 p-2 text-gray-400 hover:text-gray-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Mobile top navbar */}
        <div className="sticky top-0 z-10 lg:hidden bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
          <div className="px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <BrandLogo className="text-base" />
              <button
                onClick={logout}
                className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isCurrentPath(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} inline-flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop top navbar */}
        <div className="hidden lg:block sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
          <div className="px-6 py-3 flex items-center justify-between">
            <BrandLogo />
            <nav className="flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isCurrentPath(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={logout}
              className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
