import React from 'react';
import { getAvatarUrl } from '../data/initialData';

interface SenderSelectModalProps {
  messageText: string;
  sahilName: string;
  sahilHandle: string;
  sahilAvatar: string;
  onSelectSender: (isFromMe: boolean) => void;
  onDismiss: () => void;
}

export const SenderSelectModal: React.FC<SenderSelectModalProps> = ({
  messageText,
  sahilName,
  sahilHandle,
  sahilAvatar,
  onSelectSender,
  onDismiss
}) => {
  const avatarUrl = getAvatarUrl(sahilAvatar);

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
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
          maxWidth: 440,
          backgroundColor: '#1E1E1E',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '20px 20px 32px 20px',
          boxSizing: 'border-box',
          animation: 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          userSelect: 'none'
        }}
      >
        {/* Top Notch bar */}
        <div
          style={{
            width: 38,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            margin: '0 auto 16px auto'
          }}
        />

        <h3
          style={{
            color: '#FFFFFF',
            fontSize: 17,
            fontWeight: 700,
            margin: '0 0 6px 0',
            textAlign: 'center'
          }}
        >
          Who is sending this message?
        </h3>
        <p
          style={{
            color: '#8E8E93',
            fontSize: 13,
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}
        >
          Select who says: <span style={{ color: '#FFFFFF', fontStyle: 'italic' }}>"{messageText.length > 25 ? messageText.substring(0, 25) + '...' : messageText}"</span>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Option 1: Ami (You - Outgoing on Right) */}
          <button
            onClick={() => onSelectSender(true)}
            style={{
              width: '100%',
              backgroundColor: '#2A2A2A',
              border: '1px solid #3A3A3A',
              borderRadius: 16,
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
                background: 'linear-gradient(135deg, #3870F8 0%, #7A3FE4 50%, #E024A8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0
              }}
            >
              👤
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>
                Ami (You)
              </div>
              <div style={{ color: '#8E8E93', fontSize: 12.5, marginTop: 2 }}>
                Outgoing message • Blue/magenta bubble on Right 👉
              </div>
            </div>
          </button>

          {/* Option 2: Sahil (Incoming on Left with DP) */}
          <button
            onClick={() => onSelectSender(false)}
            style={{
              width: '100%',
              backgroundColor: '#2A2A2A',
              border: '1px solid #3A3A3A',
              borderRadius: 16,
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
                overflow: 'hidden',
                backgroundColor: '#000',
                border: '1.5px solid #0095F6',
                flexShrink: 0
              }}
            >
              <img
                src={avatarUrl}
                alt={sahilName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>
                {sahilName} (@{sahilHandle})
              </div>
              <div style={{ color: '#8E8E93', fontSize: 12.5, marginTop: 2 }}>
                Incoming message • Grey bubble with DP on Left 👈
              </div>
            </div>
          </button>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onDismiss}
          style={{
            width: '100%',
            height: 44,
            backgroundColor: 'transparent',
            border: 'none',
            color: '#8E8E93',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 12
          }}
        >
          Cancel
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
