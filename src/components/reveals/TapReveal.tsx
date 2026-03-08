import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MessageTheme } from '@/lib/message-types';

interface Props {
  theme: MessageTheme;
  onReveal: () => void;
  children: React.ReactNode;
}

const TapReveal: React.FC<Props> = ({ theme, onReveal, children }) => {
  const [revealed, setRevealed] = useState(false);

  const handleTap = () => {
    setRevealed(true);
    onReveal();
  };

  return (
    <AnimatePresence mode="wait">
      {!revealed ? (
        <motion.div
          key="closed"
          className="cursor-pointer select-none"
          onClick={handleTap}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div
            className="w-72 h-44 rounded-2xl shadow-2xl flex items-center justify-center border-2 relative overflow-hidden"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
          >
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `radial-gradient(circle at 30% 30%, ${theme.accentColor} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }} />
            <motion.p
              className="text-lg font-body z-10"
              style={{ color: theme.textColor }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              ✨ Tap to reveal ✨
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="open"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TapReveal;
