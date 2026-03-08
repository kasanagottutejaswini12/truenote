import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Flower2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 overflow-hidden relative">
      {/* Floating petals background */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/10"
          style={{
            width: 10 + Math.random() * 20,
            height: 10 + Math.random() * 20,
            left: `${Math.random() * 100}%`,
            top: `-5%`,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() - 0.5) * 100],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.8,
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
        <motion.div
          className="mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Flower2 className="w-16 h-16 text-primary mx-auto" strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
          Send a Digital<br />
          <span className="text-primary">Bouquet</span>
        </h1>

        <p className="text-muted-foreground font-body text-lg mb-8 leading-relaxed">
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

        <motion.p
          className="mt-12 text-muted-foreground/60 text-sm font-body flex items-center justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Send className="w-3 h-3" />
          Free to create &amp; share
        </motion.p>
      </motion.div>
    </div>
  );
};

export default HomePage;
