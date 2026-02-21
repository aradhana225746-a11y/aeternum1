import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../context/TranslationContext';
import { isSarvamSupported, sarvamTTS, playBase64Audio } from '../api/sarvamTTS';

/* ─── Language map for browser TTS fallback ────────── */
const BROWSER_LANG_MAP = {
  en: 'en-US', es: 'es-ES', fr: 'fr-FR',
  hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', mr: 'mr-IN',
};

/* ─── Page narrations per language ─────────────────── */
const PAGE_NARRATIONS = {
  en: {
    '/': 'Welcome to Aeternum, your caring wellness companion! This is the home page. You can start a health assessment, check your symptoms, or track your period. Scroll down to learn how it works. We check your period and hormonal health, anemia and nutrition, and cancer awareness. Tap the big button to begin your assessment.',
    '/assess': 'You are on the health assessment page. Answer a few simple questions about your age, height, weight, sleep, stress, and diet. Then choose what matters most — period health, anemia, or cancer awareness. Take your time, there are no wrong answers. When you are done, tap Submit to see your results.',
    '/results': 'Here are your results! We have analyzed your answers and prepared a personalized report. You can see your risk level, what we noticed, lifestyle connections, and a daily glow-up plan from morning to night. Scroll down to see your full plan.',
    '/symptoms': 'This is the symptom checker. Select any symptoms you are experiencing from the list — like fatigue, headaches, irregular periods, or dizziness. Then tap Check Symptoms to get a gentle analysis and suggestions. This is not a diagnosis, just caring guidance.',
    '/tracker': 'This is your period tracker. Tap on a date to log your period. Dates you have logged will be highlighted. The tracker also predicts your next period and fertile window based on a standard 28-day cycle. Use this to understand your body better.',
  },
  hi: {
    '/': 'एटर्नम में आपका स्वागत है, आपकी देखभाल करने वाली कल्याण साथी! यह होम पेज है। आप स्वास्थ्य आकलन शुरू कर सकती हैं, अपने लक्षण जाँच सकती हैं, या अपने पीरियड ट्रैक कर सकती हैं। नीचे स्क्रॉल करें यह जानने के लिए कि यह कैसे काम करता है।',
    '/assess': 'आप स्वास्थ्य आकलन पृष्ठ पर हैं। अपनी उम्र, ऊँचाई, वज़न, नींद, तनाव और आहार के बारे में कुछ सरल प्रश्नों के उत्तर दें। फिर चुनें कि आपके लिए सबसे ज़रूरी क्या है — पीरियड्स, एनीमिया, या कैंसर जागरूकता।',
    '/results': 'यहाँ आपके परिणाम हैं! हमने आपके उत्तरों का विश्लेषण किया है और एक व्यक्तिगत रिपोर्ट तैयार की है। आप अपना जोखिम स्तर, हमने क्या देखा, और सुबह से रात तक की दैनिक योजना देख सकती हैं।',
    '/symptoms': 'यह लक्षण जाँच है। सूची से अपने लक्षण चुनें — जैसे थकान, सिरदर्द, अनियमित पीरियड्स या चक्कर आना।',
    '/tracker': 'यह आपका पीरियड ट्रैकर है। अपने पीरियड लॉग करने के लिए तारीख पर टैप करें।',
  },
  ta: {
    '/': 'ஏடர்னத்திற்கு வரவேற்கிறோம்! இது முகப்பு பக்கம். நீங்கள் ஆரோக்கிய மதிப்பீட்டைத் தொடங்கலாம், உங்கள் அறிகுறிகளைச் சரிபார்க்கலாம் அல்லது உங்கள் மாதவிடாயைக் கண்காணிக்கலாம்.',
    '/assess': 'நீங்கள் ஆரோக்கிய மதிப்பீட்டு பக்கத்தில் இருக்கிறீர்கள். உங்கள் வயது, உயரம், எடை, தூக்கம் பற்றிய எளிய கேள்விகளுக்கு பதிலளியுங்கள்.',
    '/results': 'இதோ உங்கள் முடிவுகள்! உங்கள் ஆபத்து நிலை, நாங்கள் கவனித்தது, மற்றும் தினசரி திட்டத்தைப் பாருங்கள்.',
    '/symptoms': 'இது அறிகுறி சோதனை. சோர்வு, தலைவலி போன்ற அறிகுறிகளைத் தேர்ந்தெடுங்கள்.',
    '/tracker': 'இது உங்கள் மாதவிடாய் கண்காணிப்பு. தேதியைத் தட்டி உங்கள் மாதவிடாயை பதிவு செய்யுங்கள்.',
  },
  es: {
    '/': '¡Bienvenida a Aeternum! Esta es la página principal. Puedes comenzar una evaluación de salud, verificar tus síntomas o hacer seguimiento de tu período.',
    '/assess': 'Estás en la página de evaluación de salud. Responde preguntas simples sobre tu edad, peso, sueño y estrés.',
    '/results': '¡Aquí están tus resultados! Mira tu nivel de riesgo y tu plan diario personalizado.',
    '/symptoms': 'Este es el verificador de síntomas. Selecciona tus síntomas de la lista.',
    '/tracker': 'Este es tu rastreador de período. Toca una fecha para registrar tu período.',
  },
  fr: {
    '/': 'Bienvenue sur Aeternum ! C\'est la page d\'accueil. Vous pouvez commencer une évaluation de santé, vérifier vos symptômes ou suivre vos règles.',
    '/assess': 'Vous êtes sur la page d\'évaluation de santé. Répondez à des questions simples.',
    '/results': 'Voici vos résultats ! Regardez votre niveau de risque et votre plan quotidien.',
    '/symptoms': 'C\'est le vérificateur de symptômes. Sélectionnez vos symptômes.',
    '/tracker': 'C\'est votre suivi de règles. Appuyez sur une date pour enregistrer.',
  },
};

/* ─── Get narration for a path + lang ──────────────── */
function getNarration(path, lang) {
  // Try exact language match
  const langNarrations = PAGE_NARRATIONS[lang] || PAGE_NARRATIONS.hi || {};
  // te/bn/mr fall back to Hindi
  const fallbackLang = ['te', 'bn', 'mr'].includes(lang) ? 'hi' : lang;
  const narrations = PAGE_NARRATIONS[fallbackLang] || PAGE_NARRATIONS.en;
  return narrations[path] || PAGE_NARRATIONS.en[path] || PAGE_NARRATIONS.en['/'];
}

/**
 * VoiceAssistant — A floating accessibility button that reads
 * the current page aloud in the user's selected language.
 * Uses Sarvam AI for Indian regional languages, browser TTS for others.
 */
export default function VoiceAssistant() {
  const { lang, t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const playerRef = useRef(null);
  const prevPathRef = useRef(location.pathname);

  // Auto-stop when navigating to a different page
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      stopPlayback();
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPlayback();
  }, []);

  const stopPlayback = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const speakWithBrowser = useCallback((text, langCode) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.lang = BROWSER_LANG_MAP[langCode] || 'en-US';
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handlePlay = useCallback(async () => {
    if (isPlaying || isLoading) {
      stopPlayback();
      return;
    }

    const narration = getNarration(location.pathname, lang);
    const useSarvam = lang !== 'en' && isSarvamSupported(lang);

    if (useSarvam) {
      try {
        setIsLoading(true);
        const audioChunks = await sarvamTTS(narration, lang);
        setIsLoading(false);
        setIsPlaying(true);
        playerRef.current = playBase64Audio(audioChunks, () => {
          setIsPlaying(false);
          playerRef.current = null;
        });
      } catch (err) {
        console.warn('Sarvam TTS failed, falling back to browser:', err.message);
        setIsLoading(false);
        speakWithBrowser(narration, lang);
      }
    } else {
      speakWithBrowser(narration, lang);
    }
  }, [isPlaying, isLoading, location.pathname, lang, stopPlayback, speakWithBrowser]);

  const isActive = isPlaying || isLoading;
  const langLabel = BROWSER_LANG_MAP[lang]?.split('-')[0]?.toUpperCase() || lang.toUpperCase();

  return (
    <>
      {/* ── Floating button (bottom-right) ──────────── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
        style={{ background: isActive ? '#e8636f' : '#2d3436' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Voice Assistant"
        title={t('voiceAssistant') || 'Voice Assistant'}
      >
        {isActive ? (
          /* Sound wave animation */
          <div className="flex items-end gap-0.5 h-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-full"
                animate={{ height: ['8px', '20px', '8px'] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        ) : (
          /* Microphone / speaker icon */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </motion.button>

      {/* ── Popup panel ─────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 pt-4 pb-3 border-b border-pink-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔊</span>
                  <h3 className="font-display text-base font-semibold" style={{ color: '#2d3436' }}>
                    {t('voiceAssistant') || 'Voice Assistant'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-pink-300 hover:text-pink-600 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-pink-400 mt-1">
                {t('voiceAssistantSub') || 'Reads this page aloud in your language'}
              </p>
            </div>

            {/* Language indicator */}
            <div className="px-5 py-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-2.5 py-1 rounded-full bg-pink-100 text-xs font-semibold text-pink-700">
                  {langLabel}
                </span>
                <span className="text-xs text-pink-400">
                  {t('voiceLangNote') || 'Change language using the translate button'}
                </span>
              </div>

              {/* Play / Stop button */}
              <button
                onClick={handlePlay}
                className={`w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-white hover:opacity-90'
                }`}
                style={isActive ? {} : { background: '#2d3436' }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    {t('voiceLoading') || 'Preparing audio…'}
                  </>
                ) : isPlaying ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    {t('voiceStop') || 'Stop Reading'}
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    {t('voicePlay') || 'Read This Page Aloud'}
                  </>
                )}
              </button>
            </div>

            {/* Accessibility note */}
            <div className="px-5 pb-4">
              <p className="text-[10px] text-pink-400/70 leading-relaxed">
                {t('voiceAccessNote') || 'Designed for everyone — especially those who prefer listening over reading. Works in Hindi, Tamil, Telugu, Bengali, Marathi, English, Spanish & French.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
