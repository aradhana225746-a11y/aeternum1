import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi (हिन्दी)' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'bn', label: 'Bengali (বাংলা)' },
  { code: 'mr', label: 'Marathi (मराठी)' },
  { code: 'es', label: 'Spanish (Español)' },
  { code: 'fr', label: 'French (Français)' },
];

const MOCK_TRANSLATIONS = {
  hi: {
    morning: 'सुबह',
    afternoon: 'दोपहर',
    evening: 'शाम',
    night: 'रात',
    note: '(यह एक नमूना अनुवाद है)',
  },
  ta: {
    morning: 'காலை',
    afternoon: 'மதியம்',
    evening: 'மாலை',
    night: 'இரவு',
    note: '(இது ஒரு மாதிரி மொழிபெயர்ப்பு)',
  },
  te: {
    morning: 'ఉదయం',
    afternoon: 'మధ్యాహ్నం',
    evening: 'సాయంత్రం',
    night: 'రాత్రి',
    note: '(ఇది ఒక నమూనా అనువాదం)',
  },
  bn: {
    morning: 'সকাল',
    afternoon: 'দুপুর',
    evening: 'সন্ধ্যা',
    night: 'রাত',
    note: '(এটি একটি নমুনা অনুবাদ)',
  },
  mr: {
    morning: 'सकाळ',
    afternoon: 'दुपार',
    evening: 'संध्याकाळ',
    night: 'रात्र',
    note: '(हा नमुना अनुवाद आहे)',
  },
  es: {
    morning: 'Mañana',
    afternoon: 'Tarde',
    evening: 'Atardecer',
    night: 'Noche',
    note: '(Esta es una traducción de ejemplo)',
  },
  fr: {
    morning: 'Matin',
    afternoon: 'Après-midi',
    evening: 'Soirée',
    night: 'Nuit',
    note: '(Ceci est un exemple de traduction)',
  },
};

export default function TranslateButton({ onTranslate }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('en');
  const [translating, setTranslating] = useState(false);

  const handleSelect = async (code) => {
    setSelected(code);
    setTranslating(true);
    setOpen(false);
    /* Simulate API call delay */
    await new Promise((r) => setTimeout(r, 1200));
    onTranslate(code === 'en' ? null : MOCK_TRANSLATIONS[code] || null);
    setTranslating(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-800/40 border border-purple-600/30 hover:border-purple-500/50 text-purple-200 text-sm font-medium transition-all hover:bg-purple-800/60"
      >
        {translating ? 'Translating…' : 'Translate Plan'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute mt-2 right-0 w-56 rounded-xl bg-purple-950/95 border border-purple-700/40 shadow-xl shadow-purple-900/30 z-50 overflow-hidden backdrop-blur-md"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  selected === lang.code
                    ? 'bg-purple-700/40 text-white'
                    : 'text-purple-200 hover:bg-purple-800/40'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
