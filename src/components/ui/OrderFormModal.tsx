import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Product } from '@/types'
import { PremiumButton } from './PremiumButton'
import { api } from '@/services/api'

import { WILAYA_OPTIONS } from '@/constants/wilayas'


export const OrderFormModal = () => {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    address: '',
    quantity: 1,
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorToast, setErrorToast] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Success auto-close
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        handleClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  // Escape key & Overflow management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      // Focus name input slightly after opening to allow animation to start smoothly
      setTimeout(() => {
        if (nameInputRef.current) nameInputRef.current.focus()
      }, 100)
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<Product>
      setProduct(customEvent.detail)
      setIsOpen(true)
      // Overflow is handled by the other useEffect
    }

    window.addEventListener('open-order-form', handleOpen)
    return () => window.removeEventListener('open-order-form', handleOpen)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      setProduct(null)
      setFormData({ fullName: '', phone: '', wilaya: '', address: '', quantity: 1, message: '' })
      setIsSuccess(false)
      setErrorToast(null)
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setIsSubmitting(true)

    // Save order in backend
    const { success } = await api.orders.submitRequest({
      ...formData,
      productId: product.id,
      productName: product.title,
      timestamp: new Date().toISOString()
    })

    setIsSubmitting(false)
    if (success) {
      setIsSuccess(true)
    } else {
      setErrorToast(t('order.error', 'Une erreur est survenue. Veuillez réessayer.'))
      setTimeout(() => setErrorToast(null), 3000)
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-primary/60 backdrop-blur-md"
            onClick={handleClose}
          />
          
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-full"
              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            >
              <AnimatePresence>
                {errorToast && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 left-4 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg font-medium text-sm text-center"
                  >
                    {errorToast}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Header */}
              <div className="bg-accent/30 p-6 border-b border-border flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-xl font-serif text-primary font-bold">{t('order.title', 'Demande de commande')}</h3>
                  <p className="text-sm text-primary/60 mt-1">{t('order.product', 'Produit:')} <span className="font-medium text-primary">{product.title}</span></p>
                </div>
              <button 
                onClick={handleClose}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-primary/5 transition-colors"
              >
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-primary mb-3">{t('order.success_title', 'Commande Confirmée !')}</h3>
                <p className="text-primary/70 mb-8">{t('order.success')}</p>
                <PremiumButton onClick={handleClose} className="w-full justify-center">
                  {t('order.close', 'Fermer')}
                </PremiumButton>
              </div>
            ) : (
              <>
                {/* Form */}
                <div className="p-6 overflow-y-auto">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5" id="order-form">
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-primary">{t('order.fullname', 'Nom complet *')}</label>
                      <input 
                        ref={nameInputRef}
                        required
                        type="text"
                        placeholder={t('order.fullname_placeholder', 'Votre nom et prénom')}
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-accent/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-primary">{t('order.phone', 'Numéro de téléphone *')}</label>
                      <input 
                        required
                        type="tel"
                        placeholder={t('order.phone_placeholder', 'ex: 0553 17 44 84')}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-accent/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all text-left"
                        dir="ltr"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-primary">{t('order.wilaya', 'Wilaya de livraison *')}</label>
                        <select 
                          required
                          value={formData.wilaya}
                          onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                          className="w-full bg-accent/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all appearance-none"
                        >
                          <option value="" disabled>{t('order.wilaya_placeholder', 'Sélectionnez votre wilaya')}</option>
                          {WILAYA_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-primary">{t('order.quantity', 'Quantité *')}</label>
                        <input 
                          required
                          type="number"
                          min="1"
                          max="10"
                          value={formData.quantity}
                          onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                          className="w-full bg-accent/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-primary">{t('order.address', 'Adresse complète *')}</label>
                      <input 
                        required
                        type="text"
                        placeholder={t('order.address_placeholder', 'Votre adresse de livraison')}
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-accent/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-primary">{t('order.message', 'Message supplémentaire (Optionnel)')}</label>
                      <textarea 
                        rows={3}
                        placeholder={t('order.message_placeholder', 'Précisez la couleur, les dimensions...')}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-accent/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-none"
                      />
                    </div>

                  </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-white shrink-0">
                  <button 
                    type="submit"
                    form="order-form"
                    disabled={isSubmitting}
                    className="w-full bg-premium-charcoal hover:bg-black text-white font-serif py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isSubmitting ? t('order.processing', 'Traitement en cours...') : t('order.submit', 'Confirmer la commande')}
                  </button>
                  <p className="text-xs text-center text-primary/50 mt-4">
                    {t('order.info', 'Vos informations sont sécurisées et ne seront utilisées que pour la livraison.')}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
