import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ProductThumb from "./ProductThumb";
import StarRating from "./StarRating";
import Badge from "./Badge";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const outOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-3 transition-colors hover:border-violet-dim">
      <Link
        to={`/product/${product.id}`}
        className="block"
        aria-label={product.name}
      >
        <ProductThumb
          id={product.id}
          imageUrl={product.imageUrl}
          className="aspect-square w-full"
        />
      </Link>

      {product.tag && (
        <div className="absolute left-5 top-5">
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
        </div>
      )}

      <div className="mt-3 flex flex-1 flex-col gap-1.5">
        <Link
          to={`/product/${product.id}`}
          className="font-mono text-sm font-medium text-white hover:text-teal-soft"
        >
          {product.name}
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-semibold text-white">
            ${product.price.toFixed(2)}
          </span>
          <button
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
              addToCart(product, 1);
            }}
            disabled={outOfStock}
            aria-label={
              outOfStock
                ? `${product.name} is out of stock`
                : `Add ${product.name} to cart`
            }
            className="rounded-lg border border-border p-2 text-gray-300 transition-colors hover:border-violet hover:text-violet-soft disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
