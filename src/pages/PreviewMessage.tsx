import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '@/context/MessageContext';
import { themes, generateSlug, type ThemeId } from '@/lib/message-types';
import ThemeToggle from '@/components/ThemeToggle';
import QRCodeShare from '@/components/QRCodeShare';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Copy, Share2, Check, QrCode, ExternalLink, LayoutDashboard, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const PreviewMessagePage: React.FC = () => {
  const navigate = useNavigate();
  const { message } = useMessage();
  const [shareUrl, setShareUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const theme = themes[message.theme as ThemeId] || themes.pastel;

  const handleSave = async () => {
    if (!message.content.trim()) {
      toast.error('Please write a message first');
      return;
    }
    setSaving(true);
    try {
      const slug = generateSlug();
      const { error } = await supabase.from('messages').insert({
        slug, title: message.title, content: message.content,
        sender_name: message.senderName, recipient_name: message.recipientName,
        occasion: message.occasion, theme: message.theme, reveal_style: message.revealStyle,
        animation_effect: message.animationEffect, font_style: message.fontStyle,
        accent_color: message.accentColor, background_color: message.backgroundColor,
        password: message.password || null,
        scheduled_at: message.scheduledAt ? new Date(message.scheduledAt).toISOString() : null,
        countdown_enabled: message.countdownEnabled, enable_music: message.enableMusic,
        is_one_time: message.isOneTime || false,
      });
      if (error) throw error;
      const url = `${window.location.origin}/m/${slug}`;
      setShareUrl(url);
      const slugs = JSON.parse(localStorage.getItem('sent_messages') || '[]');
      slugs.push(slug);
      localStorage.setItem('sent_messages', JSON.stringify(slugs));
      toast.success('Message created!');
    } catch (err) {
      toast.error('Failed to save message');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`✨ Someone sent you a special message! ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'A special message for you', url: shareUrl });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-20 glass border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/create')} className="text-muted-foreground hover:text-foreground rounded-full font-body">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Edit
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <MessageSquare className="w-3 h-3 text-white" />
            </div>
            <span className="font-body font-semibold text-foreground text-sm">Preview</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Preview card */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4 }}
        >
          <div
            className="w-full max-w-[300px] rounded-2xl shadow-elevated p-6 border-2 relative overflow-hidden"
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
        </motion.div>

        {/* Info tags */}
        <motion.div 
          className="flex flex-wrap gap-1.5 justify-center mb-6"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs font-body bg-secondary/60 text-secondary-foreground rounded-full px-3 py-1">{message.revealStyle}</span>
          <span className="text-xs font-body bg-secondary/60 text-secondary-foreground rounded-full px-3 py-1">{message.animationEffect}</span>
          <span className="text-xs font-body bg-secondary/60 text-secondary-foreground rounded-full px-3 py-1">{message.theme}</span>
          {message.isOneTime && <span className="text-xs font-body bg-secondary/60 text-secondary-foreground rounded-full px-3 py-1">🔥 One-time</span>}
          {message.password && <span className="text-xs font-body bg-secondary/60 text-secondary-foreground rounded-full px-3 py-1">🔒 Protected</span>}
          {message.countdownEnabled && message.scheduledAt && (
            <span className="text-xs font-body bg-secondary/60 text-secondary-foreground rounded-full px-3 py-1">⏰ {new Date(message.scheduledAt).toLocaleDateString()}</span>
          )}
        </motion.div>

        {!shareUrl ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button
              className="w-full gradient-primary text-white rounded-full py-6 text-base font-body font-semibold shadow-glow hover:shadow-elevated transition-all duration-300 hover:scale-[1.01] border-0"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Creating...' : '✨ Create & Get Link'}
            </Button>
          </motion.div>
        ) : (
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Link */}
            <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft">
              <p className="text-xs text-muted-foreground font-body mb-2 font-medium uppercase tracking-wider">Share link</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono text-foreground bg-muted/50 px-3 py-2.5 rounded-xl truncate">{shareUrl}</code>
                <Button size="sm" variant="outline" onClick={copyLink} className="shrink-0 rounded-xl h-10 w-10 p-0">
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* QR Toggle */}
            <div className="flex justify-center">
              <Button variant="outline" size="sm" className="rounded-full font-body text-sm gap-1.5" onClick={() => setShowQR(!showQR)}>
                <QrCode className="w-4 h-4" /> {showQR ? 'Hide' : 'Show'} QR Code
              </Button>
            </div>
            {showQR && <div className="flex justify-center"><QRCodeShare url={shareUrl} /></div>}

            {/* Share buttons */}
            <div className="flex gap-2">
              <Button className="flex-1 rounded-full font-body font-medium" variant="outline" onClick={shareWhatsApp}>WhatsApp</Button>
              {typeof navigator.share !== 'undefined' && (
                <Button className="flex-1 rounded-full font-body font-medium" variant="outline" onClick={shareNative}>
                  <Share2 className="w-4 h-4 mr-1.5" /> Share
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1 font-body text-muted-foreground hover:text-foreground rounded-full" onClick={() => window.open(shareUrl, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-1.5" /> Open
              </Button>
              <Button variant="ghost" className="flex-1 font-body text-muted-foreground hover:text-foreground rounded-full" onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PreviewMessagePage;
