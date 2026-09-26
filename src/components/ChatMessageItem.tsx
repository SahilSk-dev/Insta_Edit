import React from 'react';
import { ChatMessage } from '../types/chat';
import { AestheticLyricsBubble } from './AestheticBubble';
import { PlayIcon } from './InstagramIcons';
import { getAvatarUrl } from '../data/initialData';

interface ChatMessageItemProps {
  message: ChatMessage;
  senderName: string;
  avatarName: string;
  onAvatarClick: () => void;
  onMessageClick: (message: ChatMessage) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  senderName,
  avatarName,
  onAvatarClick,
  onMessageClick
}) => {
  const isMe = message.isFromMe;
  const avatarUrl = getAvatarUrl(avatarName);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        padding: isMe ? '2px 8px 2px 14px' : '2px 14px 2px 8px',
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
            src={avatarUrl}
            alt={senderName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
          alignItems: isMe ? 'flex-end' : 'flex-start'
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
              userSelect: 'none'
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
              />
            ) : (
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
                  padding: '8px 14px',
                  fontSize: '14.5px',
                  lineHeight: '19.5px',
                  wordBreak: 'break-word',
                  textWrap: 'balance',
                  textAlign: 'left',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }}
              >
                {message.text}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
