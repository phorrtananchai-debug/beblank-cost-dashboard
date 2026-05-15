function RiskCard({ title, detail, level }) {
  return (
    <article className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-stone-950">{title}</h3>
        <span className="shrink-0 rounded-full border border-amber-200 bg-white px-2.5 py-1 text-xs font-semibold text-amber-700">
          {level}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-600">{detail}</p>
    </article>
  )
}

export default RiskCard
