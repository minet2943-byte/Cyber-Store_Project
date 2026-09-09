export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Comp = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-violet text-white hover:bg-violet-soft shadow-glow',
    secondary: 'bg-transparent text-teal border border-teal-dim hover:border-teal hover:bg-teal/5',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5',
    danger: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
  }
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  }
  return (
    <Comp className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Comp>
  )
}
