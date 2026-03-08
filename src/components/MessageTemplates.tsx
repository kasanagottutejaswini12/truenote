import React, { useState } from 'react';
import { messageTemplates, type MessageTemplate } from '@/lib/message-templates';
import { type Occasion } from '@/lib/message-types';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

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
      <Button variant="outline" size="sm" className="rounded-full font-body text-xs gap-1" onClick={() => setOpen(true)}>
        <FileText className="w-3 h-3" /> Templates
      </Button>
    );
  }

  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-body font-semibold text-foreground flex items-center gap-1">
          <FileText className="w-4 h-4" /> Message Templates
        </p>
        <Button variant="ghost" size="sm" className="text-xs" onClick={() => setOpen(false)}>Close</Button>
      </div>

      <div className="flex flex-wrap gap-1">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-2 py-1 rounded-full text-xs font-body transition-all ${
              filter === c.id ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-2 max-h-64 overflow-y-auto">
        {filtered.map(t => (
          <button
            key={t.id}
            onClick={() => { onSelect(t); setOpen(false); }}
            className="bg-card rounded-lg p-3 border border-border/50 text-left hover:border-primary/50 transition-all"
          >
            <p className="text-sm font-body font-semibold text-foreground">{t.emoji} {t.label}</p>
            <p className="text-xs font-body text-muted-foreground mt-1 line-clamp-2">{t.content}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MessageTemplatesPanel;
