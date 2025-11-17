import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { PaymentProvider } from './contexts/PaymentContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Dashboard from './pages/Dashboard';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import Support from './pages/Support';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOffers from './pages/admin/AdminOffers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminServices from './pages/admin/AdminServices';
import AdminDressTypes from './pages/admin/AdminDressTypes';
import AdminPickup from './pages/admin/AdminPickup';
import AdminDelivery from './pages/admin/AdminDelivery';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/Toast';
import { useAuth } from './contexts/AuthContext';

function AppShell() {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isAdminRoute && <Header />}
      <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:id" element={<ServiceDetails />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/support" element={<Support />} />
                  
                  {/* Protected User Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <OrderTracking />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders/:id" element={
                    <ProtectedRoute>
                      <OrderTracking />
                    </ProtectedRoute>
                  } />
                  <Route path="/history" element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout>
                        <AdminOrders />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout>
                        <AdminOrders />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/services" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout>
                        <AdminServices />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/dress-types" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout>
                        <AdminDressTypes />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/offers" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout>
                        <AdminOffers />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/pickup" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout>
                        <AdminPickup />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/delivery" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout>
                        <AdminDelivery />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout>
                        <AdminSettings />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <PaymentProvider>
          <Router>
            <AppShell />
          </Router>
        </PaymentProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
