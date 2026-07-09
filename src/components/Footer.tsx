import React from 'react';
import { Facebook, Instagram, Music, Mail, Globe, MessageCircle } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  logoName: string;
}

export default function Footer({ settings, logoName }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-navy border-t border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-300 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Block */}
        <div>
          <h3 className="text-gray-900 dark:text-white font-extrabold text-xl mb-4 tracking-tight">
            {logoName || 'Jhonny Solutions'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
            Ofrecemos las soluciones tecnológicas más robustas del mercado, con entrega inmediata, garantía certificada y soporte técnico continuo. Llevamos tu productividad al siguiente nivel.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-4">
            Enlaces Rápidos
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#inicio" className="hover:text-accent transition duration-200">Inicio</a>
            </li>
            <li>
              <a href="#productos" className="hover:text-accent transition duration-200">Productos</a>
            </li>
            <li>
              <a href="#ofertas" className="hover:text-accent transition duration-200">Súper Ofertas</a>
            </li>
            <li>
              <a href="#contacto" className="hover:text-accent transition duration-200">Contacto Directo</a>
            </li>
          </ul>
        </div>

        {/* Contact and Social Networks */}
        <div>
          <h4 className="text-gray-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-4">
            Contacto & Soporte
          </h4>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer">
              <Mail className="w-4 h-4 text-accent" />
              <span>{settings.email || 'info@johnnysolutions.com'}</span>
            </p>
            <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer">
              <MessageCircle className="w-4 h-4 text-emerald" />
              <span>WhatsApp: +{settings.whatsapp || '18091234567'}</span>
            </p>
          </div>

          {/* Social Links Icons */}
          <div className="flex gap-4 mt-6">
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-accent/20 hover:text-accent flex items-center justify-center text-gray-500 dark:text-gray-400 transition"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-accent/20 hover:text-accent flex items-center justify-center text-gray-500 dark:text-gray-400 transition"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {settings.tiktok && (
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-accent/20 hover:text-accent flex items-center justify-center text-gray-500 dark:text-gray-400 transition"
                title="TikTok"
              >
                <Music className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-200 dark:border-white/5 text-center text-xs text-gray-600 dark:text-gray-500">
        <p>© {currentYear} {logoName || 'Jhonny Solutions'}. Todos los derechos reservados.</p>
        <p className="mt-1">Santo Domingo, República Dominicana · Soluciones de Alta Calidad</p>
      </div>
    </footer>
  );
}
