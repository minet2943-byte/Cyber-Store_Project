// Mock product catalog — replace with calls to your Spring Boot REST API
// e.g. GET /api/products, GET /api/products/:id, GET /api/categories

export const categories = [
  {
    id: "A001",
    name: "ASUS Gaming",
    tagline: "Core & Edge",
    icon: "Cpu",
  },
  {
    id: "B001",
    name: "MAC Book Pro",
    tagline: "NVMe & SSDs",
    icon: "HardDrive",
  },
  {
    id: "C001",
    name: "MSI Gaming",
    tagline: "4K & Ultrawide",
    icon: "Monitor",
  },
  {
    id: "D001",
    name: "Lenovo",
    tagline: "Routers & Switches",
    icon: "Wifi",
  },
];

export const products = [
  {
    id: "001",
    name: "ASUS ROG Series X",
    category: "A001",
    price: 1349.0,
    rating: 4.7,
    reviewCount: 128,
    stock: 34,
    tag: "NEW ARRIVAL",
    description:
      "Engineered for absolute precision. The Series X delivers unprecedented computing power in a sleek, minimalist form factor.",
    specs: [
      { label: "Cores", value: "16-core / 32-thread" },
      { label: "Base clock", value: "3.8 GHz" },
      { label: "TDP", value: "105W" },
      { label: "Socket", value: "AM6" },
    ],
    imageUrl:
      "https://i.pinimg.com/1200x/10/99/73/10997386f563d5511f2126eb0ed2dff0.jpg",
    images: [
      "https://i.pinimg.com/1200x/10/99/73/10997386f563d5511f2126eb0ed2dff0.jpg",
      "https://i.pinimg.com/736x/e5/c7/75/e5c775213e171eecd3882b6de9276c0e.jpg",
      "https://i.pinimg.com/736x/32/11/04/3211049e1069ad28812c1115429007e5.jpg",
    ],
    variants: [
      { id: "std", name: "Standard", priceDelta: 0 },
      { id: "oc", name: "Overclocked", priceDelta: 60 },
    ],
  },
  {
    id: "002",
    name: "ASUS ROG Series X",
    category: "A001",
    price: 1349.0,
    rating: 4.7,
    reviewCount: 128,
    stock: 34,
    tag: "NEW ARRIVAL",
    description:
      "Engineered for absolute precision. The Series X delivers unprecedented computing power in a sleek, minimalist form factor.",
    specs: [
      { label: "Cores", value: "16-core / 32-thread" },
      { label: "Base clock", value: "3.8 GHz" },
      { label: "TDP", value: "105W" },
      { label: "Socket", value: "AM6" },
    ],
    imageUrl:
      "https://i.pinimg.com/736x/d0/a4/f4/d0a4f4d5e2e38a85d39df54828fb6551.jpg",
    images: [
      "https://i.pinimg.com/736x/d0/a4/f4/d0a4f4d5e2e38a85d39df54828fb6551.jpg",
      "https://i.pinimg.com/736x/b2/0a/33/b20a3346430d048bbcf3ce4c26d7e434.jpg",
      "https://i.pinimg.com/736x/0d/13/15/0d13156914bae68a8dfded9a850aaed4.jpg",
    ],
    variants: [
      { id: "std", name: "Standard", priceDelta: 0 },
      { id: "oc", name: "Overclocked", priceDelta: 60 },
    ],
  },

  // MAc Book
  {
    id: "003",
    name: "MAC Book Pro 16",
    category: "B001",
    price: 1249.0,
    rating: 4.7,
    reviewCount: 128,
    stock: 34,
    tag: "NEW ARRIVAL",
    description:
      "Engineered for absolute precision. The Series X delivers unprecedented computing power in a sleek, minimalist form factor.",
    specs: [
      { label: "Cores", value: "16-core / 32-thread" },
      { label: "Base clock", value: "3.8 GHz" },
      { label: "TDP", value: "105W" },
      { label: "Socket", value: "AM6" },
    ],
    imageUrl:
      "https://i.pinimg.com/1200x/6a/7a/9f/6a7a9fa50d65dc4677133dd87220718e.jpg",
    images: [
      "https://i.pinimg.com/1200x/6a/7a/9f/6a7a9fa50d65dc4677133dd87220718e.jpg",
      "https://i.pinimg.com/736x/e7/79/3b/e7793ba678a600516f3d6283802bf968.jpg",
      "https://i.pinimg.com/736x/d6/46/14/d646147952636b44ac290ff5b14a5524.jpg",
    ],
    variants: [
      { id: "std", name: "Standard", priceDelta: 0 },
      { id: "oc", name: "Overclocked", priceDelta: 60 },
    ],
  },
  {
    id: "004",
    name: "MAC Book Pro 16",
    category: "B001",
    price: 1249.0,
    rating: 4.7,
    reviewCount: 128,
    stock: 34,
    tag: "NEW ARRIVAL",
    description:
      "Engineered for absolute precision. The Series X delivers unprecedented computing power in a sleek, minimalist form factor.",
    specs: [
      { label: "Cores", value: "16-core / 32-thread" },
      { label: "Base clock", value: "3.8 GHz" },
      { label: "TDP", value: "105W" },
      { label: "Socket", value: "AM6" },
    ],
    imageUrl:
      "https://i.pinimg.com/1200x/ff/db/f7/ffdbf7b137edb0aad8ffa5f7407d6afd.jpg",
    images: [
      "https://i.pinimg.com/1200x/ff/db/f7/ffdbf7b137edb0aad8ffa5f7407d6afd.jpg",
      "https://i.pinimg.com/736x/13/f7/7e/13f77ef63369638b8e83ebed974b8535.jpg",
      "https://i.pinimg.com/236x/59/15/e6/5915e67d1a9c898aeccd2378dc249b26.jpg",
    ],
    variants: [
      { id: "std", name: "Standard", priceDelta: 0 },
      { id: "oc", name: "Overclocked", priceDelta: 60 },
    ],
  },
  // MSI
  {
    id: "005",
    name: "MSI gaming",
    category: "C001",
    price: 349.0,
    rating: 4.7,
    reviewCount: 128,
    stock: 34,
    tag: "NEW ARRIVAL",
    description:
      "Engineered for absolute precision. The Series X delivers unprecedented computing power in a sleek, minimalist form factor.",
    specs: [
      { label: "Cores", value: "16-core / 32-thread" },
      { label: "Base clock", value: "3.8 GHz" },
      { label: "TDP", value: "105W" },
      { label: "Socket", value: "AM6" },
    ],
    imageUrl:
      "https://i.pinimg.com/1200x/bf/4e/46/bf4e464684aed6a22895e21dcdffdca9.jpg",
    images: [
      "https://i.pinimg.com/1200x/bf/4e/46/bf4e464684aed6a22895e21dcdffdca9.jpg",
      "https://i.pinimg.com/736x/5a/40/f3/5a40f3407b87a49088e63db909a641ef.jpg",
      "https://i.pinimg.com/736x/10/5d/4d/105d4de77b617679de6f1dff0163549d.jpg",
    ],
    variants: [
      { id: "std", name: "Standard", priceDelta: 0 },
      { id: "oc", name: "Overclocked", priceDelta: 60 },
    ],
  },
  {
    id: "006",
    name: "MSI gaming",
    category: "C001",
    price: 349.0,
    rating: 4.7,
    reviewCount: 128,
    stock: 34,
    tag: "NEW ARRIVAL",
    description:
      "Engineered for absolute precision. The Series X delivers unprecedented computing power in a sleek, minimalist form factor.",
    specs: [
      { label: "Cores", value: "16-core / 32-thread" },
      { label: "Base clock", value: "3.8 GHz" },
      { label: "TDP", value: "105W" },
      { label: "Socket", value: "AM6" },
    ],
    imageUrl:
      "https://i.pinimg.com/736x/68/87/bb/6887bbe72c02f9e5e8d069b00e9f506b.jpg",
    images: [
      "https://i.pinimg.com/736x/68/87/bb/6887bbe72c02f9e5e8d069b00e9f506b.jpg",
      "https://i.pinimg.com/736x/e8/53/25/e85325467a1305eb96a0157eeff054c8.jpg",
      "https://i.pinimg.com/1200x/0e/9f/6b/0e9f6b8471e7ccb2531b0f308a5ffa53.jpg",
    ],
    variants: [
      { id: "std", name: "Standard", priceDelta: 0 },
      { id: "oc", name: "Overclocked", priceDelta: 60 },
    ],
  },
  //Lenovo
  {
    id: "007",
    name: "Nexus Pro Keyboard",
    category: "D001",
    price: 149.0,
    rating: 4.5,
    reviewCount: 341,
    stock: 84,
    tag: null,
    imageUrl:
      "https://i.pinimg.com/736x/76/24/0c/76240c35d34cd2a76af450d33c5a9075.jpg",
    images: [
      "https://i.pinimg.com/736x/76/24/0c/76240c35d34cd2a76af450d33c5a9075.jpg",
      "https://i.pinimg.com/736x/6a/95/06/6a95065051b31b9ca45df381e1fee993.jpg",
      "https://i.pinimg.com/736x/0a/36/b8/0a36b8e0cea1d73ca23c1454b7f07b87.jpg",
    ],
    description:
      "Mechanical, hot-swappable, RGB. Built for people who type for a living.",
    specs: [
      { label: "Switches", value: "Hot-swap mechanical" },
      { label: "Layout", value: "TKL" },
      { label: "Connectivity", value: "USB-C / 2.4GHz / BT" },
    ],
    variants: [
      { id: "red", name: "Red switches", priceDelta: 0 },
      { id: "brown", name: "Brown switches", priceDelta: 0 },
    ],
  },
  {
    id: "008",
    name: "Nexus Pro Keyboard",
    category: "D001",
    price: 149.0,
    rating: 4.5,
    reviewCount: 341,
    stock: 84,
    tag: null,
    imageUrl:
      "https://i.pinimg.com/736x/62/af/2b/62af2bd59c1f707b315a47f8a69adedb.jpg",
    images: [
      "https://i.pinimg.com/736x/62/af/2b/62af2bd59c1f707b315a47f8a69adedb.jpg",
      "https://i.pinimg.com/1200x/3d/ff/12/3dff12fc39938703b83402729dfd234b.jpg",
      "https://i.pinimg.com/236x/77/b5/ad/77b5ad58597f5946f7f0f80472ace0a5.jpg",
    ],
    description:
      "Mechanical, hot-swappable, RGB. Built for people who type for a living.",
    specs: [
      { label: "Switches", value: "Hot-swap mechanical" },
      { label: "Layout", value: "TKL" },
      { label: "Connectivity", value: "USB-C / 2.4GHz / BT" },
    ],
    variants: [
      { id: "red", name: "Red switches", priceDelta: 0 },
      { id: "brown", name: "Brown switches", priceDelta: 0 },
    ],
  },
 
];

export function getProduct(id) {
  return products.find((p) => p.id === id);
}

export function getRelated(product, count = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, count);
}
