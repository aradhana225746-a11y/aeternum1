import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, LANGUAGES } from '../context/TranslationContext';

export default function TranslateButton() {
  const { lang, setLanguage, isTranslating, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSelect = (code) => {
    setOpen(false);
    setLanguage(code);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium transition-all hover:bg-pink-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" />
          <path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
        </svg>
        {isTranslating ? t('translating') : t('translate')}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute mt-2 right-0 w-52 rounded-2xl bg-white border border-pink-200 shadow-lg shadow-pink-200/40 z-50 overflow-hidden"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleSelect(l.code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  lang === l.code
                    ? 'bg-pink-100 text-pink-900 font-medium'
                    : 'text-pink-700 hover:bg-pink-50'
                }`}
              >
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
