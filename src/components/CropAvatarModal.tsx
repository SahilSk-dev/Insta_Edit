import React, { useState, useRef, useEffect } from 'react';

interface CropAvatarModalProps {
  imageSrc: string;
  onApply: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

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

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
  }, [imageSrc]);

  // Touch and Mouse Drag handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
    initialPanRef.current = { ...pan };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    setPan({
      x: initialPanRef.current.x + deltaX,
      y: initialPanRef.current.y + deltaY
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Perform circular crop on high-res canvas
  const handleCropAndSave = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;

    const outputSize = 400; // 400x400 crisp Instagram avatar
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Viewport preview circle is 240px
    const previewSize = 240;
    const scaleFactor = outputSize / previewSize;

    // Calculate image render dimensions in preview
    const aspect = img.width / img.height;
    let baseWidth = previewSize;
    let baseHeight = previewSize;
    if (aspect > 1) {
      baseHeight = previewSize;
      baseWidth = previewSize * aspect;
    } else {
      baseWidth = previewSize;
      baseHeight = previewSize / aspect;
    }

    const currentWidth = baseWidth * zoom;
    const currentHeight = baseHeight * zoom;

    // Center of circle + pan offsets
    const imgCenterX = previewSize / 2 + pan.x;
    const imgCenterY = previewSize / 2 + pan.y;

    const imgX = (imgCenterX - currentWidth / 2) * scaleFactor;
    const imgY = (imgCenterY - currentHeight / 2) * scaleFactor;
    const renderWidth = currentWidth * scaleFactor;
    const renderHeight = currentHeight * scaleFactor;

    // Create high-res circular clip
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, imgX, imgY, renderWidth, renderHeight);

    const dataUrl = canvas.toDataURL('image/png', 0.95);
    onApply(dataUrl);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 16px',
        boxSizing: 'border-box',
        userSelect: 'none',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 'env(safe-area-inset-top, 8px)'
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
            padding: 8
          }}
        >
          Cancel
        </button>
        <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>
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
            padding: 8
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
          flex: 1
        }}
      >
        <p style={{ color: '#A8A8A8', fontSize: 13, marginBottom: 18, textAlign: 'center' }}>
          Drag to position • Use slider to zoom
        </p>

        {/* Circular Mask Frame */}
        <div
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => {
            if (e.touches[0]) {
              handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) {
              handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={handlePointerUp}
          style={{
            width: 250,
            height: 250,
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            border: '2px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.72), 0 0 20px rgba(0, 0, 0, 0.8)',
            touchAction: 'none'
          }}
        >
          {imgLoaded && imgRef.current && (
            <img
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
                maxWidth: 'none',
                maxHeight: 'none',
                width: imgRef.current.width >= imgRef.current.height ? 'auto' : 250,
                height: imgRef.current.width >= imgRef.current.height ? 250 : 'auto',
                pointerEvents: 'none',
                transition: isDragging ? 'none' : 'transform 0.05s ease-out'
              }}
            />
          )}
        </div>
      </div>

      {/* Zoom Controls & Apply */}
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          backgroundColor: '#1E1E1E',
          borderRadius: 20,
          padding: '16px 20px',
          boxSizing: 'border-box',
          marginBottom: 'env(safe-area-inset-bottom, 12px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ color: '#8E8E93', fontSize: 13 }}>🔍</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            style={{
              flex: 1,
              accentColor: '#0095F6',
              cursor: 'pointer'
            }}
          />
          <span style={{ color: '#FFFFFF', fontSize: 13, width: 36, textAlign: 'right' }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <button
          onClick={handleCropAndSave}
          style={{
            width: '100%',
            height: 42,
            borderRadius: 10,
            backgroundColor: '#0095F6',
            color: '#FFFFFF',
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Set as Profile Picture
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};
