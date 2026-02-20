/**
 * Éclairs - Background Music Engine
 * Bouncy lo-fi chiptune loop, Excite Bike-inspired syncopation
 * All synthesized via Web Audio API (zero audio files)
 */

var MusicEngine = (function() {
  'use strict';

  var ctx = null;
  var masterGain = null;
  var isPlaying = false;
  var timerId = null;
  var nextNoteTime = 0;
  var currentStep = 0;
  var VOLUME = 0.09;  // Quiet background level
  var BPM = 140;
  var STEP = 60 / BPM / 4;  // 16th note duration
  var TOTAL_STEPS = 64;     // 4 bars of 4/4

  // --- Note frequencies ---
  var C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88;
  var C5=523.25, D5=587.33, E5=659.25, G5=783.99;
  var C3=130.81, E3=164.81, F3=174.61, G3=196.00, A3=220.00, B3=246.94;
  var R = 0; // rest

  // --- Melody: 64 steps = 4 bars ---
  // Excite Bike vibe: bouncy ascending arpeggios, syncopated offbeat accents
  // Pattern: straight run → syncopated answer → higher phrase → landing
  var melody = [
    // Bar 1 — bouncy ascending run
    E4, R, G4, C5,   R, E5, D5, R,    C5, R, G4, R,    E4, R, G4, R,
    // Bar 2 — syncopated answer (offbeat hits)
    R, A4, R, C5,    E5, R, D5, R,    C5, A4, R, G4,   R, R, R, R,
    // Bar 3 — higher energy phrase
    G4, R, C5, E5,   R, G5, E5, R,    D5, R, C5, R,    A4, R, C5, R,
    // Bar 4 — resolution with bounce
    R, G4, R, A4,    C5, R, D5, C5,   R, G4, R, E4,    R, R, R, R
  ];

  // Accent pattern: 1 = louder, 0 = softer
  var accents = [
    1,0,0,1, 0,1,0,0,  1,0,0,0, 1,0,0,0,
    0,1,0,1, 1,0,0,0,  1,0,0,1, 0,0,0,0,
    1,0,1,1, 0,1,0,0,  1,0,0,0, 1,0,0,0,
    0,1,0,1, 1,0,1,1,  0,0,0,1, 0,0,0,0
  ];

  // Bass: root motion, plays on beats (every 8 steps = half notes)
  var bass = [
    C3,0,0,0, 0,0,0,0,   G3,0,0,0, 0,0,0,0,
    A3,0,0,0, 0,0,0,0,   E3,0,0,0, 0,0,0,0,
    C3,0,0,0, 0,0,0,0,   G3,0,0,0, 0,0,0,0,
    F3,0,0,0, 0,0,0,0,   G3,0,0,0, 0,0,0,0
  ];

  // Hi-hat: 8th note pulse with ghost notes
  var hat = [
    1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  1, 0, .5, 0,
    1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  .3,0, .3, 0,
    1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  1, 0, .5, 0,
    1, 0, .5, 0,  1, 0, .5, 0,   1, 0, .5, 0,  .3,0, .3, 0
  ];

  // Kick: four-on-the-floor with ghost on & of 2
  var kick = [
    1, 0, 0, 0,  0, 0,.4, 0,   1, 0, 0, 0,  0, 0,.4, 0,
    1, 0, 0, 0,  0, 0,.4, 0,   1, 0, 0, 0,  0, 0, 0, 0,
    1, 0, 0, 0,  0, 0,.4, 0,   1, 0, 0, 0,  0, 0,.4, 0,
    1, 0, 0, 0,  0, 0,.4, 0,   1, 0, 0, 0,  0, 0, 0, 0
  ];

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

  // --- Voice: Lead (square wave + low-pass filter for lo-fi warmth) ---
  function playLead(freq, time, accent) {
    if (freq === R) return;
    var c = getCtx();
    var osc = c.createOscillator();
    var filter = c.createBiquadFilter();
    var gain = c.createGain();
    var vol = accent ? 0.3 : 0.18;
    var dur = STEP * 0.75;

    osc.type = 'square';
    osc.frequency.value = freq;

    // Lo-fi warmth: roll off harsh upper harmonics
    filter.type = 'lowpass';
    filter.frequency.value = accent ? 3000 : 2000;
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

  // --- Voice: Bass (triangle wave, warm) ---
  function playBass(freq, time) {
    if (!freq) return;
    var c = getCtx();
    var osc = c.createOscillator();
    var gain = c.createGain();
    var dur = STEP * 6;

    osc.type = 'triangle';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + dur);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + dur + 0.01);
  }

  // --- Voice: Hi-hat (filtered noise) ---
  function playHat(vol, time) {
    if (vol <= 0) return;
    var c = getCtx();
    var bufLen = Math.floor(c.sampleRate * 0.025);
    var buffer = c.createBuffer(1, bufLen, c.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
    }
    var src = c.createBufferSource();
    src.buffer = buffer;
    var filter = c.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;
    var gain = c.createGain();
    gain.gain.setValueAtTime(vol * 0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    src.start(time);
  }

  // --- Voice: Kick (sine pitch drop) ---
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

  // --- Scheduler (look-ahead, prevents timing drift) ---
  function scheduler() {
    var c = getCtx();
    while (nextNoteTime < c.currentTime + 0.1) {
      var step = currentStep % TOTAL_STEPS;

      playLead(melody[step], nextNoteTime, accents[step]);
      playBass(bass[step], nextNoteTime);
      playHat(hat[step], nextNoteTime);
      playKick(kick[step], nextNoteTime);

      nextNoteTime += STEP;
      currentStep++;
    }
  }

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

  return {
    start: start,
    stop: stop
  };
})();
