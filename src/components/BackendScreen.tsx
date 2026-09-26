import React, { useState, useRef } from 'react';
import { ChatProfile, ChatMessage, BubbleTheme } from '../types/chat';
import { availableAvatars, getAvatarUrl } from '../data/initialData';
import {
  BackIcon,
  RefreshIcon,
  EyeIcon,
  GalleryIcon,
  EditIcon,
  DeleteIcon,
  PlusIcon
} from './InstagramIcons';
import { ClearChatModal } from './ClearChatModal';
import { CropAvatarModal } from './CropAvatarModal';

interface BackendScreenProps {
  currentProfile: ChatProfile;
  messagesList: ChatMessage[];
  onSaveProfile: (profile: ChatProfile) => void;
  onAddMessage: (text: string, isFromMe: boolean, timestamp: string, theme: BubbleTheme) => void;
  onEditMessage: (id: string, newText: string, newTimestamp: string, isFromMe: boolean, theme: BubbleTheme) => void;
  onDeleteMessage: (id: string) => void;
  onClearAllMessages: () => void;
  onResetDefaults: () => void;
  onBackToDM: () => void;
  onToast: (msg: string) => void;
}

export const BackendScreen: React.FC<BackendScreenProps> = ({
  currentProfile,
  messagesList,
  onSaveProfile,
  onAddMessage,
  onEditMessage,
  onDeleteMessage,
  onClearAllMessages,
  onResetDefaults,
  onBackToDM,
  onToast
}) => {
  const [selectedTab, setSelectedTab] = useState<0 | 1>(0); // 0: Profile, 1: Messages
  const [showClearDialog, setShowClearDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile fields state
  const [name, setName] = useState(currentProfile.name);
  const [handle, setHandle] = useState(currentProfile.handle);
  const [joinedDate, setJoinedDate] = useState(currentProfile.joinedDate);
  const [followersCount, setFollowersCount] = useState(currentProfile.followersCount);
  const [postsCount, setPostsCount] = useState(currentProfile.postsCount);
  const [followingCount, setFollowingCount] = useState(currentProfile.followingCount);
  const [followsYouText, setFollowsYouText] = useState(currentProfile.followsYouText);
  const [mutualFollowText, setMutualFollowText] = useState(currentProfile.mutualFollowText);
  const [bio, setBio] = useState(currentProfile.bio);
  const [chatTimestamp, setChatTimestamp] = useState(currentProfile.chatTimestamp);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(currentProfile.autoReplyEnabled);
  const [isBlocked, setIsBlocked] = useState(currentProfile.isBlocked);
  const [avatarName, setAvatarName] = useState(currentProfile.avatarName);

  // New message form state
  const [newMsgText, setNewMsgText] = useState('');
  const [newMsgIsMe, setNewMsgIsMe] = useState(true);
  const [newMsgTimestamp, setNewMsgTimestamp] = useState('12:44 PM');
  const [newMsgTheme, setNewMsgTheme] = useState<BubbleTheme>('CLASSIC');

  // Editing message modal state
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingMsgText, setEditingMsgText] = useState('');
  const [editingMsgTimestamp, setEditingMsgTimestamp] = useState('');
  const [editingMsgIsMe, setEditingMsgIsMe] = useState(true);
  const [editingMsgTheme, setEditingMsgTheme] = useState<BubbleTheme>('CLASSIC');

  const themes: { key: BubbleTheme; label: string }[] = [
    { key: 'CLASSIC', label: 'Normal' },
    { key: 'OBSIDIAN_HEART', label: '❤️‍🔥 Hearts' },
    { key: 'MIDNIGHT_BUTTERFLY', label: '🦋 Butterfly' },
    { key: 'NEON_CYBER', label: '⚡ Cyber' },
    { key: 'GOLDEN_LUXE', label: '✨ Luxe' }
  ];

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const handleCustomDpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCropImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    const updated: ChatProfile = {
      ...currentProfile,
      name,
      handle,
      joinedDate,
      followersCount,
      postsCount,
      followingCount,
      followsYouText,
      mutualFollowText,
      bio,
      chatTimestamp,
      autoReplyEnabled,
      isBlocked,
      avatarName
    };
    onSaveProfile(updated);
    onToast('Profile updated! Applied to live DM.');
    onBackToDM();
  };

  const handleAddCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;
    onAddMessage(newMsgText.trim(), newMsgIsMe, newMsgTimestamp, newMsgTheme);
    setNewMsgText('');
    onToast('Message added to DM!');
  };

  const openEditMessage = (msg: ChatMessage) => {
    setEditingMsgId(msg.id);
    setEditingMsgText(msg.text);
    setEditingMsgTimestamp(msg.timestamp);
    setEditingMsgIsMe(msg.isFromMe);
    setEditingMsgTheme(msg.theme || 'CLASSIC');
  };

  const saveEditedMessage = () => {
    if (editingMsgId) {
      onEditMessage(editingMsgId, editingMsgText, editingMsgTimestamp, editingMsgIsMe, editingMsgTheme);
      setEditingMsgId(null);
      onToast('Message edited successfully!');
    }
  };

  if (cropImageSrc) {
    return (
      <CropAvatarModal
        imageSrc={cropImageSrc}
        onApply={(croppedDataUrl) => {
          setAvatarName(croppedDataUrl);
          setCropImageSrc(null);
          onToast('Profile picture cropped & updated!');
        }}
        onCancel={() => setCropImageSrc(null)}
      />
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCustomDpUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Top Header */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#121212',
          borderBottom: '1px solid #1A1A1A',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          paddingTop: 'env(safe-area-inset-top, 0px)',
          flexShrink: 0
        }}
      >
        <div
          style={{
            height: 56,
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={onBackToDM}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                padding: 6
              }}
            >
              <BackIcon size={24} />
            </button>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>
                DM Backend Editor
              </div>
              <div style={{ color: '#A8A8A8', fontSize: 11 }}>
                Edit user, followers & chat interface
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Reset Defaults button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all profile and chat data to default?')) {
                  onResetDefaults();
                  onToast('Reset all data to default template!');
                }
              }}
              title="Reset to default template"
              style={{
                background: 'none',
                border: 'none',
                color: '#A8A8A8',
                cursor: 'pointer',
                padding: 6,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <RefreshIcon size={20} />
            </button>

            {/* View Live DM button */}
            <button
              onClick={onBackToDM}
              style={{
                backgroundColor: '#0095F6',
                color: '#FFFFFF',
                borderRadius: 8,
                border: 'none',
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer'
              }}
            >
              <EyeIcon size={16} />
              <span>Live DM</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderTop: '1px solid #1A1A1A' }}>
          <button
            onClick={() => setSelectedTab(0)}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: selectedTab === 0 ? '3px solid #0095F6' : '3px solid transparent',
              color: selectedTab === 0 ? '#FFFFFF' : '#A8A8A8',
              fontSize: 14,
              fontWeight: selectedTab === 0 ? 700 : 400,
              cursor: 'pointer'
            }}
          >
            Profile & Header
          </button>
          <button
            onClick={() => setSelectedTab(1)}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: selectedTab === 1 ? '3px solid #0095F6' : '3px solid transparent',
              color: selectedTab === 1 ? '#FFFFFF' : '#A8A8A8',
              fontSize: 14,
              fontWeight: selectedTab === 1 ? 700 : 400,
              cursor: 'pointer'
            }}
          >
            Chat Messages ({messagesList.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '16px 16px 40px 16px', maxWidth: 640, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {selectedTab === 0 ? (
          /* ================= TAB 0: PROFILE & HEADER ================= */
          <div>
            <h3 style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, margin: '0 0 12px 0' }}>
              User Identity & Follower Details
            </h3>

            {/* Full Name */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                Full Name (Shown in Top Bar & Header)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Username / Handle */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                Username / Handle
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Joined Date */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                Joined Date
              </label>
              <input
                type="text"
                value={joinedDate}
                onChange={(e) => setJoinedDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Followers, Posts, Following counts */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                  Followers
                </label>
                <input
                  type="text"
                  value={followersCount}
                  onChange={(e) => setFollowersCount(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                  Posts
                </label>
                <input
                  type="text"
                  value={postsCount}
                  onChange={(e) => setPostsCount(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                  Following
                </label>
                <input
                  type="text"
                  value={followingCount}
                  onChange={(e) => setFollowingCount(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Follows You badge text */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                Follow Status Badge Text
              </label>
              <input
                type="text"
                value={followsYouText}
                onChange={(e) => setFollowsYouText(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Mutual follow text */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                Mutual Follow Text
              </label>
              <input
                type="text"
                value={mutualFollowText}
                onChange={(e) => setMutualFollowText(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Profile Bio */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                Profile Bio Description
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                style={{ ...inputStyle, height: 'auto', padding: 10 }}
              />
            </div>

            {/* Chat timestamp */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                Conversation Centered Timestamp
              </label>
              <input
                type="text"
                value={chatTimestamp}
                onChange={(e) => setChatTimestamp(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Profile Picture */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: '#FFFFFF', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                Profile Picture (Round DP)
              </label>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%',
                  height: 44,
                  borderRadius: 10,
                  backgroundColor: '#262626',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  marginBottom: 10
                }}
              >
                <GalleryIcon size={20} color="#0095F6" />
                <span>Upload Custom DP from Gallery</span>
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                {availableAvatars.map((opt) => {
                  const isSelected = avatarName === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setAvatarName(opt.id)}
                      style={{
                        flex: 1,
                        backgroundColor: '#121212',
                        borderRadius: 10,
                        padding: '10px 6px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #0095F6' : '1px solid #262626'
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          margin: '0 auto 6px auto'
                        }}
                      >
                        <img
                          src={opt.url}
                          alt={opt.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div
                        style={{
                          color: isSelected ? '#0095F6' : '#FFFFFF',
                          fontSize: 11,
                          fontWeight: isSelected ? 700 : 400
                        }}
                      >
                        {opt.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Switches: Auto Reply & Block */}
            <div
              style={{
                backgroundColor: '#121212',
                borderRadius: 12,
                padding: '14px 16px',
                border: '1px solid #1A1A1A',
                marginBottom: 24
              }}
            >
              {/* Auto Reply toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 12,
                  borderBottom: '1px solid #1A1A1A'
                }}
              >
                <div>
                  <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>
                    Auto Reply from User
                  </div>
                  <div style={{ color: '#A8A8A8', fontSize: 12 }}>
                    Simulate intelligent replies when you message
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoReplyEnabled}
                  onChange={(e) => setAutoReplyEnabled(e.target.checked)}
                  style={{ width: 20, height: 20, accentColor: '#0095F6', cursor: 'pointer' }}
                />
              </div>

              {/* Block toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 12
                }}
              >
                <div>
                  <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>
                    Block {handle}
                  </div>
                  <div style={{ color: '#A8A8A8', fontSize: 12 }}>
                    Toggle block status in DM interface
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isBlocked}
                  onChange={(e) => setIsBlocked(e.target.checked)}
                  style={{ width: 20, height: 20, accentColor: '#ED4956', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Save Profile Button */}
            <button
              onClick={handleSaveProfile}
              style={{
                width: '100%',
                height: 48,
                backgroundColor: '#0095F6',
                color: '#FFFFFF',
                borderRadius: 10,
                border: 'none',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Save & Apply to DM
            </button>
          </div>
        ) : (
          /* ================= TAB 1: CHAT MESSAGES MANAGER ================= */
          <div>
            <h3 style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, margin: '0 0 12px 0' }}>
              Add Custom Message into DM
            </h3>

            {/* Add message card */}
            <form
              onSubmit={handleAddCustomMessage}
              style={{
                backgroundColor: '#121212',
                borderRadius: 12,
                padding: 16,
                border: '1px solid #1A1A1A',
                marginBottom: 24
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 6 }}>
                  Sender
                </label>
                <div style={{ display: 'flex', gap: 20 }}>
                  <label style={{ color: '#FFFFFF', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="radio"
                      checked={newMsgIsMe}
                      onChange={() => setNewMsgIsMe(true)}
                      style={{ accentColor: '#8A3FFC' }}
                    />
                    Me (You - Gradient)
                  </label>
                  <label style={{ color: '#FFFFFF', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="radio"
                      checked={!newMsgIsMe}
                      onChange={() => setNewMsgIsMe(false)}
                      style={{ accentColor: '#0095F6' }}
                    />
                    Sahil Sk (Dark)
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                  Message Text
                </label>
                <input
                  type="text"
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  placeholder="Enter message..."
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                  Timestamp
                </label>
                <input
                  type="text"
                  value={newMsgTimestamp}
                  onChange={(e) => setNewMsgTimestamp(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 6 }}>
                  Aesthetic Lyrics Theme / Overlay:
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {themes.map((thm) => {
                    const isSelected = newMsgTheme === thm.key;
                    return (
                      <button
                        key={thm.key}
                        type="button"
                        onClick={() => setNewMsgTheme(thm.key)}
                        style={{
                          borderRadius: 8,
                          backgroundColor: isSelected ? '#0095F6' : '#262626',
                          color: isSelected ? '#FFFFFF' : '#A8A8A8',
                          border: 'none',
                          padding: '6px 10px',
                          fontSize: 11,
                          fontWeight: isSelected ? 700 : 400,
                          cursor: 'pointer'
                        }}
                      >
                        {thm.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  height: 42,
                  backgroundColor: '#0095F6',
                  color: '#FFFFFF',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer'
                }}
              >
                <PlusIcon size={18} color="#FFFFFF" />
                <span>Add to Conversation</span>
              </button>
            </form>

            {/* Existing messages list */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12
              }}
            >
              <h4 style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, margin: 0 }}>
                Existing Messages ({messagesList.length})
              </h4>
              {messagesList.length > 0 && (
                <button
                  onClick={() => setShowClearDialog(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ED4956',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {messagesList.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    backgroundColor: '#121212',
                    borderRadius: 10,
                    padding: 12,
                    border: '1px solid #1A1A1A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: msg.isFromMe ? '#8A3FFC' : '#0095F6',
                        display: 'inline-block',
                        marginRight: 10,
                        flexShrink: 0
                      }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            color: msg.isFromMe ? '#8A3FFC' : '#0095F6',
                            fontSize: 12,
                            fontWeight: 700
                          }}
                        >
                          {msg.isFromMe ? 'You (Me)' : name}
                        </span>
                        <span style={{ color: '#8E8E93', fontSize: 11 }}>
                          {msg.timestamp}
                        </span>
                        {msg.theme && msg.theme !== 'CLASSIC' && (
                          <span
                            style={{
                              backgroundColor: 'rgba(0, 149, 246, 0.2)',
                              color: '#0095F6',
                              fontSize: 10,
                              padding: '1px 6px',
                              borderRadius: 4
                            }}
                          >
                            {msg.theme}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          color: '#FFFFFF',
                          fontSize: 13,
                          marginTop: 3,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {msg.text || `[${msg.type}]`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
                    <button
                      onClick={() => openEditMessage(msg)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        padding: 6
                      }}
                    >
                      <EditIcon size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ED4956',
                        cursor: 'pointer',
                        padding: 6
                      }}
                    >
                      <DeleteIcon size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editing Dialog */}
      {editingMsgId && (
        <div
          onClick={() => setEditingMsgId(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 400,
              backgroundColor: '#121212',
              borderRadius: 14,
              padding: 20,
              boxSizing: 'border-box'
            }}
          >
            <h3 style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, margin: '0 0 14px 0' }}>
              Edit Message
            </h3>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                Message Text
              </label>
              <textarea
                value={editingMsgText}
                onChange={(e) => setEditingMsgText(e.target.value)}
                rows={3}
                style={{ ...inputStyle, height: 'auto', padding: 10 }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                Timestamp
              </label>
              <input
                type="text"
                value={editingMsgTimestamp}
                onChange={(e) => setEditingMsgTimestamp(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 4 }}>
                Sender
              </label>
              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ color: '#FFFFFF', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="radio"
                    checked={editingMsgIsMe}
                    onChange={() => setEditingMsgIsMe(true)}
                    style={{ accentColor: '#8A3FFC' }}
                  />
                  Me
                </label>
                <label style={{ color: '#FFFFFF', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="radio"
                    checked={!editingMsgIsMe}
                    onChange={() => setEditingMsgIsMe(false)}
                    style={{ accentColor: '#0095F6' }}
                  />
                  Sahil Sk
                </label>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#A8A8A8', fontSize: 12, marginBottom: 6 }}>
                Theme Overlay
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {themes.map((thm) => (
                  <button
                    key={thm.key}
                    type="button"
                    onClick={() => setEditingMsgTheme(thm.key)}
                    style={{
                      borderRadius: 8,
                      backgroundColor: editingMsgTheme === thm.key ? '#0095F6' : '#262626',
                      color: editingMsgTheme === thm.key ? '#FFFFFF' : '#A8A8A8',
                      border: 'none',
                      padding: '6px 10px',
                      fontSize: 11,
                      fontWeight: editingMsgTheme === thm.key ? 700 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    {thm.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setEditingMsgId(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A8A8A8',
                  padding: '8px 16px',
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveEditedMessage}
                style={{
                  backgroundColor: '#0095F6',
                  color: '#FFFFFF',
                  borderRadius: 8,
                  border: 'none',
                  padding: '8px 18px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Chat Confirmation Dialog */}
      {showClearDialog && (
        <ClearChatModal
          handle={handle}
          onConfirmClear={onClearAllMessages}
          onDismiss={() => setShowClearDialog(false)}
        />
      )}
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 42,
  borderRadius: 8,
  backgroundColor: '#262626',
  border: '1px solid #333',
  color: '#FFFFFF',
  padding: '0 12px',
  fontSize: 14,
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit'
};
