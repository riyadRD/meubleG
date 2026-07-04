import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { X, ShoppingCart, MessageSquare } from 'lucide-react'
import type { ToastEvent } from '@/hooks/useAdminRealtime'

// ── Single Toast item ─────────────────────────────────────────────────────────

const DISMISS_MS = 6000

interface AdminToastItemProps {
  evt: ToastEvent
  isRTL: boolean
  onDismiss: (id: string) => void
}

function AdminToastItem({ evt, isRTL, onDismiss }: AdminToastItemProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const start = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / DISMISS_MS) * 100)
      setProgress(remaining)
      if (remaining === 0) {
        clearInterval(intervalRef.current!)
        onDismiss(evt.id)
      }
    }, 50)

    return () => clearInterval(intervalRef.current!)
  }, [evt.id, onDismiss])

  const handleClick = useCallback(() => {
    onDismiss(evt.id)
    navigate(evt.type === 'order' ? '/admin/orders' : '/admin/messages')
  }, [evt.id, evt.type, navigate, onDismiss])

  const isOrder = evt.type === 'order'
  const isMessage = evt.type === 'message'
  const isSuccess = evt.type === 'success'
  const isError = evt.type === 'error'
  
  let accentColor = '#1f4d3a' // default
  if (isMessage) accentColor = '#7c3aed'
  if (isSuccess) accentColor = '#059669' // emerald-600
  if (isError) accentColor = '#dc2626'   // red-600

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isRTL ? -320 : 320, scale: 0.92 }}
      animate={{ opacity: 1,  x: 0,                 scale: 1    }}
      exit={{    opacity: 0,  x: isRTL ? -320 : 320, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      onClick={handleClick}
      className={`w-full max-w-sm md:w-80 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.14)] border border-gray-100 overflow-hidden select-none group pointer-events-auto ${!isSuccess && !isError ? 'cursor-pointer' : ''}`}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-gray-100">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accentColor }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      </div>

      <div className="p-4 flex items-start gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          {isOrder && <ShoppingCart className="w-5 h-5" style={{ color: accentColor }} />}
          {isMessage && <MessageSquare className="w-5 h-5" style={{ color: accentColor }} />}
          {isSuccess && (
            <svg className="w-5 h-5" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isError && (
            <svg className="w-5 h-5" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {(isSuccess || isError) ? (
            <div className="mt-1">
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {evt.message || (isSuccess ? t('admin.success', 'Succès') : t('admin.error', 'Erreur'))}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {evt.titleKey ? t(evt.titleKey) : ''}
              </p>
              {isOrder ? (
                <div className="mt-1.5 space-y-0.5 text-xs text-gray-600 font-medium">
                  <p><span className="text-gray-400 font-normal">{t('admin.notification.label_customer', 'Client')}:</span> {evt.name}</p>
                  {evt.product_name && <p><span className="text-gray-400 font-normal">{t('admin.notification.label_product', 'Produit')}:</span> {evt.product_name}</p>}
                  {evt.wilaya && <p><span className="text-gray-400 font-normal">{t('admin.notification.label_wilaya', 'Wilaya')}:</span> {evt.wilaya}</p>}
                  <p className="text-[10px] text-gray-400 mt-1.5 font-normal">{t('admin.notification.just_now', 'À l\'instant')}</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    {evt.bodyKey ? t(evt.bodyKey, { name: evt.name }) : ''}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1.5 font-medium uppercase tracking-wide">
                    {isRTL ? 'انقر للعرض' : 'Click to view'}
                  </p>
                </>
              )}
            </>
          )}
        </div>

        {/* Dismiss button */}
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(evt.id) }}
          className="p-1 text-gray-300 hover:text-gray-500 rounded-lg transition-colors shrink-0 -mr-1 -mt-1"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

// ── Toast Stack ───────────────────────────────────────────────────────────────

interface AdminToastProps {
  toasts: ToastEvent[]
  onDismiss: (id: string) => void
}

export default function AdminToast({ toasts, onDismiss }: AdminToastProps) {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  const positionClass = isRTL
    ? 'fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:bottom-6 z-[9999] flex flex-col gap-3 items-center md:items-start pointer-events-none'
    : 'fixed bottom-4 left-4 right-4 md:right-6 md:left-auto md:bottom-6 z-[9999] flex flex-col gap-3 items-center md:items-end pointer-events-none'

  return createPortal(
    <div className={positionClass}>
      <AnimatePresence mode="sync">
        {toasts.slice(-4).map((evt) => (
          <AdminToastItem
            key={evt.id}
            evt={evt}
            isRTL={isRTL}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}
