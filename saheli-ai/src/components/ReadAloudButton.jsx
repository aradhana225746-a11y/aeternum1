import { useState, useRef, useCallback } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { isSarvamSupported, sarvamTTS, playBase64Audio } from '../api/sarvamTTS';

/**
 * ReadAloudButton — uses Sarvam AI TTS for regional Indian languages,
 * falls back to browser SpeechSynthesis for English / unsupported langs.
 */

const BROWSER_LANG_MAP = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
};

export default function ReadAloudButton({ text, label = 'Read Aloud' }) {
  const [reading, setReading] = useState(false);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef(null);
  const { lang } = useTranslation();

  const stopPlayback = useCallback(() => {
    // Stop Sarvam audio player
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current = null;
    }
    // Stop browser speech synthesis
    window.speechSynthesis.cancel();
    setReading(false);
    setLoading(false);
  }, []);

  const handleToggle = useCallback(async () => {
    if (reading || loading) {
      stopPlayback();
      return;
    }

    // Build the text to read
    const toRead = typeof text === 'function' ? text() : text;
    if (!toRead) return;

    const useSarvam = lang !== 'en' && isSarvamSupported(lang);

    if (useSarvam) {
      // ── Sarvam AI TTS for regional languages ──
      try {
        setLoading(true);
        const audioChunks = await sarvamTTS(toRead, lang);
        setLoading(false);
        setReading(true);
        playerRef.current = playBase64Audio(audioChunks, () => {
          setReading(false);
          playerRef.current = null;
        });
      } catch (err) {
        console.warn('Sarvam TTS failed, falling back to browser:', err.message);
        setLoading(false);
        // Fall back to browser TTS
        speakWithBrowser(toRead, lang);
      }
    } else {
      // ── Browser SpeechSynthesis ──
      speakWithBrowser(toRead, lang);
    }
  }, [reading, loading, text, lang, stopPlayback]);

  function speakWithBrowser(toRead, langCode) {
    const utterance = new SpeechSynthesisUtterance(toRead);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.lang = BROWSER_LANG_MAP[langCode] || 'en-US';

    utterance.onend = () => setReading(false);
    utterance.onerror = () => setReading(false);

    setReading(true);
    window.speechSynthesis.speak(utterance);
  }

  const isActive = reading || loading;

  return (
    <button
      onClick={handleToggle}
      aria-label={isActive ? 'Stop reading' : label}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${isActive
          ? 'bg-pink-200 text-pink-700 reading-active'
          : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
        }`}
    >
      {loading ? (
        <>
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
          Loading…
        </>
      ) : reading ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          Stop
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
