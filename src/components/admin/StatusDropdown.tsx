import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Clock3, CheckCircle2, PackageCheck, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled'

interface StatusDropdownProps {
  value: OrderStatus
  onChange: (newStatus: OrderStatus) => void
  disabled?: boolean
}

export default function StatusDropdown({ value, onChange, disabled }: StatusDropdownProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const statuses: { value: OrderStatus; label: string; icon: any; color: string; bg: string }[] = [
    { value: 'pending',   label: t('admin.orders.status.pending', 'Pending'),      icon: Clock3,       color: '#B7791F', bg: '#FFF8E8' },
    { value: 'confirmed', label: t('admin.orders.status.confirmed', 'Confirmed'),  icon: CheckCircle2, color: '#2563EB', bg: '#EEF4FF' },
    { value: 'delivered', label: t('admin.orders.status.delivered', 'Delivered'),  icon: PackageCheck, color: '#027A48', bg: '#ECFDF3' },
    { value: 'cancelled', label: t('admin.orders.status.cancelled', 'Cancelled'),  icon: XCircle,      color: '#D92D20', bg: '#FEF3F2' },
  ]

  const current = statuses.find(s => s.value === value) || statuses[0]
  const Icon = current.icon

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} dir={isRTL ? 'rtl' : 'ltr'}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: current.bg, color: current.color }}
      >
        <Icon className="w-3.5 h-3.5" />
        {current.label}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="ml-1"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`absolute z-50 mt-2 w-40 bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden ${
              isRTL ? 'right-0' : 'left-0'
            }`}
          >
            <div className="p-1">
              {statuses.map((status) => {
                const SIcon = status.icon
                const isSelected = status.value === value
                return (
                  <button
                    key={status.value}
                    onClick={() => {
                      if (!isSelected) onChange(status.value)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                    style={{ color: status.color }}
                  >
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: status.bg }}>
                      <SIcon className="w-3.5 h-3.5" />
                    </div>
                    {status.label}
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
