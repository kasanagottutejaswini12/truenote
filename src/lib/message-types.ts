export type Occasion = 'birthday' | 'congratulations' | 'friendship' | 'love' | 'apology' | 'motivation' | 'custom';
export type RevealStyle = 'tap' | 'typing' | 'envelope' | 'scratch' | 'card-flip';
export type ThemeId = 'minimal' | 'pastel' | 'celebration' | 'romantic' | 'dark-elegant' | 'nature';
export type AnimationEffect = 'none' | 'confetti' | 'hearts' | 'sparkles' | 'petals';

export interface MessageTheme {
  id: ThemeId;
  label: string;
  bg: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  accentColor: string;
  pattern?: string;
}

export const themes: Record<ThemeId, MessageTheme> = {
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    bg: '#fafafa',
    cardBg: '#ffffff',
    cardBorder: '#e5e5e5',
    textColor: '#1a1a1a',
    accentColor: '#6b7280',
  },
  pastel: {
    id: 'pastel',
    label: 'Pastel',
    bg: '#fef7f7',
    cardBg: '#fff5f5',
    cardBorder: '#e8a0b4',
    textColor: '#6b3a4a',
    accentColor: '#d4627a',
  },
  celebration: {
    id: 'celebration',
    label: 'Celebration',
    bg: '#fffbf0',
    cardBg: '#fffef5',
    cardBorder: '#daa520',
    textColor: '#5a4a1a',
    accentColor: '#daa520',
  },
  romantic: {
    id: 'romantic',
    label: 'Romantic',
    bg: '#fdf2f8',
    cardBg: '#fff1f2',
    cardBorder: '#f472b6',
    textColor: '#831843',
    accentColor: '#ec4899',
  },
  'dark-elegant': {
    id: 'dark-elegant',
    label: 'Dark Elegant',
    bg: '#1a1a2e',
    cardBg: '#16213e',
    cardBorder: '#e2b04a',
    textColor: '#e8e0d0',
    accentColor: '#e2b04a',
  },
  nature: {
    id: 'nature',
    label: 'Nature',
    bg: '#f0fdf4',
    cardBg: '#f7fef9',
    cardBorder: '#86efac',
    textColor: '#14532d',
    accentColor: '#22c55e',
  },
};

export const occasions: { id: Occasion; label: string; emoji: string }[] = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'congratulations', label: 'Congratulations', emoji: '🎉' },
  { id: 'friendship', label: 'Friendship', emoji: '🤝' },
  { id: 'love', label: 'Love', emoji: '❤️' },
  { id: 'apology', label: 'Apology', emoji: '🙏' },
  { id: 'motivation', label: 'Motivation', emoji: '💪' },
  { id: 'custom', label: 'Custom', emoji: '✨' },
];

export const revealStyles: { id: RevealStyle; label: string; desc: string }[] = [
  { id: 'tap', label: 'Tap to Reveal', desc: 'Tap and the message appears' },
  { id: 'typing', label: 'Typing Animation', desc: 'Message types out letter by letter' },
  { id: 'envelope', label: 'Envelope', desc: 'Open an envelope to reveal' },
  { id: 'card-flip', label: 'Card Flip', desc: 'Flip a card to see the message' },
  { id: 'scratch', label: 'Scratch', desc: 'Scratch to reveal the message' },
];

export const animationEffects: { id: AnimationEffect; label: string; emoji: string }[] = [
  { id: 'none', label: 'None', emoji: '—' },
  { id: 'confetti', label: 'Confetti', emoji: '🎊' },
  { id: 'hearts', label: 'Hearts', emoji: '💕' },
  { id: 'sparkles', label: 'Sparkles', emoji: '✨' },
  { id: 'petals', label: 'Petals', emoji: '🌸' },
];

export const fontOptions = [
  { id: 'Quicksand', label: 'Quicksand' },
  { id: 'Playfair Display', label: 'Playfair Display' },
  { id: 'Georgia', label: 'Georgia' },
  { id: 'monospace', label: 'Monospace' },
];

export interface MessageData {
  title: string;
  content: string;
  senderName: string;
  recipientName: string;
  occasion: Occasion;
  theme: ThemeId;
  revealStyle: RevealStyle;
  animationEffect: AnimationEffect;
  fontStyle: string;
  accentColor: string;
  backgroundColor: string;
  password: string;
  scheduledAt: string;
  countdownEnabled: boolean;
  enableMusic: boolean;
  isOneTime: boolean;
}

export const defaultMessage: MessageData = {
  title: '',
  content: '',
  senderName: '',
  recipientName: '',
  occasion: 'custom',
  theme: 'pastel',
  revealStyle: 'tap',
  animationEffect: 'confetti',
  fontStyle: 'Quicksand',
  accentColor: '#d4627a',
  backgroundColor: '#fef7f7',
  password: '',
  scheduledAt: '',
  countdownEnabled: false,
  enableMusic: false,
};

export const generateSlug = () => {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  let slug = '';
  for (let i = 0; i < 8; i++) slug += chars[Math.floor(Math.random() * chars.length)];
  return slug;
};
