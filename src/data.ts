import { Product, Testimonial, StoreSettings } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Laptop Pro-Book 15" i7',
    descriptionShort: 'Potente computadora para profesionales y estudiantes de alto rendimiento.',
    descriptionFull: 'Equipada con procesador Intel Core i7 de última generación, 16 GB de memoria RAM y 512 GB SSD. Su pantalla Full HD con bordes delgados ofrece una experiencia visual envolvente, ideal para desarrollo, diseño gráfico o multitarea exigente. Batería de larga duración de hasta 10 horas y chasis metálico ultraligero.',
    category: 'Laptops',
    price: 999.99,
    salePrice: 849.99,
    discountPercent: 15,
    imageUrl: 'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80'
    ],
    buyLink: 'https://wa.me/18091234567?text=Hola,%20estoy%20interesado%20en%20el%20producto%20Laptop%20Pro-Book%2015%22%20i7',
    status: 'Disponible',
    featured: true,
    badge: 'Más vendido',
    rating: 4.8,
    salesCount: 142,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    title: 'Auriculares Inalámbricos Studio Pro',
    descriptionShort: 'Auriculares de diadema con cancelación activa de ruido híbrida.',
    descriptionFull: 'Experimenta la pureza de tu música favorita con sonido de alta resolución y cancelación activa de ruido inteligente de hasta 40dB. Cuentan con controladores dinámicos de 40mm para bajos profundos y agudos nítidos, autonomía de 40 horas con carga rápida USB-C y almohadillas acolchadas con memoria de forma para una comodidad inigualable.',
    category: 'Accesorios',
    price: 189.99,
    salePrice: 129.99,
    discountPercent: 31,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80'
    ],
    buyLink: 'https://wa.me/18091234567?text=Hola,%20estoy%20interesado%20en%20el%20producto%20Auriculares%20Inal%C3%A1mbricos%20Studio%20Pro',
    status: 'Disponible',
    featured: true,
    badge: 'Oferta',
    rating: 4.6,
    salesCount: 88,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    title: 'Teclado Mecánico RGB Spectrum',
    descriptionShort: 'Teclado mecánico con switches red, silencioso e ideal para gaming.',
    descriptionFull: 'Teclado con formato 80% (TKL) con switches mecánicos lineales rojos de alta sensibilidad y vida útil de 50 millones de pulsaciones. Iluminación RGB totalmente personalizable tecla por tecla con más de 16 millones de colores y múltiples modos dinámicos. Estructura de aluminio reforzado con cable trenzado removible USB-C.',
    category: 'Accesorios',
    price: 89.99,
    salePrice: 0,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80'
    ],
    buyLink: 'https://wa.me/18091234567?text=Hola,%20estoy%20interesado%20en%20el%20producto%20Teclado%20Mec%C3%A1nico%20RGB%20Spectrum',
    status: 'Disponible',
    featured: false,
    badge: 'Nuevo',
    rating: 4.5,
    salesCount: 56,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    title: 'Smartwatch Active Elite v2',
    descriptionShort: 'Reloj inteligente con GPS integrado, monitor cardíaco y de sueño.',
    descriptionFull: 'El compañero perfecto para tu salud y entrenamiento. Registra tus calorías, ritmo cardíaco en tiempo real, niveles de oxígeno en sangre (SpO2), y análisis de sueño avanzado. Resistente al agua 5 ATM (hasta 50 metros), pantalla AMOLED de alta resolución de 1.43" siempre activa y autonomía sobresaliente de hasta 14 días.',
    category: 'Relojes',
    price: 249.99,
    salePrice: 199.99,
    discountPercent: 20,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=600&q=80'
    ],
    buyLink: 'https://wa.me/18091234567?text=Hola,%20estoy%20interesado%20en%20el%20producto%20Smartwatch%20Active%20Elite%20v2',
    status: 'Disponible',
    featured: true,
    badge: 'Oferta',
    rating: 4.7,
    salesCount: 110,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    title: 'Monitor Ultra-Wide Curvo 34"',
    descriptionShort: 'Monitor inmersivo curvo de 34 pulgadas WQHD para productividad y gaming.',
    descriptionFull: 'Disfruta de un campo de visión ultra amplio con este panel curvo de 1500R, resolución WQHD de 3440 x 1440 píxeles y relación de aspecto 21:9. Tasa de refresco de 144Hz para juegos ultra fluidos, tiempo de respuesta de 1ms, cobertura sRGB del 99% para colores fieles, y conexiones HDMI, DisplayPort y HUB USB.',
    category: 'Pantallas',
    price: 499.99,
    salePrice: 429.99,
    discountPercent: 14,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=600&q=80'
    ],
    buyLink: 'https://wa.me/18091234567?text=Hola,%20estoy%20interesado%20en%20el%20producto%20Monitor%20Ultra-Wide%20Curvo%2034%22',
    status: 'Disponible',
    featured: false,
    badge: 'Nuevo',
    rating: 4.9,
    salesCount: 39,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    title: 'Micrófono de Condensador Podcast Pro',
    descriptionShort: 'Micrófono USB premium de condensador profesional con cuatro patrones polares.',
    descriptionFull: 'Excelente calidad de audio con resolución de 24 bits / 48 kHz. Ideal para podcasts, transmisiones en vivo, doblaje, grabaciones musicales o videoconferencias. Cuenta con control de ganancia directo, botón de silencio instantáneo de un toque, salida de auriculares sin latencia y base de escritorio metálica antivibración.',
    category: 'Accesorios',
    price: 129.99,
    salePrice: 0,
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512446816042-444d641267d4?auto=format&fit=crop&w=600&q=80'
    ],
    buyLink: 'https://wa.me/18091234567?text=Hola,%20estoy%20interesado%20en%20el%20producto%20Micr%C3%B3fono%20de%20Condensador%20Podcast%20Pro',
    status: 'Disponible',
    featured: false,
    badge: '',
    rating: 4.4,
    salesCount: 22,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    title: 'Cámara Web ProStream 4K',
    descriptionShort: 'Cámara web Ultra HD con enfoque automático inteligente y anillo de luz.',
    descriptionFull: 'Captura videos con una nitidez incomparable en resolución 4K a 30 FPS o 1080p a 60 FPS. Incorpora un anillo de luz LED ajustable táctilmente en 3 niveles de brillo, micrófonos duales estéreo con cancelación de ruido ambiental avanzada, tapa física de privacidad deslizable y montaje seguro universal con rosca para trípode.',
    category: 'Accesorios',
    price: 149.99,
    salePrice: 119.99,
    discountPercent: 20,
    imageUrl: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=600&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=600&q=80'
    ],
    buyLink: 'https://wa.me/18091234567?text=Hola,%20estoy%20interesado%20en%20el%20producto%20C%C3%A1mara%20Web%20ProStream%204K',
    status: 'Próximamente',
    featured: false,
    badge: 'Próximamente',
    rating: 4.3,
    salesCount: 0,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Carlos Mendoza',
    comment: 'Excelente servicio. Compré la Laptop Pro-Book y la atención fue rápida y personalizada vía WhatsApp. Llegó al día siguiente tal como acordamos.',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'María Alejandra González',
    comment: 'Los auriculares Studio Pro son espectaculares. La cancelación de ruido es brutal y son comodísimos para trabajar todo el día. Muy recomendados.',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Juan Diego Ortiz',
    comment: 'La tienda tiene los mejores accesorios tecnológicos de Santo Domingo. La clave PIN para el panel de clientes es útil y el catálogo se actualiza constantemente.',
    rating: 4
  }
];

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Jhonny Solutions',
  heroTagline: 'Tecnología de Vanguardia',
  heroTitle1: 'Soluciones Tecnológicas',
  heroTitle2: 'A tu Alcance',
  heroDescription: 'Descubre los mejores productos y servicios tecnológicos con la calidad, garantía y asesoría experta que mereces. Explora nuestro catálogo premium hoy mismo.',
  email: 'info@johnnysolutions.com',
  whatsapp: '18091234567',
  facebook: 'https://facebook.com/johnnysolutions',
  instagram: 'https://instagram.com/johnnysolutions',
  tiktok: 'https://tiktok.com/@johnnysolutions',
  adminPin: '2700',
  heroImage: '',
};

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_LIST: FAQItem[] = [
  {
    id: 'faq-1',
    question: '¿Cuáles son los métodos de pago disponibles?',
    answer: 'Aceptamos transferencias bancarias directas (Banco Popular, BHD, Banreservas), pagos con tarjetas de crédito/débito a través de links de pago seguros, y efectivo contra entrega en zonas de cobertura seleccionadas.'
  },
  {
    id: 'faq-2',
    question: '¿Hacen envíos a todo el país?',
    answer: 'Sí, realizamos envíos seguros a nivel nacional a través de servicios de mensajería express y transporte certificado. En el Gran Santo Domingo, contamos con entregas directas en menos de 24 horas laborables.'
  },
  {
    id: 'faq-3',
    question: '¿Cómo funciona la garantía de los productos?',
    answer: 'Todos nuestros productos son 100% originales y cuentan con garantía de fábrica, que oscila entre los 3 y 12 meses dependiendo del artículo. La garantía cubre defectos de fabricación bajo uso normal.'
  }
];
