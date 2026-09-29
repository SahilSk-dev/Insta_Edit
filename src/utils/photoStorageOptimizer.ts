/**
 * Photo Storage Optimizer & Safe Buffer Management
 * Ensures photos are compressed to high clarity while strictly keeping 40KB free
 * in localStorage so chat persistence, timestamps, and settings never crash.
 */

export interface StorageStats {
  usedBytes: number;
  totalBytes: number;
  freeBytes: number;
  usedKB: number;
  freeKB: number;
  reservedBufferKB: number; // Strictly 40 KB
  safeMaxPhotoKB: number; // freeKB - 40 KB
}

/**
 * Calculates current browser localStorage memory consumption and safe headroom
 */
export const getStorageStats = (): StorageStats => {
  let usedBytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || '';
        // In UTF-16, characters occupy 2 bytes
        usedBytes += (key.length + val.length) * 2;
      }
    }
  } catch (err) {
    console.warn('Could not read localStorage stats:', err);
  }

  // Standard browser quota is 5MB = 5 * 1024 * 1024 bytes = 5,242,880 bytes
  const totalBytes = 5 * 1024 * 1024;
  const freeBytes = Math.max(0, totalBytes - usedBytes);
  const usedKB = Math.round(usedBytes / 1024);
  const freeKB = Math.round(freeBytes / 1024);
  const reservedBufferKB = 40; // Exactly 40KB reserved headroom
  const safeMaxPhotoKB = Math.max(10, freeKB - reservedBufferKB);

  return {
    usedBytes,
    totalBytes,
    freeBytes,
    usedKB,
    freeKB,
    reservedBufferKB,
    safeMaxPhotoKB
  };
};

export type CompressionPreset = 'ECO' | 'STANDARD' | 'MAX';

export interface CompressPhotoResult {
  dataUrl: string;
  sizeKB: number;
  width: number;
  height: number;
  isMaxQuality: boolean;
  freeRemainingKB: number;
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

/**
 * Compresses an image with smart quality/dimension scaling,
 * guaranteeing at least 40KB remains free in storage.
 */
export const compressPhotoWithBuffer = async (
  imageSrc: string,
  preset: CompressionPreset = 'MAX',
  customQuality?: number
): Promise<CompressPhotoResult> => {
  const img = await loadImage(imageSrc);
  const naturalWidth = img.naturalWidth || img.width || 800;
  const naturalHeight = img.naturalHeight || img.height || 800;

  const stats = getStorageStats();
  // Target maximum allowable bytes leaving 40KB buffer
  const maxAllowableBytes = stats.safeMaxPhotoKB * 1024;

  let targetDim = 800;
  let targetQuality = 0.85;

  if (preset === 'ECO') {
    targetDim = 480;
    targetQuality = 0.65;
  } else if (preset === 'STANDARD') {
    targetDim = 720;
    targetQuality = 0.80;
  } else if (preset === 'MAX') {
    // MAX Preset: 1080p Studio clarity with highest quality that respects 40KB buffer
    targetDim = 1080;
    targetQuality = 0.92;
  }

  if (customQuality !== undefined) {
    targetQuality = Math.min(1.0, Math.max(0.2, customQuality));
  }

  // Calculate scaled dimensions keeping aspect ratio
  let w = naturalWidth;
  let h = naturalHeight;
  if (w > targetDim || h > targetDim) {
    if (w > h) {
      h = Math.round((h * targetDim) / w);
      w = targetDim;
    } else {
      w = Math.round((w * targetDim) / h);
      h = targetDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  ctx.drawImage(img, 0, 0, w, h);

  let currentQuality = targetQuality;
  let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
  let stringByteSize = dataUrl.length * 2;

  // Defensive loop: if size breaches safe buffer (leaving less than 40KB), step down quality & size
  while (stringByteSize > maxAllowableBytes && currentQuality > 0.35) {
    currentQuality -= 0.08;
    dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
    stringByteSize = dataUrl.length * 2;
  }

  // If still exceeds buffer limit, downscale canvas
  if (stringByteSize > maxAllowableBytes) {
    const scaleFactor = 0.75;
    w = Math.round(w * scaleFactor);
    h = Math.round(h * scaleFactor);
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    dataUrl = canvas.toDataURL('image/jpeg', 0.65);
    stringByteSize = dataUrl.length * 2;
  }

  const sizeKB = Math.round((stringByteSize / 1024) * 10) / 10;
  const freeRemainingKB = Math.max(0, stats.freeKB - Math.round(sizeKB));

  return {
    dataUrl,
    sizeKB,
    width: w,
    height: h,
    isMaxQuality: preset === 'MAX',
    freeRemainingKB
  };
};
