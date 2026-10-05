import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/customer/Home";
import ProductListing from "./pages/customer/ProductListing";
import ProductDetail from "./pages/customer/ProductDetail";
import Cart from "./pages/customer/Cart";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/Overview";
import AdminInventory from "./pages/admin/Inventory";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import ContactManager from "./pages/admin/ContactManager";
import CreateProduct from "./pages/admin/CreateProduct";
import CreateCategory from "./pages/admin/CreateCategory";
import Categories from "./pages/admin/Categories";
import EditProduct from "./pages/admin/EditProduct";
import Checkout from "./pages/customer/Checkout";
import Orders from "./pages/customer/Orders";
import About from "./pages/customer/About";
import Contact from "./pages/customer/Contact";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { StoreSettingsProvider } from "./context/StoreSettingsContext";

// Guard for Admin Routes
function RequireAdmin({ children }) {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    if (isAuthenticated) {
      return <Navigate to="/products" replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Guard for Customer Routes
function RequireCustomer({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

// Separate component for internal layout so hooks run within Providers
function AppContent() {
  const location = useLocation();
  const hideShell = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      {!hideShell && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer-Only Protected Routes */}
          <Route
            path="/cart"
            element={
              <RequireCustomer>
                <Cart />
              </RequireCustomer>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireCustomer>
                <Checkout />
              </RequireCustomer>
            }
          />
          <Route
            path="/account/orders"
            element={
              <RequireCustomer>
                <Orders />
              </RequireCustomer>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="inventory/new" element={<CreateProduct />} />
            <Route path="inventory/:id/edit" element={<EditProduct />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/new" element={<CreateCategory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="contacts" element={<ContactManager />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideShell && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreSettingsProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </StoreSettingsProvider>
    </AuthProvider>
  );
}