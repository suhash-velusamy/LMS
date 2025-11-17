import React from 'react';
import { useData } from '../../contexts/DataContext';

const AdminPickup: React.FC = () => {
  const { orders } = useData();
  const pickupOrders = orders.filter(o => ['pending', 'confirmed', 'picked-up'].includes(o.status));
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Pickup</h1>
        <p className="text-gray-600 mt-2">Manage scheduled pickups</p>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {pickupOrders.map(o => (
            <div key={o.id} className="p-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-900 font-medium">Order #{o.id}</div>
                <div className="text-sm text-gray-600">{new Date(o.pickupDate).toLocaleDateString()} • {o.pickupTime}</div>
                <div className="text-xs text-gray-500">{o.address}</div>
              </div>
              <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 uppercase">{o.status}</div>
            </div>
          ))}
          {pickupOrders.length === 0 && (
            <div className="p-12 text-center text-gray-500">No pickups scheduled</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPickup;


