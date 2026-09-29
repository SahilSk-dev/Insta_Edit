import React from 'react';

interface ChatSpacingModalProps {
  currentSpacing: number;
  onUpdateSpacing: (spacing: number) => void;
  onResetAllCustomGaps: () => void;
  onDismiss: () => void;
}

export const ChatSpacingModal: React.FC<ChatSpacingModalProps> = ({
  currentSpacing,
  onUpdateSpacing,
  onResetAllCustomGaps,
  onDismiss
}) => {
  const presets = [
    { label: 'Compact', val: 1, desc: 'Tight messages' },
    { label: 'Instagram (Default)', val: 4, desc: 'Standard DM look' },
    { label: 'Relaxed', val: 10, desc: 'Breathing room' },
    { label: 'Lyrics / Stanza', val: 18, desc: 'Ideal for song lines' },
    { label: 'Story / Reel', val: 28, desc: 'High visual gap' }
  ];

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(3px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: '#161616',
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          padding: '16px 20px 28px 20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Drag Handle */}
        <div
          style={{
            width: 38,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            margin: '0 auto 16px auto',
            flexShrink: 0
          }}
        />

        {/* Title & Current Value */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h3 style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700, margin: 0 }}>
            Chat Bubble Spacing
          </h3>
          <span
            style={{
              backgroundColor: '#0095F6',
              color: '#FFFFFF',
              borderRadius: 12,
              padding: '2px 10px',
              fontSize: 13,
              fontWeight: 700
            }}
          >
            {currentSpacing}px
          </span>
        </div>

        <p style={{ color: '#8E8E93', fontSize: 12.5, margin: '0 0 16px 0', lineHeight: 1.4 }}>
          Adjust the vertical distance between all chat bubbles simultaneously. You can also tap individual bubbles to set custom gaps.
        </p>

        {/* Range Slider */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A8A8A8', fontSize: 11, marginBottom: 6 }}>
            <span>0px (Attached)</span>
            <span>20px</span>
            <span>40px (Wide)</span>
          </div>
          <input
            type="range"
            min={0}
            max={40}
            step={1}
            value={currentSpacing}
            onChange={(e) => onUpdateSpacing(Number(e.target.value))}
            style={{
              width: '100%',
              height: 6,
              accentColor: '#0095F6',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Presets */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            Quick Presets:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {presets.map((p) => {
              const isSelected = currentSpacing === p.val;
              return (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => onUpdateSpacing(p.val)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '9px 12px',
                    borderRadius: 10,
                    backgroundColor: isSelected ? 'rgba(0, 149, 246, 0.15)' : '#222222',
                    border: isSelected ? '1.5px solid #0095F6' : '1px solid #2c2c2c',
                    color: isSelected ? '#FFFFFF' : '#D4D4D4',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500 }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#8E8E93' }}>
                      {p.desc}
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#0095F6' : '#8E8E93' }}>
                    {p.val}px
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset All Custom Gaps */}
        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            onClick={onResetAllCustomGaps}
            style={{
              width: '100%',
              backgroundColor: '#242424',
              border: '1px solid #363636',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#E0E0E0',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <span>🔄 Unify All Messages (Reset Custom Gaps to {currentSpacing}px)</span>
          </button>
        </div>

        {/* Done Button */}
        <button
          type="button"
          onClick={onDismiss}
          style={{
            backgroundColor: '#0095F6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 10,
            padding: '12px',
            fontSize: 14.5,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0, 149, 246, 0.4)'
          }}
        >
          Done
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
