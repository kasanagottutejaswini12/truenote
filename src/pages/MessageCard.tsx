import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBouquet } from '@/context/BouquetContext';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const cardThemes = [
  { id: 'rose', label: 'Rose', bg: '#fff5f5', border: '#e8a0b4', text: '#8b4a5e' },
  { id: 'lavender', label: 'Lavender', bg: '#f5f0ff', border: '#b088d4', text: '#5a3d7a' },
  { id: 'gold', label: 'Gold', bg: '#fffbf0', border: '#daa520', text: '#8b6914' },
  { id: 'sky', label: 'Sky', bg: '#f0f8ff', border: '#87ceeb', text: '#3a6b8c' },
  { id: 'peach', label: 'Peach', bg: '#fff8f0', border: '#ffb347', text: '#8b5e2b' },
  { id: 'mint', label: 'Mint', bg: '#f0fff5', border: '#98d4a6', text: '#3a6b4a' },
];

const fontStyles = [
  { id: 'Playfair Display', label: 'Elegant' },
  { id: 'Quicksand', label: 'Modern' },
  { id: 'Georgia', label: 'Classic' },
  { id: 'cursive', label: 'Script' },
];

const MessageCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { bouquet, updateCard, setBouquet } = useBouquet();
  const { messageCard } = bouquet;

  const currentTheme = cardThemes.find(t => t.id === messageCard.cardTheme) || cardThemes[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/create')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Bouquet
          </Button>
          <h1 className="font-display text-xl font-semibold text-foreground">Message Card</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" onClick={() => navigate('/preview')} className="bg-primary text-primary-foreground rounded-full">
              Preview <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Preview */}
          <div className="flex justify-center">
            <motion.div
              className="w-72 rounded-xl shadow-xl p-8 border-2 relative overflow-hidden"
              style={{
                backgroundColor: currentTheme.bg,
                borderColor: currentTheme.border,
                fontFamily: messageCard.fontStyle,
              }}
              animate={{ scale: [0.98, 1] }}
              transition={{ duration: 0.3 }}
            >
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-12 h-12 opacity-20" style={{ borderBottom: `2px solid ${currentTheme.border}`, borderRight: `2px solid ${currentTheme.border}`, borderRadius: '0 0 100% 0' }} />
              <div className="absolute bottom-0 right-0 w-12 h-12 opacity-20" style={{ borderTop: `2px solid ${currentTheme.border}`, borderLeft: `2px solid ${currentTheme.border}`, borderRadius: '100% 0 0 0' }} />
              <div className="absolute top-0 right-0 w-12 h-12 opacity-10" style={{ borderBottom: `2px solid ${currentTheme.border}`, borderLeft: `2px solid ${currentTheme.border}`, borderRadius: '0 0 0 100%' }} />
              <div className="absolute bottom-0 left-0 w-12 h-12 opacity-10" style={{ borderTop: `2px solid ${currentTheme.border}`, borderRight: `2px solid ${currentTheme.border}`, borderRadius: '0 100% 0 0' }} />

              {bouquet.recipientName && (
                <p className="text-sm mb-2 opacity-70" style={{ color: currentTheme.text }}>
                  Dear {bouquet.recipientName},
                </p>
              )}
              <p className="text-lg leading-relaxed whitespace-pre-wrap min-h-[80px]" style={{ color: currentTheme.text }}>
                {messageCard.message || 'Your message here...'}
              </p>
              {bouquet.senderName && (
                <p className="text-sm mt-4 text-right opacity-70" style={{ color: currentTheme.text }}>
                  — {bouquet.senderName}
                </p>
              )}
            </motion.div>
          </div>

          {/* Editor */}
          <div className="space-y-5">
            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1 block">Your Message</label>
              <Textarea
                placeholder="Write something beautiful..."
                value={messageCard.message}
                onChange={e => updateCard({ message: e.target.value })}
                rows={4}
                className="font-body resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1 block">Your Name</label>
              <Input
                placeholder="From..."
                value={bouquet.senderName}
                onChange={e => setBouquet(prev => ({ ...prev, senderName: e.target.value }))}
                className="font-body"
              />
            </div>

            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-2 block">Card Theme</label>
              <div className="flex flex-wrap gap-2">
                {cardThemes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => updateCard({ cardTheme: theme.id })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      messageCard.cardTheme === theme.id ? 'scale-110 shadow-md ring-2 ring-primary/30' : ''
                    }`}
                    style={{
                      backgroundColor: theme.bg,
                      borderColor: messageCard.cardTheme === theme.id ? theme.border : 'transparent',
                    }}
                    title={theme.label}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-2 block">Font Style</label>
              <div className="flex flex-wrap gap-2">
                {fontStyles.map(font => (
                  <button
                    key={font.id}
                    onClick={() => updateCard({ fontStyle: font.id })}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      messageCard.fontStyle === font.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                    style={{ fontFamily: font.id }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick emojis */}
            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-2 block">Add Emoji</label>
              <div className="flex flex-wrap gap-1">
                {['💕', '🌹', '🌸', '✨', '💐', '🦋', '🌺', '💝', '🌷', '🌻', '🤍', '💫', '🌿', '🎀', '🕊️', '💜'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => updateCard({ message: messageCard.message + emoji })}
                    className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-lg hover:scale-110"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCardPage;
