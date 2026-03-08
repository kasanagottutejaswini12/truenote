import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ThemeToggle from '@/components/ThemeToggle';
import QRCodeShare from '@/components/QRCodeShare';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Trash2, ExternalLink, QrCode, Plus, MessageSquare } from 'lucide-react';
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

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    const slugs = JSON.parse(localStorage.getItem('sent_messages') || '[]') as string[];
    if (slugs.length === 0) { setLoading(false); return; }
    const { data } = await supabase.from('messages')
      .select('id, slug, title, recipient_name, created_at, opened_at, is_one_time, is_expired, countdown_enabled, scheduled_at')
      .in('slug', slugs).order('created_at', { ascending: false });
    if (data) {
      setMessages(data as SentMessage[]);
      const ids = data.map((m: any) => m.id);
      const { data: rxns } = await supabase.from('message_reactions').select('message_id, reaction').in('message_id', ids);
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
    if (msg.is_expired) return { label: 'Expired', dot: 'bg-muted-foreground' };
    if (msg.opened_at) return { label: 'Opened', dot: 'bg-success' };
    if (msg.countdown_enabled && msg.scheduled_at && new Date(msg.scheduled_at).getTime() > Date.now()) {
      return { label: 'Scheduled', dot: 'bg-warning' };
    }
    return { label: 'Sent', dot: 'bg-primary' };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-20 glass border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground rounded-full font-body">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Home
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <MessageSquare className="w-3 h-3 text-white" />
            </div>
            <span className="font-body font-semibold text-foreground text-sm">My Messages</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" onClick={() => navigate('/create')} className="gradient-primary text-white rounded-full font-body font-medium hover:shadow-glow transition-all duration-300 border-0">
              <Plus className="w-4 h-4 mr-1" /> New
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <motion.div className="text-center py-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl gradient-subtle flex items-center justify-center mx-auto mb-5">
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">No messages yet</h2>
            <p className="text-muted-foreground font-body mb-6">Create your first magical message</p>
            <Button className="gradient-primary text-white rounded-full font-body font-medium px-6 shadow-glow border-0" onClick={() => navigate('/create')}>
              Create Your First Message
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.map((msg, i) => {
              const status = getStatus(msg);
              const msgReactions = reactions[msg.id] || {};
              const url = `${window.location.origin}/m/${msg.slug}`;

              return (
                <motion.div
                  key={msg.id}
                  className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft card-hover"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-body font-semibold text-foreground text-sm truncate">
                        {msg.title || 'Untitled'} {msg.is_one_time ? '🔥' : ''}
                      </h3>
                      {msg.recipient_name && (
                        <p className="text-xs text-muted-foreground font-body mt-0.5">To: {msg.recipient_name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                      <span className="text-xs font-body font-medium text-muted-foreground">{status.label}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground font-body mb-3">
                    {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {msg.opened_at && ` · Opened ${new Date(msg.opened_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                  </p>

                  {Object.keys(msgReactions).length > 0 && (
                    <div className="flex gap-1 mb-3 flex-wrap">
                      {Object.entries(msgReactions).map(([emoji, count]) => (
                        <span key={emoji} className="text-xs bg-secondary/60 rounded-full px-2 py-0.5 font-body">{emoji} {count}</span>
                      ))}
                    </div>
                  )}

                  {showQR === msg.id && (
                    <div className="mb-3"><QRCodeShare url={url} /></div>
                  )}

                  <div className="flex gap-1 flex-wrap border-t border-border/30 pt-3 -mx-1">
                    <Button variant="ghost" size="sm" className="text-xs font-body h-7 rounded-lg px-2 text-muted-foreground hover:text-foreground" onClick={() => copyLink(msg.slug)}>
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs font-body h-7 rounded-lg px-2 text-muted-foreground hover:text-foreground" onClick={() => window.open(url, '_blank')}>
                      <ExternalLink className="w-3 h-3 mr-1" /> Open
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs font-body h-7 rounded-lg px-2 text-muted-foreground hover:text-foreground" onClick={() => setShowQR(showQR === msg.id ? null : msg.id)}>
                      <QrCode className="w-3 h-3 mr-1" /> QR
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs font-body h-7 rounded-lg px-2 text-destructive hover:text-destructive ml-auto" onClick={() => deleteMessage(msg.id, msg.slug)}>
                      <Trash2 className="w-3 h-3" />
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
