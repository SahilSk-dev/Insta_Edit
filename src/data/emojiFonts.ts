export interface EmojiFontOption {
  id: string;
  name: string;
  fontFamily: string;
  category: 'Samsung' | 'Facebook' | 'Apple' | 'Twitter' | 'Google' | 'Microsoft' | 'Custom';
  description: string;
  badge?: string;
  sampleEmojis: string[];
  isLocal: boolean;
  fileUrl?: string;
}

export const POPULAR_EMOJI_FONTS: EmojiFontOption[] = [
  {
    id: 'samsung-oneui-4-xmas',
    name: 'Samsung OneUI 4 (Xmas)',
    fontFamily: 'SamsungOneUI_4_Xmas',
    category: 'Samsung',
    description: 'Special Christmas/Holiday edition with Samsung OneUI 4 styling',
    badge: 'Festive ⭐',
    sampleEmojis: ['❤️', '🫰', '🎄', '🎁', '✨', '🥰', '🔥'],
    isLocal: true,
    fileUrl: '/fonts/emoji/SamsungOneUI_4_Xmas.ttf'
  },
  {
    id: 'samsung-oneui-4',
    name: 'Samsung OneUI 4',
    fontFamily: 'Samsung_OneUI_4',
    category: 'Samsung',
    description: 'Classic Samsung Galaxy OneUI 4 authentic emojis',
    badge: 'Popular 🔥',
    sampleEmojis: ['🥹', '🫰', '🥰', '🥀', '🦋', '✨', '🔥'],
    isLocal: true,
    fileUrl: '/fonts/emoji/Samsung_OneUI_4.ttf'
  },
  {
    id: 'facebook-15',
    name: 'Facebook 15.0',
    fontFamily: 'Facebook15.0',
    category: 'Facebook',
    description: 'Official Facebook & Messenger 15.0 emoji set',
    badge: 'Official 💬',
    sampleEmojis: ['❤️', '😆', '😮', '😢', '😡', '👍', '🔥'],
    isLocal: true,
    fileUrl: '/fonts/emoji/Facebook15.0.ttf'
  },
  {
    id: 'samsung-oneui-6-1',
    name: 'Samsung OneUI 6.1',
    fontFamily: 'OneUI6.1',
    category: 'Samsung',
    description: 'Latest Samsung OneUI 6.1 Galaxy flagship emoji design',
    badge: 'New 📱',
    sampleEmojis: ['🥹', '🫰', '✨', '💖', '🥰', '🔥', '🎉'],
    isLocal: true,
    fileUrl: '/fonts/emoji/OneUI6.1.ttf'
  },
  {
    id: 'apple-ios-18',
    name: 'Apple iOS 18',
    fontFamily: 'iOS18',
    category: 'Apple',
    description: 'Latest Apple iPhone iOS 18 crisp emoji set',
    badge: 'iOS 🍎',
    sampleEmojis: ['🥹', '🫰', '🥀', '🦋', '✨', '🔥', '💀'],
    isLocal: true,
    fileUrl: '/fonts/emoji/unofficial_iOS18_S.ttf'
  },
  {
    id: 'twitter-twemoji',
    name: 'Twemoji (Twitter / X)',
    fontFamily: 'Twemoji',
    category: 'Twitter',
    description: 'Twitter / X clean modern vector emoji style',
    badge: 'Clean 🐦',
    sampleEmojis: ['🥹', '🫰', '🥰', '🥀', '✨', '🔥', '💯'],
    isLocal: true,
    fileUrl: '/fonts/emoji/Twemoji-v15.0.3.ttf'
  },
  {
    id: 'windows-11',
    name: 'Windows 11 Fluent',
    fontFamily: 'Windows11',
    category: 'Microsoft',
    description: 'Microsoft Windows 11 Fluent colorful emoji design',
    badge: 'Fluent 🪟',
    sampleEmojis: ['🥹', '🫰', '🥰', '🥀', '✨', '🔥', '🚀'],
    isLocal: true,
    fileUrl: '/fonts/emoji/Windows11.ttf'
  },
  {
    id: 'noto-color-emoji',
    name: 'Google Noto Color',
    fontFamily: 'Noto Color Emoji Custom',
    category: 'Google',
    description: 'Official Google Android stock Noto Color emojis',
    badge: 'Stock 🤖',
    sampleEmojis: ['🥹', '🫰', '🥰', '🥀', '✨', '🔥', '⭐'],
    isLocal: true,
    fileUrl: '/fonts/NotoColorEmoji.ttf'
  },
  {
    id: 'device-default',
    name: 'System Default',
    fontFamily: 'inherit',
    category: 'Custom',
    description: 'Use the device/browser built-in emoji font',
    badge: 'System',
    sampleEmojis: ['🥹', '🫰', '🥰', '🥀', '✨', '🔥'],
    isLocal: true
  }
];

// Dynamically register a font file in the browser using the FontFace API
export const loadCustomFont = async (fontFamily: string, fontSource: string | ArrayBuffer): Promise<boolean> => {
  try {
    const source = typeof fontSource === 'string' ? `url('${fontSource}')` : fontSource;
    const fontFace = new FontFace(fontFamily, source);
    const loaded = await fontFace.load();
    document.fonts.add(loaded);
    return true;
  } catch (err) {
    console.error(`Failed to dynamically load font ${fontFamily}:`, err);
    return false;
  }
};

// Set the global active emoji font CSS variable
export const setGlobalEmojiFont = (fontFamily: string) => {
  if (!fontFamily || fontFamily === 'inherit') {
    document.documentElement.style.setProperty(
      '--active-emoji-font',
      '"Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
    );
  } else {
    document.documentElement.style.setProperty(
      '--active-emoji-font',
      `'${fontFamily}', "Noto Color Emoji Custom", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`
    );
  }
};
