import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory, getCategories } from "../../service/categoryApi";
import { Actions, Field, Page } from "./CreateProduct";

export default function CreateCategory() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    categoryName: "",
    categoryTitle: "",
    status: "ACTIVE",
    stock: 0,
    categoryType: "",
    id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (!active) return;
        setCategories(data || []);
      } catch (err) {
        console.warn(
          "Could not load categories for duplicate validation.",
          err,
        );
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const update = (key) => (event) => {
    setError("");
    const value =
      event.target.type === "number"
        ? Number(event.target.value)
        : event.target.value;
    setForm({ ...form, [key]: value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    const categoryName = form.categoryName.trim();
    if (!categoryName) {
      return setError("Category Name is required.");
    }

    if (
      categories.some(
        (c) =>
          c.name?.toLowerCase() === categoryName.toLowerCase() ||
          c.categoryName?.toLowerCase() === categoryName.toLowerCase(),
      )
    ) {
      return setError("A category with this name already exists.");
    }

    try {
      setLoading(true);

      const payload = {
        categoryName,
        categoryTitle: form.categoryTitle.trim(),
        status: form.status || "ACTIVE",
        stock: Number(form.stock) || 0,
        categoryType: form.categoryType.trim(),
      };

      // Only include id in the payload if explicit user input exists;
      // otherwise, let backend database auto-generate primary key
      if (form.id?.trim()) {
        payload.id = form.id.trim();
      }

      await createCategory(payload);
      navigate("/admin/categories");
    } catch (err) {
      setError(err.message || "Failed to create category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Create category" back="Back to inventory">
      <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field
          label="Category Name *"
          placeholder="e.g. Gaming Laptops"
          value={form.categoryName}
          onChange={update("categoryName")}
          required
        />

        <Field
          label="Category Title / Tagline"
          placeholder="e.g. Next-Gen Performance & Peripherals"
          value={form.categoryTitle}
          onChange={update("categoryTitle")}
        />

        <label className="text-sm text-gray-300">
          Status *
          <select
            value={form.status}
            onChange={update("status")}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-white focus:border-violet focus:outline-none"
            required
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </label>

        <Field
          label="Initial Stock"
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={form.stock}
          onChange={update("stock")}
        />

        <Field
          label="Category Type"
          placeholder="e.g. HARDWARE, ACCESSORY, LAPTOP"
          value={form.categoryType}
          onChange={update("categoryType")}
          className="sm:col-span-2"
        />

        <Actions
          error={error}
          cancelTo="/admin/inventory"
          loading={loading}
          submitText="Create Category"
        />
      </form>
    </Page>
  );
}
