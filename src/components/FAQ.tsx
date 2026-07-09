import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface FAQProps {
  faqItems: FAQItem[];
}

export default function FAQ({ faqItems }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-navy transition-colors">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/15 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Dudas Comunes
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Preguntas Frecuentes
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Todo lo que necesitas saber sobre envíos, garantías y métodos de pago.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqItems.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="faq-item border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50 dark:bg-navy-light/40 transition shadow-sm"
              >
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full text-left px-6 py-5 font-bold text-gray-900 dark:text-white flex justify-between items-center hover:bg-gray-100 dark:hover:bg-navy-mid/40 transition duration-200 outline-none select-none text-sm sm:text-base gap-4"
                >
                  <span className="pr-2">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-accent' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800/30 leading-relaxed whitespace-pre-wrap">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
