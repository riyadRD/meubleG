import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '@/services/api'
import { Product } from '@/types'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from './EmptyState'

export const GlobalSearch = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.products.getAll().then(data => setProducts(data))

    const handleOpen = () => {
      setIsOpen(true)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleOpen()
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('open-search', handleOpen)
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('open-search', handleOpen)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const results = query.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5) // Limit to 5 results

  const handleSelect = (productId: string) => {
    setIsOpen(false)
    setQuery('')
    const selectedProduct = products.find(p => p.id === productId)
    if (selectedProduct) {
      navigate(`/products/${productId}`, { state: { product: selectedProduct } })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-premium-charcoal/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-4 md:top-[15%] inset-x-0 z-[101] flex justify-center pointer-events-none"
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl border border-premium-soft font-serif pointer-events-auto flex flex-col overflow-hidden w-full mx-4"
              style={{ maxWidth: '42rem', maxHeight: 'calc(100dvh - 32px)' }}
              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            >
              {/* Search Input */}
              <div className="flex items-center px-4 md:px-6 py-4 md:py-5 border-b border-premium-soft shrink-0">
                <Search className={`w-5 h-5 md:w-6 md:h-6 text-premium-charcoal/50 ${i18n.language === 'ar' ? 'ml-3' : 'mr-3'} shrink-0`} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search.placeholder', 'Rechercher des salons, chambres, tables...')}
                  className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-premium-charcoal placeholder:text-premium-charcoal/40 font-serif min-w-0"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 -mr-2 hover:bg-premium-ivory rounded-full transition-colors text-premium-charcoal/50 shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results */}
              <div className="overflow-y-auto p-2 scrollbar-hide flex-1 min-h-[50dvh] md:min-h-0">
                {query.trim() === '' ? (
                  <div className="px-4 py-8 md:py-12 text-center text-premium-charcoal/40 text-sm font-light">
                    {t('search.empty_hint', 'Rechercher un produit ou une catégorie')}
                  </div>
                ) : results.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {results.map(product => (
                      <button
                        key={product.id}
                        onClick={() => handleSelect(product.id)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-premium-ivory transition-colors w-full text-left group"
                      >
                        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                          <img 
                            src={product.images[0]} 
                            alt={product.title} 
                            className="w-12 h-12 object-cover rounded-lg border border-premium-soft shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-serif text-premium-charcoal truncate text-sm md:text-base">{product.title}</h4>
                            <p className="text-[10px] md:text-xs text-premium-sand uppercase tracking-widest font-bold truncate">
                              {t(`categories.${product.category}`, { defaultValue: product.category })}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-premium-charcoal/30 group-hover:text-premium-sand transition-colors shrink-0 ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 md:py-8">
                    <EmptyState type="no-search-results" />
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="bg-premium-ivory/50 px-4 py-3 text-[10px] md:text-xs text-premium-charcoal/50 border-t border-premium-soft flex justify-between items-center font-sans shrink-0">
                <span className="hidden sm:inline">{t('search.esc_to_close', 'Appuyez sur Esc pour fermer').replace('Esc', '')} <kbd className="bg-white border border-premium-soft px-1.5 py-0.5 rounded shadow-sm">Esc</kbd></span>
                <span className="sm:hidden">{t('search.search_by', 'Recherche par')}</span>
                <span className="flex items-center gap-2">
                  <span className="hidden sm:inline">{t('search.search_by', 'Recherche par')}</span>
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden flex items-center justify-center opacity-50 grayscale border border-premium-soft shrink-0">
                    <img src="/gazameuble-logo.png" alt="Gazameuble" className="w-full h-full object-cover" />
                  </div>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
