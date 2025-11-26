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

### [Template] (Project Initialization)
- **Claude Instance**: [MODEL_NAME]
- **Action**: Initialized CLAUDE.md template
- **Status**: Awaiting PRD

---

## DEVELOPMENT ROADMAP

### Current Status: **Phase 1A** - Foundation

**See PRD.md for detailed phases and requirements.**

### Phase 0: Setup
- [x] Receive and review PRD
- [x] Create initial file structure
- [ ] Begin Phase 1 implementation

### Phase 1A: Foundation
- [x] Research French syllable frequency data (Manulex/Lexique 3)
- [x] Create weighted syllable array (js/syllables.js)
- [x] Validate/fix color palette for accessibility (WCAG AA)
- [x] User decisions on open questions

### Phase 1B: Core Build
- [x] Create index.html
- [x] Implement style.css (mobile-first)
- [x] Build app.js with tap-to-advance + repeat prevention

### Phase 1C: Mobile Polish
- [ ] Test iOS Safari
- [ ] Test Chrome Android
- [ ] Verify tap targets

### Phase 1D: Deploy
- [ ] Deploy to Netlify
- [ ] Final QA

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
- **Architecture**: Pure vanilla HTML/CSS/JS
- **Performance**: Zero dependencies, instant loading
- **State**: PRD received, architecture reviewed

### Key Files
- `index.html` - Main page (TO CREATE)
- `css/style.css` - Styling (TO CREATE)
- `js/app.js` - Application logic (TO CREATE)
- `js/syllables.js` - Weighted syllable data (TO CREATE)
- `PRD.md` - Product requirements (EXISTS)

### Next Priority
1. User decisions on open questions (colors, interaction, offline)
2. Syllable frequency research
3. Begin core implementation

---

## FILE MAP - NO ORPHANS

Every file in this project is documented. Here's the complete map:

```
CLAUDE.md (this file) ─────────────────── THE HUB
├── PRD.md ◄─────────────────────────────── Product requirements (EXISTS)
├── HISTORY.md ◄─────────────────────────── Archived action logs
├── TROUBLESHOOTING.md ◄─────────────────── Problem→solution reference
│
├── /css/ ◄──────────────────────────────── Styling
│   └── style.css ────────────────────────── Core styles
│
├── /js/ ◄───────────────────────────────── JavaScript
│   ├── app.js ───────────────────────────── Application logic
│   └── syllables.js ─────────────────────── Weighted syllable data
│
├── /_dropbox/ ◄─────────────────────────── **DROP FILES HERE** for Claude to find
│
└── index.html ◄─────────────────────────── Main page
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
