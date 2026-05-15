import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import DeltaRow from '../components/DeltaRow.jsx'
import MetricCard from '../components/MetricCard.jsx'
import RiskCard from '../components/RiskCard.jsx'
import SectionCard from '../components/SectionCard.jsx'
import { projects } from '../data/projects.js'
import { aiImportMappingGuide, boqProjectSchemaExample } from '../data/schemaExample.js'
import { warnForInvalidProjects } from '../utils/validateProjectData.js'

if (import.meta.env.DEV) {
  warnForInvalidProjects(projects)
}

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

const percentFormatter = new Intl.NumberFormat('en-US', {
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

const hasProjectDetail = (project) =>
  typeof project.currentBudget === 'number' &&
  project.costBreakdown.length > 0 &&
  project.revisionDelta.items.length > 0

function EmptyState() {
  return (
    <SectionCard eyebrow="Project Detail" title="Data pending review">
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
        <p className="text-lg font-semibold text-stone-950">Data pending review</p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-500">
          This project shell is ready for a future BOQ import. Once the budget,
          cost categories, revision deltas, risks, and checklist are mapped into
          the project schema, the full intelligence view will appear here.
        </p>
      </div>
    </SectionCard>
  )
}

function ProjectSelector({ selectedProjectId, onChange, onToggleImportGuide }) {
  return (
    <SectionCard>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
            Project Library
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            BOQ intelligence system
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Compare project health at portfolio level, then open a revision for
            owner-safe decisions and internal negotiation strategy.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <button
            type="button"
            onClick={onToggleImportGuide}
            className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-100"
          >
            Import Guide
          </button>
          <label className="flex flex-col gap-2 text-sm font-medium text-stone-600">
            Selected project
            <select
              value={selectedProjectId}
              onChange={(event) => onChange(event.target.value)}
              className="min-w-72 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-950 shadow-sm outline-none transition focus:border-stone-400"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.projectName} {project.revision}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </SectionCard>
  )
}

function ImportGuidePanel() {
  const requiredFields = Object.keys(boqProjectSchemaExample)

  return (
    <SectionCard eyebrow="Import Guide" title="Static AI JSON workflow">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <h2 className="text-sm font-semibold text-stone-950">
            Required project fields
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {requiredFields.map((field) => (
              <span
                key={field}
                className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-600"
              >
                {field}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <h2 className="text-sm font-semibold text-stone-950">
            Mapping notes for AI output
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
            {aiImportMappingGuide.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-stone-500">
            Full workflow: docs/IMPORT_WORKFLOW.md. Blank template:
            src/data/importTemplate.json.
          </p>
        </div>
      </div>
    </SectionCard>
  )
}

function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex rounded-xl border border-stone-200 bg-stone-100 p-1">
      {['Portfolio Overview', 'Project Detail'].map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(label)}
          className={[
            'rounded-lg px-3 py-2 text-sm font-semibold transition',
            mode === label
              ? 'bg-white text-stone-950 shadow-sm'
              : 'text-stone-500 hover:text-stone-950',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function PortfolioOverview({ portfolio, selectedProjectId, onSelectProject }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Projects" value={portfolio.totalProjects} />
        <MetricCard
          label="Total Budget"
          value={formatMoney(portfolio.totalBudget)}
          detail="Projects with reviewed budget data"
        />
        <MetricCard
          label="Avg. Cost / SQM"
          value={formatMoney(portfolio.averageCostPerSqm)}
          detail="Only projects with area data included"
        />
        <MetricCard
          label="Highest Risk Project"
          value={portfolio.highestRiskProject?.projectName ?? 'Data pending review'}
          detail={portfolio.highestRiskProject?.hiddenCostRisk ?? 'No reviewed risk data'}
          tone="risk"
        />
      </div>

      <SectionCard eyebrow="Portfolio" title="Project cards">
        <div className="grid gap-4 lg:grid-cols-3">
          {projects.map((project) => {
            const isSelected = project.id === selectedProjectId
            const isPending = !hasProjectDetail(project)

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => onSelectProject(project.id)}
                className={[
                  'rounded-2xl border bg-stone-50 p-5 text-left transition hover:bg-white',
                  isSelected
                    ? 'border-stone-950 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                      {project.brand}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight text-stone-950">
                      {project.projectName}
                    </h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600">
                    {project.revision}
                  </span>
                </div>
                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-stone-500">Status</span>
                    <span className="font-medium text-stone-800">{project.status}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-stone-500">Budget</span>
                    <span className="font-medium text-stone-800">
                      {formatMoney(project.currentBudget)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-stone-500">Risk</span>
                    <span className="font-medium text-stone-800">
                      {isPending ? 'Data pending review' : project.hiddenCostRisk}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}

function ProjectDetail({ project }) {
  const [isInternalView, setIsInternalView] = useState(false)
  const [checkedItemsByProject, setCheckedItemsByProject] = useState({
    [projects[0].id]: [0],
  })

  if (!hasProjectDetail(project)) {
    return <EmptyState />
  }

  const checkedItems = checkedItemsByProject[project.id] ?? []
  const costReduction =
    typeof project.deltaAmount === 'number' && project.deltaAmount < 0
      ? Math.abs(project.deltaAmount)
      : 0

  const toggleChecklist = (index) => {
    setCheckedItemsByProject((current) => {
      const projectCheckedItems = current[project.id] ?? []
      const nextItems = projectCheckedItems.includes(index)
        ? projectCheckedItems.filter((item) => item !== index)
        : [...projectCheckedItems, index]

      return { ...current, [project.id]: nextItems }
    })
  }

  const metrics = [
    {
      label: 'Current Budget',
      value: formatMoney(project.currentBudget, true),
      detail: `${project.revision} submitted budget`,
    },
    {
      label: 'Cost Reduction',
      value: formatMoney(costReduction, true),
      detail: `${percentFormatter.format(Math.abs(project.deltaPercent ?? 0))}% from previous issue`,
      tone: 'positive',
    },
    {
      label: 'Scope Completeness',
      value: project.scopeCompleteness ?? 'Data pending review',
      detail: 'Exclusions still require owner clarity',
    },
    {
      label: 'Hidden Cost Risk',
      value: project.hiddenCostRisk ?? 'Data pending review',
      detail: 'Driven by excluded utilities and support works',
      tone: 'risk',
    },
    {
      label: 'Owner Supply Count',
      value: project.ownerSupplyCount ?? 'Data pending review',
      detail: 'Owner-procured scope requiring tracking',
    },
    {
      label: 'Negotiation Priority',
      value: project.negotiationPriority ?? 'Data pending review',
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
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              {project.projectName}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
              {project.revision} {project.status.toLowerCase()} turns the BOQ
              into a concise owner decision view: what changed, where risk
              remains, and what to negotiate next.
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-stone-200 bg-[#f7f5ef] p-4">
            {[
              ['Project Name', project.projectName],
              ['Revision Status', `${project.revision} ${project.status}`],
              ['Current Budget', formatMoney(project.currentBudget, true)],
              ['Previous Budget', formatMoney(project.previousBudget, true)],
              ['Budget Delta', formatMoney(project.deltaAmount, true)],
              ['Last Updated', project.lastUpdated ?? 'Data pending review'],
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
          title={`${project.revision} package allocation`}
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

        <SectionCard eyebrow="Revision Delta" title="What moved from prior issue">
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
      </div>

      <SectionCard eyebrow="Risk Alerts" title="Owner clarity required">
        <div className="grid gap-4 md:grid-cols-2">
          {project.risks.map((risk) => (
            <RiskCard key={risk.title} {...risk} />
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard eyebrow="Negotiation Checklist" title="Next confirmations">
          <div className="space-y-3">
            {project.negotiationChecklist.map((item, index) => {
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
                  {project.internalNotes.overpricedItems.map((item) => (
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
                  {project.internalNotes.contractorAnalysis ||
                    'Data pending review'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-950">
                  Negotiation notes
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
                  {project.internalNotes.negotiationNotes.map((item) => (
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
                {project.ownerSummary || 'Data pending review'}
              </p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}

function CostDashboard() {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id)
  const [mode, setMode] = useState('Portfolio Overview')
  const [showImportGuide, setShowImportGuide] = useState(false)
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? projects[0]

  const portfolio = useMemo(() => {
    const reviewedProjects = projects.filter(
      (project) => typeof project.currentBudget === 'number',
    )
    const projectsWithArea = reviewedProjects.filter(
      (project) => typeof project.areaSqm === 'number' && project.areaSqm > 0,
    )
    const totalBudget = reviewedProjects.reduce(
      (sum, project) => sum + project.currentBudget,
      0,
    )
    const totalArea = projectsWithArea.reduce(
      (sum, project) => sum + project.areaSqm,
      0,
    )

    return {
      totalProjects: projects.length,
      totalBudget,
      averageCostPerSqm: totalArea > 0 ? totalBudget / totalArea : null,
      highestRiskProject:
        reviewedProjects.find((project) => project.hiddenCostRisk === 'High') ??
        reviewedProjects.find((project) => project.hiddenCostRisk === 'Medium') ??
        reviewedProjects[0],
    }
  }, [])

  const selectProject = (projectId) => {
    setSelectedProjectId(projectId)
    setMode('Project Detail')
  }

  return (
    <div className="space-y-6">
      <ProjectSelector
        selectedProjectId={selectedProjectId}
        onChange={setSelectedProjectId}
        onToggleImportGuide={() => setShowImportGuide((current) => !current)}
      />

      {showImportGuide && <ImportGuidePanel />}

      <div className="flex justify-start">
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {mode === 'Portfolio Overview' ? (
        <PortfolioOverview
          portfolio={portfolio}
          selectedProjectId={selectedProjectId}
          onSelectProject={selectProject}
        />
      ) : (
        <ProjectDetail project={selectedProject} />
      )}
    </div>
  )
}

export default CostDashboard
