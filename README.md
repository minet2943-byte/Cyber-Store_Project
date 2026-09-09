# Cyber-Store — Customer Storefront (Home, Products, Cart)
# ហាង Cyber-Store — ផ្នែកអតិថិជន (Home, Products, Cart)

## Run it / របៀបដំណើរការ

```bash
npm install
npm run dev
```

Then open http://localhost:5173
បន្ទាប់មកបើក http://localhost:5173

## What's included / អ្វីដែលបានសាងសង់រួច

- **Home** (`src/pages/Home.jsx`) — hero, category grid, flash deals, featured products
- **Product listing** (`src/pages/ProductListing.jsx`) — category/price/rating filters, sort, empty state
- **Product detail** (`src/pages/ProductDetail.jsx`) — gallery, variants, qty stepper, specs, related products
- **Cart** (`src/pages/Cart.jsx`) — qty edit, remove, price summary, empty state

Cart state lives in `src/context/CartContext.jsx` (React Context, in-memory — no localStorage, since it's meant to later sync with your Spring Boot `/api/cart` endpoint).

កន្ត្រកទំនិញ (cart) ប្រើ React Context ដើម្បីរក្សាទុកទិន្នន័យក្នុងអង្គចងចាំ — មិនប្រើ localStorage ទេ ព្រោះក្រោយមកគួរភ្ជាប់ជាមួយ Spring Boot API `/api/cart`។

## Design tokens / តារាងពណ៌ និងទ្រង់ទ្រាយអក្សរ

Matches the Cyber-Store screenshots you shared (dark navy + violet/teal accents, mono headings).

| Token | Value | Use |
|---|---|---|
| `void` | `#0a0e1a` | page background |
| `surface` | `#0f1420` | footer, inputs |
| `card` | `#131a2b` | cards, panels |
| `border` | `#232c42` | hairlines |
| `violet` | `#7c5cfc` | primary actions, active states |
| `teal` | `#22d3c7` | secondary actions, links |
| Font — display | JetBrains Mono | headings, labels, prices |
| Font — body | Inter | paragraphs, descriptions |

All tokens live in `tailwind.config.js` — change the hex values there to re-theme the whole app.

## Connecting to your Spring Boot API / ការភ្ជាប់ទៅ Spring Boot backend

Everything currently reads from `src/data/products.js` (mock data). To wire it to your real backend:

1. Replace the imports of `products`/`categories` in `Home.jsx` and `ProductListing.jsx` with a `fetch('/api/products')` call inside a `useEffect`, or better, a small `src/api/products.js` module wrapping `fetch`.
2. `ProductDetail.jsx` currently uses `getProduct(id)` — swap for `GET /api/products/{id}`.
3. `CartContext.jsx` is intentionally backend-agnostic — once you have a cart endpoint, replace the `useState` calls with calls to `POST /api/cart/items`, etc., keeping the same function signatures (`addToCart`, `updateQty`, `removeItem`) so no page code needs to change.
4. Attach your JWT (the same one your attendance system uses) as an `Authorization: Bearer <token>` header once you add login.

## Not built yet (next scope) / មិនទាន់សាងសង់ (ជំហានបន្ទាប់)

- Checkout flow (`/checkout`)
- Login / Register / Forgot password
- Account pages (profile, order history, wishlist)
- Search results page
- Admin dashboard (Overview, Inventory, Orders, Customers, Analytics, Settings)
- Shared `DataTable`, `Modal`, `Toast` components (needed for admin side)

Say which of these you want next and I'll build it in the same style.
សូមប្រាប់ថាតើចង់បានផ្នែកណាបន្ទាប់ ខ្ញុំនឹងសាងសង់តាមរចនាបថដដែល។

## Responsive behavior / ការឆ្លើយតបទៅតាមទំហំអេក្រង់

- **Mobile (<640px)**: 2-column product grids, hamburger nav, filters become a bottom sheet drawer, cart summary stacks under items.
- **Tablet (640–1024px)**: 3-column product grids, nav still collapsed under `md` breakpoint (1024px) since the search bar needs room.
- **Desktop (≥1024px)**: 4-column product grids, filters as a fixed sidebar, full nav bar with inline search.

## Accessibility notes / កំណត់ចំណាំអំពីភាពងាយស្រួលប្រើប្រាស់

- All icon-only buttons (`ShoppingCart`, `Minus`/`Plus`, `Trash2`, quantity steppers) have `aria-label`.
- Focus states are visible globally via `:focus-visible` in `index.css` (teal 2px outline) — don't remove this when restyling.
- Quantity changes and cart badge updates use `aria-live="polite"` so screen readers announce changes without interrupting.
- Color is never the only signal for stock status — the `LOW STOCK` / `OUT OF STOCK` badges carry text, not just color.
- Reduced motion is respected via a `prefers-reduced-motion` media query in `index.css`.
