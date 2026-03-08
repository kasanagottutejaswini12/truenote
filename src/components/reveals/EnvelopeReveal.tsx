import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MessageTheme } from '@/lib/message-types';

interface Props {
  theme: MessageTheme;
  onReveal: () => void;
  children: React.ReactNode;
}

const EnvelopeReveal: React.FC<Props> = ({ theme, onReveal, children }) => {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(onReveal, 800);
  };

  return (
    <AnimatePresence mode="wait">
      {!opened ? (
        <motion.div
          key="envelope"
          className="cursor-pointer select-none"
          onClick={handleOpen}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-72 h-48">
            {/* Envelope body */}
            <div
              className="absolute inset-0 rounded-xl shadow-2xl border-2"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
            />
            {/* Flap */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-24 origin-top"
              style={{
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                backgroundColor: theme.accentColor,
                opacity: 0.2,
              }}
              whileHover={{ rotateX: -20 }}
            />
            {/* Seal */}
            <motion.div
              className="absolute top-16 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg"
              style={{ backgroundColor: theme.accentColor }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💌
            </motion.div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-sm font-body" style={{ color: theme.textColor, opacity: 0.6 }}>
              Tap to open
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnvelopeReveal;
