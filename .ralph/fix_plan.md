# Éclairs — Master Plan

## Current State (2026-02-20)

**Codebase**: 2,981 lines across 10 files. ~3KB total.
**Architecture**: SwiftUI shell (54 lines) → WKWebView → Vanilla HTML/CSS/JS
**What works**: Phonics mode (35 items, 5 tiers, adaptive weighting, auto-adjust, mastery tracking, 3 songs, menu sounds, candy-skeuomorphic UI)

---

## Phase 4: Native Bridges

### 4A: Haptic Feedback Bridge

**Goal**: Button presses trigger the iPhone Taptic Engine for tactile satisfaction.

**Why**: The candy-skeuomorphic buttons *look* pressable but don't *feel* pressable. Haptics complete the illusion. This is the single highest-impact UX improvement available.

**Implementation — Swift side** (`WebView.swift`):
1. Add `WKScriptMessageHandler` conformance to a new Coordinator class
2. Register a message handler named `haptic` on the WKWebView's `userContentController`
3. In the handler, read the message body (string: `"light"`, `"medium"`, `"heavy"`, `"success"`, `"error"`)
4. Map to UIKit haptic generators:
   - `"light"` / `"medium"` / `"heavy"` → `UIImpactFeedbackGenerator(style:)`
   - `"success"` → `UINotificationFeedbackGenerator().notificationOccurred(.success)`
   - `"error"` → `UINotificationFeedbackGenerator().notificationOccurred(.error)`
   - `"select"` → `UISelectionFeedbackGenerator().selectionChanged()`
5. Pre-instantiate generators in `makeUIView` to avoid first-fire delay

**Implementation — JS side** (`sounds.js` or new `haptics.js`):
1. Create `Haptics` module (thin wrapper):
   ```js
   var Haptics = {
     fire: function(style) {
       if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.haptic) {
         window.webkit.messageHandlers.haptic.postMessage(style);
       }
     },
     light: function() { this.fire('light'); },
     medium: function() { this.fire('medium'); },
     success: function() { this.fire('success'); },
     error: function() { this.fire('error'); }
   };
   ```
2. No-op gracefully when running in browser (non-WKWebView)

**Implementation — Wiring** (`app.js`):
- Correct answer → `Haptics.success()`
- Wrong answer → `Haptics.error()`
- Nav button press → `Haptics.light()`
- Score button press (on touch, before scoring) → `Haptics.medium()`
- Song button tap → `Haptics.light()`
- Config item toggle → `Haptics.select()` (needs adding to list)

**Files touched**: `WebView.swift` (add Coordinator + message handler), new `Eclairs/Web/js/haptics.js`, `index.html` (script tag), `app.js` (wire haptic calls)

**Estimated complexity**: Small. ~40 lines Swift, ~15 lines JS, ~10 lines wiring.

**Testing**: Must test on physical device. Simulator does not support haptics.

---

### 4B: UserDefaults Storage Bridge (DEFERRED)

**Goal**: Migrate localStorage data to UserDefaults for guaranteed persistence.

**Why**: localStorage in WKWebView can theoretically be cleared by iOS under storage pressure. UserDefaults is durable.

**Decision**: DEFER until after numbers mode. The risk is low (iOS rarely purges WKWebView storage for active apps), and the implementation is more invasive — every read/write in storage.js would need to go through the bridge asynchronously. Not worth the complexity right now.

**When to revisit**: Before TestFlight / real users. Or if we ever observe data loss.

---

## Phase 5: Numbers Mode

### Design Philosophy

Numbers mode is a **parallel universe** inside the same app. Same UX, different skin, different data, different vibe. The user flips between modes like flipping a coin — one side is phonics (lavender, playful), the other is numbers (warm amber, mathematical).

### 5A: Data Model — Number Generator & Tracking

**Number difficulty tiers** (French-specific):

| Tier | Range | Why it's hard | Notes |
|------|-------|---------------|-------|
| 0 | 1-10 | Basic | un, deux, trois... Just recognition |
| 1 | 11-16 | Irregular teens | onze, douze, treize, quatorze, quinze, seize — all unique |
| 2 | 17-20 | Composed teens | dix-sept, dix-huit, dix-neuf, vingt — first composed forms |
| 3 | 21-69 | Regular pattern | vingt-et-un, trente-deux, etc. Predictable but large |
| 4 | 70-79 | Soixante-dix | 60+10 system. Soixante-et-onze, soixante-douze... |
| 5 | 80-89 | Quatre-vingts | 4×20 system. Quatre-vingt-un, quatre-vingt-deux... |
| 6 | 90-99 | Quatre-vingt-dix | 4×20+10. The hardest. Quatre-vingt-onze... |

**New file**: `Eclairs/Web/js/numbers.js`

```
var NumberEngine = (function() {
  // Tier definitions (ranges, labels)
  // Number generator: pick from unlocked tiers, weighted by mastery
  // Display formatter: returns the Arabic numeral as a string
  // Tier progression: same model as phonics (average mastery ≥ 70% → unlock next)
  // Frustration: if accuracy on a tier drops below 25% over last 8, auto-disable tier
})();
```

**Storage keys** (separate from phonics):
- `eclairs_num_attempts` — same format: `{item: "47", correct: bool, ts: number}`
- `eclairs_num_config` — `{enabledTiers: [0, 1, 2], ...}`
- `eclairs_num_auto_disabled` — auto-disabled tiers

**Mastery**: Calculated per-number AND per-tier.
- Per-number mastery drives weighted selection within a tier
- Per-tier average mastery drives tier promotion
- Individual numbers track via the same `getMastery()` logic (last 20 attempts, recency-weighted)

**Why per-number, not just per-tier**: She might nail 71 every time but always miss 77. The algorithm needs to know that.

**Generator logic**:
1. Pick a tier (weighted by inverse tier mastery — weak tiers appear more)
2. Within that tier, pick a number (weighted by inverse number mastery — weak numbers appear more)
3. No repeat of last number shown

### 5B: Separate Skin — Color & Typography

**Phonics palette** (current):
- Home bg: `#E6E6FA` (lavender)
- Text: `#4A148C` (deep purple)
- Practice colors: pastel rainbow cycle (10 palettes)

**Numbers palette** (new):
- Home bg: `#FFF8E7` (warm cream)
- Text: `#1A2744` (dark slate navy)
- Practice colors: warm-toned cycle — peach, sand, soft gold, pale terracotta, warm gray, dusty rose, light sage, cream
- Buttons: same candy-skeuomorphic depth system, but `--btn-bg` shifts to `rgba(255, 248, 230, 0.7)` (warm tint)
- Score buttons: keep green/red (universal), but the score button borders/shadows get warm-shifted

**Implementation**: CSS custom properties already drive the entire color system. Numbers mode sets different `--bg-color`, `--text-color` on `<body>`. The practice-screen color palettes are a separate array in JS.

**New file section** in `numbers.js` or `syllables.js`:
```js
var numberColorPalettes = [
  { bg: '#FFF8E7', text: '#1A2744' },  // Warm Cream / Slate
  { bg: '#FFE8D6', text: '#5D2E0C' },  // Peach / Espresso
  { bg: '#F5E6CA', text: '#3E2723' },  // Sand / Dark Brown
  { bg: '#FFF3CD', text: '#33691E' },  // Soft Gold / Olive
  // ... etc
];
```

### 5C: Home Screen — Mode Switch with Flip Animation

**Current home screen**: Title, subtitle, 3 buttons (Practice, Stats, Settings), song picker at bottom.

**New home screen**: Two "sides" of a card. Front = phonics, back = numbers. A centered toggle button flips between them.

**HTML structure**:
```html
<div class="flipper" id="flipper">
  <div class="flip-card">
    <!-- FRONT: Phonics -->
    <div class="flip-front">
      <h1 class="home-title">Éclairs</h1>
      <p class="home-subtitle">French Phonics</p>
      <div class="home-nav">
        <button class="glass-btn glass-btn-large" data-nav="practice">Practice</button>
        <div class="home-nav-row">
          <button class="glass-btn" data-nav="stats">Stats</button>
          <button class="glass-btn" data-nav="config">Settings</button>
        </div>
      </div>
    </div>

    <!-- BACK: Numbers -->
    <div class="flip-back">
      <h1 class="home-title">Éclairs</h1>
      <p class="home-subtitle">Les Nombres</p>
      <div class="home-nav">
        <button class="glass-btn glass-btn-large" data-nav="numbers-practice">Practice</button>
        <div class="home-nav-row">
          <button class="glass-btn" data-nav="numbers-stats">Stats</button>
          <button class="glass-btn" data-nav="numbers-config">Settings</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Mode switch button (outside the card, always visible) -->
<button class="mode-switch" id="mode-switch">
  <span class="mode-label" id="mode-label">Nombres →</span>
</button>

<!-- Song pickers (one per mode, only active one visible) -->
```

**CSS flip animation**:
```css
.flipper {
  perspective: 1200px;
}
.flip-card {
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}
.flip-card.flipped {
  transform: rotateY(180deg);
}
.flip-front, .flip-back {
  backface-visibility: hidden;
  position: absolute;
  inset: 0;
}
.flip-back {
  transform: rotateY(180deg);
}
```

**Mode switch button**: Positioned between the nav buttons and the song picker. Medium-sized, distinct from nav buttons. Maybe a pill shape with an arrow or icon. Updates label: "Nombres →" / "← Phonics".

**Background color transition**: When flipping, the body background smoothly transitions from lavender to warm cream (and back). This sells the "different world" feeling.

### 5D: Practice Screen for Numbers

**Reuse**: The practice screen HTML/CSS is identical. Same `#screen-practice` with:
- Back button
- Big display area (shows "47" instead of "gn")
- Check/X buttons
- Session counter
- Toolbar (pause stats, turn off current — needs adaptation)

**"Turn off" adaptation**: Instead of turning off a specific number, this turns off the current *tier*. Button reads "Turn off 70-79" instead of "Turn off gn". Same two-tap confirmation.

**State management**: A global `currentMode` variable (`'phonics'` or `'numbers'`). The practice screen checks this to decide:
- Where to get the next item (PracticeItems vs NumberEngine)
- Which color palettes to cycle through
- Which storage keys to use
- Which sounds/songs to play

### 5E: Stats Screen for Numbers

**Separate screen**: `#screen-numbers-stats`. Same scroll container and layout pattern.

**Content**: Instead of 35 individual rows, show:
- Big career accuracy number (same as phonics)
- **Tier bars**: 7 rows, one per tier. Each shows:
  - Tier label ("1-10", "11-16", "70-79", etc.)
  - Mastery bar (same component as phonics)
  - Accuracy percentage
  - Attempt count
  - Lock icon if tier not yet unlocked
- Weakest/strongest tier callouts
- Reset button (same two-tap pattern)

**No individual number rows**: Too many. The tier summary is sufficient for the user-facing view. The per-number data exists behind the scenes for the algorithm.

### 5F: Config Screen for Numbers

**Separate screen**: `#screen-numbers-config`. Shows tier toggles (not individual numbers):
- Tier 0: 1-10
- Tier 1: 11-16
- Tier 2: 17-20
- ... etc.

Each is a toggle row. Same candy-skeuomorphic item style as phonics config.

"All" / "None" / "Defaults" buttons at top (same pattern).

### 5G: Songs for Numbers Mode

**3 new songs** with a warmer, more mathematical vibe. Ideas:
- Song 0 "Calculator": Clean sine/triangle tones, steady tempo, almost like a music box. Warm, precise.
- Song 1 "Abacus": Woody/marimba-like tones (high-Q bandpass filtered noise bursts), gentle swing, laid-back.
- Song 2 "Clockwork": Ticking rhythm, ascending/descending scales, mechanical but warm. Think grandfather clock meets chiptune.

These live in `music.js` as songs 3-5 in the songs array. The song picker on the numbers home screen shows these three instead of the phonics three.

### 5H: Sound Effects for Numbers Mode

**Reuse correct/wrong sounds**: Same chime and comical wrong sounds. No reason to change these — they're mode-agnostic.

**Different menu sounds**: The numbers side could have slightly different menu button sounds. Lower register, warmer oscillator types. But this is optional polish — can reuse phonics sounds initially.

---

## Implementation Order

### Step 1: Haptic Bridge (Phase 4A)
1. Add Coordinator + WKScriptMessageHandler to `WebView.swift`
2. Create `haptics.js` module
3. Add `<script>` tag to `index.html`
4. Wire haptic calls into `app.js` (buttons, scoring, nav)
5. Test on physical device
6. Commit

### Step 2: Numbers Data Engine (Phase 5A)
1. Create `numbers.js` with NumberEngine module
2. Define tier structure, generator, mastery calculation
3. Add number-specific storage keys to `storage.js`
4. Add `<script>` tag to `index.html`
5. Unit-test tier progression logic in browser console
6. Commit

### Step 3: Mode System + Home Screen Flip (Phase 5C)
1. Add `currentMode` state variable to `app.js`
2. Restructure `#screen-home` HTML for flip card
3. Add flip CSS (perspective, rotateY, backface-visibility)
4. Add mode switch button + click handler
5. Background color transitions between modes
6. Wire mode into `showScreen()` so it remembers mode context
7. Commit

### Step 4: Numbers Practice Screen (Phase 5D)
1. Branch `getNextPracticeItem()` on `currentMode`
2. Branch `scorePractice()` to record to correct storage
3. Branch color palette selection
4. Adapt "Turn off" button for tier-based disabling
5. Wire `assess()` for numbers (tier-based frustration/promotion)
6. Commit

### Step 5: Numbers Skin (Phase 5B)
1. Define number color palettes in `numbers.js`
2. Apply warm palette when mode is numbers
3. Home screen palette switches on flip
4. Practice screen cycles warm palettes
5. Commit

### Step 6: Numbers Stats + Config Screens (Phase 5E, 5F)
1. Add `#screen-numbers-stats` and `#screen-numbers-config` to HTML
2. Render tier-based stats view
3. Render tier toggle config
4. Wire navigation from numbers home side
5. Commit

### Step 7: Numbers Songs (Phase 5G)
1. Compose 3 new songs in `music.js`
2. Song picker shows songs 0-2 or 3-5 depending on mode
3. Mode switch changes active song set
4. Commit

### Step 8: Polish
1. Tune flip animation timing
2. Tune number color palettes
3. Test full flow: phonics → flip → numbers → practice → stats → flip back
4. Verify all storage is mode-separated
5. Commit

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Flip animation janky in WKWebView | Medium | Low | CSS 3D transforms are well-supported in WebKit. Fallback: instant swap with fade |
| Storage keys collide between modes | Low | High | All numbers keys prefixed `eclairs_num_`. Separate from phonics `eclairs_` keys |
| Numbers mode bloats app.js beyond maintainability | Medium | Medium | NumberEngine is its own module. Practice screen branching is ~20 lines. Most logic is in numbers.js |
| Per-number tracking creates huge localStorage | Low | Low | Even 100 numbers × 100 attempts = 10K records ≈ 200KB. localStorage limit is 5-10MB |
| Haptics feel wrong / too much | Low | Low | Easy to tune — just change which events trigger which intensity |

---

## File Impact Summary

| File | Changes |
|------|---------|
| `WebView.swift` | Add Coordinator, WKScriptMessageHandler for haptics |
| **NEW** `Eclairs/Web/js/haptics.js` | Haptic bridge JS wrapper |
| **NEW** `Eclairs/Web/js/numbers.js` | NumberEngine: tiers, generator, palettes |
| `Eclairs/Web/js/app.js` | Mode state, branching, flip handler, numbers routing |
| `Eclairs/Web/js/storage.js` | Numbers storage keys, numbers assess() |
| `Eclairs/Web/js/music.js` | 3 new songs for numbers mode |
| `Eclairs/Web/js/sounds.js` | Haptic calls alongside sound effects |
| `Eclairs/Web/css/style.css` | Flip animation, numbers palette, mode switch button |
| `Eclairs/Web/index.html` | Flip card HTML, new screens, new script tags |

**Estimated new code**: ~400-500 lines across all files.
**Estimated codebase after**: ~3,400-3,500 lines (from current 2,981).
