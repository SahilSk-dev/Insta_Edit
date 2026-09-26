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
        padding: '3px 14px',
        width: '100%'
      }}
    >
      {/* Received avatar */}
      {!isMe && (
        <div
          onClick={onAvatarClick}
          title={senderName}
          style={{
            width: 30,
            height: 30,
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
          maxWidth: '82%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMe ? 'flex-end' : 'flex-start'
        }}
      >
        {/* Type: IMAGE */}
        {message.type === 'IMAGE' && (
          <div
            style={{
              maxWidth: 240,
              borderRadius: 18,
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
                maxHeight: 240,
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
              fontSize: 44,
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
              minWidth: 180,
              maxWidth: 240,
              borderRadius: 20,
              background: isMe
                ? 'linear-gradient(135deg, #7038F8 0%, #8A3FFC 50%, #9E27E8 100%)'
                : '#262626',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <PlayIcon size={16} color="#FFFFFF" />
            </div>
            <div
              style={{
                marginLeft: 10,
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '1px'
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
                  maxWidth: 280,
                  borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: isMe
                    ? 'linear-gradient(135deg, #7038F8 0%, #8A3FFC 50%, #9E27E8 100%)'
                    : '#262626',
                  color: '#FFFFFF',
                  padding: '10px 16px',
                  fontSize: 15,
                  lineHeight: '20px',
                  wordBreak: 'break-word',
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
