import React from 'react';

interface HellSymbolProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'idle';
  animate?: boolean;
  className?: string;
}

export const HellSymbol: React.FC<HellSymbolProps> = ({
  size = 'hero',
  animate = false,
  className = '',
}) => {
  const dimensionMap = {
    sm: 36,
    md: 56,
    lg: 120,
    hero: 192,
    idle: 220,
  };

  const dim = dimensionMap[size];

  // Scale factor relative to hero (192px)
  const scale = dim / 192;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: dim, height: dim }}
    >
      {/* Ambient Red Glow */}
      <div
        className={`absolute inset-0 rounded-full bg-red-600/15 pointer-events-none transition-opacity duration-1000 ${
          animate ? 'blur-[45px] animate-pulse' : 'blur-[35px]'
        }`}
        style={{ transform: 'scale(0.95)' }}
      />

      {/* Main Outer Geometric Circle */}
      <div
        className={`relative w-full h-full rounded-full border-[0.5px] border-white/20 flex items-center justify-center transition-transform duration-700 ${
          animate ? 'animate-[spin_45s_linear_infinite]' : ''
        }`}
      >
        {/* Cardinal Precision Calibration Marks */}
        <div className="absolute top-0 w-2 h-[1px] bg-white/40 left-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 w-2 h-[1px] bg-white/40 left-1/2 -translate-x-1/2" />
        <div className="absolute left-0 h-2 w-[1px] bg-white/40 top-1/2 -translate-y-1/2" />
        <div className="absolute right-0 h-2 w-[1px] bg-white/40 top-1/2 -translate-y-1/2" />

        {/* Concentric Inner Geometric Circle */}
        <div
          className="absolute rounded-full border-[0.5px] border-white/10 flex items-center justify-center"
          style={{ width: `${66 * scale}%`, height: `${66 * scale}%`, minWidth: dim * 0.66, minHeight: dim * 0.66 }}
        >
          {/* Innermost subtle dotted boundary */}
          <div
            className="absolute rounded-full border-[0.5px] border-dashed border-white/10"
            style={{ width: `${65 * scale}%`, height: `${65 * scale}%`, minWidth: dim * 0.42, minHeight: dim * 0.42 }}
          />
        </div>

        {/* Central Vertical Precision Axis */}
        <div
          className="w-[1px] bg-gradient-to-b from-transparent via-white/80 to-transparent relative z-10"
          style={{ height: `${dim * 0.5}px` }}
        />

        {/* Horizontal Hairline Axis Intersection */}
        <div
          className="h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent absolute z-10"
          style={{ width: `${dim * 0.35}px` }}
        />

        {/* Crystalline Core Facet Polygon (Whispering Monolith Lines) */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          fill="none"
        >
          <polygon
            points="50,18 80,78 20,78"
            stroke="white"
            strokeWidth="0.5"
          />
          <line x1="50" y1="18" x2="50" y2="78" stroke="white" strokeWidth="0.5" strokeDasharray="1 2" />
        </svg>

        {/* The Signature Focal Balance Singularity point */}
        <div
          className="absolute bg-[#FF3B30] rounded-full shadow-[0_0_10px_#FF3B30] z-20"
          style={{
            width: Math.max(3, Math.round(8 * scale)),
            height: Math.max(3, Math.round(8 * scale)),
            top: `${26 * scale}%`,
            left: `${26 * scale}%`,
          }}
        >
          <div className="absolute inset-0 rounded-full bg-[#FF3B30] blur-[2px]" />
        </div>
      </div>
    </div>
  );
};
