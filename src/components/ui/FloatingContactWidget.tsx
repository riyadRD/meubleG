import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, Instagram, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// Simple custom TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.15 4.34-3.08 5.45-1.93 1.11-4.28 1.23-6.18.22-1.9-.99-3.32-2.78-3.72-4.9-.39-2.11.11-4.32 1.4-6.05 1.29-1.74 3.32-2.81 5.47-3.01.27-.03.54-.03.82-.04v4.03c-1.14-.07-2.33.25-3.23.95-.9.71-1.4 1.84-1.35 2.98.05 1.14.65 2.24 1.6 2.87.94.63 2.15.82 3.23.51 1.08-.31 1.98-1.07 2.4-2.1.28-.68.42-1.42.4-2.16V.02h-1.8z"/>
  </svg>
)

export const FloatingContactWidget = () => {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const contacts = [
    { 
      id: 'whatsapp', 
      icon: MessageCircle, 
      label: 'WhatsApp', 
      href: 'https://wa.me/2130553174484',
      bg: 'bg-[#25D366]',
      text: 'text-white'
    },
    { 
      id: 'phone', 
      icon: Phone, 
      label: t('widget.call', 'Appeler'), 
      href: 'tel:0553174484',
      bg: 'bg-primary',
      text: 'text-white'
    },
    { 
      id: 'instagram', 
      icon: Instagram, 
      label: 'Instagram', 
      href: 'https://www.instagram.com/gaza_mueble',
      bg: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
      text: 'text-white'
    },
    { 
      id: 'tiktok', 
      icon: TikTokIcon, 
      label: 'TikTok', 
      href: 'https://www.tiktok.com/@gazameuble1',
      bg: 'bg-black',
      text: 'text-white'
    }
  ]

  return (
    <div className={`fixed bottom-6 md:bottom-8 ${i18n.language === 'ar' ? 'left-6 md:left-8 items-start' : 'right-6 md:right-8 items-end'} z-[60] flex flex-col gap-3`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, transition: { staggerChildren: 0.05, staggerDirection: -1 } }}
            className={`flex flex-col gap-3 ${i18n.language === 'ar' ? 'items-start' : 'items-end'} mb-2`}
          >
            {contacts.map((contact, i) => (
              <motion.a
                key={contact.id}
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ delay: (contacts.length - i) * 0.05 }}
                className="group flex items-center gap-3"
              >
                <span className={`bg-white px-3 py-1.5 rounded-lg shadow-sm border border-border text-sm font-medium text-primary opacity-0 group-hover:opacity-100 ${i18n.language === 'ar' ? 'translate-x-2' : '-translate-x-2'} group-hover:translate-x-0 transition-all pointer-events-none`}>
                  {contact.label}
                </span>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${contact.bg} ${contact.text}`}>
                  <contact.icon className="w-5 h-5" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl hover:-translate-y-1 transition-all duration-300 z-10 ${
          isOpen ? 'bg-primary text-white' : 'bg-[#25D366] text-white shadow-[#25D366]/40'
        }`}
      >
        {!isOpen && (
          <>
            <span className="absolute w-full h-full rounded-full border-2 border-[#25D366] opacity-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <span className="absolute w-full h-full rounded-full border border-[#25D366] opacity-0 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]" />
          </>
        )}
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />}
        </motion.div>
      </button>
    </div>
  )
}
