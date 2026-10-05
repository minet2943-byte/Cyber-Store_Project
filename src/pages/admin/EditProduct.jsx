import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  categories as fallbackCategories,
  products as fallbackProducts,
} from "../../data/products.js";
import { getCategories } from "../../service/categoryApi";
import {
  getProductById,
  replaceProductImage,
  updateProduct,
} from "../../service/productApi";
import { Actions, Field, Page } from "./CreateProduct";

export default function EditProduct() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const routeProduct = location.state?.product;
  const [categories, setCategories] = useState(fallbackCategories);
  const [product, setProduct] = useState(
    () =>
      routeProduct ??
      fallbackProducts.find((item) => String(item.id) === String(id)) ??
      null,
  );
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  useEffect(() => {
    if (!form?.productImage) {
      setImagePreviewUrl("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(form.productImage);
    setImagePreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [form?.productImage]);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        const [productResult, categoryResult] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);

        if (!active) return;

        setProduct(
          productResult ||
            routeProduct ||
            fallbackProducts.find((item) => String(item.id) === String(id)) ||
            null,
        );
        setCategories(categoryResult || fallbackCategories);
      } catch (error) {
        console.warn("Edit product fallback data loaded.", error);
        if (active) {
          setProduct(
            routeProduct ??
              fallbackProducts.find((item) => String(item.id) === String(id)) ??
              null,
          );
          setCategories(fallbackCategories);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [id, routeProduct]);

  useEffect(() => {
    if (!product) {
      setForm(null);
      return;
    }

    setForm({
      productName: product.name,
      productDescription:
        product.description ?? product.productDescription ?? "",
      productPrice: String(product.price),
      productSku:
        product.productSku ?? product.sku ?? product.productSKU ?? product.id,
      productImage: null,
      categoryId: String(product.category),
      stock: String(product.stock),
      brand: product.brand ?? "",
      model: product.model ?? "",
      color: product.color ?? "",
      ram: String(
        product.ram ?? getSpecValue(product, "RAM").replace(/\D/g, ""),
      ),
      cpu:
        product.cpu ||
        getSpecValue(product, "CPU") ||
        getSpecValue(product, "Processor"),
      gpu:
        product.gpu ||
        getSpecValue(product, "GPU") ||
        getSpecValue(product, "Graphics Card"),
      specifications:
        product.specifications ??
        [getSpecValue(product, "Storage"), getSpecValue(product, "Display")]
          .filter(Boolean)
          .join(", "),
    });
  }, [product]);

  if (loading)
    return (
      <Page title="Edit product" back="Back to inventory">
        <p className="mt-7 text-sm text-gray-400">Loading product...</p>
      </Page>
    );
  if (!product || !form) return <Navigate to="/admin/inventory" replace />;
  const update = (key) => (event) => {
    setError("");
    setForm((previous) => ({
      ...previous,
      [key]: event.target.value,
    }));
  };
  const handleImageChange = (event) => {
    setError("");
    setForm((previous) => ({
      ...previous,
      productImage: event.target.files?.[0] || null,
    }));
  };
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const category = categories.find(
      (item) => String(item.id) === String(form.categoryId),
    );
    if (!category) return setError("Select a category.");
    if (!form.productName.trim())
      return setError("Product Name is required.");
    if (!form.productSku.trim()) return setError("Product SKU is required.");
    if (!form.productPrice) return setError("Product Price is required.");

    const formData = new FormData();
    formData.append("productName", form.productName.trim());
    formData.append("productDescription", form.productDescription.trim());
    formData.append("productPrice", String(Number(form.productPrice)));
    formData.append("productSku", form.productSku.trim());
    formData.append("categoryId", String(category.id));
    formData.append("stock", String(Number(form.stock) || 0));
    formData.append("brand", form.brand.trim());
    formData.append("model", form.model.trim());
    formData.append("color", form.color.trim());
    formData.append("ram", String(Number(form.ram) || 0));
    formData.append("cpu", form.cpu.trim());
    formData.append("gpu", form.gpu.trim());
    formData.append("specifications", form.specifications.trim());

    try {
      setSaving(true);
      await updateProduct(product.id, formData);
      if (form.productImage) {
        try {
          await replaceProductImage(product.id, form.productImage);
        } catch (imageError) {
          throw new Error(
            `Product was updated, but its image could not be saved: ${imageError.message}`,
          );
        }
      }
      navigate("/admin/inventory");
    } catch (updateError) {
      setError(updateError.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Page title="Edit product" back="Back to inventory">
      <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field
          label="Product Name *"
          placeholder="e.g. ASUS TUF Gaming F15"
          value={form.productName}
          onChange={update("productName")}
          required
        />
        <Field
          label="Product SKU *"
          placeholder="e.g. ASUS-TUF-F15-001"
          value={form.productSku}
          onChange={update("productSku")}
          required
        />
        <label className="text-sm text-gray-300">
          Category *
          <select
            required
            value={form.categoryId}
            onChange={update("categoryId")}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-white focus:border-violet focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.categoryName || category.name}
              </option>
            ))}
          </select>
        </label>
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
        <Field
          label="Stock Quantity"
          type="number"
          min="0"
          step="1"
          placeholder="10"
          value={form.stock}
          onChange={update("stock")}
        />
        <Field
          label="Brand"
          placeholder="e.g. ASUS"
          value={form.brand}
          onChange={update("brand")}
        />
        <Field
          label="Model"
          placeholder="e.g. TUF Gaming F15"
          value={form.model}
          onChange={update("model")}
        />
        <Field
          label="Color"
          placeholder="e.g. Black"
          value={form.color}
          onChange={update("color")}
        />
        <Field
          label="RAM (GB)"
          type="number"
          min="0"
          placeholder="16"
          value={form.ram}
          onChange={update("ram")}
        />
        <Field
          label="CPU"
          placeholder="e.g. Intel Core i7-13620H"
          value={form.cpu}
          onChange={update("cpu")}
        />
        <Field
          label="GPU"
          placeholder="e.g. NVIDIA GeForce RTX 4060"
          value={form.gpu}
          onChange={update("gpu")}
        />
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
          {(imagePreviewUrl || product.imageUrl) && (
            <img
              src={imagePreviewUrl || product.imageUrl}
              alt="Product preview"
              className="mt-3 h-40 w-full rounded-xl object-contain"
            />
          )}
        </div>
        <Field
          label="Description"
          placeholder="High-performance gaming laptop..."
          value={form.productDescription}
          onChange={update("productDescription")}
          className="sm:col-span-2"
        />
        <Field
          label="Specifications"
          placeholder="15.6-inch FHD 144Hz display, 16GB DDR5 RAM, 512GB SSD"
          value={form.specifications}
          onChange={update("specifications")}
          className="sm:col-span-2"
        />
        <Actions
          error={error}
          cancelTo="/admin/inventory"
          loading={saving}
          loadingText="Saving..."
          submitText="Save changes"
        />
      </form>
    </Page>
  );
}

function getSpecValue(product, label) {
  return (
    product.specs?.find(
      (spec) => spec.label?.toLowerCase() === label.toLowerCase(),
    )?.value ?? ""
  );
}
