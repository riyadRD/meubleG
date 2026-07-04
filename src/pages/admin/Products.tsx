import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, Edit2, Loader2, Save, X, ImagePlus, CheckCircle2, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import ConfirmModal from '@/components/admin/ConfirmModal'

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  category_id: string | null
  images: string[]
  in_stock: boolean
  is_popular: boolean
  is_new: boolean
}

export default function AdminProducts() {
  const { t, i18n } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  
  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [categoryId, setCategoryId] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [inStock, setInStock] = useState(true)
  const [isPopular, setIsPopular] = useState(false)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name')
      ])
      
      if (productsRes.error) throw productsRes.error
      if (categoriesRes.error) throw categoriesRes.error

      if (productsRes.data) setProducts(productsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
    } catch (error) {
      console.error("Erreur de chargement:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPrice(0)
    setCategoryId('')
    setImages([])
    setInStock(true)
    setIsPopular(false)
    setIsNew(false)
    setIsAdding(false)
    setEditingId(null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return
      
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
      
      setImages([...images, data.publicUrl])
    } catch (error) {
      console.error(error)
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'error',
        message: t('admin.error', 'Erreur lors du téléchargement de l\'image.'),
        timestamp: Date.now()
      })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!title.trim() || !categoryId) {
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'error',
        message: t('admin.products.form.error_required', 'Veuillez remplir le titre et la catégorie.'),
        timestamp: Date.now()
      })
      return
    }

    try {
      const payload = {
        title,
        description,
        price,
        category_id: categoryId,
        images,
        in_stock: inStock,
        is_popular: isPopular,
        is_new: isNew
      }

      const { error } = editingId 
        ? await supabase.from('products').update(payload).eq('id', editingId)
        : await supabase.from('products').insert([payload])

      if (error) throw error

      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'success',
        message: t('admin.products.save_success', 'Produit sauvegardé avec succès.'),
        timestamp: Date.now()
      })

      resetForm()
      fetchData()
    } catch (error: any) {
      console.error(error)
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'error',
        message: "Erreur lors de la sauvegarde: " + (error.message || 'Erreur inconnue'),
        timestamp: Date.now()
      })
    }
  }

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return
    const id = productToDelete
    setProductToDelete(null)

    // Optimistic remove
    setProducts(prev => prev.filter(p => p.id !== id))

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'success',
        message: t('admin.products.delete_success', 'Produit supprimé avec succès.'),
        timestamp: Date.now()
      })
    } catch (error: any) {
      console.error(error)
      ;(window as any).__gz_addToast({
        id: Date.now().toString(),
        type: 'error',
        message: "Erreur lors de la suppression: " + (error.message || 'Erreur inconnue'),
        timestamp: Date.now()
      })
      fetchData() // revert
    }
  }

  const startEdit = (p: Product) => {
    setEditingId(p.id)
    setTitle(p.title)
    setDescription(p.description || '')
    setPrice(p.price)
    setCategoryId(p.category_id || '')
    setImages(p.images || [])
    setInStock(p.in_stock)
    setIsPopular(p.is_popular)
    setIsNew(p.is_new)
    setIsAdding(true)
  }

  return (
    <div className="space-y-6" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('admin.products.title', 'Produits')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('admin.products.subtitle', 'Gérez votre catalogue de produits')}</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> {t('admin.products.add', 'Ajouter un produit')}
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">{editingId ? t('admin.products.edit', 'Modifier le produit') : t('admin.products.new', 'Nouveau produit')}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-2"><X className="w-5 h-5"/></button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.form.title', 'Titre du produit')}</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder={t('admin.products.form.title_placeholder', 'Ex: Canapé Modulable Beige')} />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.form.price', 'Prix (DZD)')}</label>
                  <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-left" dir="ltr" placeholder="0" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.form.category', 'Catégorie')}</label>
                  <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                    <option value="">{t('admin.products.form.category_placeholder', 'Sélectionner...')}</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{t(`categories.${c.name.toLowerCase()}`, { defaultValue: c.name })}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.form.description', 'Description')}</label>
                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder={t('admin.products.form.description_placeholder', 'Description détaillée...')}></textarea>
              </div>
            </div>

            <div className="space-y-6">
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.products.form.images', 'Images du produit')}</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3"/></button>
                    </div>
                  ))}
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all">
                    {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><ImagePlus className="w-6 h-6 mb-1" /><span className="text-xs font-medium">{t('admin.products.form.add_image', 'Ajouter')}</span></>}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-gray-700">{t('admin.products.form.in_stock', 'En stock')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-gray-700">{t('admin.products.form.popular', 'Produit populaire')}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-gray-700">{t('admin.products.form.new', 'Nouveauté')}</span>
                </label>
              </div>

              <button onClick={handleSave} className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-md">
                <Save className="w-4 h-4" /> {t('admin.products.form.save', 'Sauvegarder le produit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Package className="w-8 h-8 text-gray-400" /></div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{t('admin.products.empty.title', 'Aucun produit')}</h3>
            <p className="text-gray-500 mb-4 text-sm">{t('admin.products.empty.subtitle', 'Commencez par ajouter votre premier meuble au catalogue.')}</p>
            <button onClick={() => setIsAdding(true)} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">{t('admin.products.add', 'Ajouter un produit')}</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 hidden md:table">
              <thead className="bg-gray-50/50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium w-16">{t('admin.products.table.image', 'Image')}</th>
                  <th className="px-6 py-4 font-medium">{t('admin.products.table.product', 'Produit')}</th>
                  <th className="px-6 py-4 font-medium">{t('admin.products.table.price', 'Prix')}</th>
                  <th className="px-6 py-4 font-medium">{t('admin.products.table.status', 'Statut')}</th>
                  <th className={`px-6 py-4 font-medium ${i18n.language === 'ar' ? 'text-left' : 'text-right'}`}>{t('admin.products.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        {p.images && p.images[0] ? <img src={p.images[0]} className="w-full h-full object-cover" alt="" /> : <Package className="w-5 h-5 text-gray-400 m-auto mt-2" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{p.title}</p>
                      <p className="text-xs text-gray-500">
                        {t(`categories.${categories.find(c => c.id === p.category_id)?.name.toLowerCase()}`, { defaultValue: categories.find(c => c.id === p.category_id)?.name || t('admin.products.table.no_category', 'Sans catégorie') })}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium">{new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(p.price)}</td>
                    <td className="px-6 py-4 space-y-1">
                      {p.in_stock ? <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md"><CheckCircle2 className="w-3 h-3"/> {t('product.in_stock', 'En stock')}</span> : <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-md">{t('product.out_of_stock', 'Rupture')}</span>}
                    </td>
                    <td className={`px-6 py-4 ${i18n.language === 'ar' ? 'text-left' : 'text-right'} space-x-2`}>
                      <button onClick={() => startEdit(p)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors min-h-[44px] min-w-[44px]"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setProductToDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] min-w-[44px]"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {products.map((p) => (
                <div key={p.id} className="p-4 flex flex-col gap-3 bg-white hover:bg-gray-50/50 transition-colors">
                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-16 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      {p.images && p.images[0] ? <img src={p.images[0]} className="w-full h-full object-cover" alt="" /> : <Package className="w-6 h-6 text-gray-400 m-auto mt-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 truncate">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t(`categories.${categories.find(c => c.id === p.category_id)?.name.toLowerCase()}`, { defaultValue: categories.find(c => c.id === p.category_id)?.name || t('admin.products.table.no_category', 'Sans catégorie') })}
                      </p>
                      <div className="mt-1">
                        {p.in_stock ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider"><CheckCircle2 className="w-3 h-3"/> {t('product.in_stock', 'En stock')}</span> : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{t('product.out_of_stock', 'Rupture')}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-3 border-t border-gray-50">
                    <p className="font-bold text-gray-900">{new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(p.price)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors border border-gray-200"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setProductToDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!productToDelete}
        title={t('admin.products.delete_title', 'Delete Product?')}
        description={t('admin.products.delete_desc', 'This action cannot be undone. Are you sure you want to permanently delete this product?')}
        confirmText={t('admin.products.delete_confirm', 'Delete Product')}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDeleteProduct}
      />
    </div>
  )
}
