import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Mail, Instagram } from 'lucide-react'

// Simple custom TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.15 4.34-3.08 5.45-1.93 1.11-4.28 1.23-6.18.22-1.9-.99-3.32-2.78-3.72-4.9-.39-2.11.11-4.32 1.4-6.05 1.29-1.74 3.32-2.81 5.47-3.01.27-.03.54-.03.82-.04v4.03c-1.14-.07-2.33.25-3.23.95-.9.71-1.4 1.84-1.35 2.98.05 1.14.65 2.24 1.6 2.87.94.63 2.15.82 3.23.51 1.08-.31 1.98-1.07 2.4-2.1.28-.68.42-1.42.4-2.16V.02h-1.8z"/>
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const Footer = () => {
  const { t, i18n } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer 
      className="bg-premium-charcoal text-premium-ivory pt-24 pb-8 border-t border-premium-soft/20 font-serif"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16 text-center md:text-left">
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <Link to="/" className="inline-block mb-6 md:mb-8">
              <div className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] rounded-full overflow-hidden flex items-center justify-center shadow-lg shrink-0">
                <img src="/gazameuble-logo.png" alt="Gazameuble" className="w-full h-full object-cover rounded-full" />
              </div>
            </Link>
            <p className="text-premium-ivory/70 max-w-sm mb-8 font-light text-base md:text-lg px-4 md:px-0">
              {t('footer.description')}
            </p>
            
            <div className="flex gap-4 justify-center md:justify-start flex-wrap">
              <a 
                href="https://www.tiktok.com/@gazameuble1" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-premium-charcoal transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a 
                href="https://www.instagram.com/gaza_mueble" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-premium-charcoal transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a 
                href="https://www.facebook.com/Gazameuble" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-premium-charcoal transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-serif mb-6 text-white">{t('footer.navigation')}</h4>
            <ul className="flex flex-col gap-4 font-light items-center md:items-start">
              <li>
                <Link to="/" className="text-premium-ivory/70 hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-premium-ivory/70 hover:text-white transition-colors">
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link to="/showroom" className="text-premium-ivory/70 hover:text-white transition-colors">
                  {t('nav.showroom')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-serif mb-6 text-white">{t('footer.contact')}</h4>
            <ul className="flex flex-col gap-4 text-premium-ivory/70 font-light items-center md:items-start">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-premium-sand" />
                <a href="tel:0553174484" className="hover:text-white transition-colors" dir="ltr">0553 17 44 84</a>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                <MapPin className="w-5 h-5 text-premium-sand shrink-0" />
                <span>{t('showroom.address.value')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-premium-sand shrink-0" />
                <a href="mailto:contact@gazameuble.dz" className="hover:text-white transition-colors">contact@gazameuble.dz</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-premium-ivory/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-premium-ivory/50 font-sans gap-4 md:gap-0">
          <p className="text-center md:text-left">&copy; {currentYear} Gazameuble. {t('footer.rights')}</p>
          <div className="flex gap-4 items-center">
            <span>{t('home.excellence.feat2.title')}</span>
            <span className="text-premium-ivory/20">|</span>
            <span>{t('home.excellence.feat3.title')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
