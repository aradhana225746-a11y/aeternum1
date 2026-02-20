import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: '🩺',
    title: 'Quick Assessment',
    desc: 'Answer a few simple questions about your daily routine and health patterns.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Insights',
    desc: 'Our AI analyses your inputs and creates a personalised wellness snapshot.',
  },
  {
    icon: '📋',
    title: 'Daily Health Plan',
    desc: 'Receive a structured morning-to-night plan tailored just for you.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-display text-2xl font-bold text-lavender-700 tracking-tight">
          Saheli<span className="text-blush-500">AI</span>
        </span>
        <button
          onClick={() => navigate('/assess')}
          className="text-sm font-medium text-lavender-700 hover:text-lavender-900 transition"
        >
          Take Assessment →
        </button>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="flex-1 flex items-center justify-center px-6 pt-8 pb-16">
        <div className="max-w-2xl text-center">
          {/* decorative blob */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-lavender-200 to-blush-200 flex items-center justify-center text-4xl shadow-sm">
            🌸
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-lavender-800 leading-tight">
            Your Calm AI <br className="hidden sm:block" />
            Health Companion
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            Feeling tired, confused about your cycle, or just looking for personalised wellness
            guidance? Saheli AI listens, understands, and creates a daily plan built around{' '}
            <em>you</em>.
          </p>

          <button
            onClick={() => navigate('/assess')}
            className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-lavender-600 hover:bg-lavender-700 text-white font-semibold text-base shadow-lg shadow-lavender-300/40 transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            Start Assessment
            <span aria-hidden>→</span>
          </button>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center font-display text-2xl sm:text-3xl font-semibold text-lavender-800 mb-10">
            How It Works
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur rounded-3xl p-6 shadow-sm border border-lavender-100 hover:shadow-md transition"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lavender-800 text-lg mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto bg-cream-100 rounded-3xl p-6 sm:p-8 border border-cream-300">
          <h3 className="font-display text-lg font-semibold text-amber-800 mb-2">
            ⚠️ Important Disclaimer
          </h3>
          <p className="text-sm text-amber-700 leading-relaxed">
            Saheli AI is <strong>not</strong> a medical diagnostic tool and does not replace
            professional healthcare advice. The insights and plans provided are for general wellness
            awareness only. Always consult a qualified healthcare provider for medical concerns.
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="text-center text-xs text-gray-400 pb-6">
        © {new Date().getFullYear()} Saheli AI · Made with 💜
      </footer>
    </div>
  );
}
