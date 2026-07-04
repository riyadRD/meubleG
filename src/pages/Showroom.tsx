import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Coffee, Car, ShieldCheck, Mail, Send, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PremiumButton } from '@/components/ui/PremiumButton'
import { api } from '@/services/api'

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

const Showroom = () => {
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
    <div 
      className="w-full bg-premium-ivory font-serif"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Hero Section */}
      <section className="relative h-[80svh] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-premium-charcoal/40 mix-blend-multiply z-10" />
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            alt="Gazameuble Showroom Interior" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 md:px-6 text-center mt-10 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-premium-ivory/80 text-xs md:text-sm tracking-[0.4em] uppercase font-sans mb-4 md:mb-6 block">{t('showroom.hero.badge')}</span>
            <h1 className="text-4xl md:text-8xl font-serif text-white mb-6 md:mb-8 leading-tight">{t('showroom.hero.title1')} <span className="italic font-light text-premium-beige block md:inline">{t('showroom.hero.title2')}</span></h1>
            <p className="text-lg md:text-2xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto">
              {t('showroom.hero.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-32 bg-white relative z-20">
        <div className="container mx-auto px-4 md:px-12">
          
          {/* CTA Title */}
          <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-serif text-premium-charcoal mb-4 md:mb-6 leading-tight">
                {t('showroom.cta.title', 'Need assistance with your furniture project?')}
              </h2>
              <p className="text-lg md:text-xl text-premium-charcoal/60 font-light">
                {t('showroom.cta.subtitle', 'Our team will contact you shortly.')}
              </p>
            </FadeIn>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
            {/* Left: Contact Info & Map */}
            <div className="w-full lg:w-1/2 flex flex-col gap-8 md:gap-10">
              <FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-serif text-premium-charcoal text-xl flex items-center gap-2">
                      <div className="w-10 h-10 bg-premium-ivory rounded-full flex items-center justify-center text-premium-sand"><MapPin className="w-4 h-4"/></div>
                      {t('showroom.address.title')}
                    </h4>
                    <p className="text-premium-charcoal/70 font-light whitespace-pre-line pl-12">{t('showroom.address.value')}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-serif text-premium-charcoal text-xl flex items-center gap-2">
                      <div className="w-10 h-10 bg-premium-ivory rounded-full flex items-center justify-center text-premium-sand"><Clock className="w-4 h-4"/></div>
                      {t('showroom.hours.title')}
                    </h4>
                    <p className="text-premium-charcoal/70 font-light leading-relaxed pl-12">{t('showroom.hours.days1')}<br/>{t('showroom.hours.days2')}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-serif text-premium-charcoal text-xl flex items-center gap-2">
                      <div className="w-10 h-10 bg-premium-ivory rounded-full flex items-center justify-center text-premium-sand"><Phone className="w-4 h-4"/></div>
                      {t('showroom.contact.title')}
                    </h4>
                    <p className="text-premium-charcoal/70 font-light pl-12">
                      <a href="tel:0553174484" className="hover:text-premium-sand transition-colors" dir="ltr">0553 17 44 84</a>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-serif text-premium-charcoal text-xl flex items-center gap-2">
                      <div className="w-10 h-10 bg-premium-ivory rounded-full flex items-center justify-center text-premium-sand"><Mail className="w-4 h-4"/></div>
                      Email
                    </h4>
                    <p className="text-premium-charcoal/70 font-light pl-12">
                      <a href="mailto:contact@gazameuble.dz" className="hover:text-premium-sand transition-colors">contact@gazameuble.dz</a>
                    </p>
                  </div>
                </div>

                <div className="w-full h-[300px] md:h-[400px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-lg border border-premium-soft">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102341.24036838334!2d-0.7161041929315998!3d35.706173006240216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7e8854841f34a3%3A0xb7381c84c468ea9c!2sOran!5e0!3m2!1sen!2sdz!4v1700000000000!5m2!1sen!2sdz" 
                    className="w-full h-full border-0"
                    allowFullScreen={false}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Gazameuble Location"
                    style={{ filter: 'grayscale(0.5) contrast(1.1) opacity(0.9)' }}
                  />
                </div>
              </FadeIn>
            </div>

            {/* Right: Contact Form */}
            <div className="w-full lg:w-1/2">
              <FadeIn delay={0.2}>
                <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-12 shadow-sm border border-premium-soft">
                  <h3 className="text-xl md:text-2xl font-serif text-premium-charcoal mb-6 md:mb-8">{t('contact.form.title', 'Envoyez-nous un message')}</h3>
                  
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

                      <div className="space-y-2">
                        <label className="text-sm font-sans font-bold text-premium-charcoal uppercase tracking-wider">{t('contact.form.message', 'Message *')}</label>
                        <textarea 
                          required
                          rows={4}
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

      {/* Why Visit Us */}
      <section className="py-20 md:py-32 bg-premium-ivory">
        <div className="container mx-auto px-4 md:px-12 text-center">
          <FadeIn>
            <span className="text-premium-charcoal/50 text-xs md:text-sm tracking-[0.3em] uppercase font-sans mb-4 md:mb-6 block">{t('showroom.why.badge')}</span>
            <h2 className="text-3xl md:text-5xl font-serif text-premium-charcoal mb-12 md:mb-20 leading-tight">{t('showroom.why.title1')} <span className="italic font-light">{t('showroom.why.title2')}</span></h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            <FadeIn delay={0.1}>
              <div className="bg-white p-8 md:p-12 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-premium-soft hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-premium-ivory rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 text-premium-sand border border-premium-soft">
                  <Coffee className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-2xl font-serif text-premium-charcoal mb-4">{t('showroom.why.feat1.title')}</h3>
                <p className="text-premium-charcoal/70 font-light leading-relaxed">{t('showroom.why.feat1.desc')}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-white p-8 md:p-12 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-premium-soft hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-premium-ivory rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 text-premium-sand border border-premium-soft">
                  <Car className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-2xl font-serif text-premium-charcoal mb-4">{t('showroom.why.feat2.title')}</h3>
                <p className="text-premium-charcoal/70 font-light leading-relaxed">{t('showroom.why.feat2.desc')}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="bg-white p-8 md:p-12 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-premium-soft hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-premium-ivory rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 text-premium-sand border border-premium-soft">
                  <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-2xl font-serif text-premium-charcoal mb-4">{t('showroom.why.feat3.title')}</h3>
                <p className="text-premium-charcoal/70 font-light leading-relaxed">{t('showroom.why.feat3.desc')}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-12">
          <FadeIn>
            <div className="text-center mb-12 md:mb-20">
              <span className="text-premium-charcoal/50 text-xs md:text-sm tracking-[0.3em] uppercase font-sans mb-4 md:mb-6 block">{t('showroom.gallery.badge')}</span>
              <h2 className="text-3xl md:text-5xl font-serif text-premium-charcoal mb-4 md:mb-6">{t('showroom.gallery.title1')} <span className="italic font-light block md:inline">{t('showroom.gallery.title2')}</span></h2>
              <p className="text-premium-charcoal/60 max-w-2xl mx-auto font-light text-base md:text-lg px-4">{t('showroom.gallery.description')}</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FadeIn delay={0.1}>
              <div className="h-[300px] md:h-[600px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt="Showroom view 1" />
              </div>
            </FadeIn>
            
            <div className="grid grid-rows-2 gap-4 md:gap-6 h-[400px] md:h-[600px]">
              <FadeIn delay={0.2} className="h-full">
                <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden h-full">
                  <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 object-center" alt="Showroom view 2" />
                </div>
              </FadeIn>
              
              <div className="grid grid-cols-2 gap-4 md:gap-6 h-full">
                <FadeIn delay={0.3} className="h-full">
                  <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden h-full">
                    <img src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt="Showroom view 3" />
                  </div>
                </FadeIn>
                <FadeIn delay={0.4} className="h-full">
                  <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden h-full">
                    <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt="Showroom view 4" />
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Showroom
