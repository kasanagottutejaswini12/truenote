import React from 'react';
import { FlowerType } from '@/context/BouquetContext';

interface FlowerSVGProps {
  type: FlowerType;
  color: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

// Helper to create a darker shade
const darken = (hex: string, amount: number) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

const lighten = (hex: string, amount: number) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

const FlowerSVG: React.FC<FlowerSVGProps> = ({ type, color, size = 60, className = '', onClick }) => {
  const dark = darken(color, 30);
  const light = lighten(color, 30);
  const stemColor = '#5a8a4a';
  const stemLight = '#7ab368';
  const id = `flower-${type}-${color.replace('#', '')}`;

  switch (type) {
    case 'rose':
      return (
        <svg width={size} height={size * 1.5} viewBox="0 0 60 90" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <defs>
            <radialGradient id={`${id}-rg`} cx="50%" cy="40%">
              <stop offset="0%" stopColor={light} />
              <stop offset="70%" stopColor={color} />
              <stop offset="100%" stopColor={dark} />
            </radialGradient>
          </defs>
          {/* Stem */}
          <path d="M30 48 Q28 60 30 90" stroke={stemColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M30 62 Q22 56 18 60 Q16 64 22 63" fill={stemLight} opacity="0.8" />
          <path d="M30 72 Q38 66 42 70 Q44 74 38 73" fill={stemLight} opacity="0.7" />
          {/* Outer petals - layered for depth */}
          <ellipse cx="18" cy="28" rx="13" ry="15" fill={`url(#${id}-rg)`} opacity="0.6" transform="rotate(-25 18 28)" />
          <ellipse cx="42" cy="28" rx="13" ry="15" fill={`url(#${id}-rg)`} opacity="0.6" transform="rotate(25 42 28)" />
          <ellipse cx="24" cy="38" rx="11" ry="13" fill={color} opacity="0.5" transform="rotate(15 24 38)" />
          <ellipse cx="36" cy="38" rx="11" ry="13" fill={color} opacity="0.5" transform="rotate(-15 36 38)" />
          {/* Mid petals */}
          <ellipse cx="22" cy="24" rx="10" ry="14" fill={color} opacity="0.75" transform="rotate(-10 22 24)" />
          <ellipse cx="38" cy="24" rx="10" ry="14" fill={color} opacity="0.75" transform="rotate(10 38 24)" />
          <ellipse cx="30" cy="18" rx="11" ry="13" fill={light} opacity="0.7" />
          {/* Inner spiral petals */}
          <path d="M30 22 Q24 18 26 24 Q28 30 30 26 Q36 22 34 28 Q32 34 30 28" fill={dark} opacity="0.4" />
          <ellipse cx="30" cy="26" rx="7" ry="8" fill={color} opacity="0.8" />
          <ellipse cx="30" cy="24" rx="5" ry="6" fill={light} opacity="0.6" />
          {/* Center bud */}
          <circle cx="30" cy="25" r="3" fill={dark} opacity="0.5" />
        </svg>
      );
    case 'tulip':
      return (
        <svg width={size} height={size * 1.5} viewBox="0 0 60 90" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <defs>
            <linearGradient id={`${id}-lg`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={light} />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor={dark} />
            </linearGradient>
          </defs>
          <path d="M30 45 Q29 60 30 90" stroke={stemColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M30 60 Q20 52 16 58" stroke={stemLight} strokeWidth="1.5" fill="none" />
          {/* Tulip petals - elegant cup shape */}
          <path d="M30 8 Q14 22 18 42 Q22 48 28 45 L30 44Z" fill={`url(#${id}-lg)`} opacity="0.85" />
          <path d="M30 8 Q46 22 42 42 Q38 48 32 45 L30 44Z" fill={color} opacity="0.8" />
          <path d="M30 8 Q22 18 24 38 Q27 44 30 42 Q33 44 36 38 Q38 18 30 8Z" fill={light} opacity="0.5" />
          {/* Subtle vein lines */}
          <path d="M28 14 Q26 24 27 36" stroke={dark} strokeWidth="0.5" fill="none" opacity="0.3" />
          <path d="M32 14 Q34 24 33 36" stroke={dark} strokeWidth="0.5" fill="none" opacity="0.3" />
        </svg>
      );
    case 'lily':
      return (
        <svg width={size} height={size * 1.5} viewBox="0 0 60 90" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <defs>
            <radialGradient id={`${id}-rg`} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fffbe6" />
              <stop offset="40%" stopColor={light} />
              <stop offset="100%" stopColor={color} />
            </radialGradient>
          </defs>
          <path d="M30 40 Q28 58 30 90" stroke={stemColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M30 55 Q22 48 18 52" stroke={stemLight} strokeWidth="1.5" fill="none" />
          {/* Lily petals - star-shaped, elegant curves */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <path key={angle}
              d={`M30 30 Q${24 + (i % 2) * 2} ${12 - (i % 2) * 2} 30 ${4 + (i % 3) * 2} Q${36 - (i % 2) * 2} ${12 - (i % 2) * 2} 30 30`}
              fill={`url(#${id}-rg)`}
              opacity={0.6 + (i % 2) * 0.15}
              transform={`rotate(${angle} 30 30)`}
            />
          ))}
          {/* Stamens */}
          {[0, 72, 144, 216, 288].map(angle => (
            <g key={`s-${angle}`} transform={`rotate(${angle} 30 30)`}>
              <line x1="30" y1="30" x2="30" y2="22" stroke="#c4a040" strokeWidth="0.8" />
              <ellipse cx="30" cy="21" rx="1.5" ry="2" fill="#d4a520" />
            </g>
          ))}
          <circle cx="30" cy="30" r="3" fill="#f5e8c0" />
        </svg>
      );
    case 'sunflower':
      return (
        <svg width={size} height={size * 1.5} viewBox="0 0 60 90" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <defs>
            <radialGradient id={`${id}-center`}>
              <stop offset="0%" stopColor="#8b6914" />
              <stop offset="50%" stopColor="#5c3d1a" />
              <stop offset="100%" stopColor="#3d2810" />
            </radialGradient>
          </defs>
          <path d="M30 42 Q28 58 30 90" stroke={stemColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <ellipse cx="20" cy="62" rx="12" ry="5" fill={stemLight} transform="rotate(-30 20 62)" opacity="0.7" />
          <ellipse cx="40" cy="72" rx="10" ry="4.5" fill={stemLight} transform="rotate(25 40 72)" opacity="0.6" />
          {/* Outer petals */}
          {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350].map((angle, i) => (
            <ellipse key={angle} cx="30" cy="12" rx="4.5" ry="13"
              fill={i % 2 === 0 ? color : light} opacity={0.8 - (i % 3) * 0.1}
              transform={`rotate(${angle} 30 28)`} />
          ))}
          {/* Inner ring of shorter petals */}
          {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map(angle => (
            <ellipse key={`inner-${angle}`} cx="30" cy="18" rx="3.5" ry="8"
              fill={dark} opacity="0.5"
              transform={`rotate(${angle} 30 28)`} />
          ))}
          {/* Center with texture */}
          <circle cx="30" cy="28" r="9" fill={`url(#${id}-center)`} />
          {/* Seed dots */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <circle key={`dot-${angle}`}
              cx={30 + Math.cos(angle * Math.PI / 180) * 4}
              cy={28 + Math.sin(angle * Math.PI / 180) * 4}
              r="1" fill="#a07828" opacity="0.6" />
          ))}
        </svg>
      );
    case 'daisy':
      return (
        <svg width={size} height={size * 1.5} viewBox="0 0 60 90" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <path d="M30 42 Q29 58 30 90" stroke={stemColor} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M30 65 Q24 58 20 62" stroke={stemLight} strokeWidth="1.2" fill="none" />
          {/* Outer petals with slight variation */}
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
            <ellipse key={angle} cx="30" cy="14" rx={4 + (i % 2)} ry={12 + (i % 3)}
              fill={i % 2 === 0 ? color : light} opacity={0.75 + (i % 2) * 0.1}
              transform={`rotate(${angle} 30 28)`} />
          ))}
          {/* Center */}
          <circle cx="30" cy="28" r="6.5" fill="#f5d44b" />
          <circle cx="30" cy="28" r="4" fill="#e8c030" />
          {/* Center texture dots */}
          {[0, 60, 120, 180, 240, 300].map(angle => (
            <circle key={`d-${angle}`}
              cx={30 + Math.cos(angle * Math.PI / 180) * 2.5}
              cy={28 + Math.sin(angle * Math.PI / 180) * 2.5}
              r="0.8" fill="#d4a820" />
          ))}
        </svg>
      );
    case 'peony':
      return (
        <svg width={size} height={size * 1.5} viewBox="0 0 60 90" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <defs>
            <radialGradient id={`${id}-pg`} cx="50%" cy="45%">
              <stop offset="0%" stopColor={light} />
              <stop offset="60%" stopColor={color} />
              <stop offset="100%" stopColor={dark} />
            </radialGradient>
          </defs>
          <path d="M30 48 Q28 62 30 90" stroke={stemColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M30 68 Q22 60 18 64" stroke={stemLight} strokeWidth="1.5" fill="none" />
          {/* Many layered petals for fluffy peony look */}
          {/* Outer layer */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse key={`o-${angle}`} cx="30" cy="14" rx={10 + (i % 2) * 2} ry={14 + (i % 3)}
              fill={`url(#${id}-pg)`} opacity={0.4 + (i % 2) * 0.1}
              transform={`rotate(${angle} 30 28)`} />
          ))}
          {/* Middle layer */}
          {[20, 65, 110, 155, 200, 245, 290, 335].map((angle, i) => (
            <ellipse key={`m-${angle}`} cx="30" cy="18" rx={7 + (i % 2)} ry={10 + (i % 2)}
              fill={color} opacity={0.55 + (i % 3) * 0.1}
              transform={`rotate(${angle} 30 28)`} />
          ))}
          {/* Inner layer */}
          {[10, 50, 90, 130, 170, 210, 250, 290, 330].map((angle, i) => (
            <ellipse key={`i-${angle}`} cx="30" cy="22" rx={5 + (i % 2)} ry={7 + (i % 2)}
              fill={light} opacity={0.5 + (i % 2) * 0.15}
              transform={`rotate(${angle} 30 28)`} />
          ))}
          {/* Center bud */}
          <circle cx="30" cy="28" r="4" fill={color} opacity="0.7" />
          <circle cx="30" cy="27" r="2.5" fill={light} opacity="0.6" />
        </svg>
      );
    default:
      return null;
  }
};

export default FlowerSVG;
