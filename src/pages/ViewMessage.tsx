import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { themes, type ThemeId, type RevealStyle, type AnimationEffect } from '@/lib/message-types';
import AnimationEffects from '@/components/AnimationEffects';
import MessageReactions from '@/components/MessageReactions';
import TapReveal from '@/components/reveals/TapReveal';
import TypingReveal from '@/components/reveals/TypingReveal';
import EnvelopeReveal from '@/components/reveals/EnvelopeReveal';
import CardFlipReveal from '@/components/reveals/CardFlipReveal';
import ScratchReveal from '@/components/reveals/ScratchReveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, VolumeX, Download } from 'lucide-react';

interface MessageRow {
  id: string;
  slug: string;
  title: string;
  content: string;
  sender_name: string | null;
  recipient_name: string | null;
  occasion: string | null;
  theme: string | null;
  reveal_style: string | null;
  animation_effect: string | null;
  font_style: string | null;
  accent_color: string | null;
  background_color: string | null;
  password: string | null;
  scheduled_at: string | null;
  countdown_enabled: boolean | null;
  enable_music: boolean | null;
  is_one_time: boolean | null;
  is_expired: boolean | null;
  opened_at: string | null;
}

const createAmbientMusic = () => {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    const freqs = [261.63, 329.63, 392.00, 523.25];
    const oscs = freqs.map(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.025;
      osc.connect(g);
      g.connect(gain);
      return osc;
    });
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
    oscs.forEach(o => o.start());
    return {
      stop: () => {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        setTimeout(() => { oscs.forEach(o => o.stop()); ctx.close(); }, 1200);
      },
    };
  } catch { return null; }
};

const ViewMessagePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [msg, setMsg] = useState<MessageRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'welcome' | 'password' | 'countdown' | 'reveal' | 'done' | 'expired'>('welcome');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [countdown, setCountdown] = useState('');
  const musicRef = useRef<{ stop: () => void } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const { data, error } = await supabase.from('messages').select('*').eq('slug', slug).single();
      if (error || !data) { setLoading(false); return; }
      const row = data as MessageRow;
      
      // Check if one-time message is expired
      if (row.is_one_time && row.is_expired) {
        setMsg(row);
        setStep('expired');
        setLoading(false);
        return;
      }
      
      setMsg(row);
      setLoading(false);
    };
    load();
  }, [slug]);

  useEffect(() => {
    return () => { musicRef.current?.stop(); };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (step !== 'countdown' || !msg?.scheduled_at) return;
    const interval = setInterval(() => {
      const diff = new Date(msg.scheduled_at!).getTime() - Date.now();
      if (diff <= 0) {
        setStep('reveal');
        clearInterval(interval);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${d > 0 ? d + 'd ' : ''}${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, msg?.scheduled_at]);

  const handleContinue = () => {
    if (!msg) return;
    if (msg.password) { setStep('password'); return; }
    if (msg.countdown_enabled && msg.scheduled_at && new Date(msg.scheduled_at).getTime() > Date.now()) {
      setStep('countdown'); return;
    }
    setStep('reveal');
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === msg?.password) {
      if (msg.countdown_enabled && msg.scheduled_at && new Date(msg.scheduled_at).getTime() > Date.now()) {
        setStep('countdown');
      } else {
        setStep('reveal');
      }
    } else {
      setPasswordError(true);
    }
  };

  const handleRevealed = useCallback(async () => {
    setShowEffects(true);
    setStep('done');
    if (msg?.enable_music) {
      const music = createAmbientMusic();
      if (music) { musicRef.current = music; setMusicPlaying(true); }
    }
    // Mark as opened and handle one-time expiry
    if (msg?.id) {
      const updates: any = {};
      if (!msg.opened_at) updates.opened_at = new Date().toISOString();
      if (msg.is_one_time) updates.is_expired = true;
      if (Object.keys(updates).length > 0) {
        await supabase.from('messages').update(updates).eq('id', msg.id);
      }
    }
  }, [msg]);

  const toggleMusic = () => {
    if (musicPlaying) { musicRef.current?.stop(); musicRef.current = null; setMusicPlaying(false); }
    else { const m = createAmbientMusic(); if (m) { musicRef.current = m; setMusicPlaying(true); } }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
      const link = document.createElement('a');
      link.download = `message-${slug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      const c = document.createElement('canvas');
      c.width = 600; c.height = 400;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = theme.cardBg;
      ctx.fillRect(0, 0, 600, 400);
      ctx.fillStyle = theme.textColor;
      ctx.font = '24px Quicksand';
      ctx.textAlign = 'center';
      if (msg?.title) ctx.fillText(msg.title, 300, 120);
      ctx.font = '18px Quicksand';
      const words = (msg?.content || '').split(' ');
      let line = '', y = 180;
      words.forEach(w => {
        if (ctx.measureText(line + w).width > 500) { ctx.fillText(line, 300, y); y += 28; line = ''; }
        line += w + ' ';
      });
      ctx.fillText(line, 300, y);
      const link = document.createElement('a');
      link.download = `message-${slug}.png`;
      link.href = c.toDataURL('image/png');
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </motion.div>
      </div>
    );
  }

  if (!msg) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center font-body">
          <p className="text-xl text-foreground mb-4">Message not found 😔</p>
          <Button onClick={() => navigate('/')} className="bg-primary text-primary-foreground rounded-full">Create Your Own</Button>
        </div>
      </div>
    );
  }

  if (step === 'expired') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center font-body max-w-sm">
          <p className="text-5xl mb-4">🔥</p>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Secret Message</h2>
          <p className="text-muted-foreground mb-6">This message was a one-time secret and has already been viewed.</p>
          <Button onClick={() => navigate('/')} className="bg-primary text-primary-foreground rounded-full">
            Create a message for someone
          </Button>
        </div>
      </div>
    );
  }

  const theme = themes[(msg.theme as ThemeId) || 'pastel'] || themes.pastel;
  const revealStyle = (msg.reveal_style as RevealStyle) || 'tap';
  const animEffect = (msg.animation_effect as AnimationEffect) || 'none';

  const messageContent = (
    <div ref={cardRef} className="p-6" style={{ fontFamily: msg.font_style || 'Quicksand' }}>
      {msg.recipient_name && (
        <p className="text-sm mb-2 opacity-60" style={{ color: theme.textColor }}>Dear {msg.recipient_name},</p>
      )}
      {msg.title && (
        <h2 className="text-xl font-bold mb-3" style={{ color: theme.textColor }}>{msg.title}</h2>
      )}
      {revealStyle === 'typing' && step === 'reveal' ? (
        <TypingReveal content={msg.content} onComplete={handleRevealed} style={{ color: theme.textColor }} />
      ) : (
        <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: theme.textColor }}>{msg.content}</p>
      )}
      {msg.sender_name && (
        <p className="text-sm mt-4 text-right opacity-60" style={{ color: theme.textColor }}>— {msg.sender_name}</p>
      )}
    </div>
  );

  const fullCard = (
    <div className="w-72 rounded-2xl shadow-2xl border-2 overflow-hidden relative"
      style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
      {messageContent}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: theme.bg }}>
      <AnimationEffects effect={animEffect} show={showEffects} />

      {step === 'done' && msg.enable_music && (
        <motion.button className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-card shadow-lg border border-border flex items-center justify-center"
          onClick={toggleMusic} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}>
          {musicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div key="welcome" className="text-center z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="mb-6">
              <Heart className="w-14 h-14 mx-auto" style={{ color: theme.accentColor }} fill={theme.accentColor} />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3" style={{ color: theme.textColor }}>
              Someone sent you<br />a special message
            </h1>
            {msg.recipient_name && (
              <p className="text-lg font-body mb-6" style={{ color: theme.textColor, opacity: 0.7 }}>
                For you, <span className="font-semibold" style={{ color: theme.accentColor }}>{msg.recipient_name}</span> 💕
              </p>
            )}
            <Button size="lg" className="rounded-full px-10 py-6 text-lg font-body shadow-lg"
              style={{ backgroundColor: theme.accentColor, color: '#fff' }} onClick={handleContinue}>
              Open Message
            </Button>
          </motion.div>
        )}

        {step === 'password' && (
          <motion.div key="password" className="text-center z-10 w-full max-w-xs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-display font-bold mb-2" style={{ color: theme.textColor }}>Protected Message</h2>
            <p className="text-sm font-body mb-4" style={{ color: theme.textColor, opacity: 0.6 }}>Enter the secret code to unlock</p>
            <Input type="text" placeholder="Enter code..." value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
              className={`mb-3 text-center font-body ${passwordError ? 'border-destructive' : ''}`} />
            {passwordError && <p className="text-destructive text-xs font-body mb-3">Wrong code, try again</p>}
            <Button className="w-full rounded-full font-body" style={{ backgroundColor: theme.accentColor, color: '#fff' }} onClick={handlePasswordSubmit}>
              Unlock
            </Button>
          </motion.div>
        )}

        {step === 'countdown' && (
          <motion.div key="countdown" className="text-center z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-2xl font-display font-bold mb-2" style={{ color: theme.textColor }}>Not Yet!</h2>
            <p className="text-sm font-body mb-6" style={{ color: theme.textColor, opacity: 0.6 }}>This message unlocks in:</p>
            <div className="text-4xl font-display font-bold mb-2" style={{ color: theme.accentColor }}>{countdown}</div>
            <p className="text-xs font-body" style={{ color: theme.textColor, opacity: 0.4 }}>Come back when the timer ends ✨</p>
          </motion.div>
        )}

        {(step === 'reveal' || step === 'done') && (
          <motion.div key="reveal" className="z-10 flex flex-col items-center w-full max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {revealStyle === 'tap' && <TapReveal theme={theme} onReveal={handleRevealed}>{fullCard}</TapReveal>}
            {revealStyle === 'envelope' && <EnvelopeReveal theme={theme} onReveal={handleRevealed}>{fullCard}</EnvelopeReveal>}
            {revealStyle === 'card-flip' && <CardFlipReveal theme={theme} onReveal={handleRevealed}>{messageContent}</CardFlipReveal>}
            {revealStyle === 'scratch' && <ScratchReveal theme={theme} onReveal={handleRevealed}>{messageContent}</ScratchReveal>}
            {revealStyle === 'typing' && step === 'reveal' && (
              <div className="w-72 rounded-2xl shadow-2xl border-2 overflow-hidden" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
                {messageContent}
              </div>
            )}
            {revealStyle === 'typing' && step === 'done' && fullCard}

            {step === 'done' && (
              <motion.div className="mt-8 flex flex-col items-center gap-4 w-full max-w-xs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                {/* Reactions */}
                <MessageReactions messageId={msg.id} accentColor={theme.accentColor} />
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full font-body" onClick={downloadCard}>
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                </div>
                <Button size="lg" className="rounded-full px-8 font-body shadow-lg"
                  style={{ backgroundColor: theme.accentColor, color: '#fff' }} onClick={() => navigate('/')}>
                  <Heart className="w-4 h-4 mr-2" /> Create a message for someone
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewMessagePage;
