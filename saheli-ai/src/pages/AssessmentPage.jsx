import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NoiseOverlay from '../components/NoiseOverlay';
import GlowCard from '../components/GlowCard';
import ProgressBar from '../components/ProgressBar';
import analyzeResponses from '../analysis/analyzeResponses';

/* ── slide animation variants ────────────────────────── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

/* ── reusable field components ───────────────────────── */
function Field({ label, children, sub }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-purple-100 mb-1.5">{label}</label>
      {sub && <p className="text-xs text-purple-300/50 mb-1.5">{sub}</p>}
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, min, max, step, placeholder }) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step || 1}
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full">
      <option value="" disabled>{placeholder || 'Select…'}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function SliderField({ label, value, onChange, min = 1, max = 10 }) {
  const v = value || min;
  return (
    <Field label={`${label}: ${v}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-purple-400/50 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </Field>
  );
}

function YesNo({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="flex gap-3">
        {['yes', 'no'].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-5 py-2 rounded-xl text-sm font-medium border transition-all ${
              value === opt
                ? 'bg-purple-600/50 border-purple-500/60 text-white shadow-md shadow-purple-700/20'
                : 'bg-purple-900/20 border-purple-700/30 text-purple-300 hover:bg-purple-800/30'
            }`}
          >
            {opt === 'yes' ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
    </Field>
  );
}

function CheckboxGroup({ label, options, selected, onChange }) {
  const toggle = (val) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    onChange(next);
  };
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded-xl text-sm border transition-all ${
              selected.includes(opt)
                ? 'bg-purple-600/50 border-purple-500/60 text-white'
                : 'bg-purple-900/20 border-purple-700/30 text-purple-300 hover:bg-purple-800/30'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </Field>
  );
}

/* ── step definitions ────────────────────────────────── */
const TOTAL_STEPS = 4; // basic → mode select → mode questions → review

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState({
    // basic
    age: '', height: '', weight: '', sleepDuration: '', sleepQuality: 5,
    stressLevel: 5, activityFreq: '', screenTime: '', dietType: '', waterIntake: '',
    // mode
    mode: '',
    // period
    menarche: '', cycleLength: '', cycleRegularity: '', flowIntensity: '',
    painScale: 5, largeClots: '', pmsSymptoms: [], weightGain: '', hairThinning: '',
    excessFacialHair: '', darkPatches: '', familyPCOS: '', thyroidHistory: '',
    extremeFatigue: '', missedCycles: '',
    // anemia
    fatigueLevel: 5, dizziness: '', paleSkin: '', shortnessOfBreath: '',
    brittleNails: '', headaches: '', coldHands: '', heavyBleeding: '',
    ironFoodFreq: '', greenVegIntake: '', vitaminCIntake: '',
    teaCoffeeAfterMeals: '', recentBloodTest: '', hemoglobinLevel: '',
    ironDeficiencyHistory: '',
  });

  const set = (key) => (val) => setData((d) => ({ ...d, [key]: val }));

  const bmi = useMemo(() => {
    const h = Number(data.height) / 100;
    const w = Number(data.weight);
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
    return null;
  }, [data.height, data.weight]);

  const next = () => { setDir(1); setStep((s) => Math.min(s + 1, TOTAL_STEPS)); };
  const prev = () => { setDir(-1); setStep((s) => Math.max(s - 1, 1)); };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    const results = analyzeResponses(data);
    navigate('/results', { state: results });
  };

  /* ── render steps ──────────────────────────────────── */
  const renderStep = () => {
    switch (step) {
      /* ── STEP 1: Basic Profile ────────────────────── */
      case 1:
        return (
          <div key="step1">
            <h2 className="font-display text-2xl font-bold text-white mb-1">Basic Profile</h2>
            <p className="text-sm text-purple-300/60 mb-6">Let's start with some general information about you.</p>

            <div className="grid gap-x-6 md:grid-cols-2">
              <Field label="Age">
                <NumberInput value={data.age} onChange={set('age')} min={12} max={60} placeholder="e.g. 24" />
              </Field>
              <Field label="Height (cm)">
                <NumberInput value={data.height} onChange={set('height')} min={100} max={250} placeholder="e.g. 162" />
              </Field>
              <Field label="Weight (kg)">
                <NumberInput value={data.weight} onChange={set('weight')} min={25} max={200} placeholder="e.g. 58" />
              </Field>
              <Field label="BMI" sub="Auto-calculated from height & weight">
                <div className="w-full px-4 py-2.5 rounded-xl bg-purple-900/30 border border-purple-700/20 text-purple-200">
                  {bmi ? (
                    <span>
                      {bmi}{' '}
                      <span className="text-xs text-purple-400">
                        ({Number(bmi) < 18.5 ? 'Underweight' : Number(bmi) < 25 ? 'Normal' : Number(bmi) < 30 ? 'Overweight' : 'Obese'})
                      </span>
                    </span>
                  ) : (
                    <span className="text-purple-400/40">Enter height & weight</span>
                  )}
                </div>
              </Field>
              <Field label="Sleep Duration (hours/night)">
                <NumberInput value={data.sleepDuration} onChange={set('sleepDuration')} min={1} max={16} placeholder="e.g. 7" />
              </Field>
              <SliderField label="Sleep Quality" value={data.sleepQuality} onChange={set('sleepQuality')} />
              <SliderField label="Stress Level" value={data.stressLevel} onChange={set('stressLevel')} />
              <Field label="Physical Activity">
                <Select
                  value={data.activityFreq}
                  onChange={set('activityFreq')}
                  placeholder="How often do you exercise?"
                  options={[
                    { value: 'sedentary', label: 'Sedentary (rarely)' },
                    { value: 'light', label: 'Light (1–2 days/week)' },
                    { value: 'moderate', label: 'Moderate (3–4 days/week)' },
                    { value: 'active', label: 'Active (5+ days/week)' },
                  ]}
                />
              </Field>
              <Field label="Screen Time (hours/day)">
                <NumberInput value={data.screenTime} onChange={set('screenTime')} min={0} max={24} placeholder="e.g. 6" />
              </Field>
              <Field label="Diet Type">
                <Select
                  value={data.dietType}
                  onChange={set('dietType')}
                  options={[
                    { value: 'veg', label: 'Vegetarian' },
                    { value: 'nonveg', label: 'Non-Vegetarian' },
                    { value: 'mixed', label: 'Mixed' },
                  ]}
                />
              </Field>
              <Field label="Water Intake (glasses/day)">
                <NumberInput value={data.waterIntake} onChange={set('waterIntake')} min={0} max={20} placeholder="e.g. 8" />
              </Field>
            </div>
          </div>
        );

      /* ── STEP 2: Mode Selection ───────────────────── */
      case 2:
        return (
          <div key="step2">
            <h2 className="font-display text-2xl font-bold text-white mb-1">Choose Your Focus</h2>
            <p className="text-sm text-purple-300/60 mb-8">Select the area you'd like us to assess in detail.</p>

            <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
              {[
                {
                  key: 'period',
                  title: 'Period & Hormones',
                  desc: 'Menstrual health, cycle patterns, and hormonal indicators.',
                },
                {
                  key: 'anemia',
                  title: 'Anemia & Nutrition',
                  desc: 'Energy, iron levels, dietary patterns, and physical signs.',
                },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => set('mode')(m.key)}
                  className={`glow-card p-8 text-center transition-all duration-300 cursor-pointer ${
                    data.mode === m.key
                      ? 'border-purple-400/60 shadow-lg shadow-purple-600/20 scale-[1.02]'
                      : 'hover:border-purple-500/30'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white mb-2 font-display">{m.title}</h3>
                  <p className="text-sm text-purple-200/60">{m.desc}</p>
                  {data.mode === m.key && (
                    <div className="mt-4 inline-block px-3 py-1 rounded-full bg-purple-600/40 text-purple-200 text-xs font-medium">
                      Selected
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      /* ── STEP 3: Mode-specific questions ──────────── */
      case 3:
        if (data.mode === 'period') {
          return (
            <div key="step3-period">
              <h2 className="font-display text-2xl font-bold text-white mb-1">Period & Hormones</h2>
              <p className="text-sm text-purple-300/60 mb-6">Help us understand your menstrual health patterns.</p>

              <div className="grid gap-x-6 md:grid-cols-2">
                <Field label="Age at First Period (menarche)">
                  <NumberInput value={data.menarche} onChange={set('menarche')} min={8} max={20} placeholder="e.g. 13" />
                </Field>
                <Field label="Average Cycle Length (days)">
                  <NumberInput value={data.cycleLength} onChange={set('cycleLength')} min={15} max={60} placeholder="e.g. 28" />
                </Field>
                <Field label="Cycle Regularity">
                  <Select
                    value={data.cycleRegularity}
                    onChange={set('cycleRegularity')}
                    options={[
                      { value: 'regular', label: 'Regular (consistent each month)' },
                      { value: 'mostly_regular', label: 'Mostly regular (off by a few days)' },
                      { value: 'irregular', label: 'Irregular (varies significantly)' },
                      { value: 'very_irregular', label: 'Very irregular / unpredictable' },
                    ]}
                  />
                </Field>
                <Field label="Flow Intensity">
                  <Select
                    value={data.flowIntensity}
                    onChange={set('flowIntensity')}
                    options={[
                      { value: 'light', label: 'Light' },
                      { value: 'moderate', label: 'Moderate' },
                      { value: 'heavy', label: 'Heavy' },
                      { value: 'very_heavy', label: 'Very Heavy' },
                    ]}
                  />
                </Field>
                <SliderField label="Severe Pain Level" value={data.painScale} onChange={set('painScale')} />
                <YesNo label="Large Clots?" value={data.largeClots} onChange={set('largeClots')} />
              </div>

              <CheckboxGroup
                label="PMS Symptoms (select all that apply)"
                options={['Mood swings', 'Bloating', 'Acne', 'Breast tenderness', 'Headaches']}
                selected={data.pmsSymptoms}
                onChange={set('pmsSymptoms')}
              />

              <div className="grid gap-x-6 md:grid-cols-2">
                <YesNo label="Sudden weight gain?" value={data.weightGain} onChange={set('weightGain')} />
                <YesNo label="Hair thinning?" value={data.hairThinning} onChange={set('hairThinning')} />
                <YesNo label="Excess facial hair?" value={data.excessFacialHair} onChange={set('excessFacialHair')} />
                <YesNo label="Dark patches on skin?" value={data.darkPatches} onChange={set('darkPatches')} />
                <YesNo label="Family history of PCOS?" value={data.familyPCOS} onChange={set('familyPCOS')} />
                <YesNo label="Thyroid history?" value={data.thyroidHistory} onChange={set('thyroidHistory')} />
                <YesNo label="Extreme fatigue during periods?" value={data.extremeFatigue} onChange={set('extremeFatigue')} />
                <YesNo label="Missed cycles in last 6 months?" value={data.missedCycles} onChange={set('missedCycles')} />
              </div>
            </div>
          );
        }

        // Anemia mode
        return (
          <div key="step3-anemia">
            <h2 className="font-display text-2xl font-bold text-white mb-1">Anemia & Nutrition</h2>
            <p className="text-sm text-purple-300/60 mb-6">Let's look at your energy and nutrition patterns.</p>

            <div className="grid gap-x-6 md:grid-cols-2">
              <SliderField label="Fatigue Level" value={data.fatigueLevel} onChange={set('fatigueLevel')} />
              <YesNo label="Do you experience dizziness?" value={data.dizziness} onChange={set('dizziness')} />
              <YesNo label="Have you noticed pale skin?" value={data.paleSkin} onChange={set('paleSkin')} />
              <YesNo label="Shortness of breath?" value={data.shortnessOfBreath} onChange={set('shortnessOfBreath')} />
              <YesNo label="Brittle nails?" value={data.brittleNails} onChange={set('brittleNails')} />
              <YesNo label="Frequent headaches?" value={data.headaches} onChange={set('headaches')} />
              <YesNo label="Cold hands/feet?" value={data.coldHands} onChange={set('coldHands')} />
              <YesNo label="Heavy menstrual bleeding?" value={data.heavyBleeding} onChange={set('heavyBleeding')} />

              <Field label="Iron-rich Food Intake">
                <Select
                  value={data.ironFoodFreq}
                  onChange={set('ironFoodFreq')}
                  placeholder="How often?"
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'often', label: 'Often (4–5x/week)' },
                    { value: 'sometimes', label: 'Sometimes (2–3x/week)' },
                    { value: 'rarely', label: 'Rarely' },
                  ]}
                />
              </Field>
              <Field label="Green Leafy Vegetable Intake">
                <Select
                  value={data.greenVegIntake}
                  onChange={set('greenVegIntake')}
                  placeholder="How often?"
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'often', label: 'Often' },
                    { value: 'sometimes', label: 'Sometimes' },
                    { value: 'rarely', label: 'Rarely' },
                  ]}
                />
              </Field>
              <Field label="Vitamin C Intake">
                <Select
                  value={data.vitaminCIntake}
                  onChange={set('vitaminCIntake')}
                  placeholder="How often?"
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'often', label: 'Often' },
                    { value: 'sometimes', label: 'Sometimes' },
                    { value: 'rarely', label: 'Rarely' },
                  ]}
                />
              </Field>
              <YesNo label="Tea/coffee right after meals?" value={data.teaCoffeeAfterMeals} onChange={set('teaCoffeeAfterMeals')} />
              <YesNo label="Recent blood test (last 6 months)?" value={data.recentBloodTest} onChange={set('recentBloodTest')} />
              <Field label="Known Hemoglobin Level (g/dL)" sub="Optional — leave blank if unsure">
                <NumberInput value={data.hemoglobinLevel} onChange={set('hemoglobinLevel')} min={3} max={20} step={0.1} placeholder="e.g. 11.5" />
              </Field>
              <YesNo label="History of iron deficiency?" value={data.ironDeficiencyHistory} onChange={set('ironDeficiencyHistory')} />
            </div>
          </div>
        );

      /* ── STEP 4: Review ───────────────────────────── */
      case 4:
        return (
          <div key="step4">
            <h2 className="font-display text-2xl font-bold text-white mb-1">Review & Submit</h2>
            <p className="text-sm text-purple-300/60 mb-6">Please review your responses before we analyze them.</p>

            <div className="space-y-4">
              {/* Basic summary */}
              <GlowCard className="!p-5">
                <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">Basic Profile</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {[
                    ['Age', data.age],
                    ['Height', `${data.height} cm`],
                    ['Weight', `${data.weight} kg`],
                    ['BMI', bmi || '—'],
                    ['Sleep', `${data.sleepDuration}h (${data.sleepQuality}/10)`],
                    ['Stress', `${data.stressLevel}/10`],
                    ['Activity', data.activityFreq],
                    ['Diet', data.dietType],
                    ['Water', `${data.waterIntake} glasses`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span className="text-purple-400/60">{k}:</span>{' '}
                      <span className="text-purple-100">{v || '—'}</span>
                    </div>
                  ))}
                </div>
              </GlowCard>

              {/* Mode summary */}
              <GlowCard className="!p-5">
                <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">
                  {data.mode === 'period' ? 'Period & Hormones' : 'Anemia & Nutrition'}
                </h3>
                <p className="text-sm text-purple-200/70">
                  {data.mode === 'period'
                    ? `Cycle: ${data.cycleLength || '—'} days, ${data.cycleRegularity || '—'}, Flow: ${data.flowIntensity || '—'}, Pain: ${data.painScale}/10, PMS: ${data.pmsSymptoms.length > 0 ? data.pmsSymptoms.join(', ') : 'None selected'}`
                    : `Fatigue: ${data.fatigueLevel}/10, Iron foods: ${data.ironFoodFreq || '—'}, Greens: ${data.greenVegIntake || '—'}, Hb: ${data.hemoglobinLevel || 'Unknown'}`
                  }
                </p>
              </GlowCard>

              {/* Disclaimer */}
              <div className="rounded-xl bg-pink-950/20 border border-pink-400/15 px-5 py-4 text-center">
                <p className="text-xs text-pink-200/60">
                  By submitting, you understand this is <strong className="text-pink-200">not a medical diagnosis</strong>. Results are guidance-based patterns only.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    if (step === 1) return data.age && data.height && data.weight;
    if (step === 2) return !!data.mode;
    return true;
  };

  return (
    <div className="relative min-h-screen">
      <NoiseOverlay />
      <div className="absolute top-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-700/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => step === 1 ? navigate('/') : prev()}
            className="text-purple-400 hover:text-purple-200 transition-colors text-sm"
          >
            ← {step === 1 ? 'Home' : 'Back'}
          </button>
          <span className="text-purple-600/40">|</span>
          <h1 className="font-display text-lg font-semibold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            AETERNUM
          </h1>
        </div>

        <ProgressBar current={step} total={TOTAL_STEPS} />

        {/* Step content with animation */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-10">
          <button
            onClick={prev}
            disabled={step === 1}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              step === 1
                ? 'border-purple-800/20 text-purple-600/30 cursor-not-allowed'
                : 'border-purple-600/30 text-purple-300 hover:bg-purple-800/30'
            }`}
          >
            ← Previous
          </button>

          {step < TOTAL_STEPS ? (
            <button
              onClick={next}
              disabled={!canProceed()}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md shadow-purple-700/30 hover:shadow-purple-600/40 hover:scale-[1.02]'
                  : 'bg-purple-900/30 text-purple-500/40 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-700/30 hover:shadow-purple-600/50 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Analyzing…
                </span>
              ) : (
                'Analyze My Health →'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
