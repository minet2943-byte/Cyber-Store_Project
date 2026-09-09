import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Orders() {
  const { orders } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-teal-soft">
          Account
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">Order history</h1>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-8 text-center">
          <p className="text-gray-400">You have not placed any orders yet.</p>
          <Link to="/products" className="mt-4 inline-block text-teal-soft">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <section
              key={order.id}
              className="rounded-3xl border border-border bg-card p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h2 className="font-semibold text-white">
                    Order #{order.id.replace("order-", "")}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="font-semibold text-teal-soft">
                  ${order.total.toFixed(2)}
                </p>
              </div>
              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-gray-300">
                      {item.product.name} x{item.qty}
                    </span>
                    <span className="text-gray-400">
                      $
                      {(
                        (item.product.price + (item.variant?.priceDelta ?? 0)) *
                        item.qty
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
