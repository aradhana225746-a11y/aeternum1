import { motion } from 'framer-motion';

export default function GlowCard({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={`glow-card p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
