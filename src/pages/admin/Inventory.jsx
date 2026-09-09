import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Plus, Tags } from "lucide-react";
import { categories, products } from "../../data/products";
import ProductThumb from "../../components/ProductThumb";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState(0);
  const deleteProduct = (id) => {
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) return;
    products.splice(index, 1);
    setVersion((version) => version + 1);
  };
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? products.filter((product) =>
          `${product.name} ${product.id} ${product.category}`
            .toLowerCase()
            .includes(query),
        )
      : products;
  }, [search, version]);

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
                    {categories.find((item) => item.id === product.category)
                      ?.name ?? product.category}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    ${product.price.toFixed(2)}
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
                        className="text-teal-soft hover:text-white"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-danger hover:text-red-300"
                      >
                        Delete
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
