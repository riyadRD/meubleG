import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LoaderProps {
  onComplete?: () => void
}

export const Loader = ({ onComplete }: LoaderProps) => {
  const { i18n } = useTranslation()
  const [stage, setStage] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  const getTagline = () => {
    switch (i18n.language) {
      case 'fr': return "L'Art de l'Ameublement"
      case 'ar': return "صناعة الأثاث الفاخر"
      case 'en': 
      default: return "The Art of Fine Furniture"
    }
  }

  useEffect(() => {
    // 0.0s: Mount, soft ivory, tiny golden glow (via initial styles)
    // 0.2s: Logo scales 0.75 -> 1.0, opacity 0->1, blur->sharp (handled by CSS delay/Framer delay)
    const t1 = setTimeout(() => setStage(1), 600)   // 0.6s: Reveal letters one by one
    const t2 = setTimeout(() => setStage(2), 1200)  // 1.2s: Reveal tagline (fade + upward)
    const t3 = setTimeout(() => setStage(3), 1700)  // 1.7s: Golden light sweep
    const t4 = setTimeout(() => setStage(4), 2100)  // 2.1s: Breathe (scale 1 -> 1.03 -> 1)
    
    // 2.4s: Smoothly shrink, morph to navbar, crossfade page
    const t5 = setTimeout(() => {
      setStage(5)
      if (onComplete) onComplete()
    }, 2400) 

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [onComplete])

  const brandName = "GAZAMEUBLE".split("")

  return (
    <AnimatePresence>
      {stage < 5 && (
        <motion.div
          key="loader-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 w-full h-[100dvh] z-[99999] bg-[#FDFCF7] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Subtle Warm Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--premium-beige)_0%,transparent_70%)] opacity-40 pointer-events-none" />

          {/* Centered Content */}
          <div className="relative flex flex-col items-center justify-center z-10 w-full h-full pb-16">
            
            {/* Logo Wrapper (Fades in over 0.8s after 0.2s delay) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, filter: shouldReduceMotion ? 'none' : 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="relative flex items-center justify-center"
            >
              {/* layoutId Morph Element */}
              <motion.div
                layoutId="brand-logo"
                initial={{ boxShadow: '0 0 10px rgba(212,175,55,0.4)' }}
                animate={stage >= 4 && !shouldReduceMotion ? {
                  scale: [1, 1.03, 1],
                  boxShadow: ['0 0 40px rgba(212,175,55,0.15)', '0 0 60px rgba(212,175,55,0.3)', '0 0 40px rgba(212,175,55,0.15)']
                } : { 
                  scale: 1, 
                  boxShadow: '0 0 40px rgba(212,175,55,0.15)' 
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative w-[180px] h-[180px] rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm"
              >
                <img 
                  src="/gazameuble-logo.png" 
                  alt="Gazameuble" 
                  className="w-full h-full object-cover relative z-10 rounded-full" 
                />
                
                {/* Golden light sweep effect (starts at 1.7s) */}
                {!shouldReduceMotion && (
                  <motion.div
                    initial={{ left: '-150%' }}
                    animate={{ left: stage >= 3 ? '150%' : '-150%' }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[30deg] z-20 pointer-events-none"
                    style={{ mixBlendMode: 'overlay' }}
                  />
                )}
              </motion.div>
            </motion.div>

            {/* Brand Name Letter Reveal (Starts at 0.6s) */}
            <div className="mt-10 flex space-x-1 sm:space-x-2 overflow-hidden px-4" dir="ltr">
              {brandName.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  animate={{ 
                    opacity: stage >= 1 ? 1 : 0, 
                    y: stage >= 1 ? 0 : (shouldReduceMotion ? 0 : 20)
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: stage >= 1 ? index * 0.045 : 0 // 45ms exactly
                  }}
                  className={`text-2xl sm:text-3xl lg:text-4xl tracking-[0.3em] font-serif text-premium-charcoal ${i18n.language === 'ar' ? 'font-ar' : ''}`}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Luxury Tagline Reveal (Starts at 1.2s) */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15, filter: shouldReduceMotion ? 'none' : 'blur(4px)' }}
              animate={{ 
                opacity: stage >= 2 ? 0.7 : 0,
                y: stage >= 2 ? 0 : (shouldReduceMotion ? 0 : 15),
                filter: stage >= 2 ? 'blur(0px)' : (shouldReduceMotion ? 'none' : 'blur(4px)')
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1]
              }}
              className={`mt-6 text-sm sm:text-base tracking-[0.15em] text-premium-charcoal/80 text-center ${i18n.language === 'ar' ? 'font-ar font-medium' : 'font-serif italic'}`}
            >
              {getTagline()}
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

