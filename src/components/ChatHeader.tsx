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

      {/* Username and Joined Date */}
      <div style={{ color: '#A8A8A8', fontSize: 14, marginBottom: 4 }}>
        {profile.handle} · {profile.joinedDate}
      </div>

      {/* Followers & Posts */}
      <div style={{ color: '#A8A8A8', fontSize: 14, marginBottom: 4 }}>
        {profile.followersCount} followers · {profile.postsCount} post
      </div>

      {/* Follows you */}
      <div style={{ color: '#A8A8A8', fontSize: 14, marginBottom: 4 }}>
        {profile.followsYouText}
      </div>

      {/* Mutual follow */}
      <div style={{ color: '#A8A8A8', fontSize: 14, marginBottom: 20 }}>
        {profile.mutualFollowText}
      </div>

      {/* Action Buttons: Safety tips & Block */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36
        }}
      >
        {/* Safety tips */}
        <div
          onClick={onSafetyTipsClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: 8
          }}
        >
          <ShieldHeartIcon size={30} color="#FFFFFF" />
          <span style={{ color: '#FFFFFF', fontSize: 13, marginTop: 6 }}>
            Safety tips
          </span>
        </div>

        {/* Block / Unblock */}
        <div
          onClick={onBlockClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: 8
          }}
        >
          <BlockSlashIcon size={30} color="#FFFFFF" />
          <span style={{ color: '#FFFFFF', fontSize: 13, marginTop: 6 }}>
            {profile.isBlocked ? 'Unblock' : 'Block'}
          </span>
        </div>
      </div>
    </div>
  );
};
