import React from 'react';
import { Shirt, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500 rounded-full filter blur-3xl opacity-10"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl blur opacity-50"></div>
                <Shirt className="relative h-10 w-10 text-white p-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">LaundryPro</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Professional laundry and dry cleaning services with convenient pickup and delivery. 
              We take care of your clothes so you can focus on what matters most.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>hello@laundrypro.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/services" className="hover:text-white transition-colors">Wash & Fold</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">Dry Cleaning</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">Premium Care</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">Express Service</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/support" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/support" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/support" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/support" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 LaundryPro. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400 mt-4 md:mt-0">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>Serving the greater metropolitan area</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;