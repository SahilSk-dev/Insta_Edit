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

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        transform: `rotate(${rotation}deg)`,
        filter: 'drop-shadow(0 2px 6px rgba(255, 22, 84, 0.6))',
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 4,
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
        filter: `drop-shadow(0 2px 6px ${primaryColor}88)`,
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 4,
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
        filter: 'drop-shadow(0 2px 6px rgba(255, 215, 0, 0.6))',
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 4,
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
// Compact: Normal chat bubble size + Glowing Border + Tasteful Accents
// -------------------------------------------------------------------------
interface AestheticLyricsBubbleProps {
  text: string;
  theme: BubbleTheme;
  isFromMe?: boolean;
  fontFamily?: string;
  onClick?: () => void;
}

export const AestheticLyricsBubble: React.FC<AestheticLyricsBubbleProps> = ({
  text,
  theme,
  isFromMe = false,
  fontFamily = 'inherit',
  onClick
}) => {
  // Exact same border radius as normal Instagram bubble
  const normalBorderRadius = isFromMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px';

  if (theme === 'OBSIDIAN_HEART') {
    return (
      <div
        onClick={onClick}
        style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: 280
        }}
      >
        {/* Subtle cute Ruby Hearts gently hugging the border */}
        <RubyHeart size={20} rotation={-18} style={{ top: -7, right: -5 }} />
        <RubyHeart size={14} rotation={14} style={{ top: -5, left: 16 }} />
        <RubyHeart size={16} rotation={15} style={{ bottom: -5, right: 14 }} />

        {/* Normal-sized Chat Bubble with Glowing Neon Border */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            background: 'linear-gradient(135deg, #1B0C16 0%, #2A0822 50%, #150616 100%)',
            border: '1.5px solid #FF2A6D',
            borderRadius: normalBorderRadius,
            padding: '10px 16px',
            boxShadow: '0 0 12px rgba(255, 42, 109, 0.45), inset 0 0 6px rgba(255, 42, 109, 0.2)',
            color: '#FFFFFF',
            fontSize: 15,
            lineHeight: '20px',
            wordBreak: 'break-word',
            fontFamily: fontFamily
          }}
        >
          {text}
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
          maxWidth: 280
        }}
      >
        {/* Cute compact butterflies hugging corners */}
        <GlowingButterfly
          size={22}
          rotation={-20}
          primaryColor="#00E5FF"
          secondaryColor="#D500F9"
          style={{ top: -8, right: -6 }}
        />
        <GlowingButterfly
          size={16}
          rotation={18}
          primaryColor="#FF4081"
          secondaryColor="#7C4DFF"
          style={{ bottom: -6, left: 14 }}
        />

        {/* Normal-sized Chat Bubble with Midnight Glow */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)',
            border: '1.5px solid #00E5FF',
            borderRadius: normalBorderRadius,
            padding: '10px 16px',
            boxShadow: '0 0 12px rgba(0, 229, 255, 0.4), 0 0 6px rgba(213, 0, 249, 0.3)',
            color: '#FFFFFF',
            fontSize: 15,
            lineHeight: '20px',
            wordBreak: 'break-word',
            fontFamily: fontFamily
          }}
        >
          {text}
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
          maxWidth: 280
        }}
      >
        <LuxeSparkle size={18} rotation={45} style={{ top: -6, right: -5 }} />
        <LuxeSparkle size={14} rotation={15} style={{ bottom: -5, left: 12 }} />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            background: 'linear-gradient(135deg, #051923 0%, #003554 100%)',
            border: '1.5px solid #00F0FF',
            borderRadius: normalBorderRadius,
            padding: '10px 16px',
            boxShadow: '0 0 12px rgba(0, 240, 255, 0.5), inset 0 0 6px rgba(0, 240, 255, 0.2)',
            color: '#E0FBFC',
            fontSize: 15,
            lineHeight: '20px',
            wordBreak: 'break-word',
            fontFamily: fontFamily
          }}
        >
          {text}
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
          maxWidth: 280
        }}
      >
        <LuxeSparkle size={20} rotation={12} style={{ top: -7, right: -5 }} />
        <LuxeSparkle size={15} rotation={-20} style={{ bottom: -5, left: 14 }} />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            background: 'linear-gradient(135deg, #2C1E03 0%, #4A3408 100%)',
            border: '1.5px solid #FFD700',
            borderRadius: normalBorderRadius,
            padding: '10px 16px',
            boxShadow: '0 0 12px rgba(255, 215, 0, 0.45), inset 0 0 6px rgba(255, 215, 0, 0.2)',
            color: '#FFFDF0',
            fontSize: 15,
            lineHeight: '20px',
            wordBreak: 'break-word',
            fontFamily: fontFamily
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  // Fallback CLASSIC
  return <span>{text}</span>;
};
