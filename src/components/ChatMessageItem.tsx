import React from 'react';
import { ChatMessage } from '../types/chat';
import { AestheticLyricsBubble, calculateBubbleLayout, renderBubbleTextWithEmojiFont } from './AestheticBubble';
import { PlayIcon } from './InstagramIcons';
import { getAvatarUrl } from '../data/initialData';

interface ChatMessageItemProps {
  message: ChatMessage;
  senderName: string;
  avatarName: string;
  chatEmojiFont?: string;
  onAvatarClick: () => void;
  onMessageClick: (message: ChatMessage) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  senderName,
  avatarName,
  chatEmojiFont,
  onAvatarClick,
  onMessageClick
}) => {
  const isMe = message.isFromMe;
  const avatarUrl = getAvatarUrl(avatarName);
  const effectiveEmojiFont = message.emojiFont || chatEmojiFont || 'SamsungOneUI_4_Xmas';
  const fontStack = `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Nirmala UI", "Kohinoor Bangla", "Noto Sans Bengali", Helvetica, Arial, '${effectiveEmojiFont}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

  const isThemed = Boolean(message.theme && message.theme !== 'CLASSIC');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        padding: isMe
          ? (isThemed ? '3.5px 8px 3.5px 14px' : '2px 8px 2px 14px')
          : (isThemed ? '3.5px 14px 3.5px 8px' : '2px 14px 2px 8px'),
        marginBottom: message.reaction ? 8 : 0,
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Received avatar */}
      {!isMe && (
        <div
          onClick={onAvatarClick}
          title={senderName}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#262626',
            flexShrink: 0,
            marginRight: 8,
            marginBottom: 2,
            cursor: 'pointer'
          }}
        >
          <img
            key={avatarUrl}
            src={avatarUrl}
            alt={senderName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/avatars/sahil_avatar.jpg';
            }}
          />
        </div>
      )}

      {/* Message content container */}
      <div
        onClick={() => onMessageClick(message)}
        onContextMenu={(e) => {
          e.preventDefault();
          onMessageClick(message);
        }}
        title="Tap or right-click to edit, react, or apply theme effects"
        style={{
          cursor: 'pointer',
          maxWidth: '78%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMe ? 'flex-end' : 'flex-start',
          position: 'relative'
        }}
      >
        {/* Type: IMAGE */}
        {message.type === 'IMAGE' && (
          <div
            style={{
              maxWidth: 220,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: '#262626',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
            }}
          >
            <img
              src={message.imageResName || '/avatars/gaming_post.jpg'}
              alt="Photo"
              style={{
                width: '100%',
                maxHeight: 220,
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
        )}

        {/* Type: STICKER */}
        {message.type === 'STICKER' && (
          <div
            style={{
              fontSize: 38,
              padding: '2px 4px',
              lineHeight: 1.1,
              userSelect: 'none',
              fontFamily: `'${effectiveEmojiFont}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
            }}
          >
            {message.text}
          </div>
        )}

        {/* Type: AUDIO */}
        {message.type === 'AUDIO' && (
          <div
            style={{
              width: 'fit-content',
              minWidth: 150,
              maxWidth: 210,
              borderRadius: 18,
              background: isMe
                ? 'linear-gradient(135deg, #7038F8 0%, #8A3FFC 50%, #9E27E8 100%)'
                : '#262626',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <PlayIcon size={14} color="#FFFFFF" />
            </div>
            <div
              style={{
                marginLeft: 8,
                color: '#FFFFFF',
                fontSize: 12.5,
                fontWeight: 500,
                letterSpacing: '0.8px'
              }}
            >
              ılılıllı|lıl {message.audioDuration || '0:04'}
            </div>
          </div>
        )}

        {/* Type: TEXT */}
        {message.type === 'TEXT' && (
          <>
            {message.theme && message.theme !== 'CLASSIC' ? (
              <AestheticLyricsBubble
                text={message.text}
                theme={message.theme}
                isFromMe={isMe}
                fontFamily={fontStack}
                emojiFont={effectiveEmojiFont}
              />
            ) : (
              (() => {
                const classicLayout = calculateBubbleLayout(message.text, fontStack);
                return (
                  <div
                    style={{
                      display: 'inline-block',
                      width: 'fit-content',
                      maxWidth: '100%',
                      borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: isMe
                        ? 'linear-gradient(90deg, #3870F8 0%, #7A3FE4 40%, #B832B0 75%, #E024A8 100%)'
                        : '#262626',
                      color: '#FFFFFF',
                      padding: classicLayout.padding,
                      minWidth: classicLayout.minWidth,
                      fontSize: classicLayout.fontSize,
                      fontWeight: classicLayout.fontWeight,
                      lineHeight: classicLayout.lineHeight,
                      letterSpacing: classicLayout.letterSpacing,
                      textAlign: classicLayout.textAlign,
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      fontFamily: classicLayout.effectiveFont
                    }}
                  >
                    {renderBubbleTextWithEmojiFont(message.text, effectiveEmojiFont, classicLayout.fontWeight, '#FFFFFF')}
                  </div>
                );
              })()
            )}
          </>
        )}

        {/* Instagram DM Reaction Badge (Floating circular pill anchored to bottom corner) */}
        {message.reaction && (
          <div
            title={`Reacted: ${message.reaction}`}
            style={{
              position: 'absolute',
              bottom: -9,
              [isMe ? 'left' : 'right']: isThemed ? 10 : 6,
              backgroundColor: '#1E1E1E',
              border: '2px solid #000000',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.65)',
              zIndex: 10,
              userSelect: 'none',
              fontFamily: `'${effectiveEmojiFont}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`,
              animation: 'popInReaction 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {message.reaction}
          </div>
        )}
      </div>

      <style>{`
        @keyframes popInReaction {
          0% { transform: scale(0.3); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
