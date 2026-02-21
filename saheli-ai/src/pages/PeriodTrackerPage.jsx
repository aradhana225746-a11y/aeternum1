import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TranslateButton from '../components/TranslateButton';
import { useTranslation } from '../context/TranslationContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const STORAGE_KEY = 'aeternum_period_logs';
const CYCLE_PHASES = {
  menstrual: { label: 'Menstrual', color: '#e11d48', bg: 'bg-rose-100', emoji: '🩸', days: '1–5' },
  follicular: { label: 'Follicular', color: '#f59e0b', bg: 'bg-amber-100', emoji: '🌱', days: '6–13' },
  ovulation: { label: 'Ovulation', color: '#10b981', bg: 'bg-emerald-100', emoji: '✨', days: '14–16' },
  luteal: { label: 'Luteal', color: '#8b5cf6', bg: 'bg-violet-100', emoji: '🌙', days: '17–28' },
};

const MOOD_OPTIONS = ['😊 Happy', '😐 Neutral', '😢 Sad', '😤 Irritable', '😰 Anxious', '🥰 Loving', '😴 Exhausted'];
const FLOW_OPTIONS = ['None', 'Spotting', 'Light', 'Medium', 'Heavy'];
const SYMPTOM_OPTIONS = ['Cramps', 'Bloating', 'Headache', 'Breast tenderness', 'Acne', 'Fatigue', 'Cravings', 'Back pain', 'Nausea'];

function loadLogs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function toDateStr(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function daysBetween(a, b) {
  return Math.round(Math.abs(new Date(a) - new Date(b)) / (1000 * 60 * 60 * 24));
}

/* ── Calendar component ──────────────────────────────── */
function MiniCalendar({ logs, selectedDate, onSelectDate }) {
  const [viewMonth, setViewMonth] = useState(new Date());

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const logMap = useMemo(() => {
    const m = {};
    logs.forEach((l) => (m[l.date] = l));
    return m;
  }, [logs]);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-pink-400 hover:text-pink-700 transition-colors text-sm px-2 py-1">
          ←
        </button>
        <h4 className="font-display font-semibold text-pink-800">{monthLabel}</h4>
        <button onClick={nextMonth} className="text-pink-400 hover:text-pink-700 transition-colors text-sm px-2 py-1">
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-pink-400 font-medium py-1">{d}</div>
        ))}
        {days.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />;
          const dateStr = formatDate(new Date(year, month, d));
          const log = logMap[dateStr];
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === formatDate(new Date());
          const hasFlow = log && log.flow && log.flow !== 'None';

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`relative py-2 rounded-lg text-sm transition-all ${
                isSelected
                  ? 'bg-pink-500 text-white font-semibold'
                  : isToday
                  ? 'bg-pink-100 text-pink-700 font-medium'
                  : hasFlow
                  ? 'bg-rose-100/60 text-pink-800'
                  : log
                  ? 'bg-pink-50 text-pink-700'
                  : 'text-pink-600 hover:bg-pink-50'
              }`}
            >
              {d}
              {hasFlow && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rose-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PeriodTrackerPage() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState(loadLogs);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [editMode, setEditMode] = useState(false);

  // Form state for selected date
  const existingLog = logs.find((l) => l.date === selectedDate);
  const [flow, setFlow] = useState('None');
  const [mood, setMood] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingLog) {
      setFlow(existingLog.flow || 'None');
      setMood(existingLog.mood || '');
      setSymptoms(existingLog.symptoms || []);
      setNotes(existingLog.notes || '');
    } else {
      setFlow('None');
      setMood('');
      setSymptoms([]);
      setNotes('');
    }
    setEditMode(false);
  }, [selectedDate]);

  const saveEntry = () => {
    const entry = { date: selectedDate, flow, mood, symptoms, notes };
    const updated = logs.filter((l) => l.date !== selectedDate);
    updated.push(entry);
    updated.sort((a, b) => a.date.localeCompare(b.date));
    setLogs(updated);
    saveLogs(updated);
    setEditMode(false);
  };

  const deleteEntry = () => {
    const updated = logs.filter((l) => l.date !== selectedDate);
    setLogs(updated);
    saveLogs(updated);
    setFlow('None');
    setMood('');
    setSymptoms([]);
    setNotes('');
    setEditMode(false);
  };

  const toggleSymptom = (s) => {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  /* ── Cycle stats ─────────────────────────────────── */
  const periodStarts = useMemo(() => {
    const flowLogs = logs
      .filter((l) => l.flow && l.flow !== 'None' && l.flow !== 'Spotting')
      .sort((a, b) => a.date.localeCompare(b.date));

    const starts = [];
    let lastDate = null;
    flowLogs.forEach((l) => {
      if (!lastDate || daysBetween(l.date, lastDate) > 3) {
        starts.push(l.date);
      }
      lastDate = l.date;
    });
    return starts;
  }, [logs]);

  const avgCycleLength = useMemo(() => {
    if (periodStarts.length < 2) return null;
    let total = 0;
    for (let i = 1; i < periodStarts.length; i++) {
      total += daysBetween(periodStarts[i], periodStarts[i - 1]);
    }
    return Math.round(total / (periodStarts.length - 1));
  }, [periodStarts]);

  const lastPeriod = periodStarts.length > 0 ? periodStarts[periodStarts.length - 1] : null;
  const nextPeriodEst = lastPeriod && avgCycleLength
    ? formatDate(new Date(new Date(lastPeriod).getTime() + avgCycleLength * 86400000))
    : null;

  const currentPhase = useMemo(() => {
    if (!lastPeriod) return null;
    const daysSincePeriod = daysBetween(formatDate(new Date()), lastPeriod);
    const cycle = avgCycleLength || 28;
    const day = (daysSincePeriod % cycle) + 1;
    if (day <= 5) return 'menstrual';
    if (day <= 13) return 'follicular';
    if (day <= 16) return 'ovulation';
    return 'luteal';
  }, [lastPeriod, avgCycleLength]);

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
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h2
            className="font-display text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: '#2d3436' }}
          >
            {t('trackerTitle') || 'Period Tracker'}
          </h2>
          <p className="text-sm text-pink-500/80 max-w-md">
            {t('trackerSub') || 'Log your cycle, mood, and symptoms — your body has a rhythm, let\'s learn it together. 💕'}
          </p>
        </motion.div>

        {/* ── Cycle Overview ──────────────────────────── */}
        {(currentPhase || avgCycleLength) && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-10">
            <div className="flex flex-wrap gap-6">
              {currentPhase && (
                <div>
                  <p className="text-xs text-pink-400 uppercase tracking-wider mb-1">Current Phase</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CYCLE_PHASES[currentPhase].emoji}</span>
                    <span className="font-display font-semibold text-pink-800">
                      {CYCLE_PHASES[currentPhase].label}
                    </span>
                  </div>
                </div>
              )}
              {avgCycleLength && (
                <div>
                  <p className="text-xs text-pink-400 uppercase tracking-wider mb-1">Avg Cycle</p>
                  <p className="font-display font-semibold text-pink-800">{avgCycleLength} days</p>
                </div>
              )}
              {lastPeriod && (
                <div>
                  <p className="text-xs text-pink-400 uppercase tracking-wider mb-1">Last Period</p>
                  <p className="font-display font-semibold text-pink-800">{toDateStr(lastPeriod)}</p>
                </div>
              )}
              {nextPeriodEst && (
                <div>
                  <p className="text-xs text-pink-400 uppercase tracking-wider mb-1">Next (est.)</p>
                  <p className="font-display font-semibold text-pink-800">{toDateStr(nextPeriodEst)}</p>
                </div>
              )}
            </div>

            {/* Phase guide */}
            <div className="flex gap-3 mt-6 flex-wrap">
              {Object.entries(CYCLE_PHASES).map(([key, phase]) => (
                <div
                  key={key}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${
                    currentPhase === key ? 'ring-2 ring-pink-400 ' + phase.bg : 'bg-pink-50/60'
                  }`}
                >
                  <span>{phase.emoji}</span>
                  <span className="text-pink-700">{phase.label}</span>
                  <span className="text-pink-400">({phase.days})</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="border-t border-pink-200/50 mb-8" />

        {/* ── Calendar + Log ──────────────────────────── */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Calendar */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <MiniCalendar logs={logs} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </motion.div>

          {/* Day log */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-pink-800">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </h3>
              {existingLog && !editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-xs text-pink-400 hover:text-pink-700 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {/* View mode */}
            {existingLog && !editMode ? (
              <div className="space-y-4">
                {existingLog.flow && existingLog.flow !== 'None' && (
                  <div>
                    <p className="text-xs text-pink-400 uppercase tracking-wider mb-1">Flow</p>
                    <p className="text-sm text-pink-700">🩸 {existingLog.flow}</p>
                  </div>
                )}
                {existingLog.mood && (
                  <div>
                    <p className="text-xs text-pink-400 uppercase tracking-wider mb-1">Mood</p>
                    <p className="text-sm text-pink-700">{existingLog.mood}</p>
                  </div>
                )}
                {existingLog.symptoms?.length > 0 && (
                  <div>
                    <p className="text-xs text-pink-400 uppercase tracking-wider mb-1">Symptoms</p>
                    <div className="flex flex-wrap gap-1.5">
                      {existingLog.symptoms.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full bg-pink-100 text-xs text-pink-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {existingLog.notes && (
                  <div>
                    <p className="text-xs text-pink-400 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-sm text-pink-700/80 italic">{existingLog.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              /* Edit / New entry mode */
              <div className="space-y-5">
                {/* Flow */}
                <div>
                  <p className="text-xs font-medium text-pink-500 uppercase tracking-wider mb-2">Flow</p>
                  <div className="flex flex-wrap gap-2">
                    {FLOW_OPTIONS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFlow(f)}
                        className={`px-3.5 py-1.5 rounded-full text-xs transition-all ${
                          flow === f
                            ? 'bg-pink-500 text-white'
                            : 'border border-pink-200 text-pink-600 hover:bg-pink-50'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood */}
                <div>
                  <p className="text-xs font-medium text-pink-500 uppercase tracking-wider mb-2">Mood</p>
                  <div className="flex flex-wrap gap-2">
                    {MOOD_OPTIONS.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={`px-3.5 py-1.5 rounded-full text-xs transition-all ${
                          mood === m
                            ? 'bg-pink-500 text-white'
                            : 'border border-pink-200 text-pink-600 hover:bg-pink-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <p className="text-xs font-medium text-pink-500 uppercase tracking-wider mb-2">Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {SYMPTOM_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSymptom(s)}
                        className={`px-3.5 py-1.5 rounded-full text-xs transition-all ${
                          symptoms.includes(s)
                            ? 'bg-pink-500 text-white'
                            : 'border border-pink-200 text-pink-600 hover:bg-pink-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-xs font-medium text-pink-500 uppercase tracking-wider mb-2">Notes</p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How are you feeling today, babe?"
                    rows={2}
                    className="w-full bg-white border border-pink-200 rounded-xl px-4 py-2.5 text-sm text-pink-800 placeholder:text-pink-300 outline-none focus:border-pink-400 resize-none"
                  />
                </div>

                {/* Save / Delete */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveEntry}
                    className="px-6 py-2 rounded-full text-white text-sm font-medium transition-colors"
                    style={{ background: '#2d3436' }}
                  >
                    {existingLog ? 'Update' : 'Save'} ✨
                  </button>
                  {existingLog && (
                    <button
                      onClick={deleteEntry}
                      className="px-5 py-2 rounded-full border border-pink-200 text-pink-400 text-sm hover:bg-pink-50 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  {editMode && (
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-5 py-2 rounded-full border border-pink-200 text-pink-400 text-sm hover:bg-pink-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Recent logs ─────────────────────────────── */}
        {logs.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-12"
          >
            <div className="border-t border-pink-200/50 mb-8" />
            <h3 className="font-display text-lg font-semibold text-pink-800 mb-4">
              Recent Entries
            </h3>
            <div className="space-y-3">
              {logs
                .slice(-7)
                .reverse()
                .map((log) => (
                  <button
                    key={log.date}
                    onClick={() => setSelectedDate(log.date)}
                    className={`w-full text-left flex items-center gap-4 py-3 px-1 transition-colors rounded-lg hover:bg-pink-50/50 ${
                      selectedDate === log.date ? 'bg-pink-50' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-pink-700 w-20 flex-shrink-0">
                      {toDateStr(log.date)}
                    </span>
                    {log.flow && log.flow !== 'None' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                        🩸 {log.flow}
                      </span>
                    )}
                    {log.mood && (
                      <span className="text-xs text-pink-500">{log.mood}</span>
                    )}
                    {log.symptoms?.length > 0 && (
                      <span className="text-xs text-pink-400">+{log.symptoms.length} symptoms</span>
                    )}
                  </button>
                ))}
            </div>
          </motion.div>
        )}

        {/* ── Tips ────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-12"
        >
          <div className="border-t border-pink-200/50 mb-8" />
          <h3
            className="font-display text-xl font-bold mb-4"
            style={{ color: '#2d3436' }}
          >
            {t('trackerTipsTitle') || 'Cycle Care Tips 💕'}
          </h3>
          <div className="space-y-4">
            {[
              { phase: 'menstrual', tip: 'Rest is productive. Warm drinks, gentle stretches, and iron-rich foods are your best friends right now.' },
              { phase: 'follicular', tip: 'Energy is rising! Great time for new projects, workouts, and trying new things.' },
              { phase: 'ovulation', tip: 'You\'re glowing, babe! Social energy peaks — perfect for big conversations and dates.' },
              { phase: 'luteal', tip: 'Nest mode activated. Comfort food (healthy-ish), journaling, and early bedtimes feel amazing now.' },
            ].map((item) => (
              <div key={item.phase} className="flex gap-3 items-start">
                <span className="text-lg flex-shrink-0">{CYCLE_PHASES[item.phase].emoji}</span>
                <div>
                  <span className="text-sm font-semibold text-pink-800">{CYCLE_PHASES[item.phase].label}:</span>{' '}
                  <span className="text-sm text-pink-700/80">{item.tip}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="border-l-2 border-pink-300 pl-4 py-2 mt-10">
          <p className="text-xs text-pink-500/80">
            {t('trackerDisclaimer') || 'This tracker is for awareness, not medical prediction. Every body is different — cycle estimates are based on your logged data. 💕'}
          </p>
        </div>

        <footer className="mt-16 border-t border-pink-100 pt-8 pb-6">
          <p className="text-xs text-pink-400">{t('footer')}</p>
        </footer>
      </div>
    </div>
  );
}
