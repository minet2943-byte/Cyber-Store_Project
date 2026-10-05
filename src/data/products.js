// export const categories = [
//   {
//     id: 1,
//     name: "ASUS Gaming",
//     tagline: "Core & Edge",
//     icon: "Cpu",
//   },
//   {
//     id: 2,
//     name: "MAC Book Pro",
//     tagline: "NVMe & SSDs",
//     icon: "HardDrive",
//   },
//   {
//     id: 3,
//     name: "MSI Gaming",
//     tagline: "4K & Ultrawide",
//     icon: "Monitor",
//   },
//   {
//     id: 4,
//     name: "Lenovo",
//     tagline: "Routers & Switches",
//     icon: "Wifi",
//   },
// ];

// export const products = [
//   {
//     id: "001",
//     name: "ASUS ROG Series X",
//     category: 1,
//     price: 1349.0,
//     rating: 4.7,
//     reviewCount: 128,
//     stock: 34,
//     tag: "NEW ARRIVAL",
//     description:
//       "Engineered for absolute precision. The Series X delivers unprecedented computing power in a sleek, minimalist form factor.",
//     specs: [
//       { label: "Processor", value: "AMD Ryzen 9 5950X" },
//       { label: "RAM", value: "64 GB RAM" },
//       { label: "Storage", value: "2 TB SSD" },
//       { label: "Graphics Card", value: "RTX 4090 Super" },
//     ],
//     imageUrl:
//       "https://i.pinimg.com/1200x/10/99/73/10997386f563d5511f2126eb0ed2dff0.jpg",
//     images: [
//       "https://i.pinimg.com/1200x/10/99/73/10997386f563d5511f2126eb0ed2dff0.jpg",
//       "https://i.pinimg.com/736x/e5/c7/75/e5c775213e171eecd3882b6de9276c0e.jpg",
//       "https://i.pinimg.com/736x/32/11/04/3211049e1069ad28812c1115429007e5.jpg",
//     ],
//     variants: [
//       { id: "std", name: "Standard", priceDelta: 0 },
//       { id: "oc", name: "Overclocked", priceDelta: 60 },
//     ],
//   },
//   {
//     id: "002",
//     name: "ASUS ROG Laptop",
//     category: 1,
//     price: 1199.0,
//     rating: 4.6,
//     reviewCount: 98,
//     stock: 12,
//     tag: "HOT DEAL",
//     description:
//       "Ultra-portable gaming laptop with premium thermal design and excellent battery performance.",
//     specs: [
//       { label: "CPU", value: "Intel Core i7-13620H" },
//       { label: "RAM", value: "16 GB" },
//       { label: "Storage", value: "1 TB SSD" },
//       { label: "Display", value: "15.6 FHD 144Hz" },
//     ],
//     imageUrl:
//       "https://i.pinimg.com/736x/d0/a4/f4/d0a4f4d5e2e38a85d39df54828fb6551.jpg",
//     images: [
//       "https://i.pinimg.com/736x/d0/a4/f4/d0a4f4d5e2e38a85d39df54828fb6551.jpg",
//       "https://i.pinimg.com/736x/b2/0a/33/b20a3346430d048bbcf3ce4c26d7e434.jpg",
//       "https://i.pinimg.com/736x/0d/13/15/0d13156914bae68a8dfded9a850aaed4.jpg",
//     ],
//     variants: [
//       { id: "std", name: "Standard", priceDelta: 0 },
//       { id: "oc", name: "Overclocked", priceDelta: 40 },
//     ],
//   },
//   {
//     id: "003",
//     name: "MAC Book Pro 16",
//     category: 2,
//     price: 2499.0,
//     rating: 4.9,
//     reviewCount: 154,
//     stock: 7,
//     tag: "BEST SELLER",
//     description:
//       "High-performance pro laptop with a brilliant display and long battery life for creators.",
//     specs: [
//       { label: "CPU", value: "Apple M3 Pro" },
//       { label: "RAM", value: "18 GB" },
//       { label: "Storage", value: "512 GB SSD" },
//       { label: "Display", value: "16.2 Liquid Retina XDR" },
//     ],
//     imageUrl:
//       "https://i.pinimg.com/1200x/6a/7a/9f/6a7a9fa50d65dc4677133dd87220718e.jpg",
//     images: [
//       "https://i.pinimg.com/1200x/6a/7a/9f/6a7a9fa50d65dc4677133dd87220718e.jpg",
//       "https://i.pinimg.com/736x/e7/79/3b/e7793ba678a600516f3d6283802bf968.jpg",
//       "https://i.pinimg.com/736x/d6/46/14/d646147952636b44ac290ff5b14a5524.jpg",
//     ],
//     variants: [
//       { id: "std", name: "Standard", priceDelta: 0 },
//       { id: "max", name: "Maxed", priceDelta: 250 },
//     ],
//   },
//   {
//     id: "004",
//     name: "MSI Raider RGB",
//     category: 3,
//     price: 1899.0,
//     rating: 4.8,
//     reviewCount: 111,
//     stock: 9,
//     tag: "TRENDING",
//     description:
//       "Powerful gaming system designed for immersive play and future-ready performance.",
//     specs: [
//       { label: "CPU", value: "Intel Core i9-14900HX" },
//       { label: "RAM", value: "32 GB" },
//       { label: "Storage", value: "2 TB SSD" },
//       { label: "GPU", value: "RTX 4070" },
//     ],
//     imageUrl:
//       "https://i.pinimg.com/1200x/bf/4e/46/bf4e464684aed6a22895e21dcdffdca9.jpg",
//     images: [
//       "https://i.pinimg.com/1200x/bf/4e/46/bf4e464684aed6a22895e21dcdffdca9.jpg",
//       "https://i.pinimg.com/736x/5a/40/f3/5a40f3407b87a49088e63db909a641ef.jpg",
//       "https://i.pinimg.com/736x/10/5d/4d/105d4de77b617679de6f1dff0163549d.jpg",
//     ],
//     variants: [
//       { id: "std", name: "Standard", priceDelta: 0 },
//       { id: "pro", name: "Pro", priceDelta: 180 },
//     ],
//   },
//   {
//     id: "005",
//     name: "Lenovo Legion Pro",
//     category: 4,
//     price: 1699.0,
//     rating: 4.5,
//     reviewCount: 79,
//     stock: 16,
//     tag: "VALUE PICK",
//     description:
//       "Balanced gaming performance with strong thermal efficiency and premium keyboard feel.",
//     specs: [
//       { label: "CPU", value: "AMD Ryzen 7 7840HS" },
//       { label: "RAM", value: "16 GB" },
//       { label: "Storage", value: "1 TB SSD" },
//       { label: "Display", value: "16 QHD 165Hz" },
//     ],
//     imageUrl:
//       "https://i.pinimg.com/736x/68/87/bb/6887bbe72c02f9e5e8d069b00e9f506b.jpg",
//     images: [
//       "https://i.pinimg.com/736x/68/87/bb/6887bbe72c02f9e5e8d069b00e9f506b.jpg",
//       "https://i.pinimg.com/736x/e8/53/25/e85325467a1305eb96a0157eeff054c8.jpg",
//       "https://i.pinimg.com/1200x/0e/9f/6b/0e9f6b8471e7ccb2531b0f308a5ffa53.jpg",
//     ],
//     variants: [
//       { id: "std", name: "Standard", priceDelta: 0 },
//       { id: "elite", name: "Elite", priceDelta: 120 },
//     ],
//   },
// ];

export const categories = [];
export const products = [];

export const getProduct = (id) =>
  products.find((product) => String(product.id) === String(id));

export const getRelated = (product) =>
  products.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );

export const getProductsByCategory = (categoryId) =>
  products.filter((item) => String(item.category) === String(categoryId));
