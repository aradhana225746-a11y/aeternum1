import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TranslateButton from '../components/TranslateButton';
import ReadAloudButton from '../components/ReadAloudButton';
import { useTranslation } from '../context/TranslationContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

/* ── Symptom database with friendly descriptions ─────── */
const SYMPTOM_GROUPS = [
  {
    category: 'Energy & Mood',
    emoji: '😴',
    symptoms: [
      { id: 'fatigue', label: 'Feeling tired all the time', tags: ['anemia', 'thyroid', 'period'] },
      { id: 'mood_swings', label: 'Mood swings / irritability', tags: ['period', 'pms', 'hormonal'] },
      { id: 'brain_fog', label: 'Brain fog / trouble concentrating', tags: ['anemia', 'thyroid', 'stress'] },
      { id: 'anxiety', label: 'Feeling anxious or overwhelmed', tags: ['stress', 'hormonal', 'thyroid'] },
      { id: 'low_motivation', label: 'Low motivation / feeling blah', tags: ['anemia', 'stress', 'hormonal'] },
    ],
  },
  {
    category: 'Period & Cycle',
    emoji: '🩸',
    symptoms: [
      { id: 'irregular_periods', label: 'Irregular or missed periods', tags: ['period', 'pcos', 'hormonal'] },
      { id: 'heavy_flow', label: 'Very heavy flow', tags: ['period', 'anemia', 'fibroids'] },
      { id: 'severe_cramps', label: 'Severe cramps', tags: ['period', 'endometriosis'] },
      { id: 'spotting', label: 'Spotting between periods', tags: ['hormonal', 'cervical'] },
      { id: 'pms_bloating', label: 'Bloating around your period', tags: ['pms', 'period'] },
    ],
  },
  {
    category: 'Body Signs',
    emoji: '💪',
    symptoms: [
      { id: 'hair_loss', label: 'Hair thinning or loss', tags: ['thyroid', 'pcos', 'anemia'] },
      { id: 'acne', label: 'Hormonal acne (chin/jawline)', tags: ['pcos', 'hormonal'] },
      { id: 'weight_changes', label: 'Unexplained weight changes', tags: ['thyroid', 'pcos', 'hormonal'] },
      { id: 'pale_skin', label: 'Pale skin or dark circles', tags: ['anemia', 'fatigue'] },
      { id: 'brittle_nails', label: 'Brittle nails', tags: ['anemia', 'nutrition'] },
      { id: 'cold_hands', label: 'Always cold hands/feet', tags: ['anemia', 'thyroid'] },
    ],
  },
  {
    category: 'Breasts & Pelvic',
    emoji: '🎀',
    symptoms: [
      { id: 'breast_pain', label: 'Breast tenderness or pain', tags: ['pms', 'hormonal'] },
      { id: 'breast_lumps', label: 'Lumps or thickening', tags: ['breast_health'] },
      { id: 'pelvic_pain', label: 'Persistent pelvic pain', tags: ['endometriosis', 'cervical'] },
      { id: 'unusual_discharge', label: 'Unusual discharge', tags: ['cervical', 'infection'] },
    ],
  },
  {
    category: 'Digestion & Nutrition',
    emoji: '🥗',
    symptoms: [
      { id: 'bloating', label: 'Frequent bloating', tags: ['pms', 'digestion', 'stress'] },
      { id: 'cravings', label: 'Intense food cravings', tags: ['pms', 'hormonal', 'nutrition'] },
      { id: 'nausea', label: 'Nausea or loss of appetite', tags: ['stress', 'anemia'] },
      { id: 'dizziness', label: 'Dizziness or lightheadedness', tags: ['anemia', 'low_bp'] },
    ],
  },
];

/* ── Insight engine ──────────────────────────────────── */
function getInsights(selected) {
  if (selected.length === 0) return null;

  const tagCounts = {};
  selected.forEach((id) => {
    SYMPTOM_GROUPS.forEach((g) => {
      const s = g.symptoms.find((s) => s.id === id);
      if (s) s.tags.forEach((tag) => (tagCounts[tag] = (tagCounts[tag] || 0) + 1));
    });
  });

  const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 3);

  const tagDescriptions = {
    anemia: {
      title: 'Iron & Energy Levels',
      desc: 'Several of your symptoms point to possible low iron or anemia. This is super common in women — eating iron-rich foods with vitamin C and getting a simple blood test can make a huge difference, babe.',
      emoji: '🥗',
      action: 'Consider getting a CBC (complete blood count) test. Add spinach, lentils, and citrus to your meals! 🍊',
    },
    period: {
      title: 'Period Health',
      desc: 'Your cycle might be trying to tell you something. Period irregularities are your body\'s way of communicating — let\'s listen to it together.',
      emoji: '🩸',
      action: 'Track your cycle for 3 months and share the pattern with your gynecologist. Our Period Tracker can help! 📅',
    },
    hormonal: {
      title: 'Hormonal Balance',
      desc: 'Some of what you\'re experiencing could be related to hormonal shifts. Hormones affect literally everything — mood, skin, energy, weight.',
      emoji: '✨',
      action: 'A hormone panel (TSH, prolactin, estrogen, progesterone) can give you clarity. Ask your doc about it!',
    },
    pcos: {
      title: 'PCOS Patterns',
      desc: 'A few of your symptoms align with polycystic ovary syndrome (PCOS). It\'s more common than you think and totally manageable with the right support.',
      emoji: '💜',
      action: 'An ultrasound + hormone panel can help confirm. Lifestyle changes like regular movement and balanced meals work wonders.',
    },
    thyroid: {
      title: 'Thyroid Worth Checking',
      desc: 'Your thyroid is a tiny gland with a BIG job. Some of your symptoms might be linked to it running too fast or too slow.',
      emoji: '🦋',
      action: 'A simple TSH test can tell you a lot. It\'s quick, easy, and could be the missing puzzle piece!',
    },
    pms: {
      title: 'PMS & Premenstrual Patterns',
      desc: 'Looks like your premenstrual phase might be hitting a bit hard. You\'re not imagining it — PMS is real and valid.',
      emoji: '🌙',
      action: 'Magnesium, regular sleep, and gentle exercise in your luteal phase can genuinely help. You\'ve got this! 💪',
    },
    stress: {
      title: 'Stress & Self-Care',
      desc: 'Stress is sneaky — it shows up in SO many physical symptoms. Your body is asking for a little more kindness.',
      emoji: '🧘',
      action: 'Even 10 minutes of deep breathing or a short walk can reset your nervous system. Be gentle with yourself, queen.',
    },
    breast_health: {
      title: 'Breast Health Awareness',
      desc: 'You mentioned some breast changes. Most breast lumps are benign, but it\'s always smart to get them checked — early awareness is self-love.',
      emoji: '🎀',
      action: 'Schedule a clinical breast exam or mammogram. Our Breast Self-Exam Guide can help you monitor changes at home.',
    },
    cervical: {
      title: 'Cervical Health',
      desc: 'Some symptoms you selected relate to cervical health. Regular screening is the best protection — it\'s quick and could save your life.',
      emoji: '💗',
      action: 'If you haven\'t had a Pap smear recently, consider booking one. HPV vaccination is also worth discussing with your doctor.',
    },
    endometriosis: {
      title: 'Endometriosis Awareness',
      desc: 'Severe cramps and pelvic pain can sometimes point to endometriosis. It takes an average of 7 years to diagnose — but you deserve answers sooner.',
      emoji: '💛',
      action: 'If pain is disrupting your daily life, please see a gynecologist who specializes in endo. You don\'t have to just "deal with it."',
    },
    nutrition: {
      title: 'Nutrition & Nourishment',
      desc: 'Your body might need a little more nutritional love. Small dietary shifts can create big changes in how you feel.',
      emoji: '🍎',
      action: 'Focus on iron, B12, vitamin D, and omega-3s. A dietitian can create a plan that actually fits your life.',
    },
  };

  const insights = top.map(([tag, count]) => ({
    ...(tagDescriptions[tag] || { title: tag, desc: 'Worth exploring further.', emoji: '💡', action: 'Discuss with your healthcare provider.' }),
    matchCount: count,
  }));

  const overallSeverity = selected.length <= 3 ? 'mild' : selected.length <= 6 ? 'moderate' : 'significant';

  return { insights, overallSeverity, totalSymptoms: selected.length };
}

export default function SymptomCheckerPage() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setShowResults(false);
  };

  const results = getInsights(selected);

  const severityStyles = {
    mild: { label: 'Mild — probably nothing major 💚', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    moderate: { label: 'Moderate — worth a gentle check-in 💛', color: 'text-amber-700', bg: 'bg-amber-50' },
    significant: { label: 'Significant — please see a doctor, love 💗', color: 'text-rose-700', bg: 'bg-rose-50' },
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <nav className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-pink-400 hover:text-pink-700 transition-colors text-sm">
              ← {t('home')}
            </Link>
            <span className="text-pink-200">|</span>
            <h1 className="font-display text-lg font-semibold" style={{ color: '#2d3436' }}>
              {t('brand')}
            </h1>
          </div>
          <TranslateButton />
        </nav>

        {/* Title */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10">
          <h2
            className="font-display text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: '#2d3436' }}
          >
            {t('symptomTitle') || 'Symptom Checker'}
          </h2>
          <p className="text-sm text-pink-500/80 max-w-md">
            {t('symptomSub') || 'Tap everything that feels relatable rn. No overthinking — just go with your gut, babe. 💕'}
          </p>
        </motion.div>

        {/* Symptom groups */}
        <div className="space-y-10">
          {SYMPTOM_GROUPS.map((group, gi) => (
            <motion.div
              key={group.category}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={gi * 0.08}
            >
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-pink-800 mb-4">
                <span>{group.emoji}</span>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.symptoms.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggle(s.id)}
                    className={`px-4 py-2.5 rounded-full text-sm transition-all duration-200 ${
                      selected.includes(s.id)
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'border border-pink-200 text-pink-700 hover:bg-pink-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected count + analyze button */}
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-center"
          >
            <p className="text-sm text-pink-400 mb-4">
              {selected.length} symptom{selected.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={() => setShowResults(true)}
              className="px-8 py-3 rounded-full text-white font-medium text-base transition-colors shadow-lg shadow-pink-200/50"
              style={{ background: '#2d3436' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e8636f')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2d3436')}
            >
              Tell me what's going on ✨
            </button>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {showResults && results && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className="border-t border-pink-200/50 mb-10" />

              <div className="flex items-center justify-between mb-6">
                <h3
                  className="font-display text-2xl font-bold"
                  style={{ color: '#2d3436' }}
                >
                  {t('symptomResultTitle') || 'Here\'s what we think, babe 💗'}
                </h3>
                <ReadAloudButton
                  text={() =>
                    results.insights
                      .map((ins) => `${ins.title}: ${ins.desc} ${ins.action}`)
                      .join('. ')
                  }
                  label="Listen"
                />
              </div>

              {/* Severity badge */}
              <div className="mb-8">
                <span
                  className={`inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold ${
                    severityStyles[results.overallSeverity].bg
                  } ${severityStyles[results.overallSeverity].color}`}
                >
                  {severityStyles[results.overallSeverity].label}
                </span>
              </div>

              {/* Insights */}
              <div className="space-y-8">
                {results.insights.map((ins, i) => (
                  <motion.div
                    key={ins.title}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={i * 0.1}
                    className="py-4"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="text-xl">{ins.emoji}</span>
                      <h4 className="font-display text-lg font-semibold text-pink-800">
                        {ins.title}
                      </h4>
                      <span className="text-xs text-pink-400 ml-auto">
                        {ins.matchCount} match{ins.matchCount !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-pink-700/80 leading-relaxed mb-3">
                      {ins.desc}
                    </p>
                    <div className="border-l-2 border-pink-300 pl-4">
                      <p className="text-sm text-pink-600 font-medium">{ins.action}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Reminder */}
              <div className="border-l-2 border-pink-300 pl-4 py-2 mt-10">
                <p className="text-xs text-pink-500/80">
                  {t('symptomDisclaimer') ||
                    'This isn\'t a diagnosis — it\'s a gentle nudge to help you understand what your body might be saying. Always talk to a real doctor for anything that worries you. 💕'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/assess"
                  className="px-6 py-2.5 rounded-full text-white text-sm font-medium text-center transition-colors"
                  style={{ background: '#2d3436' }}
                >
                  Get a Full Assessment →
                </Link>
                <Link
                  to="/tracker"
                  className="px-6 py-2.5 rounded-full border border-pink-300 text-pink-700 text-sm font-medium hover:bg-pink-50 transition-colors text-center"
                >
                  Track Your Period 📅
                </Link>
                <button
                  onClick={() => {
                    setSelected([]);
                    setShowResults(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 rounded-full border border-pink-200 text-pink-500 text-sm hover:bg-pink-50 transition-colors text-center"
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-16 border-t border-pink-100 pt-8 pb-6">
          <p className="text-xs text-pink-400">{t('footer')}</p>
        </footer>
      </div>
    </div>
  );
}
