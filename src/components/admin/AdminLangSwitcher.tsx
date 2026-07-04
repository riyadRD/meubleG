import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'

const LANGUAGES = [
  { code: 'fr', label: 'Français',  flag: '🇫🇷' },
  { code: 'en', label: 'English',   flag: '🇺🇸' },
  { code: 'ar', label: 'العربية',  flag: '🇩🇿' },
] as const

export default function AdminLangSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0]
  const isRTL   = i18n.language === 'ar'

  const switchLang = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('gazameuble_lang', code)
    document.documentElement.dir  = code === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
    setOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative" dir="ltr">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 transition-all"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline text-xs">{current.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-1.5 ${isRTL ? 'left-0' : 'right-0'} w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden`}
          role="listbox"
        >
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              role="option"
              aria-selected={lang.code === i18n.language}
              onClick={() => switchLang(lang.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
                lang.code === i18n.language
                  ? 'bg-primary/5 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
              {lang.code === i18n.language && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
