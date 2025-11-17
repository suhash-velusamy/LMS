import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Shield, Truck, Star, CheckCircle, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: 'Fast Turnaround',
      description: 'Get your clothes cleaned and delivered within 24-48 hours'
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Quality Guarantee',
      description: 'Professional cleaning with 100% satisfaction guarantee'
    },
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: 'Free Pickup & Delivery',
      description: 'Convenient pickup and delivery at your doorstep'
    },
    {
      icon: <Star className="h-8 w-8 text-blue-600" />,
      title: 'Premium Care',
      description: 'Specialized treatment for all fabric types'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'Amazing service! My clothes come back cleaner than ever.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      text: 'Super convenient pickup and delivery. Highly recommend!',
      rating: 5
    },
    {
      name: 'Emily Davis',
      text: 'Professional service with attention to detail.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Professional Laundry Service
              <span className="block text-blue-200">At Your Doorstep</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Experience premium laundry and dry cleaning services with convenient pickup and delivery. 
              We handle your clothes with care so you can focus on what matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/services"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                >
                  Book Service Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/services"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    View Services
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LaundryPro?</h2>
            <p className="text-lg text-gray-600">Professional service with unmatched convenience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
              >
                <div className="inline-flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple, convenient, and hassle-free</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule Pickup</h3>
              <p className="text-gray-600 leading-relaxed">
                Book online or through our app. Choose your preferred pickup time and location.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Cleaning</h3>
              <p className="text-gray-600 leading-relaxed">
                Our experts clean your clothes with premium detergents and care techniques.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive your freshly cleaned clothes delivered back to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Join thousands of satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Experience the convenience of professional laundry service today
          </p>
          <Link
            to={isAuthenticated ? "/services" : "/register"}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors inline-flex items-center"
          >
            <CheckCircle className="mr-2 h-6 w-6" />
            {isAuthenticated ? "Book Service Now" : "Sign Up Today"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;