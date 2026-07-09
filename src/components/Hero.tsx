import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Laptop, Award, Users, ShoppingBag } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { motion } from 'motion/react';

interface HeroProps {
  products: Product[];
  settings?: StoreSettings;
  onProductClick: (p: Product) => void;
}

export default function Hero({ products, settings, onProductClick }: HeroProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const featured = products.filter(p => p.featured);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll featured carousel
  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % featured.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [featured.length]);

  // Adjust scroll position when carouselIndex changes
  useEffect(() => {
    if (carouselRef.current) {
      const cardWidth = 320; // Approximately card width + gap
      carouselRef.current.scrollTo({
        left: carouselIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  }, [carouselIndex]);

  // Static stats values
  const totalProductsCount = products.length;

  return (
    <section id="inicio" className="hero-section relative pt-24 pb-12 text-gray-900 dark:text-white overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background Particles */}
      <div className="particles absolute inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, idx) => (
          <div
            key={idx}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 pt-10">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 border border-accent/30 text-accent font-semibold text-xs uppercase tracking-widest rounded-full mb-6">
            <Award className="w-4 h-4 animate-spin-slow" /> {settings?.heroTagline || 'Tecnología de Vanguardia'}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {settings?.heroTitle1 || 'Soluciones Tecnológicas'} <br />
            <span className="bg-gradient-to-r from-accent to-sky-400 bg-clip-text text-transparent">
              {settings?.heroTitle2 || 'A tu Alcance'}
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {settings?.heroDescription || 'Descubre los mejores productos y servicios tecnológicos con la calidad, garantía y asesoría experta que mereces. Explora nuestro catálogo premium hoy mismo.'}
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
            <a
              href="#productos"
              className="glow-btn px-8 py-3.5 bg-accent text-white font-bold rounded-full text-base tracking-wide shadow-lg shadow-accent/25 hover:bg-sky-600 transition duration-300"
            >
              Ver Catálogo
            </a>
            <a
              href="#contacto"
              className="px-8 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold rounded-full text-base border border-gray-200 dark:border-white/20 hover:bg-gray-200 dark:hover:bg-white/20 transition duration-300"
            >
              Contactar Soporte
            </a>
          </div>
        </motion.div>

        {/* Right column (Hero Image Product Showcase) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 max-w-md lg:max-w-xl flex justify-center"
        >
          <div className="relative group">
            {/* Glowing aura effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-purple-600 rounded-3xl opacity-20 blur-3xl group-hover:opacity-30 transition duration-500" />
            <img
              src={settings?.heroImage || "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80"}
              alt="Showcase de Tecnología"
              className="w-full h-auto rounded-3xl shadow-2xl relative z-10 border border-gray-200 dark:border-white/10 transform hover:scale-[1.01] transition-transform duration-500"
            />
          </div>
        </motion.div>
      </div>

      {/* Stats Counter Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 mt-20 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/80 dark:bg-navy-light/80 backdrop-blur border border-gray-200 dark:border-white/5 p-6 rounded-3xl text-center shadow-xl">
          <div className="p-3">
            <div className="flex justify-center mb-2 text-accent">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{totalProductsCount || 12}</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Productos</p>
          </div>
          <div className="p-3 border-l border-gray-200 dark:border-white/5">
            <div className="flex justify-center mb-2 text-emerald">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">500+</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Clientes Felices</p>
          </div>
          <div className="p-3 border-l border-gray-200 dark:border-white/5">
            <div className="flex justify-center mb-2 text-sky-400">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">1k+</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Ventas Exitosas</p>
          </div>
          <div className="p-3 border-l border-gray-200 dark:border-white/5">
            <div className="flex justify-center mb-2 text-blue-400">
              <Laptop className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">5+</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Años de Trayectoria</p>
          </div>
        </div>
      </div>

      {/* Featured Carousel */}
      {featured.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 mt-20 w-full overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-6 bg-accent rounded-full inline-block" /> Productos Destacados
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCarouselIndex(prev => (prev === 0 ? featured.length - 1 : prev - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white flex items-center justify-center transition"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCarouselIndex(prev => (prev + 1) % featured.length)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white flex items-center justify-center transition"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featured.map((p, i) => (
              <div
                key={p.id || `feat-${i}`}
                onClick={() => onProductClick(p)}
                className="min-w-[280px] md:min-w-[310px] max-w-[310px] bg-white dark:bg-navy-mid/60 hover:bg-gray-50 dark:hover:bg-navy-mid/90 border border-gray-200 dark:border-white/5 hover:border-accent/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-accent/5 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shrink-0 group"
              >
                <div className="h-44 overflow-hidden relative bg-gray-50 dark:bg-white/5 flex items-center justify-center p-4">
                  <img
                    src={p.imageUrl}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    alt={p.title}
                  />
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate flex-1 pr-2 group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-accent font-extrabold text-sm whitespace-nowrap">
                    ${((p.salePrice || p.price) || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
