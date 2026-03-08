import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { AnimationEffect } from '@/lib/message-types';

interface AnimationEffectsProps {
  effect: AnimationEffect;
  show: boolean;
}

const colors = {
  confetti: ['hsl(340,70%,75%)', 'hsl(42,80%,60%)', 'hsl(270,50%,80%)', 'hsl(20,80%,85%)', 'hsl(140,40%,55%)', 'hsl(200,60%,85%)', 'hsl(50,80%,70%)'],
  hearts: ['hsl(340,70%,65%)', 'hsl(340,60%,75%)', 'hsl(350,70%,70%)', 'hsl(330,60%,70%)'],
  sparkles: ['hsl(42,90%,65%)', 'hsl(42,80%,75%)', 'hsl(50,85%,70%)', 'hsl(38,90%,60%)'],
  petals: ['hsl(340,70%,80%)', 'hsl(340,50%,85%)', 'hsl(20,60%,85%)', 'hsl(330,40%,80%)'],
};

const AnimationEffects: React.FC<AnimationEffectsProps> = ({ effect, show }) => {
  const particles = useMemo(() =>
    [...Array(30)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
      size: effect === 'hearts' ? 14 + Math.random() * 10 : 4 + Math.random() * 8,
      color: colors[effect]?.[i % (colors[effect]?.length || 1)] || 'hsl(340,70%,75%)',
      rotation: Math.random() * 720,
    })), [effect]);

  if (!show || effect === 'none') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: -20,
            fontSize: effect === 'hearts' ? p.size : undefined,
            width: effect !== 'hearts' ? p.size : undefined,
            height: effect !== 'hearts' ? (effect === 'confetti' ? p.size * 1.5 : p.size) : undefined,
            backgroundColor: effect !== 'hearts' ? p.color : undefined,
            borderRadius: effect === 'petals' ? '50% 0 50% 50%' : effect === 'sparkles' ? '50%' : '2px',
            boxShadow: effect === 'sparkles' ? `0 0 ${p.size}px ${p.color}` : undefined,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 50 : 800,
            opacity: [1, 1, 0.8, 0],
            rotate: p.rotation,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        >
          {effect === 'hearts' && '❤️'}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimationEffects;
