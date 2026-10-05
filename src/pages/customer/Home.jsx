import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Cpu,
  HardDrive,
  Monitor,
  Wifi,
  Clock,
  Zap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ProductCard from "../../components/ProductCard";
import {
  categories as fallbackCategories,
  products as fallbackProducts,
} from "../../data/products.js";
import { getCategories } from "../../service/categoryApi";
import { getProducts } from "../../service/productApi";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const categoryIcons = { Cpu, HardDrive, Monitor, Wifi };

export default function Home() {
  const { settings } = useStoreSettings();
  const [categories, setCategories] = useState(fallbackCategories);
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    let active = true;

    const loadCatalog = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (!active) return;

        setProducts(productData);
        setCategories(categoryData);
      } catch (error) {
        console.warn("Home page fallback data loaded.", error);
        if (active) {
          setProducts(fallbackProducts);
          setCategories(fallbackCategories);
        }
      }
    };

    loadCatalog();

    return () => {
      active = false;
    };
  }, []);

  const featured = products.slice(0, 4);
  const flashDeals = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-void text-gray-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 pb-16 pt-8 sm:pb-24 lg:pt-12">
        {/* Subtle Ambient Background Lighting */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-violet-dim/20 blur-[130px]" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-teal-dim/15 blur-[140px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Hero Text & Actions */}
            <div className="z-10 flex flex-col items-start lg:col-span-5">
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-md border border-violet-dim/50 bg-[#1d1738]/90 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-violet-soft shadow-sm">
                NEW ARRIVAL
              </div>

              {/* Main Headline */}
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.12]">
                Next-Gen
                <br />
                Performance
                <br />
                Architecture.
              </h1>

              {/* Subtitle Description */}
              <p className="mt-5 max-w-lg text-sm sm:text-base leading-relaxed text-gray-400">
                {settings.bannerDescription ||
                  "Engineered for absolute precision. The new Series X delivers unprecedented computing power in a sleek, minimalist form factor."}
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 rounded-lg bg-violet px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:bg-violet-soft hover:shadow-lg"
                >
                  <span>Shop now</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  to="/product/001"
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-[#0f1420]/80 px-6 py-3 text-sm font-medium text-teal-soft transition-colors hover:border-teal hover:bg-[#131b2e]"
                >
                  Tech specs
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Hardware Showcase with Floating Glass Cards */}
            <div className="relative flex items-center justify-center lg:col-span-7">
              <div className="relative w-full max-w-[640px] py-6 sm:py-10">
                {/* Main Hardware Container with realistic lighting and shadow */}
                <div className="relative flex items-center justify-center">
                  {/* Background Keyboard Asset */}
                  <div className="absolute -right-2 sm:right-4 top-0 z-0 w-[180px] sm:w-[220px] -rotate-6 opacity-75 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] filter transition-transform hover:rotate-0 hover:scale-105 duration-500">
                    <img
                      src="https://i.pinimg.com/736x/76/24/0c/76240c35d34cd2a76af450d33c5a9075.jpg"
                      alt="Tactile RGB Keyboard"
                      className="rounded-xl border border-white/10 object-cover shadow-2xl"
                    />
                  </div>

                  {/* Primary PC Tower Showcase */}
                  <div className="relative z-10 w-[300px] sm:w-[400px] max-w-full drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-[1.02]">
                    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-2xl">
                      <img
                        src="https://i.pinimg.com/1200x/10/99/73/10997386f563d5511f2126eb0ed2dff0.jpg"
                        alt="Next-Gen PC Architecture"
                        className="h-full w-full object-cover"
                      />
                      {/* Glass reflection gloss overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15" />
                    </div>
                  </div>

                  {/* FLOATING CARD 1: Top Right (Tactile Mastery - Peripherals) */}
                  <div className="absolute -right-2 sm:right-2 top-8 z-20 w-52 sm:w-60 rounded-2xl border border-white/10 bg-[#0f1424]/85 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 hover:border-violet/40 hover:-translate-y-1">
                    {/* Speech bubble pointer indicator */}
                    <div className="absolute -left-2 top-6 h-3.5 w-3.5 rotate-45 border-b border-l border-white/10 bg-[#0f1424]/85" />
                    <h3 className="font-semibold text-white text-sm sm:text-base">
                      Tactile Mastery
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Custom built peripherals.
                    </p>
                    <Link
                      to="/products?category=D001"
                      className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-violet-soft hover:text-white transition-colors"
                    >
                      Explore <ArrowRight size={13} />
                    </Link>
                  </div>

                  {/* FLOATING CARD 2: Lower Left (Tactile Mastery / Chassis Component) */}
                  <div className="absolute -left-2 sm:left-4 bottom-10 z-20 w-52 sm:w-60 rounded-2xl border border-white/10 bg-[#0f1424]/85 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 hover:border-violet/40 hover:-translate-y-1">
                    {/* Speech bubble pointer indicator */}
                    <div className="absolute -right-2 top-6 h-3.5 w-3.5 rotate-45 border-r border-t border-white/10 bg-[#0f1424]/85" />
                    <h3 className="font-semibold text-white text-sm sm:text-base">
                      Tactile Mastery
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Custom built peripherals.
                    </p>
                    <Link
                      to="/products?category=A001"
                      className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-violet-soft hover:text-white transition-colors"
                    >
                      Explore <ArrowRight size={13} />
                    </Link>
                  </div>

                  {/* FLOATING CARD 3: Bottom Right (Enterprise Solutions) */}
                  <div className="absolute -right-2 sm:right-6 -bottom-4 z-20 w-56 sm:w-64 rounded-2xl border border-white/10 bg-[#0f1424]/85 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 hover:border-teal/40 hover:-translate-y-1">
                    <h3 className="font-semibold text-white text-sm sm:text-base">
                      Enterprise Solutions
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Scalable infrastructure.
                    </p>
                    <Link
                      to="/products"
                      className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-teal-soft hover:text-white transition-colors"
                    >
                      View plans <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Architecture Section */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Browse Architecture
            </h2>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            <span>View all categories</span>
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = categoryIcons[c.icon] || Cpu;
            return (
              <Link
                key={c.id}
                to={`/products?category=${c.id}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-dim hover:bg-card-hover hover:shadow-glow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-teal-dim/40 bg-teal/10 text-teal-soft transition-colors group-hover:border-teal group-hover:bg-teal/20">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 font-mono text-lg font-bold text-white group-hover:text-violet-soft transition-colors">
                  {c.name}
                </h3>
                <p className="mt-1 text-xs text-gray-400">{c.tagline}</p>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-teal-soft opacity-0 transition-opacity group-hover:opacity-100">
                  Explore range <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Flash Allocations Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-2xl font-bold text-white sm:text-3xl">
              Flash Allocations
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-dim/60 bg-teal/10 px-3 py-1 font-mono text-xs font-medium text-teal-soft">
              <Clock size={13} /> 04:21:59
            </span>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            See all deals &rarr;
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {flashDeals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-12 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-2xl font-bold text-white sm:text-3xl">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
