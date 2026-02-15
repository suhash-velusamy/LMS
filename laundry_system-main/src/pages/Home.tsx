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
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-blue-800 text-white py-24 md:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 mb-6 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Trusted by 10,000+ customers
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Professional Laundry Service
              <span className="block bg-gradient-to-r from-blue-200 to-violet-200 bg-clip-text text-transparent mt-1">
                At Your Doorstep
              </span>
            </h1>
            <p className="text-sm md:text-base mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Experience premium laundry and dry cleaning services with convenient pickup and delivery. 
              We handle your clothes with care so you can focus on what matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/services"
                  className="group btn btn-primary px-8 py-4 text-lg shadow-2xl hover-glow"
                >
                  Book Service Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-primary px-8 py-4 text-lg shadow-2xl hover-glow"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/services"
                    className="btn btn-secondary px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
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
      <section className="section bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Why Choose <span className="gradient-text">LaundryPro?</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Professional service with unmatched convenience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card card-hover p-8 text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center mb-6 p-4 bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-sm md:text-base text-gray-600">Simple, convenient, and hassle-free</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { step: 1, title: 'Schedule Pickup', desc: 'Book online or through our app. Choose your preferred pickup time and location.' },
              { step: 2, title: 'Professional Cleaning', desc: 'Our experts clean your clothes with premium detergents and care techniques.' },
              { step: 3, title: 'Fast Delivery', desc: 'Receive your freshly cleaned clothes delivered back to your door.' }
            ].map((item, index) => (
              <div key={index} className="card card-hover p-8 text-center group">
                <div className="inline-flex items-center justify-center mb-6 p-4 bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-bold text-blue-600">{item.step}</div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-sm md:text-base text-gray-600">Join thousands of satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card card-hover p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic text-lg leading-relaxed">"{testimonial.text}"</p>
                <p className="font-bold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section relative overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-20"></div>
        </div>
        <div className="relative container-custom text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-sm md:text-base mb-8 text-blue-100 max-w-2xl mx-auto">
            Experience the convenience of professional laundry service today
          </p>
          <Link
            to={isAuthenticated ? "/services" : "/register"}
            className="btn btn-primary px-10 py-5 text-lg shadow-2xl hover-glow inline-flex items-center"
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