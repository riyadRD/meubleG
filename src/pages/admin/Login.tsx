import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      navigate('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || t('admin.login.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-premium-dark"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#121212] p-8 rounded-3xl shadow-2xl border border-white/10"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-sm bg-white">
              <img src="/gazameuble-logo.png" alt="Gazameuble" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="text-premium-beige/60 mt-2 text-sm font-light tracking-wide">{t('admin.login.subtitle', 'Veuillez vous connecter pour accéder au tableau de bord')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-premium-beige/80 mb-2">{t('admin.login.email')}</label>
            <div className="relative">
              <Mail className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-premium-beige/40`} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full ${i18n.language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-premium-beige focus:border-transparent outline-none transition-all text-white placeholder-white/30`}
                placeholder="admin@gazameuble.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-premium-beige/80 mb-2">{t('admin.login.password')}</label>
            <div className="relative">
              <Lock className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-premium-beige/40`} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full ${i18n.language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-premium-beige focus:border-transparent outline-none transition-all text-white placeholder-white/30`}
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-premium-beige hover:bg-white text-premium-dark font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-black/50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('admin.login.button')}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
