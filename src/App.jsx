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
import CreateProduct from "./pages/admin/CreateProduct";
import CreateCategory from "./pages/admin/CreateCategory";
import EditProduct from "./pages/admin/EditProduct";
import Checkout from "./pages/customer/Checkout";
import Orders from "./pages/customer/Orders";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { StoreSettingsProvider } from "./context/StoreSettingsContext";

function RequireAdmin({ children }) {
  const { isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    if (isAuthenticated) {
      return <Navigate to="/products" replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function RequireCustomer({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const hideShell = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <StoreSettingsProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            {!hideShell && <Navbar />}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductListing />} />
                <Route path="/product/:id" element={<ProductDetail />} />
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
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
                  <Route path="categories/new" element={<CreateCategory />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </main>
            {!hideShell && <Footer />}
          </div>
        </CartProvider>
      </StoreSettingsProvider>
    </AuthProvider>
  );
}
