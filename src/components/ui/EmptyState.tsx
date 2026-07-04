import { motion } from 'framer-motion'
import { PackageX, SearchX, Loader2, type LucideIcon } from 'lucide-react'

import { useTranslation } from 'react-i18next'

interface EmptyStateProps {
  type: 'loading' | 'no-products' | 'no-search-results';
  title?: string;
  description?: string;
}

const config: Record<string, { icon: LucideIcon, titleKey: string, defaultTitle: string, descKey: string, defaultDesc: string, animate?: boolean }> = {
  'loading': {
    icon: Loader2,
    titleKey: 'empty.loading.title',
    defaultTitle: 'Chargement en cours...',
    descKey: 'empty.loading.subtitle',
    defaultDesc: 'Veuillez patienter pendant que nous préparons notre catalogue.',
    animate: true
  },
  'no-products': {
    icon: PackageX,
    titleKey: 'empty.no_products.title',
    defaultTitle: 'Aucun produit disponible',
    descKey: 'empty.no_products.subtitle',
    defaultDesc: 'Nous n\'avons pas trouvé de produits correspondant à vos critères actuels.'
  },
  'no-search-results': {
    icon: SearchX,
    titleKey: 'empty.no_search.title',
    defaultTitle: 'Aucun résultat trouvé',
    descKey: 'empty.no_search.subtitle',
    defaultDesc: 'Essayez de modifier vos termes de recherche.'
  }
}

export const EmptyState = ({ type, title, description }: EmptyStateProps) => {
  const { t } = useTranslation()
  const { icon: Icon, titleKey, defaultTitle, descKey, defaultDesc, animate } = config[type]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="relative mb-8">
        <motion.div 
          animate={animate ? { rotate: 360 } : { y: [0, -10, 0] }}
          transition={animate ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full border border-premium-soft flex items-center justify-center bg-white shadow-[0_10px_40px_rgba(40,40,38,0.08)]"
        >
          {type === 'loading' ? (
            <Icon className="w-8 h-8 text-premium-sand animate-spin" />
          ) : (
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center opacity-70 grayscale shadow-sm border border-premium-soft">
              <img src="/gazameuble-logo.png" alt="Gazameuble" className="w-full h-full object-cover" />
            </div>
          )}
        </motion.div>
        {!animate && (
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-premium-charcoal border border-premium-ivory rounded-full flex items-center justify-center shadow-md">
            <Icon className="w-4 h-4 text-premium-ivory" />
          </div>
        )}
      </div>
      
      <h3 className="text-2xl font-serif text-premium-charcoal mb-3">
        {title || t(titleKey, defaultTitle)}
      </h3>
      
      <p className="text-premium-charcoal/60 max-w-sm mx-auto font-light leading-relaxed">
        {description || t(descKey, defaultDesc)}
      </p>
    </motion.div>
  )
}
