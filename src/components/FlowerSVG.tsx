import React from 'react';
import { FlowerType } from '@/context/BouquetContext';

interface FlowerSVGProps {
  type: FlowerType;
  color: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const FlowerSVG: React.FC<FlowerSVGProps> = ({ type, color, size = 60, className = '', onClick }) => {
  const petalColor = color;
  const centerColor = type === 'sunflower' ? '#5c3d1a' : '#f5e0a0';
  const stemColor = '#6b9e5a';

  switch (type) {
    case 'rose':
      return (
        <svg width={size} height={size * 1.4} viewBox="0 0 60 84" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <line x1="30" y1="45" x2="30" y2="84" stroke={stemColor} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="20" cy="65" rx="8" ry="4" fill={stemColor} transform="rotate(-30 20 65)" opacity="0.7" />
          <circle cx="30" cy="30" r="16" fill={petalColor} opacity="0.6" />
          <ellipse cx="22" cy="26" rx="10" ry="12" fill={petalColor} opacity="0.7" transform="rotate(-15 22 26)" />
          <ellipse cx="38" cy="26" rx="10" ry="12" fill={petalColor} opacity="0.7" transform="rotate(15 38 26)" />
          <ellipse cx="30" cy="20" rx="9" ry="11" fill={petalColor} opacity="0.8" />
          <ellipse cx="26" cy="32" rx="8" ry="10" fill={petalColor} opacity="0.5" transform="rotate(20 26 32)" />
          <ellipse cx="34" cy="32" rx="8" ry="10" fill={petalColor} opacity="0.5" transform="rotate(-20 34 32)" />
          <circle cx="30" cy="28" r="5" fill={petalColor} filter="brightness(0.85)" />
        </svg>
      );
    case 'tulip':
      return (
        <svg width={size} height={size * 1.4} viewBox="0 0 60 84" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <line x1="30" y1="45" x2="30" y2="84" stroke={stemColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M30 10 Q15 25 20 42 Q25 48 30 45 Q35 48 40 42 Q45 25 30 10Z" fill={petalColor} opacity="0.8" />
          <path d="M30 10 Q22 22 25 40 Q28 44 30 42 Q32 44 35 40 Q38 22 30 10Z" fill={petalColor} filter="brightness(1.1)" opacity="0.6" />
        </svg>
      );
    case 'lily':
      return (
        <svg width={size} height={size * 1.4} viewBox="0 0 60 84" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <line x1="30" y1="40" x2="30" y2="84" stroke={stemColor} strokeWidth="3" strokeLinecap="round" />
          {[0, 60, 120, 180, 240, 300].map(angle => (
            <ellipse key={angle} cx="30" cy="14" rx="7" ry="16" fill={petalColor} opacity="0.7"
              transform={`rotate(${angle} 30 30)`} />
          ))}
          <circle cx="30" cy="30" r="4" fill={centerColor} />
        </svg>
      );
    case 'sunflower':
      return (
        <svg width={size} height={size * 1.4} viewBox="0 0 60 84" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <line x1="30" y1="42" x2="30" y2="84" stroke={stemColor} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="18" cy="60" rx="10" ry="5" fill={stemColor} transform="rotate(-25 18 60)" opacity="0.7" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
            <ellipse key={angle} cx="30" cy="14" rx="5" ry="12" fill={petalColor} opacity="0.85"
              transform={`rotate(${angle} 30 28)`} />
          ))}
          <circle cx="30" cy="28" r="8" fill={centerColor} />
        </svg>
      );
    case 'daisy':
      return (
        <svg width={size} height={size * 1.4} viewBox="0 0 60 84" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <line x1="30" y1="42" x2="30" y2="84" stroke={stemColor} strokeWidth="2.5" strokeLinecap="round" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <ellipse key={angle} cx="30" cy="16" rx="5" ry="12" fill={petalColor} opacity="0.8"
              transform={`rotate(${angle} 30 28)`} />
          ))}
          <circle cx="30" cy="28" r="6" fill="#f5d44b" />
        </svg>
      );
    default:
      return null;
  }
};

export default FlowerSVG;
