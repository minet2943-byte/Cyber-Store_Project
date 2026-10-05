import { useEffect, useState } from "react";
import {
  useParams,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Minus, Plus, ShoppingCart, ChevronRight } from "lucide-react";
import ProductThumb from "../../components/ProductThumb";
import StarRating from "../../components/StarRating";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import ProductCard from "../../components/ProductCard";
import {
  categories as fallbackCategories,
  getProduct as getFallbackProduct,
  getRelated as getFallbackRelated,
} from "../../data/products.js";
import { getCategories } from "../../service/categoryApi";
import { getProductById } from "../../service/productApi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(() => getFallbackProduct(id));
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        const [productResult, categoryResult] = await Promise.allSettled([
          getProductById(id),
          getCategories(),
        ]);

        if (!active) return;

        if (productResult.status === "fulfilled") {
          setProduct(productResult.value || getFallbackProduct(id));
        } else {
          console.warn("Could not load product details.", productResult.reason);
          setProduct(getFallbackProduct(id));
        }

        if (categoryResult.status === "fulfilled") {
          setCategories(categoryResult.value);
        } else {
          console.warn("Could not load product categories.", categoryResult.reason);
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.warn("Product detail fallback data loaded.", error);
        if (active) {
          setProduct(getFallbackProduct(id));
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
  }, [id]);

  const [variant, setVariant] = useState(product?.variants?.[0] ?? null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setVariant(product?.variants?.[0] ?? null);
    setQty(1);
    setActiveImg(0);
  }, [product]);

  if (loading && !product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-400">
        Loading product details...
      </div>
    );
  }

  if (!product) return <Navigate to="/products" replace />;

  const category = categories.find(
    (c) => String(c.id) === String(product.category),
  );
  const related = getFallbackRelated(product);
  const price = product.price + (variant?.priceDelta ?? 0);
  const outOfStock = product.stock === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex items-center gap-1 text-sm text-gray-500"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-white">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link
          to={`/products?category=${product.category}`}
          className="hover:text-white"
        >
          {category?.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-300">{product.name}</span>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Gallery */}
        <div className="w-full max-w-md lg:col-span-5">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <ProductThumb
              id={`${product.id}-${activeImg}`}
              imageUrl={product.images?.[activeImg] || product.imageUrl}
              className="h-[320px] sm:h-[380px] w-full"
            />
          </div>
          <div className="mt-3 flex gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-14 w-14 overflow-hidden rounded-lg border transition-all ${
                  activeImg === i
                    ? "border-violet ring-2 ring-violet/20"
                    : "border-border opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <ProductThumb
                  id={`${product.id}-${i}`}
                  imageUrl={product.images?.[i] || product.imageUrl}
                  className="h-full w-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-7">
          {product.tag && (
            <Badge
              tone={
                outOfStock
                  ? "danger"
                  : product.tag === "LOW STOCK"
                    ? "warn"
                    : "violet"
              }
            >
              {product.tag}
            </Badge>
          )}
          <h1 className="mt-2.5 font-mono text-xl sm:text-2xl font-bold text-white">
            {product.name}
          </h1>
          <div className="mt-2">
            <StarRating
              rating={product.rating}
              count={product.reviewCount}
              size={16}
            />
          </div>
          <p className="mt-4 text-2xl font-semibold text-white">
            ${price.toFixed(2)}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">
            {product.description}
          </p>

          {product.variants?.length > 1 && (
            <div className="mt-6">
              <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500">
                Variant
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v)}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      variant?.id === v.id
                        ? "border-violet bg-violet/10 text-violet-soft"
                        : "border-border text-gray-400 hover:border-violet-dim"
                    }`}
                  >
                    {v.name}
                    {v.priceDelta !== 0 &&
                      ` (${v.priceDelta > 0 ? "+" : ""}$${v.priceDelta})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2.5 text-gray-400 hover:text-white"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span
                className="w-8 text-center text-sm text-white"
                aria-live="polite"
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="p-2.5 text-gray-400 hover:text-white"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              disabled={outOfStock}
              onClick={() => {
                if (outOfStock) return;
                if (!isAuthenticated) {
                  navigate("/login", {
                    state: { from: location },
                    replace: true,
                  });
                  return;
                }
                if (isAdmin) {
                  navigate("/admin", { replace: true });
                  return;
                }
                addToCart(product, qty, variant);
              }}
            >
              <ShoppingCart size={18} />
              {outOfStock ? "Out of stock" : "Add to cart"}
            </Button>
          </div>
          {!outOfStock && product.stock <= 5 && (
            <p className="mt-2 text-xs text-warn">
              Only {product.stock} left in stock.
            </p>
          )}

          {product.specs?.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500">
                Specifications
              </h3>
              <dl className="mt-3 divide-y divide-border">
                {product.specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between py-2 text-sm"
                  >
                    <dt className="text-gray-500">{s.label}</dt>
                    <dd className="text-gray-200">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-mono text-2xl font-bold text-white">
            Related Products
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
