function DeltaRow({ label, value }) {
  const isIncrease = value > 0
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value))

  return (
    <div className="flex items-center justify-between gap-4 border-b border-stone-100 py-3 last:border-b-0">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <span
        className={[
          'rounded-full px-3 py-1 text-sm font-semibold',
          isIncrease ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700',
        ].join(' ')}
      >
        {isIncrease ? '+' : '-'}
        {formatted}
      </span>
    </div>
  )
}

export default DeltaRow
