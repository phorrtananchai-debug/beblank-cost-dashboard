import { Link } from 'react-router-dom'

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
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/cost-dashboard"
              className="inline-flex justify-center rounded-lg bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
            >
              เปิดรีวิว REV01
            </Link>
            <a
              href="#overview"
              className="inline-flex justify-center rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
            >
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
