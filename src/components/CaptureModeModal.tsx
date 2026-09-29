import React from 'react';
import { CloseIcon } from './InstagramIcons';

interface CaptureModeModalProps {
  onTakeScreenshot: () => void;
  onOpenVideoEngine: () => void;
  onDismiss: () => void;
}

export const CaptureModeModal: React.FC<CaptureModeModalProps> = ({
  onTakeScreenshot,
  onOpenVideoEngine,
  onDismiss
}) => {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 460,
          backgroundColor: '#1E1E1E',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '16px 20px 32px 20px',
          boxSizing: 'border-box',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.7)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            margin: '0 auto 4px auto'
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3
              style={{
                color: '#FFFFFF',
                fontSize: 17,
                fontWeight: 700,
                margin: 0
              }}
            >
              Capture & Export
            </h3>
            <p
              style={{
                color: '#8E8E93',
                fontSize: 12.5,
                margin: '2px 0 0 0'
              }}
            >
              Take a high-resolution screenshot or record a lyrics video
            </p>
          </div>

          <button
            onClick={onDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: '#A8A8A8',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Options list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Option 1: Take Screenshot */}
          <button
            onClick={() => {
              onDismiss();
              onTakeScreenshot();
            }}
            style={{
              width: '100%',
              backgroundColor: '#262626',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s ease'
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 149, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0
              }}
            >
              📸
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>
                📸 Capture Bubbles Screenshot
              </div>
              <div style={{ color: '#8E8E93', fontSize: 12, marginTop: 2 }}>
                High-resolution PNG of chat bubbles only (No header or chatbox)
              </div>
            </div>
            <span style={{ color: '#0095F6', fontSize: 13, fontWeight: 700 }}>
              Capture
            </span>
          </button>

          {/* Option 2: Record Lyrics Video (Reel Engine) */}
          <button
            onClick={() => {
              onDismiss();
              onOpenVideoEngine();
            }}
            style={{
              width: '100%',
              backgroundColor: '#262626',
              border: '1px solid rgba(255, 23, 68, 0.3)',
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s ease'
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 23, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0
              }}
            >
              🎬
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>
                🎬 Record Bubbles Video (No Scroll)
              </div>
              <div style={{ color: '#E0A0C0', fontSize: 12, marginTop: 2 }}>
                60 FPS live video with looping border animations (Full chat height)
              </div>
            </div>
            <span style={{ color: '#FF1744', fontSize: 13, fontWeight: 700 }}>
              Record
            </span>
          </button>
        </div>

        {/* Cancel button */}
        <button
          onClick={onDismiss}
          style={{
            width: '100%',
            height: 40,
            borderRadius: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 4
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
