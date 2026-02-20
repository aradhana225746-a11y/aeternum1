import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Step definitions ─────────────────────────────────── */
const STEPS = [
  { key: 'age', label: 'How old are you?', type: 'number' },
  { key: 'sleepHours', label: 'How many hours do you sleep on average?', type: 'number' },
  { key: 'fatigue', label: 'How would you rate your fatigue level?', type: 'slider', min: 1, max: 10 },
  { key: 'cycleRegular', label: 'Is your menstrual cycle regular?', type: 'yesno' },
  { key: 'heavyFlow', label: 'Do you experience heavy menstrual flow?', type: 'yesno' },
  { key: 'vegetarian', label: 'Are you vegetarian?', type: 'yesno' },
  { key: 'stress', label: 'How would you rate your stress level?', type: 'slider', min: 1, max: 10 },
  {
    key: 'mode',
    label: 'What would you like help with?',
    type: 'choice',
    options: [
      { value: 'period_hormones', label: 'Period & Hormones' },
      { value: 'anaemia_fatigue', label: 'Anaemia & Fatigue' },
    ],
  },
];

/* ── Reusable sub-components ──────────────────────────── */

function NumberInput({ value, onChange, label }) {
  return (
    <input
      type="number"
      min={1}
      max={120}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter a number"
      aria-label={label}
      className="w-full max-w-xs mx-auto block rounded-2xl border border-lavender-200 bg-white/80 px-5 py-3 text-center text-2xl font-semibold text-lavender-800 focus:outline-none focus:ring-2 focus:ring-lavender-400 transition"
    />
  );
}

function SliderInput({ value, onChange, min, max }) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-lavender-600 bg-lavender-100"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{min} — Low</span>
        <span className="text-lavender-700 font-bold text-lg -mt-1">{value}</span>
        <span>{max} — High</span>
      </div>
    </div>
  );
}

function YesNoInput({ value, onChange }) {
  const btn = (val, label) => (
    <button
      type="button"
      onClick={() => onChange(val)}
      className={`flex-1 py-3 rounded-2xl font-semibold text-lg transition border-2 ${
        value === val
          ? 'border-lavender-500 bg-lavender-100 text-lavender-800'
          : 'border-lavender-100 bg-white/60 text-gray-400 hover:border-lavender-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-4 max-w-xs mx-auto">
      {btn('yes', 'Yes')}
      {btn('no', 'No')}
    </div>
  );
}

function ChoiceInput({ value, onChange, options }) {
  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`w-full py-3.5 px-5 rounded-2xl font-semibold transition border-2 text-left ${
            value === opt.value
              ? 'border-lavender-500 bg-lavender-100 text-lavender-800'
              : 'border-lavender-100 bg-white/60 text-gray-500 hover:border-lavender-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────── */
export default function AssessmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    age: '',
    sleepHours: '',
    fatigue: 5,
    cycleRegular: '',
    heavyFlow: '',
    vegetarian: '',
    stress: 5,
    mode: '',
  });

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const update = (val) => setAnswers((prev) => ({ ...prev, [current.key]: val }));

  const canProceed = () => {
    const v = answers[current.key];
    if (current.type === 'slider') return true; // always has a default
    return v !== '' && v !== undefined;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Final step — navigate to results with answers
      navigate('/results', { state: answers });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigate('/');
  };

  /* ── Render input for current step ────────────────── */
  const renderInput = () => {
    const val = answers[current.key];
    switch (current.type) {
      case 'number':
        return <NumberInput value={val} onChange={update} label={current.label} />;
      case 'slider':
        return <SliderInput value={val} onChange={update} min={current.min} max={current.max} />;
      case 'yesno':
        return <YesNoInput value={val} onChange={update} />;
      case 'choice':
        return <ChoiceInput value={val} onChange={update} options={current.options} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Top bar ─────────────────────────────────── */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <button onClick={handleBack} className="text-lavender-600 hover:text-lavender-800 font-medium text-sm transition">
          ← Back
        </button>
        <span className="font-display text-xl font-bold text-lavender-700 tracking-tight">
          Saheli<span className="text-blush-500">AI</span>
        </span>
        <span className="text-xs text-gray-400">
          {step + 1} / {STEPS.length}
        </span>
      </nav>

      {/* ── Progress bar ────────────────────────────── */}
      <div className="max-w-3xl w-full mx-auto px-6">
        <div className="h-1.5 bg-lavender-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-lavender-400 to-blush-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Question card ───────────────────────────── */}
      <section className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg text-center">
          <p className="text-xs uppercase tracking-widest text-lavender-400 mb-2 font-medium">
            Question {step + 1}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-lavender-800 mb-8 leading-snug">
            {current.label}
          </h2>

          {renderInput()}

          {/* ── Navigation buttons ────────────────── */}
          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={handleBack}
              className="px-6 py-2.5 rounded-full border-2 border-lavender-200 text-lavender-600 font-medium hover:bg-lavender-50 transition text-sm"
            >
              Back
            </button>
            <button
              disabled={!canProceed()}
              onClick={handleNext}
              className="px-8 py-2.5 rounded-full bg-lavender-600 text-white font-semibold shadow-md shadow-lavender-300/40 hover:bg-lavender-700 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
            >
              {step === STEPS.length - 1 ? 'Get My Plan' : 'Next'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
