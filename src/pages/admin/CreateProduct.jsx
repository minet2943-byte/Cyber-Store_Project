import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getCategories } from "../../service/categoryApi";
import {
  createProduct,
  createProductImages,
} from "../../service/productApi";

export default function CreateProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productSku: "",
    productImage: null,

    categoryId: "",
    stock: "",

    brand: "",
    model: "",
    color: "",
    ram: "",
    cpu: "",
    gpu: "",
    specifications: "",
  });

  // ==============================
  // Get Categories
  // ==============================

  const normalizeCategories = (items = []) =>
    items.map((cat, index) => {
      const rawId = cat?.id ?? cat?.categoryId ?? cat?.category?.id;
      const numericId = Number(rawId ?? index + 1);

      return {
        ...cat,
        id: Number.isFinite(numericId) ? numericId : index + 1,
        name:
          cat?.name ??
          cat?.categoryName ??
          cat?.category ??
          `Category ${index + 1}`,
      };
    });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const items = Array.isArray(data) ? data : data?.data || [];
        setCategories(normalizeCategories(items));
      } catch (err) {
        console.error("Failed to fetch categories:", err);

        setError("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!form.productImage) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(form.productImage);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [form.productImage]);

  // ==============================
  // Update Form
  // ==============================

  const update = (key) => (event) => {
    setError("");

    setForm((previous) => ({
      ...previous,
      [key]: event.target.value,
    }));
  };

  // ==============================
  // Image Change
  // ==============================

  const handleImageChange = (event) => {
    setError("");

    const file = event.target.files?.[0] || null;

    setForm((previous) => ({
      ...previous,
      productImage: file,
    }));
  };

  // ==============================
  // Submit
  // ==============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Validation
    if (!form.productName.trim()) {
      setError("Product Name is required.");
      return;
    }

    if (!form.productSku.trim()) {
      setError("Product SKU is required.");
      return;
    }

    if (!form.productPrice) {
      setError("Product Price is required.");
      return;
    }

    const categoryId = Number(form.categoryId);

    if (!form.categoryId || !Number.isFinite(categoryId) || categoryId <= 0) {
      setError("Please select a valid category.");
      return;
    }

    try {
      setLoading(true);

      // ==========================
      // Create FormData
      // ==========================

      const formData = new FormData();

      formData.append("productName", form.productName.trim());

      formData.append("productDescription", form.productDescription.trim());

      formData.append("productPrice", String(Number(form.productPrice)));

      formData.append("productSku", form.productSku.trim());

      formData.append("categoryId", String(categoryId));

      formData.append("stock", String(Number(form.stock) || 0));

      formData.append("brand", form.brand.trim());

      formData.append("model", form.model.trim());

      formData.append("color", form.color.trim());

      formData.append("ram", String(Number(form.ram) || 0));

      formData.append("cpu", form.cpu.trim());

      formData.append("gpu", form.gpu.trim());

      formData.append("specifications", form.specifications.trim());

      // ==========================
      // Debug FormData
      // ==========================

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // ==========================
      // API Request
      // ==========================

      const result = await createProduct(formData);

      if (form.productImage) {
        const createdProduct =
          result?.data?.data ?? result?.data ?? result?.product ?? result;
        const productId =
          createdProduct?.productId ?? createdProduct?.id;

        if (productId == null) {
          throw new Error(
            "Product was created, but its image could not be linked because the API did not return a product ID.",
          );
        }

        try {
          await createProductImages(productId, [form.productImage]);
        } catch (imageError) {
          throw new Error(
            `Product was created, but its image could not be saved: ${imageError.message}`,
          );
        }
      }

      // ==========================
      // Success
      // ==========================

      navigate("/admin/inventory");
    } catch (err) {
      console.error("Create product error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create product.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Create product" back="Back to inventory">
      <form onSubmit={handleSubmit} className="mt-7 grid gap-5 sm:grid-cols-2">
        {/* Product Name */}
        <Field
          label="Product Name *"
          placeholder="e.g. ASUS TUF Gaming F15"
          value={form.productName}
          onChange={update("productName")}
          required
        />

        {/* SKU */}
        <Field
          label="Product SKU *"
          placeholder="e.g. ASUS-TUF-F15-001"
          value={form.productSku}
          onChange={update("productSku")}
          required
        />

        {/* Category */}
        <label className="text-sm text-gray-300">
          Category *
          <select
            required
            value={form.categoryId}
            onChange={update("categoryId")}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-white focus:border-violet focus:outline-none"
          >
            <option value="">Select category</option>

            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.categoryName || cat.name}
              </option>
            ))}
          </select>
        </label>

        {/* Price */}
        <Field
          label="Price (USD) *"
          type="number"
          min="0"
          step="0.01"
          placeholder="1299.99"
          value={form.productPrice}
          onChange={update("productPrice")}
          required
        />

        {/* Stock */}
        <Field
          label="Stock Quantity"
          type="number"
          min="0"
          step="1"
          placeholder="10"
          value={form.stock}
          onChange={update("stock")}
        />

        {/* Brand */}
        <Field
          label="Brand"
          placeholder="e.g. ASUS"
          value={form.brand}
          onChange={update("brand")}
        />

        {/* Model */}
        <Field
          label="Model"
          placeholder="e.g. TUF Gaming F15"
          value={form.model}
          onChange={update("model")}
        />

        {/* Color */}
        <Field
          label="Color"
          placeholder="e.g. Black"
          value={form.color}
          onChange={update("color")}
        />

        {/* RAM */}
        <Field
          label="RAM (GB)"
          type="number"
          min="0"
          placeholder="16"
          value={form.ram}
          onChange={update("ram")}
        />

        {/* CPU */}
        <Field
          label="CPU"
          placeholder="e.g. Intel Core i7-13620H"
          value={form.cpu}
          onChange={update("cpu")}
        />

        {/* GPU */}
        <Field
          label="GPU"
          placeholder="e.g. NVIDIA GeForce RTX 4060"
          value={form.gpu}
          onChange={update("gpu")}
        />

        {/* Image */}
        <div className="sm:col-span-2">
          <label className="text-sm text-gray-300">Product Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 block w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-violet file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black"
          />

          {form.productImage && (
            <p className="mt-2 text-sm text-gray-400">
              Selected: {form.productImage.name}
            </p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Selected product preview"
              className="mt-3 h-40 w-full rounded-xl object-contain"
            />
          )}
        </div>

        {/* Description */}
        <Field
          label="Description"
          placeholder="High-performance gaming laptop..."
          value={form.productDescription}
          onChange={update("productDescription")}
          className="sm:col-span-2"
        />

        {/* Specifications */}
        <Field
          label="Specifications"
          placeholder="15.6-inch FHD 144Hz display, 16GB DDR5 RAM, 512GB SSD"
          value={form.specifications}
          onChange={update("specifications")}
          className="sm:col-span-2"
        />

        {/* Actions */}
        <Actions
          error={error}
          cancelTo="/admin/inventory"
          loading={loading}
          submitText="Create Product"
        />
      </form>
    </Page>
  );
}

export function ImagePicker({
  imageUrl,
  images = [],
  onThumbnailChange,
  onGalleryChange,
}) {
  return (
    <div className="sm:col-span-2 space-y-4">
      <div>
        <label className="text-sm text-gray-300">Featured image</label>
        <input
          type="file"
          accept="image/*"
          onChange={onThumbnailChange}
          className="mt-2 block w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-violet file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black"
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Featured product preview"
            className="mt-3 h-32 w-full rounded-xl object-cover"
          />
        )}
      </div>

      <div>
        <label className="text-sm text-gray-300">Gallery images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onGalleryChange}
          className="mt-2 block w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-violet file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black"
        />
        {images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {images.map((img, index) => (
              <img
                key={`${img}-${index}`}
                src={img}
                alt={`Gallery preview ${index + 1}`}
                className="h-16 w-16 rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Page Component
// ============================================

export function Page({ title, back, children }) {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/admin/inventory"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft size={16} />

        {back}
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

// ============================================
// Field Component
// ============================================

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

// ============================================
// Actions Component
// ============================================

export function Actions({
  error,
  cancelTo,
  submitText = "Create",
  loadingText = "Creating...",
  disabled = false,
  loading = false,
}) {
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
          disabled={disabled || loading}
          className="rounded-xl bg-violet px-4 py-2.5 text-sm font-semibold text-black transition-opacity disabled:opacity-50"
        >
          {loading ? loadingText : submitText}
        </button>
      </div>
    </div>
  );
}
