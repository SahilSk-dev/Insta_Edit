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
  globalSpacing?: number;
  onAvatarClick: () => void;
  onMessageClick: (message: ChatMessage) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  senderName,
  avatarName,
  chatEmojiFont,
  globalSpacing = 4,
  onAvatarClick,
  onMessageClick
}) => {
  const isMe = message.isFromMe;
  const avatarUrl = getAvatarUrl(avatarName);
  const effectiveEmojiFont = message.emojiFont || chatEmojiFont || 'SamsungOneUI_4_Xmas';
  const fontStack = `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Nirmala UI", "Kohinoor Bangla", "Noto Sans Bengali", Helvetica, Arial, '${effectiveEmojiFont}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

  const isThemed = Boolean(message.theme && message.theme !== 'CLASSIC');
  const effectiveSpacing = message.customSpacing !== undefined ? message.customSpacing : globalSpacing;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        padding: isMe
          ? (isThemed ? '3.5px 8px 3.5px 14px' : '2px 8px 2px 14px')
          : (isThemed ? '3.5px 14px 3.5px 8px' : '2px 14px 2px 8px'),
        marginBottom: message.reaction ? Math.max(effectiveSpacing, 8) : effectiveSpacing,
        width: '100%',
        boxSizing: 'border-box',
        transition: 'margin-bottom 0.15s ease'
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
          maxWidth: message.type === 'IMAGE' ? '100%' : '78%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMe ? 'flex-end' : 'flex-start',
          position: 'relative'
        }}
      >
        {/* Type: IMAGE */}
        {message.type === 'IMAGE' && (() => {
          const width = message.imageWidth || 220;
          const height = message.imageHeight;
          const fit = message.imageFit || 'cover';
          const isLaser = message.photoStyle === 'LASER';
          const laserColor = message.laserColor || '#00F0FF';
          const isGradientLaser = laserColor === 'gradient';
          const speed = message.laserSpeed || 2.4;

          return (
            <div
              style={{
                position: 'relative',
                width: width,
                maxWidth: '100%',
                display: 'inline-block'
              }}
            >
              {/* Outer border wrapper */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: 16,
                  padding: isLaser ? 2.5 : 0,
                  overflow: 'hidden',
                  backgroundColor: isLaser ? '#0a0a0a' : '#262626',
                  boxShadow: isLaser
                    ? isGradientLaser
                      ? '0 0 16px rgba(245, 96, 64, 0.5), 0 0 32px rgba(138, 63, 252, 0.35), 0 4px 16px rgba(0,0,0,0.6)'
                      : `0 0 16px ${laserColor}70, 0 0 32px ${laserColor}30, 0 4px 16px rgba(0,0,0,0.6)`
                    : '0 4px 14px rgba(0, 0, 0, 0.4)',
                  transition: 'box-shadow 0.3s ease, padding 0.2s ease',
                  boxSizing: 'border-box'
                }}
              >
                {/* Traveling Laser Light Beam around the border */}
                {isLaser && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-70%',
                      left: '-70%',
                      width: '240%',
                      height: '240%',
                      background: isGradientLaser
                        ? 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, #FCAF45 300deg, #F56040 325deg, #8A3FFC 350deg, #FFFFFF 360deg)'
                        : `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${laserColor}15 285deg, ${laserColor}80 320deg, ${laserColor} 345deg, #FFFFFF 360deg)`,
                      animation: `laserSweep ${speed}s linear infinite`,
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                  />
                )}

                {/* Inner Image Frame */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    borderRadius: isLaser ? 13.5 : 16,
                    overflow: 'hidden',
                    backgroundColor: '#1c1c1c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: height ? `${height}px` : 'auto'
                  }}
                >
                  <img
                    src={message.imageResName || '/avatars/gaming_post.jpg'}
                    alt="Photo"
                    style={{
                      width: '100%',
                      height: height ? `${height}px` : 'auto',
                      maxHeight: height ? `${height}px` : 380,
                      objectFit: fit,
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })()}

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

        {/* Type: AUDIO (Authentic Instagram DM Voice Note) */}
        {message.type === 'AUDIO' && (() => {
          const waveformBars = [4, 8, 14, 18, 11, 7, 16, 22, 15, 9, 12, 19, 11, 6, 14, 9, 4];
          return (
            <div
              style={{
                width: 'fit-content',
                minWidth: 165,
                maxWidth: 225,
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isMe
                  ? 'linear-gradient(135deg, #7038F8 0%, #8A3FFC 50%, #9E27E8 100%)'
                  : '#262626',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                boxSizing: 'border-box'
              }}
            >
              {/* Play icon badge */}
              <div
                style={{
                  width: 30,
                  height: 30,
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

              {/* Instagram Voice Waveform Bars */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.2,
                  height: 22,
                  flex: 1
                }}
              >
                {waveformBars.map((barHeight, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 2.4,
                      height: `${barHeight}px`,
                      borderRadius: 1.5,
                      backgroundColor: idx < Math.floor(waveformBars.length * 0.35)
                        ? '#FFFFFF'
                        : 'rgba(255, 255, 255, 0.45)'
                    }}
                  />
                ))}
              </div>

              {/* Duration */}
              <div
                style={{
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                  flexShrink: 0
                }}
              >
                {message.audioDuration || '0:04'}
              </div>
            </div>
          );
        })()}

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
        @keyframes laserSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
