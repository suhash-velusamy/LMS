import React from 'react';

const AdminTest: React.FC = () => {
  console.log('AdminTest component rendering');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Test Page</h1>
        <p className="text-gray-600 mb-4">This is a simple test to verify the admin layout is working.</p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ Admin page is loading successfully!
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>If you can see this message, the admin layout and routing are working correctly.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;
