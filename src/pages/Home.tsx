import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Instagram, Star, Shield, Truck } from 'lucide-react'
import { api } from '@/services/api'
import { Link, useNavigate } from 'react-router-dom'
import { Product } from '@/types'
import { useTranslation } from 'react-i18next'

const HERO_IMAGES = ['/photo1.jpeg', '/photo2.jpeg', '/photo3.jpeg']

// Preload all hero images before the slider mounts
HERO_IMAGES.forEach(src => {
  const img = new Image()
  img.src = src
})

const FadeIn = ({ children, delay = 0, y = 30 }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

const Home = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const heroRef = useRef<HTMLDivElement>(null)
  const [bestSellers, setBestSellers] = useState<Product[]>([])

  // ── Slider state ──
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % HERO_IMAGES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)
  }, [])

  const goToSlide = useCallback((idx: number) => {
    setCurrentSlide(idx)
  }, [])

  // Computed next-slide index for preloading
  const nextSlideIndex = (currentSlide + 1) % HERO_IMAGES.length

  // Auto-advance every 5s; reset timer on manual navigation
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [nextSlide, currentSlide])

  useEffect(() => {
    api.products.getAll().then(products => {
      setBestSellers(products.filter(p => p.is_popular))
    })
  }, [])

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
      className="w-full bg-premium-ivory text-premium-charcoal overflow-hidden font-serif"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >

      {/* ─── 1. Hero Section with Fullscreen Slider ─── */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">

        {/* ── Slider Background Stack ── */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="absolute inset-0 will-change-transform"
            >
              {/* Ken Burns zoom — GPU-composited via transform only */}
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1 }}
                animate={{ scale: 1.08 }}
                transition={{ duration: 6, ease: 'linear' }}
                style={{ 
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
                }}
              >
                <img
                  src={HERO_IMAGES[currentSlide]}
                  alt="Showroom Gazameuble"
                  className="w-full h-full object-cover object-center select-none pointer-events-none"
                  draggable={false}
                  fetchPriority="high"
                  decoding="sync"
                  style={{ 
                    imageRendering: 'high-quality',
                    filter: 'blur(0)',
                    WebkitFilter: 'blur(0)'
                  }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Preload next image invisibly */}
          <img
            src={HERO_IMAGES[nextSlideIndex]}
            alt=""
            aria-hidden
            className="absolute opacity-0 w-px h-px"
          />

          {/* Dark luxury overlay */}
          <div className="absolute inset-0 bg-black/28 z-10" />
          {/* Bottom fade to match site bg */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-premium-ivory to-transparent z-10" />
        </div>

        {/* ── Hero Content ── */}
        <div className="container relative z-20 mx-auto px-6 lg:px-12 flex flex-col items-center justify-center text-center pt-32 pb-32 md:pt-40 md:pb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30"
          >
            <span className="text-white/90 text-xs tracking-[0.3em] uppercase font-medium">{t('home.hero.badge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-serif text-white leading-[1.1] md:leading-[1.05] mb-6 md:mb-8 drop-shadow-lg"
          >
            {t('home.hero.title1')} <br />
            <span className="italic font-light text-white/85">{t('home.hero.title2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/75 mb-8 md:mb-12 max-w-2xl font-light leading-relaxed px-4"
          >
            {t('home.hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto px-6"
          >
            <Link
              to="/products"
              className="w-full sm:w-auto bg-white text-premium-charcoal px-8 sm:px-10 py-4 rounded-full font-serif tracking-wider hover:bg-premium-ivory transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              {t('home.hero.btn_products')}
            </Link>
            <Link
              to="/showroom"
              className="w-full sm:w-auto bg-white/15 backdrop-blur-md border border-white/40 text-white px-8 sm:px-10 py-4 rounded-full font-serif tracking-wider hover:bg-white/25 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t('home.hero.btn_showroom')}
            </Link>
          </motion.div>
        </div>

        {/* ── Arrow Controls ── */}
        <button
          onClick={prevSlide}
          aria-label="Image précédente"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-105 group"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-0.5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Image suivante"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-105 group"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* ── Dot Indicators ── */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className="relative flex items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  idx === currentSlide
                    ? 'w-8 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>

      </section>

      {/* 2. Brand Identity Focus */}
      <section className="py-20 md:py-32 bg-premium-ivory relative z-20 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <FadeIn>
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-lg border border-premium-soft">
              <img src="/gazameuble-logo.png" alt="Gazameuble" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif text-premium-charcoal max-w-4xl mx-auto leading-relaxed md:leading-relaxed font-light px-4">
              "{t('home.quote')}"
            </h2>
            <div className="w-px h-16 md:h-24 bg-premium-sand mx-auto mt-12 md:mt-16" />
          </FadeIn>
        </div>
      </section>

      {/* 3. Featured Collections */}
      <section className="py-16 md:py-24 bg-premium-soft">
        <div className="container mx-auto px-4 md:px-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4 md:gap-6">
              <div>
                <span className="text-premium-charcoal/50 text-xs tracking-[0.3em] uppercase font-bold mb-3 md:mb-4 block">{t('home.collections.badge')}</span>
                <h2 className="text-3xl md:text-6xl font-serif text-premium-charcoal">{t('home.collections.title1')}<br className="hidden md:block"/><span className="italic font-light"> {t('home.collections.title2')}</span></h2>
              </div>
              <Link to="/products" className="group flex items-center gap-3 text-premium-charcoal font-serif hover:text-premium-sand transition-colors text-base md:text-lg">
                <span className="border-b border-premium-charcoal group-hover:border-premium-sand pb-1 transition-colors">{t('home.collections.explore_all')}</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {[
              { title: t('home.collections.cat1.title'), subtitle: t('home.collections.cat1.subtitle'), img: '/Livingrooms.jpeg', cat: 'salons', cols: 'md:col-span-8', height: 'h-[400px] md:h-[600px]' },
              { title: t('home.collections.cat2.title'), subtitle: t('home.collections.cat2.subtitle'), img: '/badrooms.jpeg', cat: 'chambres', cols: 'md:col-span-4', height: 'h-[400px] md:h-[600px]' },
              { title: t('home.collections.cat3.title'), subtitle: t('home.collections.cat3.subtitle'), img: '/Diningrooms.jpeg', cat: 'tables', cols: 'md:col-span-12', height: 'h-[350px] md:h-[500px]' },
            ].map((cat, idx) => (
              <div key={idx} className={`${cat.cols} relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer`}>
                <FadeIn delay={idx * 0.1}>
                  <Link to={`/products?cat=${cat.cat}`} className={`block ${cat.height} w-full`}>
                    <motion.div className="w-full h-full" whileHover={{ scale: 1.05 }} transition={{ duration: 1.2, ease: "easeOut" }}>
                      <img src={cat.img} className="w-full h-full object-cover" alt={cat.title} />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-premium-charcoal/80 via-premium-charcoal/20 to-transparent opacity-80" />
                    <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                      <p className="text-premium-beige uppercase tracking-widest text-[10px] md:text-xs mb-2 md:mb-3 font-bold">{cat.subtitle}</p>
                      <h3 className="text-2xl md:text-4xl font-serif text-white">{cat.title}</h3>
                    </div>
                  </Link>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Sellers */}
      <section className="py-20 md:py-32 bg-premium-ivory">
        <div className="container mx-auto px-4 md:px-12">
          <FadeIn>
            <div className="text-center mb-12 md:mb-20">
              <span className="text-premium-charcoal/50 text-xs tracking-[0.3em] uppercase font-bold mb-3 md:mb-4 block">{t('home.bestsellers.badge')}</span>
              <h2 className="text-3xl md:text-5xl font-serif text-premium-charcoal mb-4 md:mb-6">{t('home.bestsellers.title1')} <span className="italic font-light">{t('home.bestsellers.title2')}</span></h2>
            </div>
          </FadeIn>

          {bestSellers.length > 0 && (
            <FeaturedSlider 
              products={bestSellers} 
              openProduct={openProduct} 
              formatPrice={formatPrice} 
              t={t} 
              isRTL={i18n.language === 'ar'} 
            />
          )}
        </div>
      </section>

      {/* 5. Trust & Artisan Quality */}
      <section className="py-16 md:py-24 bg-premium-charcoal text-premium-ivory relative overflow-hidden">
        {/* Very subtle noise grain */}
        <div className="absolute inset-0 opacity-[0.025] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

        {/* Ambient gold glow — top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-premium-sand/40 to-transparent" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">


          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group flex flex-col items-center text-center p-8 md:p-10 rounded-2xl border border-premium-ivory/8 bg-premium-ivory/[0.03] hover:bg-premium-ivory/[0.06] hover:border-premium-sand/25 transition-colors duration-400 cursor-default"
            >
              <div className="w-14 h-14 rounded-xl bg-premium-sand/10 border border-premium-sand/20 flex items-center justify-center mb-6 group-hover:bg-premium-sand/15 transition-colors duration-300">
                <Star className="w-6 h-6 text-premium-sand" />
              </div>
              <h3 className="text-lg font-serif mb-3 text-premium-ivory">{t('home.excellence.feat1.title')}</h3>
              <p className="text-premium-ivory/50 font-light leading-relaxed text-sm">{t('home.excellence.feat1.desc')}</p>
            </motion.div>

            {/* Card 2 — center, anchor of section with title embedded */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group flex flex-col items-center text-center p-8 md:p-10 rounded-2xl border border-premium-sand/20 bg-premium-sand/[0.04] hover:bg-premium-sand/[0.07] hover:border-premium-sand/35 transition-colors duration-400 cursor-default"
            >
              <div className="w-14 h-14 rounded-xl bg-premium-sand/15 border border-premium-sand/30 flex items-center justify-center mb-5 group-hover:bg-premium-sand/20 transition-colors duration-300">
                <Truck className="w-6 h-6 text-premium-sand" />
              </div>
              {/* Section title lives here — between icon and card heading */}
              <p className="text-[10px] tracking-[0.25em] uppercase text-premium-sand/60 font-sans mb-1">
                {t('home.excellence.title1')}
              </p>
              <p className="text-xl md:text-2xl font-serif italic text-premium-sand font-light mb-5">
                {t('home.excellence.title2')}
              </p>
              <div className="w-8 h-px bg-premium-sand/30 mb-5" />
              <h3 className="text-lg font-serif mb-3 text-premium-ivory">{t('home.excellence.feat2.title')}</h3>
              <p className="text-premium-ivory/50 font-light leading-relaxed text-sm">{t('home.excellence.feat2.desc')}</p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group flex flex-col items-center text-center p-8 md:p-10 rounded-2xl border border-premium-ivory/8 bg-premium-ivory/[0.03] hover:bg-premium-ivory/[0.06] hover:border-premium-sand/25 transition-colors duration-400 cursor-default"
            >
              <div className="w-14 h-14 rounded-xl bg-premium-sand/10 border border-premium-sand/20 flex items-center justify-center mb-6 group-hover:bg-premium-sand/15 transition-colors duration-300">
                <Shield className="w-6 h-6 text-premium-sand" />
              </div>
              <h3 className="text-lg font-serif mb-3 text-premium-ivory">{t('home.excellence.feat3.title')}</h3>
              <p className="text-premium-ivory/50 font-light leading-relaxed text-sm">{t('home.excellence.feat3.desc')}</p>
            </motion.div>

          </div>
        </div>

        {/* Ambient gold glow — bottom center */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-premium-sand/40 to-transparent" />
      </section>


      {/* 6. Instagram Gallery */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-premium-sand/20 to-transparent" />
        
        <div className="container mx-auto px-4 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <a 
              href="https://www.instagram.com/_gaza_meuble" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-premium-soft border border-premium-sand/20 text-premium-charcoal mb-6 md:mb-8 hover:bg-premium-sand/10 hover:scale-105 transition-all duration-300"
            >
              <Instagram className="w-6 h-6 md:w-8 md:h-8" />
            </a>
            <h2 className="text-3xl md:text-4xl font-serif text-premium-charcoal mb-3">{t('home.instagram.title')}</h2>
            <p className="text-premium-charcoal/60 mb-12 md:mb-20 font-serif text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">{t('home.instagram.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              '/imageinsta1.jpeg',
              '/imageinsta2.jpeg',
              '/imageinsta3.jpeg',
              '/imageinsta4.jpeg',
            ].map((src, idx) => (
              <motion.a 
                key={idx} 
                href="https://www.instagram.com/_gaza_meuble" 
                target="_blank" 
                rel="noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group relative aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden block bg-premium-soft shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Image */}
                <img 
                  src={src} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out" 
                  alt="Instagram Style" 
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-premium-charcoal/90 via-premium-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Hover Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 mb-2 md:mb-3">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <span className="text-white text-xs md:text-sm font-medium tracking-wide">@_gaza_meuble</span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const FeaturedSlider = ({ products, openProduct, formatPrice, t, isRTL }: { products: Product[], openProduct: any, formatPrice: any, t: any, isRTL: boolean }) => {
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [[page, direction], setPage] = useState([0, 0])

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setItemsPerPage(1)
      else if (window.innerWidth < 1024) setItemsPerPage(2)
      else setItemsPerPage(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (products.length === 0) return null

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  // Calculate start index with positive modulo
  const startIndex = ((page * itemsPerPage) % products.length + products.length) % products.length
  
  const visibleProducts = []
  for (let i = 0; i < itemsPerPage; i++) {
    visibleProducts.push(products[(startIndex + i) % products.length])
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isRTL ? -1000 : 1000) : (isRTL ? 1000 : -1000),
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? (isRTL ? -1000 : 1000) : (isRTL ? 1000 : -1000),
      opacity: 0,
      scale: 0.95
    })
  }

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const currentPage = ((page % totalPages) + totalPages) % totalPages

  return (
    <div className="relative group">
      {/* Controls */}
      {products.length > itemsPerPage && (
        <>
          <div className="absolute top-1/2 -left-4 md:-left-6 lg:-left-12 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            <button 
              onClick={() => paginate(-1)}
              className="w-12 h-12 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-premium-soft flex items-center justify-center text-premium-charcoal hover:bg-premium-ivory hover:scale-105 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -right-4 md:-right-6 lg:-right-12 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            <button 
              onClick={() => paginate(1)}
              className="w-12 h-12 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-premium-soft flex items-center justify-center text-premium-charcoal hover:bg-premium-ivory hover:scale-105 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </>
      )}

      {/* Slider Track */}
      <div className="overflow-hidden px-1 py-4 -mx-1 -my-4">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 350, damping: 35 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 }
            }}
            drag={products.length > itemsPerPage ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset }) => {
              const swipe = offset.x
              if (swipe < -50) paginate(isRTL ? -1 : 1)
              else if (swipe > 50) paginate(isRTL ? 1 : -1)
            }}
            className={`grid gap-10 ${products.length > itemsPerPage ? 'cursor-grab active:cursor-grabbing' : ''}`}
            style={{ 
              gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))` 
            }}
          >
            {visibleProducts.map((product, idx) => (
              <div 
                key={`${product.id}-${page}-${idx}`}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-premium-soft shadow-[0_10px_40px_rgba(40,40,38,0.04)] hover:shadow-[0_20px_60px_rgba(40,40,38,0.08)] transition-all duration-500 flex flex-col"
                onClick={() => openProduct(product)}
              >
                <div className="relative aspect-square overflow-hidden bg-premium-soft shrink-0">
                  <motion.img 
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={product.images[0]} 
                    className="w-full h-full object-cover pointer-events-none" 
                    alt={product.title} 
                  />
                  <div className="absolute top-6 right-6 bg-premium-ivory/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-serif text-premium-charcoal shadow-sm border border-premium-soft">{t('home.bestsellers.popular_badge')}</div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow bg-white text-center">
                  <div>
                    <p className="text-xs text-premium-sand uppercase font-bold tracking-widest mb-3">
                      {t(`categories.${product.category}`)}
                    </p>
                    <h3 className="text-2xl font-serif text-premium-charcoal mb-4 group-hover:text-premium-sand transition-colors">{product.title}</h3>
                    <p className="text-xl font-serif text-premium-charcoal/80 mb-6">{formatPrice(product.price)}</p>
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
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      {products.length > itemsPerPage && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const isActive = currentPage === idx
            return (
              <button 
                key={idx}
                onClick={() => {
                  const newDirection = idx > currentPage ? 1 : -1
                  setPage([page + (idx - currentPage), newDirection])
                }}
                aria-label={`Go to page ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${isActive ? 'bg-premium-sand' : 'bg-premium-soft hover:bg-premium-sand/50'}`} 
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Home
