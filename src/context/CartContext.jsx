import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";

const CartContext = createContext(null);

// Line item key includes variant so the same product with different
// variants (e.g. size, switches) sits in the cart as separate rows.
function lineKey(productId, variantId) {
  return `${productId}::${variantId ?? "std"}`;
}

const ORDERS_KEY = "cyber-store-orders";

function loadOrders(email) {
  if (typeof window === "undefined" || !email) return [];
  try {
    const orders = JSON.parse(window.localStorage.getItem(ORDERS_KEY)) || {};
    return orders[email] || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // { key, product, variant, qty }

  useEffect(() => {
    setOrders(loadOrders(user?.email));
  }, [user?.email]);
  const [orders, setOrders] = useState(() => loadOrders(user?.email));

  const addToCart = useCallback((product, qty = 1, variant = null) => {
    setItems((prev) => {
      const key = lineKey(product.id, variant?.id);
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { key, product, variant, qty }];
    });
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const placeOrder = useCallback(
    (payment = {}) => {
      if (!user?.email || items.length === 0) return null;

      const subtotal = items.reduce(
        (sum, item) =>
          sum +
          (item.product.price + (item.variant?.priceDelta ?? 0)) * item.qty,
        0,
      );
      const order = {
        id: `order-${Date.now()}`,
        createdAt: new Date().toISOString(),
        customer: {
          name: user.name || user.email,
          email: user.email,
        },
        paymentMethod: payment.paymentMethod || "Visa ending in 4242",
        items,
        subtotal,
        shipping: payment.shipping ?? 0,
        tax: payment.tax ?? 0,
        total: payment.total ?? subtotal,
      };

      setOrders((previousOrders) => {
        const nextOrders = [order, ...previousOrders];
        const storedOrders = JSON.parse(
          window.localStorage.getItem(ORDERS_KEY) || "{}",
        );
        window.localStorage.setItem(
          ORDERS_KEY,
          JSON.stringify({ ...storedOrders, [user.email]: nextOrders }),
        );
        return nextOrders;
      });
      setItems([]);
      return order;
    },
    [items, user?.email, user?.name],
  );

  const unitPrice = (item) =>
    item.product.price + (item.variant?.priceDelta ?? 0);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + unitPrice(i) * i.qty, 0),
    [items],
  );
  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  const value = {
    items,
    addToCart,
    updateQty,
    removeItem,
    placeOrder,
    orders,
    subtotal,
    itemCount,
    unitPrice,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
