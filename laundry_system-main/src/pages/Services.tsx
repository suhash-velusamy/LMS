import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Clock, CheckCircle, Plus, Minus, Filter } from 'lucide-react';

const Services: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { services, dressTypes, cart, updateCartQuantity, getCartTotal } = useData();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter services by category
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const categories = [
    { key: 'all', label: 'All Services' },
    { key: 'washing', label: 'Washing Services' },
    { key: 'ironing', label: 'Ironing Services' },
    { key: 'dry-cleaning', label: 'Dry Cleaning' },
    
  ];

  const _publicBase = import.meta.env.BASE_URL || '/';
  const fallbackImages = [
    _publicBase + 'images/i1.jpeg',
    _publicBase + 'images/i2.jpeg',
    _publicBase + 'images/i3.jpeg',
    _publicBase + 'images/i4.jpeg',
    _publicBase + 'images/i5.jpeg',
    _publicBase + 'images/i6.jpeg',
    _publicBase + 'images/i7.jpeg',
    _publicBase + 'images/i8.jpeg',
    _publicBase + 'images/i9.jpeg'
  ];

  const getServiceImage = (service: any, index: number) => {
    if (service.image && typeof service.image === 'string' && service.image.trim() !== '') {
      return service.image;
    }
    return fallbackImages[index % fallbackImages.length];
  };

  const getTotalAmount = () => {
    try {
      return getCartTotal();
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return 0;
    }
  };

  const getMinDisplayPrice = (service: any) => {
    const relevantDressTypes = dressTypes.filter(dt => service.dressTypes.includes(dt.id));
    if (relevantDressTypes.length === 0) return service.basePrice;
    const fieldForService = () => {
      if (service.category === 'washing') {
        if (service.id === 'wash-iron') return 'washIron';
        return 'wash';
      }
      if (service.category === 'ironing') return 'iron';
      if (service.category === 'dry-cleaning') return 'dryClean';
      return 'wash';
    };
    const field = fieldForService();
    let prices = relevantDressTypes.map(dt => dt.pricing[field as keyof typeof dt.pricing] as number);
    // premium multiplier for wash-premium
    if (service.id === 'wash-premium') {
      prices = prices.map(p => Math.round(p * 1.5));
    }
    const min = Math.min(...prices);
    return isFinite(min) ? min : service.basePrice;
  };

  // Safety check for services data
  if (!services || services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Services...</h1>
          <p className="text-gray-600">Please wait while we load our services.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-blue-800 text-white py-20 md:py-24">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Our Services</h1>
            <p className="text-sm md:text-base text-blue-100 max-w-2xl mx-auto">
              Choose from our comprehensive range of professional laundry and dry cleaning services
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-10">
          <div className="flex items-center space-x-2 mb-6">
            <Filter className="h-6 w-6 text-blue-600" />
            <h2 className="text-base md:text-lg font-bold text-gray-900">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.key
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Services Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredServices.map((service, index) => (
                <div key={service.id} onClick={() => service.active === false ? null : navigate(`/services/${service.id}`)} className={`card card-hover overflow-hidden group ${service.active === false ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={getServiceImage(service, index)}
                      alt={service.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <span className="badge bg-white/90 backdrop-blur-sm text-blue-600 font-semibold px-3 py-1">
                        {service.category.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                      </div>
                      <span className="text-lg md:text-xl font-bold gradient-text ml-4">From ₹{getMinDisplayPrice(service)}</span>
                    </div>

                    <p className="text-gray-600 mb-4">{service.description}</p>

                    <div className="flex items-center mb-4 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{service.duration}</span>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Quality Options:</h4>
                      <div className="flex space-x-2 text-sm">
                        <span className="px-2 py-1 bg-gray-100 rounded">Normal (1x)</span>
                        
                        <span className="px-2 py-1 bg-red-100 rounded">Express (2x)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={(e) => { if (service.active === false) return; e.stopPropagation(); navigate(`/services/${service.id}`); }}
                        disabled={service.active === false}
                        className={`w-full btn ${service.active === false ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'} py-3`}
                      >
                        {service.active === false ? 'Unavailable' : 'Customize & Order'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          {cart && cart.length > 0 && (
            <div className="lg:w-96">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Cart</h3>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => {
                    // Safety check for cart item structure
                    if (!item || !item.service || !item.dressType) {
                      return null;
                    }
                    
                    return (
                      <div key={`${item.serviceId}-${item.dressTypeId}-${index}`} className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.service.name} - {item.dressType.name}</h4>
                          <p className="text-sm text-gray-600">
                            {item.quality} quality • ₹{item.service.basePrice} base
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateCartQuantity(`${item.serviceId}-${item.dressTypeId}-${item.quality}`, Math.max(0, item.quantity - 1))}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(`${item.serviceId}-${item.dressTypeId}-${item.quality}`, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">₹{getTotalAmount().toFixed(2)}</span>
                  </div>
                  
                  {isAuthenticated ? (
                    <button
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Proceed to Checkout
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 text-center">Please log in to place an order</p>
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Log In to Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Services;
