import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { categories, products } from "../../data/products";
import { Actions, Field, ImagePicker, Page } from "./CreateProduct";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === id);
  const [form, setForm] = useState(
    product
      ? {
          id: product.id,
          name: product.name,
          category: product.category,
          price: String(product.price),
          stock: String(product.stock),
          cpu: getSpecValue(product, "CPU"),
          ram: getSpecValue(product, "RAM"),
          storage: getSpecValue(product, "Storage"),
          display: getSpecValue(product, "Display"),
          imageUrl: product.imageUrl || "",
          images: product.images || [],
        }
      : null,
  );
  const [error, setError] = useState("");
  if (!product || !form) return <Navigate to="/admin/inventory" replace />;
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
    const newId = form.id.trim();
    if (products.some((item) => item.id === newId && item !== product))
      return setError("SKU must be unique.");
    const category = categories.find((item) => item.id === form.category);
    if (!category) return setError("Select a category.");
    const imageUrl = form.imageUrl.trim();
    Object.assign(product, {
      id: newId,
      name: form.name.trim(),
      category: category.id,
      price: Number(form.price),
      stock: Number(form.stock),
      specs: [
        { label: "CPU", value: form.cpu.trim() },
        { label: "RAM", value: form.ram.trim() },
        { label: "Storage", value: form.storage.trim() },
        { label: "Display", value: form.display.trim() },
      ],
      imageUrl,
      images: form.images,
    });
    navigate("/admin/inventory");
  };
  return (
    <Page title="Edit product" back="Back to inventory">
      <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field
          label="Product name"
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

function getSpecValue(product, label) {
  return product.specs?.find((spec) => spec.label === label)?.value || "";
}
