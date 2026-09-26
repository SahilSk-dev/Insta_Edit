import React, { useState } from 'react';
import { ChatMessage, BubbleTheme } from '../types/chat';
import { EditIcon, DeleteIcon, SwapIcon } from './InstagramIcons';

interface MessageActionModalProps {
  message: ChatMessage;
  contactName?: string;
  onEditMessage: (id: string, newText: string, newTimestamp: string, isFromMe: boolean, theme: BubbleTheme) => void;
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
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 85,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: '#121212',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: '20px 20px 36px 20px',
          boxSizing: 'border-box',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            margin: '0 auto 16px auto'
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
                marginBottom: 16
              }}
            >
              {['❤️', '😂', '🔥', '😮', '😢', '👍'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReactEmoji(emoji);
                    onDismiss();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 26,
                    cursor: 'pointer',
                    padding: 4,
                    lineHeight: 1
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>

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
          /* Inline Editing View */
          <div>
            <h3 style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700, margin: '0 0 14px 0' }}>
              Edit Message
            </h3>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
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
                  border: '1px solid #333',
                  color: '#FFFFFF',
                  padding: 10,
                  fontSize: 14,
                  boxSizing: 'border-box',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
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
                  border: '1px solid #333',
                  color: '#FFFFFF',
                  padding: '0 10px',
                  fontSize: 14,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 6 }}>
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

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 6 }}>
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
                      padding: '6px 10px',
                      fontSize: 11,
                      fontWeight: selectedTheme === thm.key ? 700 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    {thm.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A8A8A8',
                  padding: '8px 16px',
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onEditMessage(message.id, editText, editTimestamp, editIsMe, selectedTheme);
                  onDismiss();
                }}
                style={{
                  backgroundColor: '#0095F6',
                  color: '#FFFFFF',
                  borderRadius: 8,
                  border: 'none',
                  padding: '8px 18px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
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
