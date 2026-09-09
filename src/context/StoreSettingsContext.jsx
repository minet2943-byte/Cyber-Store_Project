import { createContext, useContext, useState } from "react";

const StoreSettingsContext = createContext(null);
const STORAGE_KEY = "cyber-store-settings";

const DEFAULT_SETTINGS = {
  siteName: "CYBER-STORE",
  logoName: "CYBER-STORE",
  bannerTitle: "Next-Gen Performance Architecture.",
  bannerDescription:
    "Engineered for absolute precision. The new Series X delivers unprecedented computing power in a sleek, minimalist form factor.",
  bannerImage:
    "https://i.pinimg.com/1200x/32/a5/9f/32a59f7c039ef9f4b68d57d2088b8b5d.jpg",
};

function loadSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}"),
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

  return (
    <StoreSettingsContext.Provider value={{ settings, updateSettings }}>
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
