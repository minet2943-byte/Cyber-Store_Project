import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, RotateCcw, Tags, Trash2 } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../service/categoryApi";

const emptyForm = {
  categoryName: "",
  categoryTitle: "",
  status: "ACTIVE",
  stock: "0",
  categoryType: "",
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-white placeholder:text-gray-500 focus:border-violet focus:outline-none";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      setCategories(await getCategories());
    } catch (loadError) {
      setError(loadError.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const editCategory = (category) => {
    setEditingId(category.id);
    setForm({
      categoryName: category.categoryName ?? category.name ?? "",
      categoryTitle:
        category.categoryTitle ?? category.tagline ?? "",
      status: category.status ?? "ACTIVE",
      stock: String(category.stock ?? 0),
      categoryType: category.categoryType ?? "",
    });
    setError("");
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    const categoryName = form.categoryName.trim();
    if (!categoryName) {
      setError("Category name is required.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        String(category.id) !== String(editingId) &&
        (category.name ?? category.categoryName ?? "").toLowerCase() ===
          categoryName.toLowerCase(),
    );
    if (duplicate) {
      setError("A category with this name already exists.");
      return;
    }

    const payload = {
      categoryName,
      categoryTitle: form.categoryTitle.trim(),
      status: form.status,
      stock: Number(form.stock) || 0,
      categoryType: form.categoryType.trim(),
    };

    setSaving(true);
    setError("");
    try {
      if (editingId === null) {
        await createCategory(payload);
      } else {
        await updateCategory(editingId, payload);
      }
      resetForm();
      await loadCategories();
    } catch (saveError) {
      setError(saveError.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (category) => {
    const name = category.name ?? category.categoryName ?? "this category";
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(category.id);
    setError("");
    try {
      await deleteCategory(category.id);
      setCategories((current) =>
        current.filter(
          (item) => String(item.id) !== String(category.id),
        ),
      );
      if (String(editingId) === String(category.id)) resetForm();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-teal-soft">
            Catalog
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Manage categories
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Create, update, and remove product categories.
          </p>
        </div>
        <Link
          to="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-gray-300 hover:border-violet"
        >
          <Plus size={16} /> Open category form
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <section className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-white">
              All categories ({categories.length})
            </h2>
            <button
              type="button"
              onClick={loadCategories}
              disabled={loading}
              aria-label="Reload categories"
              className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              <RotateCcw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-gray-400">Loading categories...</p>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">
              <Tags className="mx-auto text-gray-500" size={28} />
              <p className="mt-3 text-sm text-gray-400">
                No categories found. Create the first one using the form.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-surface/70 text-gray-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-t border-border text-gray-300"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">
                          {category.name ?? category.categoryName}
                        </p>
                        {(category.tagline || category.categoryTitle) && (
                          <p className="mt-1 text-xs text-gray-500">
                            {category.categoryTitle ?? category.tagline}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {category.categoryType || "—"}
                      </td>
                      <td className="px-5 py-4">
                        {category.status || "ACTIVE"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => editCategory(category)}
                            className="inline-flex items-center gap-1 text-teal-soft hover:text-white"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            disabled={deletingId !== null}
                            className="inline-flex items-center gap-1 text-danger hover:text-red-300 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            {deletingId === category.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <form
          onSubmit={saveCategory}
          className="space-y-5 rounded-3xl border border-border bg-card p-6"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-teal-soft">
              {editingId === null ? "New category" : "Edit category"}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {editingId === null ? "Create category" : "Update category"}
            </h2>
          </div>
          <label className="block text-sm text-gray-300">
            Category name *
            <input
              name="categoryName"
              value={form.categoryName}
              onChange={updateField}
              placeholder="e.g. Gaming Laptops"
              className={inputClassName}
              required
            />
          </label>
          <label className="block text-sm text-gray-300">
            Title / tagline
            <input
              name="categoryTitle"
              value={form.categoryTitle}
              onChange={updateField}
              placeholder="e.g. Next-Gen Performance"
              className={inputClassName}
            />
          </label>
          <label className="block text-sm text-gray-300">
            Status
            <select
              name="status"
              value={form.status}
              onChange={updateField}
              className={inputClassName}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
          <label className="block text-sm text-gray-300">
            Initial stock
            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={updateField}
              className={inputClassName}
            />
          </label>
          <label className="block text-sm text-gray-300">
            Category type
            <input
              name="categoryType"
              value={form.categoryType}
              onChange={updateField}
              placeholder="e.g. HARDWARE"
              className={inputClassName}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet px-4 py-2.5 text-sm font-semibold text-black hover:bg-violet-soft disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId === null
                  ? "Create category"
                  : "Save changes"}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-xl border border-border px-4 py-2.5 text-sm text-gray-300 hover:border-violet disabled:opacity-50"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
