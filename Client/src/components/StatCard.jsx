import { motion } from 'framer-motion';

const StatCard = ({ title, value, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="glass-card rounded-2xl p-4 shadow-lg"
      whileHover={{ y: -4 }}
    >
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </motion.div>
  );
};

export default StatCard;
