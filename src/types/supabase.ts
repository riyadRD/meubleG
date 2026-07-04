export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
    }
    Views: {
      [key: string]: never
    }
    Functions: {
      [key: string]: never
    }
    Enums: {
      [key: string]: never
    }
    CompositeTypes: {
      [key: string]: never
    }
  }
}
