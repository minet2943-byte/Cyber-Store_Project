import { Link } from 'react-router-dom'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/products' },
      { label: 'Processors', to: '/products?category=processors' },
      { label: 'Storage', to: '/products?category=storage' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Order tracking', to: '/account/orders' },
      { label: 'Returns', to: '/support/returns' },
      { label: 'Contact', to: '/support/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Careers', to: '/careers' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <span className="font-mono text-lg font-bold text-violet-soft">CYBER-STORE</span>
          <p className="mt-3 max-w-xs text-sm text-gray-500">
            Precision hardware for people who build things.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-teal-soft">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-gray-600 sm:px-6">
        © {new Date().getFullYear()} Cyber-Store. All rights reserved.
      </div>
    </footer>
  )
}
