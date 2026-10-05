import { useState } from "react";
import { useStoreSettings } from "../../context/StoreSettingsContext";

export default function Settings() {
  const { settings, updateSettings } = useStoreSettings();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const update = (key) => (event) => {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };
  const chooseBanner = (event) => {
    const file = event.target.files?.[0];
    if (file?.type.startsWith("image/"))
      setForm((current) => ({
        ...current,
        bannerImage: URL.createObjectURL(file),
      }));
  };
  const submit = (event) => {
    event.preventDefault();
    updateSettings(form);
    setSaved(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-teal-soft">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Store branding
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Customize the website name, logo text, and homepage banner.
        </p>
      </div>
      <form
        onSubmit={submit}
        className="rounded-3xl border border-border bg-card p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Website name"
            value={form.siteName}
            onChange={update("siteName")}
            required
          />
          <Field
            label="Logo name"
            value={form.logoName}
            onChange={update("logoName")}
            required
          />
          <Field
            label="Facebook Page URL (Owner)"
            value={form.facebookUrl || ""}
            onChange={update("facebookUrl")}
            placeholder="https://facebook.com/your-page"
          />
          <Field
            label="Telegram Username / Link"
            value={form.telegramUrl || ""}
            onChange={update("telegramUrl")}
            placeholder="https://t.me/yourusername"
          />
          <Field
            label="Banner title"
            value={form.bannerTitle}
            onChange={update("bannerTitle")}
            required
            className="sm:col-span-2"
          />
          <label className="text-sm text-gray-300 sm:col-span-2">
            Banner description
            <textarea
              value={form.bannerDescription}
              onChange={update("bannerDescription")}
              rows="3"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-white focus:border-violet focus:outline-none"
            />
          </label>
          <label className="text-sm text-gray-300 sm:col-span-2">
            Banner image
            <input
              type="file"
              accept="image/*"
              onChange={chooseBanner}
              className="mt-2 block w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-violet file:px-3 file:py-1.5 file:font-semibold file:text-black"
            />
            {form.bannerImage && (
              <img
                src={form.bannerImage}
                alt="Banner preview"
                className="mt-3 h-40 w-full rounded-xl border border-border object-cover"
              />
            )}
          </label>
        </div>
        <div className="mt-6 flex items-center justify-end gap-4">
          {saved && (
            <span className="text-sm text-teal-soft">Settings saved.</span>
          )}
          <button
            type="submit"
            className="rounded-xl bg-violet px-5 py-2.5 text-sm font-semibold text-black"
          >
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, className = "", ...props }) {
  return (
    <label className={`text-sm text-gray-300 ${className}`}>
      {label}
      <input
        className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-white focus:border-violet focus:outline-none"
        {...props}
      />
    </label>
  );
}
