import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-purple-300 mb-2">
        <span>Step {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-purple-950/50 rounded-full overflow-hidden border border-purple-800/30">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ boxShadow: '0 0 12px rgba(168,85,247,0.5)' }}
        />
      </div>
    </div>
  );
}
