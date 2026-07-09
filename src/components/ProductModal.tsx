import React, { useState, useEffect } from 'react';
import { X, Eye, Star, ShieldCheck, Truck, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [activeImage, setActiveImage] = useState('');
  const [viewersCount, setViewersCount] = useState(7);

  // Reset active image when product changes, and randomize viewers count
  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
      setViewersCount(Math.floor(Math.random() * 18) + 5); // Random between 5 and 22
    }
  }, [product]);

  if (!product) return null;

  // Compute discount percentage
  const discount = (product.salePrice && product.salePrice > 0 && product.price > 0)
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  // Render stars
  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating);
    return (
      <div className="flex items-center text-yellow-400 gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < fullStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Stage container */}
      <div className="relative bg-white dark:bg-navy-mid rounded-3xl overflow-y-auto max-h-[90vh] w-full max-w-4xl shadow-2xl border border-gray-100 dark:border-white/5 z-10 animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-gray-100 dark:bg-navy-light hover:bg-gray-200 dark:hover:bg-navy rounded-full text-gray-500 dark:text-gray-300 transition z-10"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Layout */}
        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Image Showcase and Gallery Row */}
          <div className="md:w-1/2 flex flex-col">
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-50 dark:bg-navy-light flex items-center justify-center p-6 border border-gray-100 dark:border-white/5 relative">
              <img
                src={activeImage || product.imageUrl}
                className="max-h-full max-w-full object-contain"
                alt={product.title}
              />
            </div>

            {/* Gallery Thumbnail Row */}
            {product.imageGallery && product.imageGallery.length > 0 && (
              <div className="flex gap-2.5 mt-3.5 overflow-x-auto pb-2 scroll-smooth">
                {product.imageGallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 bg-gray-50 dark:bg-navy-light p-1 transition ${
                      activeImage === imgUrl ? 'border-accent shadow' : 'border-gray-200 dark:border-gray-700/50 hover:border-gray-400'
                    }`}
                  >
                    <img src={imgUrl} className="w-full h-full object-contain" alt="Miniatura" />
                  </button>
                ))}
              </div>
            )}

            {/* Mock Viewers Counter */}
            <div className="flex items-center gap-2 mt-5 text-xs sm:text-sm text-red-500 bg-red-500/10 dark:bg-red-500/5 border border-red-500/10 px-4 py-2 rounded-xl self-start font-medium animate-pulse">
              <Eye className="w-4 h-4" />
              <span>{viewersCount} personas están viendo este artículo ahora</span>
            </div>
          </div>

          {/* Right Column: Full description and Details */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              {/* Badge & Category */}
              <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                {product.badge && (
                  <span className="px-3 py-1 bg-accent text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-sm">
                    {product.badge}
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400 font-extrabold tracking-widest uppercase">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                {product.title}
              </h2>

              {/* Stars Rating */}
              <div className="flex items-center gap-2 mb-4">
                {renderStars(product.rating)}
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                  ({product.salesCount || 0} ventas realizadas)
                </span>
              </div>

              {/* Status Row */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs text-gray-500">Estado:</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  product.status === 'Disponible'
                    ? 'bg-emerald/10 text-emerald border border-emerald/20'
                    : product.status === 'Agotado'
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                    : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                }`}>
                  {product.status}
                </span>
              </div>

              {/* Price Row */}
              <div className="flex items-center gap-3.5 mb-6 flex-wrap bg-gray-50 dark:bg-navy-light/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-accent">
                    ${((product.salePrice && product.salePrice > 0 ? product.salePrice : product.price) || 0).toFixed(2)}
                  </span>
                  {product.salePrice && product.salePrice > 0 && (
                    <span className="text-base text-gray-500 dark:text-gray-400 line-through">
                      ${(product.price || 0).toFixed(2)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-black animate-pulse">
                    AHORRA {discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
                {product.descriptionFull || product.descriptionShort}
              </p>
            </div>

            {/* Extras list & Button */}
            <div className="mt-4 border-t border-gray-100 dark:border-white/5 pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-accent" />
                  <span>Envío seguro a todo el país</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald" />
                  <span>Garantía oficial directa</span>
                </div>
              </div>

              <a
                href={product.buyLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`glow-btn w-full py-4 bg-accent text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 text-base transition-all duration-300 shadow-lg shadow-accent/25 hover:bg-sky-600 ${
                  product.status === 'Agotado' ? 'pointer-events-none opacity-50 bg-gray-500 hover:bg-gray-500' : ''
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Comprar Ahora por WhatsApp
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
