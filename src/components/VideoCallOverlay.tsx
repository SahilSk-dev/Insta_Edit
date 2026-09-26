import React, { useState, useEffect } from 'react';
import {
  CallEndIcon,
  CameraswitchIcon,
  MicIcon,
  MicOffIcon
} from './InstagramIcons';
import { getAvatarUrl } from '../data/initialData';

interface VideoCallOverlayProps {
  name: string;
  avatarName: string;
  onEndCall: () => void;
}

export const VideoCallOverlay: React.FC<VideoCallOverlayProps> = ({
  name,
  avatarName,
  onEndCall
}) => {
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [isMuted, setIsMuted] = useState(false);
  const avatarUrl = getAvatarUrl(avatarName);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus('Ringing...');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '50px 24px 40px 24px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <style>{`
        @keyframes pulseAvatar {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.2); }
          50% { transform: scale(1.1); box-shadow: 0 0 0 24px rgba(255, 255, 255, 0.05); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Top Caller Info */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <h1 style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700, margin: 0 }}>
          {name}
        </h1>
        <div style={{ color: '#A8A8A8', fontSize: 16, marginTop: 8 }}>
          {callStatus}
        </div>
      </div>

      {/* Pulsing Avatar */}
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#262626',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          animation: 'pulseAvatar 2s infinite ease-in-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src={avatarUrl}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Bottom Controls */}
      <div
        style={{
          width: '100%',
          maxWidth: 320,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: 20
        }}
      >
        {/* Flip Camera */}
        <button
          onClick={() => {}}
          title="Flip camera"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <CameraswitchIcon size={26} color="#FFFFFF" />
        </button>

        {/* Mute Mic */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? 'Unmute' : 'Mute'}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: isMuted ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isMuted ? (
            <MicOffIcon size={26} color="#000000" />
          ) : (
            <MicIcon size={26} color="#FFFFFF" />
          )}
        </button>

        {/* End Call */}
        <button
          onClick={onEndCall}
          title="End Call"
          style={{
            width: 66,
            height: 66,
            borderRadius: '50%',
            backgroundColor: '#ED4956',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(237, 73, 86, 0.4)'
          }}
        >
          <CallEndIcon size={32} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
};
