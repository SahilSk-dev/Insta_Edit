import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { ChatProfile, ChatMessage, BubbleTheme, PhotoBorderStyle } from './types/chat';
import { initialProfile, initialMessages, sahilResponses, getAvatarUrl } from './data/initialData';
import { ChatTopBar } from './components/ChatTopBar';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessageItem } from './components/ChatMessageItem';
import { ChatInputBar } from './components/ChatInputBar';
import { BackendScreen } from './components/BackendScreen';
import { VideoCallOverlay } from './components/VideoCallOverlay';
import { UserProfileModal } from './components/UserProfileModal';
import { SafetyTipsModal } from './components/SafetyTipsModal';
import { BlockUserModal } from './components/BlockUserModal';
import { ChangeAvatarModal } from './components/ChangeAvatarModal';
import { MessageActionModal } from './components/MessageActionModal';
import { ClearChatModal } from './components/ClearChatModal';
import { ScreenshotModal } from './components/ScreenshotModal';
import { SenderSelectModal } from './components/SenderSelectModal';
import { EmojiFontSelectModal } from './components/EmojiFontSelectModal';
import { LyricsVideoEngineModal } from './components/LyricsVideoEngineModal';
import { CaptureModeModal } from './components/CaptureModeModal';
import { ChatSpacingModal } from './components/ChatSpacingModal';
import { captureBubblesScreenshot } from './utils/bubbleCanvasRenderer';
import { setGlobalEmojiFont } from './data/emojiFonts';

/**
 * Fast client-side image compression to guarantee crisp HD quality
 * while keeping base64 under ~120KB so localStorage quota is never exceeded.
 */
const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1200;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve((e.target?.result as string) || '/avatars/gaming_post.jpg');
        }
      };
      img.onerror = () => {
        resolve((e.target?.result as string) || '/avatars/gaming_post.jpg');
      };
      img.src = (e.target?.result as string) || '';
    };
    reader.readAsDataURL(file);
  });
};

export const App: React.FC = () => {
  // Persistence with localStorage
  const [profile, setProfile] = useState<ChatProfile>(() => {
    try {
      const saved = localStorage.getItem('insta_chat_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.avatarName) {
          parsed.avatarName = 'sahil_avatar';
        }
        if (!parsed.handle) {
          parsed.handle = 'not__ur__sahil_77';
        }
        if (!parsed.name) {
          parsed.name = 'Sahil';
        }
        if (!parsed.bio || parsed.bio.includes('Free Fire') || parsed.bio.includes('Booyah') || parsed.bio.includes('Headshot') || parsed.bio === 'Develop by Sahil') {
          parsed.bio = 'Developed by Sahil';
        }
        if (!parsed.followersCount || parsed.followersCount === '108') {
          parsed.followersCount = '3,000';
        }
        if (!parsed.followingCount || parsed.followingCount === '142') {
          parsed.followingCount = '10';
        }
        if (!parsed.emojiFont) {
          parsed.emojiFont = 'SamsungOneUI_4_Xmas';
        }
        return parsed;
      }
      return initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('insta_chat_messages');
      if (saved) {
        const parsed: ChatMessage[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialMessages;
    } catch (e) {
      console.warn('Error reading chat messages from localStorage:', e);
      return initialMessages;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('insta_chat_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    const currentEmojiFont = profile.emojiFont || 'SamsungOneUI_4_Xmas';
    setGlobalEmojiFont(currentEmojiFont);
  }, [profile.emojiFont]);

  useEffect(() => {
    try {
      localStorage.setItem('insta_chat_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const [currentScreen, setCurrentScreen] = useState<'DM' | 'BACKEND'>('DM');
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [activeSender, setActiveSender] = useState<'ME' | 'SAHIL'>('ME');
  const [responseIndex, setResponseIndex] = useState(0);

  // UI Modals
  const [showSafetyTips, setShowSafetyTips] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  const [showClearChat, setShowClearChat] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedMessageForAction, setSelectedMessageForAction] = useState<ChatMessage | null>(null);
  const [capturedScreenshotUrl, setCapturedScreenshotUrl] = useState<string | null>(null);
  const [pendingMessageText, setPendingMessageText] = useState<string | null>(null);
  const [showEmojiFontModal, setShowEmojiFontModal] = useState(false);
  const [showLyricsVideoEngine, setShowLyricsVideoEngine] = useState(false);
  const [showCaptureModeModal, setShowCaptureModeModal] = useState(false);
  const [showSpacingModal, setShowSpacingModal] = useState(false);

  // Global Chat Bubble Spacing (Margin / Gap between bubbles in px)
  const [globalBubbleSpacing, setGlobalBubbleSpacing] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('insta_bubble_spacing');
      return saved ? parseInt(saved, 10) : 4;
    } catch {
      return 4;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('insta_bubble_spacing', globalBubbleSpacing.toString());
    } catch {}
  }, [globalBubbleSpacing]);

  const handleResetAllCustomGaps = () => {
    setMessages((prev) =>
      prev.map((msg) => ({
        ...msg,
        customSpacing: undefined
      }))
    );
    showToast(`All bubble gaps reset to ${globalBubbleSpacing}px!`);
  };

  const handleUpdateMessageSpacing = (messageId: string, spacing?: number) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              customSpacing: spacing !== undefined && spacing >= 0 ? spacing : undefined
            }
          : msg
      )
    );
    setSelectedMessageForAction((prev) =>
      prev && prev.id === messageId
        ? {
            ...prev,
            customSpacing: spacing !== undefined && spacing >= 0 ? spacing : undefined
          }
        : prev
    );
  };

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const captureAreaRef = useRef<HTMLDivElement>(null);
  const onlyChatBubblesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, currentScreen]);

  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Send message handler with auto-reply
  const handleSendMessage = (
    text: string,
    isFromMe: boolean = true,
    type: 'TEXT' | 'IMAGE' | 'AUDIO' | 'STICKER' = 'TEXT',
    imageResName?: string,
    audioDuration?: string,
    theme: BubbleTheme = 'CLASSIC',
    customTimestamp?: string,
    emojiFont?: string
  ) => {
    if (profile.isBlocked && isFromMe) {
      showToast('You cannot message a blocked user.');
      return;
    }

    const time = customTimestamp || getCurrentTime();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text,
      isFromMe,
      timestamp: time,
      type,
      imageResName,
      imageWidth: 220,
      photoStyle: 'NORMAL',
      laserColor: '#00F0FF',
      laserSpeed: 2.4,
      imageFit: 'cover',
      audioDuration,
      theme,
      emojiFont,
      orderIndex: Date.now()
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  // Edit message
  const handleEditMessage = (
    id: string,
    newText: string,
    newTimestamp: string,
    isFromMe: boolean,
    theme: BubbleTheme,
    emojiFont?: string,
    reaction?: string,
    imageWidth?: number,
    imageHeight?: number,
    photoStyle?: PhotoBorderStyle,
    imageFit?: 'cover' | 'contain',
    laserColor?: string,
    laserSpeed?: number,
    customSpacing?: number | null,
    audioDuration?: string
  ) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              text: newText,
              timestamp: newTimestamp,
              isFromMe,
              theme,
              emojiFont,
              reaction: reaction !== undefined ? (reaction || undefined) : msg.reaction,
              imageWidth: imageWidth !== undefined ? imageWidth : msg.imageWidth,
              imageHeight: imageWidth !== undefined ? imageHeight : (imageHeight !== undefined ? imageHeight : msg.imageHeight),
              photoStyle: photoStyle !== undefined ? photoStyle : msg.photoStyle,
              imageFit: imageFit !== undefined ? imageFit : msg.imageFit,
              laserColor: laserColor !== undefined ? laserColor : msg.laserColor,
              laserSpeed: laserSpeed !== undefined ? laserSpeed : msg.laserSpeed,
              customSpacing: customSpacing !== undefined ? (customSpacing === null || customSpacing < 0 ? undefined : customSpacing) : msg.customSpacing,
              audioDuration: audioDuration !== undefined ? audioDuration : msg.audioDuration
            }
          : msg
      )
    );
  };

  // Delete message
  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  // React to message with emoji badge (Instagram DM style)
  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const nextReaction = msg.reaction === emoji ? undefined : emoji;
          return { ...msg, reaction: nextReaction };
        }
        return msg;
      })
    );
  };

  // Clear all messages
  const handleClearAll = () => {
    setMessages([]);
    setShowClearChat(false);
    showToast('Conversation cleared!');
  };

  // Reset all to defaults
  const handleResetDefaults = () => {
    setProfile(initialProfile);
    setMessages(initialMessages);
    localStorage.removeItem('insta_chat_profile');
    localStorage.removeItem('insta_chat_messages');
    showToast('Reset all data to default template!');
  };

  // Screenshot capture: Native 2x canvas engine for pure bubbles, html2canvas for full app
  const handleCaptureScreenshot = async (onlyBubbles: boolean = true) => {
    try {
      showToast(onlyBubbles ? 'Capturing bubbles screenshot...' : 'Capturing chat screenshot...');
      if (onlyBubbles) {
        // Crisp 2x native canvas rendering: Eliminates all html2canvas distortion & wide desktop stretch!
        const dataUrl = await captureBubblesScreenshot(messages, {
          scale: 2,
          baseWidth: 420,
          emojiFont: profile.emojiFont || 'SamsungOneUI_4_Xmas',
          avatarUrl: getAvatarUrl(profile.avatarName)
        });
        setCapturedScreenshotUrl(dataUrl);
        return;
      }

      if (captureAreaRef.current) {
        const canvas = await html2canvas(captureAreaRef.current, {
          backgroundColor: '#000000',
          scale: 2,
          useCORS: true,
          logging: false
        });
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedScreenshotUrl(dataUrl);
      }
    } catch (err) {
      showToast('Unable to capture screenshot');
    }
  };

  return (
    <div
      ref={captureAreaRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '100vw',
        height: '100dvh',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        '--active-emoji-font': `'${profile.emojiFont || 'SamsungOneUI_4_Xmas'}'`
      } as React.CSSProperties}
    >
      {currentScreen === 'BACKEND' ? (
        <BackendScreen
          currentProfile={profile}
          messagesList={messages}
          onSaveProfile={(updated) => setProfile(updated)}
          onAddMessage={(text, isMe, time, theme, emojiFont) =>
            handleSendMessage(text, isMe, 'TEXT', undefined, undefined, theme, time, emojiFont)
          }
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          onClearAllMessages={handleClearAll}
          onResetDefaults={handleResetDefaults}
          onBackToDM={() => setCurrentScreen('DM')}
          onOpenLyricsVideoEngine={() => setShowLyricsVideoEngine(true)}
          onToast={showToast}
        />
      ) : (
        /* ================= LIVE DM SCREEN ================= */
        <div
          style={{
            width: '100%',
            maxWidth: 480,
            height: '100%',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#000000',
            overflow: 'hidden'
          }}
        >
          {/* Instagram DM Top Bar */}
          <ChatTopBar
            name={profile.name}
            handle={profile.handle}
            avatarName={profile.avatarName}
            onBackClick={() => showToast('Direct inbox')}
            onProfileClick={() => setShowProfileSheet(true)}
            onChangeAvatar={() => setShowChangeAvatar(true)}
            onVideoCallClick={() => setShowVideoCall(true)}
            onTagClick={() => setShowCaptureModeModal(true)}
            onOpenBackend={() => setCurrentScreen('BACKEND')}
            onClearChatClick={() => setShowClearChat(true)}
            onOpenEmojiFontSelect={() => setShowEmojiFontModal(true)}
            activeEmojiFont={profile.emojiFont || 'SamsungOneUI_4_Xmas'}
          />

          {/* Scrollable Chat Area */}
          <div
            ref={chatScrollContainerRef}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: 8
            }}
          >
              {/* Instagram Header with Profile Info */}
              <ChatHeader
                profile={profile}
                onSafetyTipsClick={() => setShowSafetyTips(true)}
                onBlockClick={() => {
                  if (profile.isBlocked) {
                    setProfile((p) => ({ ...p, isBlocked: false }));
                    showToast(`Unblocked ${profile.handle}`);
                  } else {
                    setShowBlockDialog(true);
                  }
                }}
                onProfileClick={() => setShowProfileSheet(true)}
                onChangeAvatar={() => setShowChangeAvatar(true)}
                onDirectAvatarUpload={(newAvatar) => {
                  setProfile((p) => {
                    const updated = { ...p, avatarName: newAvatar };
                    try {
                      localStorage.setItem('insta_chat_profile', JSON.stringify(updated));
                    } catch (e) {
                      console.warn('localStorage save warning:', e);
                    }
                    return updated;
                  });
                  showToast('Profile picture updated!');
                }}
              />

              {/* Centered Conversation Timestamp (100% Authentic Instagram DM) */}
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '12px 0 10px 0',
                  color: '#8E8E93',
                  fontSize: 12,
                  userSelect: 'none'
                }}
              >
                {profile.chatTimestamp}
              </div>

              {/* Messages list (Wrapped in dedicated ref for clean bubbles-only Screenshot & Video Recording) */}
              <div
                ref={onlyChatBubblesRef}
                style={{
                  width: '100%',
                  backgroundColor: '#000000',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box'
                }}
              >
                {messages.map((msg) => (
                  <ChatMessageItem
                    key={msg.id}
                    message={msg}
                    senderName={profile.name}
                    avatarName={profile.avatarName}
                    chatEmojiFont={profile.emojiFont || 'SamsungOneUI_4_Xmas'}
                    globalSpacing={globalBubbleSpacing}
                    onAvatarClick={() => setShowProfileSheet(true)}
                    onMessageClick={(m) => setSelectedMessageForAction(m)}
                  />
                ))}
              </div>

              {/* Live typing indicator */}
              {isTyping && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 14px',
                    gap: 8
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      backgroundColor: '#262626'
                    }}
                  >
                    <img
                      key={getAvatarUrl(profile.avatarName)}
                      src={getAvatarUrl(profile.avatarName)}
                      alt={profile.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/avatars/sahil_avatar.jpg';
                      }}
                    />
                  </div>
                  <div
                    style={{
                      backgroundColor: '#262626',
                      borderRadius: '16px 16px 16px 4px',
                      padding: '8px 14px',
                      display: 'flex',
                      gap: 4,
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#8E8E93',
                        animation: 'bounceDot 1.4s infinite ease-in-out both'
                      }}
                    />
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#8E8E93',
                        animation: 'bounceDot 1.4s infinite ease-in-out both 0.2s'
                      }}
                    />
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#8E8E93',
                        animation: 'bounceDot 1.4s infinite ease-in-out both 0.4s'
                      }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Bar */}
            <ChatInputBar
              messageText={inputText}
              onMessageChange={setInputText}
              activeSender={activeSender}
              onToggleSender={() => setActiveSender((prev) => (prev === 'ME' ? 'SAHIL' : 'ME'))}
              contactName={profile.name}
              sahilAvatar={profile.avatarName}
              onSendClick={() => {
                if (inputText.trim()) {
                  handleSendMessage(inputText.trim(), activeSender === 'ME');
                  setInputText('');
                }
              }}
              onCameraClick={() => {
                handleSendMessage('Shared photo', activeSender === 'ME', 'IMAGE', '/avatars/gaming_post.jpg');
              }}
              onMicClick={() => {
                handleSendMessage('', activeSender === 'ME', 'AUDIO', undefined, '0:04');
              }}
              onGalleryClick={async (file) => {
                if (file) {
                  try {
                    const compressedDataUrl = await compressImageFile(file);
                    handleSendMessage('Shared photo', activeSender === 'ME', 'IMAGE', compressedDataUrl);
                  } catch {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      if (e.target?.result) {
                        handleSendMessage('Shared photo', activeSender === 'ME', 'IMAGE', e.target.result as string);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                } else {
                  handleSendMessage('Shared photo', activeSender === 'ME', 'IMAGE', '/avatars/gaming_post.jpg');
                }
              }}
              onPlusClick={() => {
                handleSendMessage('', activeSender === 'ME', 'AUDIO', undefined, '0:04');
              }}
              isBlocked={profile.isBlocked}
              blockedHandle={profile.handle}
              onUnblockClick={() => {
                setProfile((p) => ({ ...p, isBlocked: false }));
                showToast(`Unblocked ${profile.handle}`);
              }}
              onDeleteChatClick={() => setShowClearChat(true)}
            />
          </div>
        )}

        {/* Modal: Safety Tips */}
        {showSafetyTips && (
          <SafetyTipsModal onDismiss={() => setShowSafetyTips(false)} />
        )}

        {/* Modal: Block User Dialog */}
        {showBlockDialog && (
          <BlockUserModal
            handle={profile.handle}
            onConfirmBlock={() => {
              setProfile((p) => ({ ...p, isBlocked: true }));
              setShowBlockDialog(false);
              showToast(`Blocked ${profile.handle}`);
            }}
            onDismiss={() => setShowBlockDialog(false)}
          />
        )}

        {/* Modal: User Profile Sheet */}
        {showProfileSheet && (
          <UserProfileModal
            profile={profile}
            onDismiss={() => setShowProfileSheet(false)}
            onSendMessage={() => setShowProfileSheet(false)}
            onBlockUser={() => {
              setShowProfileSheet(false);
              setShowBlockDialog(true);
            }}
            onOpenEmojiFontSelect={() => {
              setShowProfileSheet(false);
              setShowEmojiFontModal(true);
            }}
            onAvatarUpload={(newAvatar) => {
              setProfile((p) => {
                const updated = { ...p, avatarName: newAvatar };
                try {
                  localStorage.setItem('insta_chat_profile', JSON.stringify(updated));
                } catch (e) {
                  console.warn('localStorage save warning:', e);
                }
                return updated;
              });
              showToast('Profile picture updated!');
            }}
          />
        )}

        {/* Modal: Change Avatar */}
        {showChangeAvatar && (
          <ChangeAvatarModal
            currentAvatarName={profile.avatarName}
            onAvatarSelected={(newAvatar) => {
              setProfile((p) => {
                const updated = { ...p, avatarName: newAvatar };
                try {
                  localStorage.setItem('insta_chat_profile', JSON.stringify(updated));
                } catch (e) {
                  console.warn('localStorage quota warning:', e);
                }
                return updated;
              });
              showToast('Profile picture updated!');
            }}
            onDismiss={() => setShowChangeAvatar(false)}
          />
        )}

        {/* Modal: Message Action (Long-press / click on bubble) */}
        {selectedMessageForAction && (
          <MessageActionModal
            message={selectedMessageForAction}
            contactName={profile.name}
            globalSpacing={globalBubbleSpacing}
            onUpdateSpacingLive={handleUpdateMessageSpacing}
            onEditMessage={(
              id,
              text,
              time,
              isMe,
              theme,
              emojiFont,
              reaction,
              imageWidth,
              imageHeight,
              photoStyle,
              imageFit,
              laserColor,
              laserSpeed,
              customSpacing,
              audioDuration
            ) => {
              handleEditMessage(
                id,
                text,
                time,
                isMe,
                theme,
                emojiFont,
                reaction,
                imageWidth,
                imageHeight,
                photoStyle,
                imageFit,
                laserColor,
                laserSpeed,
                customSpacing,
                audioDuration
              );
              showToast('Updated successfully!');
            }}
            onDeleteMessage={(id) => {
              handleDeleteMessage(id);
              setSelectedMessageForAction(null);
              showToast('Message removed!');
            }}
            onReactEmoji={(emoji) => {
              handleReactToMessage(selectedMessageForAction.id, emoji);
              setSelectedMessageForAction(null);
              showToast('Reaction updated!');
            }}
            onDismiss={() => setSelectedMessageForAction(null)}
          />
        )}

        {/* Modal: Global Chat Bubble Spacing & Layout */}
        {showSpacingModal && (
          <ChatSpacingModal
            currentSpacing={globalBubbleSpacing}
            onUpdateSpacing={(sp) => {
              setGlobalBubbleSpacing(sp);
            }}
            onResetAllCustomGaps={handleResetAllCustomGaps}
            onDismiss={() => setShowSpacingModal(false)}
          />
        )}

        {/* Modal: Emoji Font Select */}
        {showEmojiFontModal && (
          <EmojiFontSelectModal
            currentFontFamily={profile.emojiFont || 'SamsungOneUI_4_Xmas'}
            onSelectFont={(fontName) => {
              setProfile((p) => ({ ...p, emojiFont: fontName }));
              showToast(`Emoji font set: ${fontName}`);
            }}
            onDismiss={() => setShowEmojiFontModal(false)}
            onToast={showToast}
          />
        )}

        {/* Modal: Screenshot Download / Share */}
        {capturedScreenshotUrl && (
          <ScreenshotModal
            imageDataUrl={capturedScreenshotUrl}
            onDismiss={() => setCapturedScreenshotUrl(null)}
            onToast={showToast}
          />
        )}

        {/* Modal: Clear Entire Chat */}
        {showClearChat && (
          <ClearChatModal
            handle={profile.handle}
            onConfirmClear={handleClearAll}
            onDismiss={() => setShowClearChat(false)}
          />
        )}

        {/* Fullscreen Video Call Simulation */}
        {showVideoCall && (
          <VideoCallOverlay
            name={profile.name}
            avatarName={profile.avatarName}
            onEndCall={() => setShowVideoCall(false)}
          />
        )}

        {/* Modal: Select Sender (Ami vs Sahil) */}
        {pendingMessageText && (
          <SenderSelectModal
            messageText={pendingMessageText}
            sahilName={profile.name}
            sahilHandle={profile.handle}
            sahilAvatar={profile.avatarName}
            onSelectSender={(isFromMe) => {
              handleSendMessage(pendingMessageText, isFromMe);
              setPendingMessageText(null);
              setInputText('');
            }}
            onDismiss={() => setPendingMessageText(null)}
          />
        )}

        {/* Modal: Capture Mode Selection (Screenshot vs Video Record Toggle) */}
        {showCaptureModeModal && (
          <CaptureModeModal
            onTakeScreenshot={handleCaptureScreenshot}
            onOpenVideoEngine={() => setShowLyricsVideoEngine(true)}
            onDismiss={() => setShowCaptureModeModal(false)}
          />
        )}

        {/* Modal: Lyrics Video Engine (Live Record Bubbles Video) */}
        {showLyricsVideoEngine && (
          <LyricsVideoEngineModal
            currentMessages={messages}
            emojiFont={profile.emojiFont || 'SamsungOneUI_4_Xmas'}
            avatarUrl={getAvatarUrl(profile.avatarName)}
            onDismiss={() => setShowLyricsVideoEngine(false)}
            onScreenshotCapture={(dataUrl) => {
              setCapturedScreenshotUrl(dataUrl);
            }}
          />
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: 'absolute',
              bottom: 74,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(38, 38, 38, 0.95)',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: 24,
              fontSize: 13,
              fontWeight: 500,
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.5)',
              zIndex: 99,
              pointerEvents: 'none',
              animation: 'fadeInOut 2.4s ease-in-out'
            }}
          >
            {toastMessage}
          </div>
        )}

        <style>{`
          @keyframes bounceDot {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, 10px); }
            15% { opacity: 1; transform: translate(-50%, 0); }
            85% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -10px); }
          }
        `}</style>
      </div>
    );
  };
