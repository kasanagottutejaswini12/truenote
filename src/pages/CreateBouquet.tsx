import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBouquet, FlowerType, FlowerItem, WrapStyle, ArrangementStyle } from '@/context/BouquetContext';
import FlowerSVG from '@/components/FlowerSVG';
import BouquetPreview from '@/components/BouquetPreview';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, X, Palette, Music, Flower2 } from 'lucide-react';

const flowerTypes: { type: FlowerType; label: string; defaultColor: string }[] = [
  { type: 'rose', label: 'Rose', defaultColor: '#d4627a' },
  { type: 'tulip', label: 'Tulip', defaultColor: '#f0c4d4' },
  { type: 'lily', label: 'Lily', defaultColor: '#f5e6d0' },
  { type: 'sunflower', label: 'Sunflower', defaultColor: '#ffd700' },
  { type: 'daisy', label: 'Daisy', defaultColor: '#ffffff' },
  { type: 'peony', label: 'Peony', defaultColor: '#f0a0b8' },
  { type: 'lavender', label: 'Lavender', defaultColor: '#9b7ec8' },
];

const wrapStyles: { id: WrapStyle; label: string; color: string }[] = [
  { id: 'kraft', label: 'Kraft Paper', color: '#c9a87c' },
  { id: 'pastel-matte', label: 'Pastel Matte', color: '#f0d4e0' },
  { id: 'transparent-floral', label: 'Transparent', color: '#e8f0e8' },
  { id: 'korean-layered', label: 'Korean Style', color: '#f5e6d0' },
  { id: 'satin-ribbon', label: 'Satin', color: '#e0d0e8' },
  { id: 'minimal-luxury', label: 'Minimal', color: '#f0f0f0' },
];

const arrangementStyles: { id: ArrangementStyle; label: string; desc: string }[] = [
  { id: 'round', label: 'Round', desc: 'Classic dome' },
  { id: 'hand-tied', label: 'Hand-Tied', desc: 'Natural fan' },
  { id: 'cascade', label: 'Cascade', desc: 'Flowing down' },
  { id: 'minimal', label: 'Minimal', desc: 'Spacious' },
  { id: 'korean', label: 'Korean', desc: 'Compact dome' },
  { id: 'luxury-layered', label: 'Luxury', desc: 'Layered rings' },
  { id: 'wild-garden', label: 'Wild Garden', desc: 'Organic scatter' },
];

const wrapColors = ['#f5e6d0', '#e8d5c4', '#c9a87c', '#d4c4b0', '#f0d4e0', '#e0d0e8', '#e8f0e8', '#f0f0f0', '#fff5f5', '#f0f0ff'];
const ribbonColors = ['#d4829a', '#e8a0b4', '#c75b7a', '#b088d4', '#ffd700', '#87ceeb', '#ff6b6b', '#98d4a6', '#f5e6d0', '#8b6914'];

const CreateBouquetPage: React.FC = () => {
  const navigate = useNavigate();
  const { bouquet, setBouquet, addFlower, removeFlower, updateFlower } = useBouquet();
  const [selectedFlower, setSelectedFlower] = useState<string | null>(null);
  const [memoryText, setMemoryText] = useState('');

  const handleFlowerClick = (flower: FlowerItem) => {
    setSelectedFlower(selectedFlower === flower.id ? null : flower.id);
    setMemoryText(flower.memory?.content || '');
  };

  const saveMemory = () => {
    if (selectedFlower && memoryText.trim()) {
      updateFlower(selectedFlower, { memory: { type: 'text', content: memoryText } });
    }
    setSelectedFlower(null);
    setMemoryText('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="font-display text-xl font-semibold text-foreground">Design Your Bouquet</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" onClick={() => navigate('/card')} className="bg-primary text-primary-foreground rounded-full">
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="bg-card rounded-2xl shadow-lg p-6 border border-border/50">
              <BouquetPreview onFlowerClick={handleFlowerClick} />
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-body">Tap a flower to add a memory</p>

            {/* Memory editor */}
            <AnimatePresence>
              {selectedFlower && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 bg-card rounded-xl p-4 shadow-md border border-border/50 w-full max-w-xs"
                >
                  <p className="text-sm font-body font-semibold text-foreground mb-2">Add a memory to this flower</p>
                  <Input
                    placeholder="Write a short note..."
                    value={memoryText}
                    onChange={e => setMemoryText(e.target.value)}
                    className="mb-2 font-body"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveMemory} className="bg-primary text-primary-foreground rounded-full text-xs flex-1">Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedFlower(null)} className="text-xs">Cancel</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Names */}
            <div className="space-y-3">
              <label className="text-sm font-body font-semibold text-foreground">Recipient's Name</label>
              <Input
                placeholder="Who is this for?"
                value={bouquet.recipientName}
                onChange={e => setBouquet(prev => ({ ...prev, recipientName: e.target.value }))}
                className="font-body"
              />
            </div>

            {/* Add flowers */}
            <div>
              <p className="text-sm font-body font-semibold text-foreground mb-2">Add Flowers ({bouquet.flowers.length}/12)</p>
              <div className="flex flex-wrap gap-2">
                {flowerTypes.map(ft => (
                  <button
                    key={ft.type}
                    onClick={() => addFlower(ft.type, ft.defaultColor)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-sm font-body text-foreground transition-colors"
                  >
                    <FlowerSVG type={ft.type} color={ft.defaultColor} size={18} />
                    {ft.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flower list */}
            <div>
              <p className="text-sm font-body font-semibold text-foreground mb-2">Your Flowers</p>
              <div className="flex flex-wrap gap-2">
                {bouquet.flowers.map(f => (
                  <div key={f.id} className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs font-body">
                    <FlowerSVG type={f.type} color={f.color} size={16} />
                    <input
                      type="color"
                      value={f.color}
                      onChange={e => updateFlower(f.id, { color: e.target.value })}
                      className="w-4 h-4 rounded-full border-0 cursor-pointer"
                    />
                    <button onClick={() => removeFlower(f.id)} className="text-muted-foreground hover:text-destructive ml-1">
                      <X className="w-3 h-3" />
                    </button>
                    {f.memory && <span className="text-primary">💌</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Arrangement style */}
            <div>
              <p className="text-sm font-body font-semibold text-foreground mb-2 flex items-center gap-1">
                <Flower2 className="w-4 h-4" /> Arrangement Style
              </p>
              <div className="flex flex-wrap gap-2">
                {arrangementStyles.map(as => (
                  <button
                    key={as.id}
                    onClick={() => setBouquet(prev => ({ ...prev, arrangementStyle: as.id }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${
                      bouquet.arrangementStyle === as.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                    title={as.desc}
                  >
                    {as.label}
                  </button>
                ))}
              </div>
            </div>


            <div>
              <p className="text-sm font-body font-semibold text-foreground mb-2">Wrapping Style</p>
              <div className="flex flex-wrap gap-2">
                {wrapStyles.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => setBouquet(prev => ({ ...prev, wrapStyle: ws.id, wrapColor: ws.color }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-body capitalize transition-all ${
                      bouquet.wrapStyle === ws.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {ws.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Wrap color */}
            <div>
              <p className="text-sm font-body font-semibold text-foreground mb-2 flex items-center gap-1">
                <Palette className="w-4 h-4" /> Wrap Color
              </p>
              <div className="flex flex-wrap gap-2">
                {wrapColors.map(c => (
                  <button
                    key={c}
                    onClick={() => setBouquet(prev => ({ ...prev, wrapColor: c }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${bouquet.wrapColor === c ? 'border-primary scale-110 shadow-md' : 'border-border'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Ribbon */}
            <div>
              <p className="text-sm font-body font-semibold text-foreground mb-2">Ribbon</p>
              <div className="flex gap-2 mb-2">
                {(['bow', 'simple', 'lace', 'none'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => setBouquet(prev => ({ ...prev, ribbonStyle: style }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-body capitalize transition-colors ${
                      bouquet.ribbonStyle === style ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              {bouquet.ribbonStyle !== 'none' && (
                <div className="flex flex-wrap gap-2">
                  {ribbonColors.map(c => (
                    <button
                      key={c}
                      onClick={() => setBouquet(prev => ({ ...prev, ribbonColor: c }))}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${bouquet.ribbonColor === c ? 'border-primary scale-110 shadow-md' : 'border-border'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Background music toggle */}
            <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-body text-foreground">Background music on open</span>
              </div>
              <Switch
                checked={bouquet.enableMusic}
                onCheckedChange={val => setBouquet(prev => ({ ...prev, enableMusic: val }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBouquetPage;
