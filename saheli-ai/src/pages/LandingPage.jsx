import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReadAloudButton from '../components/ReadAloudButton';
import TranslateButton from '../components/TranslateButton';
import { useTranslation } from '../context/TranslationContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  }),
};

/* Sparkle positions around the hero title */
const sparkles = [
  { top: '10%', left: '8%', delay: 0 },
  { top: '5%', right: '12%', delay: 0.6 },
  { top: '55%', left: '3%', delay: 1.2 },
  { top: '60%', right: '6%', delay: 0.9 },
  { top: '30%', left: '15%', delay: 1.8 },
  { top: '25%', right: '10%', delay: 1.5 },
  { top: '75%', left: '20%', delay: 0.3 },
  { top: '80%', right: '18%', delay: 2.1 },
];

export default function LandingPage() {
  const { t } = useTranslation();

  const steps = [
    { num: '01', title: t('step1Title'), desc: t('step1Desc') },
    { num: '02', title: t('step2Title'), desc: t('step2Desc') },
    { num: '03', title: t('step3Title'), desc: t('step3Desc') },
  ];

  const features = [
    { emoji: '🩸', title: t('feat1Title'), desc: t('feat1Desc') },
    { emoji: '🥗', title: t('feat2Title'), desc: t('feat2Desc') },
    { emoji: '🎀', title: t('feat3Title'), desc: t('feat3Desc') },
  ];

  const navLinks = [
    { to: '/assess', label: t('Assessment') || 'Assessment' },
    { to: '/symptoms', label: t('Symptoms Checker') || 'Symptom Checker' },
    { to: '/tracker', label: t('Period Tracker') || 'Period Tracker' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ── Nav ────────────────────────────────────────── */}
      <nav className="flex items-center justify-between max-w-4xl mx-auto px-6 py-6">
        <span
          className="font-display text-2xl font-bold tracking-wide"
          style={{ color: '#2d3436' }}
        >
          {t('brand')}
        </span>
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hidden sm:inline text-sm text-pink-700/70 hover:text-pink-900 transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
          <TranslateButton />
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative flex flex-col items-start justify-center min-h-[82vh] px-6 max-w-4xl mx-auto">
        {/* Sparkles */}
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="sparkle-dot"
            style={{
              top: s.top,
              left: s.left,
              right: s.right,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        <motion.p
          initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-2xl sm:text-3xl font-body font-semibold text-pink-400 mb-5 tracking-wide"
        >
          {t('greeting')}
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-5 leading-tight"
          style={{ color: '#2d3436' }}
        >
          {t('heroTitle1')}
          <br />
          <span className="text-lavender-500">{t('heroTitle2')}</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="text-base sm:text-lg text-pink-600/80 font-light max-w-xl mb-3 leading-relaxed text-justify"
        >
          {t('heroSub')}
        </motion.p>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="text-sm text-pink-400 max-w-xl mb-10 leading-relaxed text-justify"
        >
          {t('heroDesc')}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
          className="flex flex-wrap gap-4"
        >
          <Link
            to="/assess"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-medium text-base transition-colors duration-200 shadow-lg shadow-pink-200/50"
            style={{ background: '#2d3436' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e8636f')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2d3436')}
          >
            {t('cta')} →
          </Link>
          <Link
            to="/symptoms"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-pink-300 text-pink-700 font-medium text-sm hover:bg-pink-100/50 transition-colors"
          >
            {t('Symptoms Checker') || 'Symptom Checker'}
          </Link>
        </motion.div>

        {/* Mobile nav links */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
          className="flex sm:hidden gap-4 mt-6"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs text-pink-500 underline underline-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-5 h-8 rounded-full border-2 border-pink-300 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-pink-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-display text-3xl sm:text-4xl font-bold mb-3"
          style={{ color: '#2d3436' }}
        >
          {t('howTitle')}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-pink-400 mb-12 max-w-xl text-justify"
        >
          {t('howSub')}
        </motion.p>

        <div className="space-y-10">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.12}
              className="flex gap-5 items-start"
            >
              <span className="text-2xl font-display font-bold text-lavender-300 mt-0.5 select-none">{s.num}</span>
              <div>
                <h3 className="text-lg font-semibold text-pink-800 mb-1.5 font-display">{s.title}</h3>
                <p className="text-sm text-pink-600/70 leading-relaxed text-justify">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── thin divider ──────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="border-t border-pink-200/60" />
      </div>

      {/* ── EXPLORE ───────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-display text-3xl sm:text-4xl font-bold mb-3"
          style={{ color: '#2d3436' }}
        >
          {t('Get to know yourself!!') || 'Explore'}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-pink-400 mb-10 max-w-xl text-justify"
        >
          {t('Everything you need, in one place!') || 'Everything you need, in one place.'}
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              to: '/assess',
              emoji: '✨',
              title: t('Assessment') || 'Assessment',
              desc: t('Explore') || 'Answer a few questions and get a personalized daily plan.',
            },
            {
              to: '/symptoms',
              emoji: '🔍',
              title: t('Symptoms Checker') || 'Symptom Checker',
              desc: t('Explore') || 'Feeling off? Let\'s figure it out together, step by step.',
            },
            {
              to: '/tracker',
              emoji: '📅',
              title: t('Tracker') || 'Period Tracker',
              desc: t('Explore') || 'Log your cycle, track patterns, and know your body better.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.to}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.1}
            >
              <Link
                to={item.to}
                className="block py-8 px-5 text-center rounded-2xl border-2 border-transparent hover:border-pink-200 hover:bg-white/40 transition-all duration-300 group"
              >
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{item.emoji}</span>
                <h3 className="font-display text-lg font-semibold text-pink-800 mb-2">{item.title}</h3>
                <p className="text-sm text-pink-500/80 leading-relaxed text-justify">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── thin divider ──────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="border-t border-pink-200/60" />
      </div>

      {/* ── WHAT WE CARE ABOUT ────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-8"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#2d3436' }}>
            {t('featuresTitle')}
          </h2>
          <p className="text-pink-400 mb-5 max-w-xl text-justify">
            {t('featuresSub')}
          </p>
          <ReadAloudButton
            text={() => features.map((f, i) => `${i + 1}. ${f.title}: ${f.desc}`).join('. ')}
            label={t('readFeatures')}
          />
        </motion.div>

        <div className="space-y-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.1}
              className="flex gap-4 items-start"
            >
              <span className="text-2xl mt-0.5 flex-shrink-0">{f.emoji}</span>
              <div>
                <h3 className="text-base font-semibold text-pink-800 mb-1 font-display">{f.title}</h3>
                <p className="text-sm text-pink-600/70 leading-relaxed text-justify">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TRUST ─────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-sm text-pink-500/80 leading-relaxed max-w-xl text-justify"
        >
          {t('trustText')}
        </motion.p>
      </section>

      {/* ── DISCLAIMER ────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="border-l-2 border-pink-300 pl-5 py-2"
        >
          <p className="text-xs font-semibold text-pink-600 uppercase tracking-wider mb-1.5">
            {t('disclaimerTitle')}
          </p>
          <p className="text-sm text-pink-500/80 leading-relaxed text-justify">
            {t('disclaimerText')}
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="max-w-4xl mx-auto px-6 pb-10 pt-6 border-t border-pink-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-pink-400">{t('footer')}</p>
          <div className="flex gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-pink-400 hover:text-pink-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
