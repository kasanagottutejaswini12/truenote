import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FlowerType = 'rose' | 'tulip' | 'lily' | 'sunflower' | 'daisy' | 'peony' | 'lavender';
export type FlowerColor = string;
export type WrapStyle = 'kraft' | 'pastel-matte' | 'transparent-floral' | 'korean-layered' | 'satin-ribbon' | 'minimal-luxury';
export type RibbonStyle = 'bow' | 'simple' | 'lace' | 'none';
export type ArrangementStyle = 'round' | 'hand-tied' | 'cascade' | 'minimal' | 'korean' | 'luxury-layered' | 'wild-garden';

export interface FlowerMemory {
  type: 'text' | 'photo';
  content: string;
}

export interface FlowerItem {
  id: string;
  type: FlowerType;
  color: FlowerColor;
  memory?: FlowerMemory;
}

export interface MessageCard {
  message: string;
  fontStyle: string;
  cardTheme: string;
}

export interface BouquetData {
  flowers: FlowerItem[];
  wrapStyle: WrapStyle;
  wrapColor: string;
  ribbonStyle: RibbonStyle;
  ribbonColor: string;
  arrangementStyle: ArrangementStyle;
  messageCard: MessageCard;
  senderName: string;
  recipientName: string;
  enableMusic: boolean;
}

const defaultBouquet: BouquetData = {
  flowers: [
    { id: '1', type: 'rose', color: '#d4627a' },
    { id: '2', type: 'peony', color: '#f0a0b8' },
    { id: '3', type: 'rose', color: '#c75b7a' },
    { id: '4', type: 'lavender', color: '#9b7ec8' },
    { id: '5', type: 'daisy', color: '#ffffff' },
  ],
  wrapStyle: 'korean-layered',
  wrapColor: '#f5e6d0',
  ribbonStyle: 'bow',
  ribbonColor: '#d4829a',
  messageCard: {
    message: 'You are loved 💕',
    fontStyle: 'Playfair Display',
    cardTheme: 'rose',
  },
  senderName: '',
  recipientName: '',
  enableMusic: false,
};

interface BouquetContextType {
  bouquet: BouquetData;
  setBouquet: React.Dispatch<React.SetStateAction<BouquetData>>;
  updateFlower: (id: string, updates: Partial<FlowerItem>) => void;
  addFlower: (type: FlowerType, color: string) => void;
  removeFlower: (id: string) => void;
  updateCard: (updates: Partial<MessageCard>) => void;
}

const BouquetContext = createContext<BouquetContextType | null>(null);

export const useBouquet = () => {
  const ctx = useContext(BouquetContext);
  if (!ctx) throw new Error('useBouquet must be used within BouquetProvider');
  return ctx;
};

export const BouquetProvider = ({ children }: { children: ReactNode }) => {
  const [bouquet, setBouquet] = useState<BouquetData>(defaultBouquet);

  const updateFlower = (id: string, updates: Partial<FlowerItem>) => {
    setBouquet(prev => ({
      ...prev,
      flowers: prev.flowers.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
  };

  const addFlower = (type: FlowerType, color: string) => {
    if (bouquet.flowers.length >= 12) return;
    setBouquet(prev => ({
      ...prev,
      flowers: [...prev.flowers, { id: Date.now().toString(), type, color }],
    }));
  };

  const removeFlower = (id: string) => {
    if (bouquet.flowers.length <= 1) return;
    setBouquet(prev => ({
      ...prev,
      flowers: prev.flowers.filter(f => f.id !== id),
    }));
  };

  const updateCard = (updates: Partial<MessageCard>) => {
    setBouquet(prev => ({
      ...prev,
      messageCard: { ...prev.messageCard, ...updates },
    }));
  };

  return (
    <BouquetContext.Provider value={{ bouquet, setBouquet, updateFlower, addFlower, removeFlower, updateCard }}>
      {children}
    </BouquetContext.Provider>
  );
};
