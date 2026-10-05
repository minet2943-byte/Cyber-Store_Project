import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Headphones,
  Globe,
  ExternalLink,
  Power,
  Sparkles,
  Save,
  X,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { useStoreSettings } from "../../context/StoreSettingsContext";

// Brand Icon SVGs
function FacebookIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TelegramIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function DiscordIcon({ size = 18, className = "" }) {
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

const BADGE_COLOR_OPTIONS = [
  { label: "Blue / Facebook", value: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { label: "Cyan / Telegram", value: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  { label: "Green / Online", value: "text-ok border-ok/30 bg-ok/10" },
  { label: "Purple / Accent", value: "text-violet-soft border-violet/30 bg-violet/10" },
  { label: "Teal / Tech", value: "text-teal-soft border-teal/30 bg-teal/10" },
  { label: "Amber / Urgent", value: "text-warn border-warn/30 bg-warn/10" },
  { label: "Neutral Surface", value: "text-gray-400 border-border bg-surface" },
];

const EMPTY_CONTACT = {
  title: "",
  iconType: "facebook",
  description: "",
  contactValue: "",
  linkUrl: "",
  badge: "Official",
  badgeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  actionText: "Connect Now",
  isExternal: true,
  enabled: true,
};

export default function ContactManager() {
  const {
    settings,
    saveContactChannel,
    deleteContactChannel,
    updateOperatingHours,
  } = useStoreSettings();

  const [hoursForm, setHoursForm] = useState(
    settings.operatingHours || {
      liveChatStatus: "24 / 7 / 365",
      liveChatLabel: "Telegram & Messenger Desk",
      liveChatOnline: true,
      benchHours: "Mon - Fri: 07:00 - 20:00 PST",
      benchLabel: "Engineering Bench Desk",
      warehouseHours: "Mon - Sat: 08:00 - 18:00 PST",
      warehouseLabel: "Warehouse & Dispatch Hub",
      responseLatency: "~ 14 Minutes",
      latencyLabel: "Average Response Latency",
    }
  );

  const [hoursSaved, setHoursSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState(EMPTY_CONTACT);

  const contacts = settings.customContacts || [];

  const handleHoursSubmit = (e) => {
    e.preventDefault();
    updateOperatingHours(hoursForm);
    setHoursSaved(true);
    setTimeout(() => setHoursSaved(false), 3000);
  };

  const openCreateModal = () => {
    setEditingContact(null);
    setFormData(EMPTY_CONTACT);
    setModalOpen(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({ ...contact });
    setModalOpen(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    saveContactChannel(formData);
    setModalOpen(false);
    setEditingContact(null);
  };

  const toggleContactEnabled = (contact) => {
    saveContactChannel({ ...contact, enabled: !contact.enabled });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-teal-soft">
            // SUPER ADMIN CONTROL
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Contact Channels & Support Operations
          </h1>
          <p className="mt-2 text-sm text-gray-400 max-w-2xl">
            Create and edit customer contact methods (Facebook, Telegram, Phone, Email) and manage real-time support status and operating hours.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet px-5 py-3 font-semibold text-white shadow-glow transition hover:bg-violet-soft hover:shadow-lg self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Create Contact Channel</span>
        </button>
      </div>

      {/* SECTION 1: Support Status & Operating Hours */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-dim/20 text-teal-soft border border-teal-dim/40">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Support Status & Operating Hours
              </h2>
              <p className="text-xs text-gray-400">
                These values are displayed directly in the Contact page operations panel.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-ok">
            <span className="h-2 w-2 rounded-full bg-ok animate-pulse" />
            LIVE_SYNC
          </div>
        </div>

        <form onSubmit={handleHoursSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Live Chat Status */}
            <div className="rounded-2xl border border-border/60 bg-surface/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs text-gray-300 uppercase">
                  Live Chat / Telegram Desk
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setHoursForm({
                      ...hoursForm,
                      liveChatOnline: !hoursForm.liveChatOnline,
                    })
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition ${
                    hoursForm.liveChatOnline
                      ? "bg-ok/20 text-ok border border-ok/40"
                      : "bg-danger/20 text-danger border border-danger/40"
                  }`}
                >
                  <Power size={11} />
                  {hoursForm.liveChatOnline ? "ONLINE" : "OFFLINE"}
                </button>
              </div>

              <input
                type="text"
                value={hoursForm.liveChatLabel || ""}
                onChange={(e) =>
                  setHoursForm({ ...hoursForm, liveChatLabel: e.target.value })
                }
                placeholder="Label (e.g. Telegram & Messenger Desk)"
                className="w-full rounded-xl border border-border bg-void px-3.5 py-2 text-xs text-gray-200 focus:border-violet focus:outline-none"
              />

              <input
                type="text"
                value={hoursForm.liveChatStatus || ""}
                onChange={(e) =>
                  setHoursForm({ ...hoursForm, liveChatStatus: e.target.value })
                }
                placeholder="Status / Hours (e.g. 24 / 7 / 365)"
                className="w-full rounded-xl border border-border bg-void px-3.5 py-2 text-xs text-teal-soft font-semibold focus:border-violet focus:outline-none"
              />
            </div>

            {/* Engineering Bench Hours */}
            <div className="rounded-2xl border border-border/60 bg-surface/50 p-4 space-y-3">
              <label className="block font-mono text-xs text-gray-300 uppercase">
                Engineering Desk Hours
              </label>

              <input
                type="text"
                value={hoursForm.benchLabel || ""}
                onChange={(e) =>
                  setHoursForm({ ...hoursForm, benchLabel: e.target.value })
                }
                placeholder="Label (e.g. Engineering Bench Desk)"
                className="w-full rounded-xl border border-border bg-void px-3.5 py-2 text-xs text-gray-200 focus:border-violet focus:outline-none"
              />

              <input
                type="text"
                value={hoursForm.benchHours || ""}
                onChange={(e) =>
                  setHoursForm({ ...hoursForm, benchHours: e.target.value })
                }
                placeholder="Hours (e.g. Mon - Fri: 07:00 - 20:00 PST)"
                className="w-full rounded-xl border border-border bg-void px-3.5 py-2 text-xs text-gray-200 focus:border-violet focus:outline-none"
              />
            </div>

            {/* Warehouse Dispatch Hours */}
            <div className="rounded-2xl border border-border/60 bg-surface/50 p-4 space-y-3">
              <label className="block font-mono text-xs text-gray-300 uppercase">
                Warehouse & Dispatch Hours
              </label>

              <input
                type="text"
                value={hoursForm.warehouseLabel || ""}
                onChange={(e) =>
                  setHoursForm({
                    ...hoursForm,
                    warehouseLabel: e.target.value,
                  })
                }
                placeholder="Label (e.g. Warehouse & Dispatch Hub)"
                className="w-full rounded-xl border border-border bg-void px-3.5 py-2 text-xs text-gray-200 focus:border-violet focus:outline-none"
              />

              <input
                type="text"
                value={hoursForm.warehouseHours || ""}
                onChange={(e) =>
                  setHoursForm({
                    ...hoursForm,
                    warehouseHours: e.target.value,
                  })
                }
                placeholder="Hours (e.g. Mon - Sat: 08:00 - 18:00 PST)"
                className="w-full rounded-xl border border-border bg-void px-3.5 py-2 text-xs text-gray-200 focus:border-violet focus:outline-none"
              />
            </div>

            {/* Response Latency */}
            <div className="rounded-2xl border border-border/60 bg-surface/50 p-4 space-y-3">
              <label className="block font-mono text-xs text-gray-300 uppercase">
                Average Response Latency
              </label>

              <input
                type="text"
                value={hoursForm.latencyLabel || ""}
                onChange={(e) =>
                  setHoursForm({ ...hoursForm, latencyLabel: e.target.value })
                }
                placeholder="Label (e.g. Average Response Latency)"
                className="w-full rounded-xl border border-border bg-void px-3.5 py-2 text-xs text-gray-200 focus:border-violet focus:outline-none"
              />

              <input
                type="text"
                value={hoursForm.responseLatency || ""}
                onChange={(e) =>
                  setHoursForm({
                    ...hoursForm,
                    responseLatency: e.target.value,
                  })
                }
                placeholder="Latency (e.g. ~ 14 Minutes)"
                className="w-full rounded-xl border border-border bg-void px-3.5 py-2 text-xs text-teal-soft font-semibold focus:border-violet focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-border/50 pt-5">
            {hoursSaved && (
              <span className="flex items-center gap-1.5 text-xs text-ok font-semibold">
                <CheckCircle2 size={16} />
                Operating hours updated!
              </span>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-2.5 text-xs font-bold text-black hover:bg-teal-soft transition"
            >
              <Save size={15} />
              Save Operating Hours
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: Contact Channels Manager */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-dim/20 text-violet-soft border border-violet-dim/40">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Contact Channels Catalog
              </h2>
              <p className="text-xs text-gray-400">
                {contacts.length} configured channels ({contacts.filter((c) => c.enabled).length} active)
              </p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl border border-violet bg-violet/10 px-4 py-2 text-xs font-semibold text-violet-soft hover:bg-violet hover:text-white transition"
          >
            <Plus size={15} />
            Add New Channel
          </button>
        </div>

        {/* Contact Cards Grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => {
            const IconComponent = ICON_MAP[c.iconType] || Globe;
            return (
              <div
                key={c.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  c.enabled
                    ? "border-border bg-surface/60 hover:border-violet-soft/60"
                    : "border-border/40 bg-void/50 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-void text-violet-soft">
                      <IconComponent size={20} />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${c.badgeColor || "text-gray-400 border-border"}`}>
                        {c.badge || "Channel"}
                      </span>
                      <button
                        onClick={() => toggleContactEnabled(c)}
                        title={c.enabled ? "Disable Channel" : "Enable Channel"}
                        className={`rounded-lg p-1.5 transition ${
                          c.enabled
                            ? "text-ok hover:bg-ok/10"
                            : "text-gray-500 hover:bg-white/5"
                        }`}
                      >
                        <Power size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-white">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                    {c.description}
                  </p>
                </div>

                <div className="mt-4 border-t border-border/50 pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-teal-soft truncate max-w-[170px]">
                      {c.contactValue}
                    </span>
                    {c.linkUrl && (
                      <a
                        href={c.linkUrl}
                        target={c.isExternal ? "_blank" : undefined}
                        rel={c.isExternal ? "noopener noreferrer" : undefined}
                        className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        Test <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-void px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:border-violet-soft"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete channel "${c.title}"?`)) {
                          deleteContactChannel(c.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-void px-3 py-1.5 text-xs text-danger hover:border-danger hover:bg-danger/10"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: Create / Edit Contact Channel */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 rounded-lg p-2 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-dim/20 text-violet-soft border border-violet-dim/40">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingContact ? "Edit Contact Channel" : "Create New Contact Channel"}
                </h3>
                <p className="text-xs text-gray-400">
                  Configure the channel platform, destination URL, and visual badge.
                </p>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Platform Icon */}
                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Platform / Icon *
                  </label>
                  <select
                    value={formData.iconType}
                    onChange={(e) =>
                      setFormData({ ...formData, iconType: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-white focus:border-violet focus:outline-none"
                  >
                    <option value="facebook">Facebook (Owner)</option>
                    <option value="telegram">Telegram (Chat / Channel)</option>
                    <option value="whatsapp">WhatsApp Hotline</option>
                    <option value="discord">Discord Community</option>
                    <option value="headphones">Technical Support (Headphones)</option>
                    <option value="mail">Email Support</option>
                    <option value="phone">Direct Phone Line</option>
                    <option value="map-pin">Physical Address / Lab</option>
                    <option value="globe">Custom Website Link</option>
                  </select>
                </div>

                {/* Badge Color Preset */}
                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Badge Color Theme
                  </label>
                  <select
                    value={formData.badgeColor}
                    onChange={(e) =>
                      setFormData({ ...formData, badgeColor: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-white focus:border-violet focus:outline-none"
                  >
                    {BADGE_COLOR_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                  Channel Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Facebook Page (Owner) or VIP Telegram"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-white placeholder:text-gray-600 focus:border-violet focus:outline-none"
                />
              </div>

              {/* Contact Display Value & Destination Link */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Display Handle / Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactValue}
                    onChange={(e) =>
                      setFormData({ ...formData, contactValue: e.target.value })
                    }
                    placeholder="e.g. facebook.com/owner, t.me/store"
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-white placeholder:text-gray-600 focus:border-violet focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Target Link / URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.linkUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkUrl: e.target.value })
                    }
                    placeholder="https://... or mailto:... or tel:..."
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-white placeholder:text-gray-600 focus:border-violet focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of what this contact channel is for..."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-white placeholder:text-gray-600 focus:border-violet focus:outline-none resize-none"
                />
              </div>

              {/* Badge Text & Button Text */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData({ ...formData, badge: e.target.value })
                    }
                    placeholder="e.g. Official Page, 24/7, Instant Chat"
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-white placeholder:text-gray-600 focus:border-violet focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-gray-300 uppercase mb-1">
                    Action Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.actionText}
                    onChange={(e) =>
                      setFormData({ ...formData, actionText: e.target.value })
                    }
                    placeholder="e.g. Visit Facebook Page, Open Chat"
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-white placeholder:text-gray-600 focus:border-violet focus:outline-none"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isExternal}
                    onChange={(e) =>
                      setFormData({ ...formData, isExternal: e.target.checked })
                    }
                    className="rounded border-border text-violet focus:ring-0"
                  />
                  <span>Open in New Tab (External Link)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) =>
                      setFormData({ ...formData, enabled: e.target.checked })
                    }
                    className="rounded border-border text-ok focus:ring-0"
                  />
                  <span className="text-ok font-semibold">Active & Visible</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet px-5 py-2 text-xs font-semibold text-white hover:bg-violet-soft transition"
                >
                  {editingContact ? "Save Changes" : "Create Channel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
