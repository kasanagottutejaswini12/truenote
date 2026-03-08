import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const REACTIONS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '👍', label: 'Like' },
  { emoji: '😊', label: 'Smile' },
  { emoji: '🔥', label: 'Awesome' },
];

interface Props {
  messageId: string;
  accentColor: string;
}

const MessageReactions: React.FC<Props> = ({ messageId, accentColor }) => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [myReaction, setMyReaction] = useState<string | null>(null);

  useEffect(() => { loadReactions(); }, [messageId]);

  const loadReactions = async () => {
    const { data } = await supabase.from('message_reactions').select('reaction').eq('message_id', messageId);
    if (data) {
      const c: Record<string, number> = {};
      data.forEach((r: { reaction: string }) => { c[r.reaction] = (c[r.reaction] || 0) + 1; });
      setCounts(c);
    }
  };

  const react = async (emoji: string) => {
    if (myReaction) return;
    setMyReaction(emoji);
    setCounts(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
    await supabase.from('message_reactions').insert({ message_id: messageId, reaction: emoji });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {REACTIONS.map(r => (
        <motion.button
          key={r.emoji}
          whileTap={{ scale: 1.3 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => react(r.emoji)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-body transition-all duration-200 border ${
            myReaction === r.emoji
              ? 'border-primary/50 bg-primary/10 shadow-sm'
              : 'border-border/50 bg-card hover:bg-secondary/60 hover:border-border'
          }`}
          disabled={!!myReaction}
        >
          <span className="text-base">{r.emoji}</span>
          {(counts[r.emoji] || 0) > 0 && (
            <span className="text-xs text-muted-foreground font-medium">{counts[r.emoji]}</span>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default MessageReactions;
