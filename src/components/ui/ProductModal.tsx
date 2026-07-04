import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Truck, ShieldCheck, Check, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '@/services/api'
import { Product } from '@/types'
import { useNavigate } from 'react-router-dom'

export const ProductModal = () => {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleOpen = async (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setIsOpen(true)
      setLoading(true)
      document.body.style.overflow = 'hidden'
      
      const found = await api.products.getById(customEvent.detail)
      if (found) {
        setProduct(found)
        setCurrentImageIndex(0)
      }
      setLoading(false)
    }

    window.addEventListener('open-product-modal', handleOpen)
    return () => window.removeEventListener('open-product-modal', handleOpen)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      setProduct(null)
      document.body.style.overflow = 'auto'
    }, 300)
  }

  if (!product) return null

  const formattedPrice = new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0
  }).format(product.price)

  const whatsappMessage = encodeURIComponent(`Bonjour, je suis intéressé(e) par le produit: ${product.title} (${product.id}). Est-il disponible ?`)

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-premium-charcoal/80 backdrop-blur-md flex flex-col md:flex-row overflow-hidden h-[100dvh]"
          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className={`fixed top-4 md:top-6 ${i18n.language === 'ar' ? 'left-4 md:left-6' : 'right-4 md:right-6'} z-[250] w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-105 hover:bg-black/80 transition-all duration-300`}
            style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)' }}
          >
            <X className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </button>

          {/* Left: Image Gallery */}
          <div className="w-full md:w-1/2 h-[40dvh] md:h-full bg-premium-ivory relative flex items-center justify-center shrink-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {product.images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-premium-soft">
                <button 
                  onClick={() => setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                  className="p-1 hover:bg-premium-soft rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-premium-charcoal" />
                </button>
                <div className="flex gap-3">
                  {product.images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-premium-charcoal' : 'bg-premium-charcoal/20'}`} 
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                  className="p-1 hover:bg-premium-soft rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-premium-charcoal" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 h-[60dvh] md:h-full overflow-y-auto bg-white p-6 md:p-16 scrollbar-hide pb-24 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-premium-sand">
                  {t(`categories.${product.category}`, { defaultValue: product.category })}
                </span>
                {product.in_stock ? (
                  <span className="flex items-center gap-1.5 text-xs font-serif text-premium-charcoal bg-premium-soft px-4 py-1.5 rounded-full">
                    <Check className="w-3.5 h-3.5" /> {t('product.in_stock', 'Disponible')}
                  </span>
                ) : (
                  <span className="text-xs font-serif text-premium-charcoal bg-premium-soft px-4 py-1.5 rounded-full">
                    {t('product.made_to_order', 'Sur commande')}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-serif text-premium-charcoal mb-4 md:mb-6 leading-tight">
                {product.title}
              </h1>
              
              <div className="text-2xl md:text-3xl font-serif text-premium-charcoal mb-6 md:mb-10">
                {formattedPrice}
              </div>

              <p className="text-base md:text-lg text-premium-charcoal/70 mb-8 md:mb-12 font-light leading-relaxed">
                {product.description}
              </p>

              <div className="mb-12">
                <h3 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-premium-charcoal mb-6">{t('product.details_title', 'Détails de la pièce')}</h3>
                <ul className="grid grid-cols-1 gap-4">
                  {product.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-4 text-premium-charcoal/80 font-light">
                      <div className="w-1.5 h-1.5 rounded-full bg-premium-sand mt-2.5 flex-shrink-0" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                  {(!product.features || product.features.length === 0) && (
                    <li className="text-premium-charcoal/60 font-light italic">{t('product.details_empty', 'Détails spécifiques sur demande')}</li>
                  )}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-8 py-8 border-y border-premium-soft mb-12">
                <div className="flex items-center gap-4 text-sm font-serif text-premium-charcoal">
                  <div className="w-10 h-10 bg-premium-ivory rounded-full flex items-center justify-center text-premium-sand">
                    <Truck className={`w-5 h-5 ${i18n.language === 'ar' ? 'transform -scale-x-100' : ''}`} />
                  </div>
                  {t('home.excellence.feat2.title')}
                </div>
                <div className="flex items-center gap-4 text-sm font-serif text-premium-charcoal">
                  <div className="w-10 h-10 bg-premium-ivory rounded-full flex items-center justify-center text-premium-sand">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  {t('home.excellence.feat3.title')}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    handleClose();
                    window.dispatchEvent(new CustomEvent('open-order-form', { detail: product }))
                  }}
                  className="w-full bg-premium-charcoal text-white py-4 md:py-5 rounded-full font-serif tracking-wider hover:bg-[#1a1a18] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 text-base md:text-lg"
                >
                  {t('product.order_now', 'Commander Maintenant')}
                </button>
              </div>

            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
