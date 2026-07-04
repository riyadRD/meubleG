import { useEffect } from 'react'
import { Outlet, useLocation, useOutlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import { GlobalSearch } from '../ui/GlobalSearch'
import { ProductModal } from '../ui/ProductModal'
import { FloatingContactWidget } from '../ui/FloatingContactWidget'
import { OrderFormModal } from '../ui/OrderFormModal'

const Layout = () => {
  const location = useLocation()
  const outlet = useOutlet()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <GlobalSearch />
      <ProductModal />
      <OrderFormModal />
      <FloatingContactWidget />
      
      <AnimatePresence>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-grow pt-20" // Add padding to account for fixed navbar
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default Layout
