/**
 * Éclairs - Background Music Engine
 * Six selectable chiptune loops, all Web Audio API synthesized
 * Phonics: Bouncy (C maj riff), Mellow (D maj dreamy), Jazzy (Eb maj swing)
 * Numbers: Calculator (Bb maj staccato), Abacus (A pentatonic), Clockwork (E min mechanical)
 */

var MusicEngine = (function() {
  'use strict';

  var ctx = null;
  var masterGain = null;
  var isPlaying = false;
  var timerId = null;
  var nextNoteTime = 0;
  var currentStep = 0;
  var VOLUME = 0.09;
  var currentSong = 0;

  // --- Note frequency table ---
  var n = {
    C3:130.81, D3:146.83, Eb3:155.56, E3:164.81, F3:174.61, Fs3:185.00,
    G3:196.00, Ab3:207.65, A3:220.00, Bb3:233.08, B3:246.94,
    C4:261.63, D4:293.66, Eb4:311.13, E4:329.63, F4:349.23, Fs4:369.99,
    G4:392.00, Ab4:415.30, A4:440.00, Bb4:466.16, B4:493.88,
    C5:523.25, D5:587.33, Eb5:622.25, E5:659.25, F5:698.46, Fs5:739.99,
    G5:783.99, Ab5:830.61, A5:880.00, Bb5:932.33
  };
  var R = 0;

  // ============================================================
  // SONG DEFINITIONS
  // ============================================================

  var songs = [
    // ============================================================
    // PHONICS SONGS (0-2) — playful, letter-learning energy
    // ============================================================

    // --- SONG 0: BOUNCY (C major, 140 BPM) ---
    // Energetic 2-note riff motif, call-and-response, NOT arpeggios
    // Think: a catchy repeated hook with rhythmic punch
    {
      name: 'Bouncy',
      bpm: 140,
      steps: 64,
      swing: 0,
      melody: [
        // Bar 1 — punchy two-note riff: G-C, G-C, then answer phrase
        n.G4, R, n.C5, R,     n.G4, R, n.C5, R,    R, n.D5, n.E5, R,   n.D5, R, R, R,
        // Bar 2 — syncopated response: pushes off-beat
        R, R, n.E5, R,        n.D5, n.C5, R, R,    n.G4, R, R, n.A4,   R, R, R, R,
        // Bar 3 — higher energy: repeating E then leap down
        n.E5, R, n.E5, R,     n.E5, n.D5, R, n.C5, R, n.A4, R, R,     n.G4, R, n.A4, R,
        // Bar 4 — build: stepwise climb then drop
        n.C5, R, n.D5, R,     n.E5, R, n.G5, R,    n.E5, R, R, n.C5,  R, R, R, R
      ],
      accents: [
        1,0,1,0, 1,0,1,0,  0,1,1,0, 1,0,0,0,
        0,0,1,0, 1,1,0,0,  1,0,0,1, 0,0,0,0,
        1,0,1,0, 1,1,0,1,  0,1,0,0, 1,0,1,0,
        1,0,1,0, 1,0,1,0,  1,0,0,1, 0,0,0,0
      ],
      bass: [
        n.C3,0,0,0, 0,0,0,0,  n.C3,0,0,0, 0,0,0,0,
        n.A3,0,0,0, 0,0,0,0,  n.E3,0,0,0, 0,0,0,0,
        n.C3,0,0,0, 0,0,0,0,  n.F3,0,0,0, 0,0,0,0,
        n.G3,0,0,0, 0,0,0,0,  n.G3,0,0,0, 0,0,0,0
      ],
      hat: [
        1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  1, 0, .5, 0,
        1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  .3,0, .3, 0,
        1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  1, 0, .5, 0,
        1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  .3,0, .3, 0
      ],
      openHat: [
        0,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,1,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0
      ],
      ride: [
        1, 0, 0, 0,  1, 0, 0, 0,   1, 0, 0, 0,  1, 0, 0, 0,
        1, 0, 0, 0,  1, 0, 0, 0,   1, 0, 0, 0,  1, 0, 0, 0,
        1, 0, 0, 0,  1, 0, 0, 0,   1, 0, 0, 0,  1, 0, 0, 0,
        1, 0, 0, 0,  1, 0, 0, 0,   1, 0, 0, 0,  1, 0, 0, 0
      ],
      kick: [
        1, 0, 0, 0,  0, 0,.4, 0,   1, 0, 0, 0,  0, 0,.4, 0,
        1, 0, 0, 0,  0, 0,.4, 0,   1, 0, 0, 0,  0, 0, 0, 0,
        1, 0, 0, 0,  0, 0,.4, 0,   1, 0, 0, 0,  0, 0,.4, 0,
        1, 0, 0, 0,  0, 0,.4, 0,   1, 0, 0, 0,  0, 0, 0, 0
      ],
      leadType: 'square',
      filterFreq: 2200
    },

    // --- SONG 1: MELLOW (D major, 92 BPM) ---
    // Sparse, dreamy, long tones with space — lullaby-like
    // Mostly half-note and quarter-note rhythms, wide intervals, lots of rests
    {
      name: 'Mellow',
      bpm: 92,
      steps: 64,
      swing: 0,
      melody: [
        // Bar 1 — single long note, then space, then gentle answer
        n.D5, R, R, R,        R, R, R, R,          n.A4, R, R, R,      R, R, R, R,
        // Bar 2 — one note, pause, two-note sigh
        n.Fs4,R, R, R,        R, R, R, R,          R, R, n.G4, R,      n.Fs4,R, R, R,
        // Bar 3 — slightly more motion: three notes spread out
        n.B4, R, R, R,        n.A4, R, R, R,       R, R, n.Fs4,R,      R, R, R, R,
        // Bar 4 — resolve: one sustained note, then echo
        n.D5, R, R, R,        R, R, R, R,          R, R, R, R,         n.A4, R, R, R
      ],
      accents: [
        1,0,0,0, 0,0,0,0,  1,0,0,0, 0,0,0,0,
        1,0,0,0, 0,0,0,0,  0,0,1,0, 1,0,0,0,
        1,0,0,0, 1,0,0,0,  0,0,1,0, 0,0,0,0,
        1,0,0,0, 0,0,0,0,  0,0,0,0, 1,0,0,0
      ],
      bass: [
        n.D3,0,0,0, 0,0,0,0,   0,0,0,0,   0,0,0,0,
        n.A3,0,0,0, 0,0,0,0,   n.G3,0,0,0, 0,0,0,0,
        n.G3,0,0,0, 0,0,0,0,   n.D3,0,0,0, 0,0,0,0,
        n.D3,0,0,0, 0,0,0,0,   n.A3,0,0,0, 0,0,0,0
      ],
      // Very sparse drums — just gentle kick on 1 and ghost hat
      hat: [
        .3, 0, 0, 0,  0, 0, 0, 0,  .3, 0, 0, 0,  0, 0, 0, 0,
        .3, 0, 0, 0,  0, 0, 0, 0,  .3, 0, 0, 0,  0, 0, 0, 0,
        .3, 0, 0, 0,  0, 0, 0, 0,  .3, 0, 0, 0,  0, 0, 0, 0,
        .3, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,   .3, 0, 0, 0
      ],
      openHat: [
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0
      ],
      ride: [
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0
      ],
      kick: [
        1, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,
        1, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,
        1, 0, 0, 0,  0, 0, 0, 0,   .5,0, 0, 0,  0, 0, 0, 0,
        1, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0
      ],
      leadType: 'triangle',
      filterFreq: 1600
    },

    // --- SONG 2: JAZZY (Eb major, 108 BPM, swing) ---
    // Chromatic passing tones, bebop-flavored, walking bass feel
    // Key: Eb — completely different harmonic color from C and D
    {
      name: 'Jazzy',
      bpm: 108,
      steps: 64,
      swing: 0.14,
      melody: [
        // Bar 1 — chromatic approach: D→Eb, then skip up to Bb
        n.D4, R, n.Eb4,R,     R, R, n.Bb4,R,       R, n.Ab4,R, R,      n.G4, R, R, R,
        // Bar 2 — bluesy bend: Gb(Fs)→G→Bb, laid back
        R, n.Fs4,R, n.G4,     R, R, n.Bb4,R,       n.Ab4,R, R, n.G4,   R, R, R, R,
        // Bar 3 — higher register, syncopated hits
        R, R, n.Bb4,R,        n.C5, R, R, n.Eb5,   R, n.D5, R, R,      n.Bb4,R, R, R,
        // Bar 4 — descending chromatic resolution
        n.C5, R, n.B4, R,     n.Bb4,R, n.Ab4,R,    n.G4, R, R, R,      R, R, R, R
      ],
      accents: [
        1,0,1,0, 0,0,1,0,  0,1,0,0, 1,0,0,0,
        0,1,0,1, 0,0,1,0,  1,0,0,1, 0,0,0,0,
        0,0,1,0, 1,0,0,1,  0,1,0,0, 1,0,0,0,
        1,0,1,0, 1,0,1,0,  1,0,0,0, 0,0,0,0
      ],
      bass: [
        n.Eb3,0,0,0, 0,0,0,0,  n.Bb3,0,0,0, 0,0,0,0,
        n.Ab3,0,0,0, 0,0,0,0,  n.Eb3,0,0,0, 0,0,0,0,
        n.Ab3,0,0,0, 0,0,0,0,  n.Bb3,0,0,0, 0,0,0,0,
        n.Ab3,0,0,0, 0,0,n.G3,0,n.Eb3,0,0,0, 0,0,0,0
      ],
      hat: [
        .7, 0, .3, .2,  .7, 0, .3, .2,  .7, 0, .3, .2,  .7, 0, .3, .2,
        .7, 0, .3, .2,  .7, 0, .3, .2,  .7, 0, .3, .2,  .4, 0, .2, 0,
        .7, 0, .3, .2,  .7, 0, .3, .2,  .7, 0, .3, .2,  .7, 0, .3, .2,
        .7, 0, .3, .2,  .7, 0, .3, .2,  .7, 0, .3, .2,  .4, 0, .2, 0
      ],
      openHat: [
        0,0,0,0, 0,0,.8,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,.8,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,.8,0,  0,0,0,0, 0,0,.8,0,
        0,0,0,0, 0,0,0,0,   0,0,0,0, 0,0,0,0
      ],
      ride: [
        1, 0, .4, 0,  1, 0, .4, 0,  1, 0, .4, 0,  1, 0, .4, 0,
        1, 0, .4, 0,  1, 0, .4, 0,  1, 0, .4, 0,  1, 0, .4, 0,
        1, 0, .4, 0,  1, 0, .4, 0,  1, 0, .4, 0,  1, 0, .4, 0,
        1, 0, .4, 0,  1, 0, .4, 0,  1, 0, .4, 0,  1, 0, .4, 0
      ],
      kick: [
        1, 0, 0, 0,  0, 0, 0, 0,   .4,0, 0, 0,  0, 0,.3, 0,
        1, 0, 0, 0,  0, 0,.3, 0,   1, 0, 0, 0,  0, 0, 0, 0,
        1, 0, 0, 0,  0, 0, 0, 0,   .4,0, 0, 0,  0, 0,.3, 0,
        1, 0, 0, 0,  0, 0,.3, 0,   1, 0, 0, 0,  0, 0, 0, 0
      ],
      leadType: 'square',
      filterFreq: 2000
    },

    // ============================================================
    // NUMBERS SONGS (3-5) — distinctly different character
    // ============================================================

    // --- SONG 3: CALCULATOR (Bb major, 132 BPM) ---
    // Staccato, mathematical: repeated notes, perfect 4th/5th intervals
    // Short punchy hits like button presses — NOT arpeggios
    {
      name: 'Calculator',
      bpm: 132,
      steps: 64,
      swing: 0,
      melody: [
        // Bar 1 — repeated Bb, then jump up a 5th to F
        n.Bb4,R, n.Bb4,R,     n.Bb4,R, R, R,       n.F5, R, R, R,      R, R, R, R,
        // Bar 2 — F repeated, drop down a 4th to C
        n.F5, R, n.F5, R,     R, R, n.C5, R,       n.C5, R, R, R,      R, R, R, R,
        // Bar 3 — alternating pattern: D-Bb-D-Bb then climb
        n.D5, R, n.Bb4,R,     n.D5, R, n.Bb4,R,    n.Eb5,R, n.F5, R,   R, R, R, R,
        // Bar 4 — descend by step: Eb-D-C-Bb, precise
        n.Eb5,R, R, R,        n.D5, R, R, R,       n.C5, R, R, R,      n.Bb4,R, R, R
      ],
      accents: [
        1,0,1,0, 1,0,0,0,  1,0,0,0, 0,0,0,0,
        1,0,1,0, 0,0,1,0,  1,0,0,0, 0,0,0,0,
        1,0,1,0, 1,0,1,0,  1,0,1,0, 0,0,0,0,
        1,0,0,0, 1,0,0,0,  1,0,0,0, 1,0,0,0
      ],
      bass: [
        n.Bb3,0,0,0, 0,0,0,0,  n.F3,0,0,0, 0,0,0,0,
        n.F3,0,0,0, 0,0,0,0,   n.C3,0,0,0, 0,0,0,0,
        n.Bb3,0,0,0, 0,0,0,0,  n.Eb3,0,0,0, 0,0,0,0,
        n.Ab3,0,0,0, 0,0,0,0,  n.Bb3,0,0,0, 0,0,0,0
      ],
      // Tight, precise hats — quarter note grid, very clean
      hat: [
        1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,
        1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,
        1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,
        1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0
      ],
      openHat: [
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0
      ],
      ride: [
        0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,
        0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,
        0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,
        0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0
      ],
      kick: [
        1, 0, 0, 0,  0, 0, 0, 0,  1, 0, 0, 0,  0, 0, 0, 0,
        1, 0, 0, 0,  0, 0, 0, 0,  1, 0, 0, 0,  0, 0, 0, 0,
        1, 0, 0, 0,  0, 0, 0, 0,  1, 0, 0, 0,  0, 0, 0, 0,
        1, 0, 0, 0,  0, 0, 0, 0,  1, 0, 0, 0,  0, 0, 0, 0
      ],
      leadType: 'triangle',
      filterFreq: 3200
    },

    // --- SONG 4: ABACUS (A pentatonic, 100 BPM) ---
    // Pentatonic only (A C D E G) — no chromatic, no half-steps
    // Wide leaps, gentle, kalimba/music-box: sparse and floating
    {
      name: 'Abacus',
      bpm: 100,
      steps: 64,
      swing: 0.06,
      melody: [
        // Bar 1 — wide leap: low A up to E, then space
        n.A4, R, R, R,        R, R, n.E5, R,       R, R, R, R,         R, R, R, R,
        // Bar 2 — gentle descent: E-D, then low G plink
        n.E5, R, R, n.D5,     R, R, R, R,          n.G4, R, R, R,      R, R, R, R,
        // Bar 3 — playful: C-E leap, then A repeated
        n.C5, R, R, R,        n.E5, R, R, R,       n.A4, R, R, n.A4,   R, R, R, R,
        // Bar 4 — resolve: D floats up to E, lands on A
        n.D5, R, R, R,        R, R, n.E5, R,       R, R, R, R,         n.A4, R, R, R
      ],
      accents: [
        1,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,0,0,
        1,0,0,1, 0,0,0,0,  1,0,0,0, 0,0,0,0,
        1,0,0,0, 1,0,0,0,  1,0,0,1, 0,0,0,0,
        1,0,0,0, 0,0,1,0,  0,0,0,0, 1,0,0,0
      ],
      bass: [
        n.A3, 0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        n.E3, 0,0,0, 0,0,0,0,  n.G3,0,0,0, 0,0,0,0,
        n.A3, 0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        n.D3, 0,0,0, 0,0,0,0,  n.A3,0,0,0, 0,0,0,0
      ],
      // Very minimal: just light taps, no driving beat
      hat: [
        .4, 0, 0, 0,  0, 0, 0, 0,  .4, 0, 0, 0,  0, 0, 0, 0,
        .4, 0, 0, 0,  0, 0, 0, 0,  .4, 0, 0, 0,  0, 0, 0, 0,
        .4, 0, 0, 0,  0, 0, 0, 0,  .4, 0, 0, 0,  0, 0, 0, 0,
        .4, 0, 0, 0,  0, 0, 0, 0,  .4, 0, 0, 0,  0, 0, 0, 0
      ],
      openHat: [
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0
      ],
      ride: [
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0
      ],
      kick: [
        .6, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,
        .6, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,
        .6, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0,
        .6, 0, 0, 0,  0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0
      ],
      leadType: 'triangle',
      filterFreq: 2400
    },

    // --- SONG 5: CLOCKWORK (E minor, 120 BPM) ---
    // Mechanical, relentless: descending 4-note scale motif on repeat
    // Same figure transposed — obsessive, ticking, hypnotic
    {
      name: 'Clockwork',
      bpm: 120,
      steps: 64,
      swing: 0,
      melody: [
        // Bar 1 — the motif: E-D-C-B (4 descending steps), then rest
        n.E5, n.D5, n.C5, n.B4,  R, R, R, R,       n.E5, n.D5, n.C5, n.B4, R, R, R, R,
        // Bar 2 — motif shifted down: D-C-B-A
        n.D5, n.C5, n.B4, n.A4,  R, R, R, R,       n.D5, n.C5, n.B4, n.A4, R, R, R, R,
        // Bar 3 — motif from G: G-F#-E-D (higher energy)
        n.G5, n.Fs5,n.E5, n.D5,  R, R, R, R,       n.G5, n.Fs5,n.E5, n.D5, R, R, R, R,
        // Bar 4 — resolve back: E-D-C-B, then single low E
        n.E5, n.D5, n.C5, n.B4,  R, R, R, R,       R, R, R, R,         n.E4, R, R, R
      ],
      accents: [
        1,1,1,1, 0,0,0,0,  1,1,1,1, 0,0,0,0,
        1,1,1,1, 0,0,0,0,  1,1,1,1, 0,0,0,0,
        1,1,1,1, 0,0,0,0,  1,1,1,1, 0,0,0,0,
        1,1,1,1, 0,0,0,0,  0,0,0,0, 1,0,0,0
      ],
      bass: [
        n.E3,0,0,0, 0,0,0,0,  n.E3,0,0,0, 0,0,0,0,
        n.D3,0,0,0, 0,0,0,0,  n.D3,0,0,0, 0,0,0,0,
        n.C3,0,0,0, 0,0,0,0,  n.B3,0,0,0, 0,0,0,0,
        n.E3,0,0,0, 0,0,0,0,  0,0,0,0,   n.E3,0,0,0
      ],
      // Steady mechanical ticking: 8th notes, unvarying
      hat: [
        .8, 0, .5, 0,  .8, 0, .5, 0,  .8, 0, .5, 0,  .8, 0, .5, 0,
        .8, 0, .5, 0,  .8, 0, .5, 0,  .8, 0, .5, 0,  .8, 0, .5, 0,
        .8, 0, .5, 0,  .8, 0, .5, 0,  .8, 0, .5, 0,  .8, 0, .5, 0,
        .8, 0, .5, 0,  .8, 0, .5, 0,  .8, 0, .5, 0,  .8, 0, .5, 0
      ],
      openHat: [
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0
      ],
      ride: [
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0
      ],
      kick: [
        1, 0, 0, 0,  .5,0, 0, 0,  1, 0, 0, 0,  .5,0, 0, 0,
        1, 0, 0, 0,  .5,0, 0, 0,  1, 0, 0, 0,  .5,0, 0, 0,
        1, 0, 0, 0,  .5,0, 0, 0,  1, 0, 0, 0,  .5,0, 0, 0,
        1, 0, 0, 0,  .5,0, 0, 0,  0, 0, 0, 0,  1, 0, 0, 0
      ],
      leadType: 'square',
      filterFreq: 1800
    }
  ];

  // ============================================================
  // AUDIO ENGINE
  // ============================================================

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = VOLUME;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // --- Lead voice (square or triangle + low-pass) ---
  function playLead(freq, time, accent, song) {
    if (freq === R) return;
    var c = getCtx();
    var osc = c.createOscillator();
    var filter = c.createBiquadFilter();
    var gain = c.createGain();
    var vol = accent ? 0.3 : 0.18;
    var step = 60 / song.bpm / 4;
    var dur = step * 0.75;

    osc.type = song.leadType;
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = accent ? song.filterFreq * 1.4 : song.filterFreq;
    filter.Q.value = 1;

    gain.gain.setValueAtTime(vol, time);
    gain.gain.setValueAtTime(vol * 0.7, time + dur * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + dur + 0.01);
  }

  // --- Bass (triangle wave) ---
  function playBass(freq, time, song) {
    if (!freq) return;
    var c = getCtx();
    var osc = c.createOscillator();
    var gain = c.createGain();
    var step = 60 / song.bpm / 4;
    var dur = step * 6;

    osc.type = 'triangle';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + dur);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + dur + 0.01);
  }

  // --- Closed hi-hat (CR-78 style: tight, metallic) ---
  function playClosed(vol, time) {
    if (vol <= 0) return;
    var c = getCtx();
    var bufLen = Math.floor(c.sampleRate * 0.02);
    var buffer = c.createBuffer(1, bufLen, c.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
    }
    var src = c.createBufferSource();
    src.buffer = buffer;
    var filter = c.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 8000;
    var gain = c.createGain();
    gain.gain.setValueAtTime(vol * 0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    src.start(time);
  }

  // --- Open hi-hat (CR-78: longer sizzle, bandpass for body) ---
  function playOpen(vol, time) {
    if (vol <= 0) return;
    var c = getCtx();
    var bufLen = Math.floor(c.sampleRate * 0.12);
    var buffer = c.createBuffer(1, bufLen, c.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 0.5);
    }
    var src = c.createBufferSource();
    src.buffer = buffer;
    var bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 6000;
    bp.Q.value = 0.8;
    var gain = c.createGain();
    gain.gain.setValueAtTime(vol * 0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    src.connect(bp);
    bp.connect(gain);
    gain.connect(masterGain);
    src.start(time);
  }

  // --- Ride cymbal (CR-78: metallic ping + shimmer tail) ---
  function playRide(vol, time) {
    if (vol <= 0) return;
    var c = getCtx();

    // Metallic ping: two detuned high oscillators
    var osc1 = c.createOscillator();
    var osc2 = c.createOscillator();
    var gain = c.createGain();
    osc1.type = 'square';
    osc2.type = 'square';
    osc1.frequency.value = 4200;
    osc2.frequency.value = 4750; // slight detune for shimmer

    gain.gain.setValueAtTime(vol * 0.04, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(masterGain);
    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.16);
    osc2.stop(time + 0.16);

    // Noise shimmer tail
    var bufLen = Math.floor(c.sampleRate * 0.08);
    var buffer = c.createBuffer(1, bufLen, c.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
    }
    var src = c.createBufferSource();
    src.buffer = buffer;
    var hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 9000;
    var ng = c.createGain();
    ng.gain.setValueAtTime(vol * 0.06, time);
    ng.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    src.connect(hp);
    hp.connect(ng);
    ng.connect(masterGain);
    src.start(time);
  }

  // --- Kick (sine pitch drop) ---
  function playKick(vol, time) {
    if (vol <= 0) return;
    var c = getCtx();
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.08);
    gain.gain.setValueAtTime(vol * 0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.12);
  }

  // ============================================================
  // SCHEDULER
  // ============================================================

  function scheduler() {
    var c = getCtx();
    var song = songs[currentSong];
    var step = 60 / song.bpm / 4;

    while (nextNoteTime < c.currentTime + 0.1) {
      var i = currentStep % song.steps;

      // Swing: delay odd 16th notes slightly for shuffle feel
      var t = nextNoteTime;
      if (song.swing && (i % 2 === 1)) {
        t += step * song.swing;
      }

      playLead(song.melody[i], t, song.accents[i], song);
      playBass(song.bass[i], t, song);
      playClosed(song.hat[i], t);
      if (song.openHat) playOpen(song.openHat[i], t);
      if (song.ride) playRide(song.ride[i], t);
      playKick(song.kick[i], t);

      nextNoteTime += step;
      currentStep++;
    }
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  function start() {
    if (isPlaying) return;
    var c = getCtx();
    isPlaying = true;
    currentStep = 0;
    nextNoteTime = c.currentTime + 0.05;
    masterGain.gain.cancelScheduledValues(c.currentTime);
    masterGain.gain.setValueAtTime(0, c.currentTime);
    masterGain.gain.linearRampToValueAtTime(VOLUME, c.currentTime + 0.8);
    timerId = setInterval(scheduler, 25);
  }

  function stop() {
    if (!isPlaying) return;
    isPlaying = false;
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    if (masterGain && ctx) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    }
  }

  function setSong(index) {
    if (index < 0 || index >= songs.length) return;
    if (isPlaying) stop();
    currentSong = index;
  }

  function getSongCount() { return songs.length; }
  function getSongName(index) { return songs[index] ? songs[index].name : ''; }
  function getCurrentSong() { return currentSong; }

  return {
    start: start,
    stop: stop,
    setSong: setSong,
    getSongCount: getSongCount,
    getSongName: getSongName,
    getCurrentSong: getCurrentSong
  };
})();
