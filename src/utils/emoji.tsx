import React from 'react';

// Regular expression to match all Unicode emojis including zero-width joiners and variations
const EMOJI_REGEX = /(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)/gu;

export function parseEmojiToHex(emoji: string): string {
  const codePoints: string[] = [];
  for (const sym of emoji) {
    const cp = sym.codePointAt(0);
    if (cp) {
      codePoints.push(cp.toString(16).toLowerCase());
    }
  }
  return codePoints.join('-');
}

export function renderWithIOSEmojis(text: string): React.ReactNode[] {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const regex = new RegExp(EMOJI_REGEX);
  let keyCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    const emojiChar = match[0];
    const hex = parseEmojiToHex(emojiChar);
    const appleImgUrl = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${hex}.png`;

    parts.push(
      <span key={`emoji-${keyCounter++}-${hex}`} className="ios-emoji-container">
        <img
          src={appleImgUrl}
          alt={emojiChar}
          className="ios-emoji"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'inline';
          }}
        />
        <span className="ios-emoji-fallback" style={{ display: 'none' }}>
          {emojiChar}
        </span>
      </span>
    );

    lastIndex = matchIndex + emojiChar.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
