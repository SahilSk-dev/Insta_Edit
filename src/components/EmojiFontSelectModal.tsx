import React, { useState, useRef } from 'react';
import { POPULAR_EMOJI_FONTS, EmojiFontOption, loadCustomFont } from '../data/emojiFonts';
import { CloseIcon, PlusIcon } from './InstagramIcons';

interface EmojiFontSelectModalProps {
  currentFontFamily: string;
  onSelectFont: (fontFamily: string) => void;
  onDismiss: () => void;
  onToast: (msg: string) => void;
}

export const EmojiFontSelectModal: React.FC<EmojiFontSelectModalProps> = ({
  currentFontFamily,
  onSelectFont,
  onDismiss,
  onToast
}) => {
  const [selectedEmojiFont, setSelectedEmojiFont] = useState<string>(currentFontFamily || 'SamsungOneUI_4_Xmas');
  const [customTestText, setCustomTestText] = useState('Hello Sahil! Squad ready 🔥 🫰 🥹 ✨');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Samsung' | 'Facebook' | 'Apple' | 'Other'>('ALL');
  const [customEmojiFonts, setCustomEmojiFonts] = useState<EmojiFontOption[]>([]);
  const emojiFileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['ALL', 'Samsung', 'Facebook', 'Apple', 'Other'] as const;

  const allEmojiFonts = [...POPULAR_EMOJI_FONTS, ...customEmojiFonts];

  const filteredEmojiFonts = allEmojiFonts.filter((font) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'Samsung') return font.category === 'Samsung';
    if (selectedCategory === 'Facebook') return font.category === 'Facebook';
    if (selectedCategory === 'Apple') return font.category === 'Apple';
    return font.category !== 'Samsung' && font.category !== 'Facebook' && font.category !== 'Apple';
  });

  const handleCustomEmojiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fontName = file.name.replace(/\.[^/.]+$/, '');
    const cleanFontFamily = 'CustomEmoji_' + fontName.replace(/[^a-zA-Z0-9_-]/g, '_');

    try {
      const buffer = await file.arrayBuffer();
      const success = await loadCustomFont(cleanFontFamily, buffer);
      if (success) {
        const newOpt: EmojiFontOption = {
          id: `custom-emoji-${Date.now()}`,
          name: fontName,
          fontFamily: cleanFontFamily,
          category: 'Custom',
          description: `Custom uploaded emoji font: ${file.name}`,
          badge: 'Custom 💾',
          sampleEmojis: ['🥹', '🫰', '🥰', '🥀', '✨', '🔥'],
          isLocal: true
        };
        setCustomEmojiFonts((prev) => [newOpt, ...prev]);
        setSelectedEmojiFont(cleanFontFamily);
        onSelectFont(cleanFontFamily);
        onToast(`Loaded custom emoji font: ${fontName}`);
      } else {
        onToast('Could not parse emoji font file.');
      }
    } catch (err) {
      console.error(err);
      onToast('Failed to load custom emoji font.');
    }
  };

  const handleApplyEmojiFont = (fontFamily: string) => {
    setSelectedEmojiFont(fontFamily);
    onSelectFont(fontFamily);
    const found = allEmojiFonts.find((f) => f.fontFamily === fontFamily);
    onToast(`Emoji font set: ${found ? found.name : fontFamily}`);
  };

  // Normal text uses native system-ui, while emojis resolve to selectedEmojiFont
  const previewFontStack = `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "FL Bonolota", '${selectedEmojiFont}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 90,
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
          maxWidth: 520,
          maxHeight: '90vh',
          backgroundColor: '#121212',
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -6px 28px rgba(0, 0, 0, 0.7)',
          animation: 'slideUpModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden'
        }}
      >
        <style>{`
          @keyframes slideUpModal {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>

        {/* Drag handle & Header */}
        <div style={{ padding: '14px 18px 10px 18px', borderBottom: '1px solid #222222' }}>
          <div
            style={{
              width: 36,
              height: 4,
              backgroundColor: '#3E3E3E',
              borderRadius: 2,
              margin: '0 auto 12px auto'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Select Emoji Font
              </h2>
              <p style={{ fontSize: 12, color: '#8E8E93', margin: '3px 0 0 0' }}>
                Text stays in your mobile system font • Only emojis change
              </p>
            </div>
            <button
              onClick={onDismiss}
              style={{
                background: 'none',
                border: 'none',
                color: '#A8A8A8',
                cursor: 'pointer',
                padding: 6,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <CloseIcon size={20} color="#FFFFFF" />
            </button>
          </div>
        </div>

        {/* Live Preview Box */}
        <div style={{ padding: '10px 18px', backgroundColor: '#181818', borderBottom: '1px solid #242424' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live Chat Bubble Preview
            </span>
            <span style={{ fontSize: 11, color: '#3897F0' }}>
              Active: {selectedEmojiFont}
            </span>
          </div>

          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#262626',
              borderRadius: 14,
              border: '1px solid #333333',
              fontSize: 15,
              lineHeight: '22px',
              color: '#FFFFFF',
              fontFamily: previewFontStack,
              wordBreak: 'break-word',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8
            }}
          >
            <input
              type="text"
              value={customTestText}
              onChange={(e) => setCustomTestText(e.target.value)}
              placeholder="Type to test text and emojis..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: 15,
                fontFamily: previewFontStack,
                width: '100%'
              }}
            />
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={emojiFileInputRef}
          onChange={handleCustomEmojiUpload}
          accept=".ttf,.otf,.woff2"
          style={{ display: 'none' }}
        />

        {/* Category Filter Pills & Upload Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px 4px 18px',
            gap: 8,
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: selectedCategory === cat ? '#FFFFFF' : '#222222',
                  color: selectedCategory === cat ? '#000000' : '#A8A8A8',
                  border: 'none',
                  borderRadius: 14,
                  padding: '4px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => emojiFileInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              backgroundColor: '#262626',
              color: '#3897F0',
              border: '1px solid #383838',
              borderRadius: 14,
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <PlusIcon size={12} color="#3897F0" />
            <span>Upload .ttf</span>
          </button>
        </div>

        {/* Emoji Font Cards */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 18px 18px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}
        >
          {filteredEmojiFonts.map((font) => {
            const isSelected = selectedEmojiFont === font.fontFamily;
            const fontStackForCard = `'${font.fontFamily}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

            return (
              <div
                key={font.id}
                onClick={() => handleApplyEmojiFont(font.fontFamily)}
                style={{
                  backgroundColor: isSelected ? 'rgba(0, 149, 246, 0.12)' : '#1A1A1A',
                  border: isSelected ? '1.5px solid #0095F6' : '1px solid #262626',
                  borderRadius: 14,
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isSelected ? '#0095F6' : '#FFFFFF' }}>
                      {font.name}
                    </span>
                    {font.badge && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          backgroundColor: '#333333',
                          color: '#FFFFFF',
                          padding: '2px 7px',
                          borderRadius: 10
                        }}
                      >
                        {font.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0095F6' }}>
                      ✓ ACTIVE
                    </span>
                  )}
                </div>

                <p style={{ fontSize: 12, color: '#8E8E93', margin: '0 0 8px 0' }}>
                  {font.description}
                </p>

                <div
                  style={{
                    fontSize: 22,
                    letterSpacing: '4px',
                    fontFamily: fontStackForCard,
                    backgroundColor: '#222222',
                    borderRadius: 8,
                    padding: '6px 10px',
                    lineHeight: '28px'
                  }}
                >
                  {font.sampleEmojis.join(' ')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Done Button */}
        <div style={{ padding: '10px 18px 16px 18px', borderTop: '1px solid #222222', display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              width: '100%',
              backgroundColor: '#0095F6',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              padding: '12px 0',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
