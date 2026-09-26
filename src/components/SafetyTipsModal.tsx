import React from 'react';
import { ShieldHeartIcon, CloseIcon } from './InstagramIcons';

interface SafetyTipsModalProps {
  onDismiss: () => void;
}

export const SafetyTipsModal: React.FC<SafetyTipsModalProps> = ({ onDismiss }) => {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 80,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: '#121212',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: '24px 24px 32px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            marginBottom: 20
          }}
        />

        <ShieldHeartIcon size={52} color="#0095F6" />

        <h3
          style={{
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 700,
            marginTop: 16,
            marginBottom: 8
          }}
        >
          Safety tips for messaging
        </h3>

        <p
          style={{
            color: '#A8A8A8',
            fontSize: 14,
            lineHeight: '20px',
            marginBottom: 24,
            maxWidth: 340
          }}
        >
          Help protect yourself and keep your Instagram account secure.
        </p>

        {/* Tips list */}
        <div style={{ textAlign: 'left', width: '100%', marginBottom: 26 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600 }}>
              Watch out for scams
            </div>
            <div style={{ color: '#A8A8A8', fontSize: 13, lineHeight: '18px', marginTop: 2 }}>
              Never send money, game redeem codes, or gift cards to people you don't personally know.
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600 }}>
              Keep private info safe
            </div>
            <div style={{ color: '#A8A8A8', fontSize: 13, lineHeight: '18px', marginTop: 2 }}>
              Instagram will never message you asking for your password, two-factor code, or financial info.
            </div>
          </div>

          <div>
            <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600 }}>
              Block or Report anytime
            </div>
            <div style={{ color: '#A8A8A8', fontSize: 13, lineHeight: '18px', marginTop: 2 }}>
              If a conversation makes you feel uncomfortable, you can block the account or report suspicious messages.
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          style={{
            width: '100%',
            height: 46,
            backgroundColor: '#0095F6',
            color: '#FFFFFF',
            borderRadius: 10,
            border: 'none',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
};
