import React, { useState } from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWished: boolean;
  onToggleWishlist: (id: string) => void;
  onProductClick: (p: Product) => void;
  key?: React.Key;
}

export default function ProductCard({
  product,
  isWished,
  onToggleWishlist,
  onProductClick
}: ProductCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Mouse tilt movement for 3D card experience
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateY = ((x / rect.width) - 0.5) * 8; // Max 8 degrees tilt
    const rotateX = ((y / rect.height) - 0.5) * -8;
    
    setRotate({ x: rotateX, y: rotateY });
    setScale(1.02);
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setScale(1);
  };

  // Compute discount percentage if not precalculated
  const discount = (product.salePrice && product.salePrice > 0 && product.price > 0)
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  // Render yellow stars
  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating);
    return (
      <div className="flex items-center text-yellow-400 gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < fullStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={() => onProductClick(product)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${scale})`,
        transition: rotate.x === 0 ? 'transform 0.5s ease-out' : 'none'
      }}
      className="product-card bg-white dark:bg-navy-mid rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/5 cursor-pointer flex flex-col justify-between h-full select-none"
    >
      {/* Product Image Stage */}
      <div className="relative overflow-hidden group bg-gray-50 dark:bg-navy-light flex items-center justify-center p-6 h-56">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Badges */}
        {product.badge && (
          <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md ${
            product.badge === 'Oferta' ? 'bg-red-500 animate-pulse' : 'bg-accent'
          }`}>
            {product.badge}
          </span>
        )}

        {product.status === 'Agotado' && (
          <span className="absolute top-4 right-14 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gray-900/90 text-white shadow">
            Agotado
          </span>
        )}

        {discount > 0 && (
          <span className="absolute bottom-4 left-4 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-lg shadow">
            -{discount}%
          </span>
        )}

        {/* Wishlist Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`heart-btn absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md bg-white/90 dark:bg-navy/90 border border-black/5 hover:scale-110 transition`}
          aria-label="Agregar a favoritos"
        >
          <Heart
            className={`w-4 h-4 transition ${isWished ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
          />
        </button>
      </div>

      {/* Info Block */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-extrabold tracking-widest mb-1.5">
            {product.category}
          </p>
          <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-1 group-hover:text-accent transition-colors mb-1">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {product.descriptionShort}
          </p>
        </div>

        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-4">
            {renderStars(product.rating)}
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
              ({product.salesCount || 0} v.)
            </span>
          </div>

          {/* Pricing & Buy Trigger */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-accent leading-none">
                ${((product.salePrice && product.salePrice > 0 ? product.salePrice : product.price) || 0).toFixed(2)}
              </span>
              {product.salePrice && product.salePrice > 0 ? (
                <span className="text-xs text-gray-500 dark:text-gray-400 line-through mt-0.5">
                  ${(product.price || 0).toFixed(2)}
                </span>
              ) : null}
            </div>

            <a
              href={product.buyLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`px-4 py-2 bg-accent text-white font-bold rounded-xl text-xs flex items-center gap-1 hover:bg-sky-600 transition shadow-md shadow-accent/15 ${
                product.status === 'Agotado' ? 'pointer-events-none opacity-50 bg-gray-500 hover:bg-gray-500' : ''
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Comprar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
