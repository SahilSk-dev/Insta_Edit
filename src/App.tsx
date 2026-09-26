import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { initialProfileConfig, initialMessages, ProfileConfig, ChatMessage } from './config/profile.ts';
import { renderWithIOSEmojis } from './utils/emoji.tsx';

export default function App() {
  const [config, setConfig] = useState<ProfileConfig>(() => {
    const saved = localStorage.getItem('ig_dm_config');
    return saved ? JSON.parse(saved) : initialProfileConfig;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ig_dm_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [inputText, setInputText] = useState('');
  const [sendAsMe, setSendAsMe] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);

  // Long Screenshot Popup State
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Save to localStorage so edits on mobile persist
  useEffect(() => {
    localStorage.setItem('ig_dm_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('ig_dm_messages', JSON.stringify(messages));
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: sendAsMe ? 'me' : 'them'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setActiveDeleteId(null);
  };

  const getFontClass = () => {
    switch (config.activeFont) {
      case 'bonolota': return 'font-bonolota';
      case 'chirkut': return 'font-chirkut';
      case 'mahfuj': return 'font-mahfuj';
      default: return 'font-system';
    }
  };

  // Full-length (Long) Screenshot Capture Function
  const handleTakeLongScreenshot = async () => {
    if (!mainContainerRef.current) return;
    setIsCapturing(true);

    try {
      const container = mainContainerRef.current;

      // Create an off-screen clone of the entire DM container
      const clone = container.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.top = '-99999px';
      clone.style.left = '0';
      clone.style.width = `${container.clientWidth || 430}px`;
      clone.style.height = 'auto';
      clone.style.maxHeight = 'none';
      clone.style.overflow = 'visible';
      clone.style.zIndex = '-1000';

      // Expand chat body to full natural height so all messages appear without scroll clipping
      const chatBodyInClone = clone.querySelector('.dm-chat-body') as HTMLElement;
      if (chatBodyInClone) {
        chatBodyInClone.style.height = 'auto';
        chatBodyInClone.style.maxHeight = 'none';
        chatBodyInClone.style.overflow = 'visible';
      }

      // Remove any active delete badges from the screenshot
      clone.querySelectorAll('.msg-del-tap').forEach((el) => el.remove());

      document.body.appendChild(clone);

      // Render the complete full-length element to canvas at high resolution
      const canvas = await html2canvas(clone, {
        scale: 2.5, // 2.5x scale gives crisp 1080p+ mobile resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
        logging: false
      });

      document.body.removeChild(clone);

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setScreenshotUrl(dataUrl);
    } catch (err: any) {
      alert('স্ক্রিনশট তৈরিতে সমস্যা হয়েছে: ' + err.message);
    } finally {
      setIsCapturing(false);
    }
  };

  // Download Trigger
  const handleDownloadScreenshot = () => {
    if (!screenshotUrl) return;
    const link = document.createElement('a');
    link.download = `instagram_full_dm_${Date.now()}.png`;
    link.href = screenshotUrl;
    link.click();
  };

  return (
    <div className="instagram-dm-screen" ref={mainContainerRef}>
      {/* 1. Real Instagram DM Header */}
      <header className="dm-header">
        <div className="dm-header-left">
          <div className="back-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </div>
          <div className="dm-header-user" onClick={() => setShowSettings(true)}>
            <div className="header-avatar-circle">
              <img src={config.profilePicUrl} alt={config.displayName} />
            </div>
            <div className="dm-header-info">
              <span className="header-display-name">{config.displayName}</span>
              <span className="header-username">{config.username}</span>
            </div>
          </div>
        </div>

        <div className="dm-header-right">
          {/* Long Screenshot Export Icon (📸) */}
          <div
            className="header-action-icon screenshot-trigger-icon"
            onClick={handleTakeLongScreenshot}
            title="পুরো কথোপকথনের স্ক্রিনশট নিন"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>

          {/* Video Call Icon */}
          <div className="header-action-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 7l-7 5 7 5V7z"></path>
              <rect x="1" y="5" width="15" height="14" rx="3" ry="3"></rect>
            </svg>
          </div>

          {/* Tag / Info Icon (Tapping opens backend settings) */}
          <div className="header-action-icon" onClick={() => setShowSettings(true)}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <circle cx="7.5" cy="7.5" r="1.5" fill="#ffffff"></circle>
            </svg>
          </div>
        </div>
      </header>

      {/* 2. Scrollable Chat Body */}
      <main className="dm-chat-body" ref={chatBodyRef}>
        {/* Profile Card */}
        <section className="dm-profile-card">
          <div className="profile-avatar-circle" onClick={() => setShowSettings(true)}>
            <img src={config.profilePicUrl} alt={config.displayName} />
          </div>
          <h2 className="profile-name">{config.displayName}</h2>
          <div className="profile-meta">{config.username} · {config.joinedDate}</div>
          <div className="profile-stats-line">{config.followers} · {config.posts}</div>
          {config.followsYou && <div className="profile-follows-line">Follows you</div>}
          <div className="profile-mutual-line">{config.mutualFollowText}</div>

          <div className="profile-action-buttons">
            <div className="profile-action-item">
              <div className="profile-action-circle">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ffffff" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="M9 12l2 2 4-4"></path>
                </svg>
              </div>
              <span className="profile-action-label">Safety tips</span>
            </div>
            <div className="profile-action-item">
              <div className="profile-action-circle">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ffffff" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                </svg>
              </div>
              <span className="profile-action-label">Block</span>
            </div>
          </div>
        </section>

        {/* Timestamp */}
        <div className="dm-timestamp">{config.defaultTimestamp}</div>

        {/* Message Bubbles */}
        <div className="dm-messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-bubble-row ${msg.sender === 'me' ? 'sent' : 'received'}`}
              onClick={() => setActiveDeleteId(activeDeleteId === msg.id ? null : msg.id)}
            >
              <div
                className={`message-bubble ${getFontClass()}`}
                style={msg.sender === 'me' ? { background: config.bubbleColor } : {}}
              >
                {renderWithIOSEmojis(msg.text)}
              </div>
              {activeDeleteId === msg.id && (
                <button
                  className="msg-del-tap"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMessage(msg.id);
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* 3. Real Bottom Message Bar */}
      <footer className="dm-footer">
        {/* Blue Camera Button */}
        <div
          className="footer-camera-btn"
          onClick={() => setSendAsMe(!sendAsMe)}
          title={sendAsMe ? "পাঠাচ্ছেন: আপনি (ডানপাশে)" : "পাঠাচ্ছেন: অন্যজন (বামপাশে)"}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff">
            <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/>
            <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
          </svg>
        </div>

        {/* Message Input Capsule */}
        <form className="footer-input-capsule" onSubmit={handleSendMessage}>
          <input
            type="text"
            className={`footer-input-field ${getFontClass()}`}
            placeholder="Message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <div className="footer-input-actions">
            {inputText.trim() ? (
              <button type="submit" className="send-btn-active">
                Send
              </button>
            ) : (
              <>
                {/* Voice Memo / Mic */}
                <div className="footer-action-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#a8a8a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </div>
                {/* Photo / Gallery */}
                <div className="footer-action-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#a8a8a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                {/* Sticker / Smile */}
                <div className="footer-action-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#a8a8a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </div>
                {/* Plus Circle */}
                <div className="footer-action-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#a8a8a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
              </>
            )}
          </div>
        </form>
      </footer>

      {/* Loading Indicator while generating long screenshot */}
      {isCapturing && (
        <div className="capture-loading-overlay">
          <div className="capture-spinner"></div>
          <p>সম্পূর্ণ লম্বা স্ক্রিনশট তৈরি হচ্ছে...</p>
        </div>
      )}

      {/* 4. Long Screenshot Download Popup Modal */}
      {screenshotUrl && (
        <div className="screenshot-modal-overlay" onClick={() => setScreenshotUrl(null)}>
          <div className="screenshot-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="screenshot-modal-header">
              <div className="screenshot-modal-title">
                <h3>পুরো চ্যাটের স্ক্রিনশট</h3>
                <span className="screenshot-badge">Full Conversation PNG</span>
              </div>
              <button className="settings-close-btn" onClick={() => setScreenshotUrl(null)}>✕</button>
            </div>

            <div className="screenshot-preview-scroll">
              <img src={screenshotUrl} alt="Full conversation screenshot" className="screenshot-img-preview" />
            </div>

            <div className="screenshot-modal-actions">
              <button className="download-png-btn" onClick={handleDownloadScreenshot}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                ডাউনলোড করুন (HD PNG)
              </button>
              <button className="cancel-preview-btn" onClick={() => setScreenshotUrl(null)}>
                বন্ধ করুন
              </button>
            </div>
            <p className="screenshot-mobile-hint">
              📱 মোবাইলে ছবির ওপর চাপ দিয়ে ধরে রেখেও (Long press) ছবি সেভ করতে পারেন।
            </p>
          </div>
        </div>
      )}

      {/* 5. Backend Settings Drawer (Clean & Hidden) */}
      {showSettings && (
        <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h3>প্রোফাইল ও ফন্ট সেটিংস</h3>
              <button className="settings-close-btn" onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <div className="settings-field">
              <label>নাম (Display Name):</label>
              <input
                type="text"
                value={config.displayName}
                onChange={(e) => setConfig({ ...config, displayName: e.target.value })}
              />
            </div>

            <div className="settings-field">
              <label>ইউজারনেম (Username):</label>
              <input
                type="text"
                value={config.username}
                onChange={(e) => setConfig({ ...config, username: e.target.value })}
              />
            </div>

            <div className="settings-field">
              <label>ফলোয়ার ও পোস্ট:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={config.followers}
                  onChange={(e) => setConfig({ ...config, followers: e.target.value })}
                />
                <input
                  type="text"
                  value={config.posts}
                  onChange={(e) => setConfig({ ...config, posts: e.target.value })}
                />
              </div>
            </div>

            <div className="settings-field">
              <label>মিউচুয়াল লাইন (Mutual Text):</label>
              <input
                type="text"
                value={config.mutualFollowText}
                onChange={(e) => setConfig({ ...config, mutualFollowText: e.target.value })}
              />
            </div>

            <div className="settings-field">
              <label>বাংলা লিরিক্স ফন্ট:</label>
              <select
                value={config.activeFont}
                onChange={(e) => setConfig({ ...config, activeFont: e.target.value as any })}
              >
                <option value="bonolota">🌸 FL Bonolota Special Unicode</option>
                <option value="chirkut">✒️ FL Chirkut Aksharangana</option>
                <option value="mahfuj">📜 FL Mahfuj Isahak Unicode</option>
                <option value="system">📱 System / Default</option>
              </select>
            </div>

            <div className="settings-field">
              <label>বাবল কালার:</label>
              <input
                type="color"
                value={config.bubbleColor}
                onChange={(e) => setConfig({ ...config, bubbleColor: e.target.value })}
                style={{ height: '38px', padding: '2px', cursor: 'pointer' }}
              />
            </div>

            <div className="settings-field">
              <label>টাইমস্ট্যাম্প:</label>
              <input
                type="text"
                value={config.defaultTimestamp}
                onChange={(e) => setConfig({ ...config, defaultTimestamp: e.target.value })}
              />
            </div>

            <button
              className="settings-save-btn"
              onClick={() => {
                setShowSettings(false);
                handleTakeLongScreenshot();
              }}
              style={{ background: '#10b981', marginBottom: '8px' }}
            >
              📸 পুরো কথোপকথনের স্ক্রিনশট নিন
            </button>

            <button
              className="settings-save-btn"
              onClick={() => setShowSettings(false)}
            >
              সংরক্ষণ করুন ও বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
