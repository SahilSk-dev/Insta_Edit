import React, { useRef, useState } from 'react';
import { ChatProfile } from '../types/chat';
import { ShieldHeartIcon, BlockSlashIcon, CameraIcon } from './InstagramIcons';
import { getAvatarUrl } from '../data/initialData';
import { CropAvatarModal } from './CropAvatarModal';

interface ChatHeaderProps {
  profile: ChatProfile;
  globalBubbleSpacing?: number;
  onSafetyTipsClick: () => void;
  onBlockClick: () => void;
  onProfileClick: () => void;
  onChangeAvatar: () => void;
  onDirectAvatarUpload?: (dataUrl: string) => void;
  onOpenSpacingModal?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  profile,
  globalBubbleSpacing = 4,
  onSafetyTipsClick,
  onBlockClick,
  onProfileClick,
  onChangeAvatar,
  onDirectAvatarUpload,
  onOpenSpacingModal
}) => {
  const avatarUrl = getAvatarUrl(profile.avatarName);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingCropImage, setPendingCropImage] = useState<string | null>(null);

  const handleDirectFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const raw = event.target?.result as string;
        if (raw) {
          setPendingCropImage(raw);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleDirectFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* 96px Pure Round Avatar with subtle pulse / hover effect */}
      <div
        onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          } else {
            onChangeAvatar();
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onChangeAvatar();
        }}
        title="Tap to upload profile picture (Right-click for options)"
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
          marginBottom: 14,
          position: 'relative'
        }}
      >
        <img
          key={avatarUrl}
          src={avatarUrl}
          alt={profile.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/avatars/sahil_avatar.jpg';
          }}
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

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
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
            userSelect: 'none'
          }}
        >
          View profile
        </button>

        {/* Global Bubble Spacing Pill */}
        {onOpenSpacingModal && (
          <button
            onClick={onOpenSpacingModal}
            title="Adjust spacing / distance between all chat bubbles"
            style={{
              backgroundColor: '#1E1E1E',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 8,
              padding: '6px 12px',
              color: '#D4D4D4',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              userSelect: 'none'
            }}
          >
            <span>↕ Gap:</span>
            <span style={{ color: '#0095F6', fontWeight: 700 }}>{globalBubbleSpacing}px</span>
          </button>
        )}
      </div>

      {/* Interactive Crop Popup Modal */}
      {pendingCropImage && (
        <CropAvatarModal
          imageSrc={pendingCropImage}
          onApply={(croppedUrl) => {
            if (onDirectAvatarUpload) {
              onDirectAvatarUpload(croppedUrl);
            }
            setPendingCropImage(null);
          }}
          onCancel={() => setPendingCropImage(null)}
        />
      )}
    </div>
  );
};
