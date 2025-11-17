import React from 'react';
import { useData } from '../../contexts/DataContext';

const AdminServices: React.FC = () => {
  const { services, updateServiceStatus } = useData();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <p className="text-gray-600 mt-2">Manage available services</p>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{s.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{s.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {s.category.replace('-', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {s.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{s.basePrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="inline-flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={s.active !== false}
                        onChange={(e) => updateServiceStatus(s.id, e.target.checked)}
                      />
                      <span className={s.active === false ? 'text-red-600' : 'text-green-600'}>
                        {s.active === false ? 'Inactive' : 'Active'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;


