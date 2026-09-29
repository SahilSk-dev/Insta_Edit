import React, { useState } from 'react';
import { ChatMessage, BubbleTheme, PhotoBorderStyle } from '../types/chat';
import { EditIcon, DeleteIcon, SwapIcon, PlayIcon } from './InstagramIcons';
import { AestheticLyricsBubble, calculateBubbleLayout, renderBubbleTextWithEmojiFont } from './AestheticBubble';
import { EmojiFontPreviewDropdown } from './EmojiFontPreviewDropdown';

interface MessageActionModalProps {
  message: ChatMessage;
  contactName?: string;
  globalSpacing?: number;
  onEditMessage: (
    id: string,
    newText: string,
    newTimestamp: string,
    isFromMe: boolean,
    theme: BubbleTheme,
    emojiFont?: string,
    reaction?: string,
    imageWidth?: number,
    imageHeight?: number,
    photoStyle?: PhotoBorderStyle,
    imageFit?: 'cover' | 'contain',
    laserColor?: string,
    laserSpeed?: number,
    customSpacing?: number,
    audioDuration?: string
  ) => void;
  onUpdateSpacingLive?: (messageId: string, customSpacing?: number) => void;
  onUpdateGlobalSpacing?: (spacing: number) => void;
  onResetAllCustomGaps?: () => void;
  onOpenSpacingModal?: () => void;
  onDeleteMessage: (id: string) => void;
  onReactEmoji: (emoji: string) => void;
  onDismiss: () => void;
}

export const MessageActionModal: React.FC<MessageActionModalProps> = ({
  message,
  contactName = 'Sahil',
  globalSpacing = 4,
  onUpdateGlobalSpacing,
  onResetAllCustomGaps,
  onOpenSpacingModal,
  onEditMessage,
  onUpdateSpacingLive,
  onDeleteMessage,
  onReactEmoji,
  onDismiss
}) => {
  const isImageMessage = message.type === 'IMAGE';
  const isAudioMessage = message.type === 'AUDIO';
  const [audioDuration, setAudioDuration] = useState<string>(message.audioDuration || '0:04');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [editTimestamp, setEditTimestamp] = useState(message.timestamp);
  const [editIsMe, setEditIsMe] = useState(message.isFromMe);
  const [selectedTheme, setSelectedTheme] = useState<BubbleTheme>(message.theme || 'CLASSIC');
  const [selectedEmojiFont, setSelectedEmojiFont] = useState<string>(message.emojiFont || '');
  const [selectedReaction, setSelectedReaction] = useState<string>(message.reaction || '');

  // Individual Bubble Spacing Below (This specific message)
  const [bubbleSpacing, setBubbleSpacing] = useState<number>(
    message.customSpacing !== undefined ? message.customSpacing : globalSpacing
  );
  const [useCustomSpacing, setUseCustomSpacing] = useState<boolean>(
    message.customSpacing !== undefined
  );

  // Photo size & style states (Normal by default, as requested)
  const [photoWidth, setPhotoWidth] = useState<number>(message.imageWidth || 220);
  const [photoHeight, setPhotoHeight] = useState<number>(message.imageHeight || 220);
  const [isAutoHeight, setIsAutoHeight] = useState<boolean>(message.imageHeight === undefined);
  const [photoFit, setPhotoFit] = useState<'cover' | 'contain'>(message.imageFit || 'cover');
  const [photoBorderStyle, setPhotoBorderStyle] = useState<PhotoBorderStyle>(message.photoStyle || 'NORMAL');
  const [laserColor, setLaserColor] = useState<string>(message.laserColor || '#00F0FF');
  const [laserSpeed, setLaserSpeed] = useState<number>(message.laserSpeed || 2.4);

  const themes: { key: BubbleTheme; label: string }[] = [
    { key: 'CLASSIC', label: 'Normal' },
    { key: 'OBSIDIAN_HEART', label: '❤️‍🔥 Hearts' },
    { key: 'MIDNIGHT_BUTTERFLY', label: '🦋 Butterfly' },
    { key: 'NEON_CYBER', label: '⚡ Cyber' },
    { key: 'GOLDEN_LUXE', label: '✨ Luxe' }
  ];

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 85,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(3px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          maxHeight: '92vh',
          backgroundColor: '#141414',
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          padding: '16px 20px 28px 20px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          scrollbarWidth: 'thin'
        }}
      >
        {/* Drag Handle */}
        <div
          style={{
            width: 38,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            margin: '0 auto 14px auto',
            flexShrink: 0
          }}
        />

        {!isEditing ? (
          <>
            {/* Quick Reactions Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#262626',
                borderRadius: 30,
                padding: '8px 14px',
                marginBottom: message.reaction ? 10 : 16
              }}
            >
              {['❤️', '😂', '🔥', '😮', '😢', '👍'].map((emoji) => {
                const isSelected = message.reaction === emoji;
                return (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReactEmoji(emoji);
                      onDismiss();
                    }}
                    title={isSelected ? `Remove reaction (${emoji})` : `React ${emoji}`}
                    style={{
                      background: isSelected ? 'rgba(255, 255, 255, 0.18)' : 'none',
                      border: isSelected ? '1.5px solid #0095F6' : '1.5px solid transparent',
                      borderRadius: '50%',
                      fontSize: 26,
                      cursor: 'pointer',
                      padding: 4,
                      lineHeight: 1,
                      transform: isSelected ? 'scale(1.18)' : 'scale(1)',
                      transition: 'transform 0.15s ease, background-color 0.15s ease'
                    }}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>

            {message.reaction && (
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <button
                  type="button"
                  onClick={() => {
                    onReactEmoji(message.reaction!);
                    onDismiss();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ED4956',
                    fontSize: 12,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Remove reaction ({message.reaction})
                </button>
              </div>
            )}

            {isImageMessage ? (
              /* ================= PHOTO CUSTOMIZER (SIZE & LASER STYLE) ================= */
              <div
                style={{
                  backgroundColor: '#1E1E1E',
                  borderRadius: 14,
                  padding: '14px 16px',
                  marginBottom: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 700 }}>
                    🖼️ Photo Size & Laser Style
                  </span>
                  <span style={{ color: '#0095F6', fontSize: 12, fontWeight: 600 }}>
                    {photoWidth}px × {isAutoHeight ? 'Auto' : `${photoHeight}px`}
                  </span>
                </div>

                {/* Interactive Live Preview of Photo with Laser */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '14px 0',
                    backgroundColor: '#111111',
                    borderRadius: 12,
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: Math.min(photoWidth, 270),
                      maxWidth: '100%',
                      borderRadius: 16,
                      padding: photoBorderStyle === 'LASER' ? 2.5 : 0,
                      overflow: 'hidden',
                      backgroundColor: photoBorderStyle === 'LASER' ? '#0a0a0a' : '#262626',
                      boxShadow: photoBorderStyle === 'LASER'
                        ? laserColor === 'gradient'
                          ? '0 0 16px rgba(245, 96, 64, 0.5), 0 0 32px rgba(138, 63, 252, 0.35)'
                          : `0 0 16px ${laserColor}70, 0 0 32px ${laserColor}30`
                        : '0 4px 14px rgba(0,0,0,0.4)',
                      transition: 'box-shadow 0.3s ease, padding 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    {photoBorderStyle === 'LASER' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-70%',
                          left: '-70%',
                          width: '240%',
                          height: '240%',
                          background: laserColor === 'gradient'
                            ? 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, #FCAF45 300deg, #F56040 325deg, #8A3FFC 350deg, #FFFFFF 360deg)'
                            : `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${laserColor}15 285deg, ${laserColor}80 320deg, ${laserColor} 345deg, #FFFFFF 360deg)`,
                          animation: `laserSweep ${laserSpeed}s linear infinite`,
                          pointerEvents: 'none',
                          zIndex: 1
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        borderRadius: photoBorderStyle === 'LASER' ? 13.5 : 16,
                        overflow: 'hidden',
                        backgroundColor: '#1c1c1c',
                        width: '100%',
                        height: isAutoHeight ? 'auto' : `${Math.min(photoHeight || 200, 240)}px`
                      }}
                    >
                      <img
                        src={message.imageResName || '/avatars/gaming_post.jpg'}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: isAutoHeight ? 'auto' : `${Math.min(photoHeight || 200, 240)}px`,
                          maxHeight: isAutoHeight ? 240 : undefined,
                          objectFit: photoFit,
                          display: 'block'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 1. Style Selection (Normal vs Laser Light) */}
                <div>
                  <div style={{ color: '#A8A8A8', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                    Photo Border Style:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setPhotoBorderStyle('NORMAL')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 3,
                        padding: '10px 8px',
                        borderRadius: 10,
                        backgroundColor: photoBorderStyle === 'NORMAL' ? '#262626' : '#141414',
                        border: photoBorderStyle === 'NORMAL' ? '2px solid #0095F6' : '1px solid #2e2e2e',
                        color: photoBorderStyle === 'NORMAL' ? '#FFFFFF' : '#8E8E93',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: 13.5, fontWeight: 700 }}>🔘 Normal Style</span>
                      <span style={{ fontSize: 10.5, color: '#A8A8A8' }}>Classic Instagram Border (Default)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhotoBorderStyle('LASER')}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 3,
                        padding: '10px 8px',
                        borderRadius: 10,
                        backgroundColor: photoBorderStyle === 'LASER' ? 'rgba(0, 240, 255, 0.12)' : '#141414',
                        border: photoBorderStyle === 'LASER' ? '2px solid #00F0FF' : '1px solid #2e2e2e',
                        color: photoBorderStyle === 'LASER' ? '#00F0FF' : '#8E8E93',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: 13.5, fontWeight: 700 }}>⚡ Laser Light</span>
                      <span style={{ fontSize: 10.5, color: photoBorderStyle === 'LASER' ? '#00F0FF' : '#A8A8A8' }}>
                        Rotating Laser Glow
                      </span>
                    </button>
                  </div>
                </div>

                {/* Laser Light Options (Only when LASER is selected) */}
                {photoBorderStyle === 'LASER' && (
                  <div
                    style={{
                      backgroundColor: 'rgba(0, 240, 255, 0.05)',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      borderRadius: 10,
                      padding: 10
                    }}
                  >
                    <div style={{ color: '#00F0FF', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
                      Laser Beam Color:
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      {[
                        { label: '⚡ Cyan', val: '#00F0FF' },
                        { label: '🟢 Emerald', val: '#00FF66' },
                        { label: '🔴 Hot Pink', val: '#FF007F' },
                        { label: '🟡 Gold', val: '#FFD700' },
                        { label: '🟣 Violet', val: '#A855F7' },
                        { label: '⚪ White', val: '#FFFFFF' },
                        { label: '🌈 Gradient', val: 'gradient' }
                      ].map((c) => {
                        const isSel = laserColor === c.val;
                        return (
                          <button
                            key={c.val}
                            type="button"
                            onClick={() => setLaserColor(c.val)}
                            style={{
                              padding: '5px 9px',
                              borderRadius: 6,
                              backgroundColor: isSel ? '#00F0FF' : '#262626',
                              color: isSel ? '#000000' : '#FFFFFF',
                              border: 'none',
                              fontSize: 11,
                              fontWeight: isSel ? 700 : 500,
                              cursor: 'pointer'
                            }}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#A8A8A8', fontSize: 11, fontWeight: 500 }}>Laser Speed:</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[
                          { label: 'Fast (1.4s)', val: 1.4 },
                          { label: 'Normal (2.4s)', val: 2.4 },
                          { label: 'Smooth (3.8s)', val: 3.8 }
                        ].map((s) => (
                          <button
                            key={s.val}
                            type="button"
                            onClick={() => setLaserSpeed(s.val)}
                            style={{
                              padding: '3px 7px',
                              borderRadius: 5,
                              backgroundColor: laserSpeed === s.val ? '#00F0FF' : '#262626',
                              color: laserSpeed === s.val ? '#000000' : '#A8A8A8',
                              border: 'none',
                              fontSize: 10.5,
                              fontWeight: laserSpeed === s.val ? 700 : 400,
                              cursor: 'pointer'
                            }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Width Controller */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <label style={{ color: '#A8A8A8', fontSize: 12, fontWeight: 600 }}>
                      Width: {photoWidth}px
                    </label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[160, 220, 280, 340].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setPhotoWidth(w)}
                          style={{
                            padding: '2px 6px',
                            borderRadius: 4,
                            backgroundColor: photoWidth === w ? '#0095F6' : '#262626',
                            color: photoWidth === w ? '#FFFFFF' : '#A8A8A8',
                            border: 'none',
                            fontSize: 10.5,
                            cursor: 'pointer'
                          }}
                        >
                          {w === 220 ? '220 (Def)' : `${w}`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={120}
                    max={360}
                    step={5}
                    value={photoWidth}
                    onChange={(e) => setPhotoWidth(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#0095F6', cursor: 'pointer' }}
                  />
                </div>

                {/* 3. Height Controller */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ color: '#A8A8A8', fontSize: 12, fontWeight: 600 }}>
                      Height: {isAutoHeight ? 'Auto (Natural Ratio)' : `${photoHeight}px`}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAutoHeight(!isAutoHeight)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        backgroundColor: isAutoHeight ? '#0095F6' : '#262626',
                        color: isAutoHeight ? '#FFFFFF' : '#A8A8A8',
                        border: 'none',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {isAutoHeight ? '✓ Auto Ratio' : 'Set Auto'}
                    </button>
                  </div>

                  {!isAutoHeight && (
                    <>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                        {[
                          { label: 'Square 1:1', h: photoWidth },
                          { label: 'Portrait 4:5', h: Math.round(photoWidth * 1.25) },
                          { label: 'Cinema 16:9', h: Math.round(photoWidth * 0.56) }
                        ].map((asp) => (
                          <button
                            key={asp.label}
                            type="button"
                            onClick={() => setPhotoHeight(asp.h)}
                            style={{
                              padding: '2px 6px',
                              borderRadius: 4,
                              backgroundColor: photoHeight === asp.h ? '#0095F6' : '#262626',
                              color: photoHeight === asp.h ? '#FFFFFF' : '#A8A8A8',
                              border: 'none',
                              fontSize: 10.5,
                              cursor: 'pointer'
                            }}
                          >
                            {asp.label}
                          </button>
                        ))}
                      </div>
                      <input
                        type="range"
                        min={80}
                        max={450}
                        step={5}
                        value={photoHeight || 220}
                        onChange={(e) => setPhotoHeight(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#0095F6', cursor: 'pointer' }}
                      />
                    </>
                  )}
                </div>

                {/* 4. Object Fit */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ color: '#A8A8A8', fontSize: 12, fontWeight: 600 }}>Image Fit:</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['cover', 'contain'] as const).map((fitMode) => (
                      <button
                        key={fitMode}
                        type="button"
                        onClick={() => setPhotoFit(fitMode)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          backgroundColor: photoFit === fitMode ? '#0095F6' : '#262626',
                          color: photoFit === fitMode ? '#FFFFFF' : '#A8A8A8',
                          border: 'none',
                          fontSize: 11,
                          fontWeight: photoFit === fitMode ? 700 : 400,
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {fitMode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Button for Photo Settings */}
                <button
                  type="button"
                  onClick={() => {
                    onEditMessage(
                      message.id,
                      message.text,
                      message.timestamp,
                      message.isFromMe,
                      message.theme,
                      message.emojiFont,
                      selectedReaction || undefined,
                      photoWidth,
                      isAutoHeight ? undefined : photoHeight,
                      photoBorderStyle,
                      photoFit,
                      laserColor,
                      laserSpeed,
                      useCustomSpacing ? bubbleSpacing : undefined
                    );
                    onDismiss();
                  }}
                  style={{
                    backgroundColor: '#0095F6',
                    color: '#FFFFFF',
                    borderRadius: 8,
                    border: 'none',
                    padding: '11px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: 4,
                    boxShadow: '0 2px 10px rgba(0, 149, 246, 0.4)'
                  }}
                >
                  Save Photo Size & Style
                </button>
              </div>
            ) : isAudioMessage ? (
              /* ================= VOICE MESSAGE CUSTOMIZER ================= */
              <div
                style={{
                  backgroundColor: '#1E1E1E',
                  borderRadius: 14,
                  padding: '14px 16px',
                  marginBottom: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 700 }}>
                    🎙️ Voice Message Settings
                  </span>
                  <span
                    style={{
                      backgroundColor: '#0095F6',
                      color: '#FFFFFF',
                      borderRadius: 12,
                      padding: '2px 10px',
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    {audioDuration}
                  </span>
                </div>

                {/* Interactive Live Preview of Voice Bubble */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '14px 0',
                    backgroundColor: '#111111',
                    borderRadius: 12
                  }}
                >
                  <div
                    style={{
                      width: 'fit-content',
                      minWidth: 165,
                      maxWidth: 225,
                      borderRadius: editIsMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: editIsMe
                        ? 'linear-gradient(135deg, #7038F8 0%, #8A3FFC 50%, #9E27E8 100%)'
                        : '#262626',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2.2, height: 22, flex: 1 }}>
                      {[4, 8, 14, 18, 11, 7, 16, 22, 15, 9, 12, 19, 11, 6, 14, 9, 4].map((barHeight, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: 2.4,
                            height: `${barHeight}px`,
                            borderRadius: 1.5,
                            backgroundColor: idx < 6 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)'
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                      {audioDuration}
                    </div>
                  </div>
                </div>

                {/* Duration Presets & Input */}
                <div>
                  <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                    Voice Duration:
                  </label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    {['0:03', '0:05', '0:10', '0:15', '0:30', '1:00', '1:30'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAudioDuration(preset)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 8,
                          backgroundColor: audioDuration === preset ? '#0095F6' : '#262626',
                          color: audioDuration === preset ? '#FFFFFF' : '#A8A8A8',
                          border: audioDuration === preset ? '1.5px solid #0095F6' : '1px solid #383838',
                          fontSize: 12,
                          fontWeight: audioDuration === preset ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={audioDuration}
                    onChange={(e) => setAudioDuration(e.target.value)}
                    placeholder="e.g. 0:15"
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 8,
                      backgroundColor: '#262626',
                      border: '1px solid #383838',
                      color: '#FFFFFF',
                      padding: '0 10px',
                      fontSize: 13.5,
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Sender Selection */}
                <div>
                  <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                    Sender:
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setEditIsMe(true)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: 8,
                        backgroundColor: editIsMe ? '#8A3FFC' : '#262626',
                        color: '#FFFFFF',
                        border: editIsMe ? '1.5px solid #A855F7' : '1px solid #383838',
                        fontSize: 13,
                        fontWeight: editIsMe ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      Me (You)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditIsMe(false)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: 8,
                        backgroundColor: !editIsMe ? '#0095F6' : '#262626',
                        color: '#FFFFFF',
                        border: !editIsMe ? '1.5px solid #38BDF8' : '1px solid #383838',
                        fontSize: 13,
                        fontWeight: !editIsMe ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {contactName} (Received)
                    </button>
                  </div>
                </div>

                {/* Timestamp */}
                <div>
                  <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                    Timestamp:
                  </label>
                  <input
                    type="text"
                    value={editTimestamp}
                    onChange={(e) => setEditTimestamp(e.target.value)}
                    style={{
                      width: '100%',
                      height: 38,
                      borderRadius: 8,
                      backgroundColor: '#262626',
                      border: '1px solid #383838',
                      color: '#FFFFFF',
                      padding: '0 10px',
                      fontSize: 13.5,
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Save Button for Voice Settings */}
                <button
                  type="button"
                  onClick={() => {
                    onEditMessage(
                      message.id,
                      '',
                      editTimestamp,
                      editIsMe,
                      message.theme,
                      message.emojiFont,
                      selectedReaction || undefined,
                      undefined,
                      undefined,
                      undefined,
                      undefined,
                      undefined,
                      undefined,
                      useCustomSpacing ? bubbleSpacing : undefined,
                      audioDuration
                    );
                    onDismiss();
                  }}
                  style={{
                    backgroundColor: '#0095F6',
                    color: '#FFFFFF',
                    borderRadius: 8,
                    border: 'none',
                    padding: '11px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: 4,
                    boxShadow: '0 2px 10px rgba(0, 149, 246, 0.4)'
                  }}
                >
                  Save Voice Message
                </button>
              </div>
            ) : (
              <>
                {/* Quick Apply Theme / Overlay */}
                <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Lyrics / Overlay Effects (Butterfly, Hearts, Cyber, Luxe):
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {themes.map((thm) => {
                    const isSelected = message.theme === thm.key;
                    return (
                      <button
                        key={thm.key}
                        onClick={() => {
                          onEditMessage(
                            message.id,
                            message.text,
                            message.timestamp,
                            message.isFromMe,
                            thm.key,
                            message.emojiFont,
                            message.reaction,
                            photoWidth,
                            isAutoHeight ? undefined : photoHeight,
                            photoBorderStyle,
                            photoFit,
                            laserColor,
                            laserSpeed,
                            useCustomSpacing ? bubbleSpacing : undefined
                          );
                          onDismiss();
                        }}
                        style={{
                          borderRadius: 8,
                          backgroundColor: isSelected ? '#0095F6' : '#262626',
                          color: isSelected ? '#FFFFFF' : '#A8A8A8',
                          border: 'none',
                          padding: '8px 12px',
                          fontSize: 12,
                          fontWeight: isSelected ? 700 : 400,
                          cursor: 'pointer'
                        }}
                      >
                        {thm.label}
                      </button>
                    );
                  })}
                </div>

                {/* Message Preview */}
                <div
                  style={{
                    backgroundColor: '#262626',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 16
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: message.isFromMe ? '#8A3FFC' : '#0095F6',
                        display: 'inline-block',
                        marginRight: 8
                      }}
                    />
                    <span
                      style={{
                        color: message.isFromMe ? '#8A3FFC' : '#0095F6',
                        fontSize: 12,
                        fontWeight: 700
                      }}
                    >
                      {message.isFromMe ? 'You (Me)' : 'Received'}
                    </span>
                    <span style={{ color: '#8E8E93', fontSize: 11, marginLeft: 8 }}>
                      {message.timestamp}
                    </span>
                  </div>
                  <div style={{ color: '#FFFFFF', fontSize: 14 }}>
                    {message.text || `[${message.type}]`}
                  </div>
                </div>
              </>
            )}

            {/* Unified Chat Spacing Control: Global DM Gap + Individual Bubble Gap */}
            <div
              style={{
                backgroundColor: '#1C1C1E',
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 16,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ color: '#FFFFFF', fontSize: 13.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>↕ Chat Bubble Gap</span>
                </span>
                {onOpenSpacingModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onDismiss();
                      onOpenSpacingModal();
                    }}
                    style={{
                      background: 'rgba(0, 149, 246, 0.15)',
                      border: '1px solid #0095F6',
                      borderRadius: 6,
                      color: '#38BDF8',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 8px',
                      cursor: 'pointer'
                    }}
                  >
                    All Presets 📐
                  </button>
                )}
              </div>

              {/* 1. GLOBAL GAP CONTROLLER (All Bubbles) */}
              <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: '#D4D4D4', fontSize: 12.5, fontWeight: 600 }}>
                    🌐 All Bubbles Gap (Global):
                  </span>
                  <span
                    style={{
                      backgroundColor: '#0095F6',
                      color: '#FFFFFF',
                      borderRadius: 10,
                      padding: '1px 8px',
                      fontSize: 11.5,
                      fontWeight: 700
                    }}
                  >
                    {globalSpacing ?? 4}px
                  </span>
                </div>

                {/* Global Presets */}
                <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                  {[
                    { label: '0px', val: 0 },
                    { label: '4px (Default)', val: 4 },
                    { label: '10px', val: 10 },
                    { label: '18px', val: 18 },
                    { label: '28px', val: 28 }
                  ].map((preset) => {
                    const isSelected = (globalSpacing ?? 4) === preset.val;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          onUpdateGlobalSpacing?.(preset.val);
                        }}
                        style={{
                          flex: 1,
                          padding: '5px 2px',
                          borderRadius: 6,
                          backgroundColor: isSelected ? '#0095F6' : '#262626',
                          color: isSelected ? '#FFFFFF' : '#A8A8A8',
                          border: isSelected ? '1px solid #38BDF8' : '1px solid #383838',
                          fontSize: 11,
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Global Slider */}
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={globalSpacing ?? 4}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onUpdateGlobalSpacing?.(val);
                  }}
                  onInput={(e) => {
                    const val = Number((e.target as HTMLInputElement).value);
                    onUpdateGlobalSpacing?.(val);
                  }}
                  style={{
                    width: '100%',
                    height: 6,
                    accentColor: '#0095F6',
                    cursor: 'pointer',
                    touchAction: 'pan-x'
                  }}
                />
              </div>

              {/* 2. INDIVIDUAL BUBBLE GAP (This message only) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: '#D4D4D4', fontSize: 12, fontWeight: 600 }}>
                    🎯 This Bubble Only (Custom Gap):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (useCustomSpacing) {
                        setUseCustomSpacing(false);
                        setBubbleSpacing(globalSpacing ?? 4);
                        onUpdateSpacingLive?.(message.id, undefined);
                      } else {
                        setUseCustomSpacing(true);
                        onUpdateSpacingLive?.(message.id, bubbleSpacing);
                      }
                    }}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      backgroundColor: useCustomSpacing ? '#262626' : '#0095F6',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {useCustomSpacing ? 'Reset to Global' : 'Custom'}
                  </button>
                </div>

                {useCustomSpacing ? (
                  <>
                    <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                      {[
                        { label: '0px', val: 0 },
                        { label: '4px', val: 4 },
                        { label: '12px', val: 12 },
                        { label: '24px', val: 24 }
                      ].map((sp) => (
                        <button
                          key={sp.label}
                          type="button"
                          onClick={() => {
                            setBubbleSpacing(sp.val);
                            onUpdateSpacingLive?.(message.id, sp.val);
                          }}
                          style={{
                            padding: '4px 2px',
                            borderRadius: 6,
                            backgroundColor: bubbleSpacing === sp.val ? '#0095F6' : '#262626',
                            color: bubbleSpacing === sp.val ? '#FFFFFF' : '#A8A8A8',
                            border: 'none',
                            fontSize: 11,
                            fontWeight: bubbleSpacing === sp.val ? 700 : 500,
                            cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          {sp.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={1}
                      value={bubbleSpacing}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBubbleSpacing(val);
                        onUpdateSpacingLive?.(message.id, val);
                      }}
                      onInput={(e) => {
                        const val = Number((e.target as HTMLInputElement).value);
                        setBubbleSpacing(val);
                        onUpdateSpacingLive?.(message.id, val);
                      }}
                      style={{ width: '100%', height: 6, accentColor: '#0095F6', cursor: 'pointer', touchAction: 'pan-x' }}
                    />
                  </>
                ) : (
                  <div style={{ color: '#8E8E93', fontSize: 11.5 }}>
                    Using global spacing ({globalSpacing ?? 4}px). Tap "Custom" above to set a separate gap below this message.
                  </div>
                )}
              </div>

              {/* Reset All Custom Gaps (Unify) */}
              {onResetAllCustomGaps && (
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      onResetAllCustomGaps();
                      setUseCustomSpacing(false);
                      setBubbleSpacing(globalSpacing ?? 4);
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#262626',
                      border: '1px solid #383838',
                      borderRadius: 8,
                      padding: '7px 10px',
                      color: '#C7C7CC',
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <span>🔄 Reset All Custom Gaps to {globalSpacing ?? 4}px</span>
                  </button>
                </div>
              )}
            </div>

            {/* Actions list */}
            <div>
              {/* Edit Content */}
              <div
                onClick={() => setIsEditing(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 4px',
                  cursor: 'pointer',
                  borderBottom: '0.5px solid #1A1A1A'
                }}
              >
                <EditIcon size={20} color="#FFFFFF" />
                <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 500, marginLeft: 14 }}>
                  Edit Message Content
                </span>
              </div>

              {/* Swap sender */}
              <div
                onClick={() => {
                  onEditMessage(
                    message.id,
                    message.text,
                    message.timestamp,
                    !message.isFromMe,
                    message.theme,
                    message.emojiFont,
                    message.reaction,
                    message.imageWidth,
                    message.imageHeight,
                    message.photoStyle,
                    message.imageFit,
                    message.laserColor,
                    message.laserSpeed,
                    message.customSpacing,
                    audioDuration || message.audioDuration
                  );
                  onDismiss();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 4px',
                  cursor: 'pointer',
                  borderBottom: '0.5px solid #1A1A1A'
                }}
              >
                <SwapIcon size={20} color="#FFFFFF" />
                <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 500, marginLeft: 14 }}>
                  {message.isFromMe ? `Change Sender to ${contactName}` : 'Change Sender to You'}
                </span>
              </div>

              {/* Delete / unsend */}
              <div
                onClick={() => {
                  onDeleteMessage(message.id);
                  onDismiss();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 4px',
                  cursor: 'pointer'
                }}
              >
                <DeleteIcon size={20} color="#ED4956" />
                <span style={{ color: '#ED4956', fontSize: 15, fontWeight: 500, marginLeft: 14 }}>
                  Unsend / Delete Message
                </span>
              </div>

              {/* Done Button */}
              <button
                type="button"
                onClick={onDismiss}
                style={{
                  marginTop: 14,
                  width: '100%',
                  backgroundColor: '#262626',
                  color: '#FFFFFF',
                  borderRadius: 10,
                  border: '1px solid #383838',
                  padding: '10px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </>
        ) : (
          /* ================= INLINE EDITING VIEW ================= */
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700, margin: 0 }}>
                Edit Message
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A8A8A8',
                  fontSize: 13,
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                Back
              </button>
            </div>

            {/* Interactive Live Bubble Preview Container */}
            <div
              style={{
                backgroundColor: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#8E8E93', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Live Preview
                </span>
                <span style={{ color: '#0095F6', fontSize: 11, fontWeight: 500 }}>
                  {selectedTheme === 'CLASSIC' ? 'Classic' : selectedTheme} · {selectedEmojiFont || 'Chat Font'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: editIsMe ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  padding: '4px 0',
                  width: '100%'
                }}
              >
                <div style={{ position: 'relative', display: 'inline-block', maxWidth: '85%' }}>
                  {selectedTheme && selectedTheme !== 'CLASSIC' ? (
                    <AestheticLyricsBubble
                      text={editText || 'Type a message...'}
                      theme={selectedTheme}
                      isFromMe={editIsMe}
                      emojiFont={selectedEmojiFont}
                    />
                  ) : (
                    (() => {
                      const classicLayout = calculateBubbleLayout(editText || 'Type a message...');
                      return (
                        <div
                          style={{
                            display: 'inline-block',
                            width: 'fit-content',
                            maxWidth: '100%',
                            borderRadius: editIsMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            background: editIsMe
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
                            boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          {renderBubbleTextWithEmojiFont(
                            editText || 'Type a message...',
                            selectedEmojiFont,
                            classicLayout.fontWeight,
                            '#FFFFFF'
                          )}
                        </div>
                      );
                    })()
                  )}

                  {/* Reaction Badge in Live Preview */}
                  {selectedReaction && (
                    <div
                      title={`Reaction: ${selectedReaction}`}
                      style={{
                        position: 'absolute',
                        bottom: -9,
                        [editIsMe ? 'left' : 'right']: (selectedTheme && selectedTheme !== 'CLASSIC') ? 10 : 6,
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
                        fontFamily: `'${selectedEmojiFont}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`,
                        animation: 'popInReaction 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                    >
                      {selectedReaction}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message Text Input */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4, fontWeight: 500 }}>
                Message Text
              </label>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  backgroundColor: '#262626',
                  border: '1px solid #383838',
                  color: '#FFFFFF',
                  padding: 10,
                  fontSize: 14,
                  boxSizing: 'border-box',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Timestamp */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4, fontWeight: 500 }}>
                Timestamp (e.g. 12:42 PM)
              </label>
              <input
                type="text"
                value={editTimestamp}
                onChange={(e) => setEditTimestamp(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  borderRadius: 8,
                  backgroundColor: '#262626',
                  border: '1px solid #383838',
                  color: '#FFFFFF',
                  padding: '0 10px',
                  fontSize: 14,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            {/* Sender Selection */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                Sender
              </label>
              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ color: '#FFFFFF', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="radio"
                    checked={editIsMe}
                    onChange={() => setEditIsMe(true)}
                    style={{ accentColor: '#8A3FFC' }}
                  />
                  Me (You)
                </label>
                <label style={{ color: '#FFFFFF', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="radio"
                    checked={!editIsMe}
                    onChange={() => setEditIsMe(false)}
                    style={{ accentColor: '#0095F6' }}
                  />
                  {contactName}
                </label>
              </div>
            </div>

            {/* Theme Overlay Selection */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                Theme Overlay
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {themes.map((thm) => (
                  <button
                    key={thm.key}
                    type="button"
                    onClick={() => setSelectedTheme(thm.key)}
                    style={{
                      borderRadius: 8,
                      backgroundColor: selectedTheme === thm.key ? '#0095F6' : '#262626',
                      color: selectedTheme === thm.key ? '#FFFFFF' : '#A8A8A8',
                      border: 'none',
                      padding: '7px 11px',
                      fontSize: 11.5,
                      fontWeight: selectedTheme === thm.key ? 700 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    {thm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Emoji Font with Live Preview for this message */}
            <EmojiFontPreviewDropdown
              value={selectedEmojiFont}
              onChange={setSelectedEmojiFont}
              messageText={editText}
              chatDefaultFontFamily="SamsungOneUI_4_Xmas"
              label="Message Emoji Style (Live Preview)"
            />

            {/* Bubble Reaction Selector */}
            <div style={{ marginTop: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ color: '#A8A8A8', fontSize: 12, fontWeight: 500 }}>
                  Bubble Reaction
                </label>
                {selectedReaction && (
                  <button
                    type="button"
                    onClick={() => setSelectedReaction('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ED4956',
                      fontSize: 11,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Remove Reaction
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setSelectedReaction('')}
                  style={{
                    borderRadius: 8,
                    backgroundColor: !selectedReaction ? '#0095F6' : '#262626',
                    color: !selectedReaction ? '#FFFFFF' : '#A8A8A8',
                    border: 'none',
                    padding: '6px 10px',
                    fontSize: 12,
                    fontWeight: !selectedReaction ? 700 : 400,
                    cursor: 'pointer'
                  }}
                >
                  None
                </button>
                {['❤️', '😂', '🔥', '😮', '😢', '👍', '🎉', '🙏', '😍', '💯'].map((emoji) => {
                  const isSelected = selectedReaction === emoji;
                  return (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedReaction(isSelected ? '' : emoji)}
                      style={{
                        borderRadius: 8,
                        backgroundColor: isSelected ? 'rgba(0, 149, 246, 0.25)' : '#262626',
                        border: isSelected ? '1.5px solid #0095F6' : '1.5px solid transparent',
                        padding: '4px 8px',
                        fontSize: 18,
                        cursor: 'pointer',
                        lineHeight: 1,
                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bubble Spacing in Edit Mode (Global + Custom) */}
            <div
              style={{
                backgroundColor: '#1E1E1E',
                borderRadius: 12,
                padding: '12px 14px',
                marginTop: 10,
                marginBottom: 16,
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {/* Global Spacing */}
              <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ color: '#D4D4D4', fontSize: 12, fontWeight: 600 }}>
                    🌐 All Bubbles Gap (Global):
                  </label>
                  <span style={{ color: '#0095F6', fontSize: 12, fontWeight: 700 }}>
                    {globalSpacing ?? 4}px
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={globalSpacing ?? 4}
                  onChange={(e) => onUpdateGlobalSpacing?.(Number(e.target.value))}
                  onInput={(e) => onUpdateGlobalSpacing?.(Number((e.target as HTMLInputElement).value))}
                  style={{ width: '100%', height: 6, accentColor: '#0095F6', cursor: 'pointer', touchAction: 'pan-x' }}
                />
              </div>

              {/* Individual Custom Spacing */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ color: '#D4D4D4', fontSize: 12, fontWeight: 600 }}>
                  🎯 This Bubble Gap: <span style={{ color: '#0095F6' }}>{useCustomSpacing ? `${bubbleSpacing}px` : `${globalSpacing ?? 4}px (Default)`}</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (useCustomSpacing) {
                      setUseCustomSpacing(false);
                      setBubbleSpacing(globalSpacing ?? 4);
                      onUpdateSpacingLive?.(message.id, undefined);
                    } else {
                      setUseCustomSpacing(true);
                      onUpdateSpacingLive?.(message.id, bubbleSpacing);
                    }
                  }}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    backgroundColor: useCustomSpacing ? '#262626' : '#0095F6',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {useCustomSpacing ? 'Use Global' : 'Custom'}
                </button>
              </div>
              {useCustomSpacing && (
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={bubbleSpacing}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBubbleSpacing(val);
                    onUpdateSpacingLive?.(message.id, val);
                  }}
                  onInput={(e) => {
                    const val = Number((e.target as HTMLInputElement).value);
                    setBubbleSpacing(val);
                    onUpdateSpacingLive?.(message.id, val);
                  }}
                  style={{ width: '100%', height: 6, accentColor: '#0095F6', cursor: 'pointer', touchAction: 'pan-x' }}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12, paddingBottom: 6 }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A8A8A8',
                  padding: '9px 16px',
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onEditMessage(
                    message.id,
                    editText,
                    editTimestamp,
                    editIsMe,
                    selectedTheme,
                    selectedEmojiFont || undefined,
                    selectedReaction || undefined,
                    photoWidth,
                    isAutoHeight ? undefined : photoHeight,
                    photoBorderStyle,
                    photoFit,
                    laserColor,
                    laserSpeed,
                    useCustomSpacing ? bubbleSpacing : undefined
                  );
                  onDismiss();
                }}
                style={{
                  backgroundColor: '#0095F6',
                  color: '#FFFFFF',
                  borderRadius: 8,
                  border: 'none',
                  padding: '9px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0, 149, 246, 0.4)'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes laserSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
