import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Plus, Tags } from "lucide-react";
import {
  categories as fallbackCategories,
  products as fallbackProducts,
} from "../../data/products.js";
import ProductThumb from "../../components/ProductThumb";
import {
  deleteProduct as deleteProductRequest,
  getProducts,
} from "../../service/productApi";
import { getCategories } from "../../service/categoryApi";

const normalizeProducts = (items = []) =>
  items.map((product, index) => ({
    ...product,
    id: product?.id ?? product?.productId ?? product?.productID ?? index + 1,
    name: product?.name ?? product?.productName ?? `Product ${index + 1}`,
    category:
      product?.category ?? product?.categoryId ?? product?.category_id ?? "",
    price: Number(product?.price ?? product?.productPrice ?? 0),
    stock: Number(product?.stock ?? product?.productStock ?? 0),
    imageUrl: product?.imageUrl ?? product?.image_url ?? "",
  }));

const normalizeCategories = (items = []) =>
  items.map((category, index) => ({
    ...category,
    id:
      category?.id ??
      category?.categoryId ??
      category?.category_id ??
      index + 1,
    name:
      category?.name ??
      category?.categoryName ??
      category?.category ??
      `Category ${index + 1}`,
  }));

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(normalizeProducts(fallbackProducts));
  const [categories, setCategories] = useState(
    normalizeCategories(fallbackCategories),
  );
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        const loadedProducts = normalizeProducts(
          Array.isArray(productData)
            ? productData
            : productData?.data || fallbackProducts,
        );

        const loadedCategories = normalizeCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData?.data || fallbackCategories,
        );

        if (!active) return;

        setProducts(loadedProducts);
        setCategories(loadedCategories);
      } catch (error) {
        console.warn(
          "Inventory fallback used because backend is offline.",
          error,
        );
        if (active) {
          setProducts(normalizeProducts(fallbackProducts));
          setCategories(normalizeCategories(fallbackCategories));
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingProductId(id);
    setDeleteError("");

    try {
      await deleteProductRequest(id);
      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => String(product.id) !== String(id),
        ),
      );
    } catch (error) {
      setDeleteError(error.message || "Failed to delete product. Please try again.");
    } finally {
      setDeletingProductId(null);
    }
  };

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? products.filter((product) =>
          `${product.name ?? ""} ${product.id ?? ""} ${product.category ?? ""}`
            .toLowerCase()
            .includes(query),
        )
      : products;
  }, [search, products]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-teal-soft">
            Inventory
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Manage products, pricing, and stock levels.
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-gray-300 hover:border-violet">
            <Download size={16} /> Export
          </button>
          <Link
            to="/admin/categories/new"
            className="inline-flex items-center gap-2 rounded-2xl border border-teal/50 bg-teal/10 px-4 py-3 text-sm font-semibold text-teal-soft hover:border-teal"
          >
            <Tags size={16} /> Add Category
          </Link>
          <Link
            to="/admin/inventory/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-violet px-4 py-3 text-sm font-semibold text-black shadow-glow"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            Showing {visibleProducts.length} of {products.length} results
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="search"
            placeholder="Search products"
            className="w-full max-w-xs rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-violet focus:outline-none"
          />
        </div>
        {deleteError && (
          <p role="alert" className="mb-4 text-sm text-danger">
            {deleteError}
          </p>
        )}
        <div className="overflow-x-auto rounded-3xl border border-border bg-void">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="bg-surface/70 text-gray-400">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-border hover:bg-white/5"
                >
                  <td className="px-6 py-4">
                    <ProductThumb
                      id={product.id}
                      imageUrl={product.imageUrl}
                      className="h-12 w-12"
                    />
                  </td>
                  <td className="px-6 py-4 text-white">{product.name}</td>
                  <td className="px-6 py-4 text-gray-300 uppercase">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {categories.find(
                      (item) => String(item.id) === String(product.category),
                    )?.name ?? product.category}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    ${Number(product.price ?? 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.stock === 0 ? "bg-danger/15 text-danger" : product.stock <= 5 ? "bg-amber-500/15 text-amber-300" : "bg-teal-soft/15 text-teal-soft"}`}
                    >
                      {product.stock === 0
                        ? "OUT OF STOCK"
                        : product.stock <= 5
                          ? "LOW STOCK"
                          : "IN STOCK"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/inventory/${product.id}/edit`}
                        state={{ product }}
                        className="text-teal-soft hover:text-white"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id, product.name)}
                        disabled={deletingProductId !== null}
                        className="text-danger hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingProductId === product.id
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
      </div>
    </div>
  );
}
