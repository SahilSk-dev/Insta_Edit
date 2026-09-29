"""
=============================================================================
   🚀 LIVE CODE AUTO-TYPER (CALM & SMOOTH REALISTIC ENGINE)
   
   ⌨️ GLOBAL SHORTCUTS:
      • Ctrl + Shift + 1 / F6  ➔  START / NEXT STEP (Types current step)
      • ESC / Ctrl + Shift + 2 / F8 ➔  STOP (Instantly stops typing in < 1ms)
      • Ctrl + Shift + 3 / F7  ➔  RESTART (Resets back to Step 1 for re-recording)
      • F9  ➔  SLOWER (আরও আস্তে)
      • F10 ➔  FASTER (আরও দ্রুত)
      • F12 / Ctrl + Shift + Q ➔  EXIT SCRIPT (Completely close program)
=============================================================================
"""

import time
import sys
import os
import random
import threading
import ctypes

try:
    import pyautogui
    import pyperclip
    import keyboard
    from colorama import init, Fore, Style
    import winsound
    init(autoreset=True)
except ImportError:
    print("Required packages missing. Installing...")
    os.system("pip install pyautogui pyperclip keyboard colorama")
    import pyautogui
    import pyperclip
    import keyboard
    from colorama import init, Fore, Style
    import winsound
    init(autoreset=True)

pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.001

current_step = 0
is_typing = False
stop_requested = False
current_speed_level = 1  # 1 = Calm/Slow (Recommended - Zero Hang), 2 = Medium, 3 = Fast
typing_lock = threading.Lock()

def beep(frequency=1000, duration=150):
    """Play system sound alert on Windows."""
    try:
        winsound.Beep(frequency, duration)
    except Exception:
        pass

def is_stop_key_pressed():
    """
    Direct hardware check via Windows kernel API with zero latency:
    - ESC key (VK_ESCAPE = 0x1B)
    - F8 key (VK_F8 = 0x77)
    - Ctrl + Shift + 2 (VK_CONTROL 0x11, VK_SHIFT 0x10, '2' 0x32 / numpad 0x62)
    - Ctrl + 2
    """
    try:
        # ESC key
        if ctypes.windll.user32.GetAsyncKeyState(0x1B) & 0x8000:
            return True
        # F8 key
        if ctypes.windll.user32.GetAsyncKeyState(0x77) & 0x8000:
            return True
        # Ctrl + Shift + 2 or Ctrl + 2
        ctrl = bool(ctypes.windll.user32.GetAsyncKeyState(0x11) & 0x8000)
        two = bool((ctypes.windll.user32.GetAsyncKeyState(0x32) & 0x8000) or (ctypes.windll.user32.GetAsyncKeyState(0x62) & 0x8000))
        if ctrl and two:
            return True
    except Exception:
        pass
    return False

def is_exit_key_pressed():
    """Direct hardware check to completely close the script."""
    try:
        # F12 key (VK_F12 = 0x7B)
        if ctypes.windll.user32.GetAsyncKeyState(0x7B) & 0x8000:
            return True
        # Ctrl + Shift + Q
        ctrl = bool(ctypes.windll.user32.GetAsyncKeyState(0x11) & 0x8000)
        shift = bool(ctypes.windll.user32.GetAsyncKeyState(0x10) & 0x8000)
        q_key = bool(ctypes.windll.user32.GetAsyncKeyState(0x51) & 0x8000)
        if ctrl and shift and q_key:
            return True
    except Exception:
        pass
    return False

def sleep_with_stop_check(duration_sec):
    """Micro-sleep with sub-millisecond hardware abort checks."""
    global stop_requested
    start = time.perf_counter()
    while time.perf_counter() - start < duration_sec:
        if stop_requested or is_stop_key_pressed():
            stop_requested = True
            return True
        time.sleep(0.001)
    return False

def type_text_humanlike(text):
    """
    Calm, smooth, human-like typing.
    Never hangs VS Code / IDE.
    Sub-millisecond abort on ESC.
    """
    global stop_requested, current_speed_level
    
    # Speed Profiles
    if current_speed_level == 1:
        # Level 1: Calm & Relaxed (Zero Lag, Silky Smooth, ~45 WPM)
        char_delay = 0.042
        space_delay = 0.055
        line_delay = 0.160
    elif current_speed_level == 2:
        # Level 2: Moderate (~70 WPM)
        char_delay = 0.025
        space_delay = 0.035
        line_delay = 0.090
    else:
        # Level 3: Brisk (~100 WPM)
        char_delay = 0.015
        space_delay = 0.020
        line_delay = 0.050

    for char in text:
        if stop_requested or is_stop_key_pressed():
            stop_requested = True
            break
        
        # Direct native Windows Unicode key event
        keyboard.write(char)
        
        if char == '\n':
            if sleep_with_stop_check(line_delay + random.uniform(0.005, 0.020)):
                break
        elif char in ' \t':
            if sleep_with_stop_check(space_delay + random.uniform(0.003, 0.012)):
                break
        elif char in '.,;{}:<>"\'=()[]-+/':
            if sleep_with_stop_check(char_delay * 1.35 + random.uniform(0.004, 0.015)):
                break
        else:
            delay = char_delay + random.uniform(-0.004, 0.006)
            if sleep_with_stop_check(max(0.012, delay)):
                break

# =============================================================================
# 100% EXACT VERBATIM SLICES FROM index.html (11 STEPS)
# =============================================================================

# STEP 1: Head, All Styles, Phone Chassis & Waterdrop Notch
STEP_1 = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instagram Aesthetic Chat - Ghost Theory 2 Edition</title>
  
  <!-- Custom Font: Ghost Theory 2 -->
  <style>
    @font-face {
      font-family: 'Ghost Theory 2';
      src: url('Ghost_theory_2.ttf') format('truetype'),
           url('file:///C:/Users/sahil/Downloads/Fonts/Ghost%20theory%202.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  </style>

  <!-- Google Fonts Fallbacks -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Outfit:wght@300;400;500;600&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">

  <style>
    /* ==========================================================================
       1. GLOBAL RESET & AMBIENT BACKDROP
       ========================================================================== */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background: radial-gradient(circle at center, #0f121d 0%, #06070a 60%, #020204 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #ffffff;
      padding: 20px 10px;
      overflow-x: hidden;
    }

    /* Ambient dynamic glow in background */
    .ambient-glow {
      position: fixed;
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(255, 0, 110, 0.16) 0%, rgba(0, 240, 255, 0.12) 35%, transparent 70%);
      filter: blur(90px);
      z-index: 0;
      pointer-events: none;
      animation: ambientFloat 9s ease-in-out infinite alternate;
    }

    @keyframes ambientFloat {
      0% { transform: scale(0.9) translate(-30px, -20px); opacity: 0.6; }
      100% { transform: scale(1.15) translate(30px, 20px); opacity: 1; }
    }

    /* ==========================================================================
       2. REALISTIC SMARTPHONE CHASSIS (WATERDROP NOTCH 1080x2200+ RATIO)
       ========================================================================== */
    .phone-wrapper {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .phone-chassis {
      position: relative;
      width: 410px;
      height: 880px;
      background: #000000;
      border-radius: 46px;
      box-shadow: 
        0 0 0 3px #2d303a,
        0 0 0 6px #12141a,
        0 25px 65px rgba(0, 0, 0, 0.95),
        0 0 45px rgba(0, 229, 255, 0.18);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 3px solid #1c1e24;
    }

    /* Side Power & Volume Buttons */
    .phone-chassis::before {
      content: '';
      position: absolute;
      right: -7px;
      top: 170px;
      width: 3.5px;
      height: 50px;
      background: #3f434d;
      border-radius: 0 4px 4px 0;
    }

    .phone-chassis::after {
      content: '';
      position: absolute;
      right: -7px;
      top: 240px;
      width: 3.5px;
      height: 85px;
      background: #3f434d;
      border-radius: 0 4px 4px 0;
    }

    /* Waterdrop / Teardrop Notch */
    .waterdrop-notch {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 56px;
      height: 25px;
      background: #000000;
      border-bottom-left-radius: 18px;
      border-bottom-right-radius: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    }

    .camera-lens {
      width: 11px;
      height: 11px;
      background: #0c1017;
      border-radius: 50%;
      border: 1.5px solid #1f2838;
      box-shadow: inset 0 0 3px #00f0ff;
      margin-bottom: 2px;
    }

    /* ==========================================================================
       3. INSTAGRAM CHAT HEADER
       ========================================================================== */
    .chat-header {
      order: 1;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 16px 8px 16px;
      background: #000000;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      z-index: 15;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .back-btn {
      background: none;
      border: none;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 2px;
    }

    .header-user {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }

    .header-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .header-info {
      display: flex;
      flex-direction: column;
    }

    .header-name-row {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .header-name {
      font-family: 'Ghost Theory 2', 'Cinzel', serif;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.8px;
    }

    .header-arrow {
      width: 11px;
      height: 11px;
      stroke: #8e8e93;
      stroke-width: 2.5;
    }

    .header-handle {
      font-size: 11px;
      color: #8e8e93;
      letter-spacing: 0.4px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .action-icon {
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: transform 0.2s ease, color 0.2s ease;
    }

    .action-icon:hover {
      transform: scale(1.12);
      color: #00e5ff;
    }

    /* ==========================================================================
       4. CHAT BODY & CENTER PROFILE CARD
       ========================================================================== */
    .chat-body {
      order: 2;
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 20px 14px 14px 14px;
      display: flex;
      flex-direction: column;
      background: #000000;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .chat-body::-webkit-scrollbar {
      display: none;
      width: 0px;
      height: 0px;
    }

    .center-profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 20px;
      padding: 8px 0;
    }

    .profile-photo-wrapper {
      position: relative;
      width: 98px;
      height: 98px;
      margin-bottom: 12px;
    }

    .center-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 0 25px rgba(255, 255, 255, 0.12);
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .center-name {
      font-family: 'Ghost Theory 2', 'Cinzel', serif;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    .center-subtext {
      font-size: 13px;
      color: #a8a8a8;
      margin-bottom: 4px;
    }

    .center-stats {
      font-size: 12px;
      color: #8e8e8e;
      margin-bottom: 6px;
    }

    .center-mutual {
      font-size: 12px;
      color: #8e8e8e;
      margin-bottom: 15px;
      max-width: 290px;
      line-height: 1.4;
    }

    .view-profile-btn {
      background: #262626;
      color: #ffffff;
      border: none;
      padding: 7px 22px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      letter-spacing: 0.3px;
    }

    .view-profile-btn:hover {
      background: #363636;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(255, 255, 255, 0.12);
    }

    .timestamp {
      text-align: center;
      font-size: 11px;
      color: #737373;
      margin: 14px 0 20px 0;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    /* ==========================================================================
       5. NEON GLOWING CHAT BUBBLES ("JOLJOL" ENGINE WITH GHOST THEORY 2)
       ========================================================================== */
    .messages-list {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 13px;
      padding-bottom: 15px;
      width: 100%;
    }

    .neon-bubble {
      position: relative;
      display: inline-flex;
      align-items: center;
      padding: 9px 18px;
      border-radius: 22px;
      background: #000000;
      border: 1.8px solid var(--neon-color);
      box-shadow: 
        0 0 8px var(--neon-color),
        0 0 18px var(--neon-glow),
        inset 0 0 6px var(--neon-glow);
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      animation: neonPulse 3s infinite alternate ease-in-out;
      user-select: none;
      max-width: 85%;
    }

    .neon-bubble:hover {
      transform: scale(1.04) translateY(-2px);
      box-shadow: 
        0 0 15px var(--neon-color),
        0 0 32px var(--neon-color),
        0 0 48px var(--neon-glow),
        inset 0 0 10px var(--neon-color);
    }

    /* Bubble Text with Ghost Theory 2 Font */
    .bubble-text {
      font-family: 'Ghost Theory 2', 'Playfair Display', serif;
      font-size: 16px;
      font-weight: normal;
      color: #ffffff;
      letter-spacing: 0.8px;
      display: flex;
      align-items: center;
      gap: 6px;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
    }

    /* Floating Corner Accents */
    .deco-corner {
      position: absolute;
      font-size: 13px;
      pointer-events: none;
      display: inline-block;
      filter: drop-shadow(0 0 7px var(--neon-color));
      animation: floatJoljol 2.5s infinite ease-in-out alternate;
    }

    .deco-tl { top: -9px; left: -7px; animation-delay: 0.1s; }
    .deco-tr { top: -9px; right: -7px; animation-delay: 0.4s; }
    .deco-bl { bottom: -9px; left: -7px; animation-delay: 0.7s; }
    .deco-br { bottom: -9px; right: -7px; animation-delay: 1.0s; }

    /* Corner Sparkle Dots */
    .corner-sparkle {
      position: absolute;
      width: 5px;
      height: 5px;
      background: #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 8px #ffffff, 0 0 14px var(--neon-color);
      animation: sparkleTwinkle 1.8s infinite alternate ease-in-out;
    }

    .sp-tl { top: -2px; left: -2px; }
    .sp-br { bottom: -2px; right: -2px; animation-delay: 0.9s; }

    /* Theme Presets (Colors from Screenshot) */
    .theme-pink {
      --neon-color: #ff2a7a;
      --neon-glow: rgba(255, 42, 122, 0.5);
    }
    .theme-cyan {
      --neon-color: #00e5ff;
      --neon-glow: rgba(0, 229, 255, 0.5);
    }
    .theme-gold {
      --neon-color: #ffd60a;
      --neon-glow: rgba(255, 214, 10, 0.5);
    }
    .theme-ruby {
      --neon-color: #ff0055;
      --neon-glow: rgba(255, 0, 85, 0.5);
    }
    .theme-purple {
      --neon-color: #a855f7;
      --neon-glow: rgba(168, 85, 247, 0.5);
    }
    .theme-teal {
      --neon-color: #06d6a0;
      --neon-glow: rgba(6, 214, 160, 0.5);
    }

    /* Keyframe Animations */
    @keyframes neonPulse {
      0% {
        box-shadow: 0 0 6px var(--neon-color), 0 0 14px var(--neon-glow), inset 0 0 4px var(--neon-glow);
        border-color: var(--neon-color);
      }
      50% {
        box-shadow: 0 0 14px var(--neon-color), 0 0 28px var(--neon-color), 0 0 38px var(--neon-glow), inset 0 0 8px var(--neon-color);
      }
      100% {
        box-shadow: 0 0 8px var(--neon-color), 0 0 16px var(--neon-glow), inset 0 0 5px var(--neon-glow);
        border-color: var(--neon-color);
      }
    }

    @keyframes floatJoljol {
      0% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 0.85; }
      50% { transform: translateY(-4px) scale(1.18) rotate(8deg); opacity: 1; filter: drop-shadow(0 0 10px var(--neon-color)); }
      100% { transform: translateY(1px) scale(0.95) rotate(-5deg); opacity: 0.9; }
    }

    @keyframes sparkleTwinkle {
      0% { opacity: 0.3; transform: scale(0.6); }
      100% { opacity: 1; transform: scale(1.4); }
    }

    /* ==========================================================================
       6. BOTTOM MESSAGE BAR
       ========================================================================== */
    .chat-footer {
      order: 3;
      height: 72px;
      padding: 10px 16px 18px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #000000;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      z-index: 20;
    }

    .camera-circle-btn {
      width: 42px;
      height: 42px;
      min-width: 42px;
      border-radius: 50%;
      background: #0095f6;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      cursor: pointer;
      box-shadow: 0 0 12px rgba(0, 149, 246, 0.45);
      transition: transform 0.2s ease;
    }

    .camera-circle-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 0 20px rgba(0, 149, 246, 0.7);
    }

    .input-pill {
      flex: 1;
      height: 44px;
      background: #1c1c1e;
      border-radius: 24px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      justify-content: space-between;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .input-pill input {
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 14px;
      width: 100%;
      font-family: inherit;
    }

    .input-pill input::placeholder {
      color: #8e8e93;
    }

    .input-icons-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .input-icon-btn {
      background: none;
      border: none;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: transform 0.2s ease;
    }

    .input-icon-btn:hover {
      transform: scale(1.15);
      color: #00e5ff;
    }

    @media (max-height: 920px) {
      body { padding: 5px; }
      .phone-chassis { height: 96vh; max-height: 860px; }
    }
  </style>
</head>
<body>

  <!-- Ambient Glow -->
  <div class="ambient-glow"></div>

  <!-- Virtual Mobile Frame -->
  <div class="phone-wrapper">
    <div class="phone-chassis">

      <!-- Waterdrop / Teardrop Notch -->
      <div class="waterdrop-notch">
        <div class="camera-lens"></div>
      </div>
"""

# STEP 2: Top Profile Header Bar with Clean Vector SVGs
STEP_2 = """
      <!-- 1. Instagram Header Bar -->
      <header class="chat-header">
        <div class="header-left">
          <button class="back-btn" aria-label="Back">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div class="header-user">
            <img src="Image.png" alt="Avatar" class="header-avatar" onerror="this.src='file:///C:/Users/sahil/Downloads/Images/Image.png';">
            <div class="header-info">
              <div class="header-name-row">
                <span class="header-name">Unknown</span>
                <svg class="header-arrow" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="header-handle">unknown</span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <!-- Call -->
          <div class="action-icon">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <!-- Video -->
          <div class="action-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="14" height="16" rx="3"/>
              <path d="M16 10l6-4v12l-6-4"/>
            </svg>
          </div>
          <!-- Info -->
          <div class="action-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
        </div>
      </header>
"""

# STEP 3: Bottom Message Bar with Clean Vector SVGs
STEP_3 = """
      <!-- 3. Bottom Message Input Bar -->
      <footer class="chat-footer">
        <button class="camera-circle-btn" aria-label="Camera">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>

        <div class="input-pill">
          <input type="text" placeholder="Message..." id="msgInput">
          <div class="input-icons-right">
            <!-- Mic Icon -->
            <button class="input-icon-btn" aria-label="Microphone">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
            <!-- Gallery Icon -->
            <button class="input-icon-btn" aria-label="Gallery">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </button>
            <!-- Sticker Icon -->
            <button class="input-icon-btn" aria-label="Stickers">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>
"""

# STEP 4: Center Profile Section
STEP_4 = """
      <!-- 2. Chat Body with Profile & Neon Messages -->
      <main class="chat-body" id="chatContainer">
        
        <!-- Center Profile Card -->
        <section class="center-profile">
          <div class="profile-photo-wrapper">
            <img src="Image.png" alt="Profile Large" class="center-avatar" onerror="this.src='file:///C:/Users/sahil/Downloads/Images/Image.png';">
          </div>
          <h2 class="center-name">Unknown</h2>
          <p class="center-subtext">unknown • Instagram</p>
          <p class="center-stats">108 followers • 1 post</p>
          <p class="center-mutual">You both follow <b>__broken__heart__019</b></p>
          <button class="view-profile-btn">View profile</button>
        </section>
"""

# STEP 5: Timestamp (8:12 PM)
STEP_5 = """
        <!-- Timestamp -->
        <div class="timestamp">8:12 PM</div>

        <!-- Neon Glowing Chat Messages List (Ghost Theory 2) -->
        <div class="messages-list">
"""

# STEP 6: 1st Single Bubble (You 🫰)
STEP_6 = """
          <!-- 1. You 🫰 (Hot Pink Neon + Corner Hearts) -->
          <div class="neon-bubble theme-pink">
            <span class="deco-corner deco-tl">💖</span>
            <span class="deco-corner deco-br">💕</span>
            <span class="bubble-text">You 🫰</span>
          </div>
"""

# STEP 7: Next 2 Bubbles (and I 🥰, Don't Say 💬)
STEP_7 = """
          <!-- 2. and I 🥰 (Cyber Cyan + Corner Butterflies) -->
          <div class="neon-bubble theme-cyan">
            <span class="deco-corner deco-tr">🦋</span>
            <span class="deco-corner deco-bl">🦋</span>
            <span class="bubble-text">and I 🥰</span>
          </div>

          <!-- 3. Don't Say 💬 (Teal Neon + Twinkle Stars) -->
          <div class="neon-bubble theme-teal">
            <span class="corner-sparkle sp-tl"></span>
            <span class="deco-corner deco-tr">✨</span>
            <span class="bubble-text">Don't Say 💬</span>
          </div>
"""

# STEP 8: Next 3 Bubbles (Good bye 👏, All we 🥀, Need It)
STEP_8 = """
          <!-- 4. Good bye 👏 (Golden Glow + Sparks) -->
          <div class="neon-bubble theme-gold">
            <span class="corner-sparkle sp-tl"></span>
            <span class="corner-sparkle sp-br"></span>
            <span class="bubble-text">Good bye 👏</span>
          </div>

          <!-- 5. All we 🥀 (Ruby Pink + Rose) -->
          <div class="neon-bubble theme-ruby">
            <span class="deco-corner deco-bl">🥀</span>
            <span class="bubble-text">All we 🥀</span>
          </div>

          <!-- 6. Need It (Purple Glow + Butterfly) -->
          <div class="neon-bubble theme-purple">
            <span class="deco-corner deco-tr">🦋</span>
            <span class="deco-corner deco-bl">🦋</span>
            <span class="bubble-text">Need It</span>
          </div>
"""

# STEP 9: Next 3 Bubbles (One Night In Dubai, Close your, Eyes)
STEP_9 = """
          <!-- 7. One Night In Dubai (Cyan Glow + Sparkles) -->
          <div class="neon-bubble theme-cyan">
            <span class="corner-sparkle sp-tl"></span>
            <span class="deco-corner deco-br">✨</span>
            <span class="bubble-text">One Night In Dubai</span>
          </div>

          <!-- 8. Close your (Gold Glow + Corner Star) -->
          <div class="neon-bubble theme-gold">
            <span class="corner-sparkle sp-tl"></span>
            <span class="corner-sparkle sp-br"></span>
            <span class="bubble-text">Close your</span>
          </div>

          <!-- 9. Eyes (Hot Pink + Hearts) -->
          <div class="neon-bubble theme-pink">
            <span class="deco-corner deco-tr">💖</span>
            <span class="deco-corner deco-bl">💕</span>
            <span class="bubble-text">Eyes</span>
          </div>
"""

# STEP 10: Next 3 Bubbles (Ending, The light, All We)
STEP_10 = """
          <!-- 10. Ending (Cyber Cyan + Butterfly) -->
          <div class="neon-bubble theme-cyan">
            <span class="deco-corner deco-bl">🦋</span>
            <span class="bubble-text">Ending</span>
          </div>

          <!-- 11. The light (Teal + Stars) -->
          <div class="neon-bubble theme-teal">
            <span class="corner-sparkle sp-tl"></span>
            <span class="corner-sparkle sp-br"></span>
            <span class="bubble-text">The light</span>
          </div>

          <!-- 12. All We (Sun Gold + Sparks) -->
          <div class="neon-bubble theme-gold">
            <span class="corner-sparkle sp-tl"></span>
            <span class="deco-corner deco-tr">✨</span>
            <span class="bubble-text">All We</span>
          </div>
"""

# STEP 11: Final 3 Bubbles (Need Is, One Night In, Dubai) & Closing Scripts
STEP_11 = """
          <!-- 13. Need Is (Ruby Pink + Mini Hearts) -->
          <div class="neon-bubble theme-ruby">
            <span class="deco-corner deco-tr">💖</span>
            <span class="bubble-text">Need Is</span>
          </div>

          <!-- 14. One Night In (Electric Cyan + Butterfly) -->
          <div class="neon-bubble theme-cyan">
            <span class="deco-corner deco-bl">🦋</span>
            <span class="bubble-text">One Night In</span>
          </div>

          <!-- 15. Dubai (Cyan Teal + Star) -->
          <div class="neon-bubble theme-teal">
            <span class="corner-sparkle sp-tl"></span>
            <span class="corner-sparkle sp-br"></span>
            <span class="bubble-text">Dubai</span>
          </div>

        </div>
      </main>

    </div>
  </div>

  <script>
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Interactive Bubble Burst Glow Effect
    const bubbles = document.querySelectorAll('.neon-bubble');
    bubbles.forEach(bubble => {
      bubble.addEventListener('click', () => {
        bubble.style.transform = 'scale(1.12) translateY(-4px)';
        bubble.style.filter = 'brightness(1.4)';
        setTimeout(() => {
          bubble.style.transform = '';
          bubble.style.filter = '';
        }, 300);
      });
    });
  </script>
</body>
</html>
"""

PARTS = [
    ("Step 1: Empty Mobile Frame (Waterdrop Notch & Master CSS)", STEP_1),
    ("Step 2: Top Profile Header Bar (Official Vector SVGs)", STEP_2),
    ("Step 3: Bottom Message Bar (Camera, Input & Icons)", STEP_3),
    ("Step 4: Center Profile Section (Large Avatar & Stats)", STEP_4),
    ("Step 5: Chat Timestamp (8:12 PM)", STEP_5),
    ("Step 6: First Single Bubble ('You 🫰')", STEP_6),
    ("Step 7: Two Bubbles Together ('and I 🥰', 'Don't Say 💬')", STEP_7),
    ("Step 8: Three Bubbles ('Good bye 👏', 'All we 🥀', 'Need It')", STEP_8),
    ("Step 9: Three Bubbles ('One Night In Dubai', 'Close your', 'Eyes')", STEP_9),
    ("Step 10: Three Bubbles ('Ending', 'The light', 'All We')", STEP_10),
    ("Step 11: Final Three Bubbles ('Need Is', 'One Night In', 'Dubai') & Complete", STEP_11),
]

# Set Default to Word-by-Word Engine (Zero IDE Freeze!)
typing_mode = "word"
word_delay_setting = 0.025  # Smooth, natural word cadence
line_delay_setting = 0.045  # Clean line break pause

def execute_step():
    """Worker function to type current step in background."""
    global current_step, is_typing, stop_requested, current_speed_level

    with typing_lock:
        if current_step >= len(PARTS):
            print(Fore.GREEN + "\n🎉 All 11 Steps are already completed! Press Ctrl+Shift+3 to restart.\n")
            beep(1500, 200)
            is_typing = False
            return

        title, content = PARTS[current_step]
        step_num = current_step + 1

        speed_labels = {1: "1 (Calm & Smooth - Zero Lag)", 2: "2 (Medium)", 3: "3 (Brisk)"}
        current_lbl = speed_labels.get(current_speed_level, "1")

        print(Fore.YELLOW + f"\n⚡ [TYPING {step_num}/11 @ Speed {current_lbl}] ➔ {title}")
        beep(1200, 150)
        time.sleep(0.3)

        stop_requested = False
        try:
            type_text_humanlike(content)
            
            if not stop_requested:
                current_step += 1
                beep(1600, 120)
                beep(1900, 180)
                print(Fore.GREEN + f"✔️ [COMPLETED {step_num}/11] ➔ {title}")
                print(Fore.MAGENTA + f"👉 ACTION: Save file in IDE (Ctrl+S) & reload browser!")
                if current_step < len(PARTS):
                    next_title = PARTS[current_step][0]
                    print(Fore.CYAN + f"👉 Next up: [{current_step+1}/11] {next_title} (Press Ctrl+Shift+1 / F6 whenever ready)\n")
                else:
                    print(Fore.GREEN + "\n🏆 ALL 11 STEPS COMPLETED! FULL UI IS 100% READY!\n")
            else:
                print(Fore.RED + f"🛑 [{step_num}/11] Stopped prematurely by user.")
        except Exception as e:
            print(Fore.RED + f"⚠️ Error: {e}")
        finally:
            is_typing = False

def on_hotkey_start():
    global is_typing, stop_requested
    if is_typing:
        print(Fore.YELLOW + "⚠️ Typing is in progress! Press ESC or Ctrl+Shift+2 to stop.")
        return
    is_typing = True
    threading.Thread(target=execute_step, daemon=True).start()

def on_hotkey_stop():
    global stop_requested, is_typing
    stop_requested = True
    beep(500, 250)
    print(Fore.RED + "\n🛑 [STOP TRIGGERED] Typing stopped immediately.\n")

def on_hotkey_restart():
    global current_step, stop_requested, is_typing
    stop_requested = True
    time.sleep(0.15)
    current_step = 0
    is_typing = False
    beep(800, 100)
    beep(1300, 200)
    print(Fore.CYAN + "\n🔄 [RESTARTED] Reset back to Step 1 (Empty Mobile Frame).")
    print(Fore.YELLOW + "👉 Ready to record! Press Ctrl+Shift+1 (or F6) to start Step 1.\n")

def on_hotkey_slower():
    global current_speed_level
    current_speed_level = max(1, current_speed_level - 1)
    beep(600, 100)
    names = {1: "Level 1 (Calm & Relaxed - 45 WPM)", 2: "Level 2 (Medium - 70 WPM)", 3: "Level 3 (Brisk - 100 WPM)"}
    print(Fore.CYAN + f"\n🐢 SPEED REDUCED ➔ {names[current_speed_level]}\n")

def on_hotkey_faster():
    global current_speed_level
    current_speed_level = min(3, current_speed_level + 1)
    beep(1400, 100)
    names = {1: "Level 1 (Calm & Relaxed - 45 WPM)", 2: "Level 2 (Medium - 70 WPM)", 3: "Level 3 (Brisk - 100 WPM)"}
    print(Fore.GREEN + f"\n🐇 SPEED INCREASED ➔ {names[current_speed_level]}\n")

def on_exit_app():
    global stop_requested
    stop_requested = True
    print(Fore.RED + "\n👋 Exiting auto-typer. Goodbye!")
    beep(400, 150)
    os._exit(0)

def hardware_monitor_thread():
    """Continuous low-latency hardware key monitor."""
    global stop_requested, is_typing
    while True:
        try:
            if is_exit_key_pressed():
                on_exit_app()
            elif is_typing and is_stop_key_pressed():
                stop_requested = True
        except Exception:
            pass
        time.sleep(0.005)

def main():
    global current_speed_level
    
    print(Fore.MAGENTA + "==================================================================")
    print(Fore.CYAN + "   ✨ INSTAGRAM AESTHETIC CHAT - CALM & SMOOTH AUTO-TYPER ✨")
    print(Fore.MAGENTA + "==================================================================")
    print(Fore.YELLOW + "⌨️ GLOBAL SHORTCUTS:")
    print(Fore.GREEN  + "   • [Ctrl + Shift + 1] or [F6]  ➔  START / NEXT STEP")
    print(Fore.RED    + "   • [ESC] or [Ctrl + Shift + 2] ➔  STOP (Instant 0ms Stop)")
    print(Fore.CYAN   + "   • [Ctrl + Shift + 3] or [F7]  ➔  RESTART (Back to Step 1)")
    print(Fore.BLUE   + "   • [F9]                        ➔  SLOWER (আরও আস্তে টাইপ)")
    print(Fore.GREEN  + "   • [F10]                       ➔  FASTER (আরও দ্রুত টাইপ)")
    print(Fore.YELLOW + "   • [F12] or [Ctrl + Shift + Q] ➔  EXIT SCRIPT (Close Program)")
    print(Fore.MAGENTA + "==================================================================")
    print(Fore.GREEN + "🚀 DEFAULT MODE: Calm & Relaxed (Zero Lag / No IDE Freeze!)")
    print(Fore.CYAN  + "👉 Press [Ctrl + Shift + 1] (or F6) in your IDE to begin Step 1!\n")

    # Start hardware monitor daemon
    threading.Thread(target=hardware_monitor_thread, daemon=True).start()

    # Register Keyboard Library Hotkeys
    try:
        keyboard.add_hotkey('ctrl+shift+1', on_hotkey_start)
        keyboard.add_hotkey('ctrl+shift+2', on_hotkey_stop)
        keyboard.add_hotkey('ctrl+shift+3', on_hotkey_restart)
        keyboard.add_hotkey('ctrl+shift+!', on_hotkey_start)
        keyboard.add_hotkey('ctrl+shift+@', on_hotkey_stop)
        keyboard.add_hotkey('ctrl+shift+#', on_hotkey_restart)
        keyboard.add_hotkey('f6', on_hotkey_start)
        keyboard.add_hotkey('f7', on_hotkey_restart)
        keyboard.add_hotkey('f8', on_hotkey_stop)
        keyboard.add_hotkey('f9', on_hotkey_slower)
        keyboard.add_hotkey('f10', on_hotkey_faster)
        keyboard.add_hotkey('esc', on_hotkey_stop)
        keyboard.add_hotkey('f12', on_exit_app)
        keyboard.add_hotkey('ctrl+shift+q', on_exit_app)
    except Exception as e:
        print(f"Hotkey warning: {e}")

    try:
        while True:
            time.sleep(0.5)
    except KeyboardInterrupt:
        on_exit_app()

if __name__ == "__main__":
    main()

