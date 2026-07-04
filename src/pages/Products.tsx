import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Filter, ChevronDown, Check } from 'lucide-react'
import { api } from '@/services/api'
import { Product } from '@/types'
import { PremiumButton } from '@/components/ui/PremiumButton'
import { EmptyState } from '@/components/ui/EmptyState'

type SortOption = 'newest' | 'popular' | 'price-asc' | 'price-desc'

export const Products = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.products.getAll().then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const categories = useMemo(() => [
    { id: 'all', label: t('common.all') },
    ...Array.from(new Set(products.map(p => p.category))).map(cat => ({ id: cat, label: t(`categories.${cat}`, { defaultValue: cat }) }))
  ], [products, t])

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory)
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      )
    }

    if (inStockOnly) {
      result = result.filter(p => p.in_stock)
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return (a.is_new === b.is_new) ? 0 : a.is_new ? -1 : 1
        case 'popular': return (a.is_popular === b.is_popular) ? 0 : a.is_popular ? -1 : 1
        case 'price-asc': return a.price - b.price
        case 'price-desc': return b.price - a.price
        default: return 0
      }
    })

    return result
  }, [activeCategory, searchQuery, sortBy, inStockOnly, products])

  const openProduct = (product: Product) => {
    navigate(`/products/${product.id}`, { state: { product } })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div 
      className="pt-32 pb-24 bg-premium-ivory min-h-screen"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 md:px-12">
        <div className="mb-10 md:mb-16">
          <div className="text-center mb-8 md:mb-12 mt-10 md:mt-0">
            <h1 className="text-4xl md:text-6xl font-serif text-premium-charcoal mb-4">{t('products.title')}</h1>
            <p className="text-premium-charcoal/60 max-w-xl mx-auto font-light text-base md:text-lg">{t('products.subtitle')}</p>
          </div>
          
          {/* Top Control Bar */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-premium-soft flex flex-col lg:flex-row gap-3 items-center justify-between sticky top-20 md:top-24 z-30">
            {/* Search Input */}
            <div className="relative w-full lg:w-96 shrink-0">
              <input 
                type="text"
                placeholder={t('filters.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-premium-ivory rounded-xl px-4 md:px-6 py-3 md:py-3.5 outline-none focus:ring-1 focus:ring-premium-sand transition-all text-premium-charcoal placeholder:text-premium-charcoal/40 font-serif text-sm md:text-base"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row w-full lg:w-auto items-stretch lg:items-center justify-between lg:justify-end gap-3 md:gap-4 shrink-0">
              
              {/* Mobile Category Dropdown */}
              <div className="relative md:hidden w-full z-50">
                <button 
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full flex items-center justify-between bg-premium-ivory/50 border border-premium-soft rounded-xl px-4 py-3 text-premium-charcoal font-serif outline-none hover:border-premium-charcoal transition-all shadow-sm"
                >
                  <span className="truncate">{categories.find(c => c.id === activeCategory)?.label || t('common.all')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-premium-soft p-2 flex flex-col gap-1 z-50 max-h-60 overflow-y-auto"
                    >
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setActiveCategory(cat.id)
                            setIsCategoryDropdownOpen(false)
                          }}
                          className={`w-full text-${i18n.language === 'ar' ? 'right' : 'left'} px-4 py-3 rounded-lg font-serif transition-colors ${
                            activeCategory === cat.id ? 'bg-premium-charcoal text-white' : 'hover:bg-premium-ivory text-premium-charcoal'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop Category Pills */}
              <div className="hidden md:flex gap-2 overflow-x-auto scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-serif text-xs md:text-sm whitespace-nowrap transition-all border ${
                      activeCategory === cat.id 
                        ? 'bg-premium-charcoal text-premium-ivory border-premium-charcoal shadow-md' 
                        : 'bg-transparent text-premium-charcoal hover:bg-premium-soft border-transparent hover:border-premium-soft'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="w-px h-8 bg-premium-soft hidden lg:block" />

              {/* Sort & Filter (Mobile: side by side) */}
              <div className="flex gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 lg:flex-none flex justify-center items-center gap-2 px-4 md:px-5 py-3 md:py-2.5 rounded-xl font-serif text-xs md:text-sm text-premium-charcoal hover:bg-premium-soft border border-premium-soft transition-all whitespace-nowrap bg-white md:bg-transparent shadow-sm md:shadow-none"
                >
                  <Filter className="w-4 h-4" />
                  <span>{t('filters.filters')}</span>
                </button>

                <div className="relative group flex-1 lg:flex-none">
                  <button className="w-full flex justify-center items-center gap-2 px-4 md:px-5 py-3 md:py-2.5 rounded-xl font-serif text-xs md:text-sm text-premium-charcoal hover:bg-premium-soft border border-premium-soft transition-all whitespace-nowrap bg-white md:bg-transparent shadow-sm md:shadow-none">
                    <span>{t('filters.sort_by')}</span> <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className={`absolute ${i18n.language === 'ar' ? 'left-0' : 'right-0'} top-full mt-2 w-full min-w-[200px] md:w-56 bg-white rounded-xl shadow-xl border border-premium-soft p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40`}>
                    <button onClick={() => setSortBy('newest')} className={`w-full text-${i18n.language === 'ar' ? 'right' : 'left'} px-4 py-2.5 md:py-3 font-serif text-xs md:text-sm rounded-lg hover:bg-premium-ivory transition-colors ${sortBy === 'newest' ? 'text-premium-sand font-bold' : 'text-premium-charcoal'}`}>{t('filters.sort_newest')}</button>
                    <button onClick={() => setSortBy('popular')} className={`w-full text-${i18n.language === 'ar' ? 'right' : 'left'} px-4 py-2.5 md:py-3 font-serif text-xs md:text-sm rounded-lg hover:bg-premium-ivory transition-colors ${sortBy === 'popular' ? 'text-premium-sand font-bold' : 'text-premium-charcoal'}`}>{t('filters.sort_popular')}</button>
                    <button onClick={() => setSortBy('price-asc')} className={`w-full text-${i18n.language === 'ar' ? 'right' : 'left'} px-4 py-2.5 md:py-3 font-serif text-xs md:text-sm rounded-lg hover:bg-premium-ivory transition-colors ${sortBy === 'price-asc' ? 'text-premium-sand font-bold' : 'text-premium-charcoal'}`}>{t('filters.sort_price_asc')}</button>
                    <button onClick={() => setSortBy('price-desc')} className={`w-full text-${i18n.language === 'ar' ? 'right' : 'left'} px-4 py-2.5 md:py-3 font-serif text-xs md:text-sm rounded-lg hover:bg-premium-ivory transition-colors ${sortBy === 'price-desc' ? 'text-premium-sand font-bold' : 'text-premium-charcoal'}`}>{t('filters.sort_price_desc')}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-premium-soft flex gap-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={inStockOnly} 
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded border ${inStockOnly ? 'bg-premium-charcoal border-premium-charcoal' : 'bg-white border-premium-sand'} flex items-center justify-center transition-colors group-hover:border-premium-charcoal`}>
                        {inStockOnly && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                    <span className="text-premium-charcoal font-serif tracking-wide">{t('filters.in_stock_only')}</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10"
        >
          <AnimatePresence>
            {loading ? (
              <motion.div className="col-span-full py-20 flex justify-center">
                <div className="w-10 h-10 border-2 border-premium-sand border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full"
              >
                <EmptyState type="no-products" />
              </motion.div>
            ) : (
              filteredAndSortedProducts.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col border border-premium-soft relative cursor-pointer"
                  onClick={() => openProduct(product)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-premium-ivory">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {product.is_new && (
                         <div className="bg-white/90 backdrop-blur-md text-premium-charcoal px-4 py-1.5 rounded-full text-xs font-serif shadow-sm border border-premium-soft">
                          {t('product.new')}
                        </div>
                      )}
                      {!product.in_stock && (
                        <div className="bg-premium-charcoal/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-serif shadow-sm">
                          {t('product.made_to_order')}
                        </div>
                      )}
                    </div>
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-premium-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="bg-white text-premium-charcoal px-8 py-3 rounded-full font-serif text-sm transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg border border-premium-soft">
                        {t('product.discover')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col justify-between flex-grow bg-white">
                    <div>
                      <div className="flex justify-between items-start mb-2 md:mb-3">
                        <p className="text-[10px] md:text-xs text-premium-sand uppercase tracking-widest font-bold">
                          {t(`categories.${product.category}`, { defaultValue: product.category })}
                        </p>
                        <span className="font-serif text-premium-charcoal text-lg md:text-xl shrink-0 ml-2">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-serif text-premium-charcoal mb-6 line-clamp-2 group-hover:text-premium-sand transition-colors">{product.title}</h3>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.dispatchEvent(new CustomEvent('open-order-form', { detail: product }))
                      }}
                      className="w-full h-[44px] rounded-full bg-premium-charcoal text-premium-ivory transition-all duration-300 hover:bg-[#1a1a18] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(40,40,38,0.15)] shadow-sm font-serif text-sm tracking-wider flex items-center justify-center mt-auto shrink-0"
                    >
                      {t('product.order_now')}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default Products
