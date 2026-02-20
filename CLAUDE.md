# CLAUDE.md

## THIS FILE IS GOLD - PRESERVE AT ALL COSTS

**THIS FILE IS THE SINGLE SOURCE OF TRUTH** - The hub that points to all knowledge for this project.

**CRITICAL PRESERVATION RULE**: If you EVER revert to a previous version of the site via git or any other method, YOU MUST PRESERVE THIS FILE. Copy it before reverting, then restore it after.

---

## DOCUMENTATION ARCHITECTURE

This project uses a **hub-and-spoke** documentation system. CLAUDE.md is the hub - it points to everything else.

### The Spoke Files

| File | Purpose | When to Read |
|------|---------|--------------|
| **CLAUDE.md** (this file) | Core SOP, rules, current status, roadmap | ALWAYS at session start |
| **HISTORY.md** | Archived action logs, completed phases | When struggling or need past context |
| **TROUBLESHOOTING.md** | Specific problem→solution pairs | When encountering errors |
| **PRD.md** | Product requirements document | When building features or need context |

### Reading Strategy at Session Start

**ALWAYS read from CLAUDE.md:**
1. This entire file (it's now lean enough)
2. The current status section
3. The action log

**READ ON DEMAND:**
- PRD.md → when building features or need product context
- HISTORY.md → only when stuck or explicitly instructed
- TROUBLESHOOTING.md → only when hitting errors

---

## HOW TO USE THIS SPEC - CRITICAL RULES

### Your Role
You are the "guy from Memento" - this file is your external memory. Without it, you know nothing. **THE USER WILL NOT REPEAT THEMSELVES.**

### Mandatory Behaviors

**ALWAYS:**
- Read this file first before any action
- Log every action in the action log below
- Ask permission before making changes (user might just be venting)
- Check `/_dropbox/` for files the user has dropped → process them, move to proper location, delete original from dropbox

**NEVER:**
- Skip documentation - even small changes must be logged
- Assume what the user wants - ask and validate
- Add external fonts (system fonts only, CRITICAL for performance)
- Add npm dependencies (zero dependencies architecture)

### What to Document Where

| Type of Information | Where to Put It |
|---------------------|-----------------|
| What you're about to do / just did | Action log in this file |
| General principle or insight | Best Practices / Anti-Patterns below |
| Specific error + solution | TROUBLESHOOTING.md |
| Old completed work | Archive to HISTORY.md |

---

## PROJECT OVERVIEW

**Eclairs** - French Phonics Flashcards for Kids

A mobile-first web app for parent-child French phonics practice. Tap to see random weighted syllables. Simple, snackable, delightful.

**See PRD.md for full product requirements.**

**Tech Stack**: Vanilla HTML/CSS/JS, zero dependencies, extreme simplicity.
**Performance Budget**: <50KB total, <10KB JS, <5KB CSS

---

## PERFORMANCE PRIORITIES (NON-NEGOTIABLE)

**EXTREME PERFORMANCE IS THE #1 PRIORITY** - This overrides "industry standard" approaches.

### Core Rules
- **System fonts ONLY** - Never external fonts (causes 200-500ms delay + CSS issues)
- **Zero dependencies** - No npm packages whatsoever
- **Minimal JavaScript** - Keep it simple
- **Semantic HTML** - Clean structure

### Quick Reference
```bash
# Local dev - just open in browser
open index.html

# Or serve locally
python -m http.server 8000
```

---

## LOGGING PROTOCOL

**EVERY ACTION MUST BE LOGGED** - Assume you might be pulled away at any moment.

### Format
```
### [DATE] ([Brief Description])
- **Claude Instance**: [Model name]
- **Action**: What you did
- **Result**: What happened
- **Status**: Current state
```

### Archiving Protocol

**When action log exceeds ~2000 words OR phase completes:**
1. Review roadmap for upcoming work
2. Identify entries complete AND unrelated to future work
3. Propose archive to user (what and why)
4. Wait for approval
5. Move to HISTORY.md with section headers
6. Keep minimum 1500 words of recent history here

---

## ACTION LOG - RECENT HISTORY

### 2025-11-25 (Project Setup & Architecture Review)
- **Claude Instance**: Claude Opus 4.5
- **Action**:
  1. Created folder structure: `/_dropbox/`, `/css/`, `/js/`
  2. Created spoke files: `HISTORY.md`, `TROUBLESHOOTING.md`
  3. Ran architect review of PRD.md
- **Architect Findings**:
  - GREEN LIGHT for vanilla HTML/CSS/JS approach
  - **Critical Issue**: Color palette fails WCAG contrast (pastels too light)
  - **Blocking Task**: Syllable frequency research needed (suggest Manulex database)
  - **Needed Fix**: Add repeat prevention (don't show same syllable twice in a row)
- **User Decisions**:
  1. **Colors**: Light pale backgrounds + soft dark text on top
  2. **Button**: Cartoon 3D style, fun to press, but smaller than the syllable text
  3. **Offline**: Deferred (not needed for MVP)
- **Status**: Ready for Phase 1 implementation

### 2025-11-25 (Syllable Research Complete)
- **Claude Instance**: Claude Opus 4.5
- **Action**: Researched French syllable frequency and created js/syllables.js
- **Sources**: MANULEX database, French CP curriculum, academic papers
- **Result**:
  - 113 unique syllables with frequency weights (5x to 1x)
  - 10 WCAG AA compliant color palettes (light bg + dark text)
  - Syllables organized by French phonics teaching blocks
- **Status**: Phase 1A complete, ready for Phase 1B (core build)

### 2025-11-25 (Core Build Complete)
- **Claude Instance**: Claude Opus 4.5
- **Action**: Built core app files
- **Files Created**:
  - `index.html` (693 bytes) - semantic HTML structure
  - `css/style.css` (2.9KB) - mobile-first, cartoon 3D button
  - `js/app.js` (2.7KB) - tap-to-advance, repeat prevention, keyboard support
- **Total Size**: ~12KB (well under 50KB budget)
- **Features**:
  - Tap anywhere or button to advance
  - No repeat syllables or colors
  - Keyboard support (space, enter, arrows)
  - Dynamic theme-color for mobile browser chrome
- **Status**: Phase 1B complete, opened in browser for testing

### 2025-11-25 (Syllable Data Rebuild)
- **Claude Instance**: Claude Opus 4.5
- **Issue**: Original syllable data had accents stripped and included unverified content
- **Action**: Complete rebuild from verified French phonics sources
- **Sources Used**:
  - French 36 phonemes (CCFS Sorbonne)
  - French CP curriculum phonics progression
  - French phonics teaching resources (sons simples + complexes)
- **New Structure**:
  - Simple vowels: a, e, i, o, u
  - Accented vowels: é, è, ê (only these three - verified)
  - Complex sounds (sons complexes): ou, on, an, en, in, oi, ai, au, eau, eu, ch, gn, ui, oin
  - CV syllables by consonant family (la/le/li/lo/lu, ma/me/mi/mo/mu, etc.)
  - Common word endings: er, es, et, ez, ir, tion
  - High-frequency function words: un, les, des, est, et, il
- **Removed**:
  - Multi-syllable words (avec, dans, pour, très - not syllables)
  - Rare tréma characters (ë, ï - only in Noël, naïf)
  - Unverified accented combinations
- **Status**: Pushed to GitHub

### 2026-02-19 (Major Feature Build: Scored Practice + Stats + iOS App)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. Designed and built scored practice mode with checkmark/X buttons
  2. Built Web Audio API sound effects engine (1 correct chime, 8 comical wrong sounds cycled)
  3. Built localStorage stats engine with NBA-style time windows (Career, 30d, 7d, Today)
  4. Created curated practice item catalog: mirror letters (b/d/p/q), similar letters (m/n), nasal vowels, digraphs, accents, hard/soft C/G
  5. Built multi-screen SPA (Home, Free Practice, Scored Practice, Config, Stats)
  6. Created config screen for toggling practice items on/off
  7. Converted project to Xcode iOS app (SwiftUI + WKWebView wrapper)
  8. Generated project.pbxproj, Swift files, Assets.xcassets
  9. Moved web files from root to Eclairs/Web/ (Xcode bundle structure)
  10. Created .ralph/ documentation structure (PROMPT.md, fix_plan.md, AGENT.md, .ralphrc)
- **Files Created**:
  - `Eclairs/Web/index.html` - Multi-screen SPA shell
  - `Eclairs/Web/css/style.css` - Full styles for all screens
  - `Eclairs/Web/js/app.js` - Main app logic, routing, all screens
  - `Eclairs/Web/js/syllables.js` - Syllable data + PracticeItems catalog
  - `Eclairs/Web/js/sounds.js` - Web Audio API sound effects
  - `Eclairs/Web/js/storage.js` - localStorage stats engine
  - `Eclairs/EclairsApp.swift` - SwiftUI app entry point
  - `Eclairs/ContentView.swift` - Main view
  - `Eclairs/WebView.swift` - WKWebView UIViewRepresentable
  - `Eclairs.xcodeproj/project.pbxproj` - Xcode project
  - `Eclairs/Assets.xcassets/` - Asset catalog
  - `.ralph/PROMPT.md`, `.ralph/fix_plan.md`, `.ralph/AGENT.md`, `.ralphrc`
- **Files Removed**:
  - Root-level `index.html`, `css/style.css`, `js/app.js`, `js/syllables.js`
- **Result**: Working prototype ready for Xcode testing
- **Status**: Phase 1 complete, ready for Phase 2 (testing & polish)

### 2026-02-20 (UX Feedback Pass: Snappiness, Feedback, Toolbar)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. Removed free practice mode — only scored practice now, home screen simplified to 3 buttons
  2. Fixed gray line at bottom — set WKWebView + scrollView backgroundColor to .clear, added background-color to html/screen elements, toolbar uses safe-area-inset-bottom
  3. Replaced full-screen feedback overlay with button-level pop animation (scale 1.25x + color glow ring on the pressed button)
  4. Made interactions snappier — reduced next-item delay from 350ms to 150ms, tightened all CSS transitions from 0.15s to 0.06-0.1s, added will-change:transform and input locking to prevent double-taps
  5. Added "Pause Stats" toggle at bottom of practice screen — subtle, 0.25 opacity, toggles recording to localStorage
  6. Added "Turn off [item]" button at bottom of practice screen — removes current item from selected set, immediately shows next
- **Files Modified**:
  - `Eclairs/Web/index.html` — removed free practice screen, added toolbar div
  - `Eclairs/Web/css/style.css` — removed free practice styles, added btn-pop keyframes, toolbar styles, fixed backgrounds
  - `Eclairs/Web/js/app.js` — removed free practice code, added pause/turn-off logic, input locking, faster transitions
  - `Eclairs/WebView.swift` — backgroundColor set to .clear
- **Status**: Ready for re-test in Xcode

### 2026-02-19 (Xcode Project Opened & Configured)
- **Claude Instance**: Claude Opus 4
- **Action**: User opened Eclairs.xcodeproj in Xcode; Xcode auto-configured project settings
- **Changes by Xcode**:
  - Added DEVELOPMENT_TEAM (Y3A9DG75S4)
  - Added CLANG_WARN_* flags (standard warnings)
  - Added ENABLE_APP_SANDBOX, ENABLE_HARDENED_RUNTIME
  - Added app category (public.app-category.education)
  - Added macOS to SUPPORTED_PLATFORMS
  - Updated LastUpgradeCheck to 2620
- **Status**: Project builds in Xcode, ready for simulator testing

### 2026-02-20 (Apple-Quality Design Overhaul)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. Complete CSS rewrite with glassmorphism design system
  2. Replaced cartoon 3D buttons with frosted glass panels and generous negative space
  3. Refined score button animation from bouncy `.pop` to subtle `.pulse` (scale 1.08 max, 0.2s ease-out)
  4. Added two-tap confirmation for "Turn off" button (first tap → "Tap again to confirm", auto-resets after 3s)
  5. Updated HTML structure: removed icons from buttons, cleaner class names
- **Status**: Superseded by candy-skeuomorphic pass below

### 2026-02-20 (Candy Skeuomorphic Button Treatment)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. User provided Splicetable UI reference images (in /_dropbox/) — neo-skeuomorphic raised controls with tactile depth
  2. Documented "Candy Skeuomorphic" design philosophy in CLAUDE.md Best Practices section
  3. Rewrote CSS from glassmorphism (backdrop-filter blur) to skeuomorphic depth system:
     - Multi-layer box-shadows: outer depth + inset top highlight + inset bottom shadow
     - `translateY(1px)` press instead of `scale(0.97)` — feels like pushing a real button
     - Score buttons: vertical gradient (light→saturated) + inset highlight rim + bottom shadow edge
     - Crisp 1px borders `rgba(0,0,0,0.08)` instead of blurry white glass borders
     - Reduced border-radius from 20px to 12px (more mechanical, precise)
     - Removed all `backdrop-filter: blur()` — not needed for this style
     - CSS custom properties: `--btn-shadow`, `--btn-shadow-pressed`, `--panel-shadow`
  4. Config items + stats panels get same raised treatment
- **Files Modified**:
  - `Eclairs/Web/css/style.css` — Full candy-skeuomorphic rewrite
  - `CLAUDE.md` — Design Philosophy section updated
- **Design Reference**: "Dieter Rams × Braun hi-fi × Kubrick 1960s" — tactile, candy-like, expensive toy
- **Status**: Ready for re-test in Xcode

### 2026-02-20 (App Icon Design: Rounds 1 & 2)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. Set up programmatic icon generation pipeline with `_icons/generate-icon-grid.js` (node-canvas)
  2. Round 1: 3 metaphors × 3 color variants = 9 icons
     - A: Lightning bolt (literal "éclair")
     - B: Letter tile (Scrabble piece with "é") — DROPPED
     - C: Giant accent mark — 3 variants promoted to CONTENDERS
  3. Fixed font rendering (node-canvas can't load system fonts) — all letter shapes drawn via canvas paths
  4. Round 2: User proposed "lé" fusion (bolt IS the letter "l" + accented "é")
     - A variants: 3 bolt refinements (thick, mini, pink)
     - D variants: 3 "lé" fusion (lavender, coral, dark navy)
  5. HTML review grid at `_icons/icon-grid/index.html` with iOS squircle clip + size previews
- **Files Created**:
  - `_icons/generate-icon-grid.js` — Icon generator with path-based letter drawing
  - `_icons/icon-grid/` — Generated output (gitignored)
  - `package.json` — For node-canvas dependency
- **User Decisions**:
  - C (accent mark) → all 3 are contenders, no further iteration
  - A (bolt) → iterate on
  - B (tile) → dropped
  - D ("lé" fusion) → new metaphor, iterate on
- **Status**: Round 2 generated, awaiting user feedback

### 2026-02-20 (Icon Round 3: Fat Rounded Bolt + Refined "é")
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. User feedback: bolts too spiky/angular, need "fatter, rounder, golden ratio vibe"
  2. Created `drawBoltRefined()` — fat proportions, 40px rounded stroke on all corners, golden ratio upper:lower split (~260:420px)
  3. Refactored `drawLetterE()` — stroke-based arc approach instead of circle cutout. Clean open ring + crossbar
  4. Refactored `drawAccent()` — simple rounded line instead of parallelogram path
  5. Round 3: 3 standalone bolt variants (lavender, coral, dark) + 3 "lé" fusion variants
  6. Accent contenders untouched (draw inline, not via helpers)
- **Files Modified**:
  - `_icons/generate-icon-grid.js` — Round 3 functions + refined helpers
- **Status**: Round 3 generated, awaiting user feedback

### 2026-02-20 (Powder-Coated Plastic Button Upgrade)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. User feedback: buttons need to be "way more tactile, long, fat, plastic or white powder-coated"
  2. Introduced `--btn-edge: 5px` CSS variable for visible bottom thickness band
  3. Shadow stack: first layer `0 var(--btn-edge) 0 <color>` creates the solid bottom edge
  4. Press animation: `translateY(var(--btn-edge))` pushes button flush with surface
  5. Score buttons get color-matched bottom edges (#388E3C green, #C62828 red)
  6. All hover states updated to preserve visible edge
  7. Config items get full press travel
  8. Taller button padding (22px → 26px for large)
- **Files Modified**:
  - `Eclairs/Web/css/style.css` — Full powder-coated depth system
  - `.gitignore` — Added node_modules, package-lock.json, _icons/icon-grid/
- **Status**: Complete, ready for re-test in Xcode

### 2026-02-20 (Background Music: Bouncy Chiptune Loop)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. Created `js/music.js` — Web Audio API synthesized background music
  2. Excite Bike-inspired: bouncy C major arpeggios, syncopated offbeat accents, 140 BPM
  3. 4 voices: square wave lead (low-pass filtered for lo-fi warmth), triangle bass, hi-hat (noise), kick (sine pitch drop)
  4. 4-bar loop (64 16th-note steps): ascending run → syncopated answer → higher phrase → resolution
  5. Look-ahead scheduler (setInterval 25ms + 100ms buffer) prevents timing drift
  6. Quiet volume (0.09 master gain), 0.8s fade-in, 0.4s fade-out
  7. Plays on home + stats screens, stops on practice + config
- **Files Created**:
  - `Eclairs/Web/js/music.js` — Background music engine
- **Files Modified**:
  - `Eclairs/Web/index.html` — Added music.js script tag
  - `Eclairs/Web/js/app.js` — MusicEngine.start()/stop() in showScreen()
- **Status**: Ready for testing

### 2026-02-20 (Music Expansion: 3 Songs + CR-78 Drums + Song Picker)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. Rewrote `music.js` with song data structure (array of song objects with melody/bass/drums/config)
  2. Added CR-78 drum sounds: closed hat (tight noise + highpass), open hat (bandpass sizzle), ride cymbal (detuned oscillator ping + noise shimmer)
  3. Song 0 "Bouncy": C major, 140 BPM, original Excite Bike vibe + CR-78 drums (open hat off-beats, ride on quarters)
  4. Song 1 "Mellow": A minor, 118 BPM, triangle lead, descending minor arpeggios, sparser drums
  5. Song 2 "Jazzy": G major, 115 BPM, chromatic walkdowns (Peg-inspired), swing: 0.12, busy ride on 8ths
  6. Added song picker UI: 3 pill buttons on home screen (Bouncy/Mellow/Jazzy)
  7. Wired song switching: click handler calls MusicEngine.setSong() with 450ms crossfade
- **Files Modified**:
  - `Eclairs/Web/js/music.js` — Complete rewrite: 3-song engine with CR-78 drums (468 lines)
  - `Eclairs/Web/index.html` — Added song picker buttons in home container
  - `Eclairs/Web/js/app.js` — Added updateSongPicker() + song button event binding
  - `Eclairs/Web/css/style.css` — Song picker pill button styles (candy-skeuomorphic)
- **Status**: Ready for testing

### 2026-02-20 (Song Toggle, Music on Settings, Reset Stats, Fix Race Condition)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. Song picker buttons now toggle: clicking the active song stops music, clicking again re-enables
  2. Music plays on home, stats, AND settings screens — only stops on practice
  3. Added "Reset all stats" button at bottom of stats screen with two-tap confirmation
  4. Added `Storage.clearStats()` — clears attempts only, preserves selected items config
  5. **Bug fix**: `setSong()` had internal `setTimeout(start, 450)` that raced with external `start()` calls — removed auto-restart from setSong, caller now manages start explicitly with 100ms delay
  6. Added `cancelScheduledValues()` in both `start()` and `stop()` to prevent Web Audio gain ramp conflicts
- **Files Modified**:
  - `Eclairs/Web/js/music.js` — Fixed setSong race condition, added cancelScheduledValues
  - `Eclairs/Web/js/app.js` — Song toggle, musicOff state, reset stats, music on settings
  - `Eclairs/Web/js/storage.js` — Added clearStats()
  - `Eclairs/Web/css/style.css` — Reset stats button styles
- **Status**: Fixed, ready for testing

### 2026-02-20 (App Icon: r3-le-dark selected and installed)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. User selected `r3-le-dark` as the winner — refined fat bolt + "é" on dark navy (#1A1A2E), light purple (#CE93D8), subtle glow
  2. Generated 1024x1024 PNG via `_icons/generate-icon-grid.js`
  3. Copied to `Eclairs/Assets.xcassets/AppIcon.appiconset/AppIcon.png`
  4. Updated `Contents.json` to reference `AppIcon.png`
- **Files Created**:
  - `Eclairs/Assets.xcassets/AppIcon.appiconset/AppIcon.png` — 1024x1024 app icon
- **Files Modified**:
  - `Eclairs/Assets.xcassets/AppIcon.appiconset/Contents.json` — Added filename reference
- **Status**: App icon installed, ready for Xcode build

### 2026-02-20 (Menu Button Sound Effects)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. Added 4 distinct synthesized sound effects for menu navigation buttons
  2. Practice: power-up ascending arpeggio (E4→A4→C#5→E5 square wave, lowpass filtered)
  3. Stats: data readout beep triplet (A5→E5→A5 triangle wave)
  4. Settings: mechanical ratchet (two clicky square wave pops + low sine gear wobble)
  5. Back: soft retreat pop (descending triangle blip 520→280Hz)
  6. Fixed syntax error from previous edit (missing `return {` in IIFE)
  7. Wired sounds into nav click handlers via `navSounds` lookup map
- **Files Modified**:
  - `Eclairs/Web/js/sounds.js` — 4 new menu sound functions + fixed return statement
  - `Eclairs/Web/js/app.js` — navSounds map in init(), plays sound on each nav button click
- **Status**: Committed, ready for testing

### 2026-02-20 (Adaptive Weighted Practice + Auto-Adjust)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. Built mastery scoring system (0-100 per item) based on last 20 attempts with recency weighting + streak bonus
  2. Replaced uniform random item selection with weighted random — struggling items appear up to 10x more often than mastered ones
  3. Added mastery decay: items not seen in 3+ days lose mastery to trigger periodic retesting
  4. Added mastery bars to stats table (orange filling, turns green at ≥80%)
  5. Built auto-adjust assessment engine that runs after every attempt:
     - **Frustration detection**: item <25% accuracy over last 8 attempts → auto-disabled (too hard). Pool never shrinks below 3 items
     - **Tier promotion**: average mastery ≥70% across current pool → next difficulty tier auto-enabled in settings
     - **Retry**: auto-disabled items come back after 2 days, but ONLY if their tier is already unlocked
  6. Defined 5 difficulty tiers in syllables.js: letters → basic nasals/digraphs → accents/more digraphs → hard nasals (gn, oin) → C/G confusion
  7. Brief toast notification when items are added or removed during practice
  8. Auto-disabled items tracked separately in localStorage (`eclairs_auto_disabled`)
- **Files Modified**:
  - `Eclairs/Web/js/storage.js` — getMastery(), getWeights(), assess(), auto-disabled tracking
  - `Eclairs/Web/js/syllables.js` — difficulty tiers array, getTiers(), getTierForItem()
  - `Eclairs/Web/js/app.js` — weighted random selection, assess() call in scorePractice, showAssessNotice()
  - `Eclairs/Web/css/style.css` — mastery bar styles, assess notice styles
- **Status**: Committed, ready for testing

### 2026-02-20 (Curriculum Expansion: 8 New Phonics Items)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. Gap analysis against CP-level French phonics curriculum
  2. Added 8 new practice items: ph, ill, ç, tion, er, ez, eil, ien
  3. Placed in difficulty tiers: ph→tier 1, er/ez/tion→tier 2, ç/ill/eil/ien→tier 3
  4. All defaultOn: false — unlocked via auto-promotion system
- **Files Modified**:
  - `Eclairs/Web/js/syllables.js` — 8 new items + updated tier arrays
- **Status**: Committed. Total practice items: 35 (was 27)

### 2026-02-20 (Haptic Feedback Bridge)
- **Claude Instance**: Claude Opus 4
- **Action**:
  1. Added Coordinator class with WKScriptMessageHandler to WebView.swift
  2. Pre-instantiated all UIFeedbackGenerator types (light/medium/heavy impact, notification, selection) for zero first-fire delay
  3. Created `haptics.js` — thin wrapper that posts messages to Swift via `window.webkit.messageHandlers.haptic`, no-ops in browser
  4. Wired haptic calls throughout app.js: score buttons (medium), correct/wrong feedback (success/error), nav buttons (light), song picker (light), config toggles (select), toolbar buttons, config action buttons
  5. Updated `.ralph/PROMPT.md` and `.ralph/AGENT.md` to reflect current state
  6. Wrote comprehensive master plan to `.ralph/fix_plan.md` covering Phase 4 (haptics) and Phase 5 (numbers mode)
- **Files Created**:
  - `Eclairs/Web/js/haptics.js` — JS→Swift haptic bridge wrapper
- **Files Modified**:
  - `Eclairs/WebView.swift` — Coordinator + WKScriptMessageHandler (was 35 lines, now 94)
  - `Eclairs/Web/js/app.js` — Haptic calls on all interactive elements
  - `Eclairs/Web/index.html` — haptics.js script tag
  - `.ralph/PROMPT.md`, `.ralph/AGENT.md`, `.ralph/fix_plan.md`
- **Status**: Committed. Must test on physical device (Simulator doesn't support haptics)

### [Template] (Project Initialization)
- **Claude Instance**: [MODEL_NAME]
- **Action**: Initialized CLAUDE.md template
- **Status**: Awaiting PRD

---

## DEVELOPMENT ROADMAP

### Current Status: **Phase 4** - Native Bridges

**See .ralph/fix_plan.md for detailed task checklist.**

### Phase 1: Core Prototype [COMPLETE]
- [x] Multi-screen SPA (Home, Free Practice, Scored Practice, Config, Stats)
- [x] Scored practice mode with checkmark/X buttons + sound effects
- [x] Web Audio API sound effects (1 correct chime, 8 comical wrong sounds)
- [x] localStorage stats engine with NBA-style time windows
- [x] Config screen for selecting practice items
- [x] Curated practice item catalog with difficulty categories
- [x] Xcode project with WKWebView wrapper

### Phase 2: Testing & Polish [CURRENT]
- [ ] Test in Xcode Simulator
- [ ] Verify sound effects in WKWebView
- [ ] Test localStorage persistence
- [ ] UI polish and animation refinement
- [ ] Safe area verification on notched iPhones

### Phase 3: Stats & Thresholds [COMPLETE]
- [x] Mastery threshold system (0-100 per item, recency-weighted + streak bonus)
- [x] Weighted practice selection (struggling items appear up to 10x more)
- [x] Auto-adjust: frustration detection (auto-disable too-hard items)
- [x] Auto-adjust: tier promotion (unlock next difficulty when ready)
- [x] Mastery bars in stats screen
- [ ] Session summary

### Phase 4: Native Bridges [CURRENT]
- [x] Haptic feedback bridge (JS → Swift Taptic Engine)
- [ ] Migrate localStorage to UserDefaults bridge (data durability) — DEFERRED

### Phase 5: Numbers Mode
- [ ] Number generator with French difficulty tiers (1-10, 11-20, 21-69, 70-99)
- [ ] Separate skin (warm amber/cream palette, different practice screen colors)
- [ ] Mode switch on home screen with flip animation
- [ ] Per-number tracking + weighted selection (reuse mastery algorithm)
- [ ] Range-based stats display
- [ ] New song set for numbers mode

### Phase 6: Release Prep
- [ ] App icon, launch screen
- [ ] TestFlight build

---

## BEST PRACTICES - WHAT WORKS

### Performance Winners
- System fonts = instant text rendering
- Vanilla HTML/CSS/JS = zero framework overhead
- Zero dependencies = nothing to maintain
- Static files = instant loading

### Development Winners
- Permission-based workflow - ask before acting
- Simple solutions first - don't over-engineer
- Reference preservation - keep uploads as knowledge bank

### Design Philosophy — "Candy Skeuomorphic"
Reference: Splicetable UI (images in /_dropbox/). Think Dieter Rams × Braun hi-fi × Kubrick 1960s, rendered in CSS.
- **Neo-skeuomorphic buttons**: Raised, physical-feeling, like injection-molded plastic or machined resin. NOT flat, NOT glossy
- **Multi-layer box-shadows**: Bottom + right shadows create "lifted off surface" depth. Subtle inset highlight on top edge
- **Crisp borders**: 1px solid in a slightly darker shade of background — sharp, not blurry glass
- **Warm monochrome palette**: Off-white / light warm gray base. Almost no color except occasional small accent dots
- **Moderate border-radius**: ~10-12px, not pill-shaped (not 20px+). Feels mechanical, precise
- **Confident typography**: Small, slightly tracked, clean system fonts. Labels below or inside controls
- **Tactile, candy-like, expensive toy**: The overall vibe. Quiet confidence. A real object you want to touch
- **Negative space**: Generous padding, breathing room. Let the controls float
- **Large tap targets**: Still kid-friendly despite the refined aesthetic

---

## ANTI-PATTERNS - WHAT DOESN'T WORK

### Performance Killers
- External fonts (even Google Fonts add 200-500ms delay)
- Unused dependencies
- Over-complicated JavaScript

### Development Killers
- Making up features (ask and validate instead)
- Skipping documentation
- Over-engineering simple features

---

## TROUBLESHOOTING - QUICK REFERENCE

### Rules of Thumb
- **CSS not working**: Check browser console, verify class names, check specificity
- **JS not working**: Check console for errors, verify file paths

### Debugging Strategy
Find working example in codebase → Compare → Apply working pattern

**For specific problem→solution pairs** → See TROUBLESHOOTING.md

---

## CURRENT STATUS

### Production Status
- **Architecture**: iOS app (SwiftUI + WKWebView) wrapping vanilla HTML/CSS/JS
- **Performance**: Zero dependencies, local bundle, instant loading
- **State**: Phase 1 prototype complete, ready for Xcode testing

### Key Files
- `Eclairs/Web/index.html` - Multi-screen SPA shell
- `Eclairs/Web/css/style.css` - All styles
- `Eclairs/Web/js/app.js` - Main app logic
- `Eclairs/Web/js/syllables.js` - Syllable data + practice items
- `Eclairs/Web/js/sounds.js` - Sound effects engine
- `Eclairs/Web/js/storage.js` - Stats & storage engine
- `Eclairs/*.swift` - iOS wrapper (3 files)
- `Eclairs.xcodeproj/` - Xcode project
- `.ralph/` - Ralph development documentation

### Next Priority
1. Open Eclairs.xcodeproj in Xcode and test on Simulator
2. Verify sound effects work in WKWebView
3. Test localStorage persistence across app launches
4. UI polish based on testing feedback

---

## FILE MAP - NO ORPHANS

Every file in this project is documented. Here's the complete map:

```
CLAUDE.md (this file) ─────────────────── THE HUB
├── PRD.md ◄─────────────────────────────── Product requirements
├── HISTORY.md ◄─────────────────────────── Archived action logs
├── TROUBLESHOOTING.md ◄─────────────────── Problem→solution reference
│
├── Eclairs.xcodeproj/ ◄────────────────── Xcode project
│   └── project.pbxproj
│
├── Eclairs/ ◄───────────────────────────── Xcode target folder
│   ├── EclairsApp.swift ─────────────────── App entry point
│   ├── ContentView.swift ────────────────── Main SwiftUI view
│   ├── WebView.swift ────────────────────── WKWebView wrapper
│   ├── Assets.xcassets/ ─────────────────── Asset catalog
│   └── Web/ ◄───────────────────────────── Bundled web app
│       ├── index.html ───────────────────── Multi-screen SPA shell
│       ├── css/style.css ────────────────── All styles
│       └── js/
│           ├── app.js ───────────────────── Main app logic & routing
│           ├── syllables.js ─────────────── Syllable data + practice items
│           ├── haptics.js ───────────────── JS→Swift haptic bridge
│           ├── sounds.js ────────────────── Web Audio API sound effects
│           ├── music.js ─────────────────── Background music engine
│           └── storage.js ───────────────── localStorage stats engine
│
├── _icons/ ◄────────────────────────────── App icon generation
│   ├── generate-icon-grid.js ────────────── node-canvas icon generator
│   └── icon-grid/ ───────────────────────── Generated output (gitignored)
│
├── .ralph/ ◄────────────────────────────── Ralph development docs
│   ├── PROMPT.md ────────────────────────── Development instructions
│   ├── fix_plan.md ──────────────────────── Task checklist
│   └── AGENT.md ─────────────────────────── Build/run commands
│
├── .ralphrc ◄───────────────────────────── Ralph config
├── package.json ◄───────────────────────── node-canvas dependency (icon gen only)
├── /_dropbox/ ◄─────────────────────────── **DROP FILES HERE** for Claude to find
```

---

## HANDOFF PROTOCOL

### For New Claude Instances
1. Read this entire file (it's the hub)
2. Read PRD.md for product requirements
3. Check the action log for current state
4. Review current status section

### For Human Developers
1. Understand the philosophy - performance and simplicity first
2. Follow the processes - use established patterns
3. Maintain documentation - keep this file updated
4. Test thoroughly - don't break what's working
