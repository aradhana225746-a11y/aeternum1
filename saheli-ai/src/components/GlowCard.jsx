import { motion } from 'framer-motion';

export default function GlowCard({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`py-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
