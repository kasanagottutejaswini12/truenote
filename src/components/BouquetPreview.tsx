import React from 'react';
import { useBouquet, FlowerItem, ArrangementStyle } from '@/context/BouquetContext';
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

// Seeded pseudo-random for consistent positions
const seeded = (i: number, mod: number) => ((i * 7 + 3) % mod) - mod / 2;

const getArrangementPositions = (
  arrangement: ArrangementStyle,
  index: number,
  total: number,
  cx: number,
  baseY: number,
  scale: number
): { x: number; y: number; rotation: number } => {
  const rot = seeded(index, 13) * 1.5; // slight random rotation

  switch (arrangement) {
    case 'round': {
      // Circular dome arrangement
      if (total === 1) return { x: cx, y: baseY, rotation: rot };
      const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
      const rings = total <= 5 ? 1 : 2;
      const ring = index < Math.min(total, 6) ? 0 : 1;
      const radius = (28 + ring * 26) * scale;
      const ringItems = ring === 0 ? Math.min(total, 6) : total - 6;
      const ringIndex = ring === 0 ? index : index - 6;
      const ringAngle = (ringIndex / ringItems) * Math.PI * 2 - Math.PI / 2;
      return {
        x: cx + Math.cos(ringAngle) * radius + seeded(index, 9) * scale,
        y: baseY + Math.sin(ringAngle) * radius * 0.6 + seeded(index + 3, 7) * scale,
        rotation: rot,
      };
    }
    case 'hand-tied': {
      // Slightly fanned, natural spread
      const spread = 38 * scale;
      const fanAngle = total > 1 ? ((index / (total - 1)) - 0.5) * 1.2 : 0;
      return {
        x: cx + fanAngle * spread * 2 + seeded(index, 11) * scale,
        y: baseY - Math.abs(fanAngle) * 30 * scale + seeded(index + 2, 9) * scale,
        rotation: fanAngle * 15 + rot,
      };
    }
    case 'cascade': {
      // Flowers flowing downward
      const col = index % 3;
      const row = Math.floor(index / 3);
      return {
        x: cx + (col - 1) * 36 * scale + seeded(index, 11) * scale,
        y: baseY + row * 32 * scale - 20 * scale + seeded(index + 1, 7) * scale,
        rotation: (col - 1) * 8 + rot,
      };
    }
    case 'minimal': {
      // Few flowers, lots of space
      const cols = Math.min(total, 3);
      const row = Math.floor(index / cols);
      const col = index % cols;
      const itemsInRow = Math.min(cols, total - row * cols);
      return {
        x: cx - (itemsInRow - 1) * 32 * scale + col * 64 * scale,
        y: baseY - row * 48 * scale,
        rotation: rot * 2,
      };
    }
    case 'korean': {
      // Compact dome with tight grouping
      if (total === 1) return { x: cx, y: baseY, rotation: 0 };
      const angle = (index / total) * Math.PI * 2;
      const r = Math.min(total, 4) > 3 ? 22 * scale : 18 * scale;
      const innerOuter = index < Math.ceil(total / 2) ? 0 : 1;
      const rad = r + innerOuter * 20 * scale;
      return {
        x: cx + Math.cos(angle) * rad + seeded(index, 7) * scale * 0.5,
        y: baseY + Math.sin(angle) * rad * 0.5 + seeded(index + 5, 7) * scale * 0.5,
        rotation: rot * 0.5,
      };
    }
    case 'luxury-layered': {
      // Multiple tight layers
      const layer = index < 3 ? 0 : index < 7 ? 1 : 2;
      const layerIndex = layer === 0 ? index : layer === 1 ? index - 3 : index - 7;
      const layerTotal = layer === 0 ? Math.min(total, 3) : layer === 1 ? Math.min(total - 3, 4) : total - 7;
      const layerAngle = layerTotal > 1 ? ((layerIndex / (layerTotal - 1)) - 0.5) * Math.PI * 0.8 : 0;
      const layerR = (20 + layer * 22) * scale;
      return {
        x: cx + Math.cos(layerAngle) * layerR,
        y: baseY - layer * 16 * scale + Math.sin(layerAngle) * 8 * scale,
        rotation: layerAngle * 8 + rot,
      };
    }
    case 'wild-garden': {
      // Chaotic natural scatter
      return {
        x: cx + seeded(index * 3, 23) * 3.5 * scale,
        y: baseY + seeded(index * 5, 19) * 2.5 * scale,
        rotation: seeded(index * 11, 31) * 3,
      };
    }
    default:
      return { x: cx, y: baseY, rotation: 0 };
  }
};

const BouquetPreview: React.FC<BouquetPreviewProps> = ({ isOpen = true, onFlowerClick, size = 'md' }) => {
  const { bouquet } = useBouquet();
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.2 : 1;
  const w = 320 * scale;
  const h = 500 * scale;
  const wc = bouquet.wrapColor;
  const wDark = darken(wc, 20);
  const wLight = lighten(wc, 20);
  const wVLight = lighten(wc, 40);
  const stemColor = '#5a8a4a';
  const stemLight = '#7ab368';

  const renderStems = () => {
    const cx = w / 2;
    const stY = h * 0.55;
    const endY = h * 0.82;
    return (
      <>
        {bouquet.flowers.map((_, i) => {
          const total = bouquet.flowers.length;
          const spread = Math.min(total, 5) * 4 * scale;
          const offset = total > 1 ? ((i / (total - 1)) - 0.5) * spread : 0;
          const ctrl = cx + offset * 1.5;
          return (
            <path
              key={`stem-${i}`}
              d={`M${cx + offset} ${stY} Q${ctrl} ${(stY + endY) / 2} ${cx + offset * 0.3} ${endY}`}
              stroke={i % 2 === 0 ? stemColor : stemLight}
              strokeWidth={2 * scale}
              fill="none"
              opacity={0.5}
              strokeLinecap="round"
            />
          );
        })}
      </>
    );
  };

  const renderHandle = () => {
    const cx = w / 2;
    const hTop = h * 0.72;
    const hBot = h * 0.95;
    const hw = 28 * scale;
    const rc = bouquet.ribbonColor;
    const rcDark = darken(rc, 25);

    return (
      <>
        {/* Paper wrapped handle */}
        <path
          d={`M${cx - hw} ${hTop} Q${cx - hw - 3 * scale} ${(hTop + hBot) / 2} ${cx - hw + 2 * scale} ${hBot}
              L${cx + hw - 2 * scale} ${hBot} Q${cx + hw + 3 * scale} ${(hTop + hBot) / 2} ${cx + hw} ${hTop} Z`}
          fill={wc}
          opacity="0.9"
        />
        {/* Handle paper fold */}
        <path
          d={`M${cx - hw + 4 * scale} ${hTop + 5 * scale} L${cx - hw + 6 * scale} ${hBot - 5 * scale}`}
          stroke={wDark} strokeWidth={0.6 * scale} opacity="0.15" fill="none"
        />
        <path
          d={`M${cx + hw - 4 * scale} ${hTop + 5 * scale} L${cx + hw - 6 * scale} ${hBot - 5 * scale}`}
          stroke={wDark} strokeWidth={0.6 * scale} opacity="0.15" fill="none"
        />
        {/* Ribbon tie around handle */}
        {bouquet.ribbonStyle !== 'none' && (
          <>
            <rect
              x={cx - hw - 2 * scale} y={hTop + 12 * scale}
              width={(hw + 2 * scale) * 2} height={8 * scale}
              rx={4 * scale}
              fill={rc} opacity="0.75"
            />
            <rect
              x={cx - hw - 2 * scale} y={hTop + 13 * scale}
              width={(hw + 2 * scale) * 2} height={2 * scale}
              fill={lighten(rc, 30)} opacity="0.3"
            />
            {bouquet.ribbonStyle === 'bow' && (
              <>
                <ellipse cx={cx - 10 * scale} cy={hTop + 10 * scale} rx={12 * scale} ry={7 * scale}
                  fill={rc} opacity="0.65" transform={`rotate(-15 ${cx - 10 * scale} ${hTop + 10 * scale})`} />
                <ellipse cx={cx + 10 * scale} cy={hTop + 10 * scale} rx={12 * scale} ry={7 * scale}
                  fill={rc} opacity="0.65" transform={`rotate(15 ${cx + 10 * scale} ${hTop + 10 * scale})`} />
                <circle cx={cx} cy={hTop + 11 * scale} r={4 * scale} fill={rcDark} opacity="0.8" />
                {/* Bow tails */}
                <path d={`M${cx} ${hTop + 16 * scale} Q${cx - 8 * scale} ${hTop + 26 * scale} ${cx - 12 * scale} ${hTop + 32 * scale}`}
                  stroke={rc} strokeWidth={2 * scale} fill="none" strokeLinecap="round" opacity="0.6" />
                <path d={`M${cx} ${hTop + 16 * scale} Q${cx + 8 * scale} ${hTop + 26 * scale} ${cx + 12 * scale} ${hTop + 32 * scale}`}
                  stroke={rc} strokeWidth={2 * scale} fill="none" strokeLinecap="round" opacity="0.6" />
              </>
            )}
          </>
        )}
      </>
    );
  };

  const renderWrap = () => {
    const style = bouquet.wrapStyle;
    const topY = h * 0.38;
    const bottomY = h * 0.74;
    const leftX = w * 0.1;
    const rightX = w * 0.9;
    const midX = w * 0.5;

    return (
      <>
        <defs>
          <linearGradient id="wrapMain" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={wVLight} stopOpacity="0.95" />
            <stop offset="40%" stopColor={wLight} />
            <stop offset="70%" stopColor={wc} />
            <stop offset="100%" stopColor={wDark} stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="wrapBack" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={wLight} stopOpacity="0.5" />
            <stop offset="100%" stopColor={wDark} stopOpacity="0.3" />
          </linearGradient>
          <pattern id="kraftTex" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="transparent" />
            <line x1="0" y1="3" x2="6" y2="3" stroke={wDark} strokeWidth="0.3" opacity="0.12" />
            <line x1="3" y1="0" x2="3" y2="6" stroke={wDark} strokeWidth="0.2" opacity="0.08" />
            <circle cx="1" cy="1" r="0.3" fill={wDark} opacity="0.06" />
            <circle cx="5" cy="5" r="0.2" fill={wDark} opacity="0.05" />
          </pattern>
          <filter id="paperShadow">
            <feDropShadow dx="0" dy={3 * scale} stdDeviation={6 * scale} floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Back paper layer */}
        <path
          d={`M${leftX - 6 * scale} ${topY - 5 * scale} Q${midX} ${topY - 15 * scale} ${rightX + 6 * scale} ${topY - 5 * scale} L${midX + 3 * scale} ${bottomY + 5 * scale} Z`}
          fill="url(#wrapBack)"
          opacity="0.4"
        />

        {/* Main wrap cone */}
        <path
          d={`M${leftX} ${topY} Q${midX} ${topY - 10 * scale} ${rightX} ${topY} L${midX} ${bottomY} Z`}
          fill="url(#wrapMain)"
          filter="url(#paperShadow)"
        />

        {/* Texture overlay */}
        {(style === 'kraft') && (
          <path
            d={`M${leftX} ${topY} Q${midX} ${topY - 10 * scale} ${rightX} ${topY} L${midX} ${bottomY} Z`}
            fill="url(#kraftTex)"
          />
        )}

        {/* Korean layered - extra tissue layers */}
        {style === 'korean-layered' && (
          <>
            <path
              d={`M${leftX - 10 * scale} ${topY + 3 * scale} Q${midX} ${topY - 5 * scale} ${rightX + 10 * scale} ${topY + 3 * scale} L${midX + 5 * scale} ${bottomY - 8 * scale} Z`}
              fill={wVLight} opacity="0.3"
            />
            <path
              d={`M${leftX + 15 * scale} ${topY + 8 * scale} Q${midX} ${topY + 18 * scale} ${rightX - 15 * scale} ${topY + 8 * scale}`}
              fill="none" stroke={wDark} strokeWidth="0.7" opacity="0.15"
            />
            {/* Tissue paper peek at top */}
            <path
              d={`M${leftX + 20 * scale} ${topY - 2 * scale} Q${midX - 15 * scale} ${topY - 14 * scale} ${midX} ${topY - 8 * scale} Q${midX + 15 * scale} ${topY - 14 * scale} ${rightX - 20 * scale} ${topY - 2 * scale}`}
              fill="white" opacity="0.25" strokeWidth="0"
            />
          </>
        )}

        {/* Transparent floral */}
        {style === 'transparent-floral' && (
          <path
            d={`M${leftX} ${topY} Q${midX} ${topY - 10 * scale} ${rightX} ${topY} L${midX} ${bottomY} Z`}
            fill="white" opacity="0.18"
          />
        )}

        {/* Paper edge folds at top */}
        <path
          d={`M${leftX} ${topY} Q${leftX + 18 * scale} ${topY - 6 * scale} ${leftX + 30 * scale} ${topY + 2 * scale}`}
          fill={wLight} opacity="0.5" stroke={wDark} strokeWidth="0.4"
        />
        <path
          d={`M${rightX} ${topY} Q${rightX - 18 * scale} ${topY - 6 * scale} ${rightX - 30 * scale} ${topY + 2 * scale}`}
          fill={wLight} opacity="0.5" stroke={wDark} strokeWidth="0.4"
        />

        {/* Fold creases */}
        <path
          d={`M${leftX + 14 * scale} ${topY + 22 * scale} Q${midX} ${topY + 12 * scale} ${rightX - 14 * scale} ${topY + 22 * scale}`}
          fill="none" stroke={wDark} strokeWidth="0.8" opacity="0.1"
        />
        <path
          d={`M${leftX + 8 * scale} ${topY + 12 * scale} L${midX - 18 * scale} ${bottomY - 25 * scale}`}
          stroke={wDark} strokeWidth="0.5" opacity="0.07" fill="none"
        />
        <path
          d={`M${rightX - 8 * scale} ${topY + 12 * scale} L${midX + 18 * scale} ${bottomY - 25 * scale}`}
          stroke={wDark} strokeWidth="0.5" opacity="0.07" fill="none"
        />

        {/* Satin ribbon glossy highlight */}
        {style === 'satin-ribbon' && (
          <path
            d={`M${midX - 4 * scale} ${topY} L${midX - 4 * scale} ${bottomY}`}
            stroke="white" strokeWidth={3 * scale} opacity="0.1" fill="none"
          />
        )}
      </>
    );
  };

  const flowerBaseY = h * 0.28;

  return (
    <div className="relative" style={{ width: w, height: h }}>
      <svg width={w} height={h} className="absolute inset-0">
        {/* Stems behind wrap */}
        {renderStems()}
        {/* Wrap paper */}
        {renderWrap()}
        {/* Handle area */}
        {renderHandle()}
      </svg>

      {/* Flowers */}
      {bouquet.flowers.map((flower, i) => {
        const pos = getArrangementPositions(
          bouquet.arrangementStyle, i, bouquet.flowers.length,
          w / 2, flowerBaseY, scale
        );
        const flowerSize = (38 + ((i * 7 + 3) % 14)) * scale;
        return (
          <motion.div
            key={flower.id}
            className="absolute"
            style={{
              left: pos.x - flowerSize / 2,
              top: pos.y - flowerSize * 0.6,
              zIndex: 10 + i,
              transform: `rotate(${pos.rotation}deg)`,
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

      {/* Ribbon on wrap */}
      {bouquet.ribbonStyle !== 'none' && bouquet.ribbonStyle !== 'bow' && (
        <svg className="absolute" style={{ left: w * 0.28, top: h * 0.37, zIndex: 20 }} width={w * 0.44} height={55 * scale}>
          {bouquet.ribbonStyle === 'lace' ? (
            <>
              <rect x={0} y={16 * scale} width={w * 0.44} height={10 * scale} rx={5 * scale}
                fill={bouquet.ribbonColor} opacity="0.6" />
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
