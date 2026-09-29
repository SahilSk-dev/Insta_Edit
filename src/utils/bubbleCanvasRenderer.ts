import { ChatMessage, BubbleTheme, MessageType, PhotoBorderStyle } from '../types/chat';
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
  type: MessageType;
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
  customSpacing?: number;

  // Photo / Image properties
  imageResName?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageFit?: 'cover' | 'contain';
  photoStyle?: PhotoBorderStyle;
  laserColor?: string;
  laserSpeed?: number;

  // Audio / Voice properties
  audioDuration?: string;
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
  const baseWidth = options.baseWidth || 420;
  const canvasWidth = baseWidth * scale;
  const emojiFont = options.emojiFont || 'SamsungOneUI_4_Xmas';
  const rightMargin = 14 * scale;
  const leftMargin = 14 * scale;
  const avatarSize = 28 * scale;
  const avatarGap = 8 * scale;
  const defaultGap = 6 * scale;
  const topPad = 16 * scale;
  const bottomPad = 24 * scale;

  // Accept all valid messages: TEXT with content, or IMAGE, or AUDIO, or STICKER
  const validMessages = messages.filter((m) => {
    if (m.type === 'IMAGE' || m.type === 'AUDIO' || m.type === 'STICKER') return true;
    return Boolean(m.text && m.text.trim());
  });

  let curY = topPad;

  const bubbles: MeasuredBubble[] = validMessages.map((msg) => {
    const isFromMe = msg.isFromMe;
    const theme = msg.theme || 'CLASSIC';
    const type = msg.type || 'TEXT';
    const text = (msg.text || '').trim();

    let w = 0;
    let h = 0;
    let fontSize = 15 * scale;
    let fontWeight = 400;
    let lineHeight = 20 * scale;
    let lines: string[] = [];
    let padHoriz = 12 * scale;
    let padVert = 8 * scale;
    let iconScale = 1.0;
    let fontStack = '';

    if (type === 'IMAGE') {
      const maxImgWidth = isFromMe
        ? canvasWidth - leftMargin - rightMargin
        : canvasWidth - leftMargin - avatarSize - avatarGap - rightMargin;
      const targetWidth = (msg.imageWidth || 220) * scale;
      w = Math.min(targetWidth, maxImgWidth);

      if (msg.imageHeight) {
        h = msg.imageHeight * scale;
      } else {
        const cachedImg = msg.imageResName ? getCachedChatImage(msg.imageResName) : null;
        if (cachedImg && cachedImg.naturalWidth > 0 && cachedImg.naturalHeight > 0) {
          const naturalRatio = cachedImg.naturalHeight / cachedImg.naturalWidth;
          h = Math.min(Math.round(w * naturalRatio), 260 * scale);
        } else {
          h = Math.min(Math.round(w * 1.05), 260 * scale);
        }
      }
    } else if (type === 'AUDIO') {
      w = Math.min(205 * scale, canvasWidth * 0.72);
      h = 44 * scale;
    } else if (type === 'STICKER') {
      w = 54 * scale;
      h = 54 * scale;
      lines = [text || '🔥'];
    } else {
      // TEXT message layout
      const layout = calculateBubbleLayout(text);
      const parsedFontSize = parseFloat(layout.fontSize) || 16;
      fontSize = Math.round(parsedFontSize * scale);
      const parsedLineHeight = parseFloat(layout.lineHeight) || (parsedFontSize * 1.35);
      lineHeight = Math.round(parsedLineHeight * scale);

      const padParts = layout.padding.split(' ').map((p) => parseFloat(p) || 8);
      padVert = (padParts[0] || 7.5) * scale;
      padHoriz = (padParts[1] || 14) * scale;
      const minWidth = (parseFloat(layout.minWidth) || (layout.isUltraShort ? 50 : 44)) * scale;

      const effectiveMsgEmojiFont = msg.emojiFont || emojiFont;
      fontStack = `${layout.fontWeight} ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Nirmala UI", "Kohinoor Bangla", "Noto Sans Bengali", Helvetica, Arial, '${effectiveMsgEmojiFont}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.font = fontStack;

      const maxBubbleWidth = isFromMe ? canvasWidth * 0.78 : canvasWidth * 0.72;
      const maxInnerWidth = maxBubbleWidth - padHoriz * 2;

      const rawLines = text.split('\n');
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

      let maxLineWidth = 0;
      lines.forEach((line) => {
        const lineW = ctx.measureText(line).width;
        if (lineW > maxLineWidth) maxLineWidth = lineW;
      });

      w = Math.min(
        Math.max(maxLineWidth + padHoriz * 2, minWidth),
        maxBubbleWidth
      );
      h = Math.max(lines.length * lineHeight + padVert * 2, 38 * scale);
      fontWeight = layout.fontWeight;
      iconScale = layout.iconScale;
    }

    let x = 0;
    let avatarX: number | undefined;
    let avatarY: number | undefined;

    if (isFromMe) {
      x = canvasWidth - w - rightMargin;
    } else {
      x = leftMargin + avatarSize + avatarGap;
      avatarX = leftMargin;
      avatarY = curY + h - avatarSize - 2 * scale;
    }

    const y = curY;
    const effectiveBubbleGap = msg.customSpacing !== undefined ? msg.customSpacing * scale : defaultGap;
    const finalGap = msg.reaction ? Math.max(effectiveBubbleGap, 8 * scale) : effectiveBubbleGap;
    curY += h + finalGap;

    return {
      id: msg.id,
      type,
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
      fontWeight,
      lineHeight,
      lines,
      padHoriz,
      padVert,
      iconScale,
      fontStack,
      reaction: msg.reaction,
      customSpacing: msg.customSpacing,
      imageResName: msg.imageResName,
      imageWidth: msg.imageWidth,
      imageHeight: msg.imageHeight,
      imageFit: msg.imageFit,
      photoStyle: msg.photoStyle,
      laserColor: msg.laserColor,
      laserSpeed: msg.laserSpeed,
      audioDuration: msg.audioDuration
    };
  });

  const totalHeight = curY + bottomPad;
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

// ---------------------------------------------------------------------------
// High-Reliability General Image Preloading for Photos & Canvas Recording
// ---------------------------------------------------------------------------
const chatImageCache = new Map<string, HTMLImageElement>();

export const preloadChatImage = (url: string): Promise<HTMLImageElement | null> => {
  if (!url) return Promise.resolve(null);

  const cached = chatImageCache.get(url);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }

  const domImg = findLoadedImgInDOM(url);
  if (domImg) {
    chatImageCache.set(url, domImg);
    return Promise.resolve(domImg);
  }

  return new Promise((resolve) => {
    const img = new Image();
    if (url.startsWith('http') && typeof window !== 'undefined' && !url.startsWith(window.location.origin)) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = async () => {
      try {
        if ('decode' in img) await img.decode();
      } catch {}
      chatImageCache.set(url, img);
      resolve(img);
    };
    img.onerror = () => {
      if (url !== '/avatars/gaming_post.jpg') {
        preloadChatImage('/avatars/gaming_post.jpg').then(resolve);
      } else {
        resolve(null);
      }
    };
    img.src = url;
    if (img.complete && img.naturalWidth > 0) {
      chatImageCache.set(url, img);
      resolve(img);
    }
  });
};

export const getCachedChatImage = (url: string): HTMLImageElement | null => {
  if (!url) return null;
  const cached = chatImageCache.get(url);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return cached;
  }
  const domImg = findLoadedImgInDOM(url);
  if (domImg) {
    chatImageCache.set(url, domImg);
    return domImg;
  }
  preloadChatImage(url);
  return null;
};

export const preloadAllMessagesAssets = async (messages: ChatMessage[], avatarUrl?: string): Promise<void> => {
  const promises: Promise<any>[] = [];
  if (avatarUrl) {
    promises.push(preloadAvatarImage(avatarUrl));
  }
  messages.forEach((msg) => {
    if (msg.type === 'IMAGE' && msg.imageResName) {
      promises.push(preloadChatImage(msg.imageResName));
    }
  });
  await Promise.all(promises);
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

  // 0. SPECIAL MESSAGE TYPES: STICKER, AUDIO, and IMAGE
  if (bubble.type === 'STICKER') {
    ctx.save();
    ctx.font = `${36 * scale}px "SamsungOneUI_4_Xmas", "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bubble.text || '🔥', x + w / 2, y + h / 2);
    ctx.restore();

    if (bubble.reaction) {
      drawReactionBadgeOnCanvas(ctx, bubble.reaction, x, y, w, h, isFromMe, false, scale);
    }
    return;
  }

  if (bubble.type === 'AUDIO') {
    const rTL = 18 * scale;
    const rTR = 18 * scale;
    const rBR = isFromMe ? 4 * scale : 18 * scale;
    const rBL = isFromMe ? 18 * scale : 4 * scale;
    const audioPath = createRoundedRectPath(x, y, w, h, rTL, rTR, rBR, rBL);

    ctx.save();
    if (isFromMe) {
      const grad = ctx.createLinearGradient(x, y, x + w, y + h);
      grad.addColorStop(0, '#7038F8');
      grad.addColorStop(0.5, '#8A3FFC');
      grad.addColorStop(1, '#9E27E8');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = '#262626';
    }
    ctx.fill(audioPath);
    ctx.restore();

    // Circular Play Button
    const playCircleRadius = 15 * scale;
    const playCircleX = x + 12 * scale + playCircleRadius;
    const playCircleY = y + h / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(playCircleX, playCircleY, playCircleRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.fill();

    // Play icon triangle
    ctx.beginPath();
    const triX = playCircleX + 0.5 * scale;
    const triY = playCircleY;
    const triSize = 5 * scale;
    ctx.moveTo(triX - triSize * 0.7, triY - triSize);
    ctx.lineTo(triX - triSize * 0.7, triY + triSize);
    ctx.lineTo(triX + triSize, triY);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    // Instagram Voice Waveform Bars
    const waveformBars = [4, 8, 14, 18, 11, 7, 16, 22, 15, 9, 12, 19, 11, 6, 14, 9, 4];
    const barWidth = 2.4 * scale;
    const barGap = 2.2 * scale;
    const startWaveX = playCircleX + playCircleRadius + 10 * scale;
    const waveCenterY = y + h / 2;
    const playedBarsCount = Math.floor(waveformBars.length * 0.38);

    ctx.save();
    waveformBars.forEach((bHeight, idx) => {
      const bh = bHeight * scale * 0.85;
      const bx = startWaveX + idx * (barWidth + barGap);
      const by = waveCenterY - bh / 2;

      ctx.beginPath();
      const barR = 1.2 * scale;
      const bPath = createRoundedRectPath(bx, by, barWidth, bh, barR, barR, barR, barR);
      ctx.fillStyle = idx < playedBarsCount ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)';
      ctx.fill(bPath);
    });
    ctx.restore();

    // Duration (e.g. 0:15)
    ctx.save();
    ctx.font = `600 ${11 * scale}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(bubble.audioDuration || '0:15', x + w - 12 * scale, y + h / 2);
    ctx.restore();

    if (bubble.reaction) {
      drawReactionBadgeOnCanvas(ctx, bubble.reaction, x, y, w, h, isFromMe, false, scale);
    }
    return;
  }

  if (bubble.type === 'IMAGE') {
    const isLaser = bubble.photoStyle === 'LASER';
    const laserColor = bubble.laserColor || '#8A3FFC';
    const laserSpeed = bubble.laserSpeed || 3;
    const isGradientLaser = laserColor === 'GRADIENT' || !laserColor.startsWith('#');
    const outerRadius = 16 * scale;

    const outerImgPath = createRoundedRectPath(x, y, w, h, outerRadius, outerRadius, outerRadius, outerRadius);

    if (isLaser) {
      // 1. Black base background for laser border
      ctx.save();
      ctx.fillStyle = '#0a0a0a';
      ctx.fill(outerImgPath);
      ctx.restore();

      // 2. Traveling Laser Light Beam
      ctx.save();
      ctx.clip(outerImgPath);

      const revMs = (laserSpeed || 3) * 1000;
      const rawAngle = ((timeMs % revMs) / revMs) * (Math.PI * 2);
      const angle = isFromMe ? -rawAngle : rawAngle;

      const conic = ctx.createConicGradient(angle, x + w / 2, y + h / 2);
      if (isGradientLaser) {
        conic.addColorStop(0, 'rgba(0,0,0,0)');
        conic.addColorStop(0.75, 'rgba(0,0,0,0)');
        conic.addColorStop(0.83, '#FCAF45');
        conic.addColorStop(0.9, '#F56040');
        conic.addColorStop(0.97, '#8A3FFC');
        conic.addColorStop(1, '#FFFFFF');
      } else {
        conic.addColorStop(0, 'rgba(0,0,0,0)');
        conic.addColorStop(0.75, 'rgba(0,0,0,0)');
        conic.addColorStop(0.85, `${laserColor}25`);
        conic.addColorStop(0.93, `${laserColor}cc`);
        conic.addColorStop(0.97, laserColor);
        conic.addColorStop(1, '#FFFFFF');
      }

      ctx.fillStyle = conic;
      ctx.fillRect(x - 10 * scale, y - 10 * scale, w + 20 * scale, h + 20 * scale);
      ctx.restore();

      // 3. Inner clipped frame for the photo
      const borderPad = 2.5 * scale;
      const ix = x + borderPad;
      const iy = y + borderPad;
      const iw = w - borderPad * 2;
      const ih = h - borderPad * 2;
      const innerRadius = 13.5 * scale;

      const innerImgPath = createRoundedRectPath(ix, iy, iw, ih, innerRadius, innerRadius, innerRadius, innerRadius);

      ctx.save();
      ctx.clip(innerImgPath);

      ctx.fillStyle = '#1c1c1c';
      ctx.fillRect(ix, iy, iw, ih);

      const img = bubble.imageResName ? getCachedChatImage(bubble.imageResName) : null;
      if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        const nw = img.naturalWidth;
        const nh = img.naturalHeight;
        const fit = bubble.imageFit || 'cover';

        if (fit === 'cover') {
          const imgAspect = nw / nh;
          const frameAspect = iw / ih;
          let sx = 0, sy = 0, sw = nw, sh = nh;

          if (imgAspect > frameAspect) {
            sw = nh * frameAspect;
            sx = (nw - sw) / 2;
          } else {
            sh = nw / frameAspect;
            sy = (nh - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, ix, iy, iw, ih);
        } else {
          const imgAspect = nw / nh;
          const frameAspect = iw / ih;
          let dw = iw, dh = ih, dx = ix, dy = iy;
          if (imgAspect > frameAspect) {
            dh = iw / imgAspect;
            dy = iy + (ih - dh) / 2;
          } else {
            dw = ih * imgAspect;
            dx = ix + (iw - dw) / 2;
          }
          ctx.drawImage(img, dx, dy, dw, dh);
        }
      } else {
        ctx.fillStyle = '#262626';
        ctx.fillRect(ix, iy, iw, ih);
        ctx.font = `${28 * scale}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🖼️', ix + iw / 2, iy + ih / 2);
      }
      ctx.restore();

    } else {
      // Normal Photo
      ctx.save();
      ctx.clip(outerImgPath);

      ctx.fillStyle = '#262626';
      ctx.fillRect(x, y, w, h);

      const img = bubble.imageResName ? getCachedChatImage(bubble.imageResName) : null;
      if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        const nw = img.naturalWidth;
        const nh = img.naturalHeight;
        const fit = bubble.imageFit || 'cover';

        if (fit === 'cover') {
          const imgAspect = nw / nh;
          const frameAspect = w / h;
          let sx = 0, sy = 0, sw = nw, sh = nh;

          if (imgAspect > frameAspect) {
            sw = nh * frameAspect;
            sx = (nw - sw) / 2;
          } else {
            sh = nw / frameAspect;
            sy = (nh - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
        } else {
          const imgAspect = nw / nh;
          const frameAspect = w / h;
          let dw = w, dh = h, dx = x, dy = y;
          if (imgAspect > frameAspect) {
            dh = w / imgAspect;
            dy = y + (h - dh) / 2;
          } else {
            dw = h * imgAspect;
            dx = x + (w - dw) / 2;
          }
          ctx.drawImage(img, dx, dy, dw, dh);
        }
      } else {
        ctx.fillStyle = '#262626';
        ctx.fillRect(x, y, w, h);
        ctx.font = `${28 * scale}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🖼️', x + w / 2, y + h / 2);
      }
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1 * scale;
      ctx.stroke(outerImgPath);
      ctx.restore();
    }

    if (bubble.reaction) {
      drawReactionBadgeOnCanvas(ctx, bubble.reaction, x, y, w, h, isFromMe, false, scale);
    }
    return;
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

  const targetW = Math.round(canvasWidth / 2) * 2;
  const targetH = Math.round(totalHeight / 2) * 2;

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

  // Preload and decode avatar and message photos before rendering
  await preloadAllMessagesAssets(messages, options.avatarUrl);

  const canvas = document.createElement('canvas');
  renderBubblesToCanvas(canvas, messages, performance.now(), options);
  return canvas.toDataURL('image/png');
};
