import { useCallback, useState, useEffect } from 'react'
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import {
  LayoutDashboard, Package, ShoppingCart, FolderTree,
  Settings, LogOut, MessageSquare, ExternalLink
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useAdminRealtime, type ToastEvent } from '@/hooks/useAdminRealtime'
import AdminToast from './AdminToast'
import AdminLangSwitcher from './AdminLangSwitcher'

const SOUND_KEY = 'gz_admin_sound_enabled'

function getSoundPref(): boolean {
  try { return localStorage.getItem(SOUND_KEY) !== 'false' }
  catch { return true }
}

export default function AdminLayout() {
  const { t, i18n } = useTranslation()
  const { session, isLoading, signOut } = useAuth()
  const location  = useLocation()
  const isRTL     = i18n.language === 'ar'

  const [toasts,       setToasts]       = useState<ToastEvent[]>([])
  const [soundEnabled, setSoundEnabled] = useState(getSoundPref)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Expose sound preference globally so Settings page can mutate it
  ;(window as any).__gz_setSoundEnabled = (val: boolean) => {
    setSoundEnabled(val)
    localStorage.setItem(SOUND_KEY, String(val))
  }
  ;(window as any).__gz_getSoundEnabled = () => soundEnabled

  // Expose global toast helper
  ;(window as any).__gz_addToast = (evt: ToastEvent) => {
    setToasts(prev => [...prev.slice(-3), evt])
  }

  const [unreadOrders, setUnreadOrders] = useState(0)

  useEffect(() => {
    if (location.pathname === '/admin/orders') {
      setUnreadOrders(0)
    }
    // Close mobile menu on route change
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const handleNewOrder = useCallback((evt: ToastEvent) => {
    setToasts(prev => [...prev.slice(-3), evt])
    if (location.pathname !== '/admin/orders') {
      setUnreadOrders(prev => prev + 1)
    }
  }, [location.pathname])

  const handleNewMessage = useCallback((evt: ToastEvent) => {
    setToasts(prev => [...prev.slice(-3), evt])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useAdminRealtime({
    onNewOrder:   handleNewOrder,
    onNewMessage: handleNewMessage,
    soundEnabled,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  const navigation = [
    { name: t('admin.nav.dashboard',   'Dashboard'),    href: '/admin/dashboard',   icon: LayoutDashboard },
    { name: t('admin.nav.products',    'Produits'),     href: '/admin/products',    icon: Package         },
    { name: t('admin.nav.categories',  'Catégories'),   href: '/admin/categories',  icon: FolderTree      },
    { name: t('admin.nav.orders',      'Commandes'),    href: '/admin/orders',      icon: ShoppingCart,   badge: unreadOrders > 0 ? unreadOrders : null },
    { name: t('admin.nav.messages',    'Messages'),     href: '/admin/messages',    icon: MessageSquare   },
    { name: t('admin.nav.settings',    'Paramètres'),   href: '/admin/settings',    icon: Settings        },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={cn(
        'w-64 bg-white flex flex-col fixed inset-y-0 z-50 shadow-sm transition-transform duration-300 ease-in-out',
        isRTL ? 'border-l border-gray-200 right-0' : 'border-r border-gray-200 left-0',
        isMobileMenuOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')
      )}>
        {/* Logo header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200 bg-premium-dark">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-white shrink-0">
              <img src="/gazameuble-logo.png" alt="Gazameuble" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">Gazameuble</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-primary/8 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className={cn(
                  'w-4.5 h-4.5 shrink-0 transition-colors',
                  isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'
                )} />
                <span>{item.name}</span>
                {item.badge != null && (
                  <span className={cn(
                    'flex items-center justify-center min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[11px] font-bold px-1.5',
                    isRTL ? 'mr-auto ml-0' : 'ml-auto mr-0'
                  )}>
                    {item.badge}
                  </span>
                )}
                {/* Active indicator */}
                {isActive && item.badge == null && (
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full bg-primary',
                    isRTL ? 'ml-0 mr-auto' : 'ml-auto mr-0'
                  )} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer: user info + lang + logout */}
        <div className="p-3 border-t border-gray-100 space-y-1">
          {/* View site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all min-h-[44px]"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {t('admin.nav.view_site', 'Voir le site')}
          </a>

          {/* Logout */}
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all min-h-[44px]"
          >
            <LogOut className={cn('w-4 h-4 shrink-0 text-gray-400', isRTL && 'rotate-180')} />
            {t('admin.nav.logout', 'Déconnexion')}
          </button>

          {/* User email */}
          {session.user?.email && (
            <div className="px-3 py-2">
              <p className="text-[11px] text-gray-400 truncate" dir="ltr">{session.user.email}</p>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className={cn(
        'flex-1 flex flex-col min-h-screen w-full lg:w-auto',
        isRTL ? 'lg:mr-64' : 'lg:ml-64'
      )}>
        {/* Top header bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-white shrink-0">
              <img src="/gazameuble-logo.png" alt="Gazameuble" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className={cn("flex items-center gap-3", isRTL ? "mr-auto" : "ml-auto")}>
            <AdminLangSwitcher />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 w-full overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Toast portal ────────────────────────────────────────────────────── */}
      <AdminToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
