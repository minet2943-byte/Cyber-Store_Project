import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  QrCode,
  CreditCard,
  Wallet,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Lock,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Button from "../../components/Button";

const PAYMENT_METHODS = [
  {
    id: "qr",
    name: "QR Code Scan",
    description: "Instant Mobile Banking & PromptPay / KHQR",
    icon: QrCode,
    badge: "Instant",
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex",
    icon: CreditCard,
    badge: "Secure",
  },
  {
    id: "crypto",
    name: "Crypto / USDT",
    description: "Web3 Wallet (TRC20 / ERC20)",
    icon: Wallet,
    badge: "Web3",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay with cash upon delivery",
    icon: Truck,
    badge: "Standard",
  },
];

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, placeOrder, unitPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Payment state
  const [selectedMethod, setSelectedMethod] = useState("qr");
  const [qrVerified, setQrVerified] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  // Address state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "Cyber Customer",
    phone: "+1 (555) 019-2834",
    address: "123 Nexus Boulevard, Suite 404",
    city: "Neo Cyber City",
    zipCode: "90210",
  });

  // Card state
  const [cardInfo, setCardInfo] = useState({
    number: "•••• •••• •••• 4242",
    name: user?.name || "CYBER HOLDER",
    expiry: "12/28",
    cvc: "888",
  });

  const shipping = items.length > 0 ? 12 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const [refNumber] = useState(
    () => "CYBER-" + Math.floor(100000 + Math.random() * 900000)
  );

  // Dynamic QR Code URL
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    `cyberstore://pay?merchant=CYBER_STORE_OFFICIAL&amount=${total.toFixed(
      2
    )}&currency=USD&ref=${refNumber}`
  )}`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // 1. Check if user is authenticated
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
      return;
    }

    if (items.length === 0) return;

    setIsProcessing(true);

    let paymentLabel = "Credit Card (Visa ending in 4242)";
    if (selectedMethod === "qr") {
      paymentLabel = `QR Code (Scan & Pay Ref: ${refNumber})`;
    } else if (selectedMethod === "crypto") {
      paymentLabel = "Crypto USDT (TRC20)";
    } else if (selectedMethod === "cod") {
      paymentLabel = "Cash on Delivery";
    }

    setTimeout(() => {
      const order = placeOrder({
        shipping,
        tax,
        total,
        paymentMethod: paymentLabel,
        shippingAddress: shippingInfo,
      });

      setIsProcessing(false);
      if (order) {
        setSuccessOrder(order);
      }
    }, 800);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-violet-soft">
          <UserCheck size={32} />
        </div>
        <h1 className="mt-4 font-mono text-2xl font-bold text-white">
          Sign In Required
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-400">
          Please log in or create an account to proceed with your payment.
        </p>
        <div className="mt-6 flex w-full flex-col gap-3">
          <Button
            as={Link}
            to="/login"
            state={{ from: location }}
            className="w-full"
          >
            Login to Account
          </Button>
          <Button
            as={Link}
            to="/register"
            state={{ from: location }}
            variant="secondary"
            className="w-full"
          >
            Create New Account
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !successOrder) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-gray-500">
          <Truck size={32} />
        </div>
        <h1 className="mt-4 font-mono text-xl font-semibold text-white">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Add items to your cart before proceeding to checkout.
        </p>
        <Button as={Link} to="/products" className="mt-6">
          Browse products <ArrowRight size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* SUCCESS MODAL ALERT */}
      {successOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-teal-dim/60 bg-[#0d1322] p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(34,211,199,0.2)]">

            {/* Animated Glow Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal/15 text-teal-soft border border-teal-dim shadow-glow-teal animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-widest text-teal-soft">
              Payment Successful
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Order Confirmed!
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              Thank you for your purchase. We have received your order and payment verification.
            </p>

            {/* Receipt Box */}
            <div className="mt-6 rounded-2xl border border-border bg-surface p-4 text-left text-xs sm:text-sm space-y-2.5">
              <div className="flex justify-between items-center text-gray-400">
                <span>Order ID:</span>
                <strong className="font-mono text-white">
                  #{successOrder.id.replace("order-", "")}
                </strong>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Payment Method:</span>
                <span className="font-medium text-violet-soft truncate max-w-[200px]">
                  {successOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Recipient:</span>
                <span className="text-white">
                  {shippingInfo.fullName}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-2.5 text-white">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-mono text-base font-bold text-teal-soft">
                  ${successOrder.total.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                as={Link}
                to="/account/orders"
                className="flex-1"
              >
                View Order History <ArrowRight size={16} />
              </Button>
              <Button
                as={Link}
                to="/products"
                variant="secondary"
                className="flex-1"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal-soft">
          Checkout
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Payment & Shipping
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-400">
          Choose your preferred payment method and complete your order.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Delivery & Payment Methods */}
        <div className="space-y-6 lg:col-span-7">

          {/* Section 1: Shipping Details */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-mono text-base font-semibold text-white">
                1. Delivery Address
              </h2>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Lock size={12} className="text-teal-soft" /> Encrypted
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-300">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.fullName}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-gray-200 focus:border-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.phone}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, phone: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-gray-200 focus:border-violet focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-300">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.address}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, address: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-gray-200 focus:border-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300">City</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.city}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, city: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-gray-200 focus:border-violet focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300">
                  Postal / ZIP Code
                </label>
                <input
                  type="text"
                  required
                  value={shippingInfo.zipCode}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-gray-200 focus:border-violet focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method Selector */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-mono text-base font-semibold text-white border-b border-border pb-4">
              2. Select Payment Method
            </h2>

            {/* Method Cards */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => {
                      setSelectedMethod(method.id);
                      setQrVerified(false);
                    }}
                    className={`relative flex flex-col items-start rounded-xl border p-4 text-left transition-all ${isSelected
                        ? "border-violet bg-violet/10 shadow-glow"
                        : "border-border bg-surface hover:border-border/80 hover:bg-card-hover"
                      }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${isSelected
                            ? "bg-violet text-white"
                            : "bg-void text-gray-400"
                          }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-medium ${isSelected
                            ? "bg-violet/20 text-violet-soft"
                            : "bg-border text-gray-400"
                          }`}
                      >
                        {method.badge}
                      </span>
                    </div>
                    <h3 className="mt-3 font-semibold text-sm text-white">
                      {method.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {method.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* PAYMENT CONTENT 1: QR CODE SCAN */}
            {selectedMethod === "qr" && (
              <div className="mt-6 rounded-xl border border-violet/30 bg-[#0c101d] p-5 sm:p-6 text-center animate-fadeIn">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 border border-teal/30 px-3 py-1 text-xs font-mono text-teal-soft">
                  <Smartphone size={13} /> Scan with Mobile Banking / Payment App
                </div>

                {/* QR Code Presentation Box */}
                <div className="mx-auto mt-5 max-w-xs rounded-2xl border border-white/10 bg-white p-4 shadow-2xl">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white flex items-center justify-center">
                    <img
                      src={qrDataUrl}
                      alt="Payment QR Code"
                      className="h-full w-full object-contain"
                      loading="eager"
                    />
                  </div>
                  <div className="mt-3 border-t border-gray-200 pt-2 text-center">
                    <p className="text-[11px] font-mono font-bold text-gray-800">
                      CYBER STORE OFFICIAL KHQR / PROMPTPAY
                    </p>
                    <p className="text-sm font-bold text-[#7c5cfc]">
                      ${total.toFixed(2)} USD
                    </p>
                  </div>
                </div>

                {/* QR Code Details */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5">
                    <span>Reference:</span>
                    <strong className="font-mono text-white">{refNumber}</strong>
                    <button
                      type="button"
                      onClick={() => handleCopy(refNumber)}
                      className="text-teal-soft hover:text-white"
                      title="Copy Reference"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5">
                    <span>Merchant:</span>
                    <strong className="text-white">CYBER STORE DIRECT</strong>
                  </div>
                </div>

                {/* Scan Confirmation Checkbox */}
                <div className="mt-5 flex items-center justify-center">
                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-gray-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={qrVerified}
                      onChange={(e) => setQrVerified(e.target.checked)}
                      className="h-4 w-4 rounded border-border bg-surface text-violet focus:ring-violet"
                    />
                    <span>I have completed the payment on my mobile app</span>
                  </label>
                </div>
              </div>
            )}

            {/* PAYMENT CONTENT 2: CREDIT / DEBIT CARD */}
            {selectedMethod === "card" && (
              <div className="mt-6 rounded-xl border border-border bg-surface p-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-300">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardInfo.number}
                    onChange={(e) =>
                      setCardInfo({ ...cardInfo, number: e.target.value })
                    }
                    placeholder="4242 •••• •••• 4242"
                    className="mt-1 w-full rounded-lg border border-border bg-void px-3 py-2 text-sm text-gray-200 focus:border-violet focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-300">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={cardInfo.expiry}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, expiry: e.target.value })
                      }
                      placeholder="MM/YY"
                      className="mt-1 w-full rounded-lg border border-border bg-void px-3 py-2 text-sm text-gray-200 focus:border-violet focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-300">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardInfo.cvc}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, cvc: e.target.value })
                      }
                      placeholder="123"
                      className="mt-1 w-full rounded-lg border border-border bg-void px-3 py-2 text-sm text-gray-200 focus:border-violet focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT CONTENT 3: CRYPTO USDT */}
            {selectedMethod === "crypto" && (
              <div className="mt-6 rounded-xl border border-border bg-surface p-5 text-center space-y-3">
                <p className="text-xs text-gray-400">
                  Send exactly <strong className="text-white">${total.toFixed(2)} USDT</strong> to the official TRC-20 wallet:
                </p>
                <div className="flex items-center justify-between rounded-lg border border-border bg-void p-3 text-xs font-mono text-teal-soft">
                  <span className="truncate">TXq84NxsK93kLaQ92pLx981Nmd87AsQp21</span>
                  <button
                    type="button"
                    onClick={() => handleCopy("TXq84NxsK93kLaQ92pLx981Nmd87AsQp21")}
                    className="ml-2 text-gray-400 hover:text-white"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">
                  Network: TRON (TRC20) &bull; Instant 1-block auto confirmation.
                </p>
              </div>
            )}

            {/* PAYMENT CONTENT 4: CASH ON DELIVERY */}
            {selectedMethod === "cod" && (
              <div className="mt-6 rounded-xl border border-border bg-surface p-5">
                <div className="flex items-start gap-3 text-xs text-gray-300">
                  <Truck size={18} className="text-teal-soft shrink-0 mt-0.5" />
                  <p>
                    You will pay <strong className="text-white">${total.toFixed(2)}</strong> in cash when our courier delivers the package to your address. Please prepare the exact amount.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <aside className="sticky top-24 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl">
            <h2 className="font-mono text-sm uppercase tracking-wider text-gray-400 border-b border-border pb-3">
              Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
            </h2>

            {/* Mini Items List */}
            <div className="mt-4 max-h-56 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {items.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={item.product.imageUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover"
                    />
                    <div className="truncate">
                      <p className="font-medium text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Qty: {item.qty} {item.variant ? `• ${item.variant.name}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-gray-200">
                    ${(unitPrice(item) * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-400">
                <dt>Subtotal</dt>
                <dd className="font-mono text-gray-200">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-gray-400">
                <dt>Shipping</dt>
                <dd className="font-mono text-gray-200">${shipping.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-gray-400">
                <dt>Estimated Tax (8%)</dt>
                <dd className="font-mono text-gray-200">${tax.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base text-white">
                <dt className="font-semibold">Grand Total</dt>
                <dd className="font-mono font-bold text-teal-soft">
                  ${total.toFixed(2)}
                </dd>
              </div>
            </dl>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full"
              disabled={isProcessing || (selectedMethod === "qr" && !qrVerified)}
            >
              {isProcessing
                ? "Processing Payment..."
                : selectedMethod === "qr"
                  ? qrVerified
                    ? `Confirm & Pay ($${total.toFixed(2)})`
                    : `Scan QR Code & Check Box to Proceed`
                  : `Place Order ($${total.toFixed(2)})`}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500">
              <ShieldCheck size={14} className="text-teal-soft" />
              <span>256-Bit SSL Bank Grade Security</span>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
