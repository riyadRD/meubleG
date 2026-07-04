import { useEffect, useState } from 'react'
import { Save, Loader2, CheckCircle2, Bell, BellOff, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { playNotificationSound } from '@/hooks/useAdminRealtime'

interface SiteSettings {
  id: string
  whatsapp: string
  phone: string
  instagram: string
  tiktok: string
  showroom_address: string
}

const SOUND_KEY = 'gz_admin_sound_enabled'

function getSoundPref(): boolean {
  try { return localStorage.getItem(SOUND_KEY) !== 'false' }
  catch { return true }
}

export default function AdminSettings() {
  const { t, i18n } = useTranslation()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(getSoundPref)

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('*').limit(1).single()
    if (data) setSettings(data)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    await supabase.from('settings').update({
      whatsapp: settings.whatsapp,
      phone:    settings.phone,
      instagram: settings.instagram,
      tiktok:   settings.tiktok,
      showroom_address: settings.showroom_address
    }).eq('id', settings.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChange = (field: keyof SiteSettings, value: string) => {
    if (settings) setSettings({ ...settings, [field]: value })
  }

  const handleSoundToggle = (val: boolean) => {
    setSoundEnabled(val)
    localStorage.setItem(SOUND_KEY, String(val))
    // Also update the live AdminLayout state if mounted
    if (typeof (window as any).__gz_setSoundEnabled === 'function') {
      ;(window as any).__gz_setSoundEnabled(val)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!settings) return null

  const isRTL = i18n.language === 'ar'

  return (
    <div className="space-y-6 max-w-4xl" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {t('admin.settings.title', 'Paramètres du Site')}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {t('admin.settings.subtitle', 'Gérez les informations de contact globales')}
        </p>
      </div>

      {/* Success banner */}
      {saved && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          {t('admin.settings.success', 'Paramètres sauvegardés avec succès !')}
        </div>
      )}

      {/* Contact Info */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          {t('admin.settings.contact_info', 'Informations de Contact')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('admin.settings.whatsapp', 'Numéro WhatsApp (Format: +213...)')}
            </label>
            <input
              type="text"
              dir="ltr"
              value={settings.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('admin.settings.phone', 'Numéro de Téléphone (Affichage)')}
            </label>
            <input
              type="text"
              dir="ltr"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          {t('admin.settings.socials', 'Réseaux Sociaux')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('admin.settings.instagram', 'Username Instagram')}
            </label>
            <div className="flex items-center" dir="ltr">
              <span className="px-3.5 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 text-sm">@</span>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('admin.settings.tiktok', 'Username TikTok')}
            </label>
            <div className="flex items-center" dir="ltr">
              <span className="px-3.5 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 text-sm">@</span>
              <input
                type="text"
                value={settings.tiktok.replace('@', '')}
                onChange={(e) => handleChange('tiktok', '@' + e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          {t('admin.settings.location', 'Localisation')}
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t('admin.settings.showroom_address', 'Adresse du Showroom')}
          </label>
          <textarea
            rows={3}
            value={settings.showroom_address}
            onChange={(e) => handleChange('showroom_address', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm resize-none"
          />
        </div>
      </div>

      {/* Notification Sounds */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
          {t('admin.settings.notifications', 'Notifications Sonores')}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${soundEnabled ? 'bg-primary/10' : 'bg-gray-100'}`}>
              {soundEnabled
                ? <Bell className="w-4.5 h-4.5 text-primary" />
                : <BellOff className="w-4.5 h-4.5 text-gray-400" />
              }
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {t('admin.settings.sound_enabled', 'Activer les sons de notification')}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t('admin.settings.notifications_desc', 'Activer les sons de notification pour les nouvelles commandes et messages.')}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    console.log('[Settings] Test Sound button clicked.')
                    playNotificationSound()
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors text-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  Test Notification Sound
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    console.log('[Settings] Inserting fake order to test realtime...')
                    const { data, error } = await supabase.from('orders').insert({
                      customer_name: 'TEST FAKE ORDER',
                      phone: '0000000000',
                      wilaya: 'Test Wilaya',
                      address: 'Test Address',
                      product_id: '1ab9a218-4186-4b51-a978-6402f574d800', // A random UUID or known product
                      product_name: 'Test Product',
                      price: 0,
                      status: 'pending'
                    }).select()
                    if (error) {
                      console.error('[Settings] Fake order insert failed:', error)
                      ;(window as any).__gz_addToast({
                        id: Date.now().toString(),
                        type: 'error',
                        message: 'Insert failed! See console.',
                        timestamp: Date.now()
                      })
                    } else {
                      console.log('[Settings] Fake order inserted successfully:', data)
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  Insert Fake Order
                </button>
              </div>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            role="switch"
            aria-checked={soundEnabled}
            onClick={() => handleSoundToggle(!soundEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              soundEnabled ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ${
                soundEnabled
                  ? (isRTL ? '-translate-x-5' : 'translate-x-5')
                  : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-8 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md disabled:opacity-70"
        >
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('admin.settings.saving', 'Sauvegarde...')}</>
            : <><Save className="w-4 h-4" /> {t('admin.settings.save', 'Sauvegarder les modifications')}</>
          }
        </button>
      </div>
    </div>
  )
}
