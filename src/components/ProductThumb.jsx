// Deterministic gradient placeholder in place of real product photography.
// Swap for <img src={product.imageUrl} /> once the backend serves real assets.
const PALETTES = [
  ["#7c5cfc", "#22d3c7"],
  ["#22d3c7", "#4c3a9e"],
  ["#9b82ff", "#0f7a70"],
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export default function ProductThumb({ id, className = "", imageUrl }) {
  if (imageUrl) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg ${className}`}
        style={{ border: "1px solid #232c42" }}
      >
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  const [from, to] = PALETTES[hash(id) % PALETTES.length];
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        background: `linear-gradient(135deg, ${from}22, ${to}22)`,
        border: "1px solid #232c42",
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(#232c42 1px, transparent 1px), linear-gradient(90deg, #232c42 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl"
        style={{ background: from, opacity: 0.35 }}
      />
      <div
        className="absolute -bottom-8 -left-4 h-20 w-20 rounded-full blur-2xl"
        style={{ background: to, opacity: 0.3 }}
      />
    </div>
  );
}
