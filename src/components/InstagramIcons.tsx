import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ShieldHeartIcon: React.FC<IconProps> = ({ size = 28, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={style}>
    {/* Shield */}
    <path
      d="M 50 12 C 75 12, 88 16, 88 35 C 88 65, 65 82, 50 88 C 35 82, 12 65, 12 35 C 12 16, 25 12, 50 12 Z"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Heart inside */}
    <path
      d="M 50 62 
         C 38 52, 33 40, 43 33 
         C 48 30, 50 35, 50 35 
         C 50 35, 52 30, 57 33 
         C 67 40, 62 52, 50 62 Z"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const BlockSlashIcon: React.FC<IconProps> = ({ size = 28, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={style}>
    <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="6" />
    <line x1="23.14" y1="23.14" x2="76.86" y2="76.86" stroke={color} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const InstagramTagIcon: React.FC<IconProps> = ({ size = 23, color = '#FFFFFF', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.95"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M 2.6 11.8 L 2.6 4.2 C 2.6 3.2 3.4 2.4 4.4 2.4 L 14.2 2.4 C 14.7 2.4 15.2 2.6 15.5 3.0 L 22.3 9.8 C 23.0 10.5 23.0 11.6 22.3 12.3 L 13.9 21.6 C 13.2 22.3 12.1 22.3 11.4 21.6 L 3.1 13.3 C 2.8 12.9 2.6 12.4 2.6 11.8 Z" />
    <circle cx="7.2" cy="7.2" r="1.35" fill={color} stroke="none" />
  </svg>
);

export const InstagramBlendIcon: React.FC<IconProps> = ({ size = 25, color = '#FFFFFF', style, className }) => {
  if (color && color !== '#FFFFFF') {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          WebkitMaskImage: 'url(/icons/instagram_blend.png)',
          maskImage: 'url(/icons/instagram_blend.png)',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          display: 'inline-block',
          flexShrink: 0,
          userSelect: 'none',
          ...style
        }}
      />
    );
  }

  return (
    <img
      src="/icons/instagram_blend.png"
      alt="Blend"
      width={size}
      height={size}
      className={className}
      draggable={false}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none',
        ...style
      }}
    />
  );
};

export const InstagramSolidCameraIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.5 4.5A1.5 1.5 0 0 1 10 3h4a1.5 1.5 0 0 1 1.5 1.5V5h3.25A2.25 2.25 0 0 1 21 7.25v11.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V7.25A2.25 2.25 0 0 1 5.25 5H8.5v-.5zm3.5 13.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
    />
  </svg>
);

export const InstagramStickerPeelIcon: React.FC<IconProps> = ({ size = 23, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M 3 8 A 5 5 0 0 1 8 3 L 16 3 A 5 5 0 0 1 21 8 L 21 14.5 L 14.5 21 L 8 21 A 5 5 0 0 1 3 16 Z" />
    <path d="M 14.5 21 C 15.5 17.5 17.5 15.5 21 14.5" />
    <circle cx="8.5" cy="10.8" r="0.8" fill={color} stroke="none" />
    <circle cx="15.5" cy="10.8" r="0.8" fill={color} stroke="none" />
    <path d="M 9.5 14.5 c 1.5 1.5 3.5 1.5 5 0" />
  </svg>
);

export const InstagramCirclePlusIcon: React.FC<IconProps> = ({ size = 23, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="9.5" />
    <line x1="12" y1="7.5" x2="12" y2="16.5" />
    <line x1="7.5" y1="12" x2="16.5" y2="12" />
  </svg>
);

export const InstagramMicIcon: React.FC<IconProps> = ({ size = 23, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="8.5" y="2" width="7" height="11.5" rx="3.5" />
    <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
    <line x1="12" y1="18.5" x2="12" y2="22" />
    <line x1="8.5" y1="22" x2="15.5" y2="22" />
  </svg>
);

export const InstagramGalleryIcon: React.FC<IconProps> = ({ size = 23, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="3" width="18" height="18" rx="4.5" />
    <circle cx="8" cy="8" r="1.4" fill={color} stroke="none" />
    <path d="M21 15.5l-5-5-8 8" />
    <path d="M8 18.5l3.5-3.5 2.5 2.5" />
  </svg>
);

export const BackIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const VideoCallIcon: React.FC<IconProps> = ({ size = 25, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="2" y="6" width="13.5" height="12" rx="3.5" />
    <polygon points="15.5 10 21.5 6.5 21.5 17.5 15.5 14" fill="none" />
  </svg>
);

export const InstagramVideoCallIcon = VideoCallIcon;

export const CameraIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="none" />
    <circle cx="12" cy="13" r="4" fill="none" />
  </svg>
);

export const MicIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => (
  <InstagramMicIcon size={size} color={color} style={style} />
);

export const GalleryIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => (
  <InstagramGalleryIcon size={size} color={color} style={style} />
);

export const PlusIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => (
  <InstagramCirclePlusIcon size={size} color={color} style={style} />
);

export const InstagramStickerIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => (
  <InstagramStickerPeelIcon size={size} color={color} style={style} />
);

export const PlayIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const CallEndIcon: React.FC<IconProps> = ({ size = 30, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.996.996 0 0 1 0-1.41C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.39.39.39 1.02 0 1.41l-2.48 2.48c-.18.18-.43.29-.71.29s-.52-.11-.7-.28c-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
  </svg>
);

export const CameraswitchIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M20 16v-4a8 8 0 0 0-16 0v4m0 0l-3-3m3 3l3-3m10-4l3 3m-3-3l-3 3" />
  </svg>
);

export const MicOffIcon: React.FC<IconProps> = ({ size = 24, color = '#000000', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const DeleteIcon: React.FC<IconProps> = ({ size = 20, color = '#ED4956', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const SwapIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

export const GridIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ size = 20, color = '#A8A8A8', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const PhoneCallIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const InstagramReelEngineIcon: React.FC<IconProps> = ({ size = 23, color = '#FFFFFF', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <rect x="2" y="3" width="20" height="18" rx="4" />
    <line x1="2" y1="9" x2="22" y2="9" />
    <line x1="6" y1="3" x2="4" y2="9" />
    <line x1="12" y1="3" x2="10" y2="9" />
    <line x1="18" y1="3" x2="16" y2="9" />
    <polygon points="10 12.5 15 15 10 17.5 10 12.5" fill={color} stroke="none" />
  </svg>
);

