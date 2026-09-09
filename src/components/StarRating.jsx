import { Star } from 'lucide-react'

export default function StarRating({ rating, count, size = 14 }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex text-teal">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.round(rating) ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 font-mono">
        {rating.toFixed(1)}
        {count != null && ` (${count})`}
      </span>
    </div>
  )
}
