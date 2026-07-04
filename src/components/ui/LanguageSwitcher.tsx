import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇩🇿' },
]

export const LanguageSwitcher = ({ fullWidth = false }: { fullWidth?: boolean }) => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [direction, setDirection] = useState<'down' | 'up'>('down')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeLang = languages.find(l => l.code === i18n.language) || languages[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      // Require at least 220px below for the dropdown (approx 3 items)
      if (spaceBelow < 220) {
        setDirection('up')
      } else {
        setDirection('down')
      }
    }
  }, [isOpen])

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('gazameuble_lang', code)
    setIsOpen(false)
  }

  return (
    <div className={cn("relative z-50", fullWidth ? "w-full" : "")} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center py-2.5 rounded-full bg-white/50 hover:bg-white border border-premium-soft shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_0_20px_rgba(40,40,38,0.1)] transition-all duration-300 outline-none text-[14px] font-medium text-premium-charcoal",
          fullWidth ? "w-full px-6 justify-between" : "gap-3 px-5"
        )}
      >
        <div className="flex items-center gap-3">
          <Globe className="w-[18px] h-[18px] opacity-70" />
          <span className="tracking-widest uppercase">{activeLang.code}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 opacity-70" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'down' ? 15 : -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === 'down' ? 15 : -15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute rounded-2xl bg-premium-ivory/95 backdrop-blur-xl border border-premium-soft shadow-[0_20px_40px_-10px_rgba(40,40,38,0.15)] overflow-hidden z-[100]",
              direction === 'down' ? 'top-full mt-3' : 'bottom-full mb-3',
              fullWidth ? "left-0 right-0 w-full" : "right-0 w-52"
            )}
          >
            <div className="p-2 flex flex-col gap-1">
              {languages.map((lang) => {
                const isActive = lang.code === activeLang.code
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-[14px] transition-all duration-200 outline-none",
                      isActive 
                        ? "bg-premium-soft/50 text-premium-charcoal font-bold" 
                        : "text-premium-charcoal/70 hover:bg-premium-soft/30 hover:text-premium-charcoal font-medium"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="tracking-wide">{lang.label}</span>
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Check className="w-4 h-4 text-premium-charcoal" />
                      </motion.div>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
