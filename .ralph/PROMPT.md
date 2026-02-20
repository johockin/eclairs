# Éclairs - Development Instructions

## What This Is

A mobile-first iOS app (WKWebView wrapping vanilla HTML/CSS/JS) for teaching French phonics to a 6-year-old. Parent-child practice sessions where the child reads syllables/letters and the parent scores right/wrong. Planned expansion: French number identification mode.

## Architecture

- **iOS Shell**: SwiftUI + WKWebView loading bundled web files
- **Web Core**: Vanilla HTML/CSS/JS, zero external dependencies
- **Data**: localStorage for all persistence (attempts, config, auto-disabled tracking)
- **Sound**: Web Audio API synthesized effects + background music (no audio files)
- **Native Bridges**: WKScriptMessageHandler for JS→Swift communication (haptics)
- **Target**: iOS 16+, iPhone primary, iPad secondary

### Key Files
- `Eclairs/Web/` - All web application files
- `Eclairs/Web/js/app.js` - Main SPA routing, screens, practice logic, weighted selection
- `Eclairs/Web/js/syllables.js` - Syllable data + PracticeItems catalog + difficulty tiers
- `Eclairs/Web/js/sounds.js` - Web Audio API sound effects (correct/wrong/menu sounds)
- `Eclairs/Web/js/music.js` - Background music engine (3 songs, CR-78 drums, song picker)
- `Eclairs/Web/js/storage.js` - localStorage stats engine + mastery scoring + auto-adjust
- `Eclairs/Web/js/haptics.js` - JS→Swift haptic bridge wrapper (planned)
- `Eclairs/Web/js/numbers.js` - Number engine for numbers mode (planned)
- `Eclairs/Web/css/style.css` - All styles (candy-skeuomorphic design system)
- `Eclairs/Web/index.html` - Multi-screen SPA shell
- `Eclairs/*.swift` - iOS wrapper (3 files: EclairsApp, ContentView, WebView)

## Architecture Principles

1. **Zero dependencies** - No npm, no CDN, no frameworks. Everything is vanilla.
2. **System fonts only** - Never add external fonts. Performance is sacred.
3. **Web-first logic** - All app logic lives in JS. Swift is a thin WKWebView shell + native bridges.
4. **localStorage is the database** - Timestamped attempt records, config as JSON.
5. **Synthesized audio only** - All sounds via Web Audio API oscillators. No audio files.
6. **Mobile-first design** - Large tap targets, safe area awareness, no hover dependencies.
7. **IIFE module pattern** - All JS modules use `var X = (function() { ... })();` — no import/export, no bundler.
8. **Candy-skeuomorphic design** - Tactile, raised buttons with multi-layer shadows. Dieter Rams meets candy store.

## Current State

### What Works
- **Phonics Mode**: Scored practice with adaptive difficulty
  - 35 practice items across 5 difficulty tiers
  - Adaptive weighted selection (struggling items appear more often)
  - Mastery scoring (0-100 per item, recency-weighted + streak bonus + decay)
  - Auto-adjust: frustration detection (auto-disables too-hard items)
  - Auto-adjust: tier promotion (unlocks next tier when ready)
  - Auto-disabled items retry after 2 days (tier-aware)
- **Screens**: Home, Scored Practice, Config (item toggles), Stats (per-item + mastery bars)
- **Sound**: 1 correct chime, 8 comical wrong sounds, 4 menu sounds, 3 background songs with CR-78 drums
- **UI**: Candy-skeuomorphic buttons with powder-coated depth, song picker, two-tap confirmations
- **Stats**: NBA-style time windows (Career, 30d, 7d, Today), per-item mastery bars, reset with confirmation
- **iOS**: Xcode project, WKWebView wrapper, app icon installed

### Practice Items (35 total, 5 tiers)
- **Tier 0**: b, d, p, q, m, n (mirror/similar letters)
- **Tier 1**: on, an, in, en, ou, oi, ch, ph (basic nasals + digraphs)
- **Tier 2**: é, è, ai, au, eau, eu, er, ez, tion (accents + more digraphs)
- **Tier 3**: ain, ein, oin, gn, ui, ê, ç, ill, eil, ien (harder nasals + tricky sounds)
- **Tier 4**: ca, ce, ga, ge (hard/soft C/G confusion)

### Planned
- **Haptic bridge**: JS→Swift for iPhone Taptic Engine on button presses
- **Numbers mode**: French number identification (1-99) with 7 difficulty tiers, separate skin, flip animation

## Scope

### In Scope
- Bug fixes for existing features
- Haptic feedback bridge (JS → Swift Taptic Engine)
- Numbers mode (French number identification, separate mode)
- UI polish and animation refinement
- Sound/music tuning
- Stats display improvements

### Do NOT
- Do not add npm dependencies or external libraries
- Do not add external fonts or CDN resources
- Do not add a backend or remote database
- Do not add user accounts or authentication
- Do not change the localStorage data format without migration logic
- Do not add features not discussed with the user

## Quality Standards
- App loads instantly from local bundle
- All interactions respond in <16ms
- Sound effects play without delay
- Stats calculate correctly across time windows
- Config selections persist across sessions
- No console errors in Safari WebKit
- Haptics must be tested on physical device (simulator doesn't support them)
