import { useEffect, useState } from 'react'
import { Loader2, Calendar, Mail, MailOpen, Trash2, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { ContactMessage } from '@/types'
import ConfirmModal from '@/components/admin/ConfirmModal'

export default function AdminMessages() {
  const { t, i18n } = useTranslation()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()

    const handleDeleteMessage = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail?.id) {
        setMessages(prev => prev.filter(m => m.id !== customEvent.detail.id))
      }
    }

    window.addEventListener('delete-admin-message', handleDeleteMessage)
    return () => window.removeEventListener('delete-admin-message', handleDeleteMessage)
  }, [])

  async function fetchMessages() {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setMessages(data)
    setLoading(false)
  }

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('contact_messages').update({ is_read: !currentStatus }).eq('id', id)
    fetchMessages()
  }

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return
    const id = messageToDelete
    setMessageToDelete(null)

    // Optimistic remove
    setMessages(prev => prev.filter(m => m.id !== id))

    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    
    if (error) {
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'error',
        message: t('admin.error', 'Erreur lors de la suppression.'),
        timestamp: Date.now()
      })
      fetchMessages() // revert on error
    } else {
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'success',
        message: 'Message deleted successfully.',
        timestamp: Date.now()
      })
    }
  }

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  )

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div className="space-y-6" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            {t('admin.messages.title', 'Messages')}
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {unreadCount} {t('admin.messages.unread', 'Non lus')}
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{t('admin.messages.subtitle', 'Gérez les messages de contact')}</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
          <input
            type="text"
            placeholder={t('admin.messages.search', 'Rechercher un message...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full ${i18n.language === 'ar' ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">{t('admin.messages.empty', 'Aucun message trouvé.')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 hidden md:table">
              <thead className="bg-gray-50/50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">{t('admin.messages.table.status', 'Statut')}</th>
                  <th className="px-6 py-4 font-medium">{t('admin.messages.table.contact', 'Contact')}</th>
                  <th className="px-6 py-4 font-medium">{t('admin.messages.table.subject', 'Sujet / Message')}</th>
                  <th className="px-6 py-4 font-medium">{t('admin.messages.table.date', 'Date')}</th>
                  <th className="px-6 py-4 font-medium text-right">{t('admin.messages.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMessages.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-gray-50/50 transition-colors ${!msg.is_read ? 'bg-primary/5' : ''}`}>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleReadStatus(msg.id!, msg.is_read!)}
                        className={`p-2 rounded-full transition-colors ${!msg.is_read ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        title={msg.is_read ? t('admin.messages.mark_unread', 'Marquer comme non lu') : t('admin.messages.mark_read', 'Marquer comme lu')}
                      >
                        {msg.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <p className={`font-bold ${!msg.is_read ? 'text-gray-900' : 'text-gray-700'}`}>{msg.name}</p>
                      <div className="text-xs text-gray-500">{msg.email}</div>
                      <div className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit" dir="ltr">{msg.phone}</div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className={`font-medium mb-1 ${!msg.is_read ? 'text-gray-900' : 'text-gray-700'}`}>{msg.subject}</p>
                      <p className="text-sm text-gray-600 line-clamp-2" title={msg.message}>{msg.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Calendar className="w-4 h-4" />
                        {new Date(msg.created_at!).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setMessageToDelete(msg.id!)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('admin.messages.delete', 'Supprimer')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {filteredMessages.map((msg) => (
                <div key={msg.id} className={`p-4 flex flex-col gap-3 transition-colors ${!msg.is_read ? 'bg-primary/5' : 'bg-white hover:bg-gray-50/50'}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className={`font-bold truncate ${!msg.is_read ? 'text-gray-900' : 'text-gray-700'}`}>{msg.name}</p>
                      <p className={`font-medium text-sm mt-0.5 truncate ${!msg.is_read ? 'text-gray-900' : 'text-gray-700'}`}>{msg.subject}</p>
                    </div>
                    <button 
                      onClick={() => toggleReadStatus(msg.id!, msg.is_read!)}
                      className={`p-1.5 rounded-full transition-colors shrink-0 ${!msg.is_read ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {msg.is_read ? <MailOpen className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded font-mono" dir="ltr">{msg.phone}</div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">{msg.email}</div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                      <Calendar className="w-3 h-3" />
                      {new Date(msg.created_at!).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 mt-1 italic break-words border-l-2 border-gray-200 pl-2">"{msg.message}"</div>
                  
                  <div className="flex justify-end mt-1">
                    <button 
                      onClick={() => setMessageToDelete(msg.id!)}
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
        isOpen={!!messageToDelete}
        title="Delete Message?"
        description="This action cannot be undone. Are you sure you want to permanently delete this message?"
        confirmText="Delete Message"
        onCancel={() => setMessageToDelete(null)}
        onConfirm={confirmDeleteMessage}
      />
    </div>
  )
}
