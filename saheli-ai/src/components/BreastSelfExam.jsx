import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReadAloudButton from './ReadAloudButton';
import { useTranslation } from '../context/TranslationContext';

const STEPS = [
  {
    title: 'Mirror inspection',
    instruction: 'Stand in front of a mirror with your shoulders straight and arms on your hips. Look for any changes in size, shape, or color. Check for dimpling, puckering, or bulging of the skin.',
    area: { cx: 150, cy: 140, r: 22 },
  },
  {
    title: 'Raised arms check',
    instruction: 'Raise both arms above your head and look for the same changes. Notice if there is any fluid coming from the nipples.',
    area: { cx: 150, cy: 130, r: 30 },
  },
  {
    title: 'Standing circular palpation',
    instruction: 'Using your right hand to feel your left breast, use a firm, smooth touch with the pads of your fingers. Cover the entire breast in a circular pattern, moving from the outside to the center.',
    area: { cx: 130, cy: 145, r: 25 },
  },
  {
    title: 'Lying down palpation',
    instruction: 'Lie down and place a pillow under your right shoulder. Use your left hand to examine your right breast using the same circular motion. This spreads the tissue evenly.',
    area: { cx: 170, cy: 145, r: 25 },
  },
  {
    title: 'Underarm check',
    instruction: 'While standing or sitting, feel your underarm area. Gently press into the armpit and surrounding area, checking for any unusual lumps or thickness.',
    area: { cx: 105, cy: 125, r: 18 },
  },
];

function BodySVG({ activeArea }) {
  return (
    <svg viewBox="0 0 300 400" className="w-full max-w-[240px] mx-auto" aria-label="Female torso outline for self-examination">
      {/* Simple minimalist torso outline */}
      <path
        d="M150 40 C150 40 130 42 125 55 C120 68 118 80 115 95 C110 115 100 125 95 140 C88 160 85 175 87 195 C89 215 95 240 100 260 C105 280 108 300 110 320 C112 340 115 360 120 370 L180 370 C185 360 188 340 190 320 C192 300 195 280 200 260 C205 240 211 215 213 195 C215 175 212 160 205 140 C200 125 190 115 185 95 C182 80 180 68 175 55 C170 42 150 40 150 40 Z"
        fill="none"
        stroke="#f48fb1"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Neck */}
      <line x1="150" y1="25" x2="150" y2="40" stroke="#f48fb1" strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="150" cy="22" rx="12" ry="14" fill="none" stroke="#f48fb1" strokeWidth="1.5" opacity="0.4" />

      {/* Subtle breast area outlines */}
      <ellipse cx="130" cy="145" rx="22" ry="20" fill="none" stroke="#f8bbd0" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <ellipse cx="170" cy="145" rx="22" ry="20" fill="none" stroke="#f8bbd0" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

      {/* Active examination area highlight — soft rose */}
      {activeArea && (
        <motion.circle
          key={`${activeArea.cx}-${activeArea.cy}`}
          cx={activeArea.cx}
          cy={activeArea.cy}
          r={activeArea.r}
          fill="rgba(244, 185, 185, 0.25)"
          stroke="rgba(220, 150, 150, 0.5)"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Waistline hint */}
      <path
        d="M100 240 Q150 230 200 240"
        fill="none"
        stroke="#f8bbd0"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}

export default function BreastSelfExam() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const allInstructionsText = STEPS.map((s, i) =>
    `Step ${i + 1}: ${s.title}. ${s.instruction}`
  ).join(' ');

  return (
    <div className="mt-8">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold text-pink-800 mb-1">
          {t('selfExamTitle')}
        </h3>
        <p className="text-sm text-pink-400 mb-4">
          {t('selfExamSub')}
        </p>
        <ReadAloudButton text={allInstructionsText} label={t('selfExamListen')} />
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* SVG illustration */}
        <div className="flex-shrink-0">
          <AnimatePresence mode="wait">
            <BodySVG activeArea={STEPS[activeStep]?.area} />
          </AnimatePresence>
        </div>

        {/* Step-by-step carousel */}
        <div className="flex-1 w-full">
          {/* Step indicator */}
          <div className="flex gap-2 mb-4">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                  i === activeStep
                    ? 'bg-pink-500 text-white'
                    : 'bg-pink-100 text-pink-400 hover:bg-pink-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Active step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-display text-lg font-semibold text-pink-800 mb-2">
                {STEPS[activeStep].title}
              </h4>
              <p className="text-sm text-pink-500 leading-relaxed mb-4">
                {STEPS[activeStep].instruction}
              </p>
              <ReadAloudButton
                text={`${STEPS[activeStep].title}. ${STEPS[activeStep].instruction}`}
                label="Listen"
              />
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setActiveStep(s => Math.max(0, s - 1))}
              disabled={activeStep === 0}
              className="px-4 py-2 rounded-full text-sm border border-pink-200 text-pink-500 hover:bg-pink-50 disabled:opacity-30 transition-all"
            >
              ← Prev
            </button>
            <button
              onClick={() => setActiveStep(s => Math.min(STEPS.length - 1, s + 1))}
              disabled={activeStep === STEPS.length - 1}
              className="px-4 py-2 rounded-full text-sm bg-pink-500 text-white hover:bg-pink-500 disabled:opacity-30 transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Monthly reminder suggestion */}
      <div className="mt-8 text-center">
        <p className="text-xs text-pink-400 italic">
          Tip: Try doing this self-check once a month, a few days after your period ends, when breast tissue is least tender.
        </p>
      </div>
    </div>
  );
}
