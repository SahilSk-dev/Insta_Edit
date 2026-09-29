import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, BubbleTheme } from '../types/chat';
import { CloseIcon } from './InstagramIcons';
import {
  renderBubblesToCanvas,
  captureBubblesScreenshot,
  calculateBubblesColumnLayout,
  preloadAvatarImage,
  preloadAllMessagesAssets,
  RenderBubblesOptions,
  MeasuredBubble
} from '../utils/bubbleCanvasRenderer';

interface LyricsVideoEngineModalProps {
  currentMessages: ChatMessage[];
  emojiFont?: string;
  avatarUrl?: string;
  globalBubbleSpacing?: number;
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
  globalBubbleSpacing = 4,
  onDismiss,
  onScreenshotCapture
}) => {
  // Configurable recording options: exact duration in seconds
  const [durationSec, setDurationSec] = useState<number>(10);
  const [quality, setQuality] = useState<'1080P' | '720P'>('1080P');
  const [fpsOption, setFpsOption] = useState<number>(40); // 40 FPS Default for buttery-smooth zero-hang recording
  const [speedOption, setSpeedOption] = useState<'FAST' | 'NORMAL' | 'SMOOTH'>('FAST');

  // Messages to record: defaults to all current chat messages, or dubai preset if chat empty
  const [messagesToRecord, setMessagesToRecord] = useState<ChatMessage[]>(() => {
    const validChat = currentMessages.filter((m) => {
      if (m.type === 'IMAGE' || m.type === 'AUDIO' || m.type === 'STICKER') return true;
      return Boolean(m.text && m.text.trim());
    });
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

  // Common render options (Scale 2.5 = 1080p Studio HD with 432 baseWidth, Scale 2 = 720p HD)
  const renderOptions: RenderBubblesOptions = {
    scale: quality === '1080P' ? 2.5 : 2,
    baseWidth: 432,
    emojiFont,
    avatarUrl,
    speedMultiplier,
    globalBubbleSpacing
  };

  // Re-calculate layout only when messages or render options change (NEVER inside loop!)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    cachedLayoutRef.current = calculateBubblesColumnLayout(ctx, messagesToRecord, renderOptions);
  }, [messagesToRecord, quality, emojiFont, speedOption, avatarUrl, globalBubbleSpacing]);

  // Preload avatar photo and message photos into memory & DOM cache immediately
  useEffect(() => {
    preloadAllMessagesAssets(messagesToRecord, avatarUrl);
  }, [messagesToRecord, avatarUrl]);

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

  // Live preview loop when not recording (paced at target FPS to save CPU)
  useEffect(() => {
    let animId: number;
    let lastPreviewTime = 0;
    const previewInterval = 1000 / fpsOption;

    const loop = (now: number) => {
      if (!isRecording) {
        if (now - lastPreviewTime >= previewInterval) {
          drawFrame(now);
          lastPreviewTime = now;
        }
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRecording, drawFrame, fpsOption]);

  // Start live recording of the animated bubbles with deterministic 40 FPS engine
  const handleStartRecording = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // 1. Ensure all assets are preloaded into memory before recording begins
      await preloadAllMessagesAssets(messagesToRecord, avatarUrl);
      drawFrame(0);

      setRecordedVideoUrl(null);
      setIsRecording(true);
      setProgress(0);
      setElapsedTime(0);
      recordedChunksRef.current = [];

      const fps = fpsOption;
      const totalFrames = Math.round(durationSec * fps);
      const frameIntervalMs = 1000 / fps;

      // 2. Set up stream: prefer manual frame capture (Chromium requestFrame) for 100% hang-free rendering
      let stream: MediaStream;
      let isManualCapture = false;
      let videoTrack: MediaStreamTrack | null = null;

      try {
        stream = (canvas as any).captureStream ? (canvas as any).captureStream(0) : null;
        videoTrack = stream ? stream.getVideoTracks()[0] || null : null;
        if (videoTrack && typeof (videoTrack as any).requestFrame === 'function') {
          isManualCapture = true;
        } else {
          stream = canvas.captureStream(fps);
        }
      } catch {
        stream = canvas.captureStream(fps);
      }

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

      // Optimal 8 Mbps for 1080p, 5 Mbps for 720p (flawless crystal-clear video, zero encoder hang!)
      const recorder = new MediaRecorder(stream, {
        mimeType: chosenMime,
        videoBitsPerSecond: quality === '1080P' ? 8000000 : 5000000
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
      recorder.start(1000); // 1-second chunks to eliminate GC freeze

      if (isManualCapture && videoTrack) {
        // Mode 1: Deterministic Frame-by-Frame Mode (ZERO dropped frames, ZERO hang!)
        let currentFrame = 0;
        const stepManual = () => {
          if (currentFrame >= totalFrames) {
            if (recorder.state !== 'inactive') {
              recorder.stop();
            }
            return;
          }

          const virtualTimeMs = currentFrame * frameIntervalMs;
          drawFrame(virtualTimeMs);
          (videoTrack as any).requestFrame();

          currentFrame++;
          const currentProgress = Math.min(100, Math.round((currentFrame / totalFrames) * 100));
          setProgress(currentProgress);
          setElapsedTime(parseFloat((virtualTimeMs / 1000).toFixed(1)));

          animFrameRef.current = requestAnimationFrame(stepManual);
        };
        animFrameRef.current = requestAnimationFrame(stepManual);
      } else {
        // Mode 2: Throttled Real-time Mode (paced strictly at target FPS to avoid CPU overload)
        startTimeRef.current = performance.now();
        const totalDurationMs = durationSec * 1000;
        let lastRenderTime = 0;

        const stepRealtime = (now: number) => {
          const elapsed = now - startTimeRef.current;
          if (elapsed >= totalDurationMs) {
            if (recorder.state !== 'inactive') {
              recorder.stop();
            }
            return;
          }

          if (now - lastRenderTime >= frameIntervalMs * 0.9) {
            drawFrame(now);
            lastRenderTime = now;
          }

          const currentProgress = Math.min(1, elapsed / totalDurationMs);
          setProgress(Math.round(currentProgress * 100));
          setElapsedTime(parseFloat((elapsed / 1000).toFixed(1)));

          animFrameRef.current = requestAnimationFrame(stepRealtime);
        };
        animFrameRef.current = requestAnimationFrame(stepRealtime);
      }
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
      {/* Inline styles for spinner */}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

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
              Only Bubbles · Full Chat Height · 1080p · {fpsOption} FPS
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

      {/* Main Viewport: Live Preview before recording, Offscreen during recording (Zero-Freeze Engine) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          maxHeight: '56vh',
          backgroundColor: '#000000',
          borderRadius: 16,
          overflowY: 'auto',
          overflowX: 'hidden',
          border: isRecording ? '2px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: isRecording
            ? '0 0 24px rgba(0, 229, 255, 0.35), 0 8px 30px rgba(0, 0, 0, 0.9)'
            : '0 8px 30px rgba(0, 0, 0, 0.8)',
          margin: '12px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: isRecording ? 'center' : 'flex-start'
        }}
      >
        {/* Render Canvas: Visible during preview, moved offscreen during recording to eliminate device freeze */}
        <canvas
          ref={canvasRef}
          style={
            isRecording
              ? {
                  position: 'fixed',
                  left: -99999,
                  top: 0,
                  opacity: 0,
                  pointerEvents: 'none'
                }
              : {
                  width: '100%',
                  height: 'auto',
                  display: recordedVideoUrl ? 'none' : 'block',
                  backgroundColor: '#000000'
                }
          }
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

        {/* Background Rendering Dashboard (Prevents device freeze & zero hang) */}
        {isRecording && (
          <div
            style={{
              width: '100%',
              minHeight: 250,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px 20px',
              boxSizing: 'border-box',
              gap: 14
            }}
          >
            {/* Spinning Neon Ring */}
            <div
              style={{
                position: 'relative',
                width: 66,
                height: 66,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '3.5px solid rgba(0, 229, 255, 0.15)',
                  borderTopColor: '#00E5FF',
                  animation: 'spin 0.9s linear infinite'
                }}
              />
              <span style={{ fontSize: 24 }}>⚡</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
                Rendering {quality} Video...
              </div>
              <div style={{ color: '#00E5FF', fontSize: 13, fontWeight: 600 }}>
                {fpsOption} FPS · {progress}% Completed
              </div>
            </div>

            {/* Glowing Smooth Progress Bar */}
            <div
              style={{
                width: '85%',
                height: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #0095F6 0%, #00E5FF 100%)',
                  borderRadius: 4,
                  boxShadow: '0 0 10px rgba(0, 229, 255, 0.8)',
                  transition: 'width 0.12s ease'
                }}
              />
            </div>

            {/* Informative reassurance to user */}
            <div style={{ textAlign: 'center', maxWidth: 300 }}>
              <div style={{ color: '#A8A8A8', fontSize: 12, fontWeight: 500 }}>
                {elapsedTime.toFixed(1)}s / {durationSec}.0s
              </div>
              <div
                style={{
                  color: '#34C759',
                  fontSize: 11,
                  fontWeight: 600,
                  marginTop: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4
                }}
              >
                <span>✓</span> Background Render Mode (Zero Screen Freeze & Zero Lag)
              </div>
            </div>
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
                  {quality === '1080P' ? '1080p Studio Full HD (1080px)' : '720p HD Ready'}
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

            {/* Frame Rate (FPS) Selector (Default 40 FPS - Zero Hang & Silky Smooth) */}
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
                  Frame Rate (FPS):
                </div>
                <div style={{ color: '#00E5FF', fontSize: 10.5, fontWeight: 600 }}>
                  {fpsOption === 40
                    ? '40 FPS (Recommended) · Silky Smooth & Zero Hang'
                    : fpsOption === 30
                    ? '30 FPS · Lightweight'
                    : '60 FPS · Studio Pro'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[40, 30, 60].map((f) => (
                  <button
                    key={f}
                    disabled={isRecording}
                    onClick={() => setFpsOption(f)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 6,
                      backgroundColor: fpsOption === f ? '#00E5FF' : 'rgba(255, 255, 255, 0.08)',
                      color: fpsOption === f ? '#000000' : '#FFFFFF',
                      border: 'none',
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {f} FPS
                  </button>
                ))}
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
                  const validChat = currentMessages.filter((m) => {
                    if (m.type === 'IMAGE' || m.type === 'AUDIO' || m.type === 'STICKER') return true;
                    return Boolean(m.text && m.text.trim());
                  });
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
                <span>⏹️</span> Cancel Recording
              </button>
            ) : (
              <button
                onClick={handleStartRecording}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: '#0095F6',
                  backgroundImage: 'linear-gradient(135deg, #0095F6 0%, #00E5FF 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 15.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 18px rgba(0, 149, 246, 0.45)'
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
                Start Recording ({quality} · {fpsOption} FPS)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
