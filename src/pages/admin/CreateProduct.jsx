import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { categories, products } from "../../data/products";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    cpu: "",
    ram: "",
    storage: "",
    display: "",
    imageUrl: "",
    images: [],
  });
  const [error, setError] = useState("");
  const update = (key) => (event) =>
    setForm({ ...form, [key]: event.target.value });
  const chooseThumbnail = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setError("Choose an image file.");
    setError("");
    setForm({ ...form, imageUrl: URL.createObjectURL(file) });
  };
  const chooseGallery = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.some((file) => !file.type.startsWith("image/")))
      return setError("Choose image files only.");
    setError("");
    setForm({
      ...form,
      images: files.map((file) => URL.createObjectURL(file)),
    });
  };
  const submit = (event) => {
    event.preventDefault();
    const id = form.id.trim();
    if (products.some((product) => product.id === id))
      return setError("SKU must be unique.");
    const category = categories.find((item) => item.id === form.category);
    if (!category) return setError("Select a category.");
    const imageUrl = form.imageUrl.trim();
    products.push({
      id,
      name: form.name.trim(),
      category: category.id,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl,
      images: form.images,
      rating: 0,
      reviewCount: 0,
      tag: null,
      description: `${form.name.trim()} from ${category.name}.`,
      specs: [
        { label: "CPU", value: form.cpu.trim() },
        { label: "RAM", value: form.ram.trim() },
        { label: "Storage", value: form.storage.trim() },
        { label: "Display", value: form.display.trim() },
      ],
      variants: [{ id: "standard", name: "Standard", priceDelta: 0 }],
    });
    navigate("/admin/inventory");
  };
  return (
    <Page title="Create product" back="Back to inventory">
      <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field
          label="Product title"
          value={form.name}
          onChange={update("name")}
          required
        />
        <Field
          label="SKU / Product ID"
          value={form.id}
          onChange={update("id")}
          required
        />
        <label className="text-sm text-gray-300">
          Category
          <select
            required
            value={form.category}
            onChange={update("category")}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-white focus:border-violet focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.id} — {category.name}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Price (USD)"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={update("price")}
          required
        />
        <Field
          label="Stock quantity"
          type="number"
          min="0"
          step="1"
          value={form.stock}
          onChange={update("stock")}
          required
        />
        <Field label="CPU" value={form.cpu} onChange={update("cpu")} required />
        <Field label="RAM" value={form.ram} onChange={update("ram")} required />
        <Field
          label="Storage"
          value={form.storage}
          onChange={update("storage")}
          required
        />
        <Field
          label="Display"
          value={form.display}
          onChange={update("display")}
          required
        />
        <ImagePicker
          imageUrl={form.imageUrl}
          images={form.images}
          onThumbnailChange={chooseThumbnail}
          onGalleryChange={chooseGallery}
        />
        <Actions error={error} cancelTo="/admin/inventory" />
      </form>
    </Page>
  );
}

export function Page({ title, back, children }) {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/admin/inventory"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft size={16} /> {back}
      </Link>
      <div className="mt-5 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-teal-soft">
          Inventory
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
        {children}
      </div>
    </div>
  );
}
export function Field({ label, className = "", ...props }) {
  return (
    <label className={`text-sm text-gray-300 ${className}`}>
      {label}
      <input
        className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-white placeholder:text-gray-500 focus:border-violet focus:outline-none"
        {...props}
      />
    </label>
  );
}
export function Actions({ error, cancelTo }) {
  return (
    <div className="sm:col-span-2">
      <p className="min-h-5 text-sm text-danger">{error}</p>
      <div className="mt-3 flex justify-end gap-3">
        <Link
          to={cancelTo}
          className="rounded-xl border border-border px-4 py-2.5 text-sm text-gray-300 hover:text-white"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-xl bg-violet px-4 py-2.5 text-sm font-semibold text-black"
        >
          Create
        </button>
      </div>
    </div>
  );
}
export function ImagePicker({
  imageUrl,
  images = [],
  onThumbnailChange,
  onGalleryChange,
}) {
  return (
    <div className="sm:col-span-2 grid gap-5 sm:grid-cols-2">
      <label className="text-sm text-gray-300">
        Thumbnail image{" "}
        <input
          type="file"
          accept="image/*"
          onChange={onThumbnailChange}
          className="mt-2 block w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-violet file:px-3 file:py-1.5 file:font-semibold file:text-black"
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Selected thumbnail preview"
            className="mt-3 h-32 w-32 rounded-xl border border-border object-cover"
          />
        )}
      </label>
      <label className="text-sm text-gray-300">
        Gallery images{" "}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onGalleryChange}
          className="mt-2 block w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-violet file:px-3 file:py-1.5 file:font-semibold file:text-black"
        />
        {images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {images.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`Gallery preview ${index + 1}`}
                className="h-20 w-20 rounded-lg border border-border object-cover"
              />
            ))}
          </div>
        )}
      </label>
    </div>
  );
}
