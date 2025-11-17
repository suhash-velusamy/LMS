import React, { useState } from 'react';
import { Settings, DollarSign, Clock, Mail, Phone, MapPin, Save, Plus, Trash2 } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      businessName: 'LaundryPro',
      email: 'hello@laundrypro.com',
      phone: '(555) 123-4567',
      address: '123 Business St, City, State 12345',
      timezone: 'America/New_York'
    },
    hours: {
      monday: { open: '08:00', close: '20:00', closed: false },
      tuesday: { open: '08:00', close: '20:00', closed: false },
      wednesday: { open: '08:00', close: '20:00', closed: false },
      thursday: { open: '08:00', close: '20:00', closed: false },
      friday: { open: '08:00', close: '20:00', closed: false },
      saturday: { open: '08:00', close: '20:00', closed: false },
      sunday: { open: '10:00', close: '18:00', closed: false }
    },
    services: [
      { id: '1', name: 'Wash & Fold', price: 2.50, active: true },
      { id: '2', name: 'Dry Cleaning', price: 8.99, active: true },
      { id: '3', name: 'Premium Care', price: 15.99, active: true },
      { id: '4', name: 'Express Service', price: 4.99, active: true }
    ],
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      orderUpdates: true,
      marketingEmails: true
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'services', label: 'Services & Pricing', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Mail }
  ];

  const handleSave = () => {
    // Handle save logic here
    console.log('Settings saved:', settings);
  };

  const handleServiceUpdate = (serviceId: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId ? { ...service, [field]: value } : service
      )
    }));
  };

  const addNewService = () => {
    const newService = {
      id: Date.now().toString(),
      name: 'New Service',
      price: 0,
      active: true
    };
    setSettings(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const removeService = (serviceId: string) => {
    setSettings(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== serviceId)
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={settings.general.businessName}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, businessName: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={settings.general.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, email: e.target.value }
                }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={settings.general.phone}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  general: { ...prev.general, phone: e.target.value }
                }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={settings.general.timezone}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, timezone: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Address
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={settings.general.address}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, address: e.target.value }
              }))}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBusinessHours = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>
        <div className="space-y-4">
          {Object.entries(settings.hours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-24">
                <span className="font-medium text-gray-900 capitalize">{day}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!hours.closed}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    hours: {
                      ...prev.hours,
                      [day]: { ...hours, closed: !e.target.checked }
                    }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Open</span>
              </div>

              {!hours.closed && (
                <>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        hours: {
                          ...prev.hours,
                          [day]: { ...hours, open: e.target.value }
                        }
                      }))}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        hours: {
                          ...prev.hours,
                          [day]: { ...hours, close: e.target.value }
                        }
                      }))}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {hours.closed && (
                <span className="text-gray-500 italic">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServicesSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Services & Pricing</h3>
        <button
          onClick={addNewService}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="space-y-4">
        {settings.services.map(service => (
          <div key={service.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <input
                type="text"
                value={service.name}
                onChange={(e) => handleServiceUpdate(service.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Service name"
              />
            </div>

            <div className="w-32">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={service.price}
                  onChange={(e) => handleServiceUpdate(service.id, 'price', parseFloat(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={service.active}
                onChange={(e) => handleServiceUpdate(service.id, 'active', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">Active</span>
            </div>

            <button
              onClick={() => removeService(service.id)}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive system notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, emailNotifications: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Receive urgent alerts via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.smsNotifications}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, smsNotifications: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Order Updates</h4>
              <p className="text-sm text-gray-600">Get notified about order status changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.orderUpdates}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, orderUpdates: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Marketing Emails</h4>
              <p className="text-sm text-gray-600">Receive promotional and marketing communications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.marketingEmails}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, marketingEmails: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'hours': return renderBusinessHours();
      case 'services': return renderServicesSettings();
      case 'notifications': return renderNotificationSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure your laundry service settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-md p-4">
              <ul className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              {renderTabContent()}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminSettings;