import type { ThemeId, RevealStyle, AnimationEffect, Occasion } from './message-types';

export interface MessageTemplate {
  id: string;
  category: Occasion;
  label: string;
  emoji: string;
  title: string;
  content: string;
  theme: ThemeId;
  revealStyle: RevealStyle;
  animationEffect: AnimationEffect;
}

export const messageTemplates: MessageTemplate[] = [
  {
    id: 'bday-1',
    category: 'birthday',
    label: 'Classic Birthday',
    emoji: '🎂',
    title: 'Happy Birthday! 🎉',
    content: 'Wishing you a day filled with laughter, love, and all the things that make you smile. May this year bring you everything your heart desires. You deserve all the happiness in the world!',
    theme: 'celebration',
    revealStyle: 'envelope',
    animationEffect: 'confetti',
  },
  {
    id: 'bday-2',
    category: 'birthday',
    label: 'Heartfelt Birthday',
    emoji: '🎁',
    title: 'Another Year of You! ✨',
    content: "The world became a better place the day you were born. Thank you for being such an incredible person. Here's to another amazing year of adventures, growth, and joy!",
    theme: 'pastel',
    revealStyle: 'card-flip',
    animationEffect: 'sparkles',
  },
  {
    id: 'love-1',
    category: 'love',
    label: 'Love Letter',
    emoji: '💕',
    title: 'To the One I Love',
    content: "Every moment with you is a treasure I hold close to my heart. You make ordinary days extraordinary and fill my life with a love I never knew was possible. I'm so grateful for you.",
    theme: 'romantic',
    revealStyle: 'envelope',
    animationEffect: 'hearts',
  },
  {
    id: 'love-2',
    category: 'love',
    label: 'Sweet Reminder',
    emoji: '❤️',
    title: 'Just Because I Love You',
    content: "No special occasion needed — I just wanted to remind you how much you mean to me. Your smile lights up my world, and I fall for you a little more each day.",
    theme: 'romantic',
    revealStyle: 'typing',
    animationEffect: 'hearts',
  },
  {
    id: 'friend-1',
    category: 'friendship',
    label: 'Best Friend',
    emoji: '🤗',
    title: 'For My Amazing Friend',
    content: "True friends are rare, and I hit the jackpot with you. Thank you for being my rock, my cheerleader, and my partner in crime. Life is so much better with you in it!",
    theme: 'pastel',
    revealStyle: 'tap',
    animationEffect: 'sparkles',
  },
  {
    id: 'congrats-1',
    category: 'congratulations',
    label: 'Big Achievement',
    emoji: '🏆',
    title: 'Congratulations! 🎊',
    content: "You did it! All your hard work and dedication have paid off. This achievement is a testament to your incredible talent and perseverance. The best is yet to come!",
    theme: 'celebration',
    revealStyle: 'scratch',
    animationEffect: 'confetti',
  },
  {
    id: 'motivation-1',
    category: 'motivation',
    label: 'You Got This',
    emoji: '💪',
    title: 'Keep Going! 🌟',
    content: "I believe in you more than words can say. Every step forward is progress, no matter how small. You have the strength to overcome anything. Keep shining — the world needs your light.",
    theme: 'nature',
    revealStyle: 'typing',
    animationEffect: 'sparkles',
  },
  {
    id: 'apology-1',
    category: 'apology',
    label: 'Sincere Apology',
    emoji: '🙏',
    title: "I'm Sorry",
    content: "I know I hurt you, and I'm truly sorry. You deserve better, and I want to make things right. Your feelings matter to me more than anything. Please give me a chance to show you.",
    theme: 'minimal',
    revealStyle: 'envelope',
    animationEffect: 'petals',
  },
  {
    id: 'thankyou-1',
    category: 'custom',
    label: 'Thank You',
    emoji: '🙌',
    title: 'Thank You So Much!',
    content: "Your kindness and generosity have touched my heart deeply. I want you to know how grateful I am for everything you've done. The world is brighter because of people like you.",
    theme: 'nature',
    revealStyle: 'card-flip',
    animationEffect: 'petals',
  },
];
