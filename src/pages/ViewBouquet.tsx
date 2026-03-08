import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BouquetData, FlowerItem, ArrangementStyle } from '@/context/BouquetContext';
import FlowerSVG from '@/components/FlowerSVG';
import Confetti from '@/components/Confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, VolumeX } from 'lucide-react';
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

// Generate a simple ambient tone using Web Audio API
const createAmbientMusic = () => {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = 0.08;
    gain.connect(ctx.destination);

    // Create gentle chord
    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C major chord
    const oscillators = frequencies.map(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.03;
      osc.connect(oscGain);
      oscGain.connect(gain);
      return osc;
    });

    // Fade in
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);

    oscillators.forEach(osc => osc.start());

    return {
      stop: () => {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        setTimeout(() => {
          oscillators.forEach(osc => osc.stop());
          ctx.close();
        }, 1200);
      }
    };
  } catch {
    return null;
  }
};

const ViewBouquetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedFlower, setSelectedFlower] = useState<FlowerItem | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const musicRef = useRef<{ stop: () => void } | null>(null);

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
    [...Array(24)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 5 + Math.random() * 4,
      size: 5 + Math.random() * 12,
      color: ['bg-primary/15', 'bg-petal/20', 'bg-peach/20', 'bg-lavender/15'][i % 4],
    })), []);

  // Cleanup music on unmount
  useEffect(() => {
    return () => {
      musicRef.current?.stop();
    };
  }, []);

  const handleOpen = () => {
    setStep(2);
    // Trigger confetti after card appears
    setTimeout(() => setShowConfetti(true), 1500);
    // Start music if enabled
    if (bouquet?.enableMusic) {
      const music = createAmbientMusic();
      if (music) {
        musicRef.current = music;
        setMusicPlaying(true);
      }
    }
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      musicRef.current?.stop();
      musicRef.current = null;
      setMusicPlaying(false);
    } else {
      const music = createAmbientMusic();
      if (music) {
        musicRef.current = music;
        setMusicPlaying(true);
      }
    }
  };

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

  const seeded = (i: number, mod: number) => ((i * 7 + 3) % mod) - mod / 2;

  const getFlowerPosition = (index: number, total: number) => {
    const cx = 160;
    const baseY = 110;
    const arrangement = bouquet.arrangementStyle || 'round';
    const rot = seeded(index, 13) * 1.5;

    switch (arrangement) {
      case 'round': {
        if (total === 1) return { x: cx, y: baseY, rotation: rot };
        const ring = index < Math.min(total, 6) ? 0 : 1;
        const ringItems = ring === 0 ? Math.min(total, 6) : total - 6;
        const ringIndex = ring === 0 ? index : index - 6;
        const ringAngle = (ringIndex / ringItems) * Math.PI * 2 - Math.PI / 2;
        const radius = 26 + ring * 24;
        return { x: cx + Math.cos(ringAngle) * radius + seeded(index, 9), y: baseY + Math.sin(ringAngle) * radius * 0.6 + seeded(index + 3, 7), rotation: rot };
      }
      case 'hand-tied': {
        const fanAngle = total > 1 ? ((index / (total - 1)) - 0.5) * 1.2 : 0;
        return { x: cx + fanAngle * 76 + seeded(index, 11), y: baseY - Math.abs(fanAngle) * 30 + seeded(index + 2, 9), rotation: fanAngle * 15 + rot };
      }
      case 'cascade': {
        const col = index % 3;
        const row = Math.floor(index / 3);
        return { x: cx + (col - 1) * 36 + seeded(index, 11), y: baseY + row * 32 - 20 + seeded(index + 1, 7), rotation: (col - 1) * 8 + rot };
      }
      case 'wild-garden':
        return { x: cx + seeded(index * 3, 23) * 3.5, y: baseY + seeded(index * 5, 19) * 2.5, rotation: seeded(index * 11, 31) * 3 };
      default: {
        const cols = Math.min(total, 4);
        const row = Math.floor(index / cols);
        const col = index % cols;
        const itemsInRow = Math.min(cols, total - row * cols);
        return { x: cx - (itemsInRow - 1) * 22 + col * 44 + seeded(index, 11), y: baseY - row * 40 + (col % 2) * 12 + seeded(index + 5, 9), rotation: rot };
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <Confetti show={showConfetti} />

      {/* Music control */}
      {step === 2 && bouquet.enableMusic && (
        <motion.button
          className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={toggleMusic}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          title={musicPlaying ? 'Mute music' : 'Play music'}
        >
          {musicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </motion.button>
      )}

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
              <Heart className="w-14 h-14 text-primary mx-auto" fill="hsl(var(--primary))" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Someone sent you<br />a digital bouquet
            </h1>
            {bouquet.recipientName && (
              <p className="text-lg text-muted-foreground font-body mb-6">
                For you, <span className="text-primary font-semibold">{bouquet.recipientName}</span> 💕
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
            onClick={handleOpen}
          >
            <div className="relative w-80 h-[420px] mx-auto">
              <svg width="320" height="420" className="mx-auto">
                <defs>
                  <linearGradient id="closedWrapGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={wLight} />
                    <stop offset="50%" stopColor={wc} />
                    <stop offset="100%" stopColor={wDark} />
                  </linearGradient>
                  <filter id="softShadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
                  </filter>
                </defs>
                {/* Shadow layer */}
                <path d="M52 115 Q160 85 268 115 L160 395 Z" fill={wLight} opacity="0.3" />
                {/* Main wrap */}
                <path d="M58 120 Q160 95 262 120 L160 390 Z" fill="url(#closedWrapGrad)" filter="url(#softShadow)" />
                {/* Fold details */}
                <path d="M70 140 Q160 125 250 140" fill="none" stroke={wDark} strokeWidth="0.8" opacity="0.2" />
                <path d="M85 170 Q160 162 235 170" fill="none" stroke={wDark} strokeWidth="0.6" opacity="0.12" />
                {/* Crease lines */}
                <path d="M70 135 L140 350" stroke={wDark} strokeWidth="0.5" opacity="0.08" fill="none" />
                <path d="M250 135 L180 350" stroke={wDark} strokeWidth="0.5" opacity="0.08" fill="none" />
                {/* Top fold */}
                <path d="M58 120 Q100 108 130 118 Q140 100 160 95 Q180 100 190 118 Q220 108 262 120"
                  fill={wc} stroke={wDark} strokeWidth="0.5" opacity="0.85" />
                {/* Tissue paper peek */}
                <path d="M90 112 Q120 95 140 108 Q160 90 180 108 Q200 95 230 112" fill="white" opacity="0.3" />
                {/* Peek of flowers */}
                {bouquet.flowers.slice(0, 5).map((f, i) => {
                  const cx = 100 + i * 30;
                  const cy = 95 + (i % 2) * 8;
                  return (
                    <g key={f.id}>
                      <circle cx={cx} cy={cy} r={12} fill={f.color} opacity="0.5" />
                      <circle cx={cx} cy={cy - 3} r={7} fill={lighten(f.color, 30)} opacity="0.35" />
                    </g>
                  );
                })}
                {/* Ribbon */}
                {bouquet.ribbonStyle !== 'none' && (
                  <>
                    <ellipse cx="138" cy="178" rx="24" ry="14" fill={bouquet.ribbonColor} opacity="0.7" transform="rotate(-16 138 178)" />
                    <ellipse cx="182" cy="178" rx="24" ry="14" fill={bouquet.ribbonColor} opacity="0.7" transform="rotate(16 182 178)" />
                    <circle cx="160" cy="178" r="8" fill={darken(bouquet.ribbonColor, 20)} opacity="0.85" />
                    {/* Ribbon tails */}
                    <path d="M160 188 Q150 210 142 225" stroke={bouquet.ribbonColor} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
                    <path d="M160 188 Q170 210 178 225" stroke={bouquet.ribbonColor} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
                  </>
                )}
              </svg>
            </div>
            <motion.p
              className="text-muted-foreground font-body mt-3 text-lg"
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
            className="text-center z-10 w-full max-w-md pb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Falling petals */}
            {petals.map(petal => (
              <motion.div
                key={petal.id}
                className={`absolute ${petal.color}`}
                style={{
                  left: `${petal.left}%`,
                  width: petal.size,
                  height: petal.size,
                  top: -20,
                  borderRadius: '50% 0 50% 50%',
                }}
                animate={{
                  y: [0, window.innerHeight + 50],
                  rotate: [0, 720],
                  x: [(Math.random() - 0.5) * 120],
                }}
                transition={{
                  duration: petal.duration,
                  delay: petal.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}

            {/* Open bouquet */}
            <div className="relative w-80 h-[480px] mx-auto mb-4">
              <svg width="320" height="480" className="absolute inset-0">
                <defs>
                  <linearGradient id="openWrapGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={wLight} />
                    <stop offset="50%" stopColor={wc} />
                    <stop offset="100%" stopColor={wDark} />
                  </linearGradient>
                  <filter id="openShadow">
                    <feDropShadow dx="0" dy="3" stdDeviation="6" floodOpacity="0.12" />
                  </filter>
                </defs>

                {/* Stems */}
                {bouquet.flowers.map((_, i) => {
                  const total = bouquet.flowers.length;
                  const spread = Math.min(total, 5) * 4;
                  const offset = total > 1 ? ((i / (total - 1)) - 0.5) * spread : 0;
                  return (
                    <path key={`s-${i}`}
                      d={`M${160 + offset} 240 Q${160 + offset * 1.5} 310 ${160 + offset * 0.3} 380`}
                      stroke={i % 2 === 0 ? '#5a8a4a' : '#7ab368'} strokeWidth="2" fill="none" opacity="0.45" strokeLinecap="round"
                    />
                  );
                })}

                {/* Background layer */}
                <motion.path
                  d="M38 175 Q160 152 282 175 L160 355 Z"
                  fill={wLight} opacity="0.25"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.25 }}
                  transition={{ delay: 0.2 }}
                />
                {/* Main wrap - animated open */}
                <motion.path
                  d="M45 180 Q160 158 275 180 L160 352 Z"
                  fill="url(#openWrapGrad)"
                  filter="url(#openShadow)"
                  initial={{ d: "M58 120 Q160 95 262 120 L160 390 Z" }}
                  animate={{ d: "M45 180 Q160 158 275 180 L160 352 Z" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                {/* Paper edge folds */}
                <path d="M45 180 Q63 174 75 182" fill={wLight} opacity="0.45" stroke={wDark} strokeWidth="0.4" />
                <path d="M275 180 Q257 174 245 182" fill={wLight} opacity="0.45" stroke={wDark} strokeWidth="0.4" />
                {/* Fold details */}
                <path d="M58 198 Q160 184 262 198" fill="none" stroke={wDark} strokeWidth="0.6" opacity="0.12" />
                <path d="M62 202 L148 320" stroke={wDark} strokeWidth="0.4" opacity="0.06" fill="none" />
                <path d="M258 202 L172 320" stroke={wDark} strokeWidth="0.4" opacity="0.06" fill="none" />

                {/* Handle */}
                <path d="M132 345 Q129 395 134 440 L186 440 Q191 395 188 345 Z" fill={wc} opacity="0.85" />
                <path d="M136 350 L138 435" stroke={wDark} strokeWidth="0.5" opacity="0.12" fill="none" />
                <path d="M184 350 L182 435" stroke={wDark} strokeWidth="0.5" opacity="0.12" fill="none" />
                {/* Ribbon on handle */}
                {bouquet.ribbonStyle !== 'none' && (
                  <>
                    <rect x="128" y="362" width="64" height="8" rx="4" fill={bouquet.ribbonColor} opacity="0.7" />
                    <rect x="128" y="363" width="64" height="2" fill={lighten(bouquet.ribbonColor, 30)} opacity="0.3" />
                    {bouquet.ribbonStyle === 'bow' && (
                      <>
                        <ellipse cx="150" cy="360" rx="12" ry="7" fill={bouquet.ribbonColor} opacity="0.6" transform="rotate(-15 150 360)" />
                        <ellipse cx="170" cy="360" rx="12" ry="7" fill={bouquet.ribbonColor} opacity="0.6" transform="rotate(15 170 360)" />
                        <circle cx="160" cy="361" r="4" fill={darken(bouquet.ribbonColor, 20)} opacity="0.75" />
                      </>
                    )}
                  </>
                )}
              </svg>

              {/* Flowers */}
              {bouquet.flowers.map((flower, i) => {
                const pos = getFlowerPosition(i, bouquet.flowers.length);
                const flowerSize = 36 + ((i * 7 + 3) % 12);
                return (
                  <motion.div
                    key={flower.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: pos.x - flowerSize / 2,
                      top: pos.y - flowerSize * 0.6,
                      zIndex: 10 + i,
                      transform: `rotate(${pos.rotation || 0}deg)`,
                    }}
                    initial={{ scale: 0, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.7, type: 'spring', bounce: 0.4 }}
                    onClick={() => flower.memory && setSelectedFlower(flower)}
                    whileHover={flower.memory ? { scale: 1.15 } : {}}
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

              {/* Ribbon on wrap */}
              {bouquet.ribbonStyle !== 'none' && (
                <motion.div
                  className="absolute"
                  style={{ left: 100, top: 175, zIndex: 20 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                >
                  <svg width="120" height="55">
                    <ellipse cx="32" cy="22" rx="26" ry="15" fill={bouquet.ribbonColor} opacity="0.72" transform="rotate(-18 32 22)" />
                    <ellipse cx="88" cy="22" rx="26" ry="15" fill={bouquet.ribbonColor} opacity="0.72" transform="rotate(18 88 22)" />
                    <circle cx="60" cy="22" r="8" fill={darken(bouquet.ribbonColor, 20)} />
                    <path d="M60 32 Q48 44 42 52" stroke={bouquet.ribbonColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M60 32 Q72 44 78 52" stroke={bouquet.ribbonColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </motion.div>
              )}
            </div>

            {/* Message card */}
            <motion.div
              className="w-72 mx-auto rounded-xl shadow-2xl p-8 border-2 mb-8 relative overflow-hidden"
              style={{
                backgroundColor: theme.bg,
                borderColor: theme.border,
                fontFamily: bouquet.messageCard.fontStyle,
              }}
              initial={{ opacity: 0, y: 60, scale: 0.6, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{ delay: 1.5, duration: 1, type: 'spring' }}
            >
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-12 h-12 opacity-15" style={{ borderBottom: `2px solid ${theme.border}`, borderRight: `2px solid ${theme.border}`, borderRadius: '0 0 100% 0' }} />
              <div className="absolute bottom-0 right-0 w-12 h-12 opacity-15" style={{ borderTop: `2px solid ${theme.border}`, borderLeft: `2px solid ${theme.border}`, borderRadius: '100% 0 0 0' }} />
              <div className="absolute top-0 right-0 w-12 h-12 opacity-10" style={{ borderBottom: `2px solid ${theme.border}`, borderLeft: `2px solid ${theme.border}`, borderRadius: '0 0 0 100%' }} />
              <div className="absolute bottom-0 left-0 w-12 h-12 opacity-10" style={{ borderTop: `2px solid ${theme.border}`, borderRight: `2px solid ${theme.border}`, borderRadius: '0 100% 0 0' }} />

              {bouquet.recipientName && (
                <p className="text-sm mb-3 opacity-70" style={{ color: theme.text }}>
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

            {/* Memory tap hint */}
            {bouquet.flowers.some(f => f.memory) && (
              <motion.p
                className="text-sm text-muted-foreground font-body mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
              >
                💌 Tap flowers with memories to reveal hidden messages
              </motion.p>
            )}

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
                    initial={{ scale: 0.7, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.7, y: 30 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex justify-center mb-4">
                      <FlowerSVG type={selectedFlower.type} color={selectedFlower.color} size={55} />
                    </div>
                    <p className="text-foreground font-body text-center text-lg leading-relaxed">
                      {selectedFlower.memory.content}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-5 w-full text-muted-foreground font-body"
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
              transition={{ delay: 3 }}
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
