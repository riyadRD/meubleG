import { useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import Layout from './components/layout/Layout'
import { Loader } from './components/layout/Loader'
// ProductDetails is eagerly imported — never lazy — so Suspense never blocks it
import ProductDetails from './pages/ProductDetails'

// Lazy loaded pages for performance (non-critical paths)
const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const Showroom = lazy(() => import('./pages/Showroom'))
const Contact = lazy(() => import('./pages/Contact'))

// Admin imports
import { AuthProvider } from './components/admin/AuthProvider'
import { Outlet, Navigate } from 'react-router-dom'
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminSetup = lazy(() => import('./pages/admin/Setup'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('./pages/admin/Products'))
const AdminCategories = lazy(() => import('./pages/admin/Categories'))
const AdminOrders = lazy(() => import('./pages/admin/Orders'))
const AdminMessages = lazy(() => import('./pages/admin/Messages'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))

// Simple fallback for Suspense during navigation
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-accent/10">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
)

function App() {
  const { i18n } = useTranslation()
  // Only show loader once per session — never on navigation or re-renders
  const [showLoader, setShowLoader] = useState(() => {
    return !sessionStorage.getItem('gazameuble_loader_shown')
  })

  useEffect(() => {
    // Check if first visit
    // const hasVisited = localStorage.getItem('gazameuble_visited')
    // if (!hasVisited) {
    //   setShowLoader(true)
    // }

    // Set layout direction on initial load
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const handleLoaderComplete = () => {
    sessionStorage.setItem('gazameuble_loader_shown', '1')
    localStorage.setItem('gazameuble_visited', 'true')
    window.dispatchEvent(new Event('loader-complete'))
    setShowLoader(false)
  }

  return (
    <LayoutGroup>
      <AnimatePresence>
        {showLoader && <Loader onComplete={handleLoaderComplete} />}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showLoader ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={showLoader ? "pointer-events-none h-[100dvh] overflow-hidden" : ""}
      >
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={
                  <Suspense fallback={<PageFallback />}><Home /></Suspense>
                } />
                <Route path="products" element={
                  <Suspense fallback={<PageFallback />}><Products /></Suspense>
                } />
                <Route path="products/:id" element={<ProductDetails />} />
                <Route path="showroom" element={
                  <Suspense fallback={<PageFallback />}><Showroom /></Suspense>
                } />
                <Route path="contact" element={
                  <Suspense fallback={<PageFallback />}><Contact /></Suspense>
                } />
                <Route path="about" element={<Navigate to="/" replace />} />
                <Route path="home" element={<Navigate to="/" replace />} />
              </Route>

              {/* Top-level Admin Aliases */}
              <Route path="/login" element={<Navigate to="/admin/login" replace />} />
              <Route path="/categories" element={<Navigate to="/admin/categories" replace />} />
              <Route path="/orders" element={<Navigate to="/admin/orders" replace />} />
              <Route path="/messages" element={<Navigate to="/admin/messages" replace />} />
              <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <Suspense fallback={<PageFallback />}>
                  <AuthProvider>
                    <Outlet />
                  </AuthProvider>
                </Suspense>
              }>
                <Route path="login" element={<Suspense fallback={<PageFallback />}><AdminLogin /></Suspense>} />
                <Route path="setup" element={<Suspense fallback={<PageFallback />}><AdminSetup /></Suspense>} />
                <Route element={<Suspense fallback={<PageFallback />}><AdminLayout /></Suspense>}>
                  <Route path="dashboard" element={<Suspense fallback={<PageFallback />}><Dashboard /></Suspense>} />
                  <Route path="products" element={<Suspense fallback={<PageFallback />}><AdminProducts /></Suspense>} />
                  <Route path="categories" element={<Suspense fallback={<PageFallback />}><AdminCategories /></Suspense>} />
                  <Route path="orders" element={<Suspense fallback={<PageFallback />}><AdminOrders /></Suspense>} />
                  <Route path="messages" element={<Suspense fallback={<PageFallback />}><AdminMessages /></Suspense>} />
                  <Route path="settings" element={<Suspense fallback={<PageFallback />}><AdminSettings /></Suspense>} />
                </Route>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
              </Route>

              {/* Catch-all route to prevent blank pages on unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
      </motion.div>
    </LayoutGroup>
  )
}

export default App
