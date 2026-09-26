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
  blockedHandle?: string;
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
              width: 38,
              height: 38,
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
              height: 42,
              borderRadius: 21,
              backgroundColor: '#262626',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 14,
              paddingRight: 6
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
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: 14.5,
                fontFamily: 'inherit',
                WebkitAppearance: 'none'
              }}
            />

            {messageText.trim().length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 17,
                    padding: '0 4px',
                    userSelect: 'none',
                    cursor: 'default'
                  }}
                >
                  😀
                </span>
                <button
                  type="button"
                  onClick={onSendClick}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0095F6',
                    fontSize: 14.5,
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
                    cursor: 'pointer'
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
                    cursor: 'pointer'
                  }}
                >
                  <GalleryIcon size={20} />
                </button>

                {/* Emoji Sticker Button */}
                <button
                  type="button"
                  onClick={() => onMessageChange('❤️')}
                  title="Quick emoji"
                  style={{
                    background: 'none',
                    border: 'none',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 17
                  }}
                >
                  😀
                </button>

                {/* Plus / More Actions Button */}
                <button
                  type="button"
                  onClick={onPlusClick}
                  title="Quick actions"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <PlusIcon size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
