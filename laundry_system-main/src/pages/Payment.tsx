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
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'upi': return <Smartphone className="h-5 w-5" />;
      case 'netbanking': return <Building2 className="h-5 w-5" />;
      case 'wallet': return <Wallet className="h-5 w-5" />;
      case 'cash': return <Banknote className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const renderPaymentForm = () => {
    if (!selectedPaymentMethod) return null;

    const method = paymentMethods.find(m => m.id === selectedPaymentMethod);
    if (!method) return null;

    switch (method.type) {
      case 'card':
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="input"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="input"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className="input"
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        );

      case 'upi':
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>
            <input
              type="text"
              placeholder="yourname@paytm"
              value={formData.upiId}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
              className="input"
            />
            <p className="text-sm text-gray-600 mt-3 flex items-center">
              <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
              You'll be redirected to your UPI app to complete the payment
            </p>
          </div>
        );

      case 'netbanking':
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Bank</label>
            <select
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className="input"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Wallet</label>
            <select
              value={formData.walletType}
              onChange={(e) => handleInputChange('walletType', e.target.value)}
              className="input"
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
            <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4">
              <Banknote className="h-16 w-16 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cash on Delivery</h3>
            <p className="text-gray-600 text-lg">
              Pay <span className="font-bold text-green-600">₹{totalAmount.toFixed(2)}</span> when your order is delivered
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            Complete <span className="gradient-text">Payment</span>
          </h1>
          <p className="text-xs text-gray-600">Secure and fast payment processing</p>
        </div>

        <div className="card overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white">
            <h2 className="text-base font-bold mb-1">Payment Details</h2>
            <p className="text-xs text-blue-100">Choose your preferred payment method</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Methods */}
              <div>
                <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                  Select Payment Method
                </h2>
                <div className="space-y-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      className={`w-full p-3 border-2 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-violet-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-xl ${
                          selectedPaymentMethod === method.id
                            ? 'bg-gradient-to-br from-blue-500 to-violet-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getPaymentIcon(method.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 text-sm">{method.name}</h3>
                          <p className="text-xs text-gray-600">{method.description}</p>
                        </div>
                        {selectedPaymentMethod === method.id && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Payment Form */}
                {selectedPaymentMethod && (
                  <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Payment Details</h3>
                    {renderPaymentForm()}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                  Order Summary
                </h2>
                <div className="card-gradient p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="font-semibold text-gray-900">₹{(originalTotal ?? totalAmount).toFixed(2)}</span>
                    </div>
                    {computedDiscount > 0 && (
                      <div className="flex justify-between py-2 bg-green-50 rounded-lg px-3">
                        <span className="text-gray-700 font-medium">
                          Discount {appliedOffer ? `(${appliedOffer.couponCode} - ${appliedOffer.discountType === 'percentage' ? appliedOffer.discountValue + '%' : '₹' + appliedOffer.discountValue})` : ''}
                        </span>
                        <span className="font-bold text-green-600">- ₹{computedDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Service Charge</span>
                      <span className="font-medium text-gray-700">₹0.00</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-700">₹0.00</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                        <span className="text-lg font-bold gradient-text">₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Removed credit account info */}
                  </div>

                  {paymentError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-xs font-medium text-red-700">{paymentError}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 space-y-2">
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing || !selectedPaymentMethod}
                      className="w-full btn btn-primary py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay ₹{totalAmount.toFixed(2)}
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => navigate('/checkout')}
                      className="w-full btn btn-secondary py-2 text-sm"
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
