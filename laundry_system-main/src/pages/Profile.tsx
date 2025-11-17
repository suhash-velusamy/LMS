import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, CreditCard as Edit2, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    dateOfBirth: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic here
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                  user?.role === 'admin' 
                    ? 'text-purple-700 bg-purple-100' 
                    : 'text-blue-700 bg-blue-100'
                }`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </div>

              {user?.subscription && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Subscription</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">{user.subscription.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        user.subscription.status === 'active' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {user.subscription.status.charAt(0).toUpperCase() + user.subscription.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Billing:</span>
                      <span className="font-medium">
                        {new Date(user.subscription.nextBilling).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="(555) 123-4567"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <textarea
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter your full address"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-md mt-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates about your orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Get text updates for order status</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Marketing Communications</h4>
                      <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;