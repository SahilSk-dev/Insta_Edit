import React, { useState, useRef } from 'react';
import { ChatProfile } from '../types/chat';
import { GridIcon, CloseIcon } from './InstagramIcons';
import { getAvatarUrl } from '../data/initialData';
import { CropAvatarModal } from './CropAvatarModal';

interface UserProfileModalProps {
  profile: ChatProfile;
  onDismiss: () => void;
  onSendMessage: () => void;
  onBlockUser: () => void;
  onOpenEmojiFontSelect?: () => void;
  onAvatarUpload?: (newAvatar: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  profile,
  onDismiss,
  onSendMessage,
  onBlockUser,
  onOpenEmojiFontSelect,
  onAvatarUpload
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [pendingCropImage, setPendingCropImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarUrl = getAvatarUrl(profile.avatarName);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 80,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: '#121212',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: '20px 20px 36px 20px',
          boxSizing: 'border-box',
          boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.6)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>

        {/* Drag handle */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            margin: '0 auto 16px auto'
          }}
        />

        {/* Header handle & close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18
          }}
        >
          <div style={{ width: 24 }} />
          <h3
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 700,
              margin: 0
            }}
          >
            {profile.handle}
          </h3>
          <button
            onClick={onDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              padding: 0
            }}
          >
            <CloseIcon size={22} />
          </button>
        </div>

        {/* Profile stats row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 14
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {/* Avatar (Tap to change) */}
          <div
            onClick={() => fileInputRef.current?.click()}
            title="Tap to change profile picture"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#262626',
              flexShrink: 0,
              cursor: 'pointer',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              position: 'relative'
            }}
          >
            <img
              src={avatarUrl}
              alt={profile.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-around',
              textAlign: 'center',
              marginLeft: 16
            }}
          >
            <div>
              <div style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700 }}>
                {profile.postsCount}
              </div>
              <div style={{ color: '#FFFFFF', fontSize: 12 }}>posts</div>
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700 }}>
                {profile.followersCount}
              </div>
              <div style={{ color: '#FFFFFF', fontSize: 12 }}>followers</div>
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700 }}>
                {profile.followingCount}
              </div>
              <div style={{ color: '#FFFFFF', fontSize: 12 }}>following</div>
            </div>
          </div>
        </div>

        {/* Name and bio */}
        <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 700 }}>
          {profile.name}
        </div>
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 13,
            lineHeight: '18px',
            whiteSpace: 'pre-line',
            marginTop: 4
          }}
        >
          {profile.bio}
        </div>
        <div style={{ color: '#A8A8A8', fontSize: 12, marginTop: 4 }}>
          {profile.followsYouText}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 8,
              backgroundColor: isFollowing ? '#262626' : '#0095F6',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isFollowing ? 'Following' : 'Follow back'}
          </button>
          <button
            onClick={() => {
              onDismiss();
              onSendMessage();
            }}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#262626',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Message
          </button>
        </div>

        {/* Chat Emoji Font Row */}
        {onOpenEmojiFontSelect && (
          <div
            onClick={() => {
              onDismiss();
              onOpenEmojiFontSelect();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 14,
              padding: '10px 14px',
              backgroundColor: '#1E1E1E',
              borderRadius: 10,
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>😊</span>
              <div>
                <div style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>Chat Emoji Font</div>
                <div style={{ color: '#8E8E93', fontSize: 11.5 }}>
                  {profile.emojiFont || 'SamsungOneUI_4_Xmas'}
                </div>
              </div>
            </div>
            <span style={{ color: '#3897F0', fontSize: 12.5, fontWeight: 600 }}>Change</span>
          </div>
        )}

        {/* Posts section header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            borderTop: '0.5px solid #262626',
            marginTop: 20,
            paddingTop: 12,
            marginBottom: 10
          }}
        >
          <GridIcon size={24} color="#FFFFFF" />
        </div>

        {/* Post Grid preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
          <div
            style={{
              aspectRatio: '1',
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: '#262626'
            }}
          >
            <img
              src="/avatars/gaming_post.jpg"
              alt="Post"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {pendingCropImage && (
        <CropAvatarModal
          imageSrc={pendingCropImage}
          onApply={(croppedUrl) => {
            if (onAvatarUpload) {
              onAvatarUpload(croppedUrl);
            }
            setPendingCropImage(null);
          }}
          onCancel={() => setPendingCropImage(null)}
        />
      )}
    </div>
  );
};
