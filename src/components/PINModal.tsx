import React, { useState } from 'react';
import { X, Lock, ShieldAlert } from 'lucide-react';

interface PINModalProps {
  isOpen: boolean;
  correctPIN: string;
  onClose: () => void;
  onSuccess: () => void;
  onAddAlert: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function PINModal({
  isOpen,
  correctPIN,
  onClose,
  onSuccess,
  onAddAlert
}: PINModalProps) {
  const [pinInput, setPinInput] = useState('');
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === correctPIN) {
      setIsError(false);
      setPinInput('');
      onSuccess();
      onClose();
      onAddAlert('Acceso administrador concedido', 'success');
    } else {
      setIsError(true);
      setPinInput('');
      onAddAlert('PIN de acceso incorrecto', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card container */}
      <div className="relative bg-white dark:bg-navy-mid rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-white/5 z-10 animate-scale-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-navy-light rounded-full text-gray-500 dark:text-gray-400 dark:text-gray-300 transition"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white text-center">Panel de Administración</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Esta zona es privada. Ingresa la clave para acceder.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pin-input" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Clave de Seguridad (PIN)
            </label>
            <input
              id="pin-input"
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Ingresa clave..."
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-navy-light text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition text-center font-mono tracking-widest text-lg"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-accent text-white font-extrabold rounded-xl hover:bg-sky-600 transition shadow-lg shadow-accent/15 text-sm cursor-pointer"
          >
            Verificar Acceso
          </button>

          {isError && (
            <div className="flex items-center gap-2 text-xs text-red-500 justify-center bg-red-500/10 p-2.5 rounded-lg border border-red-500/10">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Clave incorrecta. Intenta de nuevo.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
