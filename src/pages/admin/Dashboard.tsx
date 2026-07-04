import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, ShoppingCart, Activity, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'

interface Stats {
  products: number
  orders: number
  pendingOrders: number
  deliveredOrders: number
  messages: number
  unreadMessages: number
}

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, pendingOrders: 0, deliveredOrders: 0, messages: 0, unreadMessages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: productsCount },
          { count: ordersCount },
          { count: pendingOrdersCount },
          { count: deliveredOrdersCount },
          { count: messagesCount },
          { count: unreadMessagesCount }
        ] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false)
        ])

        setStats({
          products: productsCount || 0,
          orders: ordersCount || 0,
          pendingOrders: pendingOrdersCount || 0,
          deliveredOrders: deliveredOrdersCount || 0,
          messages: messagesCount || 0,
          unreadMessages: unreadMessagesCount || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    const handleNewOrder = () => {
      setStats(prev => ({
        ...prev,
        orders: prev.orders + 1,
        pendingOrders: prev.pendingOrders + 1
      }))
    }

    window.addEventListener('new-admin-order', handleNewOrder)
    return () => window.removeEventListener('new-admin-order', handleNewOrder)
  }, [])

  const cards = [
    { title: t('admin.dashboard.total_products', 'Total Produits'), value: stats.products, icon: Package, trend: '' },
    { title: t('admin.dashboard.total_orders', 'Commandes'), value: stats.orders, icon: ShoppingCart, trend: '' },
    { title: t('admin.dashboard.pending_orders', 'En Attente'), value: stats.pendingOrders, icon: Activity, trend: 'Action Requise', urgent: stats.pendingOrders > 0 },
    { title: t('admin.dashboard.delivered_orders', 'Livrées'), value: stats.deliveredOrders, icon: ShoppingCart, trend: '' },
    { title: t('admin.dashboard.total_messages', 'Total Messages'), value: stats.messages, icon: Package, trend: '' },
    { title: t('admin.dashboard.unread_messages', 'Non Lus'), value: stats.unreadMessages, icon: Activity, trend: 'Nouveau(x)', urgent: stats.unreadMessages > 0 },
  ]

  return (
    <div className="space-y-6" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('admin.dashboard.title', "Vue d'ensemble")}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <card.icon className="w-5 h-5 text-gray-600" />
              </div>
              {card.urgent && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </div>
            
            <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
            <h3 className="text-3xl font-bold text-gray-900 font-serif">
              {loading ? '-' : card.value}
            </h3>
            
            <div className="mt-4 flex items-center gap-1.5 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span className={card.urgent ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium'}>
                {card.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400 text-sm">{t('admin.dashboard.chart_empty', 'Le graphique des ventes sera disponible une fois que vous aurez plus de données.')}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[300px]">
          <h3 className="font-bold text-gray-900 mb-4">{t('admin.dashboard.recent_activity', 'Activité récente')}</h3>
          <p className="text-gray-400 text-sm">{t('admin.dashboard.no_activity', 'Aucune activité récente.')}</p>
        </div>
      </div>
    </div>
  )
}
