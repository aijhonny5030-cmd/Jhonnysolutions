import React, { useState, useEffect } from 'react';
import { ChevronUp, MessageCircle, Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';
import { Product, Testimonial, Message, StoreSettings } from './types';
import { DEFAULT_SETTINGS, FAQ_LIST } from './data';
import {
  subscribeToProducts,
  subscribeToTestimonials,
  subscribeToMessages,
  subscribeToSettings,
  saveProduct,
  deleteProduct,
  saveTestimonial,
  deleteTestimonial,
  saveMessage,
  deleteMessage,
  saveSettings
} from './db';

// Component imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Offers from './components/Offers';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AdminPanel from './components/AdminPanel';
import PINModal from './components/PINModal';
import Toaster, { AlertItem } from './components/Toaster';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ReviewModal from './components/ReviewModal';

export default function App() {
  // Global persistent states (stored in Firebase)
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Local preferences (stored in localStorage)
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Theme and Filters
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Modals Gating
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPINModalOpen, setIsPINModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  // Custom toast alerts
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const handleTestimonialSubmit = async (testimonial: Testimonial) => {
    try {
      await saveTestimonial(testimonial);
      addAlert('¡Gracias por tu reseña! Ha sido publicada.', 'success');
    } catch (error) {
      console.error(error);
      addAlert('Error al publicar tu reseña.', 'error');
    }
  };

  // 1. Initial State Loading from Firebase
  useEffect(() => {
    // Fallback to stop loading if Firebase takes too long
    const timeout = setTimeout(() => {
      setIsAppLoading(false);
    }, 3000);

    const unsubProducts = subscribeToProducts(setProducts);
    const unsubTestimonials = subscribeToTestimonials(setTestimonials);
    const unsubMessages = subscribeToMessages(setMessages);
    const unsubSettings = subscribeToSettings((s) => {
      setSettings(s);
      setIsAppLoading(false);
      clearTimeout(timeout);
    });

    // Wishlist from localStorage
    const storedWishlist = localStorage.getItem('jstore_wishlist');
    if (storedWishlist) {
      try { setWishlist(JSON.parse(storedWishlist)); } catch (e) { setWishlist([]); }
    }

    // Theme preference check
    const storedTheme = localStorage.getItem('jstore_theme');
    if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      updateThemeColor(false);
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      updateThemeColor(true);
    }

    return () => {
      unsubProducts();
      unsubTestimonials();
      unsubMessages();
      unsubSettings();
      clearTimeout(timeout);
    };
  }, []);

  // 2. Scroll detection for showing the Floating scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
    const updateThemeColor = (isDark: boolean) => {
    const color = isDark ? '#0a0e1a' : '#f8fafc';
    
    // Remover todos los meta theme-color para evitar conflictos con media queries de iOS/Android
    document.querySelectorAll('meta[name="theme-color"]').forEach(el => el.remove());
    
    // Crear uno nuevo con el color actual sin media query para forzar el color
    const metaThemeColor = document.createElement('meta');
    metaThemeColor.setAttribute('name', 'theme-color');
    metaThemeColor.setAttribute('content', color);
    document.head.appendChild(metaThemeColor);

    // Actualizar barra de estado en iOS Safari
    let appleMobile = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleMobile) {
      appleMobile = document.createElement('meta');
      appleMobile.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(appleMobile);
    }
    appleMobile.setAttribute('content', isDark ? 'black-translucent' : 'default');
  };

  // 3. Dark Mode Toggle
  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      updateThemeColor(true);
      localStorage.setItem('jstore_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      updateThemeColor(false);
      localStorage.setItem('jstore_theme', 'light');
    }
  };

  // 4. Alert Handlers
  const addAlert = (message: string, type: 'success' | 'info' | 'error') => {
    const id = `alert-${Date.now()}-${Math.random()}`;
    setAlerts(prev => [...prev, { id, message, type }]);
    
    // Automatically dismiss alert after 3.5 seconds
    setTimeout(() => {
      removeAlert(id);
    }, 3500);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // 5. Wishlist toggle handler
  const handleToggleWishlist = (id: string) => {
    let nextWishlist: string[];
    if (wishlist.includes(id)) {
      nextWishlist = wishlist.filter(item => item !== id);
      addAlert('Eliminado de favoritos', 'info');
    } else {
      nextWishlist = [...wishlist, id];
      addAlert('Agregado a favoritos', 'success');
    }
    setWishlist(nextWishlist);
    localStorage.setItem('jstore_wishlist', JSON.stringify(nextWishlist));
  };

  // 6. Action Handlers passed to Sub-components
  const handleSaveProduct = async (product: Product) => {
    // Optimistic update
    setProducts(prev => {
      if (prev.some(p => p.id === product.id)) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [product, ...prev];
    });
    await saveProduct(product);
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await deleteProduct(id);
    
    // Clear item from wishlist as well if deleted
    if (wishlist.includes(id)) {
      const nextWish = wishlist.filter(item => item !== id);
      setWishlist(nextWish);
      localStorage.setItem('jstore_wishlist', JSON.stringify(nextWish));
    }
  };

  const handleSaveTestimonial = async (testimonial: Testimonial) => {
    setTestimonials(prev => [testimonial, ...prev]);
    await saveTestimonial(testimonial);
  };

  const handleDeleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    await deleteTestimonial(id);
  };

  const handleSendMessage = async (message: Message) => {
    setMessages(prev => [message, ...prev]);
    await saveMessage(message);
  };

  const handleDeleteMessage = async (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    await deleteMessage(id);
  };

  const handleSaveSettings = async (newSettings: StoreSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  // 7. Render configurations and filter logic
  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter(p => p.category === activeCategory);

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-white dark:bg-navy text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* 1. HEADER / NAVBAR */}
      <Navbar
        logoName={settings?.storeName || 'Jhonny Solutions'}
        products={products}
        wishlist={wishlist}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onAdminClick={() => setIsPINModalOpen(true)}
        onProductClick={(p) => setSelectedProduct(p)}
      />

      {/* 2. HERO LANDING & FEATURED SLIDER */}
      <Hero
        products={products}
        settings={settings}
        onProductClick={(p) => setSelectedProduct(p)}
      />

      {/* 3. FLASH COUNTDOWN BANNERS */}
      <Offers />

      {/* 4. MAIN PRODUCT CATALOGUE */}
      <section id="productos" className="py-20 bg-gray-50 dark:bg-navy-light/20 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <span className="w-2.5 h-6 bg-accent rounded-full" /> Nuestro Catálogo
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Explora una selección selecta de periféricos, ordenadores y soluciones tecnológicas premium.
            </p>
          </div>

          {/* Dynamic Categories Tab Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat, i) => (
              <button
                key={cat || `cat-${i}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-xs font-bold rounded-full border transition duration-300 ${
                  activeCategory === cat
                    ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                    : 'bg-white dark:bg-navy-mid hover:bg-gray-100 dark:hover:bg-navy text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Render of Products */}
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-16 text-sm">
              No hay productos disponibles bajo la categoría "{activeCategory}".
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((p, i) => (
                <ProductCard
                  key={p.id || `prod-${i}`}
                  product={p}
                  isWished={wishlist.includes(p.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onProductClick={(item) => setSelectedProduct(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. BENEFITS SECTION */}
      <section className="py-20 bg-white dark:bg-navy transition-colors">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              ¿Por qué elegir {settings?.storeName || 'Jhonny Solutions'}?
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Te acompañamos en cada compra ofreciéndote las máximas garantías del sector.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 dark:bg-navy-light/45 rounded-3xl border border-gray-150/50 dark:border-white/5 shadow-sm group hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition duration-300">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white mb-2 text-base">Envío Seguro</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Entrega rápida y con total cobertura de extravíos a nivel nacional.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 dark:bg-navy-light/45 rounded-3xl border border-gray-150/50 dark:border-white/5 shadow-sm group hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald group-hover:scale-110 transition duration-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white mb-2 text-base">Garantía Certificada</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Todos nuestros dispositivos cuentan con su garantía oficial de fábrica.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 dark:bg-navy-light/45 rounded-3xl border border-gray-150/50 dark:border-white/5 shadow-sm group hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition duration-300">
                <Headphones className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white mb-2 text-base">Asesoría Técnica</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Soporte personalizado pre y post-venta para resolver cualquier duda.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 dark:bg-navy-light/45 rounded-3xl border border-gray-150/50 dark:border-white/5 shadow-sm group hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition duration-300">
                <RefreshCw className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white mb-2 text-base">Devolución Simple</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Te asistimos en cambios o devoluciones rápidas durante los primeros 15 días.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-20 bg-gray-50 dark:bg-navy-light/20 transition-colors">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Opiniones de Clientes
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Nuestra prioridad número uno es tu satisfacción. Conoce lo que opinan nuestros compradores.
            </p>
          </div>

          {testimonials.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">No hay opiniones de clientes todavía.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((t, i) => (
                <div key={t.id || `test-${i}`} className="bg-white dark:bg-navy-mid p-7 rounded-3xl shadow-lg border border-gray-100 dark:border-white/5 hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-sky-400 flex items-center justify-center text-white font-extrabold text-sm select-none shadow">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{t.name}</p>
                      <div className="text-xs text-yellow-400 font-mono mt-0.5">
                        {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 bg-white dark:bg-navy-light text-gray-900 dark:text-white font-bold py-3.5 px-8 rounded-full shadow-lg border border-gray-100 dark:border-white/5 hover:scale-105 transition-transform duration-300"
            >
              <MessageCircle className="w-5 h-5 text-accent" />
              <span>Dejar una reseña</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. BRAND PARTNER TRUST */}
      <section className="py-16 bg-white dark:bg-navy border-y border-gray-100 dark:border-white/5 transition-colors">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">
            Nuestros Socios Estratégicos
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14 opacity-50 dark:opacity-40">
            <span className="text-xl md:text-2xl font-extrabold text-gray-500 dark:text-gray-400 tracking-tight">Microsoft</span>
            <span className="text-xl md:text-2xl font-extrabold text-gray-500 dark:text-gray-400 tracking-tight">Google</span>
            <span className="text-xl md:text-2xl font-extrabold text-gray-500 dark:text-gray-400 tracking-tight">Amazon</span>
            <span className="text-xl md:text-2xl font-extrabold text-gray-500 dark:text-gray-400 tracking-tight">Apple</span>
            <span className="text-xl md:text-2xl font-extrabold text-gray-500 dark:text-gray-400 tracking-tight">Meta</span>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <FAQ faqItems={FAQ_LIST} />

      {/* 9. CONTACT FORM INTERACTION */}
      <ContactForm
        onSendMessage={handleSendMessage}
        onAddAlert={addAlert}
      />

      {/* 10. FOOTER INFORMATION */}
      <Footer
        settings={settings}
        logoName={settings?.storeName || 'Jhonny Solutions'}
      />

      {/* 11. FLOATING QUICK ACTIONS */}
      
      {/* Floating WhatsApp Action node */}
      <a
        href={`https://wa.me/${settings.whatsapp || '18091234567'}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 left-6 z-[90] w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group ${
          (selectedProduct || isAdminPanelOpen || isPINModalOpen || isReviewModalOpen) ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white fill-current group-hover:rotate-12 transition-transform" />
        {/* Help label popup */}
        <span className="absolute left-16 scale-0 group-hover:scale-100 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-transform duration-300 font-bold shadow-lg">
          ¡Chatea con nosotros!
        </span>
      </a>

      {/* Back to Top Floating Trigger */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-[90] w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-xl text-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${
          (showScrollTop && !selectedProduct && !isAdminPanelOpen && !isPINModalOpen && !isReviewModalOpen) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Volver arriba"
      >
        <ChevronUp className="w-5 h-5 animate-bounce-slow" />
      </button>

      {/* 12. GATED ACCESS MODALS (ADMIN SYSTEM) */}
      
      {/* Gated Access PIN Gating Modal */}
      <PINModal
        isOpen={isPINModalOpen}
        correctPIN={settings.adminPin}
        onClose={() => setIsPINModalOpen(false)}
        onSuccess={() => setIsAdminPanelOpen(true)}
        onAddAlert={addAlert}
      />

      {/* Dynamic Slide Drawer Admin Panel */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        products={products}
        testimonials={testimonials}
        messages={messages}
        settings={settings}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onSaveTestimonial={handleSaveTestimonial}
        onDeleteTestimonial={handleDeleteTestimonial}
        onDeleteMessage={handleDeleteMessage}
        onSaveSettings={handleSaveSettings}
        onAddAlert={addAlert}
      />

      {/* 13. FULL DETAILS DIALOG */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleTestimonialSubmit}
      />

      {/* 14. TOASTER ALERTS AND AUTO-CONVERSION PUFFS */}
      <Toaster
        alerts={alerts}
        onRemoveAlert={removeAlert}
        products={products}
      />

    </div>
  );
}
