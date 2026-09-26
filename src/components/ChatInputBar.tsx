import React, { useRef } from 'react';
import { CameraIcon, MicIcon, GalleryIcon, PlusIcon } from './InstagramIcons';

interface ChatInputBarProps {
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendClick: () => void;
  onCameraClick: () => void;
  onMicClick: () => void;
  onGalleryClick: (file?: File) => void;
  onPlusClick: () => void;
  isBlocked: boolean;
  onUnblockClick: () => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  messageText,
  onMessageChange,
  onSendClick,
  onCameraClick,
  onMicClick,
  onGalleryClick,
  onPlusClick,
  isBlocked,
  onUnblockClick
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSendClick();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onGalleryClick(file);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#000000',
        padding: '8px 12px',
        position: 'sticky',
        bottom: 0,
        zIndex: 30,
        boxSizing: 'border-box'
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {isBlocked ? (
        <div
          style={{
            width: '100%',
            height: 48,
            borderRadius: 24,
            backgroundColor: '#262626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            boxSizing: 'border-box'
          }}
        >
          <span style={{ color: '#8E8E93', fontSize: 14 }}>
            You blocked md.sahil_sk_.
          </span>
          <button
            onClick={onUnblockClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#0095F6',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Unblock
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 8 }}>
          {/* Blue Camera Button */}
          <button
            onClick={onCameraClick}
            title="Send photo"
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              backgroundColor: '#0095F6',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'opacity 0.2s'
            }}
          >
            <CameraIcon size={22} color="#FFFFFF" />
          </button>

          {/* Pill Container */}
          <div
            style={{
              flex: 1,
              height: 44,
              borderRadius: 24,
              backgroundColor: '#262626',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 16,
              paddingRight: 6
            }}
          >
            {/* Input field */}
            <input
              type="text"
              value={messageText}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: 15,
                fontFamily: 'inherit'
              }}
            />

            {messageText.trim().length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 18,
                    padding: '0 6px',
                    userSelect: 'none',
                    cursor: 'default'
                  }}
                >
                  😀
                </span>
                <button
                  onClick={onSendClick}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0095F6',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '6px 8px'
                  }}
                >
                  Send
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Voice Note Button */}
                <button
                  onClick={onMicClick}
                  title="Voice message"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <MicIcon size={21} />
                </button>

                {/* Gallery Button */}
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  title="Upload image from device"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <GalleryIcon size={21} />
                </button>

                {/* Emoji Sticker Button */}
                <button
                  onClick={() => onMessageChange('❤️')}
                  title="Quick emoji"
                  style={{
                    background: 'none',
                    border: 'none',
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 18
                  }}
                >
                  😀
                </button>

                {/* Plus / More Actions Button */}
                <button
                  onClick={onPlusClick}
                  title="Quick actions"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <PlusIcon size={21} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
