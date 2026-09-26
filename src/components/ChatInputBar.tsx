import React, { useRef } from 'react';
import { CameraIcon, MicIcon, GalleryIcon, InstagramStickerIcon } from './InstagramIcons';
import { getAvatarUrl } from '../data/initialData';

interface ChatInputBarProps {
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendClick: () => void;
  activeSender: 'ME' | 'SAHIL';
  onToggleSender: () => void;
  sahilAvatar: string;
  onCameraClick: () => void;
  onMicClick: () => void;
  onGalleryClick: (file?: File) => void;
  onPlusClick: () => void;
  isBlocked: boolean;
  blockedHandle?: string;
  onUnblockClick: () => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  messageText,
  onMessageChange,
  onSendClick,
  activeSender,
  onToggleSender,
  sahilAvatar,
  onCameraClick,
  onMicClick,
  onGalleryClick,
  onPlusClick,
  isBlocked,
  blockedHandle = 'not__ur__sahil_77',
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
        padding: '6px 10px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
        flexShrink: 0,
        zIndex: 30,
        boxSizing: 'border-box',
        borderTop: '0.5px solid #141414'
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
            height: 44,
            borderRadius: 22,
            backgroundColor: '#262626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            boxSizing: 'border-box'
          }}
        >
          <span style={{ color: '#8E8E93', fontSize: 13.5 }}>
            You blocked {blockedHandle}.
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
            type="button"
            title="Send photo"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#0095F6',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <CameraIcon size={20} color="#FFFFFF" />
          </button>

          {/* Pill Container */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              height: 42,
              borderRadius: 21,
              backgroundColor: '#262626',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 14,
              paddingRight: 6,
              boxSizing: 'border-box'
            }}
          >
            {/* Input field - type="search" + autocomplete="off" disables password/card autofill toolbar in Chrome */}
            <input
              type="search"
              inputMode="text"
              name="chat_message_entry"
              id="chat_message_entry"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck={false}
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              value={messageText}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              style={{
                flex: 1,
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: 16,
                fontFamily: 'inherit',
                WebkitAppearance: 'none'
              }}
            />

            {messageText.trim().length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                {/* 1-Tap Sender Switcher Badge */}
                <button
                  type="button"
                  onClick={onToggleSender}
                  title={activeSender === 'ME' ? 'Sending as You (Right). Tap to switch to Sahil' : 'Sending as Sahil (Left). Tap to switch to You'}
                  style={{
                    background: activeSender === 'ME' ? 'rgba(56, 112, 248, 0.25)' : 'rgba(255, 255, 255, 0.12)',
                    border: activeSender === 'ME' ? '1px solid #3870F8' : '1px solid #8E8E93',
                    borderRadius: 14,
                    padding: '2px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {activeSender === 'ME' ? (
                    <>
                      <span style={{ fontSize: 13 }}>👤</span>
                      <span>You</span>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={getAvatarUrl(sahilAvatar)}
                          alt="Sahil"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <span>Sahil</span>
                    </>
                  )}
                </button>

                {/* Native Android Send button */}
                <button
                  type="button"
                  onClick={onSendClick}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0095F6',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '6px 6px',
                    flexShrink: 0
                  }}
                >
                  Send
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                {/* Voice Note Button */}
                <button
                  type="button"
                  onClick={onMicClick}
                  title="Voice message"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0
                  }}
                >
                  <MicIcon size={20} />
                </button>

                {/* Gallery Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload image"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0
                  }}
                >
                  <GalleryIcon size={20} />
                </button>

                {/* Sticker Button */}
                <button
                  type="button"
                  onClick={onPlusClick}
                  title="Sticker"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0
                  }}
                >
                  <InstagramStickerIcon size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
