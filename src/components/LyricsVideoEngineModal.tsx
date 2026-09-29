import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, BubbleTheme } from '../types/chat';
import { CloseIcon } from './InstagramIcons';
import {
  renderBubblesToCanvas,
  captureBubblesScreenshot,
  calculateBubblesColumnLayout,
  preloadAvatarImage,
  RenderBubblesOptions,
  MeasuredBubble
} from '../utils/bubbleCanvasRenderer';

interface LyricsVideoEngineModalProps {
  currentMessages: ChatMessage[];
  emojiFont?: string;
  avatarUrl?: string;
  onDismiss: () => void;
  onScreenshotCapture?: (dataUrl: string) => void;
}

// Preset from user's uploaded image (One Night In Dubai) - supports both sides
export const ONE_NIGHT_IN_DUBAI_PRESET: Array<{ text: string; theme: BubbleTheme }> = [
  { text: 'You 🫰', theme: 'OBSIDIAN_HEART' },
  { text: 'and I 🥰', theme: 'MIDNIGHT_BUTTERFLY' },
  { text: "Don't Say 💬", theme: 'NEON_CYBER' },
  { text: 'Good bye 👋', theme: 'GOLDEN_LUXE' },
  { text: 'All we 🥀', theme: 'OBSIDIAN_HEART' },
  { text: 'Need It', theme: 'MIDNIGHT_BUTTERFLY' },
  { text: 'One Night In Dubai', theme: 'NEON_CYBER' },
  { text: 'Close your', theme: 'GOLDEN_LUXE' },
  { text: 'Eye', theme: 'OBSIDIAN_HEART' },
  { text: 'Ending', theme: 'MIDNIGHT_BUTTERFLY' },
  { text: 'The Light', theme: 'NEON_CYBER' },
  { text: 'All We', theme: 'GOLDEN_LUXE' },
  { text: 'Need Is', theme: 'OBSIDIAN_HEART' },
  { text: 'One Night In', theme: 'MIDNIGHT_BUTTERFLY' },
  { text: 'Dubai', theme: 'NEON_CYBER' }
];

export const LyricsVideoEngineModal: React.FC<LyricsVideoEngineModalProps> = ({
  currentMessages,
  emojiFont = 'SamsungOneUI_4_Xmas',
  avatarUrl,
  onDismiss,
  onScreenshotCapture
}) => {
  // Configurable recording options: exact duration in seconds
  const [durationSec, setDurationSec] = useState<number>(10);
  const [quality, setQuality] = useState<'1080P' | '720P'>('1080P');
  const [speedOption, setSpeedOption] = useState<'FAST' | 'NORMAL' | 'SMOOTH'>('FAST');

  // Messages to record: defaults to all current chat messages, or dubai preset if chat empty
  const [messagesToRecord, setMessagesToRecord] = useState<ChatMessage[]>(() => {
    const validChat = currentMessages.filter((m) => m.type === 'TEXT' && m.text.trim());
    if (validChat.length > 0) {
      return validChat;
    }
    return ONE_NIGHT_IN_DUBAI_PRESET.map((p, idx) => ({
      id: `preset-${idx}`,
      text: p.text,
      theme: p.theme,
      isFromMe: idx % 2 === 0, // Alternate left & right for authentic chat feel
      timestamp: '12:00 PM',
      type: 'TEXT',
      orderIndex: idx
    }));
  });

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedMimeType, setRecordedMimeType] = useState<string>('video/webm');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const cachedLayoutRef = useRef<{ bubbles: MeasuredBubble[]; totalHeight: number; canvasWidth: number } | null>(null);

  const speedMultiplier = speedOption === 'FAST' ? 1.25 : (speedOption === 'NORMAL' ? 1.0 : 0.75);

  // Common render options (Scale 3 = Full 1080p Studio HD, Scale 2 = 720p HD)
  const renderOptions: RenderBubblesOptions = {
    scale: quality === '1080P' ? 3 : 2,
    baseWidth: 380,
    emojiFont,
    avatarUrl,
    speedMultiplier
  };

  // Re-calculate layout only when messages or render options change (NEVER inside 60 FPS loop!)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    cachedLayoutRef.current = calculateBubblesColumnLayout(ctx, messagesToRecord, renderOptions);
  }, [messagesToRecord, quality, emojiFont, speedOption, avatarUrl]);

  // Preload avatar photo into memory & DOM cache immediately when modal mounts
  useEffect(() => {
    if (avatarUrl) {
      preloadAvatarImage(avatarUrl);
    }
  }, [avatarUrl]);

  // Render frame to canvas using pre-computed layout (0ms layout overhead)
  const drawFrame = useCallback(
    (timeMs: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (!cachedLayoutRef.current) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          cachedLayoutRef.current = calculateBubblesColumnLayout(ctx, messagesToRecord, renderOptions);
        }
      }
      renderBubblesToCanvas(canvas, messagesToRecord, timeMs, renderOptions, cachedLayoutRef.current || undefined);
    },
    [messagesToRecord, renderOptions]
  );

  // Live preview loop when not recording
  useEffect(() => {
    let animId: number;
    const loop = (now: number) => {
      if (!isRecording) {
        drawFrame(now);
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRecording, drawFrame]);

  // Start live recording of the animated bubbles
  const handleStartRecording = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Ensure avatar photo is 100% preloaded before recording starts so frame 0 has the real logo
      if (avatarUrl) {
        await preloadAvatarImage(avatarUrl);
      }
      // Paint first frame with decoded avatar photo before capture stream starts
      drawFrame(performance.now());

      setRecordedVideoUrl(null);
      setIsRecording(true);
      setProgress(0);
      setElapsedTime(0);
      recordedChunksRef.current = [];

      // 60 FPS Capture Stream directly from the exact-sized canvas
      const stream = canvas.captureStream(60);

      const mimeTypes = [
        'video/mp4;codecs=avc1',
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ];
      let chosenMime = 'video/webm';
      for (const m of mimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          chosenMime = m;
          break;
        }
      }
      setRecordedMimeType(chosenMime);

      // Studio-grade 25 Mbps Ultra HD recording
      const recorder = new MediaRecorder(stream, {
        mimeType: chosenMime,
        videoBitsPerSecond: 25000000
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: chosenMime });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideoUrl(videoUrl);
        setIsRecording(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);

      startTimeRef.current = performance.now();
      const totalDurationMs = durationSec * 1000;

      const recordStep = (now: number) => {
        const elapsed = now - startTimeRef.current;
        const currentProgress = Math.min(1, elapsed / totalDurationMs);

        drawFrame(now);
        setProgress(Math.round(currentProgress * 100));
        setElapsedTime(parseFloat((elapsed / 1000).toFixed(1)));

        if (elapsed < totalDurationMs) {
          animFrameRef.current = requestAnimationFrame(recordStep);
        } else {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }
      };

      animFrameRef.current = requestAnimationFrame(recordStep);
    } catch (err) {
      console.error('Failed to start media recorder:', err);
      alert('Could not start screen recorder.');
      setIsRecording(false);
    }
  };

  const handleStopRecordingManually = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Quick snapshot capture
  const handleQuickScreenshot = async () => {
    const dataUrl = await captureBubblesScreenshot(messagesToRecord, renderOptions);
    if (onScreenshotCapture) {
      onScreenshotCapture(dataUrl);
      onDismiss();
    } else {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `bubbles-screenshot-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.94)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 14px env(safe-area-inset-bottom, 16px) 14px',
        boxSizing: 'border-box',
        userSelect: 'none',
        backdropFilter: 'blur(10px)',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 10,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎬</span>
          <div>
            <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>
              Bubbles Animation Video Recorder
            </div>
            <div style={{ color: '#8E8E93', fontSize: 11 }}>
              Only Bubbles · No Scroll · Full Chat Height · 60 FPS
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          disabled={isRecording}
          style={{
            background: 'none',
            border: 'none',
            color: '#A8A8A8',
            cursor: isRecording ? 'not-allowed' : 'pointer',
            padding: 6,
            display: 'flex'
          }}
        >
          <CloseIcon size={22} />
        </button>
      </div>

      {/* Main Viewport: Exact Dimensions of the Chat Column (No 9:16 forced crop!) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 380,
          maxHeight: '56vh',
          backgroundColor: '#000000',
          borderRadius: 16,
          overflowY: 'auto',
          overflowX: 'hidden',
          border: isRecording ? '2px solid #FF3B30' : '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: isRecording
            ? '0 0 24px rgba(255, 59, 48, 0.45), 0 8px 30px rgba(0, 0, 0, 0.9)'
            : '0 8px 30px rgba(0, 0, 0, 0.8)',
          margin: '12px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Render Canvas: Exact dimensions of the chat bubbles column */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: 'auto',
            display: recordedVideoUrl ? 'none' : 'block',
            backgroundColor: '#000000'
          }}
        />

        {/* Video Player when Recorded */}
        {recordedVideoUrl && (
          <video
            src={recordedVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            controls
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: '#000000',
              display: 'block'
            }}
          />
        )}

        {/* Recording HUD Badge */}
        {isRecording && (
          <div
            style={{
              position: 'sticky',
              top: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid #FF3B30',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              zIndex: 10
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#FF3B30',
                boxShadow: '0 0 8px #FF3B30'
              }}
            />
            <span style={{ color: '#FF3B30', fontSize: 12, fontWeight: 700 }}>REC</span>
            <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 600 }}>
              {elapsedTime.toFixed(1)}s / {durationSec}.0s
            </span>
            <span style={{ color: '#00E5FF', fontSize: 12, fontWeight: 700 }}>
              {progress}%
            </span>
          </div>
        )}
      </div>

      {/* Control Panel: Seconds input & Actions */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: '#161616',
          borderRadius: 20,
          padding: '14px 16px',
          boxSizing: 'border-box',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}
      >
        {recordedVideoUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                color: '#34C759',
                fontSize: 14,
                fontWeight: 700,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <span>✓</span> Video Ready ({durationSec}s · Looping Animations)
            </div>

            <a
              href={recordedVideoUrl}
              download={`bubbles-animation-${Date.now()}.${recordedMimeType.includes('mp4') ? 'mp4' : 'webm'}`}
              style={{
                width: '100%',
                height: 44,
                borderRadius: 12,
                backgroundColor: '#0095F6',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(0, 149, 246, 0.4)'
              }}
            >
              <span>📥</span> Download Video ({recordedMimeType.includes('mp4') ? 'MP4' : 'WebM'})
            </a>

            <button
              onClick={() => setRecordedVideoUrl(null)}
              style={{
                width: '100%',
                height: 38,
                borderRadius: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🔄 Record Again
            </button>
          </div>
        ) : (
          <>
            {/* Quick Actions Bar (Both Sides Always Active) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: '#34C759', fontWeight: 700 }}>● Full Chat Mode</span>
                <span style={{ fontSize: 11, color: '#8E8E93' }}>(Left & Right Together)</span>
              </div>

              <button
                disabled={isRecording}
                onClick={handleQuickScreenshot}
                title="Capture instant PNG screenshot of these bubbles"
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  backgroundColor: 'rgba(255, 215, 0, 0.12)',
                  color: '#FFD700',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                📸 Instant Screenshot
              </button>
            </div>

            {/* Studio Export Quality & Resolution Selector */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1E1E1E',
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                <div style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 700 }}>
                  Export Resolution:
                </div>
                <div style={{ color: '#8E8E93', fontSize: 10.5 }}>
                  {quality === '1080P' ? '1080p Full HD · 60 FPS · 25 Mbps' : '720p HD · 60 FPS'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  disabled={isRecording}
                  onClick={() => setQuality('1080P')}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 6,
                    backgroundColor: quality === '1080P' ? '#0095F6' : 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  1080p Ultra HD
                </button>
                <button
                  disabled={isRecording}
                  onClick={() => setQuality('720P')}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 6,
                    backgroundColor: quality === '720P' ? '#0095F6' : 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  720p HD
                </button>
              </div>
            </div>

            {/* Laser Shine Speed Selector (Fast / Normal / Smooth) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1E1E1E',
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                <div style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 700 }}>
                  Laser Shine Speed:
                </div>
                <div style={{ color: '#8E8E93', fontSize: 10.5 }}>
                  {speedOption === 'FAST'
                    ? 'Fast (1.8s) · Dynamic & Snappy'
                    : speedOption === 'NORMAL'
                    ? 'Normal (2.2s) · Balanced'
                    : 'Smooth (3.0s) · Relaxed'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['FAST', 'NORMAL', 'SMOOTH'] as const).map((opt) => (
                  <button
                    key={opt}
                    disabled={isRecording}
                    onClick={() => setSpeedOption(opt)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 6,
                      backgroundColor: speedOption === opt ? '#0095F6' : 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {opt === 'FAST' ? 'Fast' : opt === 'NORMAL' ? 'Normal' : 'Smooth'}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Input & Quick Chips */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8
                }}
              >
                <span style={{ color: '#A8A8A8', fontSize: 13, fontWeight: 500 }}>
                  Animation Duration (Seconds):
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="number"
                    min="3"
                    max="60"
                    disabled={isRecording}
                    value={durationSec}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val > 0) setDurationSec(val);
                    }}
                    style={{
                      width: 54,
                      height: 30,
                      backgroundColor: '#262626',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 8,
                      color: '#00E5FF',
                      fontSize: 15,
                      fontWeight: 700,
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                  <span style={{ color: '#FFFFFF', fontSize: 13 }}>sec</span>
                </div>
              </div>

              {/* Quick Duration Chips */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[5, 10, 15, 20].map((sec) => (
                  <button
                    key={sec}
                    disabled={isRecording}
                    onClick={() => setDurationSec(sec)}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      borderRadius: 8,
                      backgroundColor: durationSec === sec ? '#0095F6' : 'rgba(255, 255, 255, 0.08)',
                      color: durationSec === sec ? '#FFFFFF' : '#A8A8A8',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Presets & Lyrics Selection */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                disabled={isRecording}
                onClick={() => {
                  setMessagesToRecord(
                    ONE_NIGHT_IN_DUBAI_PRESET.map((p, idx) => ({
                      id: `preset-${idx}`,
                      text: p.text,
                      theme: p.theme,
                      isFromMe: idx % 2 === 0,
                      timestamp: '12:00 PM',
                      type: 'TEXT',
                      orderIndex: idx
                    }))
                  );
                  setRecordedVideoUrl(null);
                }}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFD700',
                  border: '1px solid rgba(255, 215, 0, 0.25)',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ✨ Dubai Preset ({ONE_NIGHT_IN_DUBAI_PRESET.length})
              </button>

              <button
                disabled={isRecording}
                onClick={() => {
                  const validChat = currentMessages.filter((m) => m.type === 'TEXT' && m.text.trim());
                  if (validChat.length > 0) {
                    setMessagesToRecord(validChat);
                  }
                  setRecordedVideoUrl(null);
                }}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#00E5FF',
                  border: '1px solid rgba(0, 229, 255, 0.25)',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                💬 Current Chat ({currentMessages.length})
              </button>
            </div>

            {/* Record Action Button */}
            {isRecording ? (
              <button
                onClick={handleStopRecordingManually}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 12,
                  backgroundColor: '#FF3B30',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 18px rgba(255, 59, 48, 0.5)'
                }}
              >
                <span>⏹️</span> Stop & Save ({elapsedTime}s)
              </button>
            ) : (
              <button
                onClick={handleStartRecording}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: '#FF1744',
                  backgroundImage: 'linear-gradient(135deg, #FF1744 0%, #D500F9 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 18px rgba(255, 23, 68, 0.45)'
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF'
                  }}
                />
                Start Video Recording ({durationSec}s)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
