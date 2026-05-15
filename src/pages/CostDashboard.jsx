import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const monthlySpend = [
  { month: 'Jan', compute: 28, storage: 12, data: 8 },
  { month: 'Feb', compute: 31, storage: 13, data: 9 },
  { month: 'Mar', compute: 35, storage: 14, data: 11 },
  { month: 'Apr', compute: 33, storage: 15, data: 10 },
  { month: 'May', compute: 37, storage: 16, data: 12 },
  { month: 'Jun', compute: 34, storage: 17, data: 11 },
]

const categorySpend = [
  { name: 'Compute', value: 42 },
  { name: 'Storage', value: 19 },
  { name: 'Data', value: 14 },
  { name: 'AI', value: 9 },
]

const stats = [
  { label: 'Current month', value: '$84.2k', change: '-6.8% vs plan' },
  { label: 'Forecast variance', value: '$42k', change: 'Room before cap' },
  { label: 'Idle resources', value: '117', change: '$18.4k recoverable' },
]

const tooltipStyle = {
  border: '1px solid #e7e5e4',
  borderRadius: '10px',
  boxShadow: '0 10px 30px rgba(28, 25, 23, 0.08)',
}

function CostDashboard() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-stone-500">Cost dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Spend, forecast, and optimization signals
          </h1>
        </div>
        <button className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-100 md:w-auto">
          Export report
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-emerald-700">{stat.change}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Monthly spend
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Split by infrastructure category
              </p>
            </div>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
              USD, thousands
            </span>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySpend} margin={{ left: -18, right: 8 }}>
                <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="compute"
                  stackId="1"
                  stroke="#2563eb"
                  fill="#bfdbfe"
                />
                <Area
                  type="monotone"
                  dataKey="storage"
                  stackId="1"
                  stroke="#059669"
                  fill="#bbf7d0"
                />
                <Area
                  type="monotone"
                  dataKey="data"
                  stackId="1"
                  stroke="#d97706"
                  fill="#fed7aa"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Category mix
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Current month allocation
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySpend} layout="vertical" margin={{ left: 4 }}>
                <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={70}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#1c1917" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  )
}

export default CostDashboard
