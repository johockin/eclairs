# Éclairs — Fix Plan

## Phase 1: Core Prototype (CURRENT)
- [x] P0: Create multi-screen SPA (Home, Free Practice, Scored Practice, Config, Stats)
- [x] P0: Build scored practice mode with checkmark/X buttons
- [x] P0: Implement Web Audio API sound effects (1 correct chime, 8 comical wrong sounds)
- [x] P0: Build localStorage stats engine with time-windowed calculations
- [x] P0: Create config screen for selecting practice items
- [x] P0: Build NBA-style stats display (Career, 30d, 7d, Today per item)
- [x] P0: Create Xcode project with WKWebView wrapper
- [x] P1: Define curated practice item catalog with difficulty categories

## Phase 2: Testing & Polish
- [ ] P0: Test in Xcode Simulator — verify all screens render correctly
- [ ] P0: Test sound effects play in WKWebView (AudioContext may need user gesture)
- [ ] P0: Test localStorage persistence across app launches
- [ ] P0: Verify config selections save and load correctly
- [ ] P1: Add subtle animations (screen transitions, button feedback)
- [ ] P1: Tune sound effects for satisfaction (volumes, timing, variety)
- [ ] P1: Verify safe area insets on notched iPhones
- [ ] P2: Add haptic feedback on button taps (native bridge or CSS)

## Phase 3: Stats & Thresholds
- [ ] P0: Design mastery thresholds (e.g., >90% over 20+ attempts = mastered)
- [ ] P0: Visual indicator on config screen for mastered/struggling items
- [ ] P1: Add "needs work" vs "mastered" filtering in stats view
- [ ] P1: Session summary screen after N attempts
- [ ] P2: Streak badges or visual rewards

## Phase 4: UX Refinements
- [ ] P0: Weighted practice selection (show struggling items more often)
- [ ] P1: Add ability to add custom practice items
- [ ] P1: Swipe gestures as alternative to buttons
- [ ] P2: Dark mode support
- [ ] P2: Landscape layout optimization

## Phase 5: Release Prep
- [ ] P0: App icon design
- [ ] P0: Launch screen
- [ ] P1: Bundle identifier and signing setup
- [ ] P1: TestFlight build
- [ ] P2: App Store listing copy

## Notes
- Phase 1 is the working prototype milestone
- Phase 2 must complete before real testing with the child
- Phase 3 is the "smart" feature that makes the app genuinely useful
- Phases 4-5 are polish and release, only after core is validated
- Sound effects are critical to engagement — invest time in tuning them
