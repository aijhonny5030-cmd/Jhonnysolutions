import React, { useEffect, useState } from 'react';
import { Timer, Zap } from 'lucide-react';

export default function Offers() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [soldPercentage, setSoldPercentage] = useState(72);

  // Live countdown to midnight
  useEffect(() => {
    function calculateTimeLeft() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      
      const diff = midnight.getTime() - now.getTime();
      if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    }

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Periodic tiny fluctuations to look alive
  useEffect(() => {
    const interval = setInterval(() => {
      setSoldPercentage(prev => {
        if (prev >= 98) return 72; // Reset cycle
        return prev + (Math.random() > 0.7 ? 1 : 0);
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="ofertas" className="py-16 bg-gradient-to-r from-sky-600 via-red-500 to-pink-600 relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
          <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" /> Descuentos de Locura
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
          Super Ofertas del Día
        </h2>
        <p className="text-white/80 mt-4 text-base max-w-xl mx-auto">
          Los precios más bajos garantizados del mercado. Termina hoy a medianoche, ¡aprovecha antes de que se agoten!
        </p>

        {/* Countdown Grid */}
        <div id="countdown" className="flex justify-center gap-3 sm:gap-4 mt-8 mb-8 font-mono">
          <div className="glass rounded-2xl p-3 sm:p-4 min-w-[75px] sm:min-w-[90px] shadow-lg border border-white/15">
            <p id="cd-hours" className="text-2xl sm:text-4xl font-extrabold text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </p>
            <p className="text-[10px] sm:text-xs text-white/70 mt-1 uppercase font-semibold">Horas</p>
          </div>
          <div className="text-2xl sm:text-4xl font-bold self-center text-white/50 animate-bounce">:</div>
          <div className="glass rounded-2xl p-3 sm:p-4 min-w-[75px] sm:min-w-[90px] shadow-lg border border-white/15">
            <p id="cd-mins" className="text-2xl sm:text-4xl font-extrabold text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </p>
            <p className="text-[10px] sm:text-xs text-white/70 mt-1 uppercase font-semibold">Minutos</p>
          </div>
          <div className="text-2xl sm:text-4xl font-bold self-center text-white/50 animate-bounce">:</div>
          <div className="glass rounded-2xl p-3 sm:p-4 min-w-[75px] sm:min-w-[90px] shadow-lg border border-white/15">
            <p id="cd-secs" className="text-2xl sm:text-4xl font-extrabold text-white">
              {String(timeLeft.seconds).padStart(2, '0')}
            </p>
            <p className="text-[10px] sm:text-xs text-white/70 mt-1 uppercase font-semibold">Segundos</p>
          </div>
        </div>

        {/* Progress Bar of Stock depletion */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-xs sm:text-sm text-white/90 mb-2 font-medium">
            <span className="flex items-center gap-1">
              <Timer className="w-4 h-4 animate-spin-slow" /> Stock Limitado
            </span>
            <span id="offer-percent" className="font-bold">{soldPercentage}% Vendidos</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden shadow-inner border border-white/5">
            <div
              id="offer-progress"
              className="progress-fill h-full bg-white rounded-full transition-all duration-1000 shadow"
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
