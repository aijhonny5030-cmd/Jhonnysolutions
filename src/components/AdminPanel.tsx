import React, { useState, useEffect } from 'react';
import { X, Trash2, Edit3, Plus, ArrowUpRight, Save, MessageSquare, Star, Settings, ShoppingBag, MessageCircle, Upload } from 'lucide-react';
import { Product, Testimonial, Message, StoreSettings } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  testimonials: Testimonial[];
  messages: Message[];
  settings: StoreSettings;
  onSaveProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSaveTestimonial: (t: Testimonial) => void;
  onDeleteTestimonial: (id: string) => void;
  onDeleteMessage: (id: string) => void;
  onSaveSettings: (s: StoreSettings) => void;
  onAddAlert: (msg: string, type: 'success' | 'info' | 'error') => void;
}

type TabType = 'products' | 'testimonials' | 'messages' | 'settings';

export default function AdminPanel({
  isOpen,
  onClose,
  products,
  testimonials,
  messages,
  settings,
  onSaveProduct,
  onDeleteProduct,
  onSaveTestimonial,
  onDeleteTestimonial,
  onDeleteMessage,
  onSaveSettings,
  onAddAlert
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  
  // Product form state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pTitle, setPTitle] = useState('');
  const [pDescShort, setPDescShort] = useState('');
  const [pDescFull, setPDescFull] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pStatus, setPStatus] = useState<Product['status']>('Disponible');
  const [pPrice, setPPrice] = useState('');
  const [pSalePrice, setPSalePrice] = useState('');
  const [pRating, setPRating] = useState('5');
  const [pImageUrl, setPImageUrl] = useState('');
  const [pBuyLink, setPBuyLink] = useState('');
  const [pFeatured, setPFeatured] = useState(false);
  const [pBadge, setPBadge] = useState('');
  const [pSalesCount, setPSalesCount] = useState('0');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Testimonial form state
  const [tName, setTName] = useState('');
  const [tComment, setTComment] = useState('');
  const [tRating, setTRating] = useState('5');

  // Config settings form state
  const [sStoreName, setSStoreName] = useState('');
  const [sHeroTagline, setSHeroTagline] = useState('');
  const [sHeroTitle1, setSHeroTitle1] = useState('');
  const [sHeroTitle2, setSHeroTitle2] = useState('');
  const [sHeroDescription, setSHeroDescription] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sWhatsapp, setSWhatsapp] = useState('');
  const [sFacebook, setSFacebook] = useState('');
  const [sInstagram, setSInstagram] = useState('');
  const [sTiktok, setSTiktok] = useState('');
  const [sAdminPin, setSAdminPin] = useState('');
  const [sHeroImage, setSHeroImage] = useState('');

  // Sync settings when panel opens
  useEffect(() => {
    if (settings) {
      setSStoreName(settings.storeName || '');
      setSHeroTagline(settings.heroTagline || '');
      setSHeroTitle1(settings.heroTitle1 || '');
      setSHeroTitle2(settings.heroTitle2 || '');
      setSHeroDescription(settings.heroDescription || '');
      setSEmail(settings.email || '');
      setSWhatsapp(settings.whatsapp || '');
      setSFacebook(settings.facebook || '');
      setSInstagram(settings.instagram || '');
      setSTiktok(settings.tiktok || '');
      setSAdminPin(settings.adminPin || '');
      setSHeroImage(settings.heroImage || '');
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  // Handle Edit Product click
  const handleEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setPTitle(p.title);
    setPDescShort(p.descriptionShort);
    setPDescFull(p.descriptionFull);
    setPCategory(p.category);
    setPStatus(p.status);
    setPPrice(p.price.toString());
    setPSalePrice(p.salePrice ? p.salePrice.toString() : '');
    setPRating(p.rating.toString());
    setPImageUrl(p.imageUrl);
    setPBuyLink(p.buyLink);
    setPFeatured(p.featured);
    setPBadge(p.badge || '');
    setPSalesCount(p.salesCount.toString());
    setGalleryUrls(p.imageGallery || []);
    onAddAlert('Modo edición activado', 'info');
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setPTitle('');
    setPDescShort('');
    setPDescFull('');
    setPCategory('');
    setPStatus('Disponible');
    setPPrice('');
    setPSalePrice('');
    setPRating('5');
    setPImageUrl('');
    setPBuyLink('');
    setPFeatured(false);
    setPBadge('');
    setPSalesCount('0');
    setGalleryUrls([]);
    setNewGalleryUrl('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 850 * 1024) {
      onAddAlert('La imagen es grande. Se ajustará un poco para que pueda ser guardada.', 'info');
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_SIZE = 1200;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const mimeType = (file.type === 'image/jpeg' || file.type === 'image/jpg') ? 'image/jpeg' : 'image/png';
          const dataUrl = canvas.toDataURL(mimeType, 0.9);
          setUrl(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // Keep original quality and format completely unmodified
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit product
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle || !pPrice || !pImageUrl) {
      onAddAlert('Por favor completa los campos requeridos', 'error');
      return;
    }

    const priceNum = parseFloat(pPrice);
    const salePriceNum = pSalePrice ? parseFloat(pSalePrice) : 0;

    const productData: Product = {
      id: editingProductId || `prod-${Date.now()}`,
      title: pTitle,
      descriptionShort: pDescShort,
      descriptionFull: pDescFull,
      category: pCategory || 'Accesorios',
      status: pStatus,
      price: priceNum,
      salePrice: salePriceNum > 0 ? salePriceNum : undefined,
      imageUrl: pImageUrl,
      imageGallery: galleryUrls,
      buyLink: pBuyLink || `https://wa.me/${settings.whatsapp}?text=Hola,%20estoy%20interesado%20en%20${encodeURIComponent(pTitle)}`,
      featured: pFeatured,
      badge: pBadge || undefined,
      rating: parseFloat(pRating) || 5,
      salesCount: parseInt(pSalesCount) || 0,
      createdAt: new Date().toISOString()
    };

    onSaveProduct(productData);
    onAddAlert(editingProductId ? 'Producto actualizado' : 'Producto creado con éxito', 'success');
    resetProductForm();
  };

  // Gallery items add/remove
  const handleAddGalleryUrl = () => {
    if (newGalleryUrl.trim() && !galleryUrls.includes(newGalleryUrl.trim())) {
      setGalleryUrls([...galleryUrls, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryUrl = (idx: number) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== idx));
  };

  // Submit Testimonial
  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName || !tComment) {
      onAddAlert('Por favor completa el nombre y comentario', 'error');
      return;
    }

    const testimonialData: Testimonial = {
      id: `test-${Date.now()}`,
      name: tName,
      comment: tComment,
      rating: parseInt(tRating) || 5
    };

    onSaveTestimonial(testimonialData);
    onAddAlert('Testimonio guardado', 'success');
    setTName('');
    setTComment('');
    setTRating('5');
  };

  // Submit Settings
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sEmail || !sWhatsapp || !sAdminPin) {
      onAddAlert('Email, WhatsApp y PIN son obligatorios', 'error');
      return;
    }

    const configData: StoreSettings = {
      storeName: sStoreName,
      heroTagline: sHeroTagline,
      heroTitle1: sHeroTitle1,
      heroTitle2: sHeroTitle2,
      heroDescription: sHeroDescription,
      email: sEmail,
      whatsapp: sWhatsapp,
      facebook: sFacebook,
      instagram: sInstagram,
      tiktok: sTiktok,
      adminPin: sAdminPin,
      heroImage: sHeroImage
    };

    onSaveSettings(configData);
    onAddAlert('Configuración actualizada', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Background Overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel container */}
      <aside className="relative w-full max-w-xl h-full bg-white dark:bg-navy-mid shadow-2xl border-l border-gray-100 dark:border-white/5 flex flex-col z-10 animate-slide-in">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-navy-light/50">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Panel de Control</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Administra el inventario, testimonios y configuraciones.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-150 dark:hover:bg-navy-light rounded-full text-gray-500 dark:text-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Row */}
        <div className="flex gap-1.5 px-6 py-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-navy-light/20 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-light hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'testimonials'
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-light hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Testimonios
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition flex items-center gap-1.5 relative ${
              activeTab === 'messages'
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-light hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Mensajes
            {messages.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-light hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Config
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <form onSubmit={handleProductSubmit} className="space-y-4 bg-gray-50 dark:bg-navy-light/30 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 flex items-center justify-between">
                  <span>{editingProductId ? 'Editar Producto' : 'Crear Nuevo Producto'}</span>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >
                      Cancelar Edición
                    </button>
                  )}
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Título del Producto *</label>
                  <input
                    type="text"
                    value={pTitle}
                    onChange={(e) => setPTitle(e.target.value)}
                    placeholder="Ej. Teclado Mecánico RGB"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Categoría</label>
                    <input
                      type="text"
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      placeholder="Ej. Accesorios, Laptops"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Estado</label>
                    <select
                      value={pStatus}
                      onChange={(e) => setPStatus(e.target.value as Product['status'])}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Agotado">Agotado</option>
                      <option value="Próximamente">Próximamente</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Precio ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      placeholder="99.99"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">En Oferta ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pSalePrice}
                      onChange={(e) => setPSalePrice(e.target.value)}
                      placeholder="Opcional"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={pRating}
                      onChange={(e) => setPRating(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Descripción Corta</label>
                  <input
                    type="text"
                    value={pDescShort}
                    onChange={(e) => setPDescShort(e.target.value)}
                    placeholder="Resumen del producto de una línea"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Descripción Completa</label>
                  <textarea
                    rows={3}
                    value={pDescFull}
                    onChange={(e) => setPDescFull(e.target.value)}
                    placeholder="Detalles extendidos del producto..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition resize-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Imagen Principal *</label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pImageUrl}
                      onChange={(e) => setPImageUrl(e.target.value)}
                      placeholder="Pega un enlace URL o sube una imagen 👉"
                      required
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    />
                    <label className="flex-shrink-0 px-4 py-2.5 bg-accent/10 text-accent font-bold rounded-xl border border-accent/20 cursor-pointer hover:bg-accent/20 transition text-sm flex items-center justify-center">
                      Subir
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setPImageUrl)}
                      />
                    </label>
                  </div>
                </div>

                {/* Gallery Adder */}
                <div className="p-3 bg-white dark:bg-navy-light/60 border border-gray-150 dark:border-gray-800 rounded-xl space-y-3">
                  <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Galería de Imágenes Adicionales</span>
                  
                  {galleryUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1.5 bg-gray-50 dark:bg-navy rounded-lg border border-gray-200/50 dark:border-white/5">
                      {galleryUrls.map((url, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-gray-200 dark:bg-navy-light/90 px-2 py-1 rounded-lg text-xs font-medium max-w-xs">
                          <span className="truncate flex-1 max-w-[120px] text-gray-700 dark:text-gray-300">{url}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryUrl(idx)}
                            className="p-0.5 hover:bg-red-500/10 text-red-500 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="Añadir URL"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy text-xs outline-none focus:ring-1 focus:ring-accent"
                    />
                    <label className="cursor-pointer px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-lg text-xs font-bold hover:bg-accent/20 transition flex items-center gap-1">
                      Subir
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, (url) => {
                          if (url && !galleryUrls.includes(url)) {
                            setGalleryUrls([...galleryUrls, url]);
                          }
                        })}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-500 border border-blue-500/20 rounded-lg text-xs font-bold hover:bg-blue-500/30 transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      URL
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Insignia (In-card Tag)</label>
                    <select
                      value={pBadge}
                      onChange={(e) => setPBadge(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="">Sin insignia</option>
                      <option value="Nuevo">Nuevo</option>
                      <option value="Más vendido">Más vendido</option>
                      <option value="Oferta">Oferta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Ventas Simuladas</label>
                    <input
                      type="number"
                      value={pSalesCount}
                      onChange={(e) => setPSalesCount(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Enlace de Compra (WhatsApp)</label>
                  <input
                    type="url"
                    value={pBuyLink}
                    onChange={(e) => setPBuyLink(e.target.value)}
                    placeholder="Dejar vacío para auto-generar link de WhatsApp"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={pFeatured}
                    onChange={(e) => setPFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-accent border-gray-300 focus:ring-accent accent-accent"
                  />
                  <label htmlFor="featured" className="text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                    Destacar en Carrusel Superior (Home Showcase)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-accent text-white font-extrabold rounded-xl hover:bg-sky-600 transition flex items-center justify-center gap-1.5 text-sm cursor-pointer shadow-lg shadow-accent/15"
                >
                  <Save className="w-4 h-4" />
                  {editingProductId ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
              </form>

              {/* Products List for quick deletion/edit */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Productos Registrados ({products.length})</span>
                
                {products.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">No hay productos en catálogo</p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {products.map((p, i) => (
                      <div key={p.id || `prod-${i}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-navy-light/40 border border-gray-150 dark:border-white/5 rounded-xl gap-3">
                        <img src={p.imageUrl} alt="" className="w-8 h-8 rounded object-contain bg-white flex-shrink-0" />
                        <span className="text-xs font-bold text-gray-700 dark:text-white truncate flex-1">{p.title}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditProduct(p)}
                            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              onDeleteProduct(p.id);
                              onAddAlert('Producto eliminado', 'error');
                            }}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 animate-fade-in">
              <form onSubmit={handleTestimonialSubmit} className="space-y-4 bg-gray-50 dark:bg-navy-light/30 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Crear Testimonio</h3>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Nombre de Cliente *</label>
                  <input
                    type="text"
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Comentario de Cliente *</label>
                  <textarea
                    rows={3}
                    value={tComment}
                    onChange={(e) => setTComment(e.target.value)}
                    placeholder="Me encantó el servicio, muy recomendado..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Calificación (1-5)</label>
                  <select
                    value={tRating}
                    onChange={(e) => setTRating(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  >
                    <option value="5">★★★★★ (5/5)</option>
                    <option value="4">★★★★☆ (4/5)</option>
                    <option value="3">★★★☆☆ (3/5)</option>
                    <option value="2">★★☆☆☆ (2/5)</option>
                    <option value="1">★☆☆☆☆ (1/5)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald text-white font-extrabold rounded-xl hover:bg-emerald-600 transition flex items-center justify-center gap-1.5 text-sm cursor-pointer shadow-lg shadow-emerald/15"
                >
                  <Save className="w-4 h-4" />
                  Guardar Testimonio
                </button>
              </form>

              {/* Testimonials List */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Testimonios Registrados ({testimonials.length})</span>
                
                {testimonials.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">No hay testimonios registrados</p>
                ) : (
                  <div className="space-y-2 max-h-[250px] overflow-y-auto">
                    {testimonials.map((t, i) => (
                      <div key={t.id || `test-${i}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-navy-light/40 border border-gray-150 dark:border-white/5 rounded-xl gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{t.name}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate italic">"{t.comment}"</p>
                        </div>
                        <button
                          onClick={() => {
                            onDeleteTestimonial(t.id);
                            onAddAlert('Testimonio eliminado', 'error');
                          }}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mensajes de Contacto Recibidos ({messages.length})</span>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-navy-light/10 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
                  <MessageCircle className="w-10 h-10 mx-auto opacity-30 mb-3" />
                  <p className="text-sm font-medium">No has recibido mensajes aún</p>
                  <p className="text-xs text-gray-500 mt-1">Los envíos del formulario de contacto aparecerán aquí.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[80vh] overflow-y-auto pr-1">
                  {messages.map((m, i) => (
                    <div key={m.id || `msg-${i}`} className="p-4 bg-gray-50 dark:bg-navy-light/40 rounded-2xl border border-gray-200/50 dark:border-white/5 relative group">
                      <button
                        onClick={() => {
                          onDeleteMessage(m.id);
                          onAddAlert('Mensaje archivado', 'info');
                        }}
                        className="absolute top-4 right-4 p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition opacity-80 hover:opacity-100"
                        title="Eliminar mensaje"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="mb-2">
                        <p className="text-xs font-extrabold text-gray-900 dark:text-white">{m.name}</p>
                        <a href={`mailto:${m.email}`} className="text-[10px] text-accent font-mono hover:underline">{m.email}</a>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-navy/50 p-2.5 rounded-lg border border-gray-150 dark:border-gray-800 leading-relaxed whitespace-pre-wrap">
                        {m.message}
                      </p>

                      <p className="text-[9px] text-gray-500 dark:text-gray-400 text-right mt-2">
                        {new Date(m.createdAt).toLocaleString('es-DO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: METADATA & CONFIG */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSubmit} className="space-y-4 animate-fade-in bg-gray-50 dark:bg-navy-light/30 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Configuración General de la Tienda</h3>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Nombre de la Tienda</label>
                <input
                  type="text"
                  value={sStoreName}
                  onChange={(e) => setSStoreName(e.target.value)}
                  placeholder="Ej. Jhonny Solutions"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Slogan Hero (Ej. Tecnología de Vanguardia)</label>
                <input
                  type="text"
                  value={sHeroTagline}
                  onChange={(e) => setSHeroTagline(e.target.value)}
                  placeholder="Tecnología de Vanguardia"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Título Hero Parte 1</label>
                <input
                  type="text"
                  value={sHeroTitle1}
                  onChange={(e) => setSHeroTitle1(e.target.value)}
                  placeholder="Soluciones Tecnológicas"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Título Hero Parte 2 (Destacado)</label>
                <input
                  type="text"
                  value={sHeroTitle2}
                  onChange={(e) => setSHeroTitle2(e.target.value)}
                  placeholder="A tu Alcance"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Descripción Hero</label>
                <textarea
                  value={sHeroDescription}
                  onChange={(e) => setSHeroDescription(e.target.value)}
                  placeholder="Descubre los mejores productos..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Correo Electrónico de Contacto</label>
                <input
                  type="email"
                  value={sEmail}
                  onChange={(e) => setSEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Número de WhatsApp (con código de país, ej: 18091234567)</label>
                <input
                  type="text"
                  value={sWhatsapp}
                  onChange={(e) => setSWhatsapp(e.target.value)}
                  placeholder="Ej. 18091234567"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">PIN de Acceso Administrador (Clave de Seguridad)</label>
                <input
                  type="password"
                  value={sAdminPin}
                  onChange={(e) => setSAdminPin(e.target.value)}
                  placeholder="Predeterminado: 2700"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-850 pt-4 space-y-3">
                <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enlaces de Redes Sociales</span>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Facebook Link</label>
                  <input
                    type="url"
                    value={sFacebook}
                    onChange={(e) => setSFacebook(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Instagram Link</label>
                  <input
                    type="url"
                    value={sInstagram}
                    onChange={(e) => setSInstagram(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">TikTok Link</label>
                  <input
                    type="url"
                    value={sTiktok}
                    onChange={(e) => setSTiktok(e.target.value)}
                    placeholder="https://tiktok.com/@..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-light text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-850 pt-4 space-y-3">
                <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Imagen de Portada (Hero)</span>
                {sHeroImage && (
                  <img src={sHeroImage} alt="Hero Preview" className="w-full h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sHeroImage}
                    onChange={(e) => setSHeroImage(e.target.value)}
                    placeholder="URL de la imagen"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy text-xs outline-none focus:ring-1 focus:ring-accent"
                  />
                  <label className="cursor-pointer px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-lg text-xs font-bold hover:bg-accent/20 transition flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    Subir
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setSHeroImage)}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent text-white font-extrabold rounded-xl hover:bg-sky-600 transition flex items-center justify-center gap-1.5 text-sm cursor-pointer shadow-lg shadow-accent/15"
              >
                <Save className="w-4 h-4" />
                Guardar Configuración
              </button>
            </form>
          )}

        </div>
      </aside>
    </div>
  );
}
