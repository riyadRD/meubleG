import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldAlert, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'

export default function AdminSetup() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 2000)

    } catch (err: any) {
      setError(err.message || t('admin.setup.error', "Erreur lors de la création du compte"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-500 rounded-xl mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-sans tracking-tight">{t('admin.setup.title', 'Configuration Initiale')}</h1>
          <p className="text-gray-500 mt-2 text-sm">{t('admin.setup.subtitle', 'Créez le compte administrateur principal')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">{t('admin.setup.success_title', 'Compte Créé !')}</h3>
            <p className="text-gray-500 mt-2">{t('admin.setup.success_subtitle', 'Redirection vers le tableau de bord...')}</p>
          </div>
        ) : (
          <form onSubmit={handleSetup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.setup.email', 'Email Administrateur')}</label>
              <div className="relative">
                <Mail className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full ${i18n.language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-gray-900 text-left`}
                  dir="ltr"
                  placeholder="admin@gazameuble.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.setup.password', 'Mot de passe sécurisé')}</label>
              <div className="relative">
                <Lock className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                <input 
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full ${i18n.language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-gray-900 text-left`}
                  dir="ltr"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-amber-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('admin.setup.submit', 'Créer le compte')}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
