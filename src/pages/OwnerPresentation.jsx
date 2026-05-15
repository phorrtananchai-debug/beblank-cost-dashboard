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
  if (typeof value !== 'number') return 'รอตรวจสอบข้อมูล'
  return precise ? preciseCurrency.format(value) : currency.format(value)
}

function OwnerPresentation() {
  const { projectId } = useParams()
  const [copyLabel, setCopyLabel] = useState('คัดลอกสรุปสำหรับเจ้าของ')
  const [shareLabel, setShareLabel] = useState('คัดลอกข้อความแชร์')
  const project = projects.find((item) => item.id === projectId)

  const ownerRisks = useMemo(
    () => project?.risks.filter((risk) => risk.ownerVisible) ?? [],
    [project],
  )

  const ownerChecklist = useMemo(
    () =>
      project?.negotiationChecklist.filter((item) =>
        typeof item === 'string' ? true : item.ownerVisible,
      ) ?? [],
    [project],
  )

  if (!project) {
    return (
      <div className="owner-print-page mx-auto max-w-4xl">
        <SectionCard className="print-card" title="ไม่พบโครงการ">
          <p className="text-sm leading-6 text-stone-600">
            ลิงก์นี้ไม่ตรงกับโครงการที่มีอยู่ในระบบ
          </p>
          <Link
            to="/cost-dashboard"
            className="no-print mt-5 inline-flex rounded-lg bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white"
          >
            กลับไปที่แดชบอร์ด
          </Link>
        </SectionCard>
      </div>
    )
  }

  const getChecklistLabel = (item) =>
    typeof item === 'string' ? item : item.label

  const revisionStatus = project.revision

  const hasDetail =
    typeof project.currentBudget === 'number' && project.costBreakdown.length > 0

  const copyToClipboard = async (text, setLabel, successLabel, defaultLabel) => {
    try {
      await navigator.clipboard.writeText(text)
      setLabel(successLabel)
      window.setTimeout(() => setLabel(defaultLabel), 1800)
    } catch {
      setLabel('คัดลอกไม่ได้')
      window.setTimeout(() => setLabel(defaultLabel), 1800)
    }
  }

  const copyOwnerSummary = async () => {
    const summary = [
      `${project.projectName} ${project.revision}`,
      `งบประมาณปัจจุบัน: ${formatMoney(project.currentBudget, true)}`,
      `ส่วนต่างงบ: ${formatMoney(project.deltaAmount, true)}`,
      project.ownerSummary || 'รอตรวจสอบข้อมูล',
    ].join('\n')

    await copyToClipboard(
      summary,
      setCopyLabel,
      'คัดลอกแล้ว',
      'คัดลอกสรุปสำหรับเจ้าของ',
    )
  }

  const copyShareMessage = async () => {
    const message = `โปรดตรวจสอบสรุป BOQ สำหรับ ${project.projectName} หน้านี้สรุปงบประมาณปัจจุบัน การเปลี่ยนแปลงสำคัญ ความเสี่ยงด้านต้นทุน และสิ่งที่เจ้าของต้องตัดสินใจก่อนอนุมัติ`

    await copyToClipboard(
      message,
      setShareLabel,
      'คัดลอกแล้ว',
      'คัดลอกข้อความแชร์',
    )
  }

  return (
    <div className="owner-print-page mx-auto max-w-6xl space-y-6 bg-white text-stone-950 sm:p-8">
      <div className="no-print flex flex-col justify-between gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          to="/cost-dashboard"
          className="inline-flex min-h-11 items-center rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm shadow-stone-200/60 transition duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50"
        >
          กลับไปที่แดชบอร์ด
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={copyOwnerSummary}
            className="min-h-11 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm shadow-stone-200/60 transition duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50"
          >
            {copyLabel}
          </button>
          <button
            type="button"
            onClick={copyShareMessage}
            className="min-h-11 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm shadow-stone-200/60 transition duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50"
          >
            {shareLabel}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-11 rounded-xl border border-stone-950 bg-stone-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-stone-300/70 transition duration-200 hover:-translate-y-0.5 hover:bg-stone-800"
          >
            พิมพ์ / บันทึกเป็น PDF
          </button>
        </div>
      </div>

      <section className="print-card rounded-3xl border border-stone-200 bg-[#fbfaf7] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
          สรุปสำหรับเจ้าของโครงการ
        </p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              {project.projectName}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
              {project.ownerSummary || 'รอตรวจสอบข้อมูล'}
            </p>
          </div>
          <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4">
            {[
              ['แบรนด์', project.brand],
              ['สาขา', project.branch],
              ['รอบรีวิว', revisionStatus],
              [
                'สถานะ',
                project.status === 'Review' ? 'กำลังรีวิว' : project.status,
              ],
              ['งบประมาณปัจจุบัน', formatMoney(project.currentBudget, true)],
              ['งบประมาณรอบก่อน', formatMoney(project.previousBudget, true)],
              ['ส่วนต่างงบ', formatMoney(project.deltaAmount, true)],
              ['อัปเดตล่าสุด', project.lastUpdated ?? 'รอตรวจสอบข้อมูล'],
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
        <SectionCard className="print-card" title="รอตรวจสอบข้อมูล">
          <p className="text-sm leading-6 text-stone-600">
            โครงการนี้จะแสดงสรุปสำหรับเจ้าของได้เมื่อเพิ่มข้อมูล BOQ ที่ผ่านการตรวจสอบแล้ว
          </p>
        </SectionCard>
      ) : (
        <>
          <div className="print-grid grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionCard
              className="print-card"
              eyebrow="ส่วนต่างรอบรีวิว"
              title="การเปลี่ยนแปลงงบประมาณ"
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
              eyebrow="แยกหมวดต้นทุน"
              title="สัดส่วนงบประมาณ"
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
            eyebrow="ความเสี่ยงสำหรับเจ้าของ"
            title="ประเด็นที่ควรยืนยันก่อนอนุมัติ"
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
              eyebrow="สิ่งที่เจ้าของต้องตัดสินใจ"
              title="ยืนยันก่อนอนุมัติ"
            >
              <ul className="space-y-3">
                {[...ownerChecklist.map(getChecklistLabel), ...project.ownerSupplyItems].map((item) => (
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
              eyebrow="รายการที่เจ้าของจัดหา"
              title="จัดหาโดยเจ้าของ"
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
                <p className="text-sm text-stone-500">รอตรวจสอบข้อมูล</p>
              )}
            </SectionCard>
          </div>
        </>
      )}

      <footer className="print-card border-t border-stone-200 pt-5 text-center text-xs font-medium text-stone-400">
        จัดทำโดย Be Blank to Behind Studio
      </footer>
    </div>
  )
}

export default OwnerPresentation
