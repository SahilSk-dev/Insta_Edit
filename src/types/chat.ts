export type BubbleTheme = 
  | 'CLASSIC'
  | 'OBSIDIAN_HEART'
  | 'MIDNIGHT_BUTTERFLY'
  | 'NEON_CYBER'
  | 'GOLDEN_LUXE';

export type MessageType = 'TEXT' | 'IMAGE' | 'AUDIO' | 'STICKER';

export type PhotoBorderStyle = 'NORMAL' | 'LASER';

export interface ChatMessage {
  id: string;
  text: string;
  isFromMe: boolean;
  timestamp: string;
  type: MessageType;
  imageResName?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageFit?: 'cover' | 'contain';
  photoStyle?: PhotoBorderStyle;
  laserColor?: string;
  laserSpeed?: number;
  audioDuration?: string;
  theme: BubbleTheme;
  orderIndex: number;
  emojiFont?: string;
  reaction?: string;
}

export interface ChatProfile {
  id: number;
  name: string;
  handle: string;
  joinedDate: string;
  followersCount: string;
  postsCount: string;
  followingCount: string;
  followsYouText: string;
  mutualFollowText: string;
  bio: string;
  chatTimestamp: string;
  isBlocked: boolean;
  autoReplyEnabled: boolean;
  avatarName: string;
  emojiFont?: string;
}

export interface AvatarOption {
  id: string;
  name: string;
  url: string;
}
