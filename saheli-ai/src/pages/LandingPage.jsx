import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlowCard from '../components/GlowCard';
import NoiseOverlay from '../components/NoiseOverlay';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: 'easeOut' },
  }),
};

const steps = [
  {
    num: '01',
    title: 'Share Your Story',
    desc: 'Answer a thoughtful health survey — covering sleep, diet, stress, and more.',
  },
  {
    num: '02',
    title: 'AI Finds Patterns',
    desc: 'Our system looks for common wellness patterns inspired by WHO frameworks.',
  },
  {
    num: '03',
    title: 'Get Your Plan',
    desc: 'Receive a structured daily lifestyle plan — morning to night — tailored to your needs.',
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <NoiseOverlay />

      {/* Decorative gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-700/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-pink-600/[0.08] blur-[100px] pointer-events-none" />

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[92vh] text-center px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="mb-2"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase bg-purple-800/40 text-purple-300 border border-purple-700/30">
            AI-Powered Wellness
          </span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-purple-300 via-purple-100 to-pink-200 bg-clip-text text-transparent mb-4 leading-tight"
        >
          AETERNUM
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="text-lg sm:text-xl text-purple-200/80 font-light max-w-md mb-3 font-body"
        >
          Your Calm AI Health Companion
        </motion.p>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="text-sm text-purple-300/60 max-w-lg mb-8 leading-relaxed"
        >
          A gentle, guided wellness assessment for young women — powered by
          pattern-matching inspired by WHO health frameworks.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
        >
          <Link
            to="/assess"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-base shadow-lg shadow-purple-700/30 hover:shadow-purple-600/50 transition-all duration-300 hover:scale-[1.03]"
          >
            Start Assessment
            <span className="transition-transform group-hover:translate-x-1">→</span>
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-5 h-8 rounded-full border-2 border-purple-500/40 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-purple-400/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-20">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-display text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-14"
        >
          How Aeternum Works
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <GlowCard key={s.num} delay={i * 0.15} className="text-center py-10 px-6">
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">
                Step {s.num}
              </span>
              <h3 className="text-xl font-semibold text-white mt-2 mb-3 font-display">
                {s.title}
              </h3>
              <p className="text-sm text-purple-200/70 leading-relaxed">{s.desc}</p>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* ── WHAT WE COVER ─────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-display text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-6"
        >
          What We Assess
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-center text-purple-300/70 mb-10 max-w-xl mx-auto"
        >
          Choose the area that matters most to you right now:
        </motion.p>

        <div className="grid gap-6 md:grid-cols-2">
          <GlowCard className="flex flex-col items-center text-center py-8 px-6">
            <h3 className="text-xl font-semibold text-white mb-2 font-display">Period & Hormones</h3>
            <p className="text-sm text-purple-200/70 leading-relaxed">
              Cycle regularity, flow patterns, PMS symptoms, and hormonal indicators — using concepts
              aligned with WHO menstrual health frameworks.
            </p>
          </GlowCard>
          <GlowCard delay={0.1} className="flex flex-col items-center text-center py-8 px-6">
            <h3 className="text-xl font-semibold text-white mb-2 font-display">Anemia & Nutrition</h3>
            <p className="text-sm text-purple-200/70 leading-relaxed">
              Energy levels, dietary iron patterns, and physical signs — guided by WHO anemia
              screening indicators.
            </p>
          </GlowCard>
        </div>
      </section>

      {/* ── CREDIBILITY ───────────────────────────────── */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 pb-16">
        <GlowCard className="text-center py-8 px-8 border-purple-500/25">
          <h3 className="text-lg font-semibold text-white mb-3 font-display">
            Inspired by Global Health Standards
          </h3>
          <p className="text-sm text-purple-200/70 leading-relaxed max-w-xl mx-auto">
            Our screening questions are conceptually aligned with{' '}
            <span className="text-purple-300 font-medium">World Health Organization (WHO)</span>{' '}
            health assessment frameworks for menstrual health and anemia indicators. We translate
            complex medical criteria into simple, understandable questions.
          </p>
        </GlowCard>
      </section>

      {/* ── DISCLAIMER ────────────────────────────────── */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 pb-20">
        <div className="rounded-2xl bg-pink-950/20 border border-pink-400/20 px-8 py-6 text-center">
          <h4 className="text-sm font-semibold text-pink-200 tracking-wider uppercase mb-2">
            Medical Disclaimer
          </h4>
          <p className="text-sm text-pink-200/70 leading-relaxed">
            This platform provides <span className="font-semibold text-pink-100">guidance, not diagnosis</span>.
            Please consult a licensed medical professional for medical concerns. Aeternum does not
            replace clinical evaluation, blood tests, or doctor consultations.
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-purple-800/30 py-8 text-center">
        <p className="text-xs text-purple-400/50">
          © 2026 AETERNUM · Built with care · Not a medical device
        </p>
      </footer>
    </div>
  );
}
