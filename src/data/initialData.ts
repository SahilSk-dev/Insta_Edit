import { ChatProfile, ChatMessage, AvatarOption } from '../types/chat';

export const initialProfile: ChatProfile = {
  id: 1,
  name: 'Sahil Sk',
  handle: 'md.sahil_sk_',
  joinedDate: 'Joined Oct 2025',
  followersCount: '108',
  postsCount: '1',
  followingCount: '142',
  followsYouText: 'Follows you',
  mutualFollowText: 'You both follow __broken__heart__019',
  bio: '🎮 Free Fire MAX Esports Player 🔥\n⚡ Headshot machine | 1v1 Room Challenge\n🏆 Guild Leader #Booyah',
  chatTimestamp: '12:41 PM',
  isBlocked: false,
  autoReplyEnabled: true,
  avatarName: 'sahil_avatar'
};

export const availableAvatars: AvatarOption[] = [
  { id: 'sahil_avatar', name: 'Default Avatar', url: '/avatars/sahil_avatar.jpg' },
  { id: 'avatar_cyber_samurai', name: 'Cyber Ninja', url: '/avatars/avatar_cyber_samurai.jpg' },
  { id: 'avatar_gold_tiger', name: 'Golden Flame Tiger', url: '/avatars/avatar_gold_tiger.jpg' }
];

export const getAvatarUrl = (avatarName: string): string => {
  if (avatarName.startsWith('data:') || avatarName.startsWith('blob:') || avatarName.startsWith('http')) {
    return avatarName;
  }
  const match = availableAvatars.find(a => a.id === avatarName);
  if (match) return match.url;
  if (avatarName.endsWith('.jpg') || avatarName.endsWith('.png') || avatarName.endsWith('.webp')) {
    return avatarName.startsWith('/') ? avatarName : `/avatars/${avatarName}`;
  }
  return '/avatars/sahil_avatar.jpg';
};

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    text: 'Hello Sahil bhai! Kemon acho? Free Fire MAX khelbe aaj?',
    isFromMe: true,
    timestamp: '12:41 PM',
    type: 'TEXT',
    theme: 'CLASSIC',
    orderIndex: 1
  },
  {
    id: 'msg-2',
    text: 'Arey bhai! Ekdom bhalo achi. Aajke rank push korbo, squad ready ache! 🔥🎮',
    isFromMe: false,
    timestamp: '12:41 PM',
    type: 'TEXT',
    theme: 'OBSIDIAN_HEART',
    orderIndex: 2
  },
  {
    id: 'msg-3',
    text: 'Free Fire Booyah victory screenshot',
    isFromMe: false,
    timestamp: '12:42 PM',
    type: 'IMAGE',
    imageResName: '/avatars/gaming_post.jpg',
    theme: 'CLASSIC',
    orderIndex: 3
  },
  {
    id: 'msg-4',
    text: '',
    isFromMe: false,
    timestamp: '12:42 PM',
    type: 'AUDIO',
    audioDuration: '0:04',
    theme: 'CLASSIC',
    orderIndex: 4
  },
  {
    id: 'msg-5',
    text: 'Tumi amar moner majhe ekla projapoti 🦋✨',
    isFromMe: true,
    timestamp: '12:43 PM',
    type: 'TEXT',
    theme: 'MIDNIGHT_BUTTERFLY',
    orderIndex: 5
  },
  {
    id: 'msg-6',
    text: '🔥',
    isFromMe: false,
    timestamp: '12:43 PM',
    type: 'STICKER',
    theme: 'CLASSIC',
    orderIndex: 6
  }
];

export const sahilResponses = [
  'Arey bhai! Kaise ho?',
  'Free Fire MAX me rank push karoge aaj? 🔥',
  '1v1 custom room challenge accepted! 🎮👑',
  'Aaj Booyah confirm hai bro! 💯',
  'Haan bolo bhai, sab theek? 😎',
  'Squad full hone wala hai, jaldi aao! 🚀',
  'Headshot sensitivity settings share karu kya? 🎯⚡'
];
