import React, { useState } from 'react';

interface BlockUserModalProps {
  handle: string;
  onConfirmBlock: () => void;
  onDismiss: () => void;
}

export const BlockUserModal: React.FC<BlockUserModalProps> = ({
  handle,
  onConfirmBlock,
  onDismiss
}) => {
  const [selectedOption, setSelectedOption] = useState(0);

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
          maxWidth: 320,
          backgroundColor: '#121212',
          borderRadius: 16,
          paddingTop: 22,
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
          textAlign: 'center',
          animation: 'popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <style>{`
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        <h3
          style={{
            color: '#FFFFFF',
            fontSize: 17,
            fontWeight: 700,
            margin: '0 0 14px 0'
          }}
        >
          Block {handle}?
        </h3>

        {/* Options */}
        <div style={{ textAlign: 'left', padding: '0 16px', marginBottom: 12 }}>
          <div
            onClick={() => setSelectedOption(0)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 0',
              cursor: 'pointer'
            }}
          >
            <input
              type="radio"
              checked={selectedOption === 0}
              onChange={() => setSelectedOption(0)}
              style={{ accentColor: '#0095F6', width: 16, height: 16, cursor: 'pointer' }}
            />
            <span style={{ color: '#FFFFFF', fontSize: 13, lineHeight: '17px', marginLeft: 10 }}>
              Block {handle} and other accounts they may have or create
            </span>
          </div>

          <div
            onClick={() => setSelectedOption(1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 0',
              cursor: 'pointer'
            }}
          >
            <input
              type="radio"
              checked={selectedOption === 1}
              onChange={() => setSelectedOption(1)}
              style={{ accentColor: '#0095F6', width: 16, height: 16, cursor: 'pointer' }}
            />
            <span style={{ color: '#FFFFFF', fontSize: 13, lineHeight: '17px', marginLeft: 10 }}>
              Block {handle}
            </span>
          </div>
        </div>

        <p
          style={{
            color: '#A8A8A8',
            fontSize: 12,
            lineHeight: '16px',
            padding: '0 20px',
            margin: '0 0 18px 0'
          }}
        >
          They won't be able to message you or find your profile, posts or story on Instagram. They won't be notified that you blocked them.
        </p>

        {/* Action Buttons */}
        <div style={{ borderTop: '0.5px solid #1A1A1A' }}>
          <button
            onClick={onConfirmBlock}
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
            Block
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
