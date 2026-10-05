import { useEffect, useState } from "react";
import api from "../service/api";

// Use the product image when available and a deterministic gradient otherwise.
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
  const [imageFailed, setImageFailed] = useState(false);
  const [displayImageUrl, setDisplayImageUrl] = useState("");

  useEffect(() => {
    let active = true;
    let objectUrl;
    setImageFailed(false);

    if (!imageUrl) {
      setDisplayImageUrl("");
      return () => {
        active = false;
      };
    }

    let sourceUrl;
    try {
      sourceUrl = new URL(imageUrl, window.location.origin);
    } catch (error) {
      console.warn("Could not parse product image URL.", error);
      setDisplayImageUrl("");
      setImageFailed(true);
      return () => {
        active = false;
      };
    }

    const apiOrigin = new URL(
      api.defaults.baseURL,
      window.location.origin,
    ).origin;

    if (sourceUrl.origin !== apiOrigin) {
      setDisplayImageUrl(imageUrl);
      return () => {
        active = false;
      };
    }

    setDisplayImageUrl("");
    api
      .get(sourceUrl.href, { responseType: "blob" })
      .then(({ data }) => {
        if (!data.size) {
          throw new Error("The image response was empty.");
        }

        objectUrl = URL.createObjectURL(data);
        if (active) {
          setDisplayImageUrl(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      })
      .catch((error) => {
        if (active) {
          console.warn(`Could not load product image ${imageUrl}.`, error);
          setImageFailed(true);
        }
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageUrl]);

  if (displayImageUrl && !imageFailed) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg ${className}`}
        style={{ border: "1px solid #232c42" }}
      >
        <img
          src={displayImageUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
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
