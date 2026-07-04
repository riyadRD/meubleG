-- Create categories table
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create products table
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    images TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    wilaya VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Create settings table
CREATE TABLE public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    whatsapp VARCHAR(50),
    phone VARCHAR(50),
    instagram VARCHAR(255),
    tiktok VARCHAR(255),
    showroom_address TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default settings row
INSERT INTO public.settings (whatsapp, phone, instagram, tiktok, showroom_address)
VALUES ('+2130553174484', '0553 17 44 84', 'gaza_mueble', '@gazameuble1', 'Oran, Algérie');

-- Set up Row Level Security (RLS)

-- Categories: Public read, Auth write
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories are insertable by authenticated users only" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Categories are updatable by authenticated users only" ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Categories are deletable by authenticated users only" ON public.categories FOR DELETE USING (auth.role() = 'authenticated');

-- Products: Public read, Auth write
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by authenticated users only" ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Products are updatable by authenticated users only" ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Products are deletable by authenticated users only" ON public.products FOR DELETE USING (auth.role() = 'authenticated');

-- Orders: Public insert, Auth read/write
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create an order request" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Only authenticated users can view orders" ON public.orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update orders" ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete orders" ON public.orders FOR DELETE USING (auth.role() = 'authenticated');

-- Contact Messages: Public insert, Auth read/write
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create a contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only authenticated users can view contact messages" ON public.contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update contact messages" ON public.contact_messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete contact messages" ON public.contact_messages FOR DELETE USING (auth.role() = 'authenticated');

-- Settings: Public read, Auth write
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are viewable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Settings are updatable by authenticated users only" ON public.settings FOR UPDATE USING (auth.role() = 'authenticated');

-- Set up Storage for Product Images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
