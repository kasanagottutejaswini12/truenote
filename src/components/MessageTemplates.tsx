import React, { useState } from 'react';
import { messageTemplates, type MessageTemplate } from '@/lib/message-templates';
import { type Occasion } from '@/lib/message-types';
import { Button } from '@/components/ui/button';
import { FileText, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onSelect: (template: MessageTemplate) => void;
}

const categories: { id: Occasion | 'all'; label: string }[] = [
  { id: 'all', label: '✨ All' },
  { id: 'birthday', label: '🎂 Birthday' },
  { id: 'love', label: '❤️ Love' },
  { id: 'friendship', label: '🤝 Friendship' },
  { id: 'congratulations', label: '🎉 Congrats' },
  { id: 'motivation', label: '💪 Motivation' },
  { id: 'apology', label: '🙏 Apology' },
  { id: 'custom', label: '✨ Other' },
];

const MessageTemplatesPanel: React.FC<Props> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? messageTemplates : messageTemplates.filter(t => t.category === filter);

  if (!open) {
    return (
      <Button variant="outline" size="sm" className="rounded-full font-body text-xs gap-1.5 border-border/60 hover:border-primary/30 hover:bg-secondary/50 transition-all" onClick={() => setOpen(true)}>
        <FileText className="w-3.5 h-3.5 text-primary" /> Templates
      </Button>
    );
  }

  return (
    <motion.div 
      className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft space-y-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-subtle flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-body font-semibold text-foreground">Templates</span>
        </div>
        <Button variant="ghost" size="sm" className="rounded-full h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 ${
              filter === c.id ? 'gradient-primary text-white shadow-sm' : 'bg-secondary/60 text-foreground hover:bg-secondary'
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
        {filtered.map((t, i) => (
          <motion.button
            key={t.id}
            onClick={() => { onSelect(t); setOpen(false); }}
            className="bg-muted/30 rounded-xl p-3.5 border border-border/30 text-left card-hover group"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <p className="text-sm font-body font-semibold text-foreground group-hover:text-primary transition-colors">{t.emoji} {t.label}</p>
            <p className="text-xs font-body text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{t.content}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default MessageTemplatesPanel;
