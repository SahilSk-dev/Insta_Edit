import React, { useState } from 'react';
import { ChatMessage, BubbleTheme } from '../types/chat';
import { EditIcon, DeleteIcon, SwapIcon } from './InstagramIcons';
import { AestheticLyricsBubble, calculateBubbleLayout, renderBubbleTextWithEmojiFont } from './AestheticBubble';
import { EmojiFontPreviewDropdown } from './EmojiFontPreviewDropdown';

interface MessageActionModalProps {
  message: ChatMessage;
  contactName?: string;
  onEditMessage: (
    id: string,
    newText: string,
    newTimestamp: string,
    isFromMe: boolean,
    theme: BubbleTheme,
    emojiFont?: string,
    reaction?: string
  ) => void;
  onDeleteMessage: (id: string) => void;
  onReactEmoji: (emoji: string) => void;
  onDismiss: () => void;
}

export const MessageActionModal: React.FC<MessageActionModalProps> = ({
  message,
  contactName = 'Sahil',
  onEditMessage,
  onDeleteMessage,
  onReactEmoji,
  onDismiss
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [editTimestamp, setEditTimestamp] = useState(message.timestamp);
  const [editIsMe, setEditIsMe] = useState(message.isFromMe);
  const [selectedTheme, setSelectedTheme] = useState<BubbleTheme>(message.theme || 'CLASSIC');
  const [selectedEmojiFont, setSelectedEmojiFont] = useState<string>(message.emojiFont || '');
  const [selectedReaction, setSelectedReaction] = useState<string>(message.reaction || '');

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

            {/* Quick Apply Theme / Overlay */}
            <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Lyrics / Overlay Effects (Projapoti, Hearts, Neon):
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {themes.map((thm) => {
                const isSelected = message.theme === thm.key;
                return (
                  <button
                    key={thm.key}
                    onClick={() => {
                      onEditMessage(message.id, message.text, message.timestamp, message.isFromMe, thm.key);
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
                  onEditMessage(message.id, message.text, message.timestamp, !message.isFromMe, message.theme);
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
                  Live Preview (হুবহু লাইভ প্রিভিউ)
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

            {/* Bubble Reaction (প্রতিক্রিয়া) Selector */}
            <div style={{ marginTop: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ color: '#A8A8A8', fontSize: 12, fontWeight: 500 }}>
                  Bubble Reaction (প্রতিক্রিয়া)
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
                    selectedReaction || undefined
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
    </div>
  );
};
