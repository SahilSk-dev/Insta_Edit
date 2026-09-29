import { ChatMessage, BubbleTheme } from '../types/chat';
import { calculateBubbleLayout } from '../components/AestheticBubble';

// ---------------------------------------------------------------------------
// Pre-compiled Path2D Vector Shapes for Romantic Love Badges
// All paths are normalized inside a 100x100 box with visual center at (50, 50).
// ---------------------------------------------------------------------------
const heartPath = new Path2D(
  'M 50 86 C 14 60, 4 38, 4 24 C 4 10, 22 4, 50 26 C 78 4, 96 10, 96 24 C 96 38, 86 60, 50 86 Z'
);

const babyHeartPath = new Path2D(
  'M 22 68 C 6 54, 2 42, 2 34 C 2 24, 12 18, 22 28 C 32 18, 42 24, 42 34 C 42 42, 38 54, 22 68 Z'
);

const sparkleTwinkle1 = new Path2D(
  'M 82 8 C 82 13, 85 16, 90 16 C 85 16, 82 19, 82 24 C 82 19, 79 16, 74 16 C 79 16, 82 13, 82 8 Z'
);

const sparkleTwinkle2 = new Path2D(
  'M 20 12 C 20 16, 22 18, 26 18 C 22 18, 20 20, 20 24 C 20 20, 18 18, 14 18 C 18 18, 20 16, 20 12 Z'
);

const crownTiaraPath = new Path2D(
  'M 34 22 L 38 10 L 44 15 L 50 6 L 56 15 L 62 10 L 66 22 Z'
);

const wingLeftPath = new Path2D(
  'M 26 36 C 8 16, -2 28, 4 48 C 10 60, 24 54, 30 46 Z'
);

const wingRightPath = new Path2D(
  'M 74 36 C 92 16, 102 28, 96 48 C 90 60, 76 54, 70 46 Z'
);

export interface RenderBubblesOptions {
  scale?: number;
  baseWidth?: number;
  emojiFont?: string;
  avatarUrl?: string;
  speedMultiplier?: number;
}

interface ThemeConfig {
  bgStart: string;
  bgMid: string;
  bgEnd: string;
  conicStops: Array<{ offset: number; color: string }>;
  glowColor: string;
  sweepColor: string;
  txtColor: string;
  speedSec: number;
  type: 'HEART' | 'BUTTERFLY' | 'CYBER' | 'GOLD' | 'CLASSIC';
}

export const getThemeConfig = (theme: BubbleTheme): ThemeConfig => {
  switch (theme) {
    case 'OBSIDIAN_HEART':
      return {
        bgStart: '#1B0C16',
        bgMid: '#2A0822',
        bgEnd: '#150616',
        conicStops: [
          { offset: 0, color: '#990024' },
          { offset: 0.35, color: '#FF2A6D' },
          { offset: 0.6, color: '#FF758C' },
          { offset: 0.72, color: '#FFFFFF' }, // Laser head
          { offset: 0.82, color: '#FF2A6D' },
          { offset: 1, color: '#990024' }
        ],
        glowColor: 'rgba(255, 42, 109, 0.15)',
        sweepColor: 'rgba(255, 117, 140, 0.35)',
        txtColor: '#FFFFFF',
        speedSec: 2.2, // Snappy 2.2s speed matching modern reels
        type: 'HEART'
      };
    case 'MIDNIGHT_BUTTERFLY':
      return {
        bgStart: '#0F0C29',
        bgMid: '#302B63',
        bgEnd: '#24243E',
        conicStops: [
          { offset: 0, color: '#651FFF' },
          { offset: 0.35, color: '#D500F9' },
          { offset: 0.6, color: '#00E5FF' },
          { offset: 0.72, color: '#FFFFFF' }, // Laser head
          { offset: 0.82, color: '#00E5FF' },
          { offset: 1, color: '#651FFF' }
        ],
        glowColor: 'rgba(0, 229, 255, 0.15)',
        sweepColor: 'rgba(0, 229, 255, 0.35)',
        txtColor: '#FFFFFF',
        speedSec: 2.4,
        type: 'BUTTERFLY'
      };
    case 'NEON_CYBER':
      return {
        bgStart: '#051923',
        bgMid: '#002538',
        bgEnd: '#003554',
        conicStops: [
          { offset: 0, color: '#003554' },
          { offset: 0.35, color: '#0077B6' },
          { offset: 0.6, color: '#00F0FF' },
          { offset: 0.72, color: '#FFFFFF' }, // Laser head
          { offset: 0.82, color: '#00F0FF' },
          { offset: 1, color: '#003554' }
        ],
        glowColor: 'rgba(0, 240, 255, 0.15)',
        sweepColor: 'rgba(0, 240, 255, 0.35)',
        txtColor: '#FFFFFF',
        speedSec: 2.1,
        type: 'CYBER'
      };
    case 'GOLDEN_LUXE':
      return {
        bgStart: '#2C1E03',
        bgMid: '#3B2906',
        bgEnd: '#4A3408',
        conicStops: [
          { offset: 0, color: '#FF8C00' },
          { offset: 0.35, color: '#FFA500' },
          { offset: 0.6, color: '#FFD700' },
          { offset: 0.72, color: '#FFFFFF' }, // Laser head
          { offset: 0.82, color: '#FFD700' },
          { offset: 1, color: '#FF8C00' }
        ],
        glowColor: 'rgba(255, 215, 0, 0.15)',
        sweepColor: 'rgba(255, 215, 0, 0.35)',
        txtColor: '#FFFFFF',
        speedSec: 2.3,
        type: 'GOLD'
      };
    case 'CLASSIC':
    default:
      return {
        bgStart: '#3870F8',
        bgMid: '#7A3FE4',
        bgEnd: '#E024A8',
        conicStops: [
          { offset: 0, color: '#3870F8' },
          { offset: 0.35, color: '#7A3FE4' },
          { offset: 0.6, color: '#B832B0' },
          { offset: 0.72, color: '#FFFFFF' }, // Laser head
          { offset: 0.82, color: '#FF758C' },
          { offset: 1, color: '#3870F8' }
        ],
        glowColor: 'rgba(122, 63, 228, 0.15)',
        sweepColor: 'rgba(255, 255, 255, 0.2)',
        txtColor: '#FFFFFF',
        speedSec: 2.2,
        type: 'CLASSIC'
      };
  }
};

/**
 * Helper to build rounded rectangle Path2D with individual corner radii
 * [rTL, rTR, rBR, rBL]
 */
const createRoundedRectPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  rTL: number,
  rTR: number,
  rBR: number,
  rBL: number
): Path2D => {
  const p = new Path2D();
  p.moveTo(x + rTL, y);
  p.lineTo(x + w - rTR, y);
  p.quadraticCurveTo(x + w, y, x + w, y + rTR);
  p.lineTo(x + w, y + h - rBR);
  p.quadraticCurveTo(x + w, y + h, x + w - rBR, y + h);
  p.lineTo(x + rBL, y + h);
  p.quadraticCurveTo(x, y + h, x, y + h - rBL);
  p.lineTo(x, y + rTL);
  p.quadraticCurveTo(x, y, x + rTL, y);
  p.closePath();
  return p;
};

export interface MeasuredBubble {
  id: string;
  text: string;
  theme: BubbleTheme;
  isFromMe: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  avatarX?: number;
  avatarY?: number;
  avatarSize?: number;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  lines: string[];
  padHoriz: number;
  padVert: number;
  iconScale: number;
  fontStack: string;
  reaction?: string;
}

/**
 * Calculates exact layout of all bubbles stacked vertically:
 * Supports BOTH sides simultaneously (dui dhar eksathe) matching UI 1:1.
 * Received messages on Left (with 28px circular avatar), Sent messages on Right!
 */
export const calculateBubblesColumnLayout = (
  ctx: CanvasRenderingContext2D,
  messages: ChatMessage[],
  options: RenderBubblesOptions = {}
): { bubbles: MeasuredBubble[]; totalHeight: number; canvasWidth: number } => {
  const scale = options.scale || 2;
  const baseWidth = options.baseWidth || 380;
  const canvasWidth = baseWidth * scale;
  const emojiFont = options.emojiFont || 'SamsungOneUI_4_Xmas';
  const validMessages = messages.filter((m) => m.type === 'TEXT' && m.text.trim());
  const rightMargin = 14 * scale;
  const leftMargin = 14 * scale;
  const avatarSize = 28 * scale;
  const avatarGap = 8 * scale;
  const gap = 8 * scale;
  const topPad = 16 * scale;
  const bottomPad = 16 * scale;

  let curY = topPad;

  const bubbles: MeasuredBubble[] = validMessages.map((msg) => {
    // Both sides together ALWAYS (dui dhar eksathe): Left (incoming) with avatar, Right (outgoing)!
    const isFromMe = msg.isFromMe;
    const theme = msg.theme || 'CLASSIC';
    const text = msg.text.trim();

    // Use exact layout engine from AestheticBubble
    const layout = calculateBubbleLayout(text);
    const parsedFontSize = parseFloat(layout.fontSize) || 16;
    const fontSize = Math.round(parsedFontSize * scale);
    const parsedLineHeight = parseFloat(layout.lineHeight) || (parsedFontSize * 1.35);
    const lineHeight = Math.round(parsedLineHeight * scale);

    // Parse horizontal and vertical padding
    const padParts = layout.padding.split(' ').map((p) => parseFloat(p) || 8);
    const padVert = (padParts[0] || 7.5) * scale;
    const padHoriz = (padParts[1] || 14) * scale;
    const minWidth = (parseFloat(layout.minWidth) || (layout.isUltraShort ? 50 : 44)) * scale;

    const effectiveMsgEmojiFont = msg.emojiFont || emojiFont;
    const fontStack = `${layout.fontWeight} ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Nirmala UI", "Kohinoor Bangla", "Noto Sans Bengali", Helvetica, Arial, '${effectiveMsgEmojiFont}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.font = fontStack;

    // Max bubble width depending on whether it's sent (78%) or received (with avatar)
    const maxBubbleWidth = isFromMe ? canvasWidth * 0.78 : canvasWidth * 0.72;
    const maxInnerWidth = maxBubbleWidth - padHoriz * 2;

    // Robust line & character wrapping that NEVER overflows bubble boundaries:
    const rawLines = text.split('\n');
    const lines: string[] = [];

    rawLines.forEach((rawLine) => {
      const words = rawLine.split(' ');
      let currentLine = '';

      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth <= maxInnerWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = '';
          }

          // If the word itself is wider than maxInnerWidth, break by character
          if (ctx.measureText(word).width > maxInnerWidth) {
            let chunk = '';
            for (const char of word) {
              const testChunk = chunk + char;
              if (ctx.measureText(testChunk).width <= maxInnerWidth) {
                chunk = testChunk;
              } else {
                if (chunk) lines.push(chunk);
                chunk = char;
              }
            }
            if (chunk) currentLine = chunk;
          } else {
            currentLine = word;
          }
        }
      });

      if (currentLine) {
        lines.push(currentLine);
      }
    });

    if (lines.length === 0) lines.push(text);

    // Calculate maximum width among wrapped lines
    let maxLineWidth = 0;
    lines.forEach((line) => {
      const w = ctx.measureText(line).width;
      if (w > maxLineWidth) maxLineWidth = w;
    });

    const w = Math.min(
      Math.max(maxLineWidth + padHoriz * 2, minWidth),
      maxBubbleWidth
    );
    const h = Math.max(lines.length * lineHeight + padVert * 2, 38 * scale);

    let x = 0;
    let avatarX: number | undefined;
    let avatarY: number | undefined;

    if (isFromMe) {
      // Sent message: Aligned to the RIGHT
      x = canvasWidth - w - rightMargin;
    } else {
      // Received message: Aligned to the LEFT with 28px avatar
      x = leftMargin + avatarSize + avatarGap;
      avatarX = leftMargin;
      avatarY = curY + h - avatarSize - 2 * scale; // Bottom-aligned matching Instagram DM
    }

    const y = curY;
    const extraReactionGap = msg.reaction ? 10 * scale : 0;
    curY += h + gap + extraReactionGap;

    return {
      id: msg.id,
      text,
      theme,
      isFromMe,
      x,
      y,
      w,
      h,
      avatarX,
      avatarY,
      avatarSize: !isFromMe ? avatarSize : undefined,
      fontSize,
      fontWeight: layout.fontWeight,
      lineHeight,
      lines,
      padHoriz,
      padVert,
      iconScale: layout.iconScale,
      fontStack,
      reaction: msg.reaction
    };
  });

  const totalHeight = curY - gap + bottomPad;
  return { bubbles, totalHeight, canvasWidth };
};

// ---------------------------------------------------------------------------
// High-Performance Offscreen Badge Cache
// Pre-renders love badges once so live 60 FPS animation takes 0ms CPU time!
// ---------------------------------------------------------------------------
const badgeCanvasCache = new Map<string, HTMLCanvasElement>();

export const getOrCreateBadgeCanvas = (
  theme: BubbleTheme,
  variant: 'GLOSSY_HEART' | 'SPARKLE_HEART' | 'TWIN_HEARTS' | 'CROWN_HEART' | 'BUTTERFLY_HEART',
  targetSize: number
): HTMLCanvasElement => {
  const roundedSize = Math.max(16, Math.round(targetSize));
  const cacheKey = `${theme}_${variant}_${roundedSize}`;
  const existing = badgeCanvasCache.get(cacheKey);
  if (existing) return existing;

  const off = document.createElement('canvas');
  // Safe margin around canvas to ensure zero clipping
  off.width = Math.round(roundedSize * 1.8);
  off.height = Math.round(roundedSize * 1.8);
  const ctx = off.getContext('2d');
  if (!ctx) return off;

  const half = off.width / 2;
  ctx.save();
  ctx.translate(half, half);
  const s = roundedSize / 100;
  ctx.scale(s, s);
  ctx.translate(-50, -50); // Exact center of 100x100 viewBox at (0, 0)!

  // Colors based on theme
  let c1 = '#FF758C';
  let c2 = '#FF1654';
  let c3 = '#990024';

  if (theme === 'MIDNIGHT_BUTTERFLY') {
    c1 = '#00E5FF';
    c2 = '#D500F9';
    c3 = '#651FFF';
  } else if (theme === 'NEON_CYBER') {
    c1 = '#E0FBFC';
    c2 = '#00F0FF';
    c3 = '#0077B6';
  } else if (theme === 'GOLDEN_LUXE') {
    c1 = '#FFF7C2';
    c2 = '#FFD700';
    c3 = '#FF8C00';
  } else if (theme === 'CLASSIC') {
    c1 = '#7A3FE4';
    c2 = '#B832B0';
    c3 = '#E024A8';
  }

  // Linear gradient
  const grad = ctx.createLinearGradient(0, 0, 100, 100);
  grad.addColorStop(0, c1);
  grad.addColorStop(0.5, c2);
  grad.addColorStop(1, c3);

  // Butterfly Wings
  if (variant === 'BUTTERFLY_HEART') {
    ctx.save();
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.85;
    ctx.fill(wingLeftPath);
    ctx.fill(wingRightPath);
    ctx.restore();
  }

  // Baby Heart
  if (variant === 'TWIN_HEARTS') {
    ctx.save();
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.9;
    ctx.fill(babyHeartPath);
    ctx.restore();
  }

  // Main Love Heart Body
  ctx.fillStyle = grad;
  ctx.fill(heartPath);

  // Glossy 3D shine reflection highlight
  ctx.save();
  ctx.translate(30, 22);
  ctx.rotate((-28 * Math.PI) / 180);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Crown Tiara
  if (variant === 'CROWN_HEART') {
    ctx.save();
    ctx.fillStyle = '#FFE57F';
    ctx.strokeStyle = '#FFA000';
    ctx.lineWidth = 1.5;
    ctx.fill(crownTiaraPath);
    ctx.stroke(crownTiaraPath);
    ctx.restore();
  }

  // Sparkles
  if (variant === 'SPARKLE_HEART') {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill(sparkleTwinkle1);
    ctx.globalAlpha = 0.8;
    ctx.fill(sparkleTwinkle2);
    ctx.restore();
  }

  ctx.restore();

  badgeCanvasCache.set(cacheKey, off);
  return off;
};

/**
 * Draws a Love Badge with lightning-fast GPU texture blit (0.001ms)
 */
export const drawLoveBadgeFast = (
  ctx: CanvasRenderingContext2D,
  theme: BubbleTheme,
  variant: 'GLOSSY_HEART' | 'SPARKLE_HEART' | 'TWIN_HEARTS' | 'CROWN_HEART' | 'BUTTERFLY_HEART',
  centerX: number,
  centerY: number,
  size: number,
  rotationDeg: number
) => {
  const badgeCanvas = getOrCreateBadgeCanvas(theme, variant, size);
  const half = badgeCanvas.width / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.drawImage(badgeCanvas, -half, -half);
  ctx.restore();
};

/**
 * Draws the floating circular reaction badge matching Instagram DM
 */
export const drawReactionBadgeOnCanvas = (
  ctx: CanvasRenderingContext2D,
  reaction: string,
  x: number,
  y: number,
  w: number,
  h: number,
  isFromMe: boolean,
  isThemed: boolean,
  scale: number
) => {
  const rxSize = 22 * scale;
  const rxRadius = rxSize / 2;
  // In Instagram DM:
  // For sent message (isFromMe): bottom-left corner
  // For received message (!isFromMe): bottom-right corner
  const rxX = isFromMe ? x + (isThemed ? 10 : 6) * scale : x + w - (isThemed ? 10 : 6) * scale - rxSize;
  const rxY = y + h - 8 * scale;

  ctx.save();
  // 1. Dark circular pill background
  ctx.beginPath();
  ctx.arc(rxX + rxRadius, rxY + rxRadius, rxRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#1E1E1E';
  ctx.fill();

  // 2. Pure black 2px border outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 3. Draw emoji inside badge
  ctx.font = `${11.5 * scale}px "SamsungOneUI_4_Xmas", "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(reaction, rxX + rxRadius, rxY + rxRadius + 0.5 * scale);
  ctx.restore();
};

// ---------------------------------------------------------------------------
// High-Reliability Avatar Image Preloading & Caching for Canvas & Video Recording
// ---------------------------------------------------------------------------
const avatarImgCache = new Map<string, HTMLImageElement>();

/**
 * Searches the DOM for an existing <img> tag that is already loaded and decoded
 */
const findLoadedImgInDOM = (url: string): HTMLImageElement | null => {
  if (typeof document === 'undefined' || !url) return null;
  const domImgs = Array.from(document.images);
  for (const img of domImgs) {
    if (img.complete && img.naturalWidth > 0) {
      if (
        img.src === url ||
        img.getAttribute('src') === url ||
        (url.startsWith('/') && (img.src.endsWith(url) || img.src.includes(url)))
      ) {
        return img;
      }
    }
  }
  return null;
};

/**
 * Preloads and fully decodes avatar image before canvas paint/recording starts.
 * Reuses existing DOM image for 0ms instant display.
 */
export const preloadAvatarImage = (url: string): Promise<HTMLImageElement | null> => {
  if (!url) return Promise.resolve(null);

  // 1. Fast in-memory cache hit
  const cached = avatarImgCache.get(url);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  // 2. Instant hit from already-rendered DOM image in ChatTopBar/ChatMessageItem
  const domImg = findLoadedImgInDOM(url);
  if (domImg) {
    avatarImgCache.set(url, domImg);
    return Promise.resolve(domImg);
  }

  // 3. Robust async image loader
  return new Promise((resolve) => {
    const img = new Image();

    // Only set crossOrigin for remote http(s) URLs outside the current origin
    if (url.startsWith('http') && typeof window !== 'undefined' && !url.startsWith(window.location.origin)) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = async () => {
      try {
        if ('decode' in img) {
          await img.decode();
        }
      } catch {
        // Non-fatal if decode fails
      }
      avatarImgCache.set(url, img);
      resolve(img);
    };

    img.onerror = () => {
      // If the provided url fails to load, fallback to default sahil_avatar.jpg
      if (url !== '/avatars/sahil_avatar.jpg') {
        preloadAvatarImage('/avatars/sahil_avatar.jpg').then(resolve);
      } else {
        resolve(null);
      }
    };

    img.src = url;

    // In case browser loaded it synchronously
    if (img.complete && img.naturalWidth > 0) {
      avatarImgCache.set(url, img);
      resolve(img);
    }
  });
};

export const getCachedAvatarImage = (url: string): HTMLImageElement | null => {
  if (!url) return null;
  const cached = avatarImgCache.get(url);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return cached;
  }
  const domImg = findLoadedImgInDOM(url);
  if (domImg) {
    avatarImgCache.set(url, domImg);
    return domImg;
  }
  // Trigger background preload
  preloadAvatarImage(url);
  return null;
};

/**
 * Draws a single pristine bubble with razor-sharp 2px border beam,
 * animated light sweep, corner love badges, and crisp typography.
 */
export const drawBubbleToCanvas = (
  ctx: CanvasRenderingContext2D,
  bubble: MeasuredBubble,
  timeMs: number,
  scale: number = 2,
  avatarUrl?: string,
  speedMultiplier: number = 1.0
) => {
  const { x, y, w, h, theme, isFromMe, lines, lineHeight, fontStack, iconScale } = bubble;
  const cfg = getThemeConfig(theme);

  // Draw Avatar for received messages (aligned to bottom of the message)
  if (bubble.avatarX !== undefined && bubble.avatarY !== undefined && bubble.avatarSize) {
    const ax = bubble.avatarX;
    const ay = bubble.avatarY;
    const asz = bubble.avatarSize;
    const radius = asz / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(ax + radius, ay + radius, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const avatarImg = avatarUrl ? getCachedAvatarImage(avatarUrl) : null;
    if (avatarImg) {
      // Aspect-ratio preserving cover crop matching CSS object-fit: cover
      const nw = avatarImg.naturalWidth || avatarImg.width;
      const nh = avatarImg.naturalHeight || avatarImg.height;
      if (nw > 0 && nh > 0) {
        const minDim = Math.min(nw, nh);
        const sx = (nw - minDim) / 2;
        const sy = (nh - minDim) / 2;
        ctx.drawImage(avatarImg, sx, sy, minDim, minDim, ax, ay, asz, asz);
      } else {
        ctx.drawImage(avatarImg, ax, ay, asz, asz);
      }
    } else {
      // Clean Instagram dark grey circle with subtle avatar silhouette placeholder
      ctx.fillStyle = '#262626';
      ctx.fillRect(ax, ay, asz, asz);

      ctx.fillStyle = '#8E8E93';
      ctx.beginPath();
      ctx.arc(ax + radius, ay + radius * 0.72, radius * 0.36, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ax + radius, ay + asz * 1.05, radius * 0.65, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Subtle 1px circular border matching Instagram DM
    ctx.save();
    ctx.beginPath();
    ctx.arc(ax + radius, ay + radius, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // Outer corner radii:
  // For sent: Top-Left: 18, Top-Right: 18, Bottom-Right: 4 (sharp tail), Bottom-Left: 18
  // For received: Top-Left: 18, Top-Right: 18, Bottom-Right: 18, Bottom-Left: 4
  const rTL = 18 * scale;
  const rTR = 18 * scale;
  const rBR = isFromMe ? 4 * scale : 18 * scale;
  const rBL = isFromMe ? 18 * scale : 4 * scale;

  const outerPath = createRoundedRectPath(x, y, w, h, rTL, rTR, rBR, rBL);
  const isThemed = Boolean(theme && theme !== 'CLASSIC');

  // 1. FOR NORMAL DEFAULT BUBBLES: Render clean, authentic Instagram DM bubble (NO laser border, NO love badges, NO shining!)
  if (!isThemed) {
    ctx.save();
    if (isFromMe) {
      // Sent: Authentic Instagram blue-to-pink gradient
      const grad = ctx.createLinearGradient(x, y, x + w, y);
      grad.addColorStop(0, '#3870F8');
      grad.addColorStop(0.4, '#7A3FE4');
      grad.addColorStop(0.75, '#B832B0');
      grad.addColorStop(1, '#E024A8');
      ctx.fillStyle = grad;
    } else {
      // Received: Authentic solid dark grey bubble
      ctx.fillStyle = '#262626';
    }
    ctx.fill(outerPath);
    ctx.restore();

    // Clean white typography (no badges, no laser!)
    ctx.save();
    ctx.font = fontStack;
    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = 'middle';

    const totalTextHeight = lines.length * lineHeight;
    const startY = y + (h - totalTextHeight) / 2 + lineHeight / 2;

    lines.forEach((line, lineIdx) => {
      const textY = startY + lineIdx * lineHeight;
      const textX = x + w / 2;
      ctx.textAlign = 'center';
      ctx.fillText(line, textX, textY);
    });
    ctx.restore();

    if (bubble.reaction) {
      drawReactionBadgeOnCanvas(ctx, bubble.reaction, x, y, w, h, isFromMe, false, scale);
    }
    return;
  }

  // 2. FOR THEMED AESTHETIC BUBBLES: Crisp clean black base outline
  ctx.save();
  ctx.shadowColor = cfg.glowColor;
  ctx.shadowBlur = 1 * scale;
  ctx.fillStyle = '#000000';
  ctx.fill(outerPath);
  ctx.restore();

  // 3. Smooth Edge Laser Border (Conic gradient clipped strictly inside outerPath)
  ctx.save();
  ctx.clip(outerPath);

  // High-precision smooth angle calculation for edge laser
  const revPeriodMs = (cfg.speedSec / (speedMultiplier || 1.0)) * 1000;
  const rawAngle = ((timeMs % revPeriodMs) / revPeriodMs) * (Math.PI * 2);
  const angle = isFromMe ? -rawAngle : rawAngle; // Reverse on sent bubbles

  const conic = ctx.createConicGradient(angle, x + w / 2, y + h / 2);
  cfg.conicStops.forEach((stop) => {
    conic.addColorStop(stop.offset, stop.color);
  });

  ctx.fillStyle = conic;
  ctx.fillRect(x - 4 * scale, y - 4 * scale, w + 8 * scale, h + 8 * scale);
  ctx.restore();

  // 4. Inner Bubble Path (inset by exact 2px laser border width)
  const borderPx = 2 * scale;
  const ix = x + borderPx;
  const iy = y + borderPx;
  const iw = w - borderPx * 2;
  const ih = h - borderPx * 2;

  const irTL = 16 * scale;
  const irTR = 16 * scale;
  const irBR = isFromMe ? 2.5 * scale : 16 * scale;
  const irBL = isFromMe ? 16 * scale : 2.5 * scale;

  const innerPath = createRoundedRectPath(ix, iy, iw, ih, irTL, irTR, irBR, irBL);

  // Fill inner bubble background (clean, deep solid background - NO SHINING SWEEP OVER TEXT!)
  ctx.save();
  const bgGrad = ctx.createLinearGradient(ix, iy, ix + iw, iy + ih);
  bgGrad.addColorStop(0, cfg.bgStart);
  bgGrad.addColorStop(0.5, cfg.bgMid);
  bgGrad.addColorStop(1, cfg.bgEnd);
  ctx.fillStyle = bgGrad;
  ctx.fill(innerPath);

  // Subtle 1px inner border highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1 * scale;
  ctx.stroke(innerPath);
  ctx.restore();

  // 5. Corner Love Badges - firmly anchored directly ON the border curve
  const badgeSize = Math.round(18 * scale * (iconScale || 1.0));
  const subBadgeSize = Math.round(14 * scale * (iconScale || 1.0));

  // Deterministic variety matching AestheticBubble.tsx
  const hash = bubble.text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let primaryVariant: 'GLOSSY_HEART' | 'SPARKLE_HEART' | 'TWIN_HEARTS' | 'CROWN_HEART' | 'BUTTERFLY_HEART' = 'GLOSSY_HEART';
  if (theme === 'OBSIDIAN_HEART') {
    primaryVariant = hash % 2 === 0 ? 'SPARKLE_HEART' : 'GLOSSY_HEART';
  } else if (theme === 'MIDNIGHT_BUTTERFLY') {
    primaryVariant = hash % 2 === 0 ? 'BUTTERFLY_HEART' : 'TWIN_HEARTS';
  } else if (theme === 'NEON_CYBER') {
    primaryVariant = hash % 2 === 0 ? 'SPARKLE_HEART' : 'GLOSSY_HEART';
  } else if (theme === 'GOLDEN_LUXE') {
    primaryVariant = hash % 2 === 0 ? 'CROWN_HEART' : 'SPARKLE_HEART';
  } else {
    primaryVariant = hash % 2 === 0 ? 'SPARKLE_HEART' : 'TWIN_HEARTS';
  }

  const secondaryVariant = hash % 2 === 0 ? 'GLOSSY_HEART' : 'TWIN_HEARTS';

  if (isFromMe) {
    // Top-Right: firmly anchored on border shoulder curve
    drawLoveBadgeFast(
      ctx,
      theme,
      primaryVariant,
      x + w - 10 * scale,
      y + 2 * scale,
      badgeSize,
      14
    );
    // Bottom-Left: firmly anchored on bottom-left curve
    drawLoveBadgeFast(
      ctx,
      theme,
      secondaryVariant,
      x + 10 * scale,
      y + h - 2 * scale,
      subBadgeSize,
      -12
    );
  } else {
    // Top-Left: firmly anchored on top-left curve
    drawLoveBadgeFast(
      ctx,
      theme,
      primaryVariant,
      x + 10 * scale,
      y + 2 * scale,
      badgeSize,
      -14
    );
    // Bottom-Right: firmly anchored on bottom-right curve
    drawLoveBadgeFast(
      ctx,
      theme,
      secondaryVariant,
      x + w - 10 * scale,
      y + h - 2 * scale,
      subBadgeSize,
      12
    );
  }

  // 6. Solid Crystal Clear White Typography & Emojis
  ctx.save();
  ctx.font = fontStack;
  ctx.fillStyle = cfg.txtColor;
  ctx.textBaseline = 'middle';

  const totalTextHeight = lines.length * lineHeight;
  const startY = iy + (ih - totalTextHeight) / 2 + lineHeight / 2;

  lines.forEach((line, lineIdx) => {
    const textY = startY + lineIdx * lineHeight;
    let textX = ix + iw / 2;
    ctx.textAlign = 'center';
    ctx.fillText(line, textX, textY);
  });

  ctx.restore();

  if (bubble.reaction) {
    drawReactionBadgeOnCanvas(ctx, bubble.reaction, x, y, w, h, isFromMe, true, scale);
  }
};

/**
 * Main function: Renders the entire column of chat bubbles to canvas.
 * Can take a pre-computed layout for ultra-high-speed 60 FPS live recording without lag.
 */
export const renderBubblesToCanvas = (
  canvas: HTMLCanvasElement,
  messages: ChatMessage[],
  timeMs: number,
  options: RenderBubblesOptions = {},
  cachedLayout?: { bubbles: MeasuredBubble[]; totalHeight: number; canvasWidth: number }
): { totalHeight: number; canvasWidth: number; bubbles: MeasuredBubble[] } => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { totalHeight: 0, canvasWidth: 0, bubbles: [] };

  const layout = cachedLayout || calculateBubblesColumnLayout(ctx, messages, options);
  const { bubbles, totalHeight, canvasWidth } = layout;

  const targetW = Math.round(canvasWidth);
  const targetH = Math.round(totalHeight);

  if (canvas.width !== targetW) {
    canvas.width = targetW;
  }
  if (canvas.height !== targetH) {
    canvas.height = targetH;
  }

  // Pure pitch black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const scale = options.scale || 2;
  const avatarUrl = options.avatarUrl;
  const speedMult = options.speedMultiplier || 1.0;

  bubbles.forEach((b) => {
    drawBubbleToCanvas(ctx, b, timeMs, scale, avatarUrl, speedMult);
  });

  return { totalHeight, canvasWidth, bubbles };
};

/**
 * Lossless high-speed snapshot capture of bubbles column to PNG data URL:
 * Preloads fonts and profile avatar so the exact photo/logo is always rendered crisply!
 */
export const captureBubblesScreenshot = async (
  messages: ChatMessage[],
  options: RenderBubblesOptions = {}
): Promise<string> => {
  // Wait for fonts to be ready so emoji and text render with exact layout
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {}
  }

  // Preload and decode avatar image before rendering
  if (options.avatarUrl) {
    await preloadAvatarImage(options.avatarUrl);
  }

  const canvas = document.createElement('canvas');
  renderBubblesToCanvas(canvas, messages, performance.now(), options);
  return canvas.toDataURL('image/png');
};
