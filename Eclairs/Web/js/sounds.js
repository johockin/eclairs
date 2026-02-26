/**
 * Éclairs - Sound Effects Engine
 * All sounds synthesized via Web Audio API (zero audio files)
 */

var SoundEngine = (function() {
  'use strict';

  var ctx = null;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // --- CORRECT SOUND: Coin chime (Mario-inspired, warm and punchy) ---
  function playCorrect() {
    var c = getCtx();
    var now = c.currentTime;

    // Low-pass filter to tame the square wave harmonics — warm, not shrill
    var filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2800;
    filter.Q.value = 0.7;
    filter.connect(c.destination);

    // Note 1: B4 (lower octave — more body)
    var osc1 = c.createOscillator();
    var gain1 = c.createGain();
    osc1.type = 'square';
    osc1.frequency.value = 494;
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(filter);
    osc1.start(now);
    osc1.stop(now + 0.13);

    // Note 2: E5 (a fourth up — satisfying pop, holds longer)
    var osc2 = c.createOscillator();
    var gain2 = c.createGain();
    osc2.type = 'square';
    osc2.frequency.value = 659;
    gain2.gain.setValueAtTime(0.2, now + 0.07);
    gain2.gain.setValueAtTime(0.2, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start(now + 0.07);
    osc2.stop(now + 0.46);
  }

  // --- WRONG SOUNDS: 8 comical effects, cycled ---

  var wrongIndex = 0;
  var wrongSounds = [
    playSadTrombone,
    playBoing,
    playBuzzer,
    playSlideWhistle,
    playBonk,
    playRecordScratch,
    playDeflate,
    playWompWomp
  ];

  function playWrong() {
    wrongSounds[wrongIndex]();
    wrongIndex = (wrongIndex + 1) % wrongSounds.length;
  }

  // 1. Sad trombone - descending "wah wah wah wahhh"
  function playSadTrombone() {
    var c = getCtx();
    var now = c.currentTime;
    var notes = [293.66, 277.18, 261.63, 220.00]; // D4, C#4, C4, A3
    var durations = [0.25, 0.25, 0.25, 0.6];
    var offset = 0;

    for (var i = 0; i < notes.length; i++) {
      (function(freq, start, dur) {
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        // Vibrato on last note
        if (freq === 220) {
          var lfo = c.createOscillator();
          var lfoGain = c.createGain();
          lfo.frequency.value = 5;
          lfoGain.gain.value = 8;
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start(now + start);
          lfo.stop(now + start + dur);
        }
        gain.gain.setValueAtTime(0.15, now + start);
        gain.gain.exponentialRampToValueAtTime(0.01, now + start + dur);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now + start);
        osc.stop(now + start + dur);
      })(notes[i], offset, durations[i]);
      offset += durations[i];
    }
  }

  // 2. Boing - springy bounce
  function playBoing() {
    var c = getCtx();
    var now = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // 3. Buzzer - game show wrong answer
  function playBuzzer() {
    var c = getCtx();
    var now = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'square';
    osc.frequency.value = 85;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.setValueAtTime(0.15, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  // 4. Slide whistle down
  function playSlideWhistle() {
    var c = getCtx();
    var now = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  }

  // 5. Cartoon bonk - low thud with overtone
  function playBonk() {
    var c = getCtx();
    var now = c.currentTime;

    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.2);

    // Overtone crack
    var osc2 = c.createOscillator();
    var gain2 = c.createGain();
    osc2.type = 'triangle';
    osc2.frequency.value = 800;
    gain2.gain.setValueAtTime(0.15, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
    osc2.connect(gain2);
    gain2.connect(c.destination);
    osc2.start(now);
    osc2.stop(now + 0.06);
  }

  // 6. Record scratch - noise burst
  function playRecordScratch() {
    var c = getCtx();
    var now = c.currentTime;
    var bufferSize = c.sampleRate * 0.15;
    var buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    var noise = c.createBufferSource();
    noise.buffer = buffer;
    var filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 2;
    var gain = c.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    noise.start(now);
  }

  // 7. Deflate / whoopee cushion - descending with vibrato
  function playDeflate() {
    var c = getCtx();
    var now = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.6);

    var lfo = c.createOscillator();
    var lfoGain = c.createGain();
    lfo.frequency.value = 25;
    lfoGain.gain.value = 30;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + 0.6);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  // 8. Womp womp - two descending notes
  function playWompWomp() {
    var c = getCtx();
    var now = c.currentTime;

    // Womp 1
    var osc1 = c.createOscillator();
    var gain1 = c.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(350, now);
    osc1.frequency.exponentialRampToValueAtTime(300, now + 0.25);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(c.destination);
    osc1.start(now);
    osc1.stop(now + 0.28);

    // Womp 2 (lower)
    var osc2 = c.createOscillator();
    var gain2 = c.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(280, now + 0.3);
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.7);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.75);
    osc2.connect(gain2);
    gain2.connect(c.destination);
    osc2.start(now + 0.3);
    osc2.stop(now + 0.75);
  }

  // --- MENU SOUNDS: Distinct personality per button ---

  // Practice: Power-up launch — fast ascending arpeggio, "let's GO"
  function playMenuPractice() {
    var c = getCtx();
    var now = c.currentTime;
    var notes = [330, 440, 554, 659]; // E4, A4, C#5, E5
    var filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 3200;
    filter.connect(c.destination);

    for (var i = 0; i < notes.length; i++) {
      (function(freq, t) {
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.14, now + t);
        gain.gain.exponentialRampToValueAtTime(0.01, now + t + 0.08);
        osc.connect(gain);
        gain.connect(filter);
        osc.start(now + t);
        osc.stop(now + t + 0.09);
      })(notes[i], i * 0.055);
    }

    // Final shimmer — the top note rings out
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'square';
    osc.frequency.value = 659;
    gain.gain.setValueAtTime(0.12, now + 0.22);
    gain.gain.setValueAtTime(0.12, now + 0.28);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
    osc.connect(gain);
    gain.connect(filter);
    osc.start(now + 0.22);
    osc.stop(now + 0.56);
  }

  // Stats: Data readout — quick descending computer beep triplet
  function playMenuStats() {
    var c = getCtx();
    var now = c.currentTime;
    var notes = [880, 660, 880]; // A5, E5, A5

    for (var i = 0; i < notes.length; i++) {
      (function(freq, t) {
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, now + t);
        gain.gain.exponentialRampToValueAtTime(0.01, now + t + 0.06);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now + t);
        osc.stop(now + t + 0.07);
      })(notes[i], i * 0.07);
    }
  }

  // Settings: Mechanical ratchet — two clicky pops with a gear-turn wobble
  function playMenuSettings() {
    var c = getCtx();
    var now = c.currentTime;

    // Click 1 — sharp pop
    var osc1 = c.createOscillator();
    var gain1 = c.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(600, now);
    osc1.frequency.exponentialRampToValueAtTime(200, now + 0.04);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc1.connect(gain1);
    gain1.connect(c.destination);
    osc1.start(now);
    osc1.stop(now + 0.06);

    // Click 2 — slightly lower, offset
    var osc2 = c.createOscillator();
    var gain2 = c.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(500, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(160, now + 0.12);
    gain2.gain.setValueAtTime(0.14, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.13);
    osc2.connect(gain2);
    gain2.connect(c.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.14);

    // Gear wobble — low sine wiggle
    var osc3 = c.createOscillator();
    var gain3 = c.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(180, now + 0.06);
    osc3.frequency.exponentialRampToValueAtTime(120, now + 0.2);
    gain3.gain.setValueAtTime(0.08, now + 0.06);
    gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc3.connect(gain3);
    gain3.connect(c.destination);
    osc3.start(now + 0.06);
    osc3.stop(now + 0.23);
  }

  // Back: Soft retreat pop — quick descending blip
  function playMenuBack() {
    var c = getCtx();
    var now = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.08);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  // Mode switch: Whoosh-flip — rising sweep + short noise burst (card flip feel)
  function playModeSwitch() {
    var c = getCtx();
    var now = c.currentTime;

    // Rising sweep
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.23);

    // Noise whoosh
    var bufLen = Math.floor(c.sampleRate * 0.1);
    var buf = c.createBuffer(1, bufLen, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
    }
    var noise = c.createBufferSource();
    noise.buffer = buf;
    var hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 3000;
    var ng = c.createGain();
    ng.gain.setValueAtTime(0.06, now + 0.03);
    ng.gain.exponentialRampToValueAtTime(0.01, now + 0.13);
    noise.connect(hp);
    hp.connect(ng);
    ng.connect(c.destination);
    noise.start(now + 0.03);
  }

  // --- STREAK SOUNDS ---

  // Rising tone that gets higher with streak count (plays streak 3+)
  function playStreakTone(streak) {
    if (streak < 3) return;
    var c = getCtx();
    var now = c.currentTime;
    var freq = Math.min(300 + (streak * 40), 2000);
    var vol = Math.min(0.032 + streak * 0.00525, 0.158);
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Milestone chimes — play INSTEAD of streak tone at exact thresholds

  // Streak 5: Single bright ding (E5)
  function playDing() {
    var c = getCtx();
    var now = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 659; // E5
    gain.gain.setValueAtTime(0.189, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Streak 10: 3-note ascending (C5→E5→G5)
  function playBaDaDing() {
    var c = getCtx();
    var now = c.currentTime;
    var notes = [523, 659, 784]; // C5, E5, G5
    for (var i = 0; i < notes.length; i++) {
      (function(freq, t) {
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.168, now + t);
        gain.gain.exponentialRampToValueAtTime(0.01, now + t + 0.12);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now + t);
        osc.stop(now + t + 0.14);
      })(notes[i], i * 0.1);
    }
  }

  // Streak 20: 5-note melody (C5→E5→G5→A5→C6)
  function playMiniMelody() {
    var c = getCtx();
    var now = c.currentTime;
    var notes = [523, 659, 784, 880, 1047]; // C5, E5, G5, A5, C6
    for (var i = 0; i < notes.length; i++) {
      (function(freq, t) {
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.158, now + t);
        gain.gain.exponentialRampToValueAtTime(0.01, now + t + 0.1);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now + t);
        osc.stop(now + t + 0.12);
      })(notes[i], i * 0.09);
    }
  }

  // Streak 50+: Celebratory fanfare (8 notes with harmonics)
  function playCelebration() {
    var c = getCtx();
    var now = c.currentTime;
    var notes = [523, 659, 784, 1047, 784, 880, 1047, 1319]; // C5 E5 G5 C6 G5 A5 C6 E6
    var vol = 0.168;
    var filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 4000;
    filter.connect(c.destination);
    for (var i = 0; i < notes.length; i++) {
      (function(freq, t) {
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, now + t);
        gain.gain.exponentialRampToValueAtTime(0.01, now + t + 0.14);
        osc.connect(gain);
        gain.connect(filter);
        osc.start(now + t);
        osc.stop(now + t + 0.16);
      })(notes[i], i * 0.12);
    }
  }

  // Dispatch milestone chime by streak value
  // Returns true if a milestone was played, false otherwise
  function isMilestone(streak) {
    if (streak < 5) return false;
    if (streak <= 50) return streak % 5 === 0;
    if (streak <= 100) return streak % 10 === 0;
    return streak % 50 === 0;
  }

  function playMilestoneChime(streak) {
    if (!isMilestone(streak)) return false;
    if (streak === 5) { playDing(); return true; }
    if (streak <= 15) { playBaDaDing(); return true; }
    if (streak <= 45) { playMiniMelody(); return true; }
    playCelebration(); return true;
  }

  return {
    playCorrect: playCorrect,
    playWrong: playWrong,
    playMenuPractice: playMenuPractice,
    playMenuStats: playMenuStats,
    playMenuSettings: playMenuSettings,
    playMenuBack: playMenuBack,
    playModeSwitch: playModeSwitch,
    playStreakTone: playStreakTone,
    playMilestoneChime: playMilestoneChime
  };
})();
