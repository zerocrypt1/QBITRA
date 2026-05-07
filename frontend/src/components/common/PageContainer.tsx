import { motion } from 'framer-motion';

export const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <motion.main
    className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
  >
    {children}
  </motion.main>
);
