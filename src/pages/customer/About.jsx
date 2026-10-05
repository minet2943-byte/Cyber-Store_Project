import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Cpu,
  Globe2,
  Award,
  Users2,
  Layers,
  ArrowRight,
  Terminal,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const stats = [
  { label: "High-Performance Rigs Built", value: "50K+" },
  { label: "Hardware Customizations", value: "120K+" },
  { label: "Global Delivery Zones", value: "85+" },
  { label: "Uptime & Quality Rating", value: "99.98%" },
];

const values = [
  {
    icon: Cpu,
    title: "Precision Engineering",
    desc: "Every component is stress-tested with silicon-level benchmarks before entering our distribution catalog.",
    color: "from-violet to-violet-soft",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Compromise Security",
    desc: "Genuine parts direct from certified fab partners with full cryptographic verification and warranty protection.",
    color: "from-teal to-teal-soft",
  },
  {
    icon: Zap,
    title: "Next-Gen Thermal Design",
    desc: "Pushing silicon boundaries with custom thermal liquid cooling architecture and tuned power curves.",
    color: "from-violet to-teal",
  },
  {
    icon: Globe2,
    title: "Global Supply Mesh",
    desc: "Distributed fulfillment nodes ensuring rapid, tamper-evident delivery straight to your build bench.",
    color: "from-teal to-violet",
  },
];

const milestones = [
  {
    year: "2021",
    title: "Genesis & Lab Architecture",
    desc: "Started as a specialized overclocking lab crafting customized workstations for machine learning researchers.",
  },
  {
    year: "2023",
    title: "Cyber-Store Platform Launch",
    desc: "Scaled into a global decentralized hardware destination offering direct-to-builder silicon and specialized gear.",
  },
  {
    year: "2024",
    title: "AI & Thermal Innovations",
    desc: "Pioneered automated component pairing algorithms and custom cold-plate liquid cooling modules.",
  },
  {
    year: "2026",
    title: "The Next Frontier",
    desc: "Expanding to quantum-ready computing accessories, optical interconnects, and ultra-dense storage units.",
  },
];

const team = [
  {
    name: "Dr. Elena Vance",
    role: "Chief Architect & Hardware Director",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    specialty: "Silicon Architecture & Thermal Dynamics",
  },
  {
    name: "Marcus Thorne",
    role: "Head of Systems & Overclocking Lab",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    specialty: "High-Density Compute & GPU Cluster Tuning",
  },
  {
    name: "Aria Chen",
    role: "VP of Supply Chain & Quality Assurance",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    specialty: "Supply Chain Cryptography & Authenticity",
  },
  {
    name: "Kai Takahashi",
    role: "Lead Firmware & AI Integration Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    specialty: "Custom BIOS & Kernel Level Performance",
  },
];

export default function About() {
  const { settings } = useStoreSettings();
  const storeTitle = settings?.siteName || "CYBER-STORE";

  return (
    <div className="min-h-screen bg-void text-gray-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 py-16 sm:py-24">
        {/* Glow ambient background lights */}
        <div className="pointer-events-none absolute left-1/3 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-violet-dim/20 blur-[140px]" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-teal-dim/15 blur-[130px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-dim/50 bg-[#1d1738]/90 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-violet-soft shadow-glow">
              <Terminal size={14} className="text-teal-soft" />
              <span>SYSTEM MANIFESTO // ABOUT US</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Engineered for the{" "}
              <span className="bg-gradient-to-r from-violet-soft via-teal-soft to-violet bg-clip-text text-transparent">
                Extreme
              </span>
              .
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-gray-400">
              At <strong className="text-white font-medium">{storeTitle}</strong>, we bridge raw silicon innovation and uncompromising hardware aesthetics. We empower developers, competitive gamers, AI creators, and digital architects with uncompromising computing machines.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 rounded-lg bg-violet px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:bg-violet-soft hover:shadow-lg"
              >
                <span>Explore Silicon Arsenal</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium text-gray-300 transition-colors duration-200 hover:border-violet-soft/60 hover:text-white"
              >
                Contact Our Engineers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="border-b border-border/40 bg-surface/40 py-12 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-surface/70 p-6 text-center shadow-sm"
              >
                <span className="font-mono text-3xl font-extrabold text-white sm:text-4xl bg-gradient-to-r from-violet-soft to-teal-soft bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-400 sm:text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values / Architecture Pillars */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-mono text-xs uppercase tracking-widest text-teal-soft">
              // PILLARS OF PERFORMANCE
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why Creators Choose {storeTitle}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-gray-400">
              We do not mass-produce compromise. Every component selected in our catalog adheres to demanding computational standards.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="group relative rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300 hover:border-violet-soft/50 hover:bg-card-hover hover:shadow-glow"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-violet-soft group-hover:text-teal-soft transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Deep Dive Box */}
      <section className="relative border-y border-border/40 bg-surface/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-violet-soft">
                <Sparkles size={14} />
                <span>Our Quality Protocol</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Uncompromising hardware certification for peak workloads.
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-400">
                Whether deploying neural network models, rendering 8K cinematic animations, or dominating tournament esports, hardware bottlenecks cost time and immersion.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Silicon lot binning for optimal power-to-frequency curves",
                  "Factory sealed tamper-proof holographic packaging",
                  "Direct engineering advisory for complex workstation builds",
                  "Lifetime hardware diagnostics and firmware compatibility support",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-soft" />
                    <span className="text-sm text-gray-300">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl border border-border/70 bg-card p-8 shadow-glow">
              <div className="flex items-center justify-between border-b border-border/60 pb-4 font-mono text-xs text-gray-400">
                <span className="flex items-center gap-2 text-violet-soft">
                  <span className="h-2.5 w-2.5 rounded-full bg-ok animate-pulse" />
                  STATION_ACTIVE // LAB_MONITOR
                </span>
                <span>NODE: 0x9F4</span>
              </div>

              <div className="mt-6 space-y-4 font-mono text-xs sm:text-sm">
                <div className="rounded-lg bg-void/80 p-4 border border-border/40">
                  <p className="text-gray-400">// Thermal Gradient Analysis</p>
                  <div className="mt-2 flex justify-between text-teal-soft">
                    <span>Delta T @ 100% Load:</span>
                    <span className="font-bold">31.4°C</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-teal to-violet" />
                  </div>
                </div>

                <div className="rounded-lg bg-void/80 p-4 border border-border/40">
                  <p className="text-gray-400">// Memory Latency Check</p>
                  <div className="mt-2 flex justify-between text-violet-soft">
                    <span>DDR5-7200 CL32 Sub-timings:</span>
                    <span className="font-bold">54.2 ns</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
                    <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-violet to-teal" />
                  </div>
                </div>

                <div className="p-2 text-center text-xs text-gray-500">
                  All systems passing stress integrity check #8849-B
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-mono text-xs uppercase tracking-widest text-violet-soft">
              // EVOLUTIONARY LOGS
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The Journey of {storeTitle}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            {milestones.map((m, idx) => (
              <div
                key={m.year}
                className="relative flex flex-col rounded-xl border border-border/60 bg-surface/60 p-6 backdrop-blur-sm"
              >
                <div className="font-mono text-2xl font-black text-teal-soft">
                  {m.year}
                </div>
                <h3 className="mt-3 text-base font-semibold text-white">
                  {m.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-400">
                  {m.desc}
                </p>
                <div className="mt-4 font-mono text-[10px] text-gray-500">
                  STAGE 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Engineering Team */}
      <section className="border-t border-border/40 bg-surface/20 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-mono text-xs uppercase tracking-widest text-teal-soft">
              // CREW & ARCHITECTS
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Meet the Engineers Behind the Silicon
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-gray-400">
              Hardware pioneers and system designers obsessed with pushing compute boundaries.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-violet-soft/60 hover:shadow-glow"
              >
                <div className="aspect-square w-full overflow-hidden bg-surface relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-white group-hover:text-violet-soft transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono text-teal-soft mt-1">
                    {member.role}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {member.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="border-t border-border bg-gradient-to-b from-void to-surface py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Build Your Dream Rig?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-gray-400">
            Browse our curated high-performance components or reach out to our hardware consultation desk for tailored advice.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-violet px-6 py-3 text-sm font-semibold text-white shadow-glow hover:bg-violet-soft"
            >
              Browse Hardware
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium text-gray-300 hover:text-white hover:border-teal-soft"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
