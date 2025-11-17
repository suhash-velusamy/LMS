import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePayment } from '../contexts/PaymentContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Smartphone, Building2, Wallet, Banknote, XCircle, Loader } from 'lucide-react';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentMethods, selectedPaymentMethod, setSelectedPaymentMethod, processPayment } = usePayment();
  const { getCartTotal, clearCart, createOrder, cart, offers } = useData();
  const { user } = useAuth();

  const orderDetails = location.state?.orderDetails || {};
  // Prefer the totalAmount passed from checkout (after discounts), fallback to cart total
  const totalAmount = typeof orderDetails.totalAmount === 'number' ? orderDetails.totalAmount : getCartTotal();
  const originalTotal = typeof orderDetails.originalTotal === 'number' ? orderDetails.originalTotal : undefined;
  const appliedOfferId = orderDetails.appliedOfferId as string | undefined;

  // Determine applied offer details if present
  const appliedOffer = appliedOfferId ? offers.find(o => o.id === appliedOfferId) : undefined;
  const computedDiscount = originalTotal && appliedOffer ?
    (appliedOffer.discountType === 'percentage'
      ? Math.round(originalTotal * (appliedOffer.discountValue / 100) * 100) / 100
      : Math.min(appliedOffer.discountValue, originalTotal))
    : (originalTotal ? Math.round((originalTotal - totalAmount) * 100) / 100 : 0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    walletType: ''
  });

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setPaymentError(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      setPaymentError('Please select a payment method');
      return;
    }

    if (!user) {
      setPaymentError('Please log in to proceed with payment');
      return;
    }

    if (cart.length === 0) {
      setPaymentError('Your cart is empty. Please add items before proceeding to payment.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create order first with cart items
      const orderId = createOrder({
        userId: user.id,
        serviceItems: cart.map(item => ({
          serviceId: item.serviceId,
          dressTypeId: item.dressTypeId,
          quantity: item.quantity,
          quality: item.quality
        })),
        pickupDate: orderDetails.pickupDate || '',
        pickupTime: orderDetails.pickupTime || '',
        address: orderDetails.address || '',
        totalAmount,
        originalTotal,
        appliedOfferId,
        notes: orderDetails.notes || ''
      });

      // Debug: Log order creation
      console.log('Order created successfully:', {
        orderId,
        userId: user.id,
        itemCount: cart.length,
        totalAmount,
        serviceItems: cart.map(item => ({
          serviceId: item.serviceId,
          dressTypeId: item.dressTypeId,
          quantity: item.quantity,
          quality: item.quality
        }))
      });

      // Process payment
      const paymentResult = await processPayment(totalAmount, orderId);

      if (paymentResult.status === 'completed') {
        clearCart();
        navigate('/payment-success', { 
          state: { 
            payment: paymentResult, 
            orderId,
            amount: totalAmount 
          } 
        });
      } else {
        setPaymentError('Payment failed. Please try again.');
      }
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="h-6 w-6" />;
      case 'upi': return <Smartphone className="h-6 w-6" />;
      case 'netbanking': return <Building2 className="h-6 w-6" />;
      case 'wallet': return <Wallet className="h-6 w-6" />;
      case 'cash': return <Banknote className="h-6 w-6" />;
      default: return <CreditCard className="h-6 w-6" />;
    }
  };

  const renderPaymentForm = () => {
    if (!selectedPaymentMethod) return null;

    const method = paymentMethods.find(m => m.id === selectedPaymentMethod);
    if (!method) return null;

    switch (method.type) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'upi':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
            <input
              type="text"
              placeholder="yourname@paytm"
              value={formData.upiId}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-2">
              You'll be redirected to your UPI app to complete the payment
            </p>
          </div>
        );

      case 'netbanking':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
            <select
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
            </select>
          </div>
        );

      case 'wallet':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Wallet</label>
            <select
              value={formData.walletType}
              onChange={(e) => handleInputChange('walletType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select wallet</option>
              <option value="paytm">Paytm</option>
              <option value="phonepe">PhonePe</option>
              <option value="googlepay">Google Pay</option>
              <option value="amazonpay">Amazon Pay</option>
            </select>
          </div>
        );

      case 'cash':
        return (
          <div className="text-center py-8">
            <Banknote className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cash on Delivery</h3>
            <p className="text-gray-600">
              Pay ₹{totalAmount.toFixed(2)} when your order is delivered
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
            <p className="text-gray-600 mt-2">Complete your payment to place the order</p>
          </div>

          <div className="p-6">
            {/* Removed extra payment info banner as requested */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Methods */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {getPaymentIcon(method.type)}
                        <div>
                          <h3 className="font-medium text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Payment Form */}
                {selectedPaymentMethod && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                    {renderPaymentForm()}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{(originalTotal ?? totalAmount).toFixed(2)}</span>
                    </div>
                    {computedDiscount > 0 && (
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-600">Discount {appliedOffer ? `(${appliedOffer.couponCode} - ${appliedOffer.discountType === 'percentage' ? appliedOffer.discountValue + '%' : '₹' + appliedOffer.discountValue})` : ''}</span>
                        <span className="font-medium text-green-600">- ₹{computedDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600">Service Charge</span>
                      <span className="font-medium">₹0.00</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹0.00</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-blue-600">₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Removed credit account info */}
                  </div>

                  {paymentError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-sm text-red-700">{paymentError}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing || !selectedPaymentMethod}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        `Pay ₹${totalAmount.toFixed(2)}`
                      )}
                    </button>
                    <button
                      onClick={() => navigate('/checkout')}
                      className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
