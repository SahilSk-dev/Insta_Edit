/**
 * Fixes WebM EBML header duration for MediaRecorder output in browsers.
 * Chromium does not write the duration tag in WebM recordings, causing video players
 * to display wrong duration or disable seeking. This patches the exact duration into
 * the WebM file before download.
 */

export const fixWebmDuration = async (blob: Blob, durationMs: number): Promise<Blob> => {
  try {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);

    // 1. Search for existing Duration tag [0x44, 0x89]
    for (let i = 0; i < Math.min(bytes.length - 12, 8192); i++) {
      if (bytes[i] === 0x44 && bytes[i + 1] === 0x89) {
        const lenByte = bytes[i + 2];
        if (lenByte === 0x84) {
          // 4-byte float
          view.setFloat32(i + 3, durationMs, false);
          return new Blob([view], { type: blob.type });
        } else if (lenByte === 0x88) {
          // 8-byte float
          view.setFloat64(i + 3, durationMs, false);
          return new Blob([view], { type: blob.type });
        }
      }
    }

    // 2. If not found, inject Duration tag into Info element [0x15, 0x49, 0xA9, 0x66]
    for (let i = 0; i < Math.min(bytes.length - 5, 8192); i++) {
      if (
        bytes[i] === 0x15 &&
        bytes[i + 1] === 0x49 &&
        bytes[i + 2] === 0xA9 &&
        bytes[i + 3] === 0x66
      ) {
        const offset = i + 4;
        let infoLen = 0;
        let vintLen = 0;
        const firstByte = bytes[offset];

        if (firstByte & 0x80) {
          vintLen = 1;
          infoLen = firstByte & 0x7F;
        } else if (firstByte & 0x40) {
          vintLen = 2;
          infoLen = ((firstByte & 0x3F) << 8) | bytes[offset + 1];
        } else if (firstByte & 0x20) {
          vintLen = 3;
          infoLen = ((firstByte & 0x1F) << 16) | (bytes[offset + 1] << 8) | bytes[offset + 2];
        } else if (firstByte & 0x10) {
          vintLen = 4;
          infoLen =
            ((firstByte & 0x0F) << 24) |
            (bytes[offset + 1] << 16) |
            (bytes[offset + 2] << 8) |
            bytes[offset + 3];
        }

        const durationTag = new Uint8Array(11);
        durationTag[0] = 0x44;
        durationTag[1] = 0x89;
        durationTag[2] = 0x88; // 8-byte float
        const durView = new DataView(durationTag.buffer);
        durView.setFloat64(3, durationMs, false);

        const insertPos = offset + vintLen;
        const newBuf = new Uint8Array(bytes.length + 11);
        newBuf.set(bytes.subarray(0, insertPos), 0);
        newBuf.set(durationTag, insertPos);
        newBuf.set(bytes.subarray(insertPos), insertPos + 11);

        const newInfoLen = infoLen + 11;
        if (vintLen === 1 && newInfoLen < 128) {
          newBuf[offset] = 0x80 | newInfoLen;
        } else if (vintLen === 2) {
          newBuf[offset] = 0x40 | ((newInfoLen >> 8) & 0x3F);
          newBuf[offset + 1] = newInfoLen & 0xFF;
        }

        return new Blob([newBuf], { type: blob.type });
      }
    }

    return blob;
  } catch (err) {
    console.warn('fixWebmDuration fallback to original blob:', err);
    return blob;
  }
};
