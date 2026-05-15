import { Link } from 'react-router-dom'

function ActionIcon({ name }) {
  const paths = {
    file: (
      <path d="M7 3.5h7l3 3V20.5H7V3.5Zm7 0V7h3M9.5 11h5M9.5 14.5h5M9.5 18h3" />
    ),
    clipboard: (
      <path d="M9 4.5h6M9.5 3h5l.5 2H9l.5-2ZM7 5h10v16H7V5Zm3 7h4M10 16h3" />
    ),
  }

  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  )
}

const highlights = [
  {
    label: 'โครงการ',
    value: 'Karun',
    detail: 'Phuket Old Town',
  },
  {
    label: 'รอบรีวิว',
    value: 'REV01',
    detail: 'ชุดข้อมูลสำหรับเจ้าของโครงการ',
  },
  {
    label: 'ส่วนต่างงบ',
    value: '-77k',
    detail: 'งบลดลงจากรอบก่อน',
  },
]

function Home() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/60 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium text-stone-500">
            ระบบวิเคราะห์ BOQ
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            แปลง BOQ ให้เป็นสรุปที่เจ้าของโครงการอ่านเข้าใจได้ทันที
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            ดูภาพรวมงบประมาณ ส่วนต่างจากรอบก่อน รายการความเสี่ยง
            และสิ่งที่ต้องตัดสินใจก่อนอนุมัติ เริ่มจาก Karun Phuket Old Town
            REV01
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/cost-dashboard"
              className="inline-flex min-h-11 min-w-[9rem] items-center justify-center gap-2 rounded-xl border border-stone-950 bg-stone-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-stone-300/70 transition duration-200 hover:-translate-y-0.5 hover:bg-stone-800"
            >
              <ActionIcon name="file" />
              เปิดรีวิว REV01
            </Link>
            <a
              href="#overview"
              className="inline-flex min-h-11 min-w-[9rem] items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm shadow-stone-200/60 transition duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50"
            >
              <ActionIcon name="clipboard" />
              สรุปรีวิว
            </a>
          </div>
        </div>
      </div>

      <div
        id="overview"
        className="rounded-2xl border border-stone-200 bg-[#ece8df] p-5 shadow-sm shadow-stone-200/60 sm:p-6"
      >
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-stone-500">วันนี้</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                สถานะรีวิว
              </h2>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              พร้อมรีวิว
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
