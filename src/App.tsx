import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { ChatProfile, ChatMessage, BubbleTheme } from './types/chat';
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

export const App: React.FC = () => {
  // Persistence with localStorage
  const [profile, setProfile] = useState<ChatProfile>(() => {
    try {
      const saved = localStorage.getItem('insta_chat_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.avatarName = 'sahil_avatar';
        if (!parsed.handle || parsed.handle === 'md.sahil_sk_') {
          parsed.handle = 'not__ur__sahil_77';
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
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('insta_chat_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('insta_chat_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const [currentScreen, setCurrentScreen] = useState<'DM' | 'BACKEND'>('DM');
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
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
    customTimestamp?: string
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
      audioDuration,
      theme,
      orderIndex: Date.now()
    };

    setMessages((prev) => [...prev, newMsg]);

    // Intelligent auto-reply simulation
    if (isFromMe && profile.autoReplyEnabled) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const replyText = sahilResponses[responseIndex % sahilResponses.length];
          setResponseIndex((i) => i + 1);

          const replyMsg: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            text: replyText,
            isFromMe: false,
            timestamp: getCurrentTime(),
            type: 'TEXT',
            theme: 'CLASSIC',
            orderIndex: Date.now()
          };

          setMessages((prev) => [...prev, replyMsg]);
        }, 1300);
      }, 700);
    }
  };

  // Edit message
  const handleEditMessage = (
    id: string,
    newText: string,
    newTimestamp: string,
    isFromMe: boolean,
    theme: BubbleTheme
  ) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? { ...msg, text: newText, timestamp: newTimestamp, isFromMe, theme }
          : msg
      )
    );
  };

  // Delete message
  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
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

  // Screenshot capture using html2canvas
  const handleCaptureScreenshot = async () => {
    if (!captureAreaRef.current) return;
    try {
      showToast('Capturing full chat...');
      const canvas = await html2canvas(captureAreaRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedScreenshotUrl(dataUrl);
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
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {currentScreen === 'BACKEND' ? (
        <BackendScreen
          currentProfile={profile}
          messagesList={messages}
          onSaveProfile={(updated) => setProfile(updated)}
          onAddMessage={(text, isMe, time, theme) =>
            handleSendMessage(text, isMe, 'TEXT', undefined, undefined, theme, time)
          }
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          onClearAllMessages={handleClearAll}
          onResetDefaults={handleResetDefaults}
          onBackToDM={() => setCurrentScreen('DM')}
          onToast={showToast}
        />
      ) : (
        /* ================= LIVE DM SCREEN ================= */
        <div
          style={{
            width: '100%',
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
            onTagCaptureScreenshot={handleCaptureScreenshot}
            onOpenBackend={() => setCurrentScreen('BACKEND')}
            onClearChatClick={() => setShowClearChat(true)}
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
              />

              {/* Centered Conversation Timestamp */}
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '12px 0',
                  color: '#8E8E93',
                  fontSize: 12,
                  userSelect: 'none'
                }}
              >
                {profile.chatTimestamp}
              </div>

              {/* Messages list */}
              {messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  senderName={profile.name}
                  avatarName={profile.avatarName}
                  onAvatarClick={() => setShowProfileSheet(true)}
                  onMessageClick={(m) => setSelectedMessageForAction(m)}
                />
              ))}

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
                      src={getAvatarUrl(profile.avatarName)}
                      alt="Sahil"
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
              onSendClick={() => {
                if (inputText.trim()) {
                  handleSendMessage(inputText.trim(), true);
                  setInputText('');
                }
              }}
              onCameraClick={() => {
                handleSendMessage('Free Fire Booyah victory screenshot', true, 'IMAGE', '/avatars/gaming_post.jpg');
              }}
              onMicClick={() => {
                handleSendMessage('', true, 'AUDIO', undefined, '0:04');
              }}
              onGalleryClick={(file) => {
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    if (e.target?.result) {
                      handleSendMessage('Shared photo', true, 'IMAGE', e.target.result as string);
                    }
                  };
                  reader.readAsDataURL(file);
                } else {
                  handleSendMessage('Free Fire Booyah victory screenshot', true, 'IMAGE', '/avatars/gaming_post.jpg');
                }
              }}
              onPlusClick={() => {
                handleSendMessage('', true, 'AUDIO', undefined, '0:04');
              }}
              isBlocked={profile.isBlocked}
              blockedHandle={profile.handle}
              onUnblockClick={() => {
                setProfile((p) => ({ ...p, isBlocked: false }));
                showToast(`Unblocked ${profile.handle}`);
              }}
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
          />
        )}

        {/* Modal: Change Avatar */}
        {showChangeAvatar && (
          <ChangeAvatarModal
            currentAvatarName={profile.avatarName}
            onAvatarSelected={(newAvatar) => {
              setProfile((p) => ({ ...p, avatarName: newAvatar }));
              showToast('Profile picture updated!');
            }}
            onDismiss={() => setShowChangeAvatar(false)}
          />
        )}

        {/* Modal: Message Action (Long-press / click on bubble) */}
        {selectedMessageForAction && (
          <MessageActionModal
            message={selectedMessageForAction}
            onEditMessage={(id, text, time, isMe, theme) => {
              handleEditMessage(id, text, time, isMe, theme);
              setSelectedMessageForAction(null);
              showToast('Message updated!');
            }}
            onDeleteMessage={(id) => {
              handleDeleteMessage(id);
              setSelectedMessageForAction(null);
              showToast('Message removed!');
            }}
            onReactEmoji={(emoji) => {
              handleSendMessage(emoji, true, 'STICKER');
              setSelectedMessageForAction(null);
            }}
            onDismiss={() => setSelectedMessageForAction(null)}
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
