import React, { useState } from 'react';
import { DownloadIcon, ShareIcon, CloseIcon } from './InstagramIcons';

interface ScreenshotModalProps {
  imageDataUrl: string;
  onDismiss: () => void;
  onToast: (msg: string) => void;
}

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  imageDataUrl,
  onDismiss,
  onToast
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = `instagram_dm_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    onToast('Screenshot saved to your downloads!');
  };

  const handleShareOrCopy = async () => {
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const res = await fetch(imageDataUrl);
        const blob = await res.blob();
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        onToast('Screenshot copied to clipboard!');
        return;
      }
      if (navigator.share) {
        const res = await fetch(imageDataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'screenshot.png', { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: 'Instagram Direct Chat',
          text: 'Chat screenshot from Instagram Direct'
        });
        onToast('Shared screenshot!');
        return;
      }
    } catch (e) {
      // Fallback
    }
    handleDownload();
  };

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 95,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(3px)'
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ width: 24 }} />
          <h3 style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700, margin: 0 }}>
            Chat Screenshot Captured
          </h3>
          <button
            onClick={onDismiss}
            style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: 0 }}
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <p style={{ color: '#A8A8A8', fontSize: 13, margin: '0 0 16px 0' }}>
          Full chat screenshot is ready to download or share
        </p>

        {/* Screenshot preview */}
        <div
          style={{
            width: '100%',
            height: 280,
            borderRadius: 14,
            overflow: 'hidden',
            backgroundColor: '#262626',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <img
            src={imageDataUrl}
            alt="DM Screenshot"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleDownload}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 10,
              backgroundColor: '#0095F6',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 14,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <DownloadIcon size={18} color="#FFFFFF" />
            <span>{downloaded ? 'Downloaded!' : 'Save / Download'}</span>
          </button>

          <button
            onClick={handleShareOrCopy}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 10,
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <ShareIcon size={18} color="#FFFFFF" />
            <span>Copy / Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
