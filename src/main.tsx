import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AdminApp } from './admin/AdminApp.tsx'
import './index.css'

/**
 * There is no client-side router: the marketing site is a single page, and the
 * admin dashboard lives under `/admin`. GitHub Pages serves the built
 * `404.html` (a copy of `index.html`) for that deep link, so the app boots and
 * picks the right screen from the pathname.
 */
const path = window.location.pathname.replace(/\/+$/, '')
const isAdminRoute = path === '/admin' || path.endsWith('/admin')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isAdminRoute ? <AdminApp /> : <App />}</StrictMode>,
)
