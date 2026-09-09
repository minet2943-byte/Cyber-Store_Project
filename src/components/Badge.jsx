export default function Badge({ children, tone = 'violet' }) {
  const tones = {
    violet: 'bg-violet/15 text-violet-soft border-violet-dim/60',
    teal: 'bg-teal/10 text-teal-soft border-teal-dim/60',
    ok: 'bg-ok/10 text-ok border-ok/30',
    warn: 'bg-warn/10 text-warn border-warn/30',
    danger: 'bg-danger/10 text-danger border-danger/30',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
