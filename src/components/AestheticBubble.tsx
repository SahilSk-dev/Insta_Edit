import React from 'react';
import { BubbleTheme } from '../types/chat';

// -------------------------------------------------------------------------
// Aesthetic Love Badge Component (Romantic Love Shapes / Pinned Jewels)
// -------------------------------------------------------------------------
export type LoveBadgeVariant =
  | 'GLOSSY_HEART'
  | 'SPARKLE_HEART'
  | 'TWIN_HEARTS'
  | 'CROWN_HEART'
  | 'BUTTERFLY_HEART';

interface AestheticLoveBadgeProps {
  theme: BubbleTheme;
  variant?: LoveBadgeVariant;
  size: number;
  rotation?: number;
  style?: React.CSSProperties;
}

export const AestheticLoveBadge: React.FC<AestheticLoveBadgeProps> = ({
  theme,
  variant = 'GLOSSY_HEART',
  size,
  rotation = 0,
  style
}) => {
  const gradId = `loveGrad_${theme}_${variant}`;

  let c1 = '#FF758C';
  let c2 = '#FF1654';
  let c3 = '#990024';
  let glowCol = 'rgba(255, 42, 109, 0.45)';

  if (theme === 'MIDNIGHT_BUTTERFLY') {
    c1 = '#00E5FF';
    c2 = '#D500F9';
    c3 = '#651FFF';
    glowCol = 'rgba(0, 229, 255, 0.45)';
  } else if (theme === 'NEON_CYBER') {
    c1 = '#E0FBFC';
    c2 = '#00F0FF';
    c3 = '#0077B6';
    glowCol = 'rgba(0, 240, 255, 0.45)';
  } else if (theme === 'GOLDEN_LUXE') {
    c1 = '#FFF7C2';
    c2 = '#FFD700';
    c3 = '#FF8C00';
    glowCol = 'rgba(255, 215, 0, 0.45)';
  } else if (theme === 'CLASSIC') {
    c1 = '#7A3FE4';
    c2 = '#B832B0';
    c3 = '#E024A8';
    glowCol = 'rgba(184, 50, 176, 0.45)';
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="-15 -15 130 130"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: '50% 50%',
        filter: `drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 3px ${glowCol})`,
        position: 'absolute',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 5,
        ...style
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="50%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </linearGradient>
      </defs>

      {/* Butterfly Wings for BUTTERFLY_HEART */}
      {variant === 'BUTTERFLY_HEART' && (
        <>
          <path
            d="M 26 36 C 8 16, -2 28, 4 48 C 10 60, 24 54, 30 46 Z"
            fill={`url(#${gradId})`}
            opacity="0.85"
          />
          <path
            d="M 74 36 C 92 16, 102 28, 96 48 C 90 60, 76 54, 70 46 Z"
            fill={`url(#${gradId})`}
            opacity="0.85"
          />
        </>
      )}

      {/* Baby Heart for TWIN_HEARTS */}
      {variant === 'TWIN_HEARTS' && (
        <path
          d="M 22 68 C 6 54, 2 42, 2 34 C 2 24, 12 18, 22 28 C 32 18, 42 24, 42 34 C 42 42, 38 54, 22 68 Z"
          fill={`url(#${gradId})`}
          opacity="0.9"
        />
      )}

      {/* Main Love Heart Body */}
      <path
        d="M 50 86 
           C 14 60, 4 38, 4 24 
           C 4 10, 22 4, 50 26 
           C 78 4, 96 10, 96 24 
           C 96 38, 86 60, 50 86 Z"
        fill={`url(#${gradId})`}
      />

      {/* Glossy 3D shine reflection highlight */}
      <ellipse
        cx="30"
        cy="22"
        rx="9"
        ry="4.5"
        transform="rotate(-28 30 22)"
        fill="rgba(255, 255, 255, 0.45)"
      />

      {/* Crown Tiara for CROWN_HEART */}
      {variant === 'CROWN_HEART' && (
        <path
          d="M 34 22 L 38 10 L 44 15 L 50 6 L 56 15 L 62 10 L 66 22 Z"
          fill="#FFE57F"
          stroke="#FFA000"
          strokeWidth="1.5"
        />
      )}

      {/* Sparkle Twinkles for SPARKLE_HEART */}
      {variant === 'SPARKLE_HEART' && (
        <>
          <path
            d="M 82 8 C 82 13, 85 16, 90 16 C 85 16, 82 19, 82 24 C 82 19, 79 16, 74 16 C 79 16, 82 13, 82 8 Z"
            fill="#FFFFFF"
          />
          <path
            d="M 20 12 C 20 16, 22 18, 26 18 C 22 18, 20 20, 20 24 C 20 20, 18 18, 14 18 C 18 18, 20 16, 20 12 Z"
            fill="#FFFFFF"
            opacity="0.8"
          />
        </>
      )}
    </svg>
  );
};

// -------------------------------------------------------------------------
// Typography & Layout Engine: Dynamically calculates optimal font size,
// line height, padding, minWidth, and font family based on content script and length
// -------------------------------------------------------------------------
export interface BubbleLayout {
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
  padding: string;
  minWidth: string;
  isShort: boolean;
  isUltraShort: boolean;
  textAlign: 'center' | 'left';
  iconScale: number;
  effectiveFont: string;
  hasBengali: boolean;
  isEmojiOnly: boolean;
}

export const calculateBubbleLayout = (text: string, userFontFamily?: string): BubbleLayout => {
  const trimmed = text.trim();
  const charCount = trimmed.length;

  // 1. Detect Script
  const hasBengali = /[\u0980-\u09FF]/.test(trimmed);
  const isEmojiOnly = /^(?:(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\u200d|[\uFE00-\uFE0F]|\ud83c[\udffb-\udfff])+|[❤️🔥✨🦋👑🌙💗⚡\s])+$/u.test(trimmed);

  // 2. System Font Stack: strictly prioritize native device system font for all text (English, Bengali, etc.)
  const systemFontStack = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Nirmala UI", "Kohinoor Bangla", "Noto Sans Bengali", Helvetica, Arial, sans-serif';
  let effectiveFont = systemFontStack;
  if (userFontFamily && (userFontFamily.includes('FL Bonolota') || userFontFamily.includes('FL Chirkut') || userFontFamily.includes('FL Mahfuj'))) {
    effectiveFont = userFontFamily;
  } else if (userFontFamily) {
    effectiveFont = `${userFontFamily}, ${systemFontStack}`;
  }

  // 3. Dynamic Font Size, Weight, Line Height, Padding & Min Width Engine
  let fontSize = '15px';
  let fontWeight = 450;
  let lineHeight = '22px';
  let letterSpacing = 'normal';
  let padding = '7.5px 14px';
  let minWidth = 'auto';
  let isShort = false;
  let isUltraShort = false;
  let textAlign: 'center' | 'left' = 'left';
  let iconScale = 1.0;

  if (isEmojiOnly && charCount <= 6) {
    fontSize = charCount <= 2 ? '28px' : '23px';
    lineHeight = '1.25';
    padding = '5px 12px';
    minWidth = '46px';
    textAlign = 'center';
    isShort = true;
    isUltraShort = true;
    iconScale = 0.72;
  } else if (charCount <= 5) {
    // Ultra-short words (e.g. "hii", "HII", "ok", "hey", "you?")
    isUltraShort = true;
    isShort = true;
    fontSize = hasBengali ? '18px' : '20px'; // 20px makes English 'hii' prominent, crisp, bold!
    fontWeight = 600;
    lineHeight = hasBengali ? '25px' : '23px';
    letterSpacing = hasBengali ? '0.2px' : '0.3px';
    padding = hasBengali ? '6.5px 14px' : '5px 13px';
    minWidth = hasBengali ? '58px' : '50px';
    textAlign = 'center';
    iconScale = 0.7;
  } else if (charCount <= 14) {
    // Short phrases (e.g. "Good morning", "Kemon acho?", "Bhalo achi")
    isShort = true;
    fontSize = hasBengali ? '17.5px' : '17.5px';
    fontWeight = 550;
    lineHeight = hasBengali ? '24px' : '22.5px';
    letterSpacing = '0.2px';
    padding = hasBengali ? '7px 14px' : '6px 13px';
    minWidth = 'auto';
    textAlign = 'left';
    iconScale = 0.85;
  } else if (charCount <= 32) {
    // Medium phrases
    fontSize = hasBengali ? '16.5px' : '16px';
    fontWeight = 500;
    lineHeight = hasBengali ? '23px' : '22px';
    padding = hasBengali ? '7.5px 14px' : '7px 13.5px';
    minWidth = 'auto';
    textAlign = 'left';
    iconScale = 0.95;
  } else {
    // Long paragraphs
    fontSize = '15px';
    fontWeight = 450;
    lineHeight = hasBengali ? '22px' : '21.5px';
    padding = hasBengali ? '8px 14px' : '7px 13px';
    minWidth = 'auto';
    textAlign = 'left';
    iconScale = 1.0;
  }

  return {
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    padding,
    minWidth,
    isShort,
    isUltraShort,
    textAlign,
    iconScale,
    effectiveFont,
    hasBengali,
    isEmojiOnly
  };
};

export const EMOJI_SPLIT_REGEX = /((?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\u200d|[\uFE00-\uFE0F]|\ud83c[\udffb-\udfff])+|[❤️🔥✨🦋👑🌙💗⚡])/u;
export const IS_EMOJI_REGEX = /^(?:(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\u200d|[\uFE00-\uFE0F]|\ud83c[\udffb-\udfff])+|[❤️🔥✨🦋👑🌙💗⚡])+$/u;

// Solid, high-contrast text rendering with dedicated emoji font support
export const renderBubbleTextWithEmojiFont = (
  text: string,
  emojiFont?: string,
  fontWeight: number = 500,
  textColor: string = '#FFFFFF'
) => {
  const parts = text.split(EMOJI_SPLIT_REGEX);
  const effectiveFont = emojiFont || 'var(--active-emoji-font)';
  return parts.map((part, index) => {
    if (!part) return null;
    if (IS_EMOJI_REGEX.test(part)) {
      return (
        <span
          key={index}
          style={{
            display: 'inline',
            fontFamily: `'${effectiveFont}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`,
            color: 'initial',
            WebkitTextFillColor: 'initial',
            WebkitBackgroundClip: 'unset',
            backgroundClip: 'unset',
            background: 'none'
          }}
        >
          {part}
        </span>
      );
    }
    return (
      <span
        key={index}
        style={{
          display: 'inline',
          whiteSpace: 'pre-wrap',
          color: textColor,
          fontWeight
        }}
      >
        {part}
      </span>
    );
  });
};

// -------------------------------------------------------------------------
// Themed Styled Lyrics Bubble Wrapper with Isolated Spinning Conic Border,
// Light Sweep, Corner Jewels, and Proper Distance Separation
// -------------------------------------------------------------------------
interface AestheticLyricsBubbleProps {
  text: string;
  theme: BubbleTheme;
  isFromMe?: boolean;
  fontFamily?: string;
  emojiFont?: string;
  onClick?: () => void;
}

export const AestheticLyricsBubble: React.FC<AestheticLyricsBubbleProps> = ({
  text,
  theme,
  isFromMe = false,
  fontFamily = 'inherit',
  emojiFont,
  onClick
}) => {
  const borderRadius = isFromMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px';
  const innerRadius = isFromMe ? '16px 16px 3px 16px' : '16px 16px 16px 3px';

  let config = {
    c1: '#FF2A6D',
    c2: '#FF758C',
    c3: '#990024',
    speed: '2.2s',
    bg: 'linear-gradient(135deg, #1B0C16 0%, #2A0822 50%, #150616 100%)',
    borderGlow: '#FF2A6D',
    boxShadow: '0 0 3px rgba(255, 42, 109, 0.22)',
    glowA: 'rgba(255, 42, 109, 0.15)',
    glowB: 'rgba(255, 42, 109, 0.25)',
    sweepColor: 'rgba(255, 117, 140, 0.35)',
    txtColor: '#FF758C'
  };

  if (theme === 'MIDNIGHT_BUTTERFLY') {
    config = {
      c1: '#00E5FF',
      c2: '#D500F9',
      c3: '#651FFF',
      speed: '2.4s',
      bg: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)',
      borderGlow: '#00E5FF',
      boxShadow: '0 0 3px rgba(0, 229, 255, 0.22)',
      glowA: 'rgba(0, 229, 255, 0.15)',
      glowB: 'rgba(213, 0, 249, 0.25)',
      sweepColor: 'rgba(0, 229, 255, 0.35)',
      txtColor: '#A7F3D0'
    };
  } else if (theme === 'NEON_CYBER') {
    config = {
      c1: '#00F0FF',
      c2: '#0077B6',
      c3: '#00E5FF',
      speed: '2.1s',
      bg: 'linear-gradient(135deg, #051923 0%, #003554 100%)',
      borderGlow: '#00F0FF',
      boxShadow: '0 0 3px rgba(0, 240, 255, 0.22)',
      glowA: 'rgba(0, 240, 255, 0.15)',
      glowB: 'rgba(0, 240, 255, 0.25)',
      sweepColor: 'rgba(0, 240, 255, 0.35)',
      txtColor: '#E0FBFC'
    };
  } else if (theme === 'GOLDEN_LUXE') {
    config = {
      c1: '#FFD700',
      c2: '#FFA500',
      c3: '#FF8C00',
      speed: '2.3s',
      bg: 'linear-gradient(135deg, #2C1E03 0%, #4A3408 100%)',
      borderGlow: '#FFD700',
      boxShadow: '0 0 3px rgba(255, 215, 0, 0.22)',
      glowA: 'rgba(255, 215, 0, 0.15)',
      glowB: 'rgba(255, 215, 0, 0.25)',
      sweepColor: 'rgba(255, 215, 0, 0.35)',
      txtColor: '#FFFDF0'
    };
  }

  const getBeamGradient = (theme: BubbleTheme) => {
  if (theme === 'MIDNIGHT_BUTTERFLY') {
    return `conic-gradient(from 0deg, #651FFF 0%, #D500F9 35%, #00E5FF 60%, #FFFFFF 72%, #00E5FF 82%, #651FFF 100%)`;
  }
  if (theme === 'NEON_CYBER') {
    return `conic-gradient(from 0deg, #003554 0%, #0077B6 35%, #00F0FF 60%, #FFFFFF 72%, #00F0FF 82%, #003554 100%)`;
  }
  if (theme === 'GOLDEN_LUXE') {
    return `conic-gradient(from 0deg, #FF8C00 0%, #FFA500 35%, #FFD700 60%, #FFFFFF 72%, #FFD700 82%, #FF8C00 100%)`;
  }
    return `conic-gradient(from 0deg, #990024 0%, #FF2A6D 35%, #FF758C 60%, #FFFFFF 72%, #FF2A6D 82%, #990024 100%)`;
  };

  const layout = calculateBubbleLayout(text, fontFamily);

  // Corner edge elements based on theme - placed at Top-Right and Bottom-Left for sent bubbles (media_1790623866321.png)
  // Corner edge love shapes - firmly attached to the border curve (no falling off / gap)
  const renderEdgeIcons = () => {
    // Deterministic random love shape based on text characters
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    let primaryVariant: LoveBadgeVariant = 'GLOSSY_HEART';
    let secondaryVariant: LoveBadgeVariant = 'GLOSSY_HEART';

    if (theme === 'OBSIDIAN_HEART') {
      primaryVariant = hash % 2 === 0 ? 'SPARKLE_HEART' : 'GLOSSY_HEART';
      secondaryVariant = 'TWIN_HEARTS';
    } else if (theme === 'MIDNIGHT_BUTTERFLY') {
      primaryVariant = hash % 2 === 0 ? 'BUTTERFLY_HEART' : 'TWIN_HEARTS';
      secondaryVariant = 'GLOSSY_HEART';
    } else if (theme === 'NEON_CYBER') {
      primaryVariant = hash % 2 === 0 ? 'SPARKLE_HEART' : 'GLOSSY_HEART';
      secondaryVariant = 'TWIN_HEARTS';
    } else if (theme === 'GOLDEN_LUXE') {
      primaryVariant = hash % 2 === 0 ? 'CROWN_HEART' : 'SPARKLE_HEART';
      secondaryVariant = 'GLOSSY_HEART';
    } else {
      primaryVariant = hash % 2 === 0 ? 'SPARKLE_HEART' : 'TWIN_HEARTS';
      secondaryVariant = 'GLOSSY_HEART';
    }

    const mainSize = Math.round(18 * layout.iconScale);
    const subSize = Math.round(14 * layout.iconScale);

    if (isFromMe) {
      return (
        <>
          {/* Main Love Shape: Firmly anchored on Top-Right border shoulder curve */}
          <AestheticLoveBadge
            theme={theme}
            variant={primaryVariant}
            size={mainSize}
            rotation={14}
            style={{
              top: layout.isUltraShort ? -4 : -5,
              right: layout.isUltraShort ? 6 : 8
            }}
          />
          {/* Secondary Love Shape: Firmly anchored on Bottom-Left border shoulder curve */}
          <AestheticLoveBadge
            theme={theme}
            variant={secondaryVariant}
            size={subSize}
            rotation={-12}
            style={{
              bottom: layout.isUltraShort ? -3 : -4,
              left: layout.isUltraShort ? 6 : 8
            }}
          />
        </>
      );
    } else {
      return (
        <>
          {/* Main Love Shape: Firmly anchored on Top-Left border shoulder curve */}
          <AestheticLoveBadge
            theme={theme}
            variant={primaryVariant}
            size={mainSize}
            rotation={-14}
            style={{
              top: layout.isUltraShort ? -4 : -5,
              left: layout.isUltraShort ? 6 : 8
            }}
          />
          {/* Secondary Love Shape: Firmly anchored on Bottom-Right border shoulder curve */}
          <AestheticLoveBadge
            theme={theme}
            variant={secondaryVariant}
            size={subSize}
            rotation={12}
            style={{
              bottom: layout.isUltraShort ? -3 : -4,
              right: layout.isUltraShort ? 6 : 8
            }}
          />
        </>
      );
    }
  };



  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'inline-block',
        maxWidth: '100%',
        margin: '3px 0',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <style>{`
        @keyframes spinConicBorder {
          to { transform: rotate(1turn); }
        }
      `}</style>

      {/* Edge Vector Component (Floats on corners without clipping) */}
      {renderEdgeIcons()}

      {/* Neon Border Container: STRICTLY overflow: hidden so spinning conic-gradient is locked inside border */}
      <div
        style={{
          position: 'relative',
          borderRadius: borderRadius,
          padding: '2px',
          overflow: 'hidden',
          boxShadow: config.boxShadow,
          backgroundColor: '#000000'
        }}
      >
        {/* Spinning Conic Gradient Laser Border - Concentrated bright laser beam travels along edge */}
        <div
          style={{
            position: 'absolute',
            inset: '-150%',
            background: getBeamGradient(theme),
            animation: `spinConicBorder ${config.speed} linear infinite ${isFromMe ? 'reverse' : 'normal'}`,
            borderRadius: 'inherit',
            zIndex: 0
          }}
        />

        {/* Inner Bubble Content: Dynamically sized by Typography & Layout Engine */}
        <div
          style={{
            position: 'relative',
            borderRadius: innerRadius,
            background: config.bg,
            padding: layout.padding,
            minWidth: layout.minWidth,
            fontFamily: layout.effectiveFont,
            fontSize: layout.fontSize,
            fontWeight: layout.fontWeight,
            lineHeight: layout.lineHeight,
            letterSpacing: layout.letterSpacing,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            textAlign: layout.textAlign,
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.9)',
            zIndex: 1
          }}
        >
          {/* Text with native colored emoji & solid crystal clear white typography */}
          <span
            style={{
              position: 'relative',
              zIndex: 3,
              display: 'inline',
              color: '#FFFFFF',
              whiteSpace: 'pre-wrap'
            }}
          >
            {renderBubbleTextWithEmojiFont(text, emojiFont, layout.fontWeight, '#FFFFFF')}
          </span>
        </div>
      </div>
    </div>
  );
};
