import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { MessageTheme } from '@/lib/message-types';

interface Props {
  theme: MessageTheme;
  onReveal: () => void;
  children: React.ReactNode;
}

const ScratchReveal: React.FC<Props> = ({ theme, onReveal, children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const scratchedRef = useRef(0);

  const initCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = theme.accentColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '16px Quicksand';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to reveal ✨', canvas.width / 2, canvas.height / 2);
  }, [theme.accentColor]);

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    scratchedRef.current += 1;
    if (scratchedRef.current > 30 && !revealed) {
      setRevealed(true);
      onReveal();
    }
  };

  return (
    <div className="relative w-72 h-96 rounded-2xl shadow-2xl overflow-hidden border-2" style={{ borderColor: theme.cardBorder }}>
      <div className="absolute inset-0 p-6 overflow-auto" style={{ backgroundColor: theme.cardBg }}>
        {children}
      </div>
      {!revealed && (
        <motion.canvas
          ref={initCanvas}
          width={288}
          height={384}
          className="absolute inset-0 cursor-pointer touch-none"
          onMouseMove={scratch}
          onTouchMove={scratch}
          exit={{ opacity: 0 }}
        />
      )}
    </div>
  );
};

export default ScratchReveal;
