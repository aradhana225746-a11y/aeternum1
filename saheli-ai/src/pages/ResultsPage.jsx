import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import NoiseOverlay from '../components/NoiseOverlay';
import GlowCard from '../components/GlowCard';
import TranslateButton from '../components/TranslateButton';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const riskStyles = {
  low: {
    label: 'Low Pattern',
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    glow: '0 0 30px rgba(52,211,153,0.1)',
  },
  moderate: {
    label: 'Moderate Pattern',
    color: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    glow: '0 0 30px rgba(251,191,36,0.1)',
  },
  high: {
    label: 'Needs Medical Attention',
    color: 'text-rose-300',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/25',
    glow: '0 0 30px rgba(251,113,133,0.1)',
  },
};

const timeGradients = {
  morning: 'from-amber-500/20 via-orange-500/10 to-purple-600/10',
  afternoon: 'from-sky-500/15 via-blue-500/10 to-purple-600/10',
  evening: 'from-purple-500/20 via-pink-500/10 to-rose-600/10',
  night: 'from-indigo-500/20 via-purple-700/15 to-slate-800/10',
};

function PlanCard({ slot, plan, translation, delay }) {
  const grad = timeGradients[slot] || timeGradients.morning;
  const heading = translation ? translation : plan.label;

  return (
    <GlowCard delay={delay} className={`!bg-gradient-to-br ${grad} backdrop-blur-sm relative overflow-hidden`}>
      {/* Subtle glow dot */}
      <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-purple-400/5 blur-2xl" />

      <h3 className="font-display text-xl font-bold text-white mb-4">{heading}</h3>

      <div className="space-y-3">
        <PlanItem label="Food" text={plan.food} />
        <PlanItem label="Activity" text={plan.activity} />
        <PlanItem label="Hydration" text={plan.hydration} />
        <PlanItem label="Stress" text={plan.stress} />
        {plan.sleep && <PlanItem label="Sleep" text={plan.sleep} />}
      </div>
    </GlowCard>
  );
}

function PlanItem({ label, text }) {
  return (
    <div className="flex gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 mt-2 flex-shrink-0" />
      <div>
        <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">{label}</span>
        <p className="text-sm text-purple-100/80 leading-relaxed mt-0.5">{text}</p>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [translation, setTranslation] = useState(null);

  // Redirect if no data
  if (!state) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <NoiseOverlay />
        <div className="relative z-10 text-center">
          <p className="text-purple-300 mb-4">No assessment data found.</p>
          <Link
            to="/assess"
            className="px-6 py-2.5 rounded-xl bg-purple-600/50 text-white text-sm font-medium hover:bg-purple-600/70 transition-colors"
          >
            Take the Assessment
          </Link>
        </div>
      </div>
    );
  }

  const { mode, risk, report, dailyPlan } = state;
  const rs = riskStyles[risk] || riskStyles.low;

  return (
    <div className="relative min-h-screen">
      <NoiseOverlay />
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-700/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-pink-600/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-purple-400 hover:text-purple-200 transition-colors text-sm"
            >
              ← Home
            </button>
            <span className="text-purple-600/40">|</span>
            <h1 className="font-display text-lg font-semibold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              AETERNUM
            </h1>
          </div>
          <TranslateButton onTranslate={setTranslation} />
        </div>

        {/* ── Title ──────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-200 via-white to-pink-200 bg-clip-text text-transparent mb-2">
            Your Wellness Report
          </h2>
          <p className="text-sm text-purple-300/60">
            {mode === 'period' ? 'Period & Hormones Assessment' : 'Anemia & Nutrition Assessment'}
          </p>
          {translation?.note && (
            <p className="text-xs text-purple-400/50 mt-1">{translation.note}</p>
          )}
        </motion.div>

        {/* ── Risk Badge ─────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="flex justify-center mb-8"
        >
          <div
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl ${rs.bg} border ${rs.border}`}
            style={{ boxShadow: rs.glow }}
          >
            <span className={`font-semibold text-base ${rs.color}`}>{rs.label}</span>
          </div>
        </motion.div>

        {/* ── Problem Report ─────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          <GlowCard className="mb-8">
            <h3 className="font-display text-xl font-bold text-white mb-4">Problem Report</h3>

            {/* Summary */}
            <div className="rounded-xl bg-purple-800/15 border border-purple-700/20 p-4 mb-5">
              <p className="text-sm text-purple-100/80 leading-relaxed">{report.summary}</p>
            </div>

            {/* Key factors */}
            {report.factors.length > 0 && (
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">
                  Key Contributing Factors
                </h4>
                <ul className="space-y-2">
                  {report.factors.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-purple-100/75">
                      <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lifestyle links */}
            {report.lifestyleLinks.length > 0 && (
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">
                  Lifestyle Connections
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.lifestyleLinks.map((link, i) => (
                    <span
                      key={i}
                      className="inline-block px-3 py-1.5 rounded-lg bg-purple-800/25 border border-purple-700/20 text-xs text-purple-200/70"
                    >
                      {link}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Calm note */}
            <div className="rounded-xl bg-purple-900/20 border border-purple-600/15 p-4">
              <p className="text-sm text-purple-200/60 leading-relaxed italic">{report.calm}</p>
            </div>
          </GlowCard>
        </motion.div>

        {/* ── Daily Lifestyle Plan ───────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="mb-6"
        >
          <h3 className="font-display text-2xl font-bold text-center bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
            Your Daily Lifestyle Plan
          </h3>
          <p className="text-center text-sm text-purple-300/50 mb-8">
            A realistic, gentle routine tailored to your assessment
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {['morning', 'afternoon', 'evening', 'night'].map((slot, i) => (
            <PlanCard
              key={slot}
              slot={slot}
              plan={dailyPlan[slot]}
              translation={translation ? translation[slot] : null}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* ── Bottom actions ─────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="mt-12 space-y-4"
        >
          {/* Disclaimer */}
          <div className="rounded-2xl bg-pink-950/20 border border-pink-400/15 px-6 py-4 text-center">
            <p className="text-xs text-pink-200/60">
              This is <strong className="text-pink-200">guidance, not diagnosis</strong>. For medical
              concerns, please consult a licensed healthcare professional.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              to="/assess"
              className="px-6 py-2.5 rounded-xl border border-purple-600/30 text-purple-300 text-sm font-medium hover:bg-purple-800/30 transition-colors text-center"
            >
              ← Retake Assessment
            </Link>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold shadow-md shadow-purple-700/30 hover:shadow-purple-600/40 transition-all text-center"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-16 border-t border-purple-800/30 pt-8 pb-6 text-center">
          <p className="text-xs text-purple-400/50">
            © 2026 AETERNUM · Built with care · Not a medical device
          </p>
        </footer>
      </div>
    </div>
  );
}
