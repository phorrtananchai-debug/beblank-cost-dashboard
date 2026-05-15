import { lazy, Suspense } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home.jsx'))
const CostDashboard = lazy(() => import('./pages/CostDashboard.jsx'))
const OwnerPresentation = lazy(() => import('./pages/OwnerPresentation.jsx'))

const navItems = [
  { to: '/', label: 'หน้าแรก', icon: 'home' },
  { to: '/cost-dashboard', label: 'รีวิว REV01', icon: 'file' },
]

function NavIcon({ name }) {
  const paths = {
    home: (
      <path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1v-9.5Z" />
    ),
    file: (
      <path d="M7 3.5h7l3 3V20.5H7V3.5Zm7 0V7h3M9.5 11h5M9.5 14.5h5M9.5 18h3" />
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

function LoadingPage() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm font-medium text-stone-500 shadow-sm shadow-stone-200/60">
        กำลังโหลดแดชบอร์ด
      </div>
    </div>
  )
}

function App() {
  const location = useLocation()
  const isOwnerPage = location.pathname.startsWith('/owner/')

  return (
    <div
      className={[
        'min-h-screen text-stone-950',
        isOwnerPage ? 'bg-white' : 'bg-[#f7f5ef]',
      ].join(' ')}
    >
      <header
        className={[
          'border-b border-stone-200/80 bg-stone-50/90 backdrop-blur',
          isOwnerPage ? 'hidden' : '',
        ].join(' ')}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between lg:px-8">
          <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-stone-200 bg-white text-sm font-semibold shadow-sm shadow-stone-200/60">
              BI
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-5">ระบบวิเคราะห์ BOQ</p>
              <p className="text-xs leading-5 text-stone-500">
                สรุปต้นทุนและความเสี่ยงโครงการ
              </p>
            </div>
          </NavLink>

          <nav className="flex w-full flex-wrap gap-2 rounded-2xl border border-stone-200 bg-white/90 p-1.5 shadow-sm shadow-stone-200/70 md:w-auto md:flex-nowrap">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'inline-flex min-h-11 min-w-[8.5rem] flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-center text-sm font-medium leading-5 transition duration-200 ease-out md:flex-none',
                    isActive
                      ? 'border-stone-950 bg-stone-950 text-white shadow-sm shadow-stone-300/70'
                      : 'border-stone-200 bg-white text-stone-800 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:shadow-sm',
                  ].join(' ')
                }
              >
                <NavIcon name={item.icon} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main
        className={[
          'mx-auto w-full px-5 py-6 sm:py-8 lg:px-8',
          isOwnerPage ? 'max-w-none bg-white' : 'max-w-7xl',
        ].join(' ')}
      >
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cost-dashboard" element={<CostDashboard />} />
            <Route path="/owner/:projectId" element={<OwnerPresentation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
