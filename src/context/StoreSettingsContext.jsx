import { createContext, useContext, useState } from "react";

const StoreSettingsContext = createContext(null);
const STORAGE_KEY = "cyber-store-settings";

export const DEFAULT_CONTACTS = [
  {
    id: "fb-1",
    iconType: "facebook",
    title: "Facebook Page (Owner)",
    description: "Direct owner channel, official announcements, project updates & Messenger support.",
    contactValue: "facebook.com/cyberstore",
    linkUrl: "https://www.facebook.com",
    badge: "Official Page",
    badgeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    actionText: "Visit Facebook Page",
    isExternal: true,
    enabled: true,
  },
  {
    id: "tg-1",
    iconType: "telegram",
    title: "Telegram Channel & Chat",
    description: "Fast 1-on-1 direct messaging, stock drops, urgent requests & community desk.",
    contactValue: "t.me/cyberstore_official",
    linkUrl: "https://t.me",
    badge: "Instant Chat",
    badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    actionText: "Open Telegram Chat",
    isExternal: true,
    enabled: true,
  },
  {
    id: "sup-1",
    iconType: "headphones",
    title: "Technical Support",
    description: "Assistance with hardware diagnostics, component compatibility, drivers, and warranties.",
    contactValue: "support@cyberstore.tech",
    linkUrl: "mailto:support@cyberstore.tech",
    badge: "24/7 Realtime",
    badgeColor: "text-ok border-ok/30 bg-ok/10",
    actionText: "Send Support Email",
    isExternal: false,
    enabled: true,
  },
  {
    id: "sal-1",
    iconType: "mail",
    title: "Sales & Custom Rigs",
    description: "Consultation for enterprise workstations, bulk silicon purchases, and custom cooling loops.",
    contactValue: "sales@cyberstore.tech",
    linkUrl: "mailto:sales@cyberstore.tech",
    badge: "< 2hr Response",
    badgeColor: "text-violet-soft border-violet/30 bg-violet/10",
    actionText: "Contact Sales Team",
    isExternal: false,
    enabled: true,
  },
  {
    id: "ph-1",
    iconType: "phone",
    title: "Direct Voice Line",
    description: "Direct priority phone support for verified orders, live inquiries, and immediate hotline.",
    contactValue: "+1 (800) 555-CYBER",
    linkUrl: "tel:+18005552923",
    badge: "Mon-Sat 8AM-8PM PST",
    badgeColor: "text-teal-soft border-teal/30 bg-teal/10",
    actionText: "Call Voice Hotline",
    isExternal: false,
    enabled: true,
  },
  {
    id: "loc-1",
    iconType: "map-pin",
    title: "Global Hardware Lab",
    description: "Cyber-Store Engineering Hub, Testing Benchmark Chamber & Silicon Validation Facility.",
    contactValue: "404 Silicon Ave, Cyber District, CA",
    linkUrl: "#lab-location",
    badge: "Silicon District",
    badgeColor: "text-gray-400 border-border bg-surface",
    actionText: "View Facility Info",
    isExternal: false,
    enabled: true,
  },
];

export const DEFAULT_OPERATING_HOURS = {
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

const DEFAULT_SETTINGS = {
  siteName: "CYBER-STORE",
  logoName: "CYBER-STORE",
  bannerTitle: "Next-Gen Performance Architecture.",
  bannerDescription:
    "Engineered for absolute precision. The new Series X delivers unprecedented computing power in a sleek, minimalist form factor.",
  bannerImage:
    "https://i.pinimg.com/1200x/32/a5/9f/32a59f7c039ef9f4b68d57d2088b8b5d.jpg",
  facebookUrl: "https://www.facebook.com",
  telegramUrl: "https://t.me",
  phoneNumber: "+1 (800) 555-CYBER",
  supportEmail: "support@cyberstore.tech",
  salesEmail: "sales@cyberstore.tech",
  operatingHours: DEFAULT_OPERATING_HOURS,
  customContacts: DEFAULT_CONTACTS,
};

function loadSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      ...DEFAULT_SETTINGS,
      ...raw,
      operatingHours: {
        ...DEFAULT_OPERATING_HOURS,
        ...(raw.operatingHours || {}),
      },
      customContacts: Array.isArray(raw.customContacts) && raw.customContacts.length > 0
        ? raw.customContacts
        : DEFAULT_CONTACTS,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function StoreSettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  const updateSettings = (nextSettings) => {
    setSettings((current) => {
      const next = { ...current, ...nextSettings };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Dedicated helper to add or update a contact channel
  const saveContactChannel = (contact) => {
    setSettings((current) => {
      const existing = current.customContacts || DEFAULT_CONTACTS;
      let updated;
      if (contact.id && existing.some((c) => c.id === contact.id)) {
        updated = existing.map((c) => (c.id === contact.id ? { ...c, ...contact } : c));
      } else {
        const newContact = {
          ...contact,
          id: contact.id || `contact-${Date.now()}`,
          enabled: contact.enabled !== undefined ? contact.enabled : true,
        };
        updated = [newContact, ...existing];
      }

      const next = { ...current, customContacts: updated };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Dedicated helper to delete a contact channel
  const deleteContactChannel = (id) => {
    setSettings((current) => {
      const updated = (current.customContacts || []).filter((c) => c.id !== id);
      const next = { ...current, customContacts: updated };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Dedicated helper to update operating hours
  const updateOperatingHours = (nextHours) => {
    setSettings((current) => {
      const updated = {
        ...current.operatingHours,
        ...nextHours,
      };
      const next = { ...current, operatingHours: updated };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        saveContactChannel,
        deleteContactChannel,
        updateOperatingHours,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context)
    throw new Error(
      "useStoreSettings must be used within StoreSettingsProvider",
    );
  return context;
}
