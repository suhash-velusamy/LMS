import React from 'react';
import { useData } from '../../contexts/DataContext';

const AdminDelivery: React.FC = () => {
  const { orders } = useData();
  const deliveryOrders = orders.filter(o => ['in-progress', 'out-for-delivery', 'completed'].includes(o.status));
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Delivery</h1>
        <p className="text-gray-600 mt-2">Manage deliveries</p>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {deliveryOrders.map(o => (
            <div key={o.id} className="p-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-900 font-medium">Order #{o.id}</div>
                <div className="text-sm text-gray-600">Placed {new Date(o.createdAt).toLocaleDateString()}</div>
                <div className="text-xs text-gray-500">Total ₹{o.totalAmount}</div>
              </div>
              <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 uppercase">{o.status}</div>
            </div>
          ))}
          {deliveryOrders.length === 0 && (
            <div className="p-12 text-center text-gray-500">No deliveries</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDelivery;


