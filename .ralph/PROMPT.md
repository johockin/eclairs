# Éclairs - Development Instructions

## What This Is

A mobile-first iOS app (WKWebView wrapping vanilla HTML/CSS/JS) for teaching French phonics to a 6-year-old. Parent-child practice sessions where the child reads syllables/letters and the parent scores right/wrong.

## Architecture

- **iOS Shell**: SwiftUI + WKWebView loading bundled web files
- **Web Core**: Vanilla HTML/CSS/JS, zero external dependencies
- **Data**: localStorage for all persistence (attempts, config)
- **Sound**: Web Audio API synthesized effects (no audio files)
- **Target**: iOS 16+, iPhone primary, iPad secondary

### Key Files
- `Eclairs/Web/` - All web application files
- `Eclairs/Web/js/app.js` - Main SPA routing, screens, practice logic
- `Eclairs/Web/js/syllables.js` - Syllable data + PracticeItems catalog
- `Eclairs/Web/js/sounds.js` - Web Audio API sound effects engine
- `Eclairs/Web/js/storage.js` - localStorage stats engine
- `Eclairs/Web/css/style.css` - All styles
- `Eclairs/Web/index.html` - Multi-screen SPA shell
- `Eclairs/*.swift` - iOS wrapper (3 files)

## Architecture Principles

1. **Zero dependencies** - No npm, no CDN, no frameworks. Everything is vanilla.
2. **System fonts only** - Never add external fonts. Performance is sacred.
3. **Web-first logic** - All app logic lives in JS. Swift is just a thin WKWebView shell.
4. **localStorage is the database** - Timestamped attempt records, config as JSON.
5. **Synthesized audio only** - All sounds via Web Audio API oscillators. No audio files.
6. **Mobile-first design** - Large tap targets, safe area awareness, no hover dependencies.
7. **Keep it joyful** - This is for a kid. Colors, cartoon buttons, satisfying sounds.

## Current State

### What Works
- Multi-screen SPA (Home, Free Practice, Scored Practice, Config, Stats)
- Free practice mode (weighted random syllables, tap to advance)
- Scored practice mode (checkmark/X buttons, sound effects)
- 8 comical wrong sounds cycling, 1 satisfying correct chime
- Config screen to pick which items to practice
- NBA-style stats (Career, 30-day, 7-day, Today)
- Per-item accuracy tracking with streaks
- localStorage persistence
- Xcode project wrapping web app in WKWebView

### Practice Items Available
- **Mirror letters**: b, d, p, q (ON by default)
- **Similar letters**: m, n (ON by default)
- **Nasal vowels**: on, an, in, en, ain, ein, oin
- **Digraphs**: ou, oi, ch, gn, ai, au, eau, eu, ui
- **Accents**: é, è, ê
- **Hard/soft C/G**: ca, ce, ga, ge

## Scope

### In Scope
- Bug fixes for existing features
- UI polish and animation refinement
- Sound effect tuning
- Stats display improvements
- Performance optimization
- Threshold system (future: flag items as "mastered")

### Do NOT
- Do not add npm dependencies or external libraries
- Do not add external fonts or CDN resources
- Do not add a backend or remote database
- Do not refactor Swift wrapper beyond WKWebView needs
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
