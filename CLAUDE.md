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

### [Template] (Project Initialization)
- **Claude Instance**: [MODEL_NAME]
- **Action**: Initialized CLAUDE.md template
- **Status**: Awaiting PRD

---

## DEVELOPMENT ROADMAP

### Current Status: **Phase 2** - Testing & Polish

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

### Phase 3: Stats & Thresholds
- [ ] Mastery threshold system
- [ ] Weighted practice selection (struggling items appear more)
- [ ] Session summary

### Phase 4: Release Prep
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

### Design Philosophy
- Joyful, playful, kid-friendly
- Light pale backgrounds + soft dark text (for contrast)
- Cartoon 3D button - fun to press, but smaller than syllable text
- Large tap targets for small fingers

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
│           ├── sounds.js ────────────────── Web Audio API sound effects
│           └── storage.js ───────────────── localStorage stats engine
│
├── .ralph/ ◄────────────────────────────── Ralph development docs
│   ├── PROMPT.md ────────────────────────── Development instructions
│   ├── fix_plan.md ──────────────────────── Task checklist
│   └── AGENT.md ─────────────────────────── Build/run commands
│
├── .ralphrc ◄───────────────────────────── Ralph config
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
