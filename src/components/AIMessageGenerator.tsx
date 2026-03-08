import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  occasion: string;
  onSelect: (message: string) => void;
}

const relationships = ['friend', 'partner', 'parent', 'colleague', 'sibling'];
const tones = ['warm', 'funny', 'emotional', 'formal', 'inspirational'];

const AIMessageGenerator: React.FC<Props> = ({ occasion, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [relationship, setRelationship] = useState('friend');
  const [tone, setTone] = useState('warm');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-message', {
        body: { occasion, relationship, tone },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button variant="outline" size="sm" className="rounded-full font-body text-xs gap-1" onClick={() => setOpen(true)}>
        <Sparkles className="w-3 h-3" /> AI Help
      </Button>
    );
  }

  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-body font-semibold text-foreground flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-primary" /> AI Message Helper
        </p>
        <Button variant="ghost" size="sm" className="text-xs" onClick={() => setOpen(false)}>Close</Button>
      </div>

      <div>
        <p className="text-xs font-body text-muted-foreground mb-1">Relationship</p>
        <div className="flex flex-wrap gap-1">
          {relationships.map(r => (
            <button
              key={r}
              onClick={() => setRelationship(r)}
              className={`px-2 py-1 rounded-full text-xs font-body transition-all ${
                relationship === r ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-body text-muted-foreground mb-1">Tone</p>
        <div className="flex flex-wrap gap-1">
          {tones.map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-2 py-1 rounded-full text-xs font-body transition-all ${
                tone === t ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <Button size="sm" className="rounded-full font-body text-xs" onClick={generate} disabled={loading}>
        {loading ? <RefreshCw className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
        {loading ? 'Generating...' : 'Generate Suggestions'}
      </Button>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <div key={i} className="bg-card rounded-lg p-3 border border-border/50 flex items-start gap-2">
              <p className="text-sm font-body text-foreground flex-1">{s}</p>
              <Button variant="ghost" size="sm" className="shrink-0" onClick={() => { onSelect(s); setOpen(false); }}>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIMessageGenerator;
