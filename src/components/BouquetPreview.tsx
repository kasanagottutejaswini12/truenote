import React from 'react';
import { useBouquet, FlowerItem, WrapStyle } from '@/context/BouquetContext';
import FlowerSVG from '@/components/FlowerSVG';
import { motion } from 'framer-motion';

interface BouquetPreviewProps {
  isOpen?: boolean;
  onFlowerClick?: (flower: FlowerItem) => void;
  size?: 'sm' | 'md' | 'lg';
}

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

const BouquetPreview: React.FC<BouquetPreviewProps> = ({ isOpen = true, onFlowerClick, size = 'md' }) => {
  const { bouquet } = useBouquet();
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.2 : 1;
  const w = 320 * scale;
  const h = 440 * scale;
  const wc = bouquet.wrapColor;
  const wDark = darken(wc, 20);
  const wLight = lighten(wc, 20);

  const getFlowerPosition = (index: number, total: number) => {
    const cx = w / 2;
    const baseY = h * 0.32;
    if (total === 1) return { x: cx, y: baseY };
    // Natural scattered arrangement
    const cols = Math.min(total, 4);
    const row = Math.floor(index / cols);
    const col = index % cols;
    const itemsInRow = Math.min(cols, total - row * cols);
    const spread = 42 * scale;
    const rowGap = 38 * scale;
    // Slight randomness seeded by index
    const offsetX = ((index * 7 + 3) % 11 - 5) * scale;
    const offsetY = ((index * 13 + 5) % 9 - 4) * scale;
    return {
      x: cx - (itemsInRow - 1) * (spread / 2) + col * spread + offsetX,
      y: baseY - row * rowGap + (col % 2) * 12 * scale + offsetY,
    };
  };

  const renderWrap = () => {
    const style = bouquet.wrapStyle;
    const topY = h * 0.43;
    const bottomY = h * 0.96;
    const leftX = w * 0.12;
    const rightX = w * 0.88;
    const midX = w * 0.5;

    return (
      <svg width={w} height={h} className="absolute inset-0">
        <defs>
          <linearGradient id="wrapMain" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={wLight} stopOpacity="0.95" />
            <stop offset="50%" stopColor={wc} />
            <stop offset="100%" stopColor={wDark} stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="wrapFold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={wLight} stopOpacity="0.4" />
            <stop offset="100%" stopColor={wDark} stopOpacity="0.2" />
          </linearGradient>
          {/* Kraft texture pattern */}
          <pattern id="kraftTexture" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="transparent" />
            <line x1="0" y1="2" x2="4" y2="2" stroke={wDark} strokeWidth="0.3" opacity="0.15" />
            <line x1="2" y1="0" x2="2" y2="4" stroke={wDark} strokeWidth="0.2" opacity="0.1" />
          </pattern>
        </defs>

        {/* Main wrap cone */}
        <path
          d={`M${leftX} ${topY} Q${midX} ${topY - 8 * scale} ${rightX} ${topY} L${midX} ${bottomY} Z`}
          fill="url(#wrapMain)"
        />

        {/* Texture overlay based on style */}
        {style === 'kraft' && (
          <path
            d={`M${leftX} ${topY} Q${midX} ${topY - 8 * scale} ${rightX} ${topY} L${midX} ${bottomY} Z`}
            fill="url(#kraftTexture)"
          />
        )}

        {/* Korean layered style - extra fold layers */}
        {style === 'korean-layered' && (
          <>
            <path
              d={`M${leftX - 8 * scale} ${topY + 5 * scale} Q${midX} ${topY - 2 * scale} ${rightX + 8 * scale} ${topY + 5 * scale} L${midX + 4 * scale} ${bottomY - 10 * scale} Z`}
              fill={wLight}
              opacity="0.35"
            />
            <path
              d={`M${leftX + 10 * scale} ${topY + 3 * scale} Q${midX} ${topY + 12 * scale} ${rightX - 10 * scale} ${topY + 3 * scale}`}
              fill="none" stroke={wDark} strokeWidth="0.8" opacity="0.2"
            />
          </>
        )}

        {/* Transparent floral overlay */}
        {style === 'transparent-floral' && (
          <path
            d={`M${leftX} ${topY} Q${midX} ${topY - 8 * scale} ${rightX} ${topY} L${midX} ${bottomY} Z`}
            fill="white" opacity="0.15"
          />
        )}

        {/* Fold lines */}
        <path
          d={`M${leftX + 12 * scale} ${topY + 20 * scale} Q${midX} ${topY + 10 * scale} ${rightX - 12 * scale} ${topY + 20 * scale}`}
          fill="none" stroke={wDark} strokeWidth="1" opacity="0.15"
        />

        {/* Side crease for realism */}
        <path
          d={`M${leftX + 5 * scale} ${topY + 10 * scale} L${midX - 20 * scale} ${bottomY - 30 * scale}`}
          stroke={wDark} strokeWidth="0.6" opacity="0.1" fill="none"
        />
        <path
          d={`M${rightX - 5 * scale} ${topY + 10 * scale} L${midX + 20 * scale} ${bottomY - 30 * scale}`}
          stroke={wDark} strokeWidth="0.6" opacity="0.1" fill="none"
        />

        {/* Satin ribbon wrap has glossy highlight */}
        {style === 'satin-ribbon' && (
          <path
            d={`M${midX - 5 * scale} ${topY} L${midX - 5 * scale} ${bottomY}`}
            stroke="white" strokeWidth={3 * scale} opacity="0.12" fill="none"
          />
        )}
      </svg>
    );
  };

  return (
    <div className="relative" style={{ width: w, height: h }}>
      {renderWrap()}

      {/* Flowers */}
      {bouquet.flowers.map((flower, i) => {
        const pos = getFlowerPosition(i, bouquet.flowers.length);
        const flowerSize = (40 + ((i * 7 + 3) % 12)) * scale;
        return (
          <motion.div
            key={flower.id}
            className="absolute"
            style={{
              left: pos.x - flowerSize / 2,
              top: pos.y - flowerSize * 0.6,
              zIndex: 10 + i,
            }}
            initial={!isOpen ? { scale: 0, opacity: 0 } : false}
            animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, type: 'spring' }}
          >
            <FlowerSVG
              type={flower.type}
              color={flower.color}
              size={flowerSize}
              onClick={() => onFlowerClick?.(flower)}
              className={onFlowerClick ? 'hover:scale-110 transition-transform' : ''}
            />
          </motion.div>
        );
      })}

      {/* Ribbon */}
      {bouquet.ribbonStyle !== 'none' && (
        <svg className="absolute" style={{ left: w * 0.28, top: h * 0.42, zIndex: 20 }} width={w * 0.44} height={55 * scale}>
          {bouquet.ribbonStyle === 'bow' ? (
            <>
              <ellipse cx={w * 0.1} cy={22 * scale} rx={22 * scale} ry={13 * scale}
                fill={bouquet.ribbonColor} opacity="0.75" transform={`rotate(-18 ${w * 0.1} ${22 * scale})`} />
              <ellipse cx={w * 0.34} cy={22 * scale} rx={22 * scale} ry={13 * scale}
                fill={bouquet.ribbonColor} opacity="0.75" transform={`rotate(18 ${w * 0.34} ${22 * scale})`} />
              <circle cx={w * 0.22} cy={22 * scale} r={6 * scale} fill={darken(bouquet.ribbonColor, 20)} />
              {/* Ribbon tails */}
              <path d={`M${w * 0.22} ${28 * scale} Q${w * 0.15} ${40 * scale} ${w * 0.1} ${48 * scale}`}
                stroke={bouquet.ribbonColor} strokeWidth={2.5 * scale} fill="none" strokeLinecap="round" />
              <path d={`M${w * 0.22} ${28 * scale} Q${w * 0.29} ${40 * scale} ${w * 0.34} ${48 * scale}`}
                stroke={bouquet.ribbonColor} strokeWidth={2.5 * scale} fill="none" strokeLinecap="round" />
            </>
          ) : bouquet.ribbonStyle === 'lace' ? (
            <>
              <rect x={0} y={16 * scale} width={w * 0.44} height={10 * scale} rx={5 * scale}
                fill={bouquet.ribbonColor} opacity="0.6" />
              {/* Lace scallops */}
              {[...Array(8)].map((_, i) => (
                <circle key={i} cx={i * (w * 0.44 / 7)} cy={16 * scale} r={3 * scale}
                  fill={bouquet.ribbonColor} opacity="0.4" />
              ))}
            </>
          ) : (
            <rect x={0} y={18 * scale} width={w * 0.44} height={8 * scale} rx={4 * scale}
              fill={bouquet.ribbonColor} opacity="0.7" />
          )}
        </svg>
      )}
    </div>
  );
};

export default BouquetPreview;
