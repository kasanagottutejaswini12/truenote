import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
      if (data?.error) { toast.error(data.error); return; }
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
      <Button variant="outline" size="sm" className="rounded-full font-body text-xs gap-1.5 border-border/60 hover:border-primary/30 hover:bg-secondary/50 transition-all" onClick={() => setOpen(true)}>
        <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Help
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
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-body font-semibold text-foreground">AI Message Helper</span>
        </div>
        <Button variant="ghost" size="sm" className="rounded-full h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div>
        <p className="text-xs font-body text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">Relationship</p>
        <div className="flex flex-wrap gap-1.5">
          {relationships.map(r => (
            <button key={r} onClick={() => setRelationship(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 capitalize ${
                relationship === r ? 'gradient-primary text-white shadow-sm' : 'bg-secondary/60 text-foreground hover:bg-secondary'
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-body text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">Tone</p>
        <div className="flex flex-wrap gap-1.5">
          {tones.map(t => (
            <button key={t} onClick={() => setTone(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 capitalize ${
                tone === t ? 'gradient-primary text-white shadow-sm' : 'bg-secondary/60 text-foreground hover:bg-secondary'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <Button size="sm" className="rounded-full font-body text-xs gradient-primary text-white border-0 shadow-sm hover:shadow-glow transition-all" onClick={generate} disabled={loading}>
        {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
        {loading ? 'Generating...' : 'Generate Suggestions'}
      </Button>

      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {suggestions.map((s, i) => (
              <motion.div 
                key={i} 
                className="bg-muted/30 rounded-xl p-3.5 border border-border/30 flex items-start gap-2 card-hover cursor-pointer group"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => { onSelect(s); setOpen(false); }}
              >
                <p className="text-sm font-body text-foreground flex-1 leading-relaxed">{s}</p>
                <div className="shrink-0 w-7 h-7 rounded-lg bg-secondary/60 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIMessageGenerator;
