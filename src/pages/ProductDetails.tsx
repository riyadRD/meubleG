import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Truck, ShieldCheck, Check, Info } from 'lucide-react'
import { api } from '@/services/api'
import { Product } from '@/types'
import { PremiumButton } from '@/components/ui/PremiumButton'
import { useTranslation } from 'react-i18next'

// Lightweight skeleton block — renders immediately, no spinners, no blocking
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-premium-soft animate-pulse rounded-2xl ${className ?? ''}`} />
)

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  // Immediately populate from React Router state — zero network request when coming from product list
  const [product, setProduct] = useState<Product | null>(location.state?.product ?? null)
  const [currentImage, setCurrentImage] = useState(0)
  // Track whether we need to fetch — only true when product is genuinely absent (direct URL / refresh)
  const needsFetch = product === null

  useEffect(() => {
    // Scroll to top immediately — no smooth, no delay
    window.scrollTo(0, 0)
  }, []) // run once on mount only

  useEffect(() => {
    if (!needsFetch || !id) return
    // Only runs on direct URL access or page refresh
    let cancelled = false
    api.products.getById(id).then(data => {
      if (!cancelled && data) setProduct(data)
    })
    return () => { cancelled = true }
  }, [id, needsFetch])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0,
    }).format(price)

  // Page renders IMMEDIATELY in all cases.
  // When product is null (direct URL), skeleton blocks fill the space while Supabase responds.
  return (
    <div className="min-h-screen bg-premium-ivory pt-24 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-premium-charcoal hover:text-premium-sand font-serif font-medium transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" /> Retour
        </button>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-premium-soft flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* ─── Left: Gallery ─── */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            {/* Main image or skeleton */}
            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-premium-soft relative">
              {product ? (
                <img
                  key={currentImage}
                  src={product.images[currentImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  // @ts-ignore – fetchpriority is valid HTML5 but TS types are behind
                  fetchpriority="high"
                />
              ) : (
                <Skeleton className="w-full h-full rounded-none" />
              )}
              {product?.is_new && (
                <div className="absolute top-6 left-6 bg-premium-sand text-white px-4 py-1.5 rounded-full text-sm font-serif shadow-md">
                  NOUVEAU
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      currentImage === idx ? 'border-premium-sand' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </button>
                ))}
              </div>
            )}
            {/* Skeleton thumbs while loading */}
            {!product && (
              <div className="flex gap-4">
                {[0, 1, 2].map(i => <Skeleton key={i} className="w-24 h-24 shrink-0" />)}
              </div>
            )}
          </div>

          {/* ─── Right: Info ─── */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {product ? (
              <>
                {/* Category + stock badge */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-bold uppercase tracking-widest text-premium-charcoal/50">
                    {product.category}
                  </span>
                  {product.in_stock ? (
                    <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      <Check className="w-4 h-4" /> En Stock
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-premium-charcoal bg-premium-soft px-3 py-1 rounded-full">
                      Sur commande
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-serif text-premium-charcoal mb-6">{product.title}</h1>
                <div className="text-3xl font-serif text-premium-charcoal mb-8">{formatPrice(product.price)}</div>

                <p className="text-lg text-premium-charcoal/70 font-light leading-relaxed mb-10">
                  {product.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-8 mb-12">
                  <div>
                    <h3 className="flex items-center gap-2 font-bold text-premium-charcoal mb-4 text-lg font-serif">
                      <Info className="w-5 h-5 text-premium-sand" /> Spécifications
                    </h3>
                    <ul className="space-y-3">
                      {(product.features || []).map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-premium-charcoal/70 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-premium-sand/50 mt-2 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-premium-soft p-5 rounded-2xl border border-premium-soft">
                      <h3 className="flex items-center gap-2 font-bold text-premium-charcoal mb-2 font-serif">
                        <Truck className="w-5 h-5 text-premium-sand" /> Livraison
                      </h3>
                      <p className="text-sm text-premium-charcoal/70">Livraison disponible vers les 69 wilayas. Installation sur place par nos experts.</p>
                    </div>
                    <div className="bg-premium-soft p-5 rounded-2xl border border-premium-soft">
                      <h3 className="flex items-center gap-2 font-bold text-premium-charcoal mb-2 font-serif">
                        <ShieldCheck className="w-5 h-5 text-premium-sand" /> Garantie
                      </h3>
                      <p className="text-sm text-premium-charcoal/70">Produit garanti 2 ans pièces et main d'œuvre contre tout vice de fabrication.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-premium-soft">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-order-form', { detail: product }))}
                    className="w-full h-[54px] rounded-full bg-premium-charcoal text-premium-ivory transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(40,40,38,0.2)] shadow-[0_4px_20px_rgba(40,40,38,0.1)] font-serif text-base md:text-lg tracking-wider flex items-center justify-center"
                  >
                    {t('product.order_now')}
                  </button>
                </div>
              </>
            ) : (
              /* Skeleton info panel — shown only on direct URL access while Supabase responds */
              <div className="flex flex-col gap-6 flex-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-24 w-full" />
                <div className="grid sm:grid-cols-2 gap-6">
                  <Skeleton className="h-40 w-full" />
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
                <div className="mt-auto pt-8 border-t border-premium-soft">
                  <Skeleton className="h-[54px] w-full rounded-full" />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
