import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../../components/ProductCard'
import { categories, products } from '../../data/products'

const SORTS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
]

export default function ProductListing() {
  const [params, setParams] = useSearchParams()
  const activeCategory = params.get('category') || ''
  const [sort, setSort] = useState('relevance')
  const catalogMaxPrice = Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100
  const [maxPrice, setMaxPrice] = useState(catalogMaxPrice)
  const [minRating, setMinRating] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice && p.rating >= minRating)
    if (activeCategory) list = list.filter((p) => p.category === activeCategory)
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [activeCategory, sort, maxPrice, minRating])

  const setCategory = (id) => {
    if (id) params.set('category', id)
    else params.delete('category')
    setParams(params, { replace: true })
  }

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500">Category</h3>
        <div className="mt-3 flex flex-col gap-1">
          <button
            onClick={() => setCategory('')}
            className={`rounded-lg px-3 py-2 text-left text-sm ${
              !activeCategory ? 'bg-violet/15 text-violet-soft' : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            All products
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-lg px-3 py-2 text-left text-sm ${
                activeCategory === c.id ? 'bg-violet/15 text-violet-soft' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500">Max price</h3>
        <input
          type="range"
          min={50}
          max={catalogMaxPrice}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-3 w-full accent-violet"
        />
        <div className="mt-1 text-sm text-gray-400">Up to ${maxPrice}</div>
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500">Minimum rating</h3>
        <div className="mt-3 flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`rounded-full border px-3 py-1 text-xs font-mono ${
                minRating === r
                  ? 'border-teal bg-teal/10 text-teal-soft'
                  : 'border-border text-gray-400 hover:border-teal-dim'
              }`}
            >
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-2xl font-bold text-white">
          {activeCategory ? categories.find((c) => c.id === activeCategory)?.name : 'All Products'}
        </h1>
        <button
          onClick={() => setFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-gray-300 lg:hidden"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{FilterPanel}</aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">{filtered.length} results</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-gray-200 focus:border-violet focus:outline-none"
              aria-label="Sort products"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
              <p className="font-mono text-lg text-gray-300">No matches in this range</p>
              <p className="mt-1 text-sm text-gray-500">Try widening your price or rating filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-lg font-semibold text-white">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  )
}
