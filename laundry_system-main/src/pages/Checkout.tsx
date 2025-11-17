import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Minus, MapPin, Calendar, Clock } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, createOrder, clearCart, offers, getActiveOffers } = useData();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [orderForm, setOrderForm] = useState({ pickupDate: '', pickupTime: '', address: '', notes: '' });
  const [loading, setLoading] = useState(false);

  // Coupon / offer states
  const [couponCode, setCouponCode] = useState('');
  const [appliedOffer, setAppliedOffer] = useState<any | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const cartTotal = getCartTotal();

  const computeDiscount = (offer: any, amount: number) => {
    if (!offer) return 0;
    if (offer.discountType === 'percentage') {
      return Math.round((amount * (offer.discountValue / 100)) * 100) / 100;
    }
    return Math.min(offer.discountValue, amount);
  };

  const finalTotal = appliedOffer ? Math.round((cartTotal - computeDiscount(appliedOffer, cartTotal)) * 100) / 100 : cartTotal;

  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponCode) return setCouponError('Enter a coupon code');

    // Search active offers first
    const now = new Date();
    const found = offers.find((o: any) => o.couponCode && o.couponCode.toUpperCase() === couponCode.toUpperCase());

    if (!found) return setCouponError('Invalid coupon code');

    if (!found.isActive) return setCouponError('This offer is not active');
    if (new Date(found.validFrom) > now || new Date(found.validTo) < now) return setCouponError('This offer is not valid at this time');
    if (found.usageLimit && found.usedCount >= found.usageLimit) return setCouponError('This offer has reached its usage limit');

    // Apply
    setAppliedOffer(found);
    setCouponError(null);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (cart.length === 0) return alert('Cart is empty');
    if (!orderForm.pickupDate || !orderForm.pickupTime || !orderForm.address) return alert('Please enter pickup details');

    // Navigate to payment page with order details
    navigate('/payment', {
      state: {
        orderDetails: {
          pickupDate: orderForm.pickupDate,
          pickupTime: orderForm.pickupTime,
          address: orderForm.address,
          notes: orderForm.notes,
          cart: cart,
          originalTotal: cartTotal,
          totalAmount: finalTotal,
          appliedOfferId: appliedOffer?.id || undefined
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Your cart is empty.</p>
                <button onClick={() => navigate('/services')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">Browse Services</button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => {
                  const itemId = `${item.serviceId}-${item.dressTypeId}-${item.quality}`;
                  const unitPrice = item.service.basePrice; // This should use calculateItemPrice in real implementation
                  
                  return (
                    <div key={itemId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img src={item.service.image} alt={item.service.name} className="w-16 h-16 object-cover rounded-md" />
                        <div>
                          <div className="font-medium text-gray-900">{item.service.name} - {item.dressType.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.quality} quality • ₹{unitPrice.toFixed(2)} each
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button onClick={() => updateCartQuantity(itemId, Math.max(0, item.quantity - 1))} className="p-2 border rounded-md"><Minus className="h-4 w-4"/></button>
                        <div className="font-medium">{item.quantity}</div>
                        <button onClick={() => updateCartQuantity(itemId, item.quantity + 1)} className="p-2 border rounded-md"><Plus className="h-4 w-4"/></button>
                        <div className="ml-4 font-semibold">₹{(unitPrice * item.quantity).toFixed(2)}</div>
                        <button onClick={() => removeFromCart(itemId)} className="ml-4 text-sm text-red-600">Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-medium text-gray-900 mb-4">Pickup & Summary</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1"><Calendar className="inline h-4 w-4 mr-1"/> Pickup Date</label>
                <input type="date" value={orderForm.pickupDate} onChange={e => setOrderForm({...orderForm, pickupDate: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1"><Clock className="inline h-4 w-4 mr-1"/> Pickup Time</label>
                <select value={orderForm.pickupTime} onChange={e => setOrderForm({...orderForm, pickupTime: e.target.value})} className="w-full px-3 py-2 border rounded-md">
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1"><MapPin className="inline h-4 w-4 mr-1"/> Pickup Address</label>
                <textarea rows={3} value={orderForm.address} onChange={e => setOrderForm({...orderForm, address: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
              </div>

              <div className="pt-4 border-t">
                <div className="mb-3">
                  <label className="block text-sm text-gray-700 mb-1">Coupon Code</label>
                  <div className="flex items-center space-x-2">
                    <input value={couponCode} onChange={e => setCouponCode(e.target.value)} className="flex-1 px-3 py-2 border rounded-md" placeholder="Enter coupon code" />
                    <button onClick={handleApplyCoupon} className="px-3 py-2 bg-gray-100 rounded-md">Apply</button>
                    {appliedOffer && <span className="text-sm text-green-600 font-medium">Applied: {appliedOffer.couponCode}</span>}
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>

                {appliedOffer && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Discount ({appliedOffer.couponCode})</span>
                    <span className="text-sm font-medium text-green-600">- ₹{computeDiscount(appliedOffer, cartTotal).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">₹{finalTotal.toFixed(2)}</span>
                </div>

                <div className="mt-4">
                  <button disabled={loading} onClick={handlePlaceOrder} className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">{loading ? 'Processing...' : 'Proceed to Payment'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
