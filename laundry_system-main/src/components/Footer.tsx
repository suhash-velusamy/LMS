import React from 'react';
import { Shirt, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shirt className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">LaundryPro</span>
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

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 LaundryPro. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400 mt-4 md:mt-0">
              <MapPin className="h-4 w-4" />
              <span>Serving the greater metropolitan area</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;