import React, { useState } from 'react';
import { Mail, Send, User, MessageSquare } from 'lucide-react';
import { Message } from '../types';

interface ContactFormProps {
  onSendMessage: (msg: Message) => void;
  onAddAlert: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function ContactForm({ onSendMessage, onAddAlert }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      onAddAlert('Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate short visual network delay
    setTimeout(() => {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString()
      };

      onSendMessage(newMessage);
      onAddAlert('¡Mensaje enviado con éxito!', 'success');
      
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
      setIsSuccess(true);

      // Hide success label in 4s
      setTimeout(() => setIsSuccess(false), 4000);
    }, 800);
  };

  return (
    <section id="contacto" className="py-20 bg-gray-50 dark:bg-navy-light/40 transition-colors">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Ponte en Contacto
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            ¿Tienes alguna duda o solicitud personalizada? Escríbenos y te responderemos a la brevedad.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white dark:bg-navy-mid p-8 md:p-10 rounded-3xl shadow-xl border border-gray-150/60 dark:border-white/5"
        >
          {/* Name */}
          <div>
            <label htmlFor="c-name" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Nombre Completo *
            </label>
            <div className="relative">
              <input
                id="c-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-navy-light dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
              />
              <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500 dark:text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="c-email" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Correo Electrónico *
            </label>
            <div className="relative">
              <input
                id="c-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-navy-light dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500 dark:text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="c-msg" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Mensaje o Consulta *
            </label>
            <div className="relative">
              <textarea
                id="c-msg"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntanos en qué podemos ayudarte..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-navy-light dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition resize-none"
              />
              <MessageSquare className="absolute left-3.5 top-4 w-4.5 h-4.5 text-gray-500 dark:text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`glow-btn w-full py-4 bg-accent text-white font-extrabold rounded-xl flex items-center justify-center gap-2 text-base transition-all shadow-lg shadow-accent/20 cursor-pointer ${
              isSubmitting ? 'opacity-85 pointer-events-none' : 'hover:bg-sky-600'
            }`}
          >
            <Send className="w-4.5 h-4.5" />
            {isSubmitting ? 'Enviando Mensaje...' : 'Enviar Mensaje'}
          </button>

          {isSuccess && (
            <p className="text-emerald text-center text-sm font-bold animate-pulse mt-2">
              ¡Mensaje enviado con éxito! Puedes revisarlo en el panel de administrador.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
