import React, { useRef } from 'react';
import { availableAvatars } from '../data/initialData';
import { GalleryIcon } from './InstagramIcons';

interface ChangeAvatarModalProps {
  currentAvatarName: string;
  onAvatarSelected: (avatarNameOrUrl: string) => void;
  onDismiss: () => void;
}

export const ChangeAvatarModal: React.FC<ChangeAvatarModalProps> = ({
  currentAvatarName,
  onAvatarSelected,
  onDismiss
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onAvatarSelected(event.target.result as string);
          onDismiss();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 85,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)'
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

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
          textAlign: 'center',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            margin: '0 auto 16px auto'
          }}
        />

        <h3 style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700, margin: 0 }}>
          Change Profile Picture
        </h3>
        <p style={{ color: '#A8A8A8', fontSize: 13, margin: '6px 0 20px 0' }}>
          Upload your custom DP or select a preset avatar
        </p>

        {/* Upload Custom DP Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 12,
            backgroundColor: '#0095F6',
            color: '#FFFFFF',
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
            marginBottom: 20
          }}
        >
          <GalleryIcon size={22} color="#FFFFFF" />
          <span>Upload Custom DP from Gallery</span>
        </button>

        <div
          style={{
            borderTop: '0.5px solid #262626',
            paddingTop: 16,
            textAlign: 'left'
          }}
        >
          <div style={{ color: '#A8A8A8', fontSize: 13, marginBottom: 14 }}>
            Or choose a preset avatar:
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {availableAvatars.map((opt) => {
              const isSelected = currentAvatarName === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    onAvatarSelected(opt.id);
                    onDismiss();
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: 8
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: isSelected ? '3px solid #0095F6' : '2px solid transparent',
                      boxSizing: 'border-box',
                      transition: 'border 0.2s ease'
                    }}
                  >
                    <img
                      src={opt.url}
                      alt={opt.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <span
                    style={{
                      color: isSelected ? '#0095F6' : '#FFFFFF',
                      fontSize: 12,
                      fontWeight: isSelected ? 700 : 400,
                      marginTop: 8,
                      textAlign: 'center'
                    }}
                  >
                    {opt.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
