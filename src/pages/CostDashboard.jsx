import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import DeltaRow from '../components/DeltaRow.jsx'
import MetricCard from '../components/MetricCard.jsx'
import RiskCard from '../components/RiskCard.jsx'
import SectionCard from '../components/SectionCard.jsx'
import { karunPhuketRev01 as data } from '../data/karunPhuketRev01.js'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0,
})

const preciseCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'THB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const tooltipStyle = {
  border: '1px solid #e7e5e4',
  borderRadius: '12px',
  boxShadow: '0 18px 45px rgba(28, 25, 23, 0.08)',
}

function CostDashboard() {
  const [isInternalView, setIsInternalView] = useState(false)
  const [checkedItems, setCheckedItems] = useState([0])

  const toggleChecklist = (index) => {
    setCheckedItems((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    )
  }

  const metrics = [
    {
      label: 'Current Budget',
      value: preciseCurrency.format(data.currentBudget),
      detail: 'REV01 submitted budget',
    },
    {
      label: 'Cost Reduction',
      value: preciseCurrency.format(data.costReduction),
      detail: 'Net decrease from previous issue',
      tone: 'positive',
    },
    {
      label: 'Scope Completeness',
      value: data.scopeCompleteness,
      detail: 'Exclusions still require owner clarity',
    },
    {
      label: 'Hidden Cost Risk',
      value: data.hiddenCostRisk,
      detail: 'Driven by excluded utilities and support works',
      tone: 'risk',
    },
    {
      label: 'Owner Supply Count',
      value: data.ownerSupplyCount,
      detail: 'Chandelier requires tracking',
    },
    {
      label: 'Negotiation Priority',
      value: data.negotiationPriority,
      detail: 'Clarify scope before approval',
      tone: 'risk',
    },
  ]

  return (
    <div className="space-y-6">
      <SectionCard className="overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Architectural Project Intelligence
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              {data.projectName}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
              {data.revisionStatus} turns the BOQ into a concise owner decision
              view: what changed, where risk remains, and what to negotiate next.
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-stone-200 bg-[#f7f5ef] p-4">
            {[
              ['Revision Status', data.revisionStatus],
              ['Current Budget', preciseCurrency.format(data.currentBudget)],
              ['Previous Budget', preciseCurrency.format(data.previousBudget)],
              ['Budget Delta', preciseCurrency.format(data.budgetDelta)],
              ['Last Updated', data.lastUpdated],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3"
              >
                <span className="text-sm text-stone-500">{label}</span>
                <span className="text-right text-sm font-semibold text-stone-950">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <SectionCard
          eyebrow="Cost Breakdown"
          title="REV01 package allocation"
          action={
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
              THB
            </span>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.costBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="58%"
                    outerRadius="82%"
                    paddingAngle={3}
                  >
                    {data.costBreakdown.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => currency.format(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {data.costBreakdown.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
                >
                  <span className="flex items-center gap-3 text-sm font-medium text-stone-700">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold">
                    {currency.format(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard eyebrow="Revision Delta" title="What moved from prior issue">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4">
            {data.deltas.map((delta) => (
              <DeltaRow key={delta.label} {...delta} />
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {data.revisionNotes.join(', ')}
          </div>
        </SectionCard>
      </div>

      <SectionCard eyebrow="Risk Alerts" title="Owner clarity required">
        <div className="grid gap-4 md:grid-cols-2">
          {data.risks.map((risk) => (
            <RiskCard key={risk.title} {...risk} />
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard eyebrow="Negotiation Checklist" title="Next confirmations">
          <div className="space-y-3">
            {data.checklist.map((item, index) => {
              const isChecked = checkedItems.includes(index)

              return (
                <label
                  key={item}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 transition hover:bg-stone-100"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleChecklist(index)}
                    className="h-4 w-4 accent-stone-950"
                  />
                  <span
                    className={[
                      'text-sm font-medium',
                      isChecked ? 'text-stone-400 line-through' : 'text-stone-800',
                    ].join(' ')}
                  >
                    {item}
                  </span>
                </label>
              )
            })}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="View Mode"
          title={isInternalView ? 'Internal contractor analysis' : 'Owner-safe summary'}
          action={
            <div className="flex rounded-xl border border-stone-200 bg-stone-100 p-1">
              {[
                ['Owner View', false],
                ['Internal View', true],
              ].map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setIsInternalView(value)}
                  className={[
                    'rounded-lg px-3 py-2 text-sm font-semibold transition',
                    isInternalView === value
                      ? 'bg-white text-stone-950 shadow-sm'
                      : 'text-stone-500 hover:text-stone-950',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        >
          {isInternalView ? (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-stone-950">
                  Overpriced items
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
                  {data.internal.overpricedItems.map((item) => (
                    <li key={item} className="rounded-xl bg-stone-50 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <h3 className="text-sm font-semibold text-stone-950">
                  Contractor analysis
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {data.internal.contractorAnalysis}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-950">
                  Negotiation notes
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
                  {data.internal.negotiationNotes.map((item) => (
                    <li key={item} className="rounded-xl bg-stone-50 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-base leading-7 text-stone-700">
                REV01 currently reduces the total budget while leaving several
                important exclusions visible. The owner decision should focus on
                confirming AC specification, water system detail, lighting level,
                and owner-supplied chandelier responsibility before final sign-off.
              </p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}

export default CostDashboard
