import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Storefront from './pages/Storefront';
import CustomBoxPage from './pages/CustomBoxPage';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';

const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="page-loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Storefront />} />
            <Route path="/catalogue" element={<CustomBoxPage />} />
            <Route path="/custom-box" element={<CustomBoxPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/track" element={<OrdersPage />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Storefront />} />
          </Routes>
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
