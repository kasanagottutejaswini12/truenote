import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '@/context/MessageContext';
import { themes, generateSlug, type ThemeId } from '@/lib/message-types';
import ThemeToggle from '@/components/ThemeToggle';
import QRCodeShare from '@/components/QRCodeShare';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Copy, Share2, Check, QrCode } from 'lucide-react';
import { toast } from 'sonner';

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
        slug,
        title: message.title,
        content: message.content,
        sender_name: message.senderName,
        recipient_name: message.recipientName,
        occasion: message.occasion,
        theme: message.theme,
        reveal_style: message.revealStyle,
        animation_effect: message.animationEffect,
        font_style: message.fontStyle,
        accent_color: message.accentColor,
        background_color: message.backgroundColor,
        password: message.password || null,
        scheduled_at: message.scheduledAt ? new Date(message.scheduledAt).toISOString() : null,
        countdown_enabled: message.countdownEnabled,
        enable_music: message.enableMusic,
        is_one_time: message.isOneTime || false,
      });
      if (error) throw error;
      const url = `${window.location.origin}/m/${slug}`;
      setShareUrl(url);
      // Track in localStorage for dashboard
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
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/create')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Edit
          </Button>
          <h1 className="font-display text-xl font-semibold text-foreground">Preview</h1>
          <ThemeToggle />
        </div>

        {/* Preview card */}
        <div className="mb-6 flex justify-center">
          <div className="w-72 rounded-2xl shadow-xl p-6 border-2 relative overflow-hidden"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, fontFamily: message.fontStyle }}>
            {message.recipientName && (
              <p className="text-sm mb-2 opacity-60" style={{ color: theme.textColor }}>Dear {message.recipientName},</p>
            )}
            {message.title && (
              <h2 className="text-xl font-bold mb-3" style={{ color: theme.textColor }}>{message.title}</h2>
            )}
            <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: theme.textColor }}>
              {message.content || 'Your message will appear here...'}
            </p>
            {message.senderName && (
              <p className="text-sm mt-4 text-right opacity-60" style={{ color: theme.textColor }}>— {message.senderName}</p>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6 space-y-1">
          <p className="text-xs font-body text-muted-foreground">
            <strong>Reveal:</strong> {message.revealStyle} · <strong>Effect:</strong> {message.animationEffect} · <strong>Theme:</strong> {message.theme}
          </p>
          {message.isOneTime && <p className="text-xs font-body text-muted-foreground">🔥 One-time secret (disappears after viewing)</p>}
          {message.password && <p className="text-xs font-body text-muted-foreground">🔒 Password protected</p>}
          {message.countdownEnabled && message.scheduledAt && (
            <p className="text-xs font-body text-muted-foreground">⏰ Scheduled: {new Date(message.scheduledAt).toLocaleString()}</p>
          )}
        </div>

        {!shareUrl ? (
          <Button className="w-full bg-primary text-primary-foreground rounded-full py-6 text-lg font-body shadow-lg" onClick={handleSave} disabled={saving}>
            {saving ? 'Creating...' : '✨ Create & Get Link'}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground font-body mb-2">Share this link:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono text-foreground bg-muted px-3 py-2 rounded-lg truncate">{shareUrl}</code>
                <Button size="sm" variant="outline" onClick={copyLink} className="shrink-0">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <Button variant="outline" size="sm" className="rounded-full font-body gap-1" onClick={() => setShowQR(!showQR)}>
                <QrCode className="w-4 h-4" /> {showQR ? 'Hide' : 'Show'} QR Code
              </Button>
            </div>
            {showQR && <QRCodeShare url={shareUrl} />}

            <div className="flex gap-2">
              <Button className="flex-1 rounded-full font-body" variant="outline" onClick={shareWhatsApp}>WhatsApp</Button>
              {typeof navigator.share !== 'undefined' && (
                <Button className="flex-1 rounded-full font-body" variant="outline" onClick={shareNative}>
                  <Share2 className="w-4 h-4 mr-1" /> Share
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1 font-body text-muted-foreground" onClick={() => window.open(shareUrl, '_blank')}>
                Open receiver view →
              </Button>
              <Button variant="ghost" className="flex-1 font-body text-muted-foreground" onClick={() => navigate('/dashboard')}>
                My Messages →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewMessagePage;
