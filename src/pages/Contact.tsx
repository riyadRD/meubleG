import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { api } from '@/services/api'
import { PremiumButton } from '@/components/ui/PremiumButton'

const FadeIn = ({ children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

const Contact = () => {
  const { t, i18n } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const { success } = await api.messages.submitContact(formData)
    
    setIsSubmitting(false)
    if (success) {
      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setIsSuccess(false), 5000)
    } else {
      alert(t('contact.error', 'Une erreur est survenue. Veuillez réessayer.'))
    }
  }

  return (
    <div className="w-full bg-premium-ivory font-serif" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-premium-charcoal/40 mix-blend-multiply z-10" />
          <img 
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" 
            alt="Gazameuble Contact" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-20 mx-auto px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-premium-ivory/80 text-sm tracking-[0.4em] uppercase font-sans mb-6 block">{t('contact.hero.badge', 'Contact')}</span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">{t('contact.hero.title1', 'Nous Contacter')}</h1>
            <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
              {t('contact.hero.description', 'Notre équipe est à votre disposition pour vous accompagner dans tous vos projets d\'aménagement.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-32 bg-white relative z-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-20">
            
            {/* Left: Contact Info */}
            <div className="w-full lg:w-1/3 flex flex-col gap-10">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-serif text-premium-charcoal mb-10 leading-tight">
                  {t('contact.info.title', 'Parlons de votre projet')}
                </h2>
                
                <div className="space-y-10">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-premium-ivory border border-premium-soft rounded-full flex items-center justify-center text-premium-sand shrink-0 shadow-sm">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif text-premium-charcoal text-xl mb-2">{t('showroom.address.title')}</h4>
                      <p className="text-premium-charcoal/70 font-light text-lg leading-relaxed whitespace-pre-line">{t('showroom.address.value')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-premium-ivory border border-premium-soft rounded-full flex items-center justify-center text-premium-sand shrink-0 shadow-sm">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif text-premium-charcoal text-xl mb-2">{t('showroom.contact.title')}</h4>
                      <p className="text-premium-charcoal/70 font-light text-lg">
                        <a href="tel:0553174484" className="hover:text-premium-sand transition-colors" dir="ltr">0553 17 44 84</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-premium-ivory border border-premium-soft rounded-full flex items-center justify-center text-premium-sand shrink-0 shadow-sm">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif text-premium-charcoal text-xl mb-2">Email</h4>
                      <p className="text-premium-charcoal/70 font-light text-lg">
                        <a href="mailto:contact@gazameuble.dz" className="hover:text-premium-sand transition-colors">contact@gazameuble.dz</a>
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right: Contact Form */}
            <div className="w-full lg:w-2/3">
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-premium-soft">
                  <h3 className="text-2xl font-serif text-premium-charcoal mb-8">{t('contact.form.title', 'Envoyez-nous un message')}</h3>
                  
                  {isSuccess ? (
                    <div className="bg-green-50 text-green-800 p-8 rounded-2xl text-center border border-green-200">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">{t('contact.success_title', 'Message envoyé !')}</h4>
                      <p className="text-green-700">{t('contact.success_desc', 'Nous vous répondrons dans les plus brefs délais.')}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-sans font-bold text-premium-charcoal uppercase tracking-wider">{t('contact.form.name', 'Nom complet *')}</label>
                          <input 
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-premium-ivory border border-premium-soft rounded-xl px-5 py-4 outline-none focus:border-premium-sand transition-all font-sans"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-sans font-bold text-premium-charcoal uppercase tracking-wider">{t('contact.form.email', 'Email *')}</label>
                          <input 
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-premium-ivory border border-premium-soft rounded-xl px-5 py-4 outline-none focus:border-premium-sand transition-all font-sans text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-sans font-bold text-premium-charcoal uppercase tracking-wider">{t('contact.form.phone', 'Téléphone *')}</label>
                          <input 
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-premium-ivory border border-premium-soft rounded-xl px-5 py-4 outline-none focus:border-premium-sand transition-all font-sans text-left"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-sans font-bold text-premium-charcoal uppercase tracking-wider">{t('contact.form.subject', 'Sujet *')}</label>
                          <input 
                            required
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            className="w-full bg-premium-ivory border border-premium-soft rounded-xl px-5 py-4 outline-none focus:border-premium-sand transition-all font-sans"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-sans font-bold text-premium-charcoal uppercase tracking-wider">{t('contact.form.message', 'Message *')}</label>
                        <textarea 
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="w-full bg-premium-ivory border border-premium-soft rounded-xl px-5 py-4 outline-none focus:border-premium-sand transition-all resize-none font-sans"
                        />
                      </div>

                      <PremiumButton 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full justify-center py-5 text-lg"
                        icon={isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                      >
                        {isSubmitting ? t('contact.form.sending', 'Envoi en cours...') : t('contact.form.submit', 'Envoyer le message')}
                      </PremiumButton>
                    </form>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
