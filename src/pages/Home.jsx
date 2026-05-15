import { Link } from 'react-router-dom'

const highlights = [
  {
    label: 'Monthly burn',
    value: '$84.2k',
    detail: 'Tracking 6.8% under plan',
  },
  {
    label: 'Forecast',
    value: '$1.04m',
    detail: 'Projected annualized spend',
  },
  {
    label: 'Savings queue',
    value: '$128k',
    detail: 'Identified opportunities',
  },
]

function Home() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium text-stone-500">
            Finance operations dashboard
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Calm, clear cost visibility for teams that need answers quickly.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            Monitor usage, explain spend movement, and keep optimization work in
            one restrained workspace built for daily review.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/cost-dashboard"
              className="inline-flex justify-center rounded-lg bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
            >
              Open dashboard
            </Link>
            <a
              href="#overview"
              className="inline-flex justify-center rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
            >
              Review overview
            </a>
          </div>
        </div>
      </div>

      <div
        id="overview"
        className="rounded-2xl border border-stone-200 bg-[#f4f1ea] p-5 shadow-sm sm:p-6"
      >
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-stone-500">Today</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Cost pulse
              </h2>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Healthy
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-stone-200 bg-stone-50 p-4"
              >
                <p className="text-sm text-stone-500">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-stone-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
