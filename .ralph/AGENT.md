## Build & Run

Open `Eclairs.xcodeproj` in Xcode, select an iOS Simulator target, and press Cmd+R.

For web-only testing (no Xcode needed):
```bash
cd Eclairs/Web
python3 -m http.server 8000
# Open http://localhost:8000 in Safari
```

Haptics require a physical device — Simulator does not support them.

## Project Type

Swift 5.0 SwiftUI + WKWebView (iOS 16+)
Web: Vanilla HTML/CSS/JS, zero dependencies

## Build Commands
```
# Xcode build (from project root)
xcodebuild -project Eclairs.xcodeproj -scheme Eclairs -destination 'platform=iOS Simulator,name=iPhone 15' build

# No npm, no package manager, no build tools for web files
# (package.json exists only for node-canvas icon generation in _icons/)
```

## Conventions
- Web files in `Eclairs/Web/` (bundled as folder reference in Xcode)
- Swift files in `Eclairs/` (minimal — WKWebView wrapper + native bridges)
- All app logic in JavaScript, Swift is the shell + bridge layer
- IIFE module pattern for JS: `var X = (function() { ... })();`
- System fonts only — never add font imports
- All sounds synthesized via Web Audio API — no audio files
- localStorage for all data persistence
- Storage keys prefixed `eclairs_` (phonics) or `eclairs_num_` (numbers, planned)
- CSS custom properties drive the color/depth system
- Candy-skeuomorphic design: multi-layer box-shadows, `--btn-edge` for bottom thickness

## Key Storage Keys
- `eclairs_attempts` — phonics attempt records `{item, correct, ts}`
- `eclairs_config` — phonics config `{selectedItems: [...]}`
- `eclairs_auto_disabled` — auto-frustrated items `{id: timestamp}`

## Native Bridge Pattern (for haptics, future bridges)
Swift side: `WKScriptMessageHandler` on a Coordinator class
JS side: `window.webkit.messageHandlers.<name>.postMessage(payload)`
Graceful no-op when running in browser (check `window.webkit` exists)
