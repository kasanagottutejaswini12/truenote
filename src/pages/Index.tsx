import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, Lock, Clock, Send, Download } from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'Beautiful Messages', desc: 'Create personalized messages with themes and animations' },
  { icon: Sparkles, title: 'Reveal Animations', desc: 'Envelope, typing, scratch, card flip, and more' },
  { icon: Lock, title: 'Password Protection', desc: 'Keep messages private with secret codes' },
  { icon: Clock, title: 'Countdown & Scheduling', desc: 'Set messages to unlock at the perfect moment' },
  { icon: Send, title: 'Easy Sharing', desc: 'Share via link, WhatsApp, or any messaging app' },
  { icon: Download, title: 'Download Cards', desc: 'Save your message as a beautiful image' },
];

const IndexPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="font-display text-lg font-bold text-foreground">✉️ MessageMagic</h2>
          <ThemeToggle />
        </div>

        <div className="flex flex-col items-center text-center px-6 pt-12 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-6xl mb-6">💌</div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
              Turn Messages Into<br />
              <span className="text-primary">Magical Moments</span>
            </h1>
            <p className="text-lg text-muted-foreground font-body max-w-md mx-auto mb-8">
              Create interactive, animated messages that surprise and delight. Add countdowns, passwords, and beautiful reveal animations.
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground rounded-full px-10 py-6 text-lg font-body shadow-lg shadow-primary/20"
              onClick={() => navigate('/create')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create a Message
            </Button>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="bg-card rounded-xl p-5 border border-border/50 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <f.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-body font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
