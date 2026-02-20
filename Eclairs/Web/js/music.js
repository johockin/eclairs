/**
 * Éclairs - Background Music Engine
 * Three selectable chiptune loops, all Web Audio API synthesized
 * Song 1: Bouncy C major (Excite Bike-inspired) with CR-78 drums
 * Song 2: Minor key, slower, sadder but still bouncy
 * Song 3: Shuffly jazz (Steely Dan "Peg"-inspired groove)
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
    // --- SONG 0: BOUNCY (C major, 140 BPM, Excite Bike vibe) ---
    {
      name: 'Bouncy',
      bpm: 140,
      steps: 64,
      swing: 0,
      melody: [
        n.E4, R, n.G4, n.C5,  R, n.E5, n.D5, R,   n.C5, R, n.G4, R,   n.E4, R, n.G4, R,
        R, n.A4, R, n.C5,     n.E5, R, n.D5, R,    n.C5, n.A4, R, n.G4,R, R, R, R,
        n.G4, R, n.C5, n.E5,  R, n.G5, n.E5, R,    n.D5, R, n.C5, R,   n.A4, R, n.C5, R,
        R, n.G4, R, n.A4,     n.C5, R, n.D5, n.C5, R, n.G4, R, n.E4,   R, R, R, R
      ],
      accents: [
        1,0,0,1, 0,1,0,0,  1,0,0,0, 1,0,0,0,
        0,1,0,1, 1,0,0,0,  1,0,0,1, 0,0,0,0,
        1,0,1,1, 0,1,0,0,  1,0,0,0, 1,0,0,0,
        0,1,0,1, 1,0,1,1,  0,0,0,1, 0,0,0,0
      ],
      bass: [
        n.C3,0,0,0, 0,0,0,0,  n.G3,0,0,0, 0,0,0,0,
        n.A3,0,0,0, 0,0,0,0,  n.E3,0,0,0, 0,0,0,0,
        n.C3,0,0,0, 0,0,0,0,  n.G3,0,0,0, 0,0,0,0,
        n.F3,0,0,0, 0,0,0,0,  n.G3,0,0,0, 0,0,0,0
      ],
      hat: [
        1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  1, 0, .5, 0,
        1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  .3,0, .3, 0,
        1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  1, 0, .5, 0,
        1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  .3,0, .3, 0
      ],
      // CR-78 style: open hat on off-beats, ride on quarters
      openHat: [
        0,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,1,0,
        0,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,1,0,
        0,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,0,0
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

    // --- SONG 1: MINOR KEY (A minor, 118 BPM, sadder but bouncy) ---
    {
      name: 'Mellow',
      bpm: 118,
      steps: 64,
      swing: 0,
      melody: [
        // Bar 1 — descending minor arpeggio, melancholy
        n.E5, R, n.C5, R,     n.A4, R, n.E4, R,    n.A4, R, n.C5, R,   n.B4, R, R, R,
        // Bar 2 — syncopated sighing phrase
        R, n.D5, R, n.C5,     n.A4, R, R, n.G4,    n.A4, R, n.E4, R,   R, R, R, R,
        // Bar 3 — reaching upward, then falling
        n.E4, R, n.A4, n.C5,  R, n.E5, n.D5, R,    n.C5, R, n.B4, R,   n.A4, R, n.G4, R,
        // Bar 4 — resolution, gentle landing
        R, n.A4, R, n.E4,     n.F4, R, n.E4, R,    n.D4, R, R, n.E4,   R, R, R, R
      ],
      accents: [
        1,0,0,0, 1,0,0,0,  1,0,0,0, 1,0,0,0,
        0,1,0,1, 1,0,0,0,  1,0,0,0, 0,0,0,0,
        1,0,1,1, 0,1,0,0,  1,0,1,0, 1,0,0,0,
        0,1,0,1, 1,0,0,0,  1,0,0,1, 0,0,0,0
      ],
      bass: [
        n.A3,0,0,0, 0,0,0,0,   n.E3,0,0,0, 0,0,0,0,
        n.F3,0,0,0, 0,0,0,0,   n.E3,0,0,0, 0,0,0,0,
        n.A3,0,0,0, 0,0,0,0,   n.G3,0,0,0, 0,0,0,0,
        n.F3,0,0,0, 0,0,0,0,   n.E3,0,0,0, 0,0,0,0
      ],
      hat: [
        1, 0, .4, 0,  1, 0, .4, 0,   1, 0, .4, 0,  1, 0, .4, 0,
        1, 0, .4, 0,  1, 0, .4, 0,   1, 0, .4, 0,  .2,0, .2, 0,
        1, 0, .4, 0,  1, 0, .4, 0,   1, 0, .4, 0,  1, 0, .4, 0,
        1, 0, .4, 0,  1, 0, .4, 0,   1, 0, .4, 0,  .2,0, .2, 0
      ],
      openHat: [
        0,0,0,0, 0,0,.7,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,.7,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,.7,0,  0,0,0,0, 0,0,.7,0,
        0,0,0,0, 0,0,0,0,   0,0,0,0, 0,0,0,0
      ],
      ride: [
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0,
        .6,0,0,0, .6,0,0,0,  .6,0,0,0, .6,0,0,0,
        .6,0,0,0, .6,0,0,0,  .6,0,0,0, 0,0,0,0
      ],
      kick: [
        1, 0, 0, 0,  0, 0, 0, 0,   1, 0, 0, 0,  0, 0,.3, 0,
        1, 0, 0, 0,  0, 0, 0, 0,   1, 0, 0, 0,  0, 0, 0, 0,
        1, 0, 0, 0,  0, 0,.3, 0,   1, 0, 0, 0,  0, 0,.3, 0,
        1, 0, 0, 0,  0, 0, 0, 0,   1, 0, 0, 0,  0, 0, 0, 0
      ],
      leadType: 'triangle',
      filterFreq: 1800
    },

    // --- SONG 2: JAZZ SHUFFLE (G major, 115 BPM, Peg-inspired) ---
    // Chromatic walkdowns, plagal cadences, swing 16ths
    {
      name: 'Jazzy',
      bpm: 115,
      steps: 64,
      swing: 0.12,  // swing offset for shuffle feel
      melody: [
        // Bar 1 — Gmaj9 arpeggio with chromatic passing tones
        n.B4, R, n.D5, n.Fs5,  R, n.G5, n.Fs5, R,   n.E5, R, n.D5, R,   n.B4, R, n.A4, R,
        // Bar 2 — walkdown: F#→F→E, syncopated
        R, n.Fs4, R, n.A4,     n.D5, R, n.C5, R,     n.E4, n.G4, R, n.B4, R, R, R, R,
        // Bar 3 — Cmaj7→G resolution, bouncy
        n.G4, R, n.B4, n.D5,   R, n.E5, n.D5, R,     n.C5, R, n.A4, R,   n.G4, R, n.Fs4, R,
        // Bar 4 — Am7→D7 turnaround
        R, n.A4, R, n.C5,      n.E5, R, n.D5, n.Fs5, R, n.D5, R, n.B4,   R, R, R, R
      ],
      accents: [
        1,0,0,1, 0,1,0,0,  1,0,0,0, 0,0,1,0,
        0,1,0,1, 1,0,0,0,  1,0,0,1, 0,0,0,0,
        1,0,1,1, 0,1,0,0,  1,0,1,0, 0,0,1,0,
        0,1,0,1, 1,0,1,1,  0,0,0,1, 0,0,0,0
      ],
      bass: [
        n.G3,0,0,0, 0,0,0,0,   n.Fs3,0,0,0, 0,0,0,0,
        n.F3,0,0,0, 0,0,0,0,   n.E3,0,0,0, 0,0,0,0,
        n.C3,0,0,0, 0,0,0,0,   n.G3,0,0,0, 0,0,0,0,
        n.A3,0,0,0, 0,0,0,0,   n.D3,0,0,0, 0,0,0,0
      ],
      // Shuffle hats: busier, ghosty
      hat: [
        1, 0, .6, .3,  1, 0, .6, .3,  1, 0, .6, .3,  1, 0, .6, .3,
        1, 0, .6, .3,  1, 0, .6, .3,  1, 0, .6, .3,  .5, 0, .3, 0,
        1, 0, .6, .3,  1, 0, .6, .3,  1, 0, .6, .3,  1, 0, .6, .3,
        1, 0, .6, .3,  1, 0, .6, .3,  1, 0, .6, .3,  .5, 0, .3, 0
      ],
      openHat: [
        0,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,1,0,
        0,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,0,0,
        0,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,1,0,
        0,0,0,0, 0,0,1,0,  0,0,0,0, 0,0,0,0
      ],
      // Ride bell on all quarters — jazzy shimmer
      ride: [
        1, 0, .5, 0,  1, 0, .5, 0,  1, 0, .5, 0,  1, 0, .5, 0,
        1, 0, .5, 0,  1, 0, .5, 0,  1, 0, .5, 0,  1, 0, .5, 0,
        1, 0, .5, 0,  1, 0, .5, 0,  1, 0, .5, 0,  1, 0, .5, 0,
        1, 0, .5, 0,  1, 0, .5, 0,  1, 0, .5, 0,  1, 0, .5, 0
      ],
      // Kick: syncopated, jazzy
      kick: [
        1, 0, 0, 0,  0, 0, 0, 0,   .5,0, 0, 0,  0, 0,.4, 0,
        1, 0, 0, 0,  0, 0,.3, 0,   1, 0, 0, 0,  0, 0, 0, 0,
        1, 0, 0, 0,  0, 0, 0, 0,   .5,0, 0, 0,  0, 0,.4, 0,
        1, 0, 0, 0,  0, 0,.3, 0,   1, 0, 0, 0,  0, 0, 0, 0
      ],
      leadType: 'square',
      filterFreq: 2500
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
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    }
  }

  function setSong(index) {
    if (index < 0 || index >= songs.length) return;
    var wasPlaying = isPlaying;
    if (wasPlaying) stop();
    currentSong = index;
    if (wasPlaying) {
      // Small delay so fade-out finishes before restart
      setTimeout(start, 450);
    }
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
