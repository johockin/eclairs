# PRD: Éclairs - French Phonics Flashcards

## Product Concept

**"A little box of éclairs you snack on together"** - A mobile-optimized web app for teaching French phonics through weighted syllable flashcards.

**Target User**: 6-year-old beginner French learner  
**Use Case**: Parent-child practice sessions, snackable reps on common French sounds  
**Platform**: Mobile web browser (Netlify deployment)

---

## Core Experience

### The Interaction
1. Open app → see a French syllable in large, readable text
2. Tap anywhere / big button → next syllable appears
3. Syllables appear weighted by their frequency in spoken French
4. Colors rotate randomly through pastels (pinks, purples, rainbow spectrum)
5. No scoring, no timers, no complexity - just pure reps

### Visual Identity
- **Concept**: Like opening a box of colorful French pastries - light, sweet, approachable
- **Not**: Utilitarian/tool-like, but has clean underlying structure
- **Feel**: Snackable, playful, solid/reliable, fast

---

## Technical Requirements

### Architecture
- **Framework**: Vanilla HTML/CSS/JS (zero dependencies for maximum speed)
- **Deployment**: Static files on Netlify
- **Performance**: Lightning fast - instant page load, instant syllable transitions
- **Mobile-First**: Optimized for phone screens, large tap targets

### Core Constraints
- System fonts only (no external font loading)
- Zero npm dependencies
- Minimal JavaScript
- Works offline after first load (optional but nice)

---

## Feature Specification

### Phase 1: Core MVP

#### Syllable Display
- **Text Size**: Large enough for 6-year-old to read easily (8-10vw font size)
- **Case**: Lowercase
- **Position**: Centered on screen
- **Color**: Random pastel rotation (pink/purple/rainbow spectrum) on each syllable
- **Background**: Clean, simple (white or very light pastel that changes with text color)

#### Syllable Set (Data Research Required)
**Type**: French phonemes + common syllables hybrid approach

**Include:**
- Simple common syllables: "le", "la", "de", "ma", "me", "pa", "ra", etc.
- Phoneme patterns: "ou", "ch", "an", "on", "en", "au", "eau", "oi", etc.
- Consonant blends: "cr", "pr", "tr", "bl", "gr", "fl", etc.

**Selection Method**: Weighted random selection based on frequency in spoken French

**Research Task**: 
- Find authoritative source for French syllable/phoneme frequency
- Target ~50-100 most common patterns
- Create weighted array where common patterns appear proportionally more often
- Document source in code comments

#### Interaction
- **Primary**: Tap anywhere on screen to advance
- **Alternative**: Large button at bottom (optional - tap anywhere might be sufficient)
- **Transition**: Instant (no animation delay)

#### Color Palette
Random selection from pastel spectrum:
- Pinks: #FFB6C1, #FFC0CB, #FF69B4, #FFE4E1
- Purples: #E6E6FA, #DDA0DD, #DA70D6, #EE82EE
- Rainbow pastels: #FFD700 (soft gold), #98FB98 (mint), #87CEEB (sky blue), #F0E68C (khaki)
- Ensure sufficient contrast with white/light backgrounds (WCAG AA minimum)

### Phase 2: Roadmap (Not in MVP)
- Difficulty toggle (beginner set ~50 vs advanced set ~150-200 syllables)
- Timed runs with self-scoring (10 syllables under timer)
- Progress tracking / stats
- Audio pronunciation (optional)

---

## User Stories

### Primary User Story
As a parent teaching my 6-year-old French, I want a fast, simple tool to practice common French sounds together so she builds phonetic familiarity through quick reps.

### Key Scenarios
1. **Quick Practice Session**: Open app on phone, do 20-30 reps in 2-3 minutes
2. **Waiting Room Time**: Pull out phone during wait times for instant practice
3. **Daily Snacking**: Multiple short sessions throughout day (hence "snackable")

---

## Design Specifications

### Layout (Mobile Portrait)
```
┌─────────────────────┐
│                     │
│                     │
│        "ou"         │  ← Large syllable, random pastel color
│                     │
│                     │
│   [TAP ANYWHERE]    │  ← Or explicit button
│                     │
└─────────────────────┘
```

### Typography
- **Syllable**: System sans-serif, 8-10vw, bold weight
- **Button** (if used): System sans-serif, 1.2rem, medium weight

### Spacing
- Generous padding around syllable (minimum 20% screen height top/bottom)
- Button (if used): Fixed to bottom with safe area padding

### Interaction States
- No hover states needed (mobile-first)
- Optional: Brief color pulse on tap for feedback
- Focus on instant response time

---

## Success Metrics

### Technical
- Page load: <100ms (cached)
- Syllable transition: Instant (<16ms)
- Zero JavaScript errors
- Works on iOS Safari and Chrome Android

### UX
- Child can use independently after 1 demo
- Parent reports "it just works"
- Sessions last 2-5 minutes (attention span appropriate)

---

## Implementation Notes

### Syllable Data Structure
```javascript
// Weighted array - common syllables appear multiple times
const syllables = [
  'le', 'le', 'le', 'le', 'le',  // Very common
  'de', 'de', 'de', 'de',        // Common
  'ou', 'ou', 'ou',              // Common phoneme
  'ma', 'ma',                    // Less common
  'eau',                         // Rare but important
  // etc.
];
```

### Color Selection
```javascript
const colors = [
  '#FFB6C1', '#FFC0CB', '#FF69B4',  // Pinks
  '#E6E6FA', '#DDA0DD', '#DA70D6',  // Purples
  '#98FB98', '#87CEEB', '#F0E68C'   // Rainbow pastels
];
```

---

## Open Questions / Decisions for Dev

1. **Button vs Tap Anywhere**: Start with tap anywhere, add button if needed?
2. **Color Transition**: Instant or very brief fade (50ms)?
3. **Syllable Case**: Confirm lowercase for all
4. **Syllable Source**: Which French frequency dataset to use? (Lexique 3, Manulex, other?)

---

## Development Phases

### Phase 1: Core MVP (Current)
- [ ] Research French syllable frequency data
- [ ] Create weighted syllable array (~50-100 items)
- [ ] Build single-page HTML structure
- [ ] Implement tap-to-advance logic
- [ ] Style with random pastel colors
- [ ] Test on mobile devices
- [ ] Deploy to Netlify

### Phase 2: Future Enhancements (Roadmap)
- Difficulty levels
- Timed scoring mode
- Progress tracking
- Audio pronunciation

---

## Technical Constraints

### Performance Budget
- Total page weight: <50KB
- JavaScript: <10KB
- CSS: <5KB
- No external dependencies
- No web fonts

### Browser Support
- iOS Safari (primary)
- Chrome Android (secondary)
- Modern browser features OK (no IE11 support needed)

---

## Notes for Claude Code

- Start with syllable research - this is the foundation
- Keep it ruthlessly simple - resist feature creep
- Test on actual phone before calling it done
- Document the syllable source/weighting logic in comments
- Make it so fast it feels like magic

---

## Project Name

**Éclairs** - "A little box of French syllable treats"

Visual pun: Educational flashcards packaged as snackable pastries
