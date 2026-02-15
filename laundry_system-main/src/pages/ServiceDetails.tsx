import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, MapPin, Plus, Minus, Star } from 'lucide-react';

const ServiceDetails: React.FC = () => {
  const { id } = useParams();
  const { services, dressTypes, addToCart, calculateItemPrice } = useData();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const service = services.find(s => s.id === (id || ''));

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    dressTypes.forEach(d => (init[d.id] = 0));
    return init;
  });

  const [quality, setQuality] = useState<'normal'  | 'express'>('normal');
  const [orderForm, setOrderForm] = useState({ pickupDate: '', pickupTime: '', address: '', notes: '' });

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Service not found.</p>
      </div>
    );
  }

  const availableDressTypes = dressTypes.filter(dt => service.dressTypes.includes(dt.id));

  const increment = (dressTypeId: string) => setQuantities(q => ({ ...q, [dressTypeId]: (q[dressTypeId] || 0) + 1 }));
  const decrement = (dressTypeId: string) => setQuantities(q => ({ ...q, [dressTypeId]: Math.max(0, (q[dressTypeId] || 0) - 1) }));

  const itemsSelected = availableDressTypes
    .map(dt => ({ 
      dressType: dt, 
      qty: quantities[dt.id] || 0, 
      serviceItem: {
        serviceId: service.id,
        dressTypeId: dt.id,
        quantity: quantities[dt.id] || 0,
        quality
      }
    }))
    .filter(x => x.qty > 0);

  const totalAmount = itemsSelected.reduce((sum, item) => {
    return sum + calculateItemPrice(item.serviceItem);
  }, 0);

  const handlePlaceOrder = () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (itemsSelected.length === 0) return alert('Please choose at least one item');

    // Add each selected dress type as a cart item
    itemsSelected.forEach(item => {
      addToCart(item.serviceItem);
    });

    // Navigate to checkout for user to complete details
    navigate('/checkout');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 p-6">
              <img src={service.image} alt={service.name} className="w-full h-48 object-cover rounded-md" />
              <h2 className="text-2xl font-semibold text-gray-900 mt-4">{service.name}</h2>
              <p className="text-gray-600 mt-2">{service.description}</p>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{service.duration}</span>
                </div>
                <div className="text-lg font-bold text-blue-600">Starting from ₹{service.basePrice}</div>
              </div>
            </div>

            <div className="lg:col-span-2 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Customize Your Order</h3>
              
              {/* Quality Selection */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Service Quality</h4>
                <div className="flex space-x-4">
                  {[
                    { key: 'normal', label: 'Normal', multiplier: 1.0, icon: '⭐' },
                   
                    { key: 'express', label: 'Express', multiplier: 2.0, icon: '⭐⭐' }
                  ].map(q => (
                    <button
                      key={q.key}
                      onClick={() => setQuality(q.key as any)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        quality === q.key 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{q.icon}</span>
                      {q.label} ({q.multiplier}x)
                    </button>
                  ))}
                </div>
              </div>

              {/* Dress Types Selection */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Choose Items & Quantities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableDressTypes.map(dt => {
                    const serviceItem = {
                      serviceId: service.id,
                      dressTypeId: dt.id,
                      quantity: 1,
                      quality,
                    };
                    const unitPrice = calculateItemPrice(serviceItem);
                    
                    return (
                      <div key={dt.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h5 className="font-medium text-gray-900">{dt.name}</h5>
                            <p className="text-sm text-gray-600">₹{unitPrice.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => decrement(dt.id)} 
                              className="p-2 bg-white border rounded-full hover:bg-gray-100"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-medium min-w-[2rem] text-center">{quantities[dt.id] || 0}</span>
                            <button 
                              onClick={() => increment(dt.id)} 
                              className="p-2 bg-white border rounded-full hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>


              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Order Summary</h4>
                {itemsSelected.length > 0 ? (
                  <div className="space-y-3">
                    {itemsSelected.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div>
                          <span className="font-medium">{item.dressType.name}</span>
                          <span className="text-sm text-gray-600 ml-2">({quality} quality)</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{calculateItemPrice(item.serviceItem).toFixed(2)}</div>
                          <div className="text-sm text-gray-600">{item.qty} × ₹{(calculateItemPrice(item.serviceItem) / item.qty).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">Please select items to see order summary</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate('/services')} 
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Services
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={itemsSelected.length === 0}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add to Cart & Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
