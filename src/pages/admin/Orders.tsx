import { useEffect, useState } from 'react'
import { Loader2, Calendar, Phone, MapPin, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import StatusDropdown, { OrderStatus } from '@/components/admin/StatusDropdown'
import ConfirmModal from '@/components/admin/ConfirmModal'

interface Order {
  id: string
  customer_name: string
  phone: string
  wilaya: string
  address: string
  product_name: string
  quantity: number
  message: string
  status: OrderStatus
  created_at: string
}

export default function AdminOrders() {
  const { t, i18n } = useTranslation()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()

    const handleNewOrder = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail) {
        setOrders(prev => [customEvent.detail, ...prev])
      }
    }

    const handleDeleteOrder = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail?.id) {
        setOrders(prev => prev.filter(o => o.id !== customEvent.detail.id))
      }
    }

    const handleUpdateOrder = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail?.id) {
        setOrders(prev => prev.map(o => o.id === customEvent.detail.id ? { ...o, ...customEvent.detail } : o))
      }
    }

    window.addEventListener('new-admin-order', handleNewOrder)
    window.addEventListener('delete-admin-order', handleDeleteOrder)
    window.addEventListener('update-admin-order', handleUpdateOrder)

    return () => {
      window.removeEventListener('new-admin-order', handleNewOrder)
      window.removeEventListener('delete-admin-order', handleDeleteOrder)
      window.removeEventListener('update-admin-order', handleUpdateOrder)
    }
  }, [])

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setOrders(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
    
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    
    if (error) {
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'error',
        message: t('admin.error', 'Erreur lors de la mise à jour.'),
        timestamp: Date.now()
      })
      fetchOrders() // revert on error
    } else {
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'success',
        message: t('admin.orders.status_success', 'Statut mis à jour avec succès.'),
        timestamp: Date.now()
      })
    }
  }

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return
    const id = orderToDelete
    setOrderToDelete(null)

    // Optimistic remove
    setOrders(prev => prev.filter(o => o.id !== id))

    const { error } = await supabase.from('orders').delete().eq('id', id)
    
    if (error) {
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'error',
        message: t('admin.error', 'Erreur lors de la suppression.'),
        timestamp: Date.now()
      })
      fetchOrders() // revert on error
    } else {
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'success',
        message: t('admin.orders.delete_success', 'Commande supprimée avec succès.'),
        timestamp: Date.now()
      })
    }
  }

  return (
    <div className="space-y-6" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('admin.orders.title', 'Commandes')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('admin.orders.subtitle', 'Gérez les demandes de devis et commandes')}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">{t('admin.orders.empty', 'Aucune commande pour le moment.')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 hidden md:table">
              <thead className="bg-gray-50/50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">{t('admin.orders.table.client', 'Client')}</th>
                  <th className="px-6 py-4 font-medium">{t('admin.orders.table.contact', 'Contact & Adresse')}</th>
                  <th className="px-6 py-4 font-medium">{t('admin.orders.table.product', 'Produit / Message')}</th>
                  <th className="px-6 py-4 font-medium">{t('admin.orders.table.date', 'Date')}</th>
                  <th className={`px-6 py-4 font-medium ${i18n.language === 'ar' ? 'text-left' : ''}`}>{t('admin.orders.table.status', 'Statut & Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{order.customer_name}</p>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded w-fit" dir="ltr"><Phone className="w-3 h-3"/> {order.phone}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500"><MapPin className="w-3 h-3"/> {order.wilaya}</div>
                      {order.address && <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate" title={order.address}>{order.address}</div>}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-medium text-gray-900 mb-1">{order.product_name} <span className="text-gray-500 font-normal">x{order.quantity || 1}</span></p>
                      {order.message && <p className="text-xs text-gray-500 truncate" title={order.message}>"{order.message}"</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <StatusDropdown value={order.status} onChange={(s) => updateStatus(order.id, s)} />
                        <button 
                          onClick={() => setOrderToDelete(order.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title={t('admin.orders.delete', 'Supprimer la commande')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="p-4 flex flex-col gap-3 bg-white hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 truncate">{order.customer_name}</p>
                      <p className="text-sm font-medium text-gray-900 mt-0.5 truncate">{order.product_name} <span className="text-gray-500 font-normal">x{order.quantity || 1}</span></p>
                    </div>
                    <StatusDropdown value={order.status} onChange={(s) => updateStatus(order.id, s)} />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded font-mono" dir="ltr"><Phone className="w-3 h-3"/> {order.phone}</div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded"><MapPin className="w-3 h-3"/> {order.wilaya}</div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  {order.address && <div className="text-xs text-gray-600 mt-1"><span className="font-semibold">{t('admin.orders.table.contact', 'Contact & Adresse')}:</span> {order.address}</div>}
                  {order.message && <div className="text-xs text-gray-500 mt-1 italic break-words border-l-2 border-gray-200 pl-2">"{order.message}"</div>}
                  
                  <div className="flex justify-end mt-1">
                    <button 
                      onClick={() => setOrderToDelete(order.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!orderToDelete}
        title={t('admin.orders.delete_title', 'Delete Order?')}
        description={t('admin.orders.delete_desc', 'This action cannot be undone. Are you sure you want to permanently delete this order?')}
        confirmText={t('admin.orders.delete_confirm', 'Delete Order')}
        onCancel={() => setOrderToDelete(null)}
        onConfirm={confirmDeleteOrder}
      />
    </div>
  )
}
