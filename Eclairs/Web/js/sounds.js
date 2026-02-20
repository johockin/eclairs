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

  return {
    playCorrect: playCorrect,
    playWrong: playWrong
  };
})();
