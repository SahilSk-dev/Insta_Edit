import React, { useState, useRef, useEffect } from 'react';
import { POPULAR_EMOJI_FONTS } from '../data/emojiFonts';

interface EmojiFontPreviewDropdownProps {
  value: string;
  onChange: (fontFamily: string) => void;
  messageText?: string;
  chatDefaultFontFamily?: string;
  label?: string;
  allowInherit?: boolean;
}

const EMOJI_SPLIT_REGEX = /((?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\u200d|[\uFE00-\uFE0F]|\ud83c[\udffb-\udfff])+|[❤️🔥✨🦋👑🌙💗⚡])/u;
const IS_EMOJI_REGEX = /^(?:(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\u200d|[\uFE00-\uFE0F]|\ud83c[\udffb-\udfff])+|[❤️🔥✨🦋👑🌙💗⚡])+$/u;

export const extractEmojisFromText = (text?: string): string => {
  if (!text) return '';
  const parts = text.split(EMOJI_SPLIT_REGEX);
  const emojis = parts.filter((p) => IS_EMOJI_REGEX.test(p.trim()));
  if (emojis.length > 0) {
    return emojis.slice(0, 6).join(' ');
  }
  return '';
};

export const EmojiFontPreviewDropdown: React.FC<EmojiFontPreviewDropdownProps> = ({
  value,
  onChange,
  messageText = '',
  chatDefaultFontFamily = 'SamsungOneUI_4_Xmas',
  label = 'Message Emoji Style (Live Preview)',
  allowInherit = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Proactively warm up browser font cache for all emoji fonts
  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      POPULAR_EMOJI_FONTS.forEach((f) => {
        if (f.fontFamily && f.fontFamily !== 'inherit') {
          document.fonts.load(`20px "${f.fontFamily}"`).catch(() => {});
        }
      });
    }
  }, []);

  const messageEmojis = extractEmojisFromText(messageText);
  const hasMessageEmojis = Boolean(messageEmojis);

  const effectiveFont = value || chatDefaultFontFamily;
  const currentFontObj = POPULAR_EMOJI_FONTS.find((f) => f.fontFamily === value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const defaultSampleEmojis = '❤️ 🔥 🦋 ✨ 🌙';

  return (
    <div ref={containerRef} style={{ width: '100%', marginBottom: 14 }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label style={{ color: '#A8A8A8', fontSize: 12, fontWeight: 500 }}>
            {label}
          </label>
          <span style={{ color: '#0095F6', fontSize: 11 }}>
            {hasMessageEmojis ? 'Using message emojis' : 'Sample emojis'}
          </span>
        </div>
      )}

      {/* Trigger Box with Live Emoji Preview */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: '100%',
          minHeight: 48,
          borderRadius: 10,
          backgroundColor: '#262626',
          border: isOpen ? '1.5px solid #0095F6' : '1px solid #383838',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxSizing: 'border-box',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
          {/* Prominent Emoji Preview */}
          <div
            style={{
              fontFamily: `'${effectiveFont}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`,
              fontSize: 22,
              lineHeight: 1.2,
              letterSpacing: '3px',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            {hasMessageEmojis ? messageEmojis : (currentFontObj ? currentFontObj.sampleEmojis.slice(0, 4).join(' ') : defaultSampleEmojis)}
          </div>

          {/* Subtitle font name */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {value ? (currentFontObj?.name || value) : '(Inherit Chat Default)'}
            </span>
            <span style={{ color: '#8E8E93', fontSize: 10.5 }}>
              {isOpen ? 'Tap to close styles' : 'Tap to change style'}
            </span>
          </div>
        </div>

        <div style={{ color: '#8E8E93', fontSize: 12, paddingLeft: 8 }}>
          {isOpen ? '▲' : '▼'}
        </div>
      </div>

      {/* In-Flow Expandable List: Eliminates clipping & allows natural modal scroll */}
      {isOpen && (
        <div
          style={{
            width: '100%',
            marginTop: 8,
            maxHeight: 240,
            overflowY: 'auto',
            backgroundColor: '#1E1E1E',
            border: '1px solid #383838',
            borderRadius: 12,
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.45)',
            padding: '6px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          {/* Option: Inherit Chat Default */}
          {allowInherit && (
            <div
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              style={{
                borderRadius: 8,
                padding: '9px 12px',
                cursor: 'pointer',
                backgroundColor: !value ? 'rgba(0, 149, 246, 0.2)' : 'transparent',
                border: !value ? '1px solid #0095F6' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                {/* Live Emoji Preview */}
                <div
                  style={{
                    fontFamily: `'${chatDefaultFontFamily}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`,
                    fontSize: 20,
                    lineHeight: 1.2,
                    letterSpacing: '2px',
                    flexShrink: 0
                  }}
                >
                  {hasMessageEmojis ? messageEmojis : defaultSampleEmojis}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 600 }}>
                    (Chat Default)
                  </span>
                  <span style={{ color: '#8E8E93', fontSize: 10 }}>
                    Follows global chat font
                  </span>
                </div>
              </div>
              {!value && <span style={{ color: '#0095F6', fontSize: 14, fontWeight: 700 }}>✓</span>}
            </div>
          )}

          {/* All Available Popular Emoji Fonts with Full Emoji Previews */}
          {POPULAR_EMOJI_FONTS.map((f) => {
            const isSelected = value === f.fontFamily;
            const emojisToShow = hasMessageEmojis ? messageEmojis : f.sampleEmojis.slice(0, 5).join(' ');

            return (
              <div
                key={f.id}
                onClick={() => {
                  onChange(f.fontFamily);
                  setIsOpen(false);
                }}
                style={{
                  borderRadius: 8,
                  padding: '9px 12px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgba(0, 149, 246, 0.2)' : '#262626',
                  border: isSelected ? '1px solid #0095F6' : '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                  {/* Big Live Emoji Preview in that exact font */}
                  <div
                    style={{
                      fontFamily: `'${f.fontFamily}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`,
                      fontSize: 20,
                      lineHeight: 1.2,
                      letterSpacing: '2px',
                      flexShrink: 0
                    }}
                  >
                    {emojisToShow}
                  </div>

                  {/* Font Name Tag */}
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {f.name}
                    </span>
                    <span style={{ color: '#8E8E93', fontSize: 10 }}>
                      {f.badge || f.category}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span style={{ color: '#0095F6', fontSize: 14, fontWeight: 700, paddingLeft: 8 }}>
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
