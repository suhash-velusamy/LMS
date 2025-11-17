import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface DressType {
  id: string;
  name: string;
  category: 'casual' | 'formal' | 'traditional' | 'heavy';
  pricing: {
    wash: number;
    iron: number;
    washIron: number;
    dryClean: number;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'washing' | 'ironing' | 'dry-cleaning' | 'special';
  basePrice: number;
  duration: string;
  image: string;
  features: string[];
  active?: boolean;
  qualityMultipliers: {
    normal: number;
    premium: number;
    express: number;
  };
  dressTypes: string[]; // Array of dress type IDs this service supports
}

export interface ServiceItem {
  serviceId: string;
  dressTypeId: string;
  quantity: number;
  quality: 'normal' | 'premium' | 'express';
  specialServices?: string[]; // kept for backward compatibility but not used
}

export interface Order {
  id: string;
  userId: string;
  serviceItems: ServiceItem[];
  pickupDate: string;
  pickupTime: string;
  address: string;
  status: 'pending' | 'confirmed' | 'picked-up' | 'in-progress' | 'out-for-delivery' | 'completed' | 'cancelled';
  // Final amount charged to the user after any discounts
  totalAmount: number;
  // Optionally store original total before discounts
  originalTotal?: number;
  // If a coupon/offer was applied, store its id
  appliedOfferId?: string;
  createdAt: string;
  notes?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  // Minimum order amount is not enforced in UI anymore, kept optional for backward compatibility
  minOrderAmount?: number;
  // Admin-defined coupon code to redeem the offer
  couponCode?: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  createdAt: string;
  usageLimit?: number;
  usedCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'offer' | 'order' | 'system' | 'info';
  isRead: boolean;
  createdAt: string;
  userId?: string; // If null, it's for all users
  offerId?: string; // If linked to an offer
}

interface CartItem extends ServiceItem {
  service: Service;
  dressType: DressType;
}

interface DataContextType {
  services: Service[];
  dressTypes: DressType[];
  users: any[];
  orders: Order[];
  offers: Offer[];
  notifications: Notification[];
  cart: CartItem[];
  updateDressTypePricing: (dressTypeId: string, pricingUpdate: Partial<DressType['pricing']>) => void;
  updateServiceStatus: (serviceId: string, active: boolean) => void;
  addToCart: (serviceItem: ServiceItem) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  calculateItemPrice: (serviceItem: ServiceItem) => number;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'> & { appliedOfferId?: string; originalTotal?: number }) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  addUser: (user: any) => void;
  reorderItems: (orderId: string) => void;
  // Offers management
  createOffer: (offer: Omit<Offer, 'id' | 'createdAt' | 'usedCount'>) => string;
  updateOffer: (offerId: string, updates: Partial<Offer>) => void;
  deleteOffer: (offerId: string) => void;
  getActiveOffers: () => Offer[];
  // Notifications management
  createNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  getUserNotifications: (userId: string) => Notification[];
  markNotificationAsRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dressTypes, setDressTypes] = useState<DressType[]>(() => {
    try {
      const saved = localStorage.getItem('dressTypes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load dressTypes from localStorage:', e);
    }
    return [
    {
      id: 'tshirt',
      name: 'T-shirt',
      category: 'casual',
      pricing: { wash: 30, iron: 10, washIron: 40, dryClean: 70 }
    },
    {
      id: 'pant',
      name: 'Pant/Jeans',
      category: 'casual',
      pricing: { wash: 40, iron: 15, washIron: 55, dryClean: 80 }
    },
    {
      id: 'shirt',
      name: 'Shirt',
      category: 'formal',
      pricing: { wash: 35, iron: 12, washIron: 45, dryClean: 70 }
    },
    {
      id: 'saree',
      name: 'Saree',
      category: 'traditional',
      pricing: { wash: 60, iron: 25, washIron: 75, dryClean: 120 }
    },
    {
      id: 'chudidar',
      name: 'Chudidar',
      category: 'traditional',
      pricing: { wash: 50, iron: 20, washIron: 65, dryClean: 100 }
    },
    {
      id: 'jacket',
      name: 'Jacket',
      category: 'heavy',
      pricing: { wash: 80, iron: 30, washIron: 100, dryClean: 150 }
    },
    {
      id: 'blanket',
      name: 'Blanket',
      category: 'heavy',
      pricing: { wash: 120, iron: 40, washIron: 150, dryClean: 200 }
    }
  ];
  });

  const persistDressTypes = (next: DressType[]) => {
    setDressTypes(next);
    try { localStorage.setItem('dressTypes', JSON.stringify(next)); } catch (e) {}
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'dressTypes') {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          if (Array.isArray(parsed)) setDressTypes(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Special services removed from the app - kept legacy fields in ServiceItem for compatibility
  // No special services are defined in the system now.

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem('services');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load services from localStorage:', e);
    }
    return [
    {
      id: 'wash-normal',
      name: 'Wash (Normal)',
      description: 'Standard washing service for regular garments',
      category: 'washing',
      basePrice: 30,
      duration: '24-48 hours',
      image: '/i1.jpeg',
      features: ['Eco-friendly detergents', 'Fabric softener', 'Careful handling'],
      active: true,
      qualityMultipliers: { normal: 1.0, premium: 1.5, express: 2.0 },
      dressTypes: ['tshirt', 'pant', 'shirt', 'saree', 'chudidar', 'jacket', 'blanket']
    },
    {
      id: 'wash-premium',
      name: 'Wash (Premium/Delicate)',
      description: 'Premium washing for delicate and special fabrics',
      category: 'washing',
      basePrice: 50,
      duration: '2-3 days',
      image: '/i2.jpeg',
      features: ['Gentle cycle', 'Premium detergents', 'Individual attention', 'Fabric protection'],
      active: true,
      qualityMultipliers: { normal: 1.0, premium: 1.5, express: 2.0 },
      dressTypes: ['saree', 'chudidar', 'jacket']
    },
    {
      id: 'wash-fold',
      name: 'Wash & Fold',
      description: 'Complete washing, drying, and folding service',
      category: 'washing',
      basePrice: 35,
      duration: '24-48 hours',
      image: '/i3.jpeg',
      features: ['Wash, dry & fold', 'Neat folding', 'Ready to wear'],
      active: true,
      qualityMultipliers: { normal: 1.0, premium: 1.5, express: 2.0 },
      dressTypes: ['tshirt', 'pant', 'shirt', 'chudidar']
    },
    {
      id: 'wash-iron',
      name: 'Wash & Iron',
      description: 'Complete washing and professional ironing service',
      category: 'washing',
      basePrice: 50,
      duration: '2-3 days',
      image: '/i4.jpeg',
      features: ['Wash & iron', 'Professional pressing', 'Crisp finish'],
      active: true,
      qualityMultipliers: { normal: 1.0, premium: 1.5, express: 2.0 },
      dressTypes: ['tshirt', 'pant', 'shirt', 'saree', 'chudidar', 'jacket']
    },
    {
      id: 'iron-casual',
      name: 'Iron (T-shirt, Shirt, Pant)',
      description: 'Professional ironing for casual wear',
      category: 'ironing',
      basePrice: 10,
      duration: 'Same day',
      image: '/i5.jpeg',
      features: ['Professional pressing', 'Crisp finish', 'Same day service'],
      active: true,
      qualityMultipliers: { normal: 1.0, premium: 1.5, express: 2.0 },
      dressTypes: ['tshirt', 'pant', 'shirt']
    },
    {
      id: 'iron-heavy',
      name: 'Heavy Dress Ironing',
      description: 'Specialized ironing for sarees, jackets, and blazers',
      category: 'ironing',
      basePrice: 20,
      duration: '1-2 days',
      image: '/i6.jpeg',
      features: ['Specialized pressing', 'Careful handling', 'Professional finish'],
      active: true,
      qualityMultipliers: { normal: 1.0, premium: 1.5, express: 2.0 },
      dressTypes: ['saree', 'jacket']
    },
    {
      id: 'dry-clean-casual',
      name: 'Dry Cleaning (T-shirt/Pant/Shirt)',
      description: 'Professional dry cleaning for casual garments',
      category: 'dry-cleaning',
      basePrice: 70,
      duration: '3-5 days',
      image: '/i7.jpeg',
      features: ['Professional cleaning', 'Stain treatment', 'Garment protection'],
      active: true,
      qualityMultipliers: { normal: 1.0, premium: 1.5, express: 2.0 },
      dressTypes: ['tshirt', 'pant', 'shirt']
    },
    {
      id: 'dry-clean-saree',
      name: 'Dry Cleaning (Saree)',
      description: 'Specialized dry cleaning for traditional sarees',
      category: 'dry-cleaning',
      basePrice: 120,
      duration: '5-7 days',
      image: '/i8.jpeg',
      features: ['Gentle cleaning', 'Fabric preservation', 'Professional pressing'],
      active: true,
      qualityMultipliers: { normal: 1.0, premium: 1.5, express: 2.0 },
      dressTypes: ['saree']
    },
    {
      id: 'dry-clean-heavy',
      name: 'Dry Cleaning (Suit/Blazer/Blanket)',
      description: 'Professional dry cleaning for heavy garments',
      category: 'dry-cleaning',
      basePrice: 150,
      duration: '5-7 days',
      image: '/i9.jpeg',
      features: ['Heavy-duty cleaning', 'Professional pressing', 'Quality guarantee'],
      active: true,
      qualityMultipliers: { normal: 1.0, premium: 1.5, express: 2.0 },
      dressTypes: ['jacket', 'blanket']
    }
  ];
  });

  // Persist services
  const persistServices = (next: Service[]) => {
    setServices(next);
    try { localStorage.setItem('services', JSON.stringify(next)); } catch (e) {}
  };

  // Cross-tab sync for services
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'services') {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          if (Array.isArray(parsed)) setServices(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const updateServiceStatus = (serviceId: string, active: boolean) => {
    const next = services.map(s => s.id === serviceId ? { ...s, active } : s);
    persistServices(next);
  };

  const updateDressTypePricing = (dressTypeId: string, pricingUpdate: Partial<DressType['pricing']>) => {
    const next = dressTypes.map(dt => dt.id === dressTypeId ? { ...dt, pricing: { ...dt.pricing, ...pricingUpdate } } : dt);
    persistDressTypes(next);
  };

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('orders');
      if (saved) {
        return JSON.parse(saved);
      }
      // Return default orders if no saved data
      return [
        {
          id: 'ORD-20250115-001',
          userId: '2',
          serviceItems: [
            {
              serviceId: 'wash-normal',
              dressTypeId: 'tshirt',
              quantity: 3,
              quality: 'normal'
            }
          ],
          pickupDate: '2025-01-20',
          pickupTime: '10:00',
          address: '123 Main St, City',
          status: 'in-progress',
          totalAmount: 90,
          createdAt: '2025-01-15T10:30:00Z',
          notes: 'Please handle with care'
        }
      ];
    } catch (error) {
      console.warn('Failed to load orders from localStorage:', error);
      return [];
    }
  });

  // Cross-tab sync: listen for localStorage 'orders' updates
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'orders') {
        try {
          const next = e.newValue ? JSON.parse(e.newValue) : [];
          if (Array.isArray(next)) setOrders(next);
        } catch (err) {
          console.warn('Failed to parse orders from storage event:', err);
        }
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        try {
          const raw = localStorage.getItem('orders');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setOrders(parsed);
          }
        } catch (err) {
          console.warn('Failed to refresh orders on visibility:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Persist orders to localStorage whenever they change
  const persistOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('orders', JSON.stringify(newOrders));
    } catch (error) {
      console.warn('Failed to save orders to localStorage:', error);
    }
  };

  // Users data - persisted in localStorage and synced with registrations
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('users');
      if (saved) {
        const parsedUsers = JSON.parse(saved);
        // Ensure admin user is always present
        const hasAdmin = parsedUsers.some((user: any) => user.id === 'admin-1');
        if (!hasAdmin) {
          parsedUsers.push({
            id: 'admin-1',
            email: 'admin@gmail.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            status: 'active',
            lastLogin: new Date().toISOString(),
            createdAt: '2024-01-01T00:00:00Z'
          });
        }
        return parsedUsers;
      }
    } catch (e) {
      console.warn('Failed to load users from localStorage:', e);
    }
    return [
      {
        id: 'admin-1',
        email: 'admin@gmail.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        email: 'user@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: '2025-01-15T00:00:00Z'
      }
    ];
  });

  const persistUsers = (nextUsers: any[]) => {
    setUsers(nextUsers);
    try { localStorage.setItem('users', JSON.stringify(nextUsers)); } catch (e) {}
  };

  const addUser = (user: any) => {
    const existingUser = users.find(u => u.id === user.id || u.email === user.email);
    if (!existingUser) {
      const newUser = {
        ...user,
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: user.createdAt || new Date().toISOString()
      };
      persistUsers([...users, newUser]);
    }
  };

  // Global cart persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (!raw) return [];
      
      const parsedCart = JSON.parse(raw);
      // Validate that the cart items have the new structure
      if (Array.isArray(parsedCart)) {
        return parsedCart.filter(item => 
          item && 
          item.serviceId && 
          item.dressTypeId && 
          item.quantity && 
          item.quality &&
          item.service &&
          item.dressType
        );
      }
      return [];
    } catch (err) {
      console.warn('Failed to load cart from localStorage:', err);
      return [];
    }
  });

  const persistCart = (next: CartItem[]) => {
    setCart(next);
    try { localStorage.setItem('cart', JSON.stringify(next)); } catch (e) {}
  };

  const calculateItemPrice = (serviceItem: ServiceItem): number => {
    const service = services.find(s => s.id === serviceItem.serviceId);
    const dressType = dressTypes.find(d => d.id === serviceItem.dressTypeId);
    
    if (!service || !dressType) return 0;

    let basePrice = 0;
    
    // Determine base price based on service category
    switch (service.category) {
      case 'washing':
        if (service.id === 'wash-normal') basePrice = dressType.pricing.wash;
        else if (service.id === 'wash-premium') basePrice = dressType.pricing.wash * 1.5;
        else if (service.id === 'wash-fold') basePrice = dressType.pricing.wash + 5;
        else if (service.id === 'wash-iron') basePrice = dressType.pricing.washIron;
        break;
      case 'ironing':
        basePrice = dressType.pricing.iron;
        break;
      case 'dry-cleaning':
        basePrice = dressType.pricing.dryClean;
        break;
      default:
        basePrice = service.basePrice;
    }

    // Apply quality multiplier
    const qualityMultiplier = service.qualityMultipliers[serviceItem.quality];
    let totalPrice = basePrice * qualityMultiplier;

    // Special services were removed; ignore any specialServices on the item

    return totalPrice * serviceItem.quantity;
  };

  const addToCart = (serviceItem: ServiceItem) => {
    const service = services.find(s => s.id === serviceItem.serviceId);
    const dressType = dressTypes.find(d => d.id === serviceItem.dressTypeId);
    
    if (!service || !dressType) return;

    const cartItem: CartItem = {
      ...serviceItem,
      service,
      dressType
    };

    setCart(prev => {
      const itemId = `${serviceItem.serviceId}-${serviceItem.dressTypeId}-${serviceItem.quality}`;
      const existing = prev.find(i => 
        i.serviceId === serviceItem.serviceId && 
        i.dressTypeId === serviceItem.dressTypeId && 
        i.quality === serviceItem.quality
      );
      
      const next = existing 
        ? prev.map(i => 
            i.serviceId === serviceItem.serviceId && 
            i.dressTypeId === serviceItem.dressTypeId && 
            i.quality === serviceItem.quality
              ? { ...i, quantity: i.quantity + serviceItem.quantity }
              : i
          )
        : [...prev, cartItem];
      
      try { localStorage.setItem('cart', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCart(prev => {
      const next = prev.map(i => {
        const currentItemId = `${i.serviceId}-${i.dressTypeId}-${i.quality}`;
        return currentItemId === itemId ? { ...i, quantity } : i;
      }).filter(i => i.quantity > 0);
      try { localStorage.setItem('cart', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const next = prev.filter(i => {
        const currentItemId = `${i.serviceId}-${i.dressTypeId}-${i.quality}`;
        return currentItemId !== itemId;
      });
      try { localStorage.setItem('cart', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    try { localStorage.removeItem('cart'); } catch (e) {}
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'> & { appliedOfferId?: string; originalTotal?: number }): string => {
    // Generate meaningful order ID: ORD-YYYYMMDD-XXX
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
                   (today.getMonth() + 1).toString().padStart(2, '0') +
                   today.getDate().toString().padStart(2, '0');

    // Get count of orders created today for sequential numbering
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === today.toDateString();
    });

    const orderNumber = (todayOrders.length + 1).toString().padStart(3, '0');
    const orderId = `ORD-${dateStr}-${orderNumber}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    persistOrders([...orders, newOrder]);

    // If an offer was applied, increment its usedCount and persist offers
    if (orderData.appliedOfferId) {
      const updatedOffers = offers.map(o =>
        o.id === orderData.appliedOfferId ? { ...o, usedCount: (o.usedCount || 0) + 1 } : o
      );
      persistOffers(updatedOffers);
    }

    // Real-time notification for order creation
    console.log('Real-time Order Created:', {
      orderId: newOrder.id,
      userId: newOrder.userId,
      totalAmount: newOrder.totalAmount,
      status: newOrder.status,
      timestamp: newOrder.createdAt
    });

    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    persistOrders(updatedOrders);

    // Send a notification to the order owner about the status change
    const changedOrder = updatedOrders.find(o => o.id === orderId);
    if (changedOrder) {
      const prettyStatus = status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      createNotification({
        title: `Order ${orderId} status updated`,
        message: `Your order is now ${prettyStatus}.`,
        type: 'order',
        isRead: false,
        userId: changedOrder.userId
      });
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId);
  };

  const reorderItems = (orderId: string) => {
    const order = getOrderById(orderId);
    if (!order || !order.serviceItems) return;

    // Clear current cart and add items from the order
    clearCart();
    
    order.serviceItems.forEach(serviceItem => {
      const service = services.find(s => s.id === serviceItem.serviceId);
      const dressType = dressTypes.find(dt => dt.id === serviceItem.dressTypeId);
      
      if (service && dressType) {
        const cartItem: CartItem = {
          ...serviceItem,
          service,
          dressType
        };
        addToCart(cartItem);
      }
    });
  };

  // Offers state and management
  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const saved = localStorage.getItem('offers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load offers from localStorage:', e);
    }
    return [];
  });

  const persistOffers = (nextOffers: Offer[]) => {
    setOffers(nextOffers);
    try { localStorage.setItem('offers', JSON.stringify(nextOffers)); } catch (e) {}
  };

  const createOffer = (offerData: Omit<Offer, 'id' | 'createdAt' | 'usedCount'>): string => {
    const newOffer: Offer = {
      ...offerData,
      id: `OFFER-${Date.now()}`,
      createdAt: new Date().toISOString(),
      usedCount: 0
    };
    
    persistOffers([...offers, newOffer]);
    
    // Create notification for all users about the new offer
    createNotification({
      title: `New Offer: ${newOffer.title}`,
      message: newOffer.description,
      type: 'offer',
      isRead: false,
      offerId: newOffer.id
    });
    
    return newOffer.id;
  };

  const updateOffer = (offerId: string, updates: Partial<Offer>) => {
    const updatedOffers = offers.map(offer =>
      offer.id === offerId ? { ...offer, ...updates } : offer
    );
    persistOffers(updatedOffers);
  };

  const deleteOffer = (offerId: string) => {
    const updatedOffers = offers.filter(offer => offer.id !== offerId);
    persistOffers(updatedOffers);
  };

  const getActiveOffers = (): Offer[] => {
    const now = new Date();
    return offers.filter(offer => 
      offer.isActive && 
      new Date(offer.validFrom) <= now && 
      new Date(offer.validTo) >= now
    );
  };

  // Notifications state and management
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load notifications from localStorage:', e);
    }
    return [];
  });

  const persistNotifications = (nextNotifications: Notification[]) => {
    setNotifications(nextNotifications);
    try { localStorage.setItem('notifications', JSON.stringify(nextNotifications)); } catch (e) {}
  };

  const createNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>): string => {
    const newNotification: Notification = {
      ...notificationData,
      id: `NOTIF-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    persistNotifications([...notifications, newNotification]);
    return newNotification.id;
  };

  const getUserNotifications = (userId: string): Notification[] => {
    return notifications
      .filter(notif => !notif.userId || notif.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );
    persistNotifications(updatedNotifications);
  };

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
    persistNotifications(updatedNotifications);
  };

  const value: DataContextType = {
    services,
    dressTypes,
    users,
    orders,
    offers,
    notifications,
    cart,
    updateDressTypePricing,
    updateServiceStatus,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    calculateItemPrice,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getUserOrders,
    addUser,
    reorderItems,
    // Offers management
    createOffer,
    updateOffer,
    deleteOffer,
    getActiveOffers,
    // Notifications management
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
