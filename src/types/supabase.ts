export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          category_id: string | null
          images: string[]
          in_stock: boolean
          is_popular: boolean
          is_new: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price?: number
          category_id?: string | null
          images?: string[]
          in_stock?: boolean
          is_popular?: boolean
          is_new?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          category_id?: string | null
          images?: string[]
          in_stock?: boolean
          is_popular?: boolean
          is_new?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          phone: string
          wilaya: string
          address: string
          product_name: string
          quantity: number
          message: string | null
          status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          phone: string
          wilaya: string
          address: string
          product_name: string
          quantity?: number
          message?: string | null
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          phone?: string
          wilaya?: string
          address?: string
          product_name?: string
          quantity?: number
          message?: string | null
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          phone: string
          email: string
          subject: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email: string
          subject: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string
          subject?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          whatsapp: string | null
          phone: string | null
          instagram: string | null
          tiktok: string | null
          showroom_address: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          whatsapp?: string | null
          phone?: string | null
          instagram?: string | null
          tiktok?: string | null
          showroom_address?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          whatsapp?: string | null
          phone?: string | null
          instagram?: string | null
          tiktok?: string | null
          showroom_address?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
