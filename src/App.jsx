import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CostDashboard from './pages/CostDashboard.jsx'
import OwnerPresentation from './pages/OwnerPresentation.jsx'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/cost-dashboard', label: 'REV01 Review' },
]

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
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-stone-200 bg-white text-sm font-semibold shadow-sm shadow-stone-200/60">
              BI
            </span>
            <div>
              <p className="text-sm font-semibold leading-5">BOQ Intelligence</p>
              <p className="text-xs text-stone-500">Architectural project review</p>
            </div>
          </NavLink>

          <nav className="flex w-full gap-1 rounded-xl border border-stone-200 bg-white p-1 shadow-sm sm:w-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium transition sm:flex-none',
                    isActive
                      ? 'bg-stone-950 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950',
                  ].join(' ')
                }
              >
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cost-dashboard" element={<CostDashboard />} />
          <Route path="/owner/:projectId" element={<OwnerPresentation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
