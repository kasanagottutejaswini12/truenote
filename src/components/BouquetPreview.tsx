import React from 'react';
import { useBouquet, FlowerItem } from '@/context/BouquetContext';
import FlowerSVG from '@/components/FlowerSVG';
import { motion } from 'framer-motion';

interface BouquetPreviewProps {
  isOpen?: boolean;
  onFlowerClick?: (flower: FlowerItem) => void;
  size?: 'sm' | 'md' | 'lg';
}

const BouquetPreview: React.FC<BouquetPreviewProps> = ({ isOpen = true, onFlowerClick, size = 'md' }) => {
  const { bouquet } = useBouquet();
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.2 : 1;
  const containerWidth = 320 * scale;
  const containerHeight = 420 * scale;

  const getFlowerPosition = (index: number, total: number) => {
    const centerX = containerWidth / 2;
    const baseY = containerHeight * 0.35;

    if (total === 1) return { x: centerX, y: baseY };

    const cols = Math.min(total, 4);
    const row = Math.floor(index / cols);
    const col = index % cols;
    const itemsInRow = Math.min(cols, total - row * cols);
    const rowOffset = (cols - itemsInRow) * 20 * scale;

    return {
      x: centerX - (itemsInRow - 1) * 20 * scale + col * 40 * scale + rowOffset,
      y: baseY - row * 35 * scale + (col % 2) * 10 * scale,
    };
  };

  return (
    <div className="relative" style={{ width: containerWidth, height: containerHeight }}>
      {/* Wrapping paper */}
      <svg width={containerWidth} height={containerHeight} className="absolute inset-0">
        <defs>
          <linearGradient id="wrapGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bouquet.wrapColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={bouquet.wrapColor} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Wrap cone */}
        <path
          d={`M${containerWidth * 0.15} ${containerHeight * 0.45} 
              L${containerWidth * 0.5} ${containerHeight * 0.95} 
              L${containerWidth * 0.85} ${containerHeight * 0.45} Z`}
          fill="url(#wrapGrad)"
          stroke={bouquet.wrapColor}
          strokeWidth="2"
          filter="brightness(0.95)"
        />
        {/* Wrap fold line */}
        <path
          d={`M${containerWidth * 0.2} ${containerHeight * 0.5} 
              Q${containerWidth * 0.5} ${containerHeight * 0.42} ${containerWidth * 0.8} ${containerHeight * 0.5}`}
          fill="none"
          stroke={bouquet.wrapColor}
          strokeWidth="1.5"
          opacity="0.5"
          filter="brightness(0.85)"
        />
      </svg>

      {/* Flowers */}
      {bouquet.flowers.map((flower, i) => {
        const pos = getFlowerPosition(i, bouquet.flowers.length);
        return (
          <motion.div
            key={flower.id}
            className="absolute"
            style={{
              left: pos.x - 25 * scale,
              top: pos.y - 30 * scale,
            }}
            initial={!isOpen ? { scale: 0, opacity: 0 } : false}
            animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
          >
            <FlowerSVG
              type={flower.type}
              color={flower.color}
              size={45 * scale}
              onClick={() => onFlowerClick?.(flower)}
              className={onFlowerClick ? 'hover:scale-110 transition-transform' : ''}
            />
          </motion.div>
        );
      })}

      {/* Ribbon */}
      {bouquet.ribbonStyle !== 'none' && (
        <svg className="absolute" style={{ left: containerWidth * 0.3, top: containerHeight * 0.43 }} width={containerWidth * 0.4} height={50 * scale}>
          {bouquet.ribbonStyle === 'bow' ? (
            <>
              <ellipse cx={containerWidth * 0.12} cy={20 * scale} rx={18 * scale} ry={12 * scale} fill={bouquet.ribbonColor} opacity="0.8" transform={`rotate(-20 ${containerWidth * 0.12} ${20 * scale})`} />
              <ellipse cx={containerWidth * 0.28} cy={20 * scale} rx={18 * scale} ry={12 * scale} fill={bouquet.ribbonColor} opacity="0.8" transform={`rotate(20 ${containerWidth * 0.28} ${20 * scale})`} />
              <circle cx={containerWidth * 0.2} cy={20 * scale} r={5 * scale} fill={bouquet.ribbonColor} filter="brightness(0.9)" />
            </>
          ) : (
            <rect x={0} y={15 * scale} width={containerWidth * 0.4} height={8 * scale} rx={4 * scale} fill={bouquet.ribbonColor} opacity="0.8" />
          )}
        </svg>
      )}
    </div>
  );
};

export default BouquetPreview;
