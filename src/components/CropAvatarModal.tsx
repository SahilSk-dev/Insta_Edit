import React, { useState, useRef, useEffect } from 'react';

interface CropAvatarModalProps {
  imageSrc: string;
  onApply: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

const PREVIEW_SIZE = 260; // 260px circular preview frame

export const CropAvatarModal: React.FC<CropAvatarModalProps> = ({
  imageSrc,
  onApply,
  onCancel
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPanRef = useRef({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let isCancelled = false;
    const img = new Image();
    if (imageSrc.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      if (!isCancelled) {
        imgRef.current = img;
        const w = img.naturalWidth || img.width || 300;
        const h = img.naturalHeight || img.height || 300;
        setDimensions({ width: w, height: h });
        setImgLoaded(true);
      }
    };
    img.onerror = () => {
      if (!isCancelled) {
        console.warn('Failed to load image in CropAvatarModal, fallback ready');
        setImgLoaded(true);
      }
    };
    img.src = imageSrc;
    if (img.complete && img.naturalWidth > 0) {
      imgRef.current = img;
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImgLoaded(true);
    }
    return () => {
      isCancelled = true;
    };
  }, [imageSrc]);

  // Pointer drag handling with pointer capture for buttery smooth interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPanRef.current = { ...pan };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPan({
      x: initialPanRef.current.x + deltaX,
      y: initialPanRef.current.y + deltaY
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
  };

  // Optional mouse wheel zooming
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setZoom((prev) => {
      const next = prev - e.deltaY * 0.002;
      return Math.min(3.5, Math.max(1, parseFloat(next.toFixed(2))));
    });
  };

  // Reset positioning & zoom
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Calculate base dimensions matching preview circle
  const aspect = dimensions.width && dimensions.height
    ? dimensions.width / dimensions.height
    : 1;

  let baseWidth = PREVIEW_SIZE;
  let baseHeight = PREVIEW_SIZE;
  if (aspect >= 1) {
    // Landscape or square: fits vertical circle, overflows horizontal
    baseHeight = PREVIEW_SIZE;
    baseWidth = PREVIEW_SIZE * aspect;
  } else {
    // Portrait: fits horizontal circle, overflows vertical
    baseWidth = PREVIEW_SIZE;
    baseHeight = PREVIEW_SIZE / aspect;
  }

  // Perform circular crop on high-res canvas
  const handleCropAndSave = () => {
    try {
      if (!imgRef.current || !dimensions.width) {
        onApply(imageSrc);
        return;
      }
      const img = imgRef.current;

      const outputSize = 360; // 360x360 crisp Instagram avatar
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onApply(imageSrc);
        return;
      }

      const scaleFactor = outputSize / PREVIEW_SIZE;

      const currentWidth = baseWidth * zoom;
      const currentHeight = baseHeight * zoom;

      // Center of preview circle + pan offsets
      const imgCenterX = PREVIEW_SIZE / 2 + pan.x;
      const imgCenterY = PREVIEW_SIZE / 2 + pan.y;

      const previewLeft = imgCenterX - currentWidth / 2;
      const previewTop = imgCenterY - currentHeight / 2;

      const canvasX = previewLeft * scaleFactor;
      const canvasY = previewTop * scaleFactor;
      const canvasW = currentWidth * scaleFactor;
      const canvasH = currentHeight * scaleFactor;

      // High-res circular clipping
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, canvasX, canvasY, canvasW, canvasH);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
      onApply(dataUrl);
    } catch (err) {
      console.warn('Canvas crop fallback to raw imageSrc:', err);
      onApply(imageSrc);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.94)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 16px',
        boxSizing: 'border-box',
        userSelect: 'none',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Top Header */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 'env(safe-area-inset-top, 6px)',
          paddingBottom: 10
        }}
      >
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            fontSize: 15,
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'background-color 0.15s'
          }}
        >
          Cancel
        </button>
        <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, letterSpacing: -0.2 }}>
          Crop Profile Photo
        </span>
        <button
          onClick={handleCropAndSave}
          style={{
            background: 'none',
            border: 'none',
            color: '#0095F6',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'opacity 0.15s'
          }}
        >
          Done
        </button>
      </div>

      {/* Interactive Crop Preview Area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          flex: 1,
          overflow: 'hidden'
        }}
      >
        <p style={{ color: '#8E8E93', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
          Drag to position • Use slider to zoom
        </p>

        {/* Circular Mask Frame */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          style={{
            width: PREVIEW_SIZE,
            height: PREVIEW_SIZE,
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.78), 0 8px 32px rgba(0, 0, 0, 0.85)',
            touchAction: 'none'
          }}
        >
          {imgLoaded && (
            <img
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
                transformOrigin: 'center center',
                width: baseWidth,
                height: baseHeight,
                maxWidth: 'none',
                maxHeight: 'none',
                pointerEvents: 'none',
                userSelect: 'none',
                transition: isDragging ? 'none' : 'transform 0.08s ease-out'
              }}
            />
          )}

          {/* 3x3 Composition Grid (appears when dragging) */}
          {isDragging && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                pointerEvents: 'none',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '1fr 1fr 1fr',
                opacity: 0.35
              }}
            >
              <div style={{ borderRight: '1px solid #FFFFFF', borderBottom: '1px solid #FFFFFF' }} />
              <div style={{ borderRight: '1px solid #FFFFFF', borderBottom: '1px solid #FFFFFF' }} />
              <div style={{ borderBottom: '1px solid #FFFFFF' }} />
              <div style={{ borderRight: '1px solid #FFFFFF', borderBottom: '1px solid #FFFFFF' }} />
              <div style={{ borderRight: '1px solid #FFFFFF', borderBottom: '1px solid #FFFFFF' }} />
              <div style={{ borderBottom: '1px solid #FFFFFF' }} />
              <div style={{ borderRight: '1px solid #FFFFFF' }} />
              <div style={{ borderRight: '1px solid #FFFFFF' }} />
              <div />
            </div>
          )}
        </div>
      </div>

      {/* Zoom Controls & Bottom Action */}
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          backgroundColor: '#1E1E1E',
          borderRadius: 20,
          padding: '16px 20px',
          boxSizing: 'border-box',
          marginBottom: 'env(safe-area-inset-bottom, 12px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <span style={{ color: '#8E8E93', fontSize: 13 }}>🔍</span>
          <input
            type="range"
            min="1"
            max="3.5"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            style={{
              flex: 1,
              accentColor: '#0095F6',
              cursor: 'pointer'
            }}
          />
          <span style={{ color: '#FFFFFF', fontSize: 13, minWidth: 40, textAlign: 'right', fontWeight: 600 }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleReset}
            title="Reset position and zoom"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: 6,
              color: '#A8A8A8',
              fontSize: 11,
              padding: '4px 8px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Reset
          </button>
        </div>

        <button
          onClick={handleCropAndSave}
          style={{
            width: '100%',
            height: 44,
            borderRadius: 10,
            backgroundColor: '#0095F6',
            color: '#FFFFFF',
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
        >
          Set as Profile Picture
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
