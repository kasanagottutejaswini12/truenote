import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BouquetData, FlowerItem } from '@/context/BouquetContext';
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

const darken = (hex: string, amount: number) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

const lighten = (hex: string, amount: number) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

const ViewBouquetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
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
    [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 5 + Math.random() * 4,
      size: 6 + Math.random() * 14,
      color: i % 3 === 0 ? 'bg-primary/15' : i % 3 === 1 ? 'bg-petal/20' : 'bg-peach/25',
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

  const wc = bouquet.wrapColor;
  const wDark = darken(wc, 25);
  const wLight = lighten(wc, 25);

  const getFlowerPosition = (index: number, total: number) => {
    const cx = 160;
    const baseY = 125;
    const cols = Math.min(total, 4);
    const row = Math.floor(index / cols);
    const col = index % cols;
    const itemsInRow = Math.min(cols, total - row * cols);
    const offsetX = ((index * 7 + 3) % 11 - 5);
    const offsetY = ((index * 13 + 5) % 9 - 4);
    return {
      x: cx - (itemsInRow - 1) * 22 + col * 44 + offsetX,
      y: baseY - row * 40 + (col % 2) * 12 + offsetY,
    };
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
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
              {/* Aesthetic closed bouquet */}
              <svg width="320" height="400" className="mx-auto">
                <defs>
                  <linearGradient id="closedWrapGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={wLight} />
                    <stop offset="50%" stopColor={wc} />
                    <stop offset="100%" stopColor={wDark} />
                  </linearGradient>
                </defs>
                {/* Background layer for Korean style */}
                <path d="M52 115 Q160 85 268 115 L160 385 Z" fill={wLight} opacity="0.4" />
                {/* Main wrap */}
                <path d="M58 120 Q160 95 262 120 L160 380 Z" fill="url(#closedWrapGrad)" />
                {/* Fold lines */}
                <path d="M70 140 Q160 125 250 140" fill="none" stroke={wDark} strokeWidth="0.8" opacity="0.2" />
                <path d="M90 180 Q160 170 230 180" fill="none" stroke={wDark} strokeWidth="0.6" opacity="0.15" />
                {/* Crease lines */}
                <path d="M70 135 L140 340" stroke={wDark} strokeWidth="0.5" opacity="0.1" fill="none" />
                <path d="M250 135 L180 340" stroke={wDark} strokeWidth="0.5" opacity="0.1" fill="none" />
                {/* Top fold */}
                <path d="M58 120 Q100 108 130 118 Q140 100 160 95 Q180 100 190 118 Q220 108 262 120"
                  fill={wc} stroke={wDark} strokeWidth="0.5" opacity="0.85" />
                {/* Peek of flowers */}
                {bouquet.flowers.slice(0, 4).map((f, i) => (
                  <g key={f.id}>
                    <circle cx={115 + i * 30} cy={100} r={14} fill={f.color} opacity="0.6" />
                    <circle cx={115 + i * 30} cy={98} r={8} fill={lighten(f.color, 30)} opacity="0.4" />
                  </g>
                ))}
                {/* Ribbon */}
                {bouquet.ribbonStyle !== 'none' && (
                  <>
                    <ellipse cx="140" cy="175" rx="22" ry="13" fill={bouquet.ribbonColor} opacity="0.7" transform="rotate(-15 140 175)" />
                    <ellipse cx="180" cy="175" rx="22" ry="13" fill={bouquet.ribbonColor} opacity="0.7" transform="rotate(15 180 175)" />
                    <circle cx="160" cy="175" r="7" fill={darken(bouquet.ribbonColor, 20)} opacity="0.8" />
                  </>
                )}
              </svg>
            </div>
            <motion.p
              className="text-muted-foreground font-body mt-2 text-lg"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
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
                className={`absolute rounded-full ${petal.color}`}
                style={{ left: `${petal.left}%`, width: petal.size, height: petal.size, top: -20, borderRadius: '50% 0 50% 50%' }}
                animate={{ y: [0, window.innerHeight + 50], rotate: [0, 720], x: [(Math.random() - 0.5) * 120] }}
                transition={{ duration: petal.duration, delay: petal.delay, repeat: Infinity, ease: 'linear' }}
              />
            ))}

            {/* Open bouquet */}
            <div className="relative w-80 h-96 mx-auto mb-4">
              <svg width="320" height="400" className="absolute inset-0">
                <defs>
                  <linearGradient id="openWrapGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={wLight} />
                    <stop offset="50%" stopColor={wc} />
                    <stop offset="100%" stopColor={wDark} />
                  </linearGradient>
                </defs>
                {/* Background layer */}
                <motion.path
                  d="M40 175 Q160 155 280 175 L160 385 Z"
                  fill={wLight} opacity="0.3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 0.2 }}
                />
                {/* Main wrap */}
                <motion.path
                  d="M48 180 Q160 160 272 180 L160 380 Z"
                  fill="url(#openWrapGrad)"
                  initial={{ d: "M58 120 Q160 95 262 120 L160 380 Z" }}
                  animate={{ d: "M48 180 Q160 160 272 180 L160 380 Z" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                {/* Fold details */}
                <path d="M60 195 Q160 182 260 195" fill="none" stroke={wDark} strokeWidth="0.7" opacity="0.15" />
                <path d="M65 200 L145 345" stroke={wDark} strokeWidth="0.5" opacity="0.08" fill="none" />
                <path d="M255 200 L175 345" stroke={wDark} strokeWidth="0.5" opacity="0.08" fill="none" />
              </svg>

              {/* Flowers with spring animation */}
              {bouquet.flowers.map((flower, i) => {
                const pos = getFlowerPosition(i, bouquet.flowers.length);
                const flowerSize = 38 + ((i * 7 + 3) % 10);
                return (
                  <motion.div
                    key={flower.id}
                    className="absolute cursor-pointer"
                    style={{ left: pos.x - flowerSize / 2, top: pos.y - flowerSize * 0.6, zIndex: 10 + i }}
                    initial={{ scale: 0, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.7, type: 'spring', bounce: 0.4 }}
                    onClick={() => flower.memory && setSelectedFlower(flower)}
                  >
                    <FlowerSVG type={flower.type} color={flower.color} size={flowerSize} />
                    {flower.memory && (
                      <motion.span
                        className="absolute -top-1 -right-1 text-xs"
                        animate={{ scale: [1, 1.3, 1] }}
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
                  style={{ left: 105, top: 175, zIndex: 20 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                >
                  <svg width="110" height="50">
                    <ellipse cx="30" cy="20" rx="24" ry="14" fill={bouquet.ribbonColor} opacity="0.75" transform="rotate(-18 30 20)" />
                    <ellipse cx="80" cy="20" rx="24" ry="14" fill={bouquet.ribbonColor} opacity="0.75" transform="rotate(18 80 20)" />
                    <circle cx="55" cy="20" r="7" fill={darken(bouquet.ribbonColor, 20)} />
                    <path d="M55 28 Q45 40 38 48" stroke={bouquet.ribbonColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M55 28 Q65 40 72 48" stroke={bouquet.ribbonColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </motion.div>
              )}
            </div>

            {/* Message card slides in */}
            <motion.div
              className="w-72 mx-auto rounded-xl shadow-2xl p-8 border-2 mb-6 relative overflow-hidden"
              style={{
                backgroundColor: theme.bg,
                borderColor: theme.border,
                fontFamily: bouquet.messageCard.fontStyle,
              }}
              initial={{ opacity: 0, y: 50, scale: 0.7, rotateX: 15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{ delay: 1.4, duration: 1, type: 'spring' }}
            >
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-10 h-10 opacity-15" style={{ borderBottom: `2px solid ${theme.border}`, borderRight: `2px solid ${theme.border}`, borderRadius: '0 0 100% 0' }} />
              <div className="absolute bottom-0 right-0 w-10 h-10 opacity-15" style={{ borderTop: `2px solid ${theme.border}`, borderLeft: `2px solid ${theme.border}`, borderRadius: '100% 0 0 0' }} />

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
                  className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
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
                      <FlowerSVG type={selectedFlower.type} color={selectedFlower.color} size={50} />
                    </div>
                    <p className="text-foreground font-body text-center text-lg">{selectedFlower.memory.content}</p>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
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
