import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getCartByCustomerId,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  deleteCartItem as apiDeleteCartItem,
  clearCartByCustomerId as apiClearCart,
} from "../service/cart";
import { getProducts } from "../service/productApi";

const CartContext = createContext(null);

// Line item key includes variant so the same product with different
// variants (e.g. size, switches) sits in the cart as separate rows.
function lineKey(productId, variantId) {
  return `${productId}::${variantId ?? "std"}`;
}

const ORDERS_KEY = "cyber-store-orders";

function getUserEmailKey(user) {
  if (!user) return "guest@cyberstore.local";
  return (
    user.email ||
    user.customerEmail ||
    user.username ||
    (user.id ? `customer-${user.id}@cyberstore.local` : "customer@cyberstore.local")
  );
}

function loadOrders(user) {
  if (typeof window === "undefined" || !user) return [];
  const key = getUserEmailKey(user);
  try {
    const orders = JSON.parse(window.localStorage.getItem(ORDERS_KEY)) || {};
    return orders[key] || orders[user?.email] || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // { key, cartId, product, variant, qty }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOrders(loadOrders(user));
  }, [user]);
  const [orders, setOrders] = useState(() => loadOrders(user));

  const customerId = user?.customerId ?? user?.id;

  // Synchronize cart with Spring Boot backend when customer logs in
  useEffect(() => {
    let active = true;

    const syncWithBackend = async () => {
      if (!customerId) return;

      setLoading(true);
      try {
        const [cartResult, catalogResult] = await Promise.allSettled([
          getCartByCustomerId(customerId),
          getProducts(),
        ]);

        if (!active) return;

        if (cartResult.status === "fulfilled" && Array.isArray(cartResult.value)) {
          const productsMap = new Map();
          if (
            catalogResult.status === "fulfilled" &&
            Array.isArray(catalogResult.value)
          ) {
            for (const prod of catalogResult.value) {
              productsMap.set(String(prod.id), prod);
            }
          }

          const resolved = cartResult.value.map((item) => {
            const matchedProduct = productsMap.get(String(item.productId));
            const quantity = Number(item.quantity ?? item.qty ?? 1);
            const unitPrice =
              matchedProduct?.price ??
              (quantity > 0 && item.cartValue
                ? Number((item.cartValue / quantity).toFixed(2))
                : 0);

            return {
              key: item.cartId ? `cart-${item.cartId}` : lineKey(item.productId, null),
              cartId: item.cartId,
              customerId: item.customerId,
              qty: quantity,
              quantity,
              cartValue: item.cartValue,
              variant: null,
              product: {
                id: item.productId,
                name:
                  matchedProduct?.name ||
                  item.productName ||
                  `Product #${item.productId}`,
                price: unitPrice,
                imageUrl: matchedProduct?.imageUrl || "",
                category: matchedProduct?.category,
                stock: matchedProduct?.stock ?? 99,
                ...(matchedProduct || {}),
              },
            };
          });

          setItems(resolved);
        }
      } catch (err) {
        console.warn("Could not synchronize cart with backend API:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    syncWithBackend();

    return () => {
      active = false;
    };
  }, [customerId]);

  const unitPrice = useCallback((item) => {
    if (!item) return 0;
    const base =
      item.product?.price ??
      item.price ??
      (item.cartValue && (item.qty || item.quantity)
        ? item.cartValue / (item.qty || item.quantity)
        : 0);
    const delta = item.variant?.priceDelta ?? 0;
    return Number(base) + Number(delta);
  }, []);

  const removeItem = useCallback(
    async (key) => {
      const targetItem = items.find((i) => i.key === key);
      setItems((prev) => prev.filter((i) => i.key !== key));

      if (targetItem?.cartId) {
        try {
          await apiDeleteCartItem(targetItem.cartId);
        } catch (err) {
          console.warn("Failed to delete cart item via API:", err);
        }
      }
    },
    [items],
  );

  const addToCart = useCallback(
    async (product, qty = 1, variant = null) => {
      const key = lineKey(product.id, variant?.id);
      const price = (product.price ?? 0) + (variant?.priceDelta ?? 0);

      // Optimistic local state update
      setItems((prev) => {
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, qty: i.qty + qty } : i,
          );
        }
        return [...prev, { key, product, variant, qty }];
      });

      // Synchronize to backend if customer is logged in
      if (customerId) {
        try {
          const currentItem = items.find((i) => i.key === key);
          const newQty = (currentItem?.qty ?? 0) + qty;
          const totalValue = Number((price * newQty).toFixed(2));

          if (currentItem?.cartId) {
            await apiUpdateCartItem(currentItem.cartId, {
              customerId,
              productId: product.id,
              quantity: newQty,
              cartValue: totalValue,
            });
          } else {
            const created = await apiAddToCart({
              customerId,
              productId: product.id,
              quantity: qty,
              cartValue: Number((price * qty).toFixed(2)),
            });

            if (created?.cartId) {
              setItems((prev) =>
                prev.map((i) =>
                  i.key === key
                    ? {
                        ...i,
                        cartId: created.cartId,
                        key: `cart-${created.cartId}`,
                      }
                    : i,
                ),
              );
            }
          }
        } catch (err) {
          console.warn("Failed to sync added cart item with API:", err);
        }
      }
    },
    [customerId, items],
  );

  const updateQty = useCallback(
    async (key, qty) => {
      const targetItem = items.find((i) => i.key === key);

      if (qty <= 0) {
        await removeItem(key);
        return;
      }

      setItems((prev) =>
        prev.map((i) => (i.key === key ? { ...i, qty } : i)),
      );

      if (customerId && targetItem?.cartId) {
        try {
          const price = unitPrice(targetItem);
          const totalValue = Number((price * qty).toFixed(2));
          await apiUpdateCartItem(targetItem.cartId, {
            customerId,
            productId: targetItem.product.id,
            quantity: qty,
            cartValue: totalValue,
          });
        } catch (err) {
          console.warn("Failed to update cart quantity with API:", err);
        }
      }
    },
    [customerId, items, removeItem, unitPrice],
  );

  const placeOrder = useCallback(
    (payment = {}) => {
      if (items.length === 0) return null;

      const userEmail = getUserEmailKey(user);
      const userName =
        user?.name ||
        user?.customerName ||
        payment?.shippingAddress?.fullName ||
        "Cyber Customer";

      const orderSubtotal = items.reduce(
        (sum, item) => sum + unitPrice(item) * (item.qty ?? 1),
        0,
      );

      const order = {
        id: `order-${Date.now()}`,
        createdAt: new Date().toISOString(),
        customer: {
          name: userName,
          email: userEmail,
        },
        paymentMethod: payment.paymentMethod || "Visa ending in 4242",
        items: [...items],
        subtotal: orderSubtotal,
        shipping: payment.shipping ?? 0,
        tax: payment.tax ?? 0,
        total: payment.total ?? orderSubtotal,
        shippingAddress: payment.shippingAddress || null,
      };

      setOrders((previousOrders) => {
        const nextOrders = [order, ...previousOrders];
        const storedOrders = JSON.parse(
          window.localStorage.getItem(ORDERS_KEY) || "{}",
        );
        window.localStorage.setItem(
          ORDERS_KEY,
          JSON.stringify({ ...storedOrders, [userEmail]: nextOrders }),
        );
        return nextOrders;
      });

      // Clear backend cart for customer
      if (customerId) {
        apiClearCart(customerId).catch((err) =>
          console.warn("Failed to clear backend cart on placeOrder:", err),
        );
      }

      setItems([]);
      return order;
    },
    [customerId, items, unitPrice, user],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + unitPrice(i) * (i.qty ?? 1), 0),
    [items, unitPrice],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + (i.qty ?? 1), 0),
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
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
