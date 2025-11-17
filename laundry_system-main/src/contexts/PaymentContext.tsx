import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'upi' | 'netbanking' | 'cash' | 'wallet';
  icon: string;
  description: string;
  enabled: boolean;
}

export interface PaymentDetails {
  method: string;
  amount: number;
  currency: string;
  transactionId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  orderId: string;
  customerDetails?: {
    name: string;
    email: string;
    phone: string;
  };
  cardDetails?: {
    lastFour: string;
    brand: string;
  };
  upiDetails?: {
    upiId: string;
  };
}

interface PaymentContextType {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (methodId: string) => void;
  processPayment: (amount: number, orderId: string) => Promise<PaymentDetails>;
  paymentHistory: PaymentDetails[];
  addPaymentToHistory: (payment: PaymentDetails) => void;
  getPaymentById: (paymentId: string) => PaymentDetails | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: '💳',
      description: 'Pay with Visa, Mastercard, or RuPay',
      enabled: true
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      type: 'upi',
      icon: '📱',
      description: 'Pay with PhonePe, Google Pay, Paytm',
      enabled: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      type: 'netbanking',
      icon: '🏦',
      description: 'Pay directly from your bank account',
      enabled: true
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      type: 'wallet',
      icon: '💰',
      description: 'Pay with Paytm, PhonePe, or other wallets',
      enabled: true
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      type: 'cash',
      icon: '💵',
      description: 'Pay when your order is delivered',
      enabled: true
    }
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentDetails[]>([]);

  const processPayment = async (amount: number, orderId: string): Promise<PaymentDetails> => {
    const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);
    
    if (!selectedMethod) {
      throw new Error('No payment method selected');
    }

    // Simulate real-time payment processing with WebSocket-like behavior
    const payment: PaymentDetails = {
      method: selectedMethod.name,
      amount,
      currency: 'INR',
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      status: 'processing',
      timestamp: new Date().toISOString(),
      orderId,
      customerDetails: {
        creditAccount: '9345661414' // Amount will be credited to this number
      }
    };

    // Add to history immediately
    addPaymentToHistory(payment);

    // Simulate real-time processing with status updates
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update status to processing
    setPaymentHistory(prev => 
      prev.map(p => p.transactionId === payment.transactionId ? { ...p, status: 'processing' } : p)
    );

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate success/failure (95% success rate for better UX)
    const isSuccess = Math.random() > 0.05;
    
    const finalPayment: PaymentDetails = {
      ...payment,
      status: isSuccess ? 'completed' : 'failed'
    };

    // Update payment in history with real-time status
    setPaymentHistory(prev => 
      prev.map(p => p.transactionId === payment.transactionId ? finalPayment : p)
    );

    // Log payment details for debugging
    console.log('Real-time Payment processed:', {
      amount: `₹${amount}`,
      creditedTo: '9345661414',
      transactionId: payment.transactionId,
      status: finalPayment.status,
      orderId: orderId
    });

    return finalPayment;
  };

  const addPaymentToHistory = (payment: PaymentDetails) => {
    setPaymentHistory(prev => [...prev, payment]);
  };

  const getPaymentById = (paymentId: string): PaymentDetails | undefined => {
    return paymentHistory.find(payment => payment.transactionId === paymentId);
  };

  const value: PaymentContextType = {
    paymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    processPayment,
    paymentHistory,
    addPaymentToHistory,
    getPaymentById
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
