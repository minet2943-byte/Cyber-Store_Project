import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Terminal,
  ExternalLink,
  ArrowUpRight,
  Globe,
} from "lucide-react";
import { useStoreSettings } from "../../context/StoreSettingsContext";

// Custom authentic Facebook icon SVG
function FacebookIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// Custom authentic Telegram icon SVG
function TelegramIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function DiscordIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

const ICON_MAP = {
  facebook: FacebookIcon,
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
  discord: DiscordIcon,
  headphones: Headphones,
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
  globe: Globe,
};

const inquiryCategories = [
  "Technical Support & Warranty",
  "Custom Rig Consultation",
  "Order Status & Shipping",
  "Enterprise & Bulk Silicon",
  "General Inquiry",
];

const faqs = [
  {
    q: "How fast do orders ship after placement?",
    a: "In-stock individual silicon components ship within 24 hours. Custom pre-built rigs undergo a 48-hour thermal and stability burn-in test before dispatch.",
  },
  {
    q: "What warranty coverage is included with hardware purchases?",
    a: "All items include the full original manufacturer warranty plus our complimentary 2-year Cyber-Store Replacement Guarantee on verified defects.",
  },
  {
    q: "Do you provide compatibility checks for custom component selections?",
    a: "Yes! Our support team can review your parts list for clearance, socket matching, VRM capability, and power requirements free of charge.",
  },
  {
    q: "What is your return and refund policy?",
    a: "We offer a 30-day return window for unopened hardware and 14-day hassle-free replacement for any component damaged during transit.",
  },
];

export default function Contact() {
  const { settings } = useStoreSettings();
  const storeTitle = settings?.siteName || "CYBER-STORE";

  const facebookUrl = settings?.facebookUrl || "https://facebook.com";
  const telegramUrl = settings?.telegramUrl || "https://t.me";

  const operatingHours = settings?.operatingHours || {
    liveChatStatus: "24 / 7 / 365",
    liveChatLabel: "Telegram & Messenger Desk",
    liveChatOnline: true,
    benchHours: "Mon - Fri: 07:00 - 20:00 PST",
    benchLabel: "Engineering Bench Desk",
    warehouseHours: "Mon - Sat: 08:00 - 18:00 PST",
    warehouseLabel: "Warehouse & Dispatch Hub",
    responseLatency: "~ 14 Minutes",
    latencyLabel: "Average Response Latency",
  };

  const activeContacts = (settings?.customContacts || []).filter(
    (c) => c.enabled !== false
  );

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    category: inquiryCategories[0],
    priority: "Normal",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const ticketId = `CS-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket({
        id: ticketId,
        name: formState.name,
        email: formState.email,
        subject: formState.subject || formState.category,
      });
      setSubmitting(false);
      setFormState({
        name: "",
        email: "",
        category: inquiryCategories[0],
        priority: "Normal",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-void text-gray-200">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-border/40 py-16 sm:py-20">
        <div className="pointer-events-none absolute left-1/4 top-1/3 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-violet-dim/20 blur-[130px]" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-teal-dim/15 blur-[140px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-dim/50 bg-[#0f2427]/80 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-teal-soft shadow-glow-teal">
              <Terminal size={14} className="text-violet-soft" />
              <span>COMMUNICATION MATRIX // CONTACT US</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Connect With Our{" "}
              <span className="bg-gradient-to-r from-teal-soft via-violet-soft to-teal-soft bg-clip-text text-transparent">
                Hardware Specialists
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-400">
              Reach out directly to the owner via Facebook & Telegram, or dispatch a technical ticket to our engineering team.
            </p>

            {/* Quick Instant Chat Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-xl border border-blue-500/40 bg-blue-600/20 px-5 py-2.5 text-sm font-semibold text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-200 hover:bg-blue-600/30 hover:border-blue-400 hover:text-white"
              >
                <FacebookIcon size={18} className="text-blue-400 transition-transform group-hover:scale-110" />
                <span>Facebook Page (Owner)</span>
                <ArrowUpRight size={15} className="text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-xl border border-cyan-500/40 bg-cyan-600/20 px-5 py-2.5 text-sm font-semibold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-200 hover:bg-cyan-600/30 hover:border-cyan-400 hover:text-white"
              >
                <TelegramIcon size={18} className="text-cyan-400 transition-transform group-hover:scale-110" />
                <span>Telegram Chat</span>
                <ArrowUpRight size={15} className="text-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Channels & Form */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-teal-soft">
              // DIRECT CONTACT CHANNELS (CLICK TO CONNECT)
            </h2>
            <span className="font-mono text-[11px] text-gray-500 hidden sm:inline-block">
              {activeContacts.length} CHANNELS ONLINE
            </span>
          </div>

          {/* Quick Channels Grid - Fully Clickable Dynamic Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeContacts.map((c) => {
              const IconComponent = ICON_MAP[c.iconType] || Globe;
              return (
                <a
                  key={c.id || c.title}
                  href={c.linkUrl || "#"}
                  target={c.isExternal ? "_blank" : undefined}
                  rel={c.isExternal ? "noopener noreferrer" : undefined}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300 hover:border-violet-soft/60 hover:shadow-glow hover:-translate-y-0.5 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-violet-soft transition-transform duration-300 group-hover:scale-110">
                        <IconComponent size={22} />
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold ${c.badgeColor || "text-gray-400 border-border bg-surface"}`}>
                        {c.badge || "Channel"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5">
                      <h3 className="text-base font-semibold text-white group-hover:text-violet-soft transition-colors">
                        {c.title}
                      </h3>
                      <ArrowUpRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-gray-400">
                      {c.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-3.5">
                    <span className="font-mono text-xs font-medium text-teal-soft truncate mr-2">
                      {c.contactValue}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 group-hover:text-white transition-colors shrink-0">
                      {c.actionText || "Connect"} →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Form + Sidebar Details */}
          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Form Section */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-white sm:text-2xl">
                      Transmit a Dispatch
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-400">
                      Fill out the form below and an engineer will respond promptly.
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-ok">
                    <span className="h-2 w-2 rounded-full bg-ok animate-pulse" />
                    DISPATCH_READY
                  </div>
                </div>

                {submittedTicket ? (
                  <div className="mt-8 rounded-xl border border-ok/40 bg-ok/10 p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ok/20 text-ok">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">
                      Dispatch Transmitted Successfully!
                    </h3>
                    <p className="mt-2 text-sm text-gray-300">
                      Your inquiry has been logged in our dispatch queue under reference ticket:
                    </p>
                    <div className="mx-auto mt-4 inline-block rounded-lg border border-border bg-surface px-4 py-2 font-mono text-base font-bold text-teal-soft">
                      {submittedTicket.id}
                    </div>
                    <p className="mt-3 text-xs text-gray-400">
                      A confirmation email has been sent to <span className="text-white">{submittedTicket.email}</span>. Expected response time is under 2 hours.
                    </p>

                    <button
                      onClick={() => setSubmittedTicket(null)}
                      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-soft"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block font-mono text-xs text-gray-300 uppercase tracking-wider mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-violet focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-gray-300 uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="alex@domain.com"
                          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-violet focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-gray-300 uppercase tracking-wider mb-2">
                        Inquiry Category *
                      </label>
                      <select
                        value={formState.category}
                        onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-gray-200 focus:border-violet focus:outline-none"
                      >
                        {inquiryCategories.map((cat) => (
                          <option key={cat} value={cat} className="bg-void text-gray-200">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="block font-mono text-xs text-gray-300 uppercase tracking-wider mb-2">
                          Subject Line *
                        </label>
                        <input
                          type="text"
                          required
                          value={formState.subject}
                          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                          placeholder="Brief summary of your request"
                          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-violet focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-gray-300 uppercase tracking-wider mb-2">
                          Priority
                        </label>
                        <select
                          value={formState.priority}
                          onChange={(e) => setFormState({ ...formState, priority: e.target.value })}
                          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-gray-200 focus:border-violet focus:outline-none"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Urgent">Urgent</option>
                          <option value="Emergency Support">Critical (Down Rig)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-gray-300 uppercase tracking-wider mb-2">
                        Message Details *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Provide details such as order number, specific part numbers, or system specifications..."
                        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:border-violet focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet py-3 font-semibold text-white shadow-glow transition hover:bg-violet-soft disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Routing Dispatch...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} className="transition-transform group-hover:translate-x-1" />
                          <span>Transmit Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar Details / Live Operations Panel */}
            <div className="space-y-6 lg:col-span-5">
              {/* Direct Instant Channels Card */}
              <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-surface to-card p-6 shadow-sm">
                <h3 className="flex items-center gap-2 font-mono text-sm font-bold uppercase text-white">
                  <MessageSquare size={16} className="text-teal-soft" />
                  Instant Social Connect
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">
                  Prefer direct messaging over tickets? Talk with the owner or engineering desk on your preferred platform:
                </p>

                <div className="mt-4 space-y-3">
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-blue-500/30 bg-blue-950/30 p-3.5 transition-all hover:border-blue-400 hover:bg-blue-900/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <FacebookIcon size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Facebook Page (Owner)</div>
                        <div className="text-[11px] text-blue-300">Message Page Owner Directly</div>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-blue-400" />
                  </a>

                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-3.5 transition-all hover:border-cyan-400 hover:bg-cyan-900/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500 text-black">
                        <TelegramIcon size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Telegram Channel & PM</div>
                        <div className="text-[11px] text-cyan-300">Live 1-on-1 Chat Assistance</div>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-cyan-400" />
                  </a>
                </div>
              </div>

              {/* Dynamic Operations Status Card (Admin Configured) */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <h3 className="flex items-center gap-2 font-mono text-sm font-bold uppercase text-white">
                    <Clock size={16} className="text-teal-soft" />
                    Support Status & Operating Hours
                  </h3>
                  {operatingHours.liveChatOnline !== false && (
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-ok">
                      <span className="h-2 w-2 rounded-full bg-ok animate-pulse" />
                      ONLINE
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-gray-400">
                      {operatingHours.liveChatLabel || "Telegram & Messenger Desk"}:
                    </span>
                    <span className="text-ok font-semibold">
                      {operatingHours.liveChatStatus || "24 / 7 / 365"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-gray-400">
                      {operatingHours.benchLabel || "Engineering Bench Desk"}:
                    </span>
                    <span className="text-gray-200">
                      {operatingHours.benchHours || "Mon - Fri: 07:00 - 20:00 PST"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-gray-400">
                      {operatingHours.warehouseLabel || "Warehouse & Dispatch Hub"}:
                    </span>
                    <span className="text-gray-200">
                      {operatingHours.warehouseHours || "Mon - Sat: 08:00 - 18:00 PST"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {operatingHours.latencyLabel || "Average Response Latency"}:
                    </span>
                    <span className="text-teal-soft font-bold">
                      {operatingHours.responseLatency || "~ 14 Minutes"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warranty & Guarantee Callout */}
              <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card to-surface p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl border border-border bg-void p-3 text-violet-soft">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">
                      Hardware Guarantee
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">
                      All parts purchased through {storeTitle} are backed by authentic serial tracking and full factory replacement warranty.
                    </p>
                    <Link
                      to="/products"
                      className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-teal-soft hover:underline"
                    >
                      <span>Check catalog inventory</span> →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Direct FAQ preview */}
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                <h3 className="flex items-center gap-2 font-mono text-sm font-bold uppercase text-white">
                  <HelpCircle size={16} className="text-violet-soft" />
                  Quick Answers
                </h3>
                <div className="mt-4 space-y-3">
                  {faqs.map((faq, idx) => (
                    <div
                      key={faq.q}
                      className="rounded-lg border border-border/50 bg-surface/60 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                        className="flex w-full items-center justify-between p-3 text-left text-xs font-semibold text-gray-200 hover:text-white"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={14}
                          className={`shrink-0 transition-transform ${openFaq === idx ? "rotate-180 text-teal-soft" : "text-gray-500"
                            }`}
                        />
                      </button>
                      {openFaq === idx && (
                        <div className="border-t border-border/40 p-3 text-xs leading-relaxed text-gray-400 bg-void/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
