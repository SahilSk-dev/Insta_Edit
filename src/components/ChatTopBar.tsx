import React from 'react';
import {
  BackIcon,
  InstagramBlendIcon,
  InstagramVideoCallIcon,
  InstagramTagIcon,
  InstagramReelEngineIcon
} from './InstagramIcons';
import { getAvatarUrl } from '../data/initialData';

interface ChatTopBarProps {
  name: string;
  handle: string;
  avatarName: string;
  onBackClick: () => void;
  onProfileClick: () => void;
  onChangeAvatar: () => void;
  onVideoCallClick: () => void;
  onTagClick: () => void;
  onOpenBackend: () => void;
  onClearChatClick: () => void;
  onOpenEmojiFontSelect?: () => void;
  activeEmojiFont?: string;
}

export const ChatTopBar: React.FC<ChatTopBarProps> = ({
  name,
  handle,
  avatarName,
  onBackClick,
  onProfileClick,
  onChangeAvatar,
  onVideoCallClick,
  onTagClick,
  onOpenBackend,
  onClearChatClick,
  onOpenEmojiFontSelect,
  activeEmojiFont
}) => {
  const avatarUrl = getAvatarUrl(avatarName);

  return (
    <header
      style={{
        width: '100%',
        backgroundColor: '#000000',
        borderBottom: '0.5px solid #1A1A1A',
        position: 'relative',
        flexShrink: 0,
        zIndex: 40,
        height: 52,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 12,
        justifyContent: 'space-between',
        userSelect: 'none',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        {/* Back Button */}
        <button
          onClick={onBackClick}
          title="Direct inbox"
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
        >
          <BackIcon size={24} />
        </button>

        {/* Profile info: Click -> view profile sheet, ContextMenu -> change avatar */}
        <div
          onClick={onProfileClick}
          onContextMenu={(e) => {
            e.preventDefault();
            onChangeAvatar();
          }}
          title="Click to view profile, Right-click to change DP"
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginLeft: 4,
            padding: '4px 6px',
            borderRadius: 8,
            flex: 1,
            minWidth: 0
          }}
        >
          {/* Circular mini avatar */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              backgroundColor: '#262626',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <img
              key={avatarUrl}
              src={avatarUrl}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/avatars/sahil_avatar.jpg';
              }}
            />
          </div>

          <div style={{ marginLeft: 10, minWidth: 0, overflow: 'hidden' }}>
            <div
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '19px'
              }}
            >
              {name}
            </div>
            <div
              style={{
                color: '#8E8E8E',
                fontSize: 12,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '14px',
                marginTop: 1
              }}
            >
              {handle}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons on the right - Exact Authentic Instagram DM Icons (Blend, Video Call, Tag) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
        {/* 1. Blend / Dual icon -> Opens backend editor / settings */}
        <button
          onClick={onOpenBackend}
          title="Direct settings & Editor"
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <InstagramBlendIcon size={25} />
        </button>

        {/* 2. Video Call button */}
        <button
          onClick={onVideoCallClick}
          title="Video Call"
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <InstagramVideoCallIcon size={25} />
        </button>

        {/* 3. Tag / Label button -> Toggles between Screenshot & Video Record */}
        <button
          onClick={onTagClick}
          onContextMenu={(e) => {
            e.preventDefault();
            onOpenBackend();
          }}
          title="Screenshot / Video Record Toggle"
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <InstagramTagIcon size={23} />
        </button>
      </div>
    </header>
  );
};
