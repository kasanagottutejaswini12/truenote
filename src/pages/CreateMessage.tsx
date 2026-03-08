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
import { ArrowLeft, ArrowRight, Lock, Clock, Music, Palette, Flame } from 'lucide-react';

const CreateMessagePage: React.FC = () => {
  const navigate = useNavigate();
  const { message, updateMessage } = useMessage();

  const applyTemplate = (t: MessageTemplate) => {
    updateMessage({
      title: t.title,
      content: t.content,
      occasion: t.category,
      theme: t.theme,
      revealStyle: t.revealStyle,
      animationEffect: t.animationEffect,
      accentColor: themes[t.theme].accentColor,
      backgroundColor: themes[t.theme].bg,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="font-display text-xl font-semibold text-foreground">Create Message</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" onClick={() => navigate('/preview')} className="bg-primary text-primary-foreground rounded-full">
              Preview <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <MessageTemplatesPanel onSelect={applyTemplate} />
            <AIMessageGenerator occasion={message.occasion} onSelect={(content) => updateMessage({ content })} />
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1 block">Your Name</label>
              <Input placeholder="Sender name" value={message.senderName} onChange={e => updateMessage({ senderName: e.target.value })} className="font-body" />
            </div>
            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1 block">Recipient's Name</label>
              <Input placeholder="Who is this for?" value={message.recipientName} onChange={e => updateMessage({ recipientName: e.target.value })} className="font-body" />
            </div>
          </div>

          {/* Occasion */}
          <div>
            <p className="text-sm font-body font-semibold text-foreground mb-2">Occasion</p>
            <div className="flex flex-wrap gap-2">
              {occasions.map(o => (
                <button key={o.id} onClick={() => updateMessage({ occasion: o.id })}
                  className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${message.occasion === o.id ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                  {o.emoji} {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-body font-semibold text-foreground mb-1 block">Message Title</label>
            <Input placeholder="e.g. Happy Birthday! 🎂" value={message.title} onChange={e => updateMessage({ title: e.target.value })} className="font-body" />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-body font-semibold text-foreground mb-1 block">Your Message</label>
            <Textarea placeholder="Write your heartfelt message here..." value={message.content} onChange={e => updateMessage({ content: e.target.value })} className="font-body min-h-[120px]" />
          </div>

          {/* Theme */}
          <div>
            <p className="text-sm font-body font-semibold text-foreground mb-2 flex items-center gap-1">
              <Palette className="w-4 h-4" /> Theme
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.values(themes).map(t => (
                <button key={t.id} onClick={() => updateMessage({ theme: t.id as ThemeId, accentColor: t.accentColor, backgroundColor: t.bg })}
                  className={`px-3 py-1.5 rounded-full text-xs font-body transition-all border-2 ${message.theme === t.id ? 'border-primary shadow-md' : 'border-transparent'}`}
                  style={{ backgroundColor: t.cardBg, color: t.textColor }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reveal Style */}
          <div>
            <p className="text-sm font-body font-semibold text-foreground mb-2">Reveal Style</p>
            <div className="flex flex-wrap gap-2">
              {revealStyles.map(r => (
                <button key={r.id} onClick={() => updateMessage({ revealStyle: r.id as RevealStyle })}
                  className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${message.revealStyle === r.id ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                  title={r.desc}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animation Effect */}
          <div>
            <p className="text-sm font-body font-semibold text-foreground mb-2">Animation Effect</p>
            <div className="flex flex-wrap gap-2">
              {animationEffects.map(a => (
                <button key={a.id} onClick={() => updateMessage({ animationEffect: a.id as AnimationEffect })}
                  className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${message.animationEffect === a.id ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                  {a.emoji} {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font */}
          <div>
            <p className="text-sm font-body font-semibold text-foreground mb-2">Font Style</p>
            <div className="flex flex-wrap gap-2">
              {fontOptions.map(f => (
                <button key={f.id} onClick={() => updateMessage({ fontStyle: f.id })}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${message.fontStyle === f.id ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                  style={{ fontFamily: f.id }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* One-Time Secret */}
          <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-body text-foreground">One-time secret message</span>
            </div>
            <Switch checked={message.isOneTime || false} onCheckedChange={val => updateMessage({ isOneTime: val })} />
          </div>

          {/* Password */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-body font-semibold text-foreground">Password Protection</span>
            </div>
            <Input type="text" placeholder="Leave empty for no password" value={message.password} onChange={e => updateMessage({ password: e.target.value })} className="font-body" />
          </div>

          {/* Countdown */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-body font-semibold text-foreground">Countdown Timer</span>
              </div>
              <Switch checked={message.countdownEnabled} onCheckedChange={val => updateMessage({ countdownEnabled: val })} />
            </div>
            {message.countdownEnabled && (
              <Input type="datetime-local" value={message.scheduledAt} onChange={e => updateMessage({ scheduledAt: e.target.value })} className="font-body" />
            )}
          </div>

          {/* Music */}
          <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-body text-foreground">Background music</span>
            </div>
            <Switch checked={message.enableMusic} onCheckedChange={val => updateMessage({ enableMusic: val })} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMessagePage;
