import React, { useState, useEffect } from 'react';
import { CloseIcon, InstagramSendAirplaneIcon } from './InstagramIcons';
import {
  getStorageStats,
  compressPhotoWithBuffer,
  CompressionPreset,
  StorageStats
} from '../utils/photoStorageOptimizer';

interface PhotoSendModalProps {
  initialImageSrc: string;
  activeSender: 'ME' | 'SAHIL';
  contactName: string;
  onSendPhoto: (imageDataUrl: string, isFromMe: boolean, caption?: string) => void;
  onDismiss: () => void;
}

export const PhotoSendModal: React.FC<PhotoSendModalProps> = ({
  initialImageSrc,
  activeSender: defaultSender,
  contactName,
  onSendPhoto,
  onDismiss
}) => {
  const [selectedSender, setSelectedSender] = useState<'ME' | 'SAHIL'>(defaultSender);
  const [activePreset, setActivePreset] = useState<CompressionPreset>('MAX');
  const [customQuality, setCustomQuality] = useState<number>(0.92);
  const [caption, setCaption] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [compressedDataUrl, setCompressedDataUrl] = useState<string>(initialImageSrc);
  const [photoSizeKB, setPhotoSizeKB] = useState<number>(0);
  const [photoDimensions, setPhotoDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [storageStats, setStorageStats] = useState<StorageStats>(() => getStorageStats());

  // Optimize & compress when preset or quality changes
  useEffect(() => {
    let isCancelled = false;
    setIsProcessing(true);

    const runCompression = async () => {
      try {
        const stats = getStorageStats();
        setStorageStats(stats);

        const result = await compressPhotoWithBuffer(
          initialImageSrc,
          activePreset,
          activePreset === 'MAX' ? 0.92 : customQuality
        );

        if (!isCancelled) {
          setCompressedDataUrl(result.dataUrl);
          setPhotoSizeKB(result.sizeKB);
          setPhotoDimensions({ w: result.width, h: result.height });
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Photo compression error:', err);
        if (!isCancelled) {
          setCompressedDataUrl(initialImageSrc);
          setIsProcessing(false);
        }
      }
    };

    runCompression();
    return () => {
      isCancelled = true;
    };
  }, [initialImageSrc, activePreset, customQuality]);

  const handleSelectPreset = (preset: CompressionPreset) => {
    setActivePreset(preset);
    if (preset === 'MAX') {
      setCustomQuality(0.92);
    } else if (preset === 'STANDARD') {
      setCustomQuality(0.80);
    } else if (preset === 'ECO') {
      setCustomQuality(0.65);
    }
  };

  const handleSend = () => {
    if (!compressedDataUrl) return;
    onSendPhoto(compressedDataUrl, selectedSender === 'ME', caption.trim() || undefined);
    onDismiss();
  };

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: '#181818',
          border: '1px solid #282828',
          borderRadius: 20,
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalPop 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <style>{`
          @keyframes modalPop {
            from { opacity: 0; transform: scale(0.94) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Top Header */}
        <div
          style={{
            height: 52,
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #262626'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>📸</span>
            <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>
              Photo Send Preview
            </span>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: '#A8A8A8',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CloseIcon size={20} color="#FFFFFF" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            maxHeight: 'calc(85vh - 120px)',
            overflowY: 'auto'
          }}
        >
          {/* Photo Preview Container (Exact DM Aspect & Look) */}
          <div
            style={{
              width: '100%',
              backgroundColor: '#0F0F0F',
              borderRadius: 16,
              border: '1px solid #2A2A2A',
              padding: 8,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '100%',
                maxHeight: 280,
                borderRadius: 12,
                overflow: 'hidden',
                backgroundColor: '#1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {isProcessing ? (
                <div
                  style={{
                    height: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    color: '#A8A8A8',
                    fontSize: 13
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      border: '3px solid rgba(255,255,255,0.2)',
                      borderTopColor: '#0095F6',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }}
                  />
                  <span>Optimizing photo...</span>
                </div>
              ) : (
                <img
                  src={compressedDataUrl}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 280,
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              )}

              {/* Status Badges on Image */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>{selectedSender === 'ME' ? '📤 You (Sent)' : `📥 ${contactName} (Received)`}</span>
              </div>

              {activePreset === 'MAX' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'linear-gradient(135deg, #FF007A 0%, #7928CA 100%)',
                    color: '#FFFFFF',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(255, 0, 122, 0.4)'
                  }}
                >
                  ⚡ MAX HD
                </div>
              )}
            </div>

            {/* Dimensions and Size bar */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 8,
                paddingLeft: 4,
                paddingRight: 4
              }}
            >
              <span style={{ color: '#8E8E93', fontSize: 12 }}>
                {photoDimensions.w > 0 ? `${photoDimensions.w} × ${photoDimensions.h} px` : 'Resolving...'}
              </span>
              <span style={{ color: '#0095F6', fontSize: 13, fontWeight: 700 }}>
                {photoSizeKB > 0 ? `${photoSizeKB} KB` : 'Computing...'}
              </span>
            </div>
          </div>

          {/* Safe Storage Monitor Card (40KB Buffer Indicator) */}
          <div
            style={{
              backgroundColor: '#121212',
              border: '1px solid #262626',
              borderRadius: 12,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#A8A8A8', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>💾</span> Storage Free Space:
              </span>
              <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700 }}>
                {storageStats.freeKB.toLocaleString()} KB
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#00E676', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🛡️</span> Protected Buffer (Reserved Headroom):
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(0, 230, 118, 0.15)',
                  color: '#00E676',
                  padding: '1px 7px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700
                }}
              >
                40 KB Reserved
              </span>
            </div>

            <div
              style={{
                color: '#8E8E93',
                fontSize: 11,
                lineHeight: '15px',
                marginTop: 2,
                borderTop: '1px solid #1E1E1E',
                paddingTop: 6
              }}
            >
              ✅ 40KB of safe storage headroom is permanently reserved to prevent memory overflow and guarantee message saving.
            </div>
          </div>

          {/* Quality & Preset Selector with MAX Button */}
          <div>
            <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
              Quality & Compression:
            </label>

            <div style={{ display: 'flex', gap: 8 }}>
              {/* MAX BUTTON - Specially highlighted as requested by user */}
              <button
                type="button"
                onClick={() => handleSelectPreset('MAX')}
                style={{
                  flex: 1.3,
                  padding: '9px 8px',
                  borderRadius: 10,
                  background:
                    activePreset === 'MAX'
                      ? 'linear-gradient(135deg, #8A3FFC 0%, #0095F6 100%)'
                      : '#222222',
                  border: activePreset === 'MAX' ? '1.5px solid #FFFFFF' : '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  boxShadow:
                    activePreset === 'MAX' ? '0 4px 14px rgba(138, 63, 252, 0.45)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>⚡</span> MAX
                </span>
                <span style={{ fontSize: 9.5, opacity: 0.85, fontWeight: 600 }}>
                  40KB Safe Buffer
                </span>
              </button>

              {/* STANDARD BUTTON */}
              <button
                type="button"
                onClick={() => handleSelectPreset('STANDARD')}
                style={{
                  flex: 1,
                  padding: '9px 8px',
                  borderRadius: 10,
                  backgroundColor: activePreset === 'STANDARD' ? '#0095F6' : '#222222',
                  border: activePreset === 'STANDARD' ? '1.5px solid #0095F6' : '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700 }}>Standard</span>
                <span style={{ fontSize: 9.5, opacity: 0.75 }}>720p HD</span>
              </button>

              {/* ECO BUTTON */}
              <button
                type="button"
                onClick={() => handleSelectPreset('ECO')}
                style={{
                  flex: 1,
                  padding: '9px 8px',
                  borderRadius: 10,
                  backgroundColor: activePreset === 'ECO' ? '#0095F6' : '#222222',
                  border: activePreset === 'ECO' ? '1.5px solid #0095F6' : '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700 }}>Eco</span>
                <span style={{ fontSize: 9.5, opacity: 0.75 }}>~30 KB</span>
              </button>
            </div>
          </div>

          {/* Sender Switcher */}
          <div>
            <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
              Sender:
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setSelectedSender('ME')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  backgroundColor: selectedSender === 'ME' ? '#2A2A2A' : '#1A1A1A',
                  border: selectedSender === 'ME' ? '1.5px solid #0095F6' : '1px solid #262626',
                  color: selectedSender === 'ME' ? '#FFFFFF' : '#8E8E93',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <span>👤</span>
                <span>You (Sent)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSender('SAHIL')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  backgroundColor: selectedSender === 'SAHIL' ? '#2A2A2A' : '#1A1A1A',
                  border: selectedSender === 'SAHIL' ? '1.5px solid #0095F6' : '1px solid #262626',
                  color: selectedSender === 'SAHIL' ? '#FFFFFF' : '#8E8E93',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <span>💬</span>
                <span>{contactName} (Received)</span>
              </button>
            </div>
          </div>

          {/* Optional Caption */}
          <div>
            <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
              Caption / Note (Optional):
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add caption or message..."
              style={{
                width: '100%',
                height: 38,
                borderRadius: 8,
                backgroundColor: '#141414',
                border: '1px solid #333333',
                color: '#FFFFFF',
                padding: '0 12px',
                fontSize: 13.5,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #262626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            backgroundColor: '#141414'
          }}
        >
          <button
            type="button"
            onClick={onDismiss}
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              backgroundColor: '#262626',
              border: 'none',
              color: '#A8A8A8',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSend}
            style={{
              padding: '9px 22px',
              borderRadius: 8,
              backgroundColor: '#0095F6',
              border: 'none',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 700,
              cursor: isProcessing ? 'default' : 'pointer',
              opacity: isProcessing ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 2px 10px rgba(0, 149, 246, 0.4)'
            }}
          >
            <InstagramSendAirplaneIcon size={16} color="#FFFFFF" />
            <span>Send Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
