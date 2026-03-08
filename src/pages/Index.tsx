import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, Lock, Clock, Send, Download, LayoutDashboard, Zap, Shield, QrCode } from 'lucide-react';

const features = [
  { icon: Sparkles, title: 'Reveal Animations', desc: 'Envelope, typing, scratch, card flip — surprise and delight.' },
  { icon: Lock, title: 'Password Protected', desc: 'Keep messages private with secret codes.' },
  { icon: Clock, title: 'Scheduled Unlock', desc: 'Set messages to reveal at the perfect moment.' },
  { icon: Zap, title: 'AI Message Writer', desc: 'Generate heartfelt messages with AI assistance.' },
  { icon: QrCode, title: 'QR Code Sharing', desc: 'Share messages instantly with scannable QR codes.' },
  { icon: Shield, title: 'One-Time Secrets', desc: 'Messages that disappear after being read once.' },
];

const IndexPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 dot-pattern opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full gradient-subtle opacity-60 blur-3xl" />
      
      {/* Floating particles */}
      <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-primary/20 animate-float-particle" />
      <div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-primary/15 animate-float-particle" style={{ animationDelay: '1s' }} />
      <div className="absolute top-60 left-[60%] w-1.5 h-1.5 rounded-full bg-primary/25 animate-float-particle" style={{ animationDelay: '2s' }} />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-body text-lg font-bold text-foreground tracking-tight">MessageMagic</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="font-body text-muted-foreground hover:text-foreground rounded-full" onClick={() => navigate('/dashboard')}>
              <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
            </Button>
            <ThemeToggle />
          </div>
        </nav>

        {/* Hero */}
        <div className="flex flex-col items-center text-center px-6 pt-16 pb-20 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-body font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Create magical message experiences
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Turn Messages Into{' '}
            <span className="gradient-text">Moments</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground font-body max-w-lg mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Create interactive, animated messages with countdowns, passwords, and beautiful reveal animations. Share unforgettable digital experiences.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="gradient-primary text-white rounded-full px-8 py-6 text-base font-body font-semibold shadow-glow hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] border-0"
              onClick={() => navigate('/create')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create a Message
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 text-base font-body font-medium border-border hover:bg-secondary transition-all duration-300"
              onClick={() => navigate('/dashboard')}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              My Messages
            </Button>
          </motion.div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto px-6 pb-24">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">Everything you need</h2>
            <p className="text-muted-foreground font-body">Powerful features to make every message special</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft card-hover group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <div className="w-10 h-10 rounded-xl gradient-subtle flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-body font-semibold text-foreground mb-1.5 text-base">{f.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
