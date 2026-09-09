import { Link } from "react-router-dom";
import { ArrowRight, Cpu, HardDrive, Monitor, Wifi, Clock } from "lucide-react";
import ProductThumb from "../../components/ProductThumb";
import ProductCard from "../../components/ProductCard";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import { categories, products } from "../../data/products";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const categoryIcons = { Cpu, HardDrive, Monitor, Wifi };

export default function Home() {
  const { settings } = useStoreSettings();
  const featured = products.slice(0, 4);
  const flashDeals = products.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div
          className="relative flex min-h-[500px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card bg-cover bg-center p-8 lg:col-span-2"
          style={{
            backgroundImage: `linear-gradient(90deg, #111827 0%, rgba(17, 24, 39, 0.94) 40%, rgba(17, 24, 39, 0.42) 100%), url('${settings.bannerImage}')`,
          }}
        >
          <div className="relative z-10">
            <Badge>New arrival</Badge>
            <h1 className="mt-4 max-w-lg font-mono text-4xl font-bold leading-tight text-white sm:text-5xl">
              {settings.bannerTitle}
            </h1>
            <p className="mt-4 max-w-md text-sm text-gray-400">
              {settings.bannerDescription}
            </p>
          </div>
          <div className="relative z-10 mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/product/srx-9">
              Shop now <ArrowRight size={16} />
            </Button>
            <Button as={Link} to="/product/srx-9" variant="secondary">
              Tech specs
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <Link
            to="/products?category=processors"
            className="group relative flex-1 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-violet-dim"
          >
            <ProductThumb
              id="tactile"
              className="absolute inset-0 opacity-70"
            />
            <div className="relative">
              <h2 className="font-mono text-lg font-semibold text-white">
                Tactile Mastery
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Custom built peripherals.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-violet-soft group-hover:gap-2">
                Explore <ArrowRight size={14} />
              </span>
            </div>
          </Link>
          <Link
            to="/products?category=networking"
            className="group relative flex-1 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-teal-dim"
          >
            <ProductThumb
              id="enterprise"
              className="absolute inset-0 opacity-70"
            />
            <div className="relative">
              <h2 className="font-mono text-lg font-semibold text-white">
                Enterprise Solutions
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Scalable infrastructure.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-soft group-hover:gap-2">
                View plans <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-2xl font-bold text-white">
            Browse Architecture
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white"
          >
            View all categories <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((c) => {
            const Icon = categoryIcons[c.icon];
            return (
              <Link
                key={c.id}
                to={`/products?category=${c.id}`}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-violet-dim"
              >
                <Icon size={22} className="text-teal-soft" />
                <h3 className="mt-4 font-mono font-semibold text-white">
                  {c.name}
                </h3>
                <p className="text-sm text-gray-500">{c.tagline}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Flash deals */}
      <section className="mt-14">
        <div className="flex items-center gap-3">
          <h2 className="font-mono text-2xl font-bold text-white">
            Flash Allocations
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full border border-teal-dim bg-teal/10 px-2.5 py-1 text-xs font-mono text-teal-soft">
            <Clock size={12} /> 04:21:59
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {flashDeals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-14 pb-8">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-2xl font-bold text-white">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
