import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-pink-500 mb-2">
        <span>Step {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-pink-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
