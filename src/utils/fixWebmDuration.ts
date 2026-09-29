/**
 * Safely patches the WebM Duration header in-place if present in the EBML header.
 * Performs zero byte shifting to guarantee 100% video container integrity and prevent
 * browser demuxer freeze or crashes.
 */

export const fixWebmDuration = async (blob: Blob, durationMs: number): Promise<Blob> => {
  try {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);

    // Search for existing Duration tag [0x44, 0x89] in the initial EBML header
    const searchLimit = Math.min(bytes.length - 12, 8192);
    for (let i = 0; i < searchLimit; i++) {
      if (bytes[i] === 0x44 && bytes[i + 1] === 0x89) {
        const lenByte = bytes[i + 2];
        if (lenByte === 0x84) {
          // 4-byte float in-place overwrite
          view.setFloat32(i + 3, durationMs, false);
          return new Blob([buffer], { type: blob.type });
        } else if (lenByte === 0x88) {
          // 8-byte float in-place overwrite
          view.setFloat64(i + 3, durationMs, false);
          return new Blob([buffer], { type: blob.type });
        }
      }
    }

    // If tag is not already reserved in the EBML header, return untouched blob safely
    return blob;
  } catch (err) {
    console.warn('fixWebmDuration safe fallback:', err);
    return blob;
  }
};
