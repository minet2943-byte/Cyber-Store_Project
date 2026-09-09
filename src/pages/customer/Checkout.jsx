import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Button from "../../components/Button";

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, placeOrder } = useCart();
  const navigate = useNavigate();
  const shipping = 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    const order = placeOrder({
      shipping,
      tax,
      total,
      paymentMethod: "Visa ending in 4242",
    });
    if (order) navigate("/account/orders");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-xl shadow-black/10">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-soft">
            Checkout
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">
            Complete your purchase
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {user?.email
              ? `Ordering as ${user.email}`
              : "Sign in to complete your order."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-3xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-white">
              Shipping details
            </h2>
            <div className="mt-5 space-y-4 text-sm text-gray-300">
              <div>
                <p className="font-medium text-white">Delivery address</p>
                <p className="mt-1">123 Nexus Lane</p>
                <p>Cyber City, ST 90210</p>
              </div>
              <div>
                <p className="font-medium text-white">Payment method</p>
                <p className="mt-1">Visa ending in 4242</p>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
              <span>Shipping</span>
              <span>$12.00</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-white">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
            <Button
              type="button"
              onClick={handlePlaceOrder}
              disabled={items.length === 0}
              className="mt-6 w-full"
              size="lg"
            >
              Place order
            </Button>
            {items.length === 0 && (
              <Link
                to="/products"
                className="mt-3 block text-center text-sm text-teal-soft"
              >
                Your cart is empty. Browse products
              </Link>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
