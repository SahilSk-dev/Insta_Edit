import React from 'react';
import { BubbleTheme } from '../types/chat';

// -------------------------------------------------------------------------
// 1. Ruby Heart Vector Component (Precise Bézier Curve + Radiant Gradient)
// -------------------------------------------------------------------------
interface RubyHeartProps {
  size: number;
  rotation?: number;
  style?: React.CSSProperties;
}

export const RubyHeart: React.FC<RubyHeartProps> = ({ size, rotation = 0, style }) => {
  const gradientId = `rubyGrad_${Math.random().toString(36).substring(2, 9)}`;
  const filterId = `rubyGlow_${Math.random().toString(36).substring(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        transform: `rotate(${rotation}deg)`,
        filter: 'drop-shadow(0 6px 12px rgba(255, 22, 84, 0.65))',
        position: 'absolute',
        pointerEvents: 'none',
        ...style
      }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF758C" />
          <stop offset="50%" stopColor="#FF1654" />
          <stop offset="100%" stopColor="#990024" />
        </linearGradient>
      </defs>
      <path
        d="M 50 88 
           C 12 62, 0 42, 0 26 
           C 0 8, 22 0, 50 28 
           C 78 0, 100 8, 100 26 
           C 100 42, 88 62, 50 88 Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
};

// -------------------------------------------------------------------------
// 2. Midnight Glowing Butterfly Vector Component
// -------------------------------------------------------------------------
interface GlowingButterflyProps {
  size: number;
  rotation?: number;
  primaryColor?: string;
  secondaryColor?: string;
  style?: React.CSSProperties;
}

export const GlowingButterfly: React.FC<GlowingButterflyProps> = ({
  size,
  rotation = 0,
  primaryColor = '#00E5FF',
  secondaryColor = '#D500F9',
  style
}) => {
  const gradId = `bfGrad_${Math.random().toString(36).substring(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        transform: `rotate(${rotation}deg)`,
        filter: `drop-shadow(0 4px 10px ${primaryColor}99)`,
        position: 'absolute',
        pointerEvents: 'none',
        ...style
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="50%" stopColor={secondaryColor} />
          <stop offset="100%" stopColor="#651FFF" />
        </linearGradient>
      </defs>

      {/* Left upper wing */}
      <path
        d="M 50 50 C 30 10, 5 15, 8 40 C 10 60, 35 60, 50 50 Z"
        fill={`url(#${gradId})`}
      />
      {/* Right upper wing */}
      <path
        d="M 50 50 C 70 10, 95 15, 92 40 C 90 60, 65 60, 50 50 Z"
        fill={`url(#${gradId})`}
      />
      {/* Left lower wing */}
      <path
        d="M 50 50 C 35 65, 15 75, 22 90 C 30 98, 45 75, 50 50 Z"
        fill={`url(#${gradId})`}
      />
      {/* Right lower wing */}
      <path
        d="M 50 50 C 65 65, 85 75, 78 90 C 70 98, 55 75, 50 50 Z"
        fill={`url(#${gradId})`}
      />
      {/* Center line */}
      <line x1="50" y1="30" x2="50" y2="75" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

// -------------------------------------------------------------------------
// 3. Golden Luxe Sparkle Vector
// -------------------------------------------------------------------------
interface LuxeSparkleProps {
  size: number;
  rotation?: number;
  style?: React.CSSProperties;
}

export const LuxeSparkle: React.FC<LuxeSparkleProps> = ({ size, rotation = 0, style }) => {
  const gradId = `goldGrad_${Math.random().toString(36).substring(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        transform: `rotate(${rotation}deg)`,
        filter: 'drop-shadow(0 2px 8px rgba(255, 215, 0, 0.7))',
        position: 'absolute',
        pointerEvents: 'none',
        ...style
      }}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFF7C2" />
          <stop offset="60%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FF8C00" />
        </radialGradient>
      </defs>
      <path
        d="M 50 0 
           C 50 35, 65 50, 100 50 
           C 65 50, 50 65, 50 100 
           C 50 65, 35 50, 0 50 
           C 35 50, 50 35, 50 0 Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
};

// -------------------------------------------------------------------------
// Themed Styled Lyrics Bubble Wrapper
// -------------------------------------------------------------------------
interface AestheticLyricsBubbleProps {
  text: string;
  theme: BubbleTheme;
  fontFamily?: string;
  onClick?: () => void;
}

export const AestheticLyricsBubble: React.FC<AestheticLyricsBubbleProps> = ({
  text,
  theme,
  fontFamily = 'inherit',
  onClick
}) => {
  if (theme === 'OBSIDIAN_HEART') {
    return (
      <div
        onClick={onClick}
        style={{
          position: 'relative',
          display: 'inline-block',
          padding: '10px 14px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        {/* 1. Big Heart (Top-Left) */}
        <RubyHeart size={54} rotation={-22} style={{ top: -14, left: -12, zIndex: 3 }} />

        {/* 2. Medium Heart (Bottom-Left) */}
        <RubyHeart size={36} rotation={16} style={{ bottom: -6, left: 16, zIndex: 3 }} />

        {/* 3. Medium Heart (Top-Right-Center) */}
        <RubyHeart size={32} rotation={18} style={{ top: -12, right: 68, zIndex: 3 }} />

        {/* 4. Large Heart (Top-Right) */}
        <RubyHeart size={44} rotation={24} style={{ top: -4, right: -12, zIndex: 3 }} />

        {/* 5. Small-Medium Heart (Bottom-Right) */}
        <RubyHeart size={34} rotation={-14} style={{ bottom: -6, right: 8, zIndex: 3 }} />

        {/* Center Capsule Pill with Glowing Neon Border */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            background: 'linear-gradient(135deg, #1B0C16 0%, #2A0822 50%, #150616 100%)',
            border: '1.8px solid #FF2A6D',
            borderRadius: 9999,
            padding: '12px 28px',
            boxShadow: '0 0 24px rgba(255, 42, 109, 0.6), inset 0 0 10px rgba(255, 42, 109, 0.25)',
            textAlign: 'center',
            minWidth: 80,
            maxWidth: 290,
            wordBreak: 'break-word'
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: fontFamily,
              lineHeight: 1.4,
              letterSpacing: '0.3px',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'
            }}
          >
            {text}
          </span>
        </div>
      </div>
    );
  }

  if (theme === 'MIDNIGHT_BUTTERFLY') {
    return (
      <div
        onClick={onClick}
        style={{
          position: 'relative',
          display: 'inline-block',
          padding: '10px 14px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        {/* Top-Left Butterfly */}
        <GlowingButterfly
          size={46}
          rotation={-26}
          primaryColor="#00E5FF"
          secondaryColor="#D500F9"
          style={{ top: -14, left: -14, zIndex: 3 }}
        />

        {/* Bottom-Right Butterfly */}
        <GlowingButterfly
          size={40}
          rotation={20}
          primaryColor="#FF4081"
          secondaryColor="#7C4DFF"
          style={{ bottom: -8, right: 10, zIndex: 3 }}
        />

        {/* Top-Right Mini Butterfly */}
        <GlowingButterfly
          size={28}
          rotation={15}
          primaryColor="#69F0AE"
          secondaryColor="#40C4FF"
          style={{ top: -8, right: 12, zIndex: 3 }}
        />

        {/* Center Capsule */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)',
            border: '1.8px solid transparent',
            backgroundImage:
              'linear-gradient(135deg, #0F0C29, #302B63, #24243E), linear-gradient(135deg, #00E5FF, #D500F9)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            borderRadius: 9999,
            padding: '12px 28px',
            boxShadow: '0 0 22px rgba(213, 0, 249, 0.45), 0 0 12px rgba(0, 229, 255, 0.4)',
            textAlign: 'center',
            minWidth: 80,
            maxWidth: 290,
            wordBreak: 'break-word'
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: fontFamily,
              lineHeight: 1.4,
              letterSpacing: '0.3px',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'
            }}
          >
            {text}
          </span>
        </div>
      </div>
    );
  }

  if (theme === 'NEON_CYBER') {
    return (
      <div
        onClick={onClick}
        style={{
          position: 'relative',
          display: 'inline-block',
          padding: '8px 12px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <LuxeSparkle size={24} rotation={45} style={{ top: -6, left: -6, zIndex: 3 }} />
        <LuxeSparkle size={28} rotation={15} style={{ bottom: -6, right: 4, zIndex: 3 }} />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            background: 'linear-gradient(135deg, #051923 0%, #003554 50%, #006494 100%)',
            border: '2px solid #00F0FF',
            borderRadius: 24,
            padding: '11px 24px',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.6), inset 0 0 10px rgba(0, 240, 255, 0.2)',
            textAlign: 'center',
            minWidth: 80,
            maxWidth: 290,
            wordBreak: 'break-word'
          }}
        >
          <span
            style={{
              color: '#E0FBFC',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: fontFamily,
              lineHeight: 1.4
            }}
          >
            {text}
          </span>
        </div>
      </div>
    );
  }

  if (theme === 'GOLDEN_LUXE') {
    return (
      <div
        onClick={onClick}
        style={{
          position: 'relative',
          display: 'inline-block',
          padding: '8px 12px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <LuxeSparkle size={32} rotation={12} style={{ top: -8, left: -8, zIndex: 3 }} />
        <LuxeSparkle size={26} rotation={35} style={{ top: -6, right: 8, zIndex: 3 }} />
        <LuxeSparkle size={30} rotation={-20} style={{ bottom: -6, right: 6, zIndex: 3 }} />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            background: 'linear-gradient(135deg, #2C1E03 0%, #4A3408 50%, #1E1402 100%)',
            border: '2px solid #FFD700',
            borderRadius: 9999,
            padding: '12px 28px',
            boxShadow: '0 0 22px rgba(255, 215, 0, 0.55), inset 0 0 8px rgba(255, 215, 0, 0.25)',
            textAlign: 'center',
            minWidth: 80,
            maxWidth: 290,
            wordBreak: 'break-word'
          }}
        >
          <span
            style={{
              color: '#FFFDF0',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: fontFamily,
              lineHeight: 1.4
            }}
          >
            {text}
          </span>
        </div>
      </div>
    );
  }

  // Fallback CLASSIC
  return <span>{text}</span>;
};
