import React from 'react';

interface ClearChatModalProps {
  handle: string;
  onConfirmClear: () => void;
  onDismiss: () => void;
}

export const ClearChatModal: React.FC<ClearChatModalProps> = ({
  handle,
  onConfirmClear,
  onDismiss
}) => {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(3px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 300,
          backgroundColor: '#121212',
          borderRadius: 16,
          paddingTop: 24,
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
          textAlign: 'center',
          animation: 'popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <h3
          style={{
            color: '#FFFFFF',
            fontSize: 17,
            fontWeight: 700,
            margin: '0 0 10px 0'
          }}
        >
          Delete chat?
        </h3>

        <p
          style={{
            color: '#A8A8A8',
            fontSize: 13,
            lineHeight: '17px',
            padding: '0 24px',
            margin: '0 0 20px 0'
          }}
        >
          Once you delete this conversation with {handle}, all messages will be permanently removed.
        </p>

        <div style={{ borderTop: '0.5px solid #1A1A1A' }}>
          <button
            onClick={() => {
              onConfirmClear();
              onDismiss();
            }}
            style={{
              width: '100%',
              padding: '14px 0',
              background: 'none',
              border: 'none',
              color: '#ED4956',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              borderBottom: '0.5px solid #1A1A1A'
            }}
          >
            Delete
          </button>
          <button
            onClick={onDismiss}
            style={{
              width: '100%',
              padding: '14px 0',
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 400,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
