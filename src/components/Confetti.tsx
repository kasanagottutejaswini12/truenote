import React from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  show: boolean;
}

const confettiColors = [
  'hsl(340, 70%, 75%)',
  'hsl(42, 80%, 60%)',
  'hsl(270, 50%, 80%)',
  'hsl(20, 80%, 85%)',
  'hsl(140, 40%, 55%)',
  'hsl(200, 60%, 85%)',
  'hsl(340, 60%, 65%)',
  'hsl(50, 80%, 70%)',
];

const Confetti: React.FC<ConfettiProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(40)].map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const duration = 2.5 + Math.random() * 2;
        const size = 4 + Math.random() * 8;
        const color = confettiColors[i % confettiColors.length];
        const isCircle = i % 3 === 0;
        const rotation = Math.random() * 720;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              top: -20,
              width: isCircle ? size : size * 0.5,
              height: isCircle ? size : size * 1.5,
              backgroundColor: color,
              borderRadius: isCircle ? '50%' : '2px',
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 50,
              opacity: [1, 1, 0.8, 0],
              rotate: rotation,
              x: (Math.random() - 0.5) * 200,
            }}
            transition={{
              duration,
              delay,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
};

export default Confetti;
