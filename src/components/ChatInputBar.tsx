import React, { useRef, useEffect } from 'react';
import {
  InstagramSolidCameraIcon,
  InstagramMicIcon,
  InstagramGalleryIcon,
  InstagramStickerPeelIcon,
  InstagramCirclePlusIcon
} from './InstagramIcons';
import { getAvatarUrl } from '../data/initialData';

interface ChatInputBarProps {
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendClick: () => void;
  activeSender: 'ME' | 'SAHIL';
  onToggleSender: () => void;
  contactName?: string;
  sahilAvatar: string;
  onCameraClick: () => void;
  onMicClick: () => void;
  onGalleryClick: (file?: File) => void;
  onPlusClick: () => void;
  isBlocked: boolean;
  blockedHandle?: string;
  onUnblockClick: () => void;
  onDeleteChatClick?: () => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  messageText,
  onMessageChange,
  onSendClick,
  activeSender,
  onToggleSender,
  contactName = 'Sahil',
  sahilAvatar,
  onCameraClick,
  onMicClick,
  onGalleryClick,
  onPlusClick,
  isBlocked,
  blockedHandle,
  onUnblockClick,
  onDeleteChatClick
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height dynamically as text/lines change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      const targetH = Math.min(Math.max(scrollH, 22), 110);
      textareaRef.current.style.height = `${targetH}px`;
    }
  }, [messageText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    // Detect double space (both direct '  ' and mobile virtual keyboard '. ')
    if (val.endsWith('  ')) {
      onToggleSender();
      onMessageChange(val.slice(0, -2));
    } else if (messageText.endsWith(' ') && (val === messageText.slice(0, -1) + '. ' || val === messageText + '. ')) {
      onToggleSender();
      onMessageChange(messageText.trimEnd());
    } else if (!messageText && (val === '  ' || val === '. ')) {
      onToggleSender();
      onMessageChange('');
    } else {
      onMessageChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      // Ctrl+Enter or Cmd+Enter sends the message
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        onSendClick();
        return;
      }
      // Enter without Ctrl/Cmd naturally creates a new line (\n) in the textarea.
      // This allows writing "hii\nhii" without immediately sending!
    } else if (e.key === ' ' && messageText.endsWith(' ')) {
      e.preventDefault();
      onToggleSender();
      onMessageChange(messageText.trimEnd());
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
        /* Exact Authentic Instagram Block Panel (100% replica of media_1790622139356.png) */
        <div
          style={{
            width: '100%',
            backgroundColor: '#000000',
            padding: '12px 14px 10px 14px',
            boxSizing: 'border-box',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Title */}
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 6,
              lineHeight: '20px'
            }}
          >
            You blocked {blockedHandle || contactName}
          </div>

          {/* Subtitle */}
          <div
            style={{
              color: '#8E8E93',
              fontSize: 13.5,
              lineHeight: '18px',
              marginBottom: 16,
              maxWidth: 320
            }}
          >
            You can't message or call this profile unless you unblock them
          </div>

          {/* Action Buttons: [Unblock] (White) & [Delete] (Red) */}
          <div style={{ display: 'flex', width: '100%', gap: 10 }}>
            <button
              onClick={onUnblockClick}
              type="button"
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#262626',
                border: 'none',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease'
              }}
            >
              Unblock
            </button>

            <button
              onClick={onDeleteChatClick}
              type="button"
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#262626',
                border: 'none',
                color: '#ED4956',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        /* The Single Unified Instagram Pill Capsule (100% replica of media_1790619813219.png) */
        <div
          style={{
            width: '100%',
            minHeight: 44,
            borderRadius: 24,
            backgroundColor: '#262626',
            display: 'flex',
            alignItems: 'center',
            padding: '4px 12px 4px 4px',
            boxSizing: 'border-box'
          }}
        >
          {/* Blue Camera Circle Button nested inside the left of the pill */}
          <button
            onClick={onCameraClick}
            type="button"
            title="Camera"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#3897F0',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              padding: 0
            }}
          >
            <InstagramSolidCameraIcon size={20} color="#FFFFFF" />
          </button>

          {/* Multiline auto-resizing text input */}
          <textarea
            ref={textareaRef}
            rows={1}
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
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: 15.5,
              fontFamily: 'inherit',
              lineHeight: '21px',
              height: '24px',
              maxHeight: '110px',
              overflowY: 'auto',
              resize: 'none',
              padding: '0',
              marginLeft: 10,
              marginRight: 8,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              boxSizing: 'border-box',
              scrollbarWidth: 'none'
            }}
          />

          {/* Right Action Icons or Sender Switcher + Send */}
          {messageText.trim().length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {/* 1-Tap Sender Switcher Badge */}
              <button
                type="button"
                onClick={onToggleSender}
                title={activeSender === 'ME' ? `Sending as You (Right). Tap to switch to ${contactName}` : `Sending as ${contactName} (Left). Tap to switch to You`}
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
                        alt={contactName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <span>{contactName}</span>
                  </>
                )}
              </button>

              {/* Native Send Button */}
              <button
                type="button"
                onClick={onSendClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0095F6',
                  fontSize: 15.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px 2px',
                  flexShrink: 0
                }}
              >
                Send
              </button>
            </div>
          ) : (
            /* Exactly 4 Right Action Icons from media_1790619813219.png */
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, paddingRight: 2 }}>
              {/* 1. Mic Button */}
              <button
                type="button"
                onClick={onMicClick}
                title="Voice message"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0
                }}
              >
                <InstagramMicIcon size={23} />
              </button>

              {/* 2. Gallery Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload image"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0
                }}
              >
                <InstagramGalleryIcon size={23} />
              </button>

              {/* 3. Sticker (Smiley with peeled corner) */}
              <button
                type="button"
                onClick={onPlusClick}
                title="Sticker"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0
                }}
              >
                <InstagramStickerPeelIcon size={23} />
              </button>

              {/* 4. Plus in circle button */}
              <button
                type="button"
                onClick={onPlusClick}
                title="More actions"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0
                }}
              >
                <InstagramCirclePlusIcon size={23} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
