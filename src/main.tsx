import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SiteApp from './site/SiteApp'

// The editor is only downloaded when someone opens /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'))

const isAdmin = /^\/admin\/?$/.test(location.pathname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ) : (
      <SiteApp />
    )}
  </StrictMode>,
)
