import React from 'react';
import {
  BackIcon,
  VideoCallIcon,
  PhoneCallIcon,
  InfoIcon,
  ChevronRightIcon
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
  onTagCaptureScreenshot: () => void;
  onOpenBackend: () => void;
  onClearChatClick: () => void;
}

export const ChatTopBar: React.FC<ChatTopBarProps> = ({
  name,
  handle,
  avatarName,
  onBackClick,
  onProfileClick,
  onChangeAvatar,
  onVideoCallClick,
  onTagCaptureScreenshot,
  onOpenBackend,
  onClearChatClick
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
        paddingRight: 8,
        justifyContent: 'space-between',
        userSelect: 'none',
        boxSizing: 'content-box'
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
              src={avatarUrl}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ marginLeft: 10, minWidth: 0, overflow: 'hidden' }}>
            <div
              style={{
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>{name}</span>
              <ChevronRightIcon size={14} color="#A8A8A8" />
            </div>
            <div
              style={{
                color: '#A8A8A8',
                fontSize: 12,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '14px'
              }}
            >
              {handle}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons on the right - Exact Android Native Instagram DM Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Phone / Audio call button */}
        <button
          onClick={onVideoCallClick}
          title="Audio Call"
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
        >
          <PhoneCallIcon size={23} />
        </button>

        {/* Video Call button */}
        <button
          onClick={onVideoCallClick}
          title="Video Call"
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
        >
          <VideoCallIcon size={25} />
        </button>

        {/* Info (i) / Details button -> Opens backend editor / details */}
        <button
          onClick={onOpenBackend}
          onContextMenu={(e) => {
            e.preventDefault();
            onTagCaptureScreenshot();
          }}
          title="Chat details & Editor (Right-click or Long-press for Screenshot)"
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
        >
          <InfoIcon size={24} />
        </button>
      </div>
    </header>
  );
};
