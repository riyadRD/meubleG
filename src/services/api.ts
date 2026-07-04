import { Product, OrderRequest, CustomerLead } from '@/types';
import { supabase } from '@/lib/supabase';

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      
      return data.map(p => ({
        ...p,
        category: p.categories?.name || 'Sans catégorie'
      })) as Product[];
    },
    getById: async (id: string): Promise<Product | undefined> => {
      const { data, error } = await supabase
        .from('products')
        .select(`*, categories(name)`)
        .eq('id', id)
        .single();
        
      if (error || !data) return undefined;
      
      return {
        ...data,
        category: data.categories?.name || 'Sans catégorie'
      } as Product;
    },
    getByCategory: async (categoryName: string): Promise<Product[]> => {
      // First get category ID
      const { data: catData } = await supabase.from('categories').select('id').eq('name', categoryName).single();
      if (!catData) return [];

      const { data, error } = await supabase
        .from('products')
        .select(`*, categories(name)`)
        .eq('category_id', catData.id);
        
      if (error) return [];
      
      return data.map(p => ({
        ...p,
        category: p.categories?.name || 'Sans catégorie'
      })) as Product[];
    }
  },
  orders: {
    submitRequest: async (request: OrderRequest): Promise<{ success: boolean; message: string }> => {
      const { error } = await supabase.from('orders').insert([{
        customer_name: request.fullName,
        phone: request.phone,
        wilaya: request.wilaya,
        address: request.address,
        product_name: request.productName,
        quantity: request.quantity,
        message: request.message,
        status: 'pending'
      }]);
      
      if (error) {
        console.error('Error submitting order:', error);
        return { success: false, message: 'Une erreur est survenue.' };
      }
      
      return { success: true, message: 'Votre demande a été enregistrée avec succès.' };
    }
  },
  messages: {
    submitContact: async (message: { name: string; email: string; phone: string; subject: string; message: string }): Promise<{ success: boolean; message: string }> => {
      const { error } = await supabase.from('contact_messages').insert([{
        name: message.name,
        email: message.email,
        phone: message.phone,
        subject: message.subject,
        message: message.message,
        is_read: false
      }]);

      if (error) {
        console.error('Error submitting message:', error);
        return { success: false, message: 'Une erreur est survenue.' };
      }

      return { success: true, message: 'Votre message a été envoyé.' };
    }
  }
};
