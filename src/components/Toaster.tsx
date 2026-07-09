import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { Product } from '../types';

export interface AlertItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ToasterProps {
  alerts: AlertItem[];
  onRemoveAlert: (id: string) => void;
  products: Product[];
}

export default function Toaster({ alerts, onRemoveAlert, products }: ToasterProps) {
  const [socialProof, setSocialProof] = useState<{
    id: string;
    buyerName: string;
    productTitle: string;
    productImg: string;
    timeAgo: number;
  } | null>(null);

  // Social proof generator loop
  useEffect(() => {
    if (products.length === 0) return;

    const buyerNames = ['María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'José', 'Sofía', 'Miguel', 'Isabella', 'David', 'Manuel', 'Elena'];

    const showSocialProof = () => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomName = buyerNames[Math.floor(Math.random() * buyerNames.length)];
      const randomMins = Math.floor(Math.random() * 12) + 1;

      setSocialProof({
        id: `proof-${Date.now()}`,
        buyerName: randomName,
        productTitle: randomProduct.title,
        productImg: randomProduct.imageUrl,
        timeAgo: randomMins
      });

      // Clear after 4.5s
      setTimeout(() => {
        setSocialProof(null);
      }, 4500);
    };

    // Initial delay
    const initialTimeout = setTimeout(showSocialProof, 4000);

    // Dynamic Interval
    const interval = setInterval(showSocialProof, 12000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [products]);

  return (
    <>
      {/* Alert Toasts Container (Top-Right or Bottom-Right) */}
      <div className="fixed bottom-24 right-6 z-[120] space-y-2 max-w-sm pointer-events-auto">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border text-white animate-slide-in-right ${
              alert.type === 'success'
                ? 'bg-emerald border-emerald/20 shadow-emerald/10'
                : alert.type === 'error'
                ? 'bg-red-500 border-red-500/20 shadow-red-500/10'
                : 'bg-blue-600 border-blue-600/20 shadow-blue-600/10'
            }`}
          >
            <div className="shrink-0">
              {alert.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : alert.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-white" />
              ) : (
                <Info className="w-5 h-5 text-white" />
              )}
            </div>
            
            <p className="text-xs font-bold leading-snug flex-1">{alert.message}</p>
            
            <button
              onClick={() => onRemoveAlert(alert.id)}
              className="p-1 hover:bg-white/10 rounded-lg text-white/80 transition"
              aria-label="Cerrar alerta"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Conversion-boosting Social Proof Popup (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-[110] max-w-xs pointer-events-auto">
        {socialProof && (
          <div className="glass-light dark:glass rounded-2xl p-3.5 flex items-center gap-3.5 shadow-2xl border border-gray-150 dark:border-white/5 animate-slide-in-left">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 dark:bg-navy-light flex items-center justify-center p-1 border border-gray-100 dark:border-white/5 shrink-0">
              <img src={socialProof.productImg} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="text-xs">
              <p className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1">
                {socialProof.buyerName} <span className="font-medium text-gray-500 dark:text-gray-400">compró esto</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 font-bold truncate max-w-[170px] mt-0.5">
                {socialProof.productTitle}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1">
                hace {socialProof.timeAgo} minutos
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
