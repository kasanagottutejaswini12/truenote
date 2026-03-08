import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlowerSVG from '@/components/FlowerSVG';
import ThemeToggle from '@/components/ThemeToggle';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const floatingFlowers = [
    { type: 'rose' as const, color: '#e8a0b4', x: 8, delay: 0 },
    { type: 'tulip' as const, color: '#f0c4d4', x: 78, delay: 1.5 },
    { type: 'daisy' as const, color: '#ffffff', x: 90, delay: 3 },
    { type: 'peony' as const, color: '#d4829a', x: 20, delay: 4 },
    { type: 'lavender' as const, color: '#9b7ec8', x: 55, delay: 2 },
    { type: 'lily' as const, color: '#f5e6d0', x: 65, delay: 5 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 overflow-hidden relative">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Floating flowers */}
      {floatingFlowers.map((f, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none opacity-40"
          style={{ left: `${f.x}%`, top: `-10%` }}
          animate={{
            y: ['0vh', '115vh'],
            rotate: [0, 180],
            x: [(Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: 12 + Math.random() * 5,
            repeat: Infinity,
            delay: f.delay,
            ease: 'linear',
          }}
        >
          <FlowerSVG type={f.type} color={f.color} size={24} />
        </motion.div>
      ))}

      {/* Soft petal particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute bg-primary/8"
          style={{
            width: 6 + Math.random() * 14,
            height: 6 + Math.random() * 14,
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            borderRadius: '50% 0 50% 50%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() - 0.5) * 80],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'linear',
          }}
        />
      ))}

      <motion.div
        className="text-center z-10 max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero flower arrangement */}
        <motion.div
          className="mb-8 flex items-end justify-center gap-0.5"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <FlowerSVG type="tulip" color="#f0c4d4" size={30} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <FlowerSVG type="rose" color="#d4627a" size={42} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <FlowerSVG type="peony" color="#e8a0b4" size={36} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <FlowerSVG type="lavender" color="#9b7ec8" size={32} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <FlowerSVG type="daisy" color="#ffffff" size={28} />
          </motion.div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
          Send a Digital<br />
          <span className="text-primary">Bouquet</span>
        </h1>

        <p className="text-muted-foreground font-body text-lg mb-8 leading-relaxed max-w-md mx-auto">
          Create a beautiful virtual bouquet with a hidden message card.
          Share it with someone special and watch them bloom with joy.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-body font-semibold shadow-lg shadow-primary/20"
            onClick={() => navigate('/create')}
          >
            <Heart className="w-5 h-5 mr-2" />
            Create a Bouquet
          </Button>
        </div>

        <motion.div
          className="mt-8 flex items-center justify-center gap-6 text-muted-foreground/50 text-xs font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Beautiful animations
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" /> Memory flowers
          </span>
          <span className="flex items-center gap-1">
            <Send className="w-3 h-3" /> Free to share
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
