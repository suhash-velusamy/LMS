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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-blue-800 text-white py-14 md:py-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
              Support <span className="bg-gradient-to-r from-blue-200 to-violet-200 bg-clip-text text-transparent">Center</span>
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl mx-auto">
              We're here to help. Find answers to common questions or get in touch with our support team.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Options */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-4 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                Get in Touch
              </h2>
              
                <div className="space-y-4">
                  <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                            <Phone className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="bg-blue-50 rounded-md px-4 py-3">
                            <h3 className="text-lg font-semibold text-gray-900">Phone Support</h3>
                            <p className="text-gray-700 font-semibold">(555) 123-4567</p>
                            <p className="text-xs text-gray-500 mt-1">Mon-Sat 8AM-8PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600 shadow-md">
                            <Mail className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="bg-green-50 rounded-md px-4 py-3">
                            <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                            <p className="text-gray-700 font-semibold">support@laundrypro.com</p>
                            <p className="text-xs text-gray-500 mt-1">24-48 hour response</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-violet-600 shadow-md">
                            <MessageCircle className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="bg-purple-50 rounded-md px-4 py-3">
                            <h3 className="text-lg font-semibold text-gray-900">Live Chat</h3>
                            <p className="text-gray-700 font-semibold">Available now</p>
                            <p className="text-xs text-gray-500 mt-1">Average wait: 2 minutes</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            {/* Business Hours */}
            <div className="card p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                Business Hours
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-700">Monday - Friday</span>
                  <span className="font-semibold text-gray-900">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-700">Saturday</span>
                  <span className="font-semibold text-gray-900">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-700">Sunday</span>
                  <span className="font-semibold text-gray-900">10:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ and Contact Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* FAQ Section */}
            <div className="card shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-base font-semibold text-gray-900 flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="flex items-center justify-between w-full text-left group"
                    >
                      <h3 className="font-medium text-gray-900 pr-4 text-base group-hover:text-blue-600 transition-colors">
                        {faq.question}
                      </h3>
                      <div className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                        expandedFaq === index 
                          ? 'bg-blue-100 text-blue-600 rotate-180' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                      }`}>
                        {expandedFaq === index ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </button>
                    {expandedFaq === index && (
                      <div className="mt-3 text-gray-600 text-sm leading-relaxed pl-2 border-l-4 border-blue-500 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="card shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-base font-semibold text-gray-900 mb-1 flex items-center">
                  <Send className="h-4 w-4 mr-2 text-blue-600" />
                  Send us a Message
                </h2>
                <p className="text-gray-600 text-sm">Can't find what you're looking for? We'd love to hear from you.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={contactForm.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={contactForm.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    required
                    value={contactForm.subject}
                    onChange={handleChange}
                    className="input"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={contactForm.message}
                    onChange={handleChange}
                    className="input resize-none"
                    placeholder="Please describe your question or concern in detail..."
                  />
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">Privacy Policy</a> and 
                    consent to being contacted regarding my inquiry.
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full md:w-auto px-6 py-3 text-base flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
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