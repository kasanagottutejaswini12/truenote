import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BouquetData, BouquetProvider, FlowerItem } from '@/context/BouquetContext';
import FlowerSVG from '@/components/FlowerSVG';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const cardThemes: Record<string, { bg: string; border: string; text: string }> = {
  rose: { bg: '#fff5f5', border: '#e8a0b4', text: '#8b4a5e' },
  lavender: { bg: '#f5f0ff', border: '#b088d4', text: '#5a3d7a' },
  gold: { bg: '#fffbf0', border: '#daa520', text: '#8b6914' },
  sky: { bg: '#f0f8ff', border: '#87ceeb', text: '#3a6b8c' },
  peach: { bg: '#fff8f0', border: '#ffb347', text: '#8b5e2b' },
  mint: { bg: '#f0fff5', border: '#98d4a6', text: '#3a6b4a' },
};

const ViewBouquetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: welcome, 1: closed, 2: opened
  const [selectedFlower, setSelectedFlower] = useState<FlowerItem | null>(null);

  const bouquet = useMemo<BouquetData | null>(() => {
    try {
      const data = searchParams.get('d');
      if (!data) return null;
      return JSON.parse(atob(decodeURIComponent(data)));
    } catch {
      return null;
    }
  }, [searchParams]);

  const theme = bouquet ? (cardThemes[bouquet.messageCard.cardTheme] || cardThemes.rose) : cardThemes.rose;

  const petals = useMemo(() =>
    [...Array(15)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 3,
      size: 8 + Math.random() * 12,
    })), []);

  if (!bouquet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center font-body">
          <p className="text-xl text-foreground mb-4">This bouquet couldn't be found 🥀</p>
          <Button onClick={() => navigate('/')} className="bg-primary text-primary-foreground rounded-full">
            Create Your Own
          </Button>
        </div>
      </div>
    );
  }

  const getFlowerPosition = (index: number, total: number) => {
    const centerX = 160;
    const baseY = 130;
    const cols = Math.min(total, 4);
    const row = Math.floor(index / cols);
    const col = index % cols;
    const itemsInRow = Math.min(cols, total - row * cols);
    return {
      x: centerX - (itemsInRow - 1) * 22 + col * 44,
      y: baseY - row * 38 + (col % 2) * 12,
    };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Step 0: Welcome */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            className="text-center z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <Heart className="w-12 h-12 text-primary mx-auto" fill="hsl(var(--primary))" />
            </motion.div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">
              Someone sent you<br />a digital bouquet
            </h1>
            {bouquet.recipientName && (
              <p className="text-lg text-muted-foreground font-body mb-6">
                For you, {bouquet.recipientName} 💕
              </p>
            )}
            <Button
              size="lg"
              className="bg-primary text-primary-foreground rounded-full px-10 py-6 text-lg font-body shadow-lg shadow-primary/20"
              onClick={() => setStep(1)}
            >
              See Your Bouquet
            </Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="closed"
            className="text-center z-10 cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setStep(2)}
          >
            <div className="relative w-80 h-96 mx-auto">
              {/* Closed bouquet - just wrapping */}
              <svg width="320" height="400" className="mx-auto">
                <defs>
                  <linearGradient id="closedWrap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={bouquet.wrapColor} />
                    <stop offset="100%" stopColor={bouquet.wrapColor} />
                  </linearGradient>
                </defs>
                <path d="M60 120 L160 380 L260 120 Z" fill="url(#closedWrap)" />
                <path d="M60 120 Q160 90 260 120" fill={bouquet.wrapColor} stroke={bouquet.wrapColor} />
                {/* Peek of flowers */}
                {bouquet.flowers.slice(0, 3).map((f, i) => (
                  <circle key={f.id} cx={130 + i * 30} cy={105} r={12} fill={f.color} opacity="0.7" />
                ))}
                {/* Ribbon */}
                {bouquet.ribbonStyle !== 'none' && (
                  <ellipse cx="160" cy="180" rx="25" ry="15" fill={bouquet.ribbonColor} opacity="0.8" />
                )}
              </svg>
            </div>
            <motion.p
              className="text-muted-foreground font-body mt-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ Tap to open your bouquet ✨
            </motion.p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="opened"
            className="text-center z-10 w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Falling petals */}
            {petals.map(petal => (
              <motion.div
                key={petal.id}
                className="absolute rounded-full bg-primary/20"
                style={{ left: `${petal.left}%`, width: petal.size, height: petal.size, top: -20 }}
                animate={{ y: [0, window.innerHeight + 50], rotate: [0, 360], x: [(Math.random() - 0.5) * 80] }}
                transition={{ duration: petal.duration, delay: petal.delay, repeat: Infinity, ease: 'linear' }}
              />
            ))}

            {/* Open bouquet */}
            <div className="relative w-80 h-96 mx-auto mb-4">
              <svg width="320" height="400" className="absolute inset-0">
                <path d="M50 180 L160 380 L270 180 Z" fill={bouquet.wrapColor} />
                <path d="M50 180 Q160 160 270 180" fill={bouquet.wrapColor} />
              </svg>
              {bouquet.flowers.map((flower, i) => {
                const pos = getFlowerPosition(i, bouquet.flowers.length);
                return (
                  <motion.div
                    key={flower.id}
                    className="absolute cursor-pointer"
                    style={{ left: pos.x - 22, top: pos.y - 30 }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.6, type: 'spring' }}
                    onClick={() => flower.memory && setSelectedFlower(flower)}
                  >
                    <FlowerSVG type={flower.type} color={flower.color} size={42} />
                    {flower.memory && (
                      <motion.span
                        className="absolute -top-1 -right-1 text-xs"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        💌
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
              {/* Ribbon */}
              {bouquet.ribbonStyle !== 'none' && (
                <motion.div
                  className="absolute"
                  style={{ left: 120, top: 175 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <svg width="80" height="40">
                    <ellipse cx="25" cy="18" rx="20" ry="12" fill={bouquet.ribbonColor} opacity="0.8" transform="rotate(-15 25 18)" />
                    <ellipse cx="55" cy="18" rx="20" ry="12" fill={bouquet.ribbonColor} opacity="0.8" transform="rotate(15 55 18)" />
                    <circle cx="40" cy="18" r="6" fill={bouquet.ribbonColor} />
                  </svg>
                </motion.div>
              )}
            </div>

            {/* Message card slides in */}
            <motion.div
              className="w-72 mx-auto rounded-xl shadow-xl p-8 border-2 mb-6"
              style={{
                backgroundColor: theme.bg,
                borderColor: theme.border,
                fontFamily: bouquet.messageCard.fontStyle,
              }}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
            >
              {bouquet.recipientName && (
                <p className="text-sm mb-2 opacity-70" style={{ color: theme.text }}>
                  Dear {bouquet.recipientName},
                </p>
              )}
              <p className="text-lg leading-relaxed whitespace-pre-wrap" style={{ color: theme.text }}>
                {bouquet.messageCard.message}
              </p>
              {bouquet.senderName && (
                <p className="text-sm mt-4 text-right opacity-70" style={{ color: theme.text }}>
                  — {bouquet.senderName}
                </p>
              )}
            </motion.div>

            {/* Memory popup */}
            <AnimatePresence>
              {selectedFlower && selectedFlower.memory && (
                <motion.div
                  className="fixed inset-0 bg-foreground/30 flex items-center justify-center z-50 px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedFlower(null)}
                >
                  <motion.div
                    className="bg-card rounded-2xl shadow-2xl p-6 max-w-xs w-full border border-border"
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 20 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex justify-center mb-3">
                      <FlowerSVG type={selectedFlower.type} color={selectedFlower.color} size={40} />
                    </div>
                    <p className="text-foreground font-body text-center">{selectedFlower.memory.content}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-4 w-full text-muted-foreground font-body"
                      onClick={() => setSelectedFlower(null)}
                    >
                      Close
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground rounded-full px-8 shadow-lg shadow-primary/20 font-body"
                onClick={() => navigate('/')}
              >
                <Heart className="w-4 h-4 mr-2" />
                Create a bouquet for someone you love
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewBouquetPage;
