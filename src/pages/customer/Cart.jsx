import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import ProductThumb from "../../components/ProductThumb";
import Button from "../../components/Button";
import { useCart } from "../../context/CartContext";

const SHIPPING_FLAT = 12;
const TAX_RATE = 0.08;

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, unitPrice, loading } =
    useCart();

  if (loading && items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <Loader2 size={36} className="animate-spin text-teal-soft" />
        <p className="mt-4 font-mono text-sm text-gray-400">
          Loading your cart...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <ShoppingCart size={40} className="text-gray-600" />
        <h1 className="mt-4 font-mono text-xl font-semibold text-white">
          Your cart is empty
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Add something from the catalog to see it here.
        </p>
        <Button as={Link} to="/products" className="mt-6">
          Browse products <ArrowRight size={16} />
        </Button>
      </div>
    );
  }

  const shipping = SHIPPING_FLAT;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-2xl font-bold text-white">Your Cart</h1>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Loader2 size={14} className="animate-spin text-teal-soft" />
            <span>Syncing...</span>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {items.map((item) => {
            const productId = item.product?.id ?? item.productId;
            const productName =
              item.product?.name ?? item.productName ?? `Product #${productId}`;
            const itemPrice = unitPrice(item);
            const lineTotal = itemPrice * (item.qty ?? 1);

            return (
              <div
                key={item.key}
                className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-violet-dim/50"
              >
                <ProductThumb
                  id={productId}
                  imageUrl={item.product?.imageUrl}
                  className="h-20 w-20 shrink-0"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${productId}`}
                        className="font-mono text-sm font-medium text-white hover:text-teal-soft"
                      >
                        {productName}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-gray-500">
                          {item.variant.name}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.key)}
                      className="rounded-lg p-1.5 text-gray-500 hover:text-danger"
                      aria-label={`Remove ${productName} from cart`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-border">
                      <button
                        onClick={() => updateQty(item.key, (item.qty ?? 1) - 1)}
                        className="p-2 text-gray-400 hover:text-white"
                        aria-label={`Decrease quantity of ${productName}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        className="w-7 text-center text-sm text-white"
                        aria-live="polite"
                      >
                        {item.qty ?? 1}
                      </span>
                      <button
                        onClick={() => updateQty(item.key, (item.qty ?? 1) + 1)}
                        className="p-2 text-gray-400 hover:text-white"
                        aria-label={`Increase quantity of ${productName}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-semibold text-white">
                      ${lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-xl border border-border bg-card p-6">
          <h2 className="font-mono text-sm uppercase tracking-wider text-gray-500">
            Order summary
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-400">Subtotal</dt>
              <dd className="text-gray-200">${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Shipping</dt>
              <dd className="text-gray-200">${shipping.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Tax</dt>
              <dd className="text-gray-200">${tax.toFixed(2)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="font-mono font-semibold text-white">Total</span>
            <span className="font-mono text-lg font-bold text-white">
              ${total.toFixed(2)}
            </span>
          </div>
          <Button className="mt-6 w-full" size="lg" as={Link} to="/checkout">
            Checkout <ArrowRight size={16} />
          </Button>
        </aside>
      </div>
    </div>
  );
}
