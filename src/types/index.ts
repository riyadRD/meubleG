export type ProductCategory = 'salons' | 'chambres' | 'tables' | 'meubles';

export interface Product {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: number;
  category: ProductCategory;
  images: string[];
  is_new: boolean;
  is_popular: boolean;
  in_stock: boolean;
}

export interface OrderRequest {
  fullName: string;
  phone: string;
  wilaya: string;
  address: string;
  quantity: number;
  productId: string;
  productName: string;
  message?: string;
  timestamp: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

export interface CustomerLead {
  id: string;
  fullName: string;
  phone: string;
  wilaya: string;
  interestedIn: string[];
  createdAt: string;
}
