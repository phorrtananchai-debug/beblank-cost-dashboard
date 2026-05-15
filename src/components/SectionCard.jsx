function SectionCard({ eyebrow, title, action, children, className = '' }) {
  return (
    <section
      className={[
        'rounded-2xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/60 sm:p-6',
        className,
      ].join(' ')}
    >
      {(eyebrow || title || action) && (
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-stone-950">
                {title}
              </h2>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export default SectionCard
