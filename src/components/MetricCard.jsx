function MetricCard({ label, value, detail, tone = 'neutral' }) {
  const toneClass =
    tone === 'risk'
      ? 'text-amber-700'
      : tone === 'positive'
        ? 'text-emerald-700'
        : 'text-stone-500'

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/60">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
        {value}
      </p>
      {detail && <p className={`mt-2 text-sm ${toneClass}`}>{detail}</p>}
    </article>
  )
}

export default MetricCard
