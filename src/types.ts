export interface Product {
  id: string;
  title: string;
  descriptionShort: string;
  descriptionFull: string;
  category: string;
  price: number;
  salePrice?: number;
  discountPercent?: number;
  imageUrl: string;
  imageGallery?: string[];
  buyLink: string;
  status: 'Disponible' | 'Agotado' | 'Próximamente';
  featured: boolean;
  badge?: string; // 'Nuevo', 'Más vendido', 'Oferta', etc.
  rating: number;
  salesCount: number;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName?: string;
  heroTagline?: string;
  heroTitle1?: string;
  heroTitle2?: string;
  heroDescription?: string;
  email: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  adminPin: string;
  heroImage?: string;
}
