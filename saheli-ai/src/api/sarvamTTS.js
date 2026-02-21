/**
 * sarvamTTS.js
 * ────────────────────────────────────────────────────────
 * Sarvam AI Text-to-Speech integration for regional Indian
 * language audio. Uses the bulbul:v2 model.
 *
 * Docs: https://docs.sarvam.ai/api-reference-docs/endpoints/text-to-speech
 * ────────────────────────────────────────────────────────
 */

const SARVAM_API_URL = 'https://api.sarvam.ai/text-to-speech';

/**
 * Map our app language codes → Sarvam AI language codes.
 * Sarvam supports: hi-IN, bn-IN, kn-IN, ml-IN, mr-IN,
 * od-IN, pa-IN, ta-IN, te-IN, gu-IN, en-IN
 */
const LANG_MAP = {
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  en: 'en-IN',
};

/** Recommended speakers per language for a warm female voice */
const SPEAKER_MAP = {
  'hi-IN': 'meera',
  'ta-IN': 'meera',
  'te-IN': 'meera',
  'bn-IN': 'meera',
  'mr-IN': 'meera',
  'en-IN': 'meera',
};

/**
 * Check if a language is supported by Sarvam TTS
 */
export function isSarvamSupported(langCode) {
  return langCode in LANG_MAP;
}

/**
 * Split text into chunks of ~500 chars at sentence boundaries.
 * Sarvam has a per-request character limit.
 */
function chunkText(text, maxLen = 500) {
  if (text.length <= maxLen) return [text];

  const chunks = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    // Find the last sentence boundary within maxLen
    let cutAt = -1;
    for (const sep of ['. ', '। ', '。 ', '! ', '? ']) {
      const idx = remaining.lastIndexOf(sep, maxLen);
      if (idx > cutAt) cutAt = idx + sep.length;
    }

    // If no sentence boundary, try comma or space
    if (cutAt <= 0) {
      const commaIdx = remaining.lastIndexOf(', ', maxLen);
      if (commaIdx > 0) cutAt = commaIdx + 2;
    }
    if (cutAt <= 0) {
      const spaceIdx = remaining.lastIndexOf(' ', maxLen);
      cutAt = spaceIdx > 0 ? spaceIdx + 1 : maxLen;
    }

    chunks.push(remaining.slice(0, cutAt).trim());
    remaining = remaining.slice(cutAt).trim();
  }

  return chunks;
}

/**
 * Call Sarvam TTS API and return an array of base64 audio strings.
 *
 * @param {string} text      - The text to convert to speech
 * @param {string} langCode  - App language code (e.g. 'hi', 'ta')
 * @param {string} [apiKey]  - Sarvam API key (falls back to env)
 * @returns {Promise<string[]>} Array of base64-encoded WAV audio
 */
export async function sarvamTTS(text, langCode, apiKey) {
  const key = apiKey || import.meta.env.VITE_SARVAM_API_KEY;
  if (!key) {
    throw new Error('Sarvam API key not configured. Set VITE_SARVAM_API_KEY in your .env file.');
  }

  const targetLang = LANG_MAP[langCode];
  if (!targetLang) {
    throw new Error(`Language "${langCode}" is not supported by Sarvam TTS.`);
  }

  const speaker = SPEAKER_MAP[targetLang] || 'meera';
  const chunks = chunkText(text);
  const audioChunks = [];

  for (const chunk of chunks) {
    const res = await fetch(SARVAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': key,
      },
      body: JSON.stringify({
        inputs: [chunk],
        target_language_code: targetLang,
        speaker: speaker,
        model: 'bulbul:v2',
        pitch: 0,
        pace: 1.0,
        loudness: 1.5,
        enable_preprocessing: true,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      throw new Error(`Sarvam TTS error ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    if (data.audios && data.audios[0]) {
      audioChunks.push(data.audios[0]);
    }
  }

  return audioChunks;
}

/**
 * Play base64 audio chunks sequentially.
 * Returns an object with a `stop()` method to cancel playback.
 */
export function playBase64Audio(audioChunks, onEnd) {
  let cancelled = false;
  let currentAudio = null;
  let chunkIndex = 0;

  function playNext() {
    if (cancelled || chunkIndex >= audioChunks.length) {
      onEnd?.();
      return;
    }

    const base64 = audioChunks[chunkIndex];
    chunkIndex++;

    // Decode base64 to a Blob and create object URL
    const byteString = atob(base64);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);

    currentAudio = new Audio(url);
    currentAudio.onended = () => {
      URL.revokeObjectURL(url);
      playNext();
    };
    currentAudio.onerror = () => {
      URL.revokeObjectURL(url);
      onEnd?.();
    };
    currentAudio.play().catch(() => onEnd?.());
  }

  playNext();

  return {
    stop() {
      cancelled = true;
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      }
      onEnd?.();
    },
  };
}
