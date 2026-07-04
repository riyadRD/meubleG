import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoaderActive, setIsLoaderActive] = useState(() => !localStorage.getItem('gazameuble_visited'))

  useEffect(() => {
    const handleLoaderComplete = () => setIsLoaderActive(false)
    window.addEventListener('loader-complete', handleLoaderComplete)
    return () => window.removeEventListener('loader-complete', handleLoaderComplete)
  }, [])

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.products'), path: '/products' },
    { name: t('nav.showroom'), path: '/showroom' },
  ]

  const { scrollY } = useScroll()
  const headerY = useTransform(scrollY, [0, 100], [0, -10])
  const headerBg = useTransform(scrollY, [0, 100], ['rgba(253, 252, 247, 0.8)', 'rgba(253, 252, 247, 0.98)'])
  const headerBlur = useTransform(scrollY, [0, 100], ['blur(12px)', 'blur(24px)'])
  const headerShadow = useTransform(scrollY, [0, 100], ['0 10px 40px -10px rgba(0,0,0,0.05)', '0 20px 50px -10px rgba(0,0,0,0.1)'])

  // Logo transform
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center z-[80] pointer-events-none pt-4 md:pt-6 px-4 md:px-8">
        <motion.header
          style={{ 
            y: headerY, 
            backgroundColor: headerBg,
            backdropFilter: headerBlur,
            boxShadow: headerShadow,
          }}
          className="pointer-events-auto w-full max-w-[1100px] rounded-[2.5rem] border border-white/60 transition-all duration-300 relative flex items-center justify-between pl-2 pr-4 md:pl-4 md:pr-8 py-2 md:py-3"
        >
            
            {/* Left: Brand Lockup */}
            <div className="flex items-center z-20 shrink-0">
              <Link to="/" className="flex items-center gap-3 md:gap-4 group relative outline-none">
                <motion.div 
                  layoutId={isLoaderActive ? undefined : "brand-logo"}
                  style={{ scale: logoScale }}
                  transition={{ layout: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                  className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[80px] md:h-[80px] rounded-full overflow-hidden flex items-center justify-center group-hover:scale-105 shadow-sm relative z-10 shrink-0"
                >
                  <img 
                    src="/gazameuble-logo.png" 
                    alt="Gazameuble Logo" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                </motion.div>
                <motion.span 
                  style={{ scale: logoScale }}
                  className={`font-serif text-lg md:text-2xl text-premium-charcoal tracking-[0.2em] uppercase origin-left hidden lg:block ${i18n.language === 'ar' ? 'font-ar' : ''}`}
                >
                  Gazameuble
                </motion.span>
              </Link>
            </div>

            {/* Middle: Navigation */}
            <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
              <ul className={`flex items-center gap-10 ${i18n.language === 'ar' ? 'font-ar text-base' : 'font-sans text-[13px] font-bold tracking-[0.2em] uppercase'}`}>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path
                  return (
                    <li key={link.path} className="relative group">
                      <Link
                        to={link.path}
                        className={cn(
                          'py-2 transition-colors relative block outline-none',
                          isActive ? 'text-premium-charcoal' : 'text-premium-charcoal/50 hover:text-premium-charcoal'
                        )}
                      >
                        {link.name}
                        {isActive && (
                          <motion.div
                            layoutId="nav-underline"
                            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-premium-charcoal rounded-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        {!isActive && (
                          <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-premium-charcoal rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center justify-end gap-5 z-20">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.dispatchEvent(new Event('open-search'))}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 text-premium-charcoal border border-premium-soft shadow-sm hover:shadow-md hover:bg-white transition-all outline-none"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </motion.button>
                <LanguageSwitcher />
            </div>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex items-center gap-2 sm:gap-3 z-20 shrink-0">
              <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.dispatchEvent(new Event('open-search'))}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 text-premium-charcoal border border-premium-soft shadow-sm outline-none shrink-0"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
              </motion.button>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-premium-charcoal w-10 h-10 rounded-full flex items-center justify-center bg-white/50 border border-premium-soft shadow-sm outline-none shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

        </motion.header>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-premium-charcoal/60 backdrop-blur-sm z-[70] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: i18n.language === 'ar' ? '100%' : '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: i18n.language === 'ar' ? '100%' : '-100%', opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`fixed top-0 ${i18n.language === 'ar' ? 'right-0 border-l' : 'left-0 border-r'} h-[100dvh] w-[85vw] max-w-[320px] bg-premium-ivory/95 backdrop-blur-xl shadow-2xl z-[100] flex flex-col justify-between pt-6 pb-8 px-6 md:hidden border-premium-soft`}
              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            >
              {/* Top */}
              <div className="flex items-center justify-between shrink-0 mb-8">
                <motion.div layoutId={isLoaderActive ? undefined : "brand-logo-mobile"} className="w-[48px] h-[48px] rounded-full overflow-hidden flex items-center justify-center shadow-sm shrink-0 bg-white">
                  <img src="/gazameuble-logo.png" alt="Gazameuble" className="w-full h-full object-cover rounded-full" />
                </motion.div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.dispatchEvent(new Event('open-search'));
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 text-premium-charcoal border border-premium-soft shadow-sm outline-none shrink-0"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-premium-charcoal w-10 h-10 rounded-full flex items-center justify-center bg-white/50 border border-premium-soft shadow-sm outline-none shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Middle */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
                <ul className={`flex flex-col gap-6 text-2xl ${i18n.language === 'ar' ? 'font-ar' : 'font-serif'}`}>
                  {navLinks.map((link, i) => {
                    const isActive = location.pathname === link.path
                    return (
                      <motion.li 
                        key={link.path}
                        initial={{ opacity: 0, x: i18n.language === 'ar' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (i * 0.05) }}
                        className="group"
                      >
                        <Link
                          to={link.path}
                          className={cn(
                            'block py-4 border-b border-premium-soft/50 transition-colors relative outline-none w-full truncate',
                            isActive 
                              ? 'text-premium-charcoal font-medium' 
                              : 'text-premium-charcoal/60 hover:text-premium-charcoal'
                          )}
                        >
                          {link.name}
                          {isActive && (
                             <motion.div
                                layoutId="mobile-nav-underline"
                                className="absolute bottom-0 left-0 right-0 h-[1px] bg-premium-charcoal"
                             />
                          )}
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>
              </div>

              {/* Bottom */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="shrink-0 pt-6 border-t border-premium-soft/50 flex flex-col gap-4"
              >
                <span className="text-sm font-medium text-premium-charcoal/50 tracking-widest uppercase px-2">{t('nav.language')}</span>
                <div className="w-full">
                  <LanguageSwitcher fullWidth={true} />
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
