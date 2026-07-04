import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Loader2, Save, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import ConfirmModal from '@/components/admin/ConfirmModal'

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminCategories() {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  
  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
    if (data) setCategories(data)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) return

    if (editingId) {
      await supabase.from('categories').update({ name, slug }).eq('id', editingId)
    } else {
      await supabase.from('categories').insert([{ name, slug }])
    }

    setName('')
    setSlug('')
    setIsAdding(false)
    setEditingId(null)
    fetchCategories()
  }

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return
    const id = categoryToDelete
    setCategoryToDelete(null)

    // Optimistic remove
    setCategories(prev => prev.filter(c => c.id !== id))

    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) {
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'error',
        message: "Erreur lors de la suppression: " + (error.message || 'Erreur inconnue'),
        timestamp: Date.now()
      })
      fetchCategories() // revert on error
    } else {
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'success',
        message: "Catégorie supprimée avec succès.",
        timestamp: Date.now()
      })
    }
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setName(cat.name)
    setSlug(cat.slug)
    setIsAdding(true)
  }

  return (
    <div className="space-y-6" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('admin.categories.title', 'Catégories')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('admin.categories.subtitle', 'Gérez les catégories de vos produits')}</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => { setIsAdding(true); setName(''); setSlug(''); setEditingId(null); }}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> {t('admin.categories.add', 'Ajouter')}
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">{editingId ? t('admin.categories.edit', 'Modifier la catégorie') : t('admin.categories.new', 'Nouvelle catégorie')}</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('admin.categories.form.name', 'Nom')}</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => {
                  setName(e.target.value)
                  if (!editingId) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
                  }
                }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder={t('admin.categories.form.name_placeholder', 'Ex: Salons Modernes')}
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('admin.categories.form.slug', 'Identifiant URL (Slug)')}</label>
              <input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-left"
                dir="ltr"
                placeholder="salons-modernes"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={handleSave}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors flex-1 sm:flex-auto justify-center"
              >
                <Save className="w-4 h-4" /> {t('admin.categories.form.save', 'Sauvegarder')}
              </button>
              <button 
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t('admin.categories.empty', 'Aucune catégorie trouvée.')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 hidden lg:table">
              <thead className="bg-gray-50/50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">{t('admin.categories.table.name', 'Nom de la catégorie')}</th>
                  <th className="px-6 py-4 font-medium">{t('admin.categories.table.slug', 'Slug URL')}</th>
                  <th className={`px-6 py-4 font-medium ${i18n.language === 'ar' ? 'text-left' : 'text-right'}`}>{t('admin.categories.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{t(`categories.${cat.name.toLowerCase()}`, { defaultValue: cat.name })}</td>
                    <td className="px-6 py-4 font-mono text-xs">{cat.slug}</td>
                    <td className={`px-6 py-4 ${i18n.language === 'ar' ? 'text-left' : 'text-right'} space-x-2`}>
                      <button 
                        onClick={() => startEdit(cat)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setCategoryToDelete(cat.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile/Tablet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:hidden">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-bold text-gray-900">{t(`categories.${cat.name.toLowerCase()}`, { defaultValue: cat.name })}</p>
                    <p className="font-mono text-xs text-gray-500 mt-1">{cat.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(cat)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors bg-white border border-gray-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setCategoryToDelete(cat.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors bg-white border border-gray-200"
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
        isOpen={!!categoryToDelete}
        title="Supprimer la catégorie ?"
        description="Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette catégorie ?"
        confirmText="Supprimer"
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  )
}
