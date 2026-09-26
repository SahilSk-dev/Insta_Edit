import React from 'react';
import { ChatProfile } from '../types/chat';
import { ShieldHeartIcon, BlockSlashIcon } from './InstagramIcons';
import { getAvatarUrl } from '../data/initialData';

interface ChatHeaderProps {
  profile: ChatProfile;
  onSafetyTipsClick: () => void;
  onBlockClick: () => void;
  onProfileClick: () => void;
  onChangeAvatar: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  profile,
  onSafetyTipsClick,
  onBlockClick,
  onProfileClick,
  onChangeAvatar
}) => {
  const avatarUrl = getAvatarUrl(profile.avatarName);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 20px 16px 20px',
        textAlign: 'center',
        userSelect: 'none'
      }}
    >
      {/* 96px Pure Round Avatar with subtle pulse / hover effect */}
      <div
        onClick={onChangeAvatar}
        title="Tap to change profile picture"
        style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#262626',
          cursor: 'pointer',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.5)',
          transition: 'transform 0.2s ease',
          marginBottom: 14
        }}
      >
        <img
          src={avatarUrl}
          alt={profile.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Name */}
      <h2
        onClick={onProfileClick}
        style={{
          color: '#FFFFFF',
          fontSize: 20,
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: 4
        }}
      >
        {profile.name}
      </h2>

      {/* Username and Instagram branding */}
      <div style={{ color: '#A8A8A8', fontSize: 14, marginBottom: 4, fontWeight: 400 }}>
        {profile.handle} · Instagram
      </div>

      {/* Followers & Posts */}
      <div style={{ color: '#A8A8A8', fontSize: 13.5, marginBottom: 4 }}>
        {profile.followersCount} followers · {profile.postsCount} post
      </div>

      {/* Mutual follow */}
      <div style={{ color: '#A8A8A8', fontSize: 13.5, marginBottom: 16 }}>
        {profile.mutualFollowText}
      </div>

      {/* Native Instagram Android: View profile button */}
      <button
        onClick={onProfileClick}
        style={{
          backgroundColor: '#262626',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 8,
          padding: '6px 16px',
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          marginBottom: 8
        }}
      >
        View profile
      </button>
    </div>
  );
};
