import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ThemeToggle from '@/components/ThemeToggle';
import QRCodeShare from '@/components/QRCodeShare';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Trash2, ExternalLink, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface SentMessage {
  id: string;
  slug: string;
  title: string;
  recipient_name: string | null;
  created_at: string;
  opened_at: string | null;
  is_one_time: boolean | null;
  is_expired: boolean | null;
  countdown_enabled: boolean | null;
  scheduled_at: string | null;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});
  const [showQR, setShowQR] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const slugs = JSON.parse(localStorage.getItem('sent_messages') || '[]') as string[];
    if (slugs.length === 0) { setLoading(false); return; }

    const { data } = await supabase
      .from('messages')
      .select('id, slug, title, recipient_name, created_at, opened_at, is_one_time, is_expired, countdown_enabled, scheduled_at')
      .in('slug', slugs)
      .order('created_at', { ascending: false });

    if (data) {
      setMessages(data as SentMessage[]);
      // Load reactions for all messages
      const ids = data.map((m: any) => m.id);
      const { data: rxns } = await supabase
        .from('message_reactions')
        .select('message_id, reaction')
        .in('message_id', ids);
      if (rxns) {
        const grouped: Record<string, Record<string, number>> = {};
        rxns.forEach((r: any) => {
          if (!grouped[r.message_id]) grouped[r.message_id] = {};
          grouped[r.message_id][r.reaction] = (grouped[r.message_id][r.reaction] || 0) + 1;
        });
        setReactions(grouped);
      }
    }
    setLoading(false);
  };

  const deleteMessage = async (id: string, slug: string) => {
    await supabase.from('messages').delete().eq('id', id);
    const slugs = JSON.parse(localStorage.getItem('sent_messages') || '[]') as string[];
    localStorage.setItem('sent_messages', JSON.stringify(slugs.filter(s => s !== slug)));
    setMessages(prev => prev.filter(m => m.id !== id));
    toast.success('Message deleted');
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/m/${slug}`);
    toast.success('Link copied!');
  };

  const getStatus = (msg: SentMessage) => {
    if (msg.is_expired) return { label: 'Expired', color: 'text-muted-foreground' };
    if (msg.opened_at) return { label: 'Opened', color: 'text-green-600 dark:text-green-400' };
    if (msg.countdown_enabled && msg.scheduled_at && new Date(msg.scheduled_at).getTime() > Date.now()) {
      return { label: 'Scheduled', color: 'text-amber-600 dark:text-amber-400' };
    }
    return { label: 'Sent', color: 'text-primary' };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Home
          </Button>
          <h1 className="font-display text-xl font-semibold text-foreground">My Messages</h1>
          <ThemeToggle />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg font-body text-muted-foreground mb-4">No messages yet</p>
            <Button className="rounded-full font-body" onClick={() => navigate('/create')}>Create Your First Message</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => {
              const status = getStatus(msg);
              const msgReactions = reactions[msg.id] || {};
              const url = `${window.location.origin}/m/${msg.slug}`;

              return (
                <motion.div
                  key={msg.id}
                  className="bg-card rounded-xl p-4 border border-border/50 shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-body font-semibold text-foreground text-sm">
                        {msg.title || 'Untitled'} {msg.is_one_time ? '🔥' : ''}
                      </h3>
                      {msg.recipient_name && (
                        <p className="text-xs text-muted-foreground font-body">To: {msg.recipient_name}</p>
                      )}
                    </div>
                    <span className={`text-xs font-body font-semibold ${status.color}`}>{status.label}</span>
                  </div>

                  {msg.opened_at && (
                    <p className="text-xs text-muted-foreground font-body mb-2">
                      Opened: {new Date(msg.opened_at).toLocaleString()}
                    </p>
                  )}

                  {Object.keys(msgReactions).length > 0 && (
                    <div className="flex gap-1 mb-2 flex-wrap">
                      {Object.entries(msgReactions).map(([emoji, count]) => (
                        <span key={emoji} className="text-xs bg-muted rounded-full px-2 py-0.5 font-body">
                          {emoji} {count}
                        </span>
                      ))}
                    </div>
                  )}

                  {showQR === msg.id && (
                    <div className="mb-3">
                      <QRCodeShare url={url} />
                    </div>
                  )}

                  <div className="flex gap-1 flex-wrap">
                    <Button variant="ghost" size="sm" className="text-xs font-body h-7" onClick={() => copyLink(msg.slug)}>
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs font-body h-7" onClick={() => window.open(url, '_blank')}>
                      <ExternalLink className="w-3 h-3 mr-1" /> Open
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs font-body h-7" onClick={() => setShowQR(showQR === msg.id ? null : msg.id)}>
                      <QrCode className="w-3 h-3 mr-1" /> QR
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs font-body h-7 text-destructive hover:text-destructive" onClick={() => deleteMessage(msg.id, msg.slug)}>
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
