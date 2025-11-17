import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Edit, Trash2, Tag, Calendar, Percent, DollarSign, Users, Eye, EyeOff } from 'lucide-react';

const AdminOffers: React.FC = () => {
  const { offers, createOffer, updateOffer, deleteOffer } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    couponCode: '',
    validFrom: '',
    validTo: '',
    isActive: true,
    usageLimit: undefined as number | undefined
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      couponCode: '',
      validFrom: '',
      validTo: '',
      isActive: true,
      usageLimit: undefined
    });
    setEditingOffer(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Normalize coupon code if present
    const normalizedCode = formData.couponCode ? formData.couponCode.trim().toUpperCase() : '';

    if (!editingOffer && normalizedCode) {
      const exists = offers.find(o => o.couponCode && o.couponCode.toUpperCase() === normalizedCode);
      if (exists) {
        return alert('Coupon code already exists. Please choose a different code.');
      }
    }

    if (editingOffer) {
      updateOffer(editingOffer, formData);
    } else {
      createOffer(formData);
    }

    resetForm();
  };

  const handleEdit = (offer: any) => {
    setFormData({
      title: offer.title,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      couponCode: offer.couponCode || '',
      validFrom: offer.validFrom.split('T')[0], // Convert to date input format
      validTo: offer.validTo.split('T')[0],
      isActive: offer.isActive,
      usageLimit: offer.usageLimit
    });
    setEditingOffer(offer.id);
    setShowForm(true);
  };

  const handleDelete = (offerId: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      deleteOffer(offerId);
    }
  };

  const toggleOfferStatus = (offerId: string, currentStatus: boolean) => {
    updateOffer(offerId, { isActive: !currentStatus });
  };

  const formatDiscount = (offer: any) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    } else {
      return `₹${offer.discountValue} OFF`;
    }
  };

  const isOfferActive = (offer: any) => {
    const now = new Date();
    const validFrom = new Date(offer.validFrom);
    const validTo = new Date(offer.validTo);
    return offer.isActive && validFrom <= now && validTo >= now;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Offers Management</h1>
            <p className="text-gray-600 mt-1">Create and manage promotional offers for customers</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Offer
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Offers</p>
                <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Offers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {offers.filter(offer => isOfferActive(offer)).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {offers.reduce((sum, offer) => sum + offer.usedCount, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex items-center">
              <EyeOff className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {offers.filter(offer => !offer.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingOffer ? 'Edit Offer' : 'Create New Offer'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Summer Special"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe the offer details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={formData.discountType === 'percentage' ? 100 : undefined}
                    value={formData.discountValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, couponCode: e.target.value.trim().toUpperCase() }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., SAVE10 (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid To
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.usageLimit || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Unlimited"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Activate offer immediately
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offers List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Offers</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offer Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                      <div className="text-sm text-gray-500">{offer.description}</div>
                      {offer.couponCode && (
                        <div className="text-xs text-blue-600 mt-1">
                          Code: {offer.couponCode}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {offer.discountType === 'percentage' ? (
                        <Percent className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      )}
                      <span className="text-sm font-medium text-green-600">
                        {formatDiscount(offer)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <div>
                        <div>{new Date(offer.validFrom).toLocaleDateString()}</div>
                        <div>to {new Date(offer.validTo).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>{offer.usedCount} used</div>
                      {offer.usageLimit && (
                        <div className="text-xs">of {offer.usageLimit} limit</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isOfferActive(offer)
                          ? 'text-green-800 bg-green-100'
                          : offer.isActive
                          ? 'text-yellow-800 bg-yellow-100'
                          : 'text-red-800 bg-red-100'
                      }`}>
                        {isOfferActive(offer) ? 'Active' : offer.isActive ? 'Scheduled' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleOfferStatus(offer.id, offer.isActive)}
                        className={`${offer.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={offer.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {offer.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {offers.length === 0 && (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
              <p className="text-gray-500 mb-4">Create your first promotional offer to attract customers.</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Offer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOffers;
