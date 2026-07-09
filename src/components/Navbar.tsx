import React, { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, Heart, Settings, X } from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  logoName: string;
  products: Product[];
  wishlist: string[];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onAdminClick: () => void;
  onProductClick: (p: Product) => void;
}

export default function Navbar({
  logoName,
  products,
  wishlist,
  isDarkMode,
  onToggleDarkMode,
  onAdminClick,
  onProductClick
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const wishlistRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node)) {
        setShowWishlistDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results (up to 5 items)
  const filteredSearch = searchQuery.trim()
    ? products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const favoriteProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/90 dark:bg-navy/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-lg" id="main-header">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#inicio" className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2 hover:text-accent transition">
          <span className="bg-gradient-to-r from-accent to-sky-400 bg-clip-text text-transparent">
            {logoName || 'Jhonny Solutions'}
          </span>
          <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-mono font-medium border border-accent/30 hidden sm:inline">
            Store
          </span>
        </a>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#inicio" className="text-gray-700 dark:text-gray-200 hover:text-accent dark:hover:text-accent transition-colors">Inicio</a>
          <a href="#productos" className="text-gray-700 dark:text-gray-200 hover:text-accent dark:hover:text-accent transition-colors">Productos</a>
          <a href="#ofertas" className="text-gray-700 dark:text-gray-200 hover:text-accent dark:hover:text-accent transition-colors">Ofertas</a>
          <a href="#contacto" className="text-gray-700 dark:text-gray-200 hover:text-accent dark:hover:text-accent transition-colors">Contacto</a>
        </nav>

        {/* Right tools */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search bar */}
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-32 sm:w-44 md:w-56 pl-9 pr-8 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-sm border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-accent focus:border-transparent focus:w-48 sm:focus:w-56 md:focus:w-64 outline-none placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 p-0.5 hover:bg-white/20 rounded-full transition"
                >
                  <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && filteredSearch.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-navy-mid rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50 border border-gray-100 dark:border-white/5 w-64 sm:w-72 md:w-80 overflow-hidden">
                <div className="p-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">Resultados</span>
                </div>
                {filteredSearch.map((p, i) => (
                  <button
                    key={p.id || `srch-${i}`}
                    onClick={() => {
                      onProductClick(p);
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-navy transition flex items-center gap-3 border-b border-gray-100 dark:border-white/5 last:border-b-0"
                  >
                    <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-navy-light flex-shrink-0" alt={p.title} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{p.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.category}</p>
                      <p className="text-xs font-bold text-accent mt-0.5">
                        ${((p.salePrice || p.price) || 0).toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme switcher */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition text-gray-700 dark:text-white"
            aria-label="Cambiar tema"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Wishlist Favorites */}
          <div className="relative" ref={wishlistRef}>
            <button
              onClick={() => setShowWishlistDropdown(!showWishlistDropdown)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition text-gray-700 dark:text-white relative"
              aria-label="Favoritos"
            >
              <Heart className={`w-5 h-5 transition ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Wishlist Dropdown */}
            {showWishlistDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-navy-mid rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50 border border-gray-100 dark:border-white/5 w-80 overflow-hidden">
                <div className="p-3 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-navy-light">
                  <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Mis Favoritos ({wishlist.length})</span>
                </div>
                
                {favoriteProducts.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <Heart className="w-8 h-8 mx-auto mb-2 opacity-30 text-gray-500 dark:text-gray-400" />
                    <p className="text-sm">No tienes productos favoritos aún</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {favoriteProducts.map((p, i) => (
                      <button
                        key={p.id || `fav-${i}`}
                        onClick={() => {
                          onProductClick(p);
                          setShowWishlistDropdown(false);
                        }}
                        className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-navy transition flex items-center gap-3"
                      >
                        <img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-navy-light flex-shrink-0" alt={p.title} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{p.title}</p>
                          <p className="text-xs text-accent font-semibold mt-0.5">
                            ${((p.salePrice || p.price) || 0).toFixed(2)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Admin panel */}
          <button
            onClick={onAdminClick}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition text-gray-700 dark:text-white"
            aria-label="Admin"
          >
            <Settings className="w-5 h-5 hover:rotate-45 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
