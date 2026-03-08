import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { MessageTheme } from '@/lib/message-types';

interface Props {
  theme: MessageTheme;
  onReveal: () => void;
  children: React.ReactNode;
}

const CardFlipReveal: React.FC<Props> = ({ theme, onReveal, children }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(true);
    setTimeout(onReveal, 600);
  };

  return (
    <div className="perspective-1000" style={{ perspective: 1000 }}>
      <motion.div
        className="relative w-72 h-96 cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        onClick={() => !flipped && handleFlip()}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl border-2 flex flex-col items-center justify-center backface-hidden"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="text-5xl mb-4">💌</div>
          <p className="font-body text-sm" style={{ color: theme.textColor, opacity: 0.7 }}>
            Tap to flip
          </p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl border-2 overflow-auto p-6"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default CardFlipReveal;
