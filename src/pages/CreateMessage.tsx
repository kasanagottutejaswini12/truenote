import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '@/context/MessageContext';
import { occasions, themes, revealStyles, animationEffects, fontOptions, type ThemeId, type Occasion, type RevealStyle, type AnimationEffect } from '@/lib/message-types';
import { type MessageTemplate } from '@/lib/message-templates';
import ThemeToggle from '@/components/ThemeToggle';
import AIMessageGenerator from '@/components/AIMessageGenerator';
import MessageTemplatesPanel from '@/components/MessageTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Lock, Clock, Music, Palette, Flame, Eye, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateMessagePage: React.FC = () => {
  const navigate = useNavigate();
  const { message, updateMessage } = useMessage();
  const theme = themes[message.theme as ThemeId] || themes.pastel;

  const applyTemplate = (t: MessageTemplate) => {
    updateMessage({
      title: t.title, content: t.content, occasion: t.category,
      theme: t.theme, revealStyle: t.revealStyle, animationEffect: t.animationEffect,
      accentColor: themes[t.theme].accentColor, backgroundColor: themes[t.theme].bg,
    });
  };

  const ChipButton = ({ active, onClick, children, style }: { active: boolean; onClick: () => void; children: React.ReactNode; style?: React.CSSProperties }) => (
    <button
      onClick={onClick}
      style={style}
      className={`px-3.5 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 ${
        active
          ? 'gradient-primary text-white shadow-sm scale-[1.02]'
          : 'bg-secondary/60 text-foreground hover:bg-secondary'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-20 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground rounded-full font-body">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <MessageSquare className="w-3 h-3 text-white" />
            </div>
            <span className="font-body font-semibold text-foreground text-sm">Create Message</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" onClick={() => navigate('/preview')} className="gradient-primary text-white rounded-full font-body font-medium hover:shadow-glow transition-all duration-300">
              Preview <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Split layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Editor */}
          <div className="flex-1 space-y-5">
            {/* Quick Actions */}
            <motion.div className="flex gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <MessageTemplatesPanel onSelect={applyTemplate} />
              <AIMessageGenerator occasion={message.occasion} onSelect={(content) => updateMessage({ content })} />
            </motion.div>

            {/* Names */}
            <motion.div className="grid grid-cols-2 gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div>
                <label className="text-xs font-body font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">Your Name</label>
                <Input placeholder="Sender name" value={message.senderName} onChange={e => updateMessage({ senderName: e.target.value })} className="font-body bg-card border-border/60 focus:border-primary/50 rounded-xl h-10" />
              </div>
              <div>
                <label className="text-xs font-body font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">Recipient</label>
                <Input placeholder="Who is this for?" value={message.recipientName} onChange={e => updateMessage({ recipientName: e.target.value })} className="font-body bg-card border-border/60 focus:border-primary/50 rounded-xl h-10" />
              </div>
            </motion.div>

            {/* Occasion */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className="text-xs font-body font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Occasion</label>
              <div className="flex flex-wrap gap-1.5">
                {occasions.map(o => (
                  <ChipButton key={o.id} active={message.occasion === o.id} onClick={() => updateMessage({ occasion: o.id })}>
                    {o.emoji} {o.label}
                  </ChipButton>
                ))}
              </div>
            </motion.div>

            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <label className="text-xs font-body font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">Title</label>
              <Input placeholder="e.g. Happy Birthday! 🎂" value={message.title} onChange={e => updateMessage({ title: e.target.value })} className="font-body bg-card border-border/60 focus:border-primary/50 rounded-xl h-10" />
            </motion.div>

            {/* Content */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <label className="text-xs font-body font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">Message</label>
              <Textarea placeholder="Write your heartfelt message here..." value={message.content} onChange={e => updateMessage({ content: e.target.value })} className="font-body min-h-[140px] bg-card border-border/60 focus:border-primary/50 rounded-xl resize-none" />
            </motion.div>

            {/* Theme */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <label className="text-xs font-body font-semibold text-muted-foreground mb-2 block uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> Theme
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.values(themes).map(t => (
                  <button key={t.id} onClick={() => updateMessage({ theme: t.id as ThemeId, accentColor: t.accentColor, backgroundColor: t.bg })}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 border-2 ${
                      message.theme === t.id ? 'border-primary shadow-sm scale-[1.02]' : 'border-transparent hover:border-border'
                    }`}
                    style={{ backgroundColor: t.cardBg, color: t.textColor }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Reveal + Effect + Font in compact sections */}
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div>
                <label className="text-xs font-body font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Reveal</label>
                <div className="flex flex-wrap gap-1.5">
                  {revealStyles.map(r => (
                    <ChipButton key={r.id} active={message.revealStyle === r.id} onClick={() => updateMessage({ revealStyle: r.id as RevealStyle })}>
                      {r.label}
                    </ChipButton>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-body font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Effect</label>
                <div className="flex flex-wrap gap-1.5">
                  {animationEffects.map(a => (
                    <ChipButton key={a.id} active={message.animationEffect === a.id} onClick={() => updateMessage({ animationEffect: a.id as AnimationEffect })}>
                      {a.emoji} {a.label}
                    </ChipButton>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-body font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Font</label>
                <div className="flex flex-wrap gap-1.5">
                  {fontOptions.map(f => (
                    <ChipButton key={f.id} active={message.fontStyle === f.id} onClick={() => updateMessage({ fontStyle: f.id })}>
                      <span style={{ fontFamily: f.id }}>{f.label}</span>
                    </ChipButton>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Settings cards */}
            <motion.div className="space-y-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              {/* One-time */}
              <div className="flex items-center justify-between bg-card rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-subtle flex items-center justify-center">
                    <Flame className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-body font-medium text-foreground block">One-time secret</span>
                    <span className="text-xs font-body text-muted-foreground">Disappears after viewing</span>
                  </div>
                </div>
                <Switch checked={message.isOneTime || false} onCheckedChange={val => updateMessage({ isOneTime: val })} />
              </div>

              {/* Password */}
              <div className="bg-card rounded-xl p-4 border border-border/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-subtle flex items-center justify-center">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-body font-medium text-foreground block">Password Protection</span>
                    <span className="text-xs font-body text-muted-foreground">Leave empty for no password</span>
                  </div>
                </div>
                <Input type="text" placeholder="Enter secret code..." value={message.password} onChange={e => updateMessage({ password: e.target.value })} className="font-body bg-background border-border/60 rounded-xl h-9 text-sm" />
              </div>

              {/* Countdown */}
              <div className="bg-card rounded-xl p-4 border border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-subtle flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-body font-medium text-foreground block">Countdown Timer</span>
                      <span className="text-xs font-body text-muted-foreground">Unlock at a scheduled time</span>
                    </div>
                  </div>
                  <Switch checked={message.countdownEnabled} onCheckedChange={val => updateMessage({ countdownEnabled: val })} />
                </div>
                {message.countdownEnabled && (
                  <Input type="datetime-local" value={message.scheduledAt} onChange={e => updateMessage({ scheduledAt: e.target.value })} className="font-body bg-background border-border/60 rounded-xl h-9 text-sm" />
                )}
              </div>

              {/* Music */}
              <div className="flex items-center justify-between bg-card rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-subtle flex items-center justify-center">
                    <Music className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-body font-medium text-foreground block">Background Music</span>
                    <span className="text-xs font-body text-muted-foreground">Ambient sound on reveal</span>
                  </div>
                </div>
                <Switch checked={message.enableMusic} onCheckedChange={val => updateMessage({ enableMusic: val })} />
              </div>
            </motion.div>
          </div>

          {/* Live Preview */}
          <motion.div 
            className="lg:w-[360px] lg:sticky lg:top-20 lg:self-start"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Live Preview</span>
              </div>
              <div className="p-6 flex justify-center" style={{ backgroundColor: theme.bg }}>
                <div
                  className="w-full max-w-[280px] rounded-2xl shadow-elevated p-6 border-2 relative overflow-hidden transition-all duration-500"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, fontFamily: message.fontStyle }}
                >
                  {message.recipientName && (
                    <p className="text-xs mb-2 opacity-50" style={{ color: theme.textColor }}>Dear {message.recipientName},</p>
                  )}
                  {message.title && (
                    <h2 className="text-lg font-bold mb-2" style={{ color: theme.textColor }}>{message.title}</h2>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: theme.textColor }}>
                    {message.content || 'Your message will appear here...'}
                  </p>
                  {message.senderName && (
                    <p className="text-xs mt-4 text-right opacity-50" style={{ color: theme.textColor }}>— {message.senderName}</p>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 border-t border-border/50">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-body text-muted-foreground">
                  <span className="bg-secondary/60 rounded-full px-2 py-0.5">{message.revealStyle}</span>
                  <span className="bg-secondary/60 rounded-full px-2 py-0.5">{message.animationEffect}</span>
                  <span className="bg-secondary/60 rounded-full px-2 py-0.5">{message.theme}</span>
                  {message.isOneTime && <span className="bg-secondary/60 rounded-full px-2 py-0.5">🔥 one-time</span>}
                  {message.password && <span className="bg-secondary/60 rounded-full px-2 py-0.5">🔒 protected</span>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateMessagePage;
