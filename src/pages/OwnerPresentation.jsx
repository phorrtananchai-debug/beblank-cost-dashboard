import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import DeltaRow from '../components/DeltaRow.jsx'
import RiskCard from '../components/RiskCard.jsx'
import SectionCard from '../components/SectionCard.jsx'
import { projects } from '../data/projects.js'

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

const formatMoney = (value, precise = false) => {
  if (typeof value !== 'number') return 'Data pending review'
  return precise ? preciseCurrency.format(value) : currency.format(value)
}

function OwnerPresentation() {
  const { projectId } = useParams()
  const [copyLabel, setCopyLabel] = useState('Copy owner summary')
  const project = projects.find((item) => item.id === projectId)

  const ownerRisks = useMemo(
    () => project?.risks.filter((risk) => risk.ownerVisible) ?? [],
    [project],
  )

  if (!project) {
    return (
      <div className="owner-print-page mx-auto max-w-5xl">
        <SectionCard title="Project not found">
          <p className="text-sm text-stone-600">
            This owner presentation link does not match an available project.
          </p>
          <Link
            to="/cost-dashboard"
            className="no-print mt-5 inline-flex rounded-lg bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Back to dashboard
          </Link>
        </SectionCard>
      </div>
    )
  }

  const hasDetail =
    typeof project.currentBudget === 'number' && project.costBreakdown.length > 0

  const copyOwnerSummary = async () => {
    const summary = [
      `${project.projectName} ${project.revision}`,
      `Current budget: ${formatMoney(project.currentBudget, true)}`,
      `Budget delta: ${formatMoney(project.deltaAmount, true)}`,
      project.ownerSummary || 'Data pending review',
    ].join('\n')

    try {
      await navigator.clipboard.writeText(summary)
      setCopyLabel('Copied')
      window.setTimeout(() => setCopyLabel('Copy owner summary'), 1800)
    } catch {
      setCopyLabel('Copy unavailable')
      window.setTimeout(() => setCopyLabel('Copy owner summary'), 1800)
    }
  }

  return (
    <div className="owner-print-page mx-auto max-w-6xl space-y-6 bg-white text-stone-950 sm:rounded-3xl sm:border sm:border-stone-200 sm:p-8 sm:shadow-sm sm:shadow-stone-200/60">
      <div className="no-print flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <Link
          to="/cost-dashboard"
          className="text-sm font-semibold text-stone-500 transition hover:text-stone-950"
        >
          Back to dashboard
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={copyOwnerSummary}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-100"
          >
            {copyLabel}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      <section className="print-card rounded-3xl border border-stone-200 bg-[#fbfaf7] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
          Owner Presentation
        </p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              {project.projectName}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
              {project.ownerSummary || 'Data pending review'}
            </p>
          </div>
          <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4">
            {[
              ['Revision', `${project.revision} ${project.status}`],
              ['Current Budget', formatMoney(project.currentBudget, true)],
              ['Previous Budget', formatMoney(project.previousBudget, true)],
              ['Budget Delta', formatMoney(project.deltaAmount, true)],
              ['Last Updated', project.lastUpdated ?? 'Data pending review'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border-b border-stone-100 py-2.5 last:border-b-0"
              >
                <span className="text-sm text-stone-500">{label}</span>
                <span className="text-right text-sm font-semibold text-stone-950">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!hasDetail ? (
        <SectionCard className="print-card" title="Data pending review">
          <p className="text-sm leading-6 text-stone-600">
            This project is ready for an owner presentation once reviewed BOQ data
            is added.
          </p>
        </SectionCard>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionCard
              className="print-card"
              eyebrow="Revision Delta"
              title="Budget movement"
            >
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4">
                {project.revisionDelta.items.map((delta) => (
                  <DeltaRow key={delta.label} {...delta} />
                ))}
              </div>
              {project.revisionDelta.notes.length > 0 && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  {project.revisionDelta.notes.join(', ')}
                </div>
              )}
            </SectionCard>

            <SectionCard
              className="print-card"
              eyebrow="Cost Breakdown"
              title="Package allocation"
            >
              <div className="grid gap-5 sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={project.costBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="58%"
                        outerRadius="82%"
                        paddingAngle={3}
                      >
                        {project.costBreakdown.map((item) => (
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
                  {project.costBreakdown.map((item) => (
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
          </div>

          <SectionCard
            className="print-card"
            eyebrow="Owner Risks"
            title="Items to confirm before approval"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {ownerRisks.map((risk) => (
                <RiskCard key={risk.title} {...risk} />
              ))}
            </div>
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              className="print-card"
              eyebrow="Required Owner Decisions"
              title="Decision checklist"
            >
              <ul className="space-y-3">
                {project.negotiationChecklist.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard
              className="print-card"
              eyebrow="Owner Supply Items"
              title="Provided by owner"
            >
              {project.ownerSupplyItems.length > 0 ? (
                <ul className="space-y-3">
                  {project.ownerSupplyItems.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-stone-500">Data pending review</p>
              )}
            </SectionCard>
          </div>
        </>
      )}
    </div>
  )
}

export default OwnerPresentation
