import { ChatProfile, ChatMessage, AvatarOption } from '../types/chat';

export const initialProfile: ChatProfile = {
  id: 1,
  name: 'Sahil',
  handle: 'not__ur__sahil_77',
  joinedDate: 'Joined Oct 2025',
  followersCount: '3,000',
  postsCount: '1',
  followingCount: '10',
  followsYouText: 'Follows you',
  mutualFollowText: 'You both follow __broken__heart__019',
  bio: 'Developed by Sahil',
  chatTimestamp: '12:41 PM',
  isBlocked: false,
  autoReplyEnabled: false,
  avatarName: 'sahil_avatar',
  emojiFont: 'SamsungOneUI_4_Xmas'
};

export const availableAvatars: AvatarOption[] = [
  { id: 'sahil_avatar', name: 'Sahil Sk', url: '/avatars/sahil_avatar.jpg' }
];

export const getAvatarUrl = (avatarName?: string): string => {
  if (!avatarName) return '/avatars/sahil_avatar.jpg';
  if (avatarName.startsWith('data:') || avatarName.startsWith('blob:') || avatarName.startsWith('http')) {
    return avatarName;
  }
  if (avatarName === 'sahil_avatar') {
    return '/avatars/sahil_avatar.jpg';
  }
  const match = availableAvatars.find((a) => a.id === avatarName);
  if (match) return match.url;
  return avatarName.startsWith('/') ? avatarName : `/avatars/${avatarName}`;
};

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    text: 'Hii',
    isFromMe: true,
    timestamp: '12:41 PM',
    type: 'TEXT',
    theme: 'CLASSIC',
    orderIndex: 1
  },
  {
    id: 'msg-2',
    text: 'Hello ❤️‍🔥',
    isFromMe: false,
    timestamp: '12:41 PM',
    type: 'TEXT',
    theme: 'OBSIDIAN_HEART',
    orderIndex: 2
  },
  {
    id: 'msg-3',
    text: 'Kemon acho? 🦋',
    isFromMe: true,
    timestamp: '12:42 PM',
    type: 'TEXT',
    theme: 'MIDNIGHT_BUTTERFLY',
    orderIndex: 3
  },
  {
    id: 'msg-4',
    text: 'Valo, tumi? ⚡',
    isFromMe: false,
    timestamp: '12:43 PM',
    type: 'TEXT',
    theme: 'NEON_CYBER',
    orderIndex: 4
  },
  {
    id: 'msg-5',
    text: 'Shine ✨',
    isFromMe: true,
    timestamp: '12:44 PM',
    type: 'TEXT',
    theme: 'GOLDEN_LUXE',
    orderIndex: 5
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
