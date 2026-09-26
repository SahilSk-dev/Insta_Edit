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

export const InstagramTagIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={style}>
    <path
      d="M 15 35 L 55 15 C 60 12, 65 12, 70 15 L 88 33 C 92 37, 92 43, 88 47 L 48 87 C 44 91, 38 91, 34 87 L 15 68 C 11 64, 11 58, 15 54 Z"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="68" cy="32" r="5" fill={color} />
  </svg>
);

export const InstagramSmileyBubbleIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={style}>
    <path
      d="M 50 12 C 85 12, 88 35, 88 50 C 88 75, 65 85, 45 85 L 28 92 C 23 94, 18 90, 20 85 L 22 78 C 12 72, 12 60, 12 50 C 12 25, 30 12, 50 12 Z"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="38" cy="45" r="4" fill={color} />
    <circle cx="62" cy="45" r="4" fill={color} />
    <path
      d="M 36 58 Q 50 70 64 58"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export const InstagramStickerIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M15 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V9l-6-6z" />
    <path d="M15 3v6h6" />
    <circle cx="9" cy="13" r="0.75" fill={color} />
    <circle cx="15" cy="13" r="0.75" fill={color} />
    <path d="M9 16c1 1 3 1 4 0" />
  </svg>
);

export const BackIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const VideoCallIcon: React.FC<IconProps> = ({ size = 26, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="3" ry="3" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="none" />
    <circle cx="12" cy="13" r="4" fill="none" />
  </svg>
);

export const MicIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const GalleryIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
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

