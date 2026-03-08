import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBouquet } from '@/context/BouquetContext';
import BouquetPreview from '@/components/BouquetPreview';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, Check, Eye, Share2, Download, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const cardThemes: Record<string, { bg: string; border: string; text: string }> = {
  rose: { bg: '#fff5f5', border: '#e8a0b4', text: '#8b4a5e' },
  lavender: { bg: '#f5f0ff', border: '#b088d4', text: '#5a3d7a' },
  gold: { bg: '#fffbf0', border: '#daa520', text: '#8b6914' },
  sky: { bg: '#f0f8ff', border: '#87ceeb', text: '#3a6b8c' },
  peach: { bg: '#fff8f0', border: '#ffb347', text: '#8b5e2b' },
  mint: { bg: '#f0fff5', border: '#98d4a6', text: '#3a6b4a' },
};

const PreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { bouquet } = useBouquet();
  const [showCard, setShowCard] = useState(false);
  const [copied, setCopied] = useState(false);

  const theme = cardThemes[bouquet.messageCard.cardTheme] || cardThemes.rose;

  const getShareUrl = () => {
    const shareData = btoa(JSON.stringify(bouquet));
    return `${window.location.origin}/view?d=${encodeURIComponent(shareData)}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success('Link copied! Share it with someone special 💐');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleWhatsApp = () => {
    const url = getShareUrl();
    const text = bouquet.recipientName
      ? `🌸 I made a digital bouquet for ${bouquet.recipientName}! Open it here: ${url}`
      : `🌸 Someone sent you a digital bouquet! Open it here: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Digital Bouquet 💐',
          text: bouquet.recipientName
            ? `I made a digital bouquet for ${bouquet.recipientName}!`
            : 'Someone sent you a digital bouquet!',
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleTestView = () => {
    const shareData = btoa(JSON.stringify(bouquet));
    navigate(`/view?d=${encodeURIComponent(shareData)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/card')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Edit Card
          </Button>
          <h1 className="font-display text-xl font-semibold text-foreground">Preview & Share</h1>
          <ThemeToggle />
        </div>

        <div className="flex flex-col items-center">
          {/* Bouquet */}
          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border/50">
            <BouquetPreview />
          </div>

          {/* Toggle card */}
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 text-primary font-body"
            onClick={() => setShowCard(!showCard)}
          >
            {showCard ? 'Hide' : 'Show'} Message Card
          </Button>

          <AnimatePresence>
            {showCard && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="mt-4 w-72 rounded-xl shadow-xl p-8 border-2 relative overflow-hidden"
                style={{
                  backgroundColor: theme.bg,
                  borderColor: theme.border,
                  fontFamily: bouquet.messageCard.fontStyle,
                }}
              >
                <div className="absolute top-0 left-0 w-10 h-10 opacity-15" style={{ borderBottom: `2px solid ${theme.border}`, borderRight: `2px solid ${theme.border}`, borderRadius: '0 0 100% 0' }} />
                <div className="absolute bottom-0 right-0 w-10 h-10 opacity-15" style={{ borderTop: `2px solid ${theme.border}`, borderLeft: `2px solid ${theme.border}`, borderRadius: '100% 0 0 0' }} />
                {bouquet.recipientName && (
                  <p className="text-sm mb-2 opacity-70" style={{ color: theme.text }}>
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
            )}
          </AnimatePresence>

          {/* Share actions */}
          <div className="mt-8 w-full max-w-sm space-y-3">
            <p className="text-sm font-body font-semibold text-foreground text-center mb-4">Share your bouquet</p>

            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/20 font-body"
              onClick={handleCopyLink}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Link Copied!' : 'Copy Share Link'}
            </Button>

            <div className="flex gap-3">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 rounded-full font-body"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="flex-1 rounded-full font-body"
                onClick={handleNativeShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-full font-body"
              onClick={handleTestView}
            >
              <Eye className="w-4 h-4 mr-2" />
              Test Receiver View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
