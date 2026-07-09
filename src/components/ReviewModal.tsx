import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { Testimonial } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (testimonial: Testimonial) => void;
}

export default function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newTestimonial: Testimonial = {
      id: `test-${Date.now()}`,
      name: name.trim(),
      comment: comment.trim(),
      rating
    };

    onSubmit(newTestimonial);
    
    // Reset form
    setName('');
    setComment('');
    setRating(5);
    setHoverRating(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Stage container */}
      <div className="relative bg-white dark:bg-navy-mid rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-white/5 z-10 animate-fade-in p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-gray-100 dark:bg-navy-light hover:bg-gray-200 dark:hover:bg-navy rounded-full text-gray-500 dark:text-gray-300 transition z-10"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
            Deja tu reseña
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comparte tu experiencia con nosotros y ayuda a otros clientes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="reviewer-name" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Tu Nombre
            </label>
            <input
              id="reviewer-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-navy-light/50 border border-gray-200 dark:border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white transition-all text-sm"
              placeholder="Ej. María Pérez"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Calificación
            </label>
            <div className="flex items-center gap-1.5 justify-center py-2 bg-gray-50 dark:bg-navy-light/30 rounded-xl border border-gray-100 dark:border-white/5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="reviewer-comment" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Tu Comentario
            </label>
            <textarea
              id="reviewer-comment"
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-navy-light/50 border border-gray-200 dark:border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 dark:text-white transition-all text-sm resize-none"
              placeholder="¿Qué te pareció nuestro servicio/producto?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent hover:bg-sky-600 text-white font-bold py-3.5 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Reseña</span>
          </button>
        </form>
      </div>
    </div>
  );
}
