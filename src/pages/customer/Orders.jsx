import { Link } from "react-router-dom";
import { ArrowRight, Package, CreditCard, CheckCircle2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Button from "../../components/Button";

export default function Orders() {
  const { orders } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal-soft">
          Account
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Order History
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-400">
          Track and review your recent hardware purchases.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-gray-500">
            <Package size={28} />
          </div>
          <h2 className="mt-4 font-mono text-lg font-semibold text-white">
            No orders found
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            You have not placed any orders yet.
          </p>
          <Button as={Link} to="/products" className="mt-6">
            Browse catalog <ArrowRight size={16} />
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <section
              key={order.id}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl transition-colors hover:border-border/80"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-mono text-base font-bold text-white">
                      Order #{order.id.replace("order-", "")}
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-ok/10 border border-ok/30 px-2.5 py-0.5 text-[11px] font-medium text-ok">
                      <CheckCircle2 size={12} /> Confirmed
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-bold text-teal-soft">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {order.paymentMethod || "Paid via QR Code"}
                  </p>
                </div>
              </div>

              {/* Items in order */}
              <div className="mt-4 space-y-3 divide-y divide-border/40">
                {order.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 pt-3 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt=""
                          className="h-10 w-10 rounded-lg border border-border object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-white">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Qty: {item.qty}{" "}
                          {item.variant ? `• ${item.variant.name}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-gray-200">
                      $
                      {(
                        (item.product.price + (item.variant?.priceDelta ?? 0)) *
                        item.qty
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Payment & Shipping summary tag */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-violet-soft" />
                  <span>
                    Payment: <strong className="text-gray-200">{order.paymentMethod}</strong>
                  </span>
                </div>
                <div>
                  Recipient: <strong className="text-gray-200">{order.customer?.name || order.customer?.email}</strong>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
