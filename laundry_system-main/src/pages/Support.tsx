import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, ChevronDown, ChevronUp, Send } from 'lucide-react';

const Support: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: "How do I schedule a pickup?",
      answer: "You can schedule a pickup by logging into your account, selecting your desired services, and choosing a convenient pickup time. Our team will arrive at your specified location during the selected time window."
    },
    {
      question: "What are your operating hours?",
      answer: "We operate Monday through Saturday from 8:00 AM to 8:00 PM, and Sunday from 10:00 AM to 6:00 PM. Pickup and delivery services are available during these hours."
    },
    {
      question: "How long does it take to process my order?",
      answer: "Standard wash and fold services typically take 24-48 hours. Dry cleaning services take 2-3 days, while premium care services may take 3-5 days. Express services are available for same-day processing."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and offer subscription billing for regular customers. Payment is processed securely through our encrypted payment system."
    },
    {
      question: "Do you offer subscription services?",
      answer: "Yes! We offer flexible subscription plans for regular customers. You can choose weekly, bi-weekly, or monthly service schedules with discounted rates and priority booking."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We offer a 100% satisfaction guarantee. If you're not completely satisfied with our service, please contact us within 24 hours of delivery, and we'll re-clean your items at no additional charge or provide a full refund."
    },
    {
      question: "How do I track my order?",
      answer: "You can track your order in real-time through your account dashboard. You'll receive notifications at each stage: pickup confirmation, processing, and delivery. You can also call our customer service for updates."
    },
    {
      question: "What areas do you serve?",
      answer: "We currently serve the greater metropolitan area with free pickup and delivery. Check our service area map on the website or contact us to confirm if we serve your location."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to help! Find answers to common questions or get in touch with our support team.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Options */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <Phone className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone Support</h3>
                    <p className="text-sm text-gray-600">(555) 123-4567</p>
                    <p className="text-xs text-gray-500">Mon-Sat 8AM-8PM</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <Mail className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email Support</h3>
                    <p className="text-sm text-gray-600">support@laundrypro.com</p>
                    <p className="text-xs text-gray-500">24-48 hour response</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Live Chat</h3>
                    <p className="text-sm text-gray-600">Available now</p>
                    <p className="text-xs text-gray-500">Average wait: 2 minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ and Contact Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-6">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="mt-4 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Send us a Message</h2>
                <p className="text-gray-600 mt-1">Can't find what you're looking for? We'd love to hear from you.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={contactForm.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={contactForm.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    required
                    value={contactForm.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="service">Service Feedback</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={contactForm.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please describe your question or concern in detail..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                    I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a> and 
                    consent to being contacted regarding my inquiry.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;