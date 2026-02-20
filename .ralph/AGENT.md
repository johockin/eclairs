## Build & Run

Open `Eclairs.xcodeproj` in Xcode, select an iOS Simulator target, and press Cmd+R.

For web-only testing (no Xcode needed):
```bash
cd Eclairs/Web
python3 -m http.server 8000
# Open http://localhost:8000 in Safari
```

## Project Type

Swift 5.0 SwiftUI + WKWebView (iOS 16+)
Web: Vanilla HTML/CSS/JS, zero dependencies

## Build Commands
```
# Xcode build (from project root)
xcodebuild -project Eclairs.xcodeproj -scheme Eclairs -destination 'platform=iOS Simulator,name=iPhone 15' build

# No npm, no package manager, no build tools for web files
```

## Conventions
- Web files in `Eclairs/Web/` (bundled as folder reference in Xcode)
- Swift files in `Eclairs/` (minimal — just WKWebView wrapper)
- All app logic in JavaScript, Swift is just the shell
- System fonts only — never add font imports
- All sounds synthesized via Web Audio API — no audio files
- localStorage for all data persistence
- IIFE module pattern for JS (no import/export, no bundler)
