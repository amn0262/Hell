import React, { useState, useEffect, useMemo } from 'react';

interface HellSymbolProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'idle';
  animate?: boolean;
  className?: string;
  isClock?: boolean;
}

export const HellSymbol: React.FC<HellSymbolProps> = ({
  size = 'hero',
  animate = false,
  className = '',
  isClock = true,
}) => {
  const dimensionMap = {
    sm: 36,
    md: 56,
    lg: 120,
    hero: 192,
    idle: 220,
  };

  const dim = dimensionMap[size];

  // Current time state
  const [time, setTime] = useState<Date>(() => new Date());

  useEffect(() => {
    if (!isClock) return;
    const interval = setInterval(() => {
      setTime(new Date());
    }, 100); // 10Hz smooth mechanical cadence
    return () => clearInterval(interval);
  }, [isClock]);

  // Compute angles & coordinates
  const { hourPos, minutePos, secondPos, hourAngle, minuteAngle, secondAngle, timeString } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    const secFraction = seconds + milliseconds / 1000;
    const minFraction = minutes + secFraction / 60;
    const hourFraction = (hours % 12) + minFraction / 60;

    const hAngle = hourFraction * 30; // 360 / 12 = 30 deg/hr
    const mAngle = minFraction * 6; // 360 / 60 = 6 deg/min
    const sAngle = secFraction * 6; // 360 / 60 = 6 deg/sec

    const polarToCartesian = (radius: number, angleInDegrees: number, cx = 50, cy = 50) => {
      const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
      return {
        x: cx + radius * Math.cos(angleInRadians),
        y: cy + radius * Math.sin(angleInRadians),
      };
    };

    // Radii in 100x100 SVG coordinate space:
    // - Hour indicator (Red Dot): inner circle (r = 33)
    // - Minute indicator: intermediate track (r = 41.5)
    // - Second indicator: outer rim (r = 48.5)
    const hPos = isClock ? polarToCartesian(33, hAngle) : polarToCartesian(33, 315);
    const mPos = isClock ? polarToCartesian(41.5, mAngle) : polarToCartesian(41.5, 45);
    const sPos = isClock ? polarToCartesian(48.5, sAngle) : polarToCartesian(48.5, 180);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const tStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    return {
      hourPos: hPos,
      minutePos: mPos,
      secondPos: sPos,
      hourAngle: hAngle,
      minuteAngle: mAngle,
      secondAngle: sAngle,
      timeString: tStr,
    };
  }, [time, isClock]);

  // Generate 12 hour calibration ticks
  const hourTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      const angleRad = (angle - 90) * (Math.PI / 180);
      const isCardinal = i % 3 === 0; // 12, 3, 6, 9
      const rInner = isCardinal ? 44.5 : 46.2;
      const rOuter = 48.5;

      ticks.push({
        id: i,
        x1: 50 + rInner * Math.cos(angleRad),
        y1: 50 + rInner * Math.sin(angleRad),
        x2: 50 + rOuter * Math.cos(angleRad),
        y2: 50 + rOuter * Math.sin(angleRad),
        isCardinal,
      });
    }
    return ticks;
  }, []);

  // Minute graduation dots (every 5 minutes, 12 dots on intermediate orbit)
  const minuteGraduations = useMemo(() => {
    const dots = [];
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      const angleRad = (angle - 90) * (Math.PI / 180);
      dots.push({
        id: i,
        cx: 50 + 41.5 * Math.cos(angleRad),
        cy: 50 + 41.5 * Math.sin(angleRad),
      });
    }
    return dots;
  }, []);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: dim, height: dim }}
      title={`NØX // ${timeString}`}
      role="img"
      aria-label={`Zeitmesser: ${timeString}`}
    >
      {/* Ambient Red Glow Halo */}
      <div
        className={`absolute inset-0 rounded-full bg-red-600/15 pointer-events-none transition-opacity duration-1000 ${
          animate ? 'blur-[45px] animate-pulse' : 'blur-[35px]'
        }`}
        style={{ transform: 'scale(0.95)' }}
      />

      {/* Main SVG Dial Framework */}
      <svg
        viewBox="0 0 100 100"
        className="relative w-full h-full pointer-events-none"
        fill="none"
      >
        <defs>
          {/* Intense Red Glow for the Hour Balance Dot */}
          <filter id="red-dot-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* White Glow for Minute Jewel */}
          <filter id="white-jewel-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Outer Geometric Calibration Rim */}
        <circle
          cx="50"
          cy="50"
          r="48.5"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.6"
        />

        {/* 2. Concentric Minute Orbit Ring */}
        <circle
          cx="50"
          cy="50"
          r="41.5"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.4"
          strokeDasharray="0.6 2"
        />

        {/* 3. Concentric Hour Orbit Ring (Inner Circle) */}
        <circle
          cx="50"
          cy="50"
          r="33"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="0.5"
        />

        {/* 4. Innermost Subtle Dotted Boundary */}
        <circle
          cx="50"
          cy="50"
          r="21"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.4"
          strokeDasharray="1 2"
        />

        {/* 5. Twelve Hour Dial Calibrations (12, 3, 6, 9 Cardinal + Intermediate Ticks) */}
        {hourTicks.map((tick) => (
          <line
            key={tick.id}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.isCardinal ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.28)'}
            strokeWidth={tick.isCardinal ? 0.8 : 0.45}
            strokeLinecap="round"
          />
        ))}

        {/* 6. Minute Graduation Dots on intermediate track */}
        {size !== 'sm' &&
          minuteGraduations.map((dot) => (
            <circle
              key={dot.id}
              cx={dot.cx}
              cy={dot.cy}
              r="0.4"
              fill="rgba(255,255,255,0.25)"
            />
          ))}

        {/* 7. Crystalline Core Facet Polygon (Geometric Balance) */}
        <polygon
          points="50,18 80,78 20,78"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="0.5"
        />
        <line
          x1="50"
          y1="18"
          x2="50"
          y2="78"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="0.5"
          strokeDasharray="1 2"
        />

        {/* 8. Central Precision Axes */}
        <line
          x1="50"
          y1="25"
          x2="50"
          y2="75"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.5"
        />
        <line
          x1="32"
          y1="50"
          x2="68"
          y2="50"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.5"
        />

        {/* 9. Second Hand Indicator (Satellite Precision Pointer) */}
        {/* Hairline Sweeping Radius */}
        <line
          x1="50"
          y1="50"
          x2={secondPos.x}
          y2={secondPos.y}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.35"
          strokeDasharray="1.5 1.5"
        />
        {/* Second Perimeter Jewel / Satellite Diamond */}
        <g transform={`translate(${secondPos.x}, ${secondPos.y})`}>
          <circle
            cx="0"
            cy="0"
            r="1.4"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="0.4"
          />
          <circle cx="0" cy="0" r="0.8" fill="#FFFFFF" />
        </g>

        {/* 10. Minute Hand Indicator (Luminous White Jewel) */}
        {/* Hairline Radius to Minute Point */}
        <line
          x1="50"
          y1="50"
          x2={minutePos.x}
          y2={minutePos.y}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.5"
        />
        {/* Luminous Minute Jewel Point */}
        <g transform={`translate(${minutePos.x}, ${minutePos.y})`}>
          <circle
            cx="0"
            cy="0"
            r="2.2"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.45"
          />
          <circle
            cx="0"
            cy="0"
            r="1.3"
            fill="#FFFFFF"
            filter="url(#white-jewel-glow)"
          />
        </g>

        {/* 11. Hour Hand Indicator (The Signature Red Focal Dot) */}
        {/* Hairline Ray from Center to Hour Dot */}
        <line
          x1="50"
          y1="50"
          x2={hourPos.x}
          y2={hourPos.y}
          stroke="#FF3B30"
          strokeWidth="0.65"
          strokeOpacity="0.5"
          strokeDasharray="1 1"
        />
        {/* The Signature Focal Balance Red Dot */}
        <g transform={`translate(${hourPos.x}, ${hourPos.y})`}>
          {/* Outer Crimson Glow Disc */}
          <circle
            cx="0"
            cy="0"
            r="3.5"
            fill="#FF3B30"
            opacity="0.35"
            filter="url(#red-dot-glow)"
          />
          {/* Solid Red Core */}
          <circle cx="0" cy="0" r="2.2" fill="#FF3B30" />
          {/* Specular Highlight Point */}
          <circle cx="-0.5" cy="-0.5" r="0.6" fill="#FFA39E" opacity="0.9" />
        </g>

        {/* 12. Center Pivot Mechanical Jewel */}
        <circle
          cx="50"
          cy="50"
          r="2.4"
          fill="#050505"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="0.5"
        />
        <circle cx="50" cy="50" r="0.9" fill="#FF3B30" />
      </svg>
    </div>
  );
};

