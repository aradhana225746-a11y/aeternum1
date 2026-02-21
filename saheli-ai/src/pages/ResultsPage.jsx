import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TranslateButton from '../components/TranslateButton';
import ReadAloudButton from '../components/ReadAloudButton';
import BreastSelfExam from '../components/BreastSelfExam';
import CervicalHealth from '../components/CervicalHealth';
import { useTranslation } from '../context/TranslationContext';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const itemSlide = {
  hidden: { opacity: 0, x: -12 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.2 + i * 0.06, ease: 'easeOut' },
  }),
};

const timeEmojis = {
  morning: '☀️',
  afternoon: '🌤️',
  evening: '🌅',
  night: '🌙',
};

function PlanSection({ slot, plan, t, index }) {
  const emoji = timeEmojis[slot] || '☀️';
  const heading = t(slot) || plan.label;
  const items = [
    { label: '🍽️ Eat', text: plan.food },
    { label: '🏃‍♀️ Move', text: plan.activity },
    { label: '💧 Drink', text: plan.hydration },
    { label: '🧘 Chill', text: plan.stress },
    ...(plan.sleep ? [{ label: '😴 Sleep', text: plan.sleep }] : []),
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      custom={index * 0.15}
      className="py-6"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-xl">{emoji}</span>
        <h3 className="font-display text-lg font-bold text-pink-800">{heading}</h3>
      </div>
      <div className="space-y-3 ml-8">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemSlide}
            className="flex gap-3 items-start"
          >
            <span className="text-sm flex-shrink-0 mt-0.5">{item.label}</span>
            <p className="text-sm text-pink-700/80 leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-pink-500 mb-4 text-base">Hmm, we don't have your data yet!</p>
          <Link
            to="/assess"
            className="px-6 py-2.5 rounded-full bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition-colors"
          >
            Take the Assessment →
          </Link>
        </div>
      </div>
    );
  }

  const { mode, risk, report, dailyPlan } = state;

  const riskStyles = {
    low: { label: t('riskLow'), color: 'text-emerald-700', bg: 'bg-emerald-50' },
    moderate: { label: t('riskModerate'), color: 'text-amber-700', bg: 'bg-amber-50' },
    high: { label: t('riskHigh'), color: 'text-rose-700', bg: 'bg-rose-50' },
    screening: { label: t('riskScreening'), color: 'text-purple-700', bg: 'bg-purple-50' },
  };
  const rs = riskStyles[risk] || riskStyles.low;
  const modeSubKey = mode === 'period' ? 'reportSubPeriod' : mode === 'anemia' ? 'reportSubAnemia' : 'reportSubCancer';

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-pink-400 hover:text-pink-700 transition-colors text-sm"
            >
              ← {t('home')}
            </button>
            <span className="text-pink-200">|</span>
            <h1 className="font-display text-lg font-semibold text-pink-800">
              {t('brand')}
            </h1>
          </div>
          <TranslateButton />
        </div>

        {/* ── Title ──────────────────────────────────── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pink-900 mb-2">
            {t('reportTitle')}
          </h2>
          <p className="text-sm text-pink-400">{t(modeSubKey)}</p>
        </motion.div>

        {/* ── Risk Badge ─────────────────────────────── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-10">
          <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold ${rs.bg} ${rs.color}`}>
            {rs.label}
          </span>
        </motion.div>

        {/* ── What we noticed (flowing, no card) ─────── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl font-bold text-pink-800">{t('whatWeFound')}</h3>
            <ReadAloudButton
              text={() => `${report.summary}. ${report.factors.join('. ')}. ${report.calm}`}
              label="Listen"
            />
          </div>

          {/* Summary */}
          <p className="text-sm text-pink-700/80 leading-relaxed mb-6">{report.summary}</p>

          {/* Key factors */}
          {report.factors.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-pink-500 uppercase tracking-wider mb-3">
                {t('thingsToKnow')}
              </h4>
              <ul className="space-y-2">
                {report.factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-pink-700/80">
                    <span className="text-pink-300 mt-1 flex-shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lifestyle connections */}
          {report.lifestyleLinks.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-pink-500 uppercase tracking-wider mb-3">
                {t('lifestyleConn')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {report.lifestyleLinks.map((link, i) => (
                  <span key={i} className="inline-block px-3 py-1.5 rounded-full bg-pink-100/60 text-xs text-pink-600">
                    {link}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Calm note */}
          <div className="border-l-2 border-pink-300 pl-4 py-1 mt-6">
            <p className="text-sm text-pink-500/80 leading-relaxed italic">{report.calm}</p>
          </div>
        </motion.div>

        {/* ── divider ────────────────────────────────── */}
        <div className="border-t border-pink-200/50 my-6" />

        {/* ── Cancer-specific ────────────────────────── */}
        {mode === 'cancer' && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mb-10">
            <BreastSelfExam />
            <CervicalHealth />
          </motion.div>
        )}

        {/* ── Daily Plan ─────────────────────────────── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={mode === 'cancer' ? 4 : 3} className="mb-6">
          <motion.p
            className="text-center text-xl mb-2"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            ✨💖✨
          </motion.p>
          <h3 className="font-display text-2xl font-bold text-pink-900 mb-2 text-center">
            {t('planTitle')}
          </h3>
          <p className="text-center text-sm text-pink-400 mb-2">{t('planSub')}</p>
          <div className="flex justify-center mb-4">
            <ReadAloudButton
              text={() => {
                const slots = ['morning', 'afternoon', 'evening', 'night'];
                return slots.map(s => {
                  const p = dailyPlan[s];
                  return `${p.label}: Food: ${p.food}. Activity: ${p.activity}. Hydration: ${p.hydration}. Stress: ${p.stress}. ${p.sleep ? 'Sleep: ' + p.sleep + '.' : ''}`;
                }).join(' ');
              }}
              label={t('listenPlan')}
            />
          </div>
        </motion.div>

        {/* ── Plan sections (no cards, flowing) ──────── */}
        <div className="divide-y divide-pink-100">
          {['morning', 'afternoon', 'evening', 'night'].map((slot, i) => (
            <PlanSection key={slot} slot={slot} plan={dailyPlan[slot]} t={t} index={i} />
          ))}
        </div>

        {/* ── Bottom ─────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="mt-14 space-y-5"
        >
          <div className="border-l-2 border-pink-300 pl-4 py-1">
            <p className="text-xs text-pink-500/80">{t('disclaimerResult')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/assess"
              className="px-6 py-2.5 rounded-full border border-pink-300 text-pink-700 text-sm font-medium hover:bg-pink-100 transition-colors text-center"
            >
              {t('retake')}
            </Link>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-full bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition-all text-center"
            >
              {t('backHome')}
            </Link>
          </div>
        </motion.div>

        <footer className="mt-16 border-t border-pink-100 pt-8 pb-6">
          <p className="text-xs text-pink-400">{t('footer')}</p>
        </footer>
      </div>
    </div>
  );
}
