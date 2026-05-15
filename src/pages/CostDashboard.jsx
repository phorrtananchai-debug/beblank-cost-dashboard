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
  if (typeof value !== 'number') return 'รอตรวจสอบข้อมูล'
  return precise ? preciseCurrency.format(value) : currency.format(value)
}

const riskLabel = {
  High: 'สูง',
  Medium: 'ปานกลาง',
  Low: 'ต่ำ',
}

const statusLabel = {
  Review: 'กำลังรีวิว',
  Approved: 'อนุมัติแล้ว',
  'Data pending review': 'รอตรวจสอบข้อมูล',
}

const modeOptions = [
  { value: 'Portfolio Overview', label: 'ภาพรวมทั้งหมด' },
  { value: 'Project Detail', label: 'รายละเอียดโครงการ' },
]

const hasProjectDetail = (project) =>
  typeof project.currentBudget === 'number' &&
  project.costBreakdown.length > 0 &&
  project.revisionDelta.items.length > 0

const getChecklistLabel = (item) =>
  typeof item === 'string' ? item : item.label

const getRevisionStatus = (project) =>
  project.revision.toLowerCase().includes(project.status.toLowerCase())
    ? project.revision
    : `${project.revision} ${project.status}`

function EmptyState() {
  return (
    <SectionCard eyebrow="รายละเอียดโครงการ" title="รอตรวจสอบข้อมูล">
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
        <p className="text-lg font-semibold text-stone-950">รอตรวจสอบข้อมูล</p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-500">
          โครงการนี้พร้อมรองรับข้อมูล BOQ รอบถัดไป เมื่อนำเข้างบประมาณ
          หมวดต้นทุน ส่วนต่างรอบรีวิว ความเสี่ยง และรายการตรวจสอบครบแล้ว
          ระบบจะแสดงรายละเอียดทั้งหมดในหน้านี้
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
            ฐานข้อมูลโครงการ
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            ระบบวิเคราะห์ BOQ
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            เปรียบเทียบภาพรวมต้นทุน ความเสี่ยง และรายการที่ต้องตัดสินใจก่อนอนุมัติงาน
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
          <button
            type="button"
            onClick={onToggleImportGuide}
            className="min-h-11 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm shadow-stone-200/60 transition duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50"
          >
            คู่มือนำเข้าข้อมูล
          </button>
          <label className="flex flex-col gap-2 text-sm font-medium text-stone-600">
            เลือกโครงการ
            <select
              value={selectedProjectId}
              onChange={(event) => onChange(event.target.value)}
              className="min-h-11 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-950 shadow-sm outline-none transition focus:border-stone-400 sm:min-w-72"
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
    <SectionCard eyebrow="คู่มือนำเข้าข้อมูล" title="โครงสร้าง JSON สำหรับ AI">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <h2 className="text-sm font-semibold text-stone-950">
            ฟิลด์ที่ต้องมี
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
            แนวทาง mapping ข้อมูลจาก AI
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-600">
            {aiImportMappingGuide.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-stone-500">
            ดู workflow เต็มได้ที่ docs/IMPORT_WORKFLOW.md และใช้ template
            เริ่มต้นที่ src/data/importTemplate.json
          </p>
        </div>
      </div>
    </SectionCard>
  )
}

function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex w-full flex-wrap gap-2 rounded-2xl border border-stone-200 bg-white/90 p-1.5 shadow-sm shadow-stone-200/60 sm:w-auto">
      {modeOptions.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={[
            'min-h-11 min-w-[9rem] flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium leading-5 transition duration-200 sm:flex-none',
            mode === item.value
              ? 'border-stone-950 bg-stone-950 text-white shadow-sm shadow-stone-300/70'
              : 'border-stone-200 bg-white text-stone-800 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:shadow-sm',
          ].join(' ')}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function PortfolioOverview({ portfolio, selectedProjectId, onSelectProject }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="จำนวนโครงการ" value={portfolio.totalProjects} />
        <MetricCard
          label="งบรวม"
          value={formatMoney(portfolio.totalBudget)}
          detail="เฉพาะโครงการที่มีงบผ่านการตรวจสอบ"
        />
        <MetricCard
          label="ต้นทุนเฉลี่ย / ตร.ม."
          value={formatMoney(portfolio.averageCostPerSqm)}
          detail="คำนวณจากโครงการที่มีข้อมูลพื้นที่"
        />
        <MetricCard
          label="โครงการที่ต้องระวังที่สุด"
          value={portfolio.highestRiskProject?.projectName ?? 'รอตรวจสอบข้อมูล'}
          detail={
            riskLabel[portfolio.highestRiskProject?.hiddenCostRisk] ??
            'ยังไม่มีข้อมูลความเสี่ยง'
          }
          tone="risk"
        />
      </div>

      <SectionCard eyebrow="ภาพรวมทั้งหมด" title="การ์ดโครงการ">
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
                    <span className="text-stone-500">สถานะ</span>
                    <span className="font-medium text-stone-800">
                      {statusLabel[project.status] ?? project.status}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-stone-500">งบประมาณ</span>
                    <span className="font-medium text-stone-800">
                      {formatMoney(project.currentBudget)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-stone-500">ความเสี่ยง</span>
                    <span className="font-medium text-stone-800">
                      {isPending
                        ? 'รอตรวจสอบข้อมูล'
                        : riskLabel[project.hiddenCostRisk] ?? project.hiddenCostRisk}
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
      label: 'งบประมาณปัจจุบัน',
      value: formatMoney(project.currentBudget, true),
      detail: `งบที่ส่งมาในรอบ ${project.revision}`,
    },
    {
      label: 'งบที่ลดลง',
      value: formatMoney(costReduction, true),
      detail: `ลดลง ${percentFormatter.format(Math.abs(project.deltaPercent ?? 0))}% จากรอบก่อน`,
      tone: 'positive',
    },
    {
      label: 'ความครบถ้วนของขอบเขต',
      value: project.scopeCompleteness ?? 'รอตรวจสอบข้อมูล',
      detail: 'ยังมีรายการยกเว้นที่ควรยืนยันกับเจ้าของ',
    },
    {
      label: 'ความเสี่ยงต้นทุนแฝง',
      value: riskLabel[project.hiddenCostRisk] ?? project.hiddenCostRisk ?? 'รอตรวจสอบข้อมูล',
      detail: 'เกิดจากงานระบบและงานรองรับที่ยังไม่รวมในราคา',
      tone: 'risk',
    },
    {
      label: 'รายการที่เจ้าของจัดหา',
      value: project.ownerSupplyCount ?? 'รอตรวจสอบข้อมูล',
      detail: 'รายการที่ต้องติดตามการจัดซื้อจากเจ้าของ',
    },
    {
      label: 'ความสำคัญในการต่อรอง',
      value: project.negotiationPriority === 'High' ? 'สูง' : project.negotiationPriority,
      detail: 'ควรเคลียร์ขอบเขตก่อนอนุมัติ',
      tone: 'risk',
    },
  ]

  return (
    <div className="space-y-6">
      <SectionCard className="overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              ระบบวิเคราะห์ BOQ
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              {project.projectName}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
              {getRevisionStatus(project)} สรุป BOQ ให้เห็นงบที่เปลี่ยน
              ความเสี่ยงที่ยังต้องยืนยัน และประเด็นที่ควรตัดสินใจก่อนอนุมัติ
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-stone-200 bg-[#f7f5ef] p-4">
            {[
              ['ชื่อโครงการ', project.projectName],
              ['สถานะรีวิว', getRevisionStatus(project)],
              ['งบประมาณปัจจุบัน', formatMoney(project.currentBudget, true)],
              ['งบประมาณรอบก่อน', formatMoney(project.previousBudget, true)],
              ['ส่วนต่างงบ', formatMoney(project.deltaAmount, true)],
              ['อัปเดตล่าสุด', project.lastUpdated ?? 'รอตรวจสอบข้อมูล'],
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
          eyebrow="แยกหมวดต้นทุน"
          title={`สัดส่วนงบ ${project.revision}`}
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

        <SectionCard eyebrow="ส่วนต่างรอบรีวิว" title="รายการที่เปลี่ยนจากรอบก่อน">
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

      <SectionCard eyebrow="รายการความเสี่ยง" title="ประเด็นที่ควรยืนยันกับเจ้าของ">
        <div className="grid gap-4 md:grid-cols-2">
          {project.risks.map((risk) => (
            <RiskCard key={risk.title} {...risk} />
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard eyebrow="รายการตรวจสอบ" title="สิ่งที่ควรยืนยันต่อไป">
          <div className="space-y-3">
            {project.negotiationChecklist.map((item, index) => {
              const isChecked = checkedItems.includes(index)
              const label = getChecklistLabel(item)

              return (
                <label
                  key={label}
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
                    {label}
                  </span>
                </label>
              )
            })}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="โหมดการดูข้อมูล"
          title={isInternalView ? 'บันทึกวิเคราะห์ภายใน' : 'สรุปสำหรับเจ้าของ'}
          action={
            <div className="flex w-full flex-wrap gap-2 rounded-2xl border border-stone-200 bg-white/90 p-1.5 shadow-sm shadow-stone-200/60 sm:w-auto">
              {[
                ['มุมมองเจ้าของ', false],
                ['มุมมองภายใน', true],
              ].map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setIsInternalView(value)}
                  className={[
                    'min-h-11 min-w-[8.75rem] flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium leading-5 transition duration-200 sm:flex-none',
                    isInternalView === value
                      ? 'border-stone-950 bg-stone-950 text-white shadow-sm shadow-stone-300/70'
                      : 'border-stone-200 bg-white text-stone-800 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:shadow-sm',
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
                  รายการที่ควรตรวจราคา
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
                  วิเคราะห์ผู้รับเหมา
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {project.internalNotes.contractorAnalysis ||
                    'รอตรวจสอบข้อมูล'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-950">
                  บันทึกสำหรับต่อรอง
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
                {project.ownerSummary || 'รอตรวจสอบข้อมูล'}
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
