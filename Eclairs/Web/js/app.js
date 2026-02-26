/**
 * Éclairs - French Phonics & Numbers Flashcards
 * Screens: Home (flip), Practice, Config, Stats, Numbers-Config, Numbers-Stats
 */

(function() {
  'use strict';

  // --- State ---
  var currentMode = 'phonics'; // 'phonics' or 'numbers'
  var lastColorIndex = -1;
  var lastPracticeItem = null;
  var currentPracticeItem = null; // string id (phonics) or number (numbers)
  var sessionCorrect = 0;
  var sessionTotal = 0;
  var statsPaused = false;
  var inputLocked = false;
  var musicOff = false;
  var currentStreak = 0;
  var bestStreak = 0;

  // --- Mode Colors ---
  var PHONICS_HOME = { bg: '#E6E6FA', text: '#4A148C' };
  var NUMBERS_HOME = { bg: '#FFF8E7', text: '#1A2744' };

  function getHomeColor() {
    return currentMode === 'numbers' ? NUMBERS_HOME : PHONICS_HOME;
  }

  function getActivePalettes() {
    return currentMode === 'numbers' ? NumberEngine.getColorPalettes() : colorPalettes;
  }

  // --- Routing ---

  var screens = ['home', 'practice', 'config', 'stats', 'numbers-config', 'numbers-stats'];

  function showScreen(id) {
    screens.forEach(function(s) {
      var el = document.getElementById('screen-' + s);
      if (el) el.classList.toggle('active', s === id);
    });

    // Route to correct handler based on screen + mode
    if (id === 'practice') initPracticeMode();
    if (id === 'config') renderConfig();
    if (id === 'stats') renderStats();
    if (id === 'numbers-config') renderNumbersConfig();
    if (id === 'numbers-stats') renderNumbersStats();

    // "numbers-practice" maps to shared practice screen with numbers mode
    // (handled via data-nav mapping in init)

    // Background music: play everywhere except practice (if not toggled off)
    if (id !== 'practice' && !musicOff) {
      MusicEngine.start();
    } else {
      MusicEngine.stop();
    }

    // Reset home colors when leaving practice
    if (id !== 'practice') {
      var home = getHomeColor();
      document.body.style.setProperty('--bg-color', home.bg);
      document.body.style.setProperty('--text-color', home.text);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', home.bg);
    }
  }

  function navigate(screen) {
    // Map numbers nav targets to correct screens/modes
    if (screen === 'numbers-practice') {
      currentMode = 'numbers';
      showScreen('practice');
      return;
    }
    if (screen === 'practice' && currentMode !== 'numbers') {
      currentMode = 'phonics';
    }
    showScreen(screen);
  }

  // --- Color Cycling ---

  function getNextColor() {
    var palettes = getActivePalettes();
    if (palettes.length <= 1) return palettes[0] || PHONICS_HOME;
    var index;
    do { index = Math.floor(Math.random() * palettes.length); }
    while (index === lastColorIndex);
    lastColorIndex = index;
    return palettes[index];
  }

  function applyColor(color) {
    document.body.style.setProperty('--bg-color', color.bg);
    document.body.style.setProperty('--text-color', color.text);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color.bg);
  }

  // ============================
  // MODE SWITCH (Flip Card)
  // ============================

  function toggleMode() {
    var card = document.getElementById('flip-card');
    if (!card) return;

    if (currentMode === 'phonics') {
      currentMode = 'numbers';
      card.classList.add('flipped');
    } else {
      currentMode = 'phonics';
      card.classList.remove('flipped');
    }

    // Update mode switch label
    var label = document.getElementById('mode-label');
    if (label) label.textContent = currentMode === 'phonics' ? 'Nombres' : 'Phonics';

    // Transition home background color
    var home = getHomeColor();
    document.body.style.setProperty('--bg-color', home.bg);
    document.body.style.setProperty('--text-color', home.text);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', home.bg);

    // Switch to appropriate song set if music is on
    if (!musicOff) {
      var targetSong = currentMode === 'numbers' ? 3 : 0;
      MusicEngine.setSong(targetSong);
      setTimeout(function() { MusicEngine.start(); }, 100);
      updateSongPicker();
    }
  }

  // ============================
  // PRACTICE MODE (shared screen, branched logic)
  // ============================

  function getBestStreakKey() {
    return currentMode === 'numbers' ? 'eclairs_best_streak_numbers' : 'eclairs_best_streak_phonics';
  }

  function loadBestStreak() {
    try { bestStreak = parseInt(localStorage.getItem(getBestStreakKey()), 10) || 0; }
    catch(e) { bestStreak = 0; }
  }

  function saveBestStreak() {
    try { localStorage.setItem(getBestStreakKey(), bestStreak); } catch(e) {}
  }

  function initPracticeMode() {
    sessionCorrect = 0;
    sessionTotal = 0;
    currentStreak = 0;
    inputLocked = false;
    lastColorIndex = -1;
    loadBestStreak();
    updateSessionCounter();
    updatePauseButton();
    updateStreakDisplay();
    showNextPracticeItem();
  }

  function getNextPracticeItem() {
    if (currentMode === 'numbers') {
      return NumberEngine.getNextNumber();
    }

    // Phonics mode
    var selected = Storage.getSelectedItems();
    if (selected.length === 0) return null;
    if (selected.length === 1) return selected[0];

    var weights = Storage.getWeights(selected);
    var totalWeight = 0;
    for (var i = 0; i < weights.length; i++) totalWeight += weights[i].weight;

    var next, attempts = 0;
    do {
      var r = Math.random() * totalWeight;
      var cumulative = 0;
      next = weights[0].item;
      for (var j = 0; j < weights.length; j++) {
        cumulative += weights[j].weight;
        if (r <= cumulative) { next = weights[j].item; break; }
      }
      attempts++;
    } while (next === lastPracticeItem && attempts < 10);
    lastPracticeItem = next;
    return next;
  }

  function showNextPracticeItem() {
    var item = getNextPracticeItem();
    if (item === null || item === undefined) {
      document.getElementById('practice-syllable').textContent = '?';
      document.getElementById('practice-counter').textContent = 'No items selected';
      updateTurnOffLabel('?');
      return;
    }
    currentPracticeItem = item;

    // Display
    var display;
    if (currentMode === 'numbers') {
      display = NumberEngine.getDisplay(item);
    } else {
      display = PracticeItems.getDisplay(item);
    }
    document.getElementById('practice-syllable').textContent = display;
    applyColor(getNextColor());
    inputLocked = false;

    // Turn-off button label
    if (currentMode === 'numbers') {
      var tierIdx = NumberEngine.getTierForNumber(item);
      var tiers = NumberEngine.getTiers();
      var tierLabel = tiers[tierIdx] ? tiers[tierIdx].label : '?';
      updateTurnOffLabel(tierLabel);
    } else {
      updateTurnOffLabel(PracticeItems.getDisplay(item));
    }

    // Reset turn-off confirmation state
    turnOffConfirmItem = null;
    clearTimeout(turnOffTimer);
  }

  function updateTurnOffLabel(text) {
    var btn = document.getElementById('btn-turn-off');
    if (btn) {
      btn.innerHTML = 'Turn off <span id="turn-off-label">' + text + '</span>';
      btn.classList.remove('confirm');
    }
  }

  function scorePractice(correct) {
    if (currentPracticeItem === null || currentPracticeItem === undefined || inputLocked) return;
    inputLocked = true;

    // Record stats (unless paused)
    if (!statsPaused) {
      if (currentMode === 'numbers') {
        NumberEngine.recordAttempt(currentPracticeItem, correct);
        var numResult = NumberEngine.assess();
        if (numResult.demoted.length > 0) {
          var demLabels = numResult.demoted.map(function(t) {
            var tier = NumberEngine.getTiers()[t];
            return tier ? tier.label : t;
          });
          showAssessNotice('Removed tier: ' + demLabels.join(', '));
        } else if (numResult.promoted.length > 0) {
          var proLabels = numResult.promoted.map(function(t) {
            var tier = NumberEngine.getTiers()[t];
            return tier ? tier.label : t;
          });
          showAssessNotice('New tier: ' + proLabels.join(', '));
        }
      } else {
        Storage.recordAttempt(currentPracticeItem, correct);
        var result = Storage.assess();
        if (result.demoted.length > 0) {
          showAssessNotice('Removed: ' + result.demoted.map(function(id) {
            return PracticeItems.getDisplay(id);
          }).join(', ') + ' (too hard for now)');
        } else if (result.promoted.length > 0) {
          showAssessNotice('New: ' + result.promoted.map(function(id) {
            return PracticeItems.getDisplay(id);
          }).join(', '));
        }
      }
    }
    sessionTotal++;
    if (correct) sessionCorrect++;

    // Streak tracking
    if (correct) {
      currentStreak++;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
        saveBestStreak();
      }
    } else {
      currentStreak = 0;
    }
    updateSessionCounter();
    updateStreakDisplay();

    // Celebration system
    if (correct && isMilestone(currentStreak)) {
      showCelebration(currentStreak);
    }

    // Sound + haptics
    if (correct) {
      SoundEngine.playCorrect();
      // Streak sounds: milestone chime OR rising tone (not both)
      if (!SoundEngine.playMilestoneChime(currentStreak)) {
        SoundEngine.playStreakTone(currentStreak);
      }
      Haptics.success();
    } else {
      SoundEngine.playWrong();
      Haptics.error();
    }

    // Button-level feedback animation
    var btn = correct ? document.getElementById('btn-correct') : document.getElementById('btn-wrong');
    btn.classList.add('pulse');
    setTimeout(function() { btn.classList.remove('pulse'); }, 250);

    // Next item — fast
    setTimeout(showNextPracticeItem, 150);
  }

  function updateSessionCounter() {
    var el = document.getElementById('practice-counter');
    if (!el) return;
    if (sessionTotal === 0) {
      el.textContent = 'Ready!';
    } else {
      var pct = Math.round((sessionCorrect / sessionTotal) * 100);
      el.textContent = sessionCorrect + '/' + sessionTotal + ' (' + pct + '%)';
    }
  }

  // --- Assess Notice ---

  var assessTimer = null;
  function showAssessNotice(msg) {
    var el = document.getElementById('practice-counter');
    if (!el) return;
    clearTimeout(assessTimer);
    el.textContent = msg;
    el.classList.add('assess-notice');
    assessTimer = setTimeout(function() {
      el.classList.remove('assess-notice');
      updateSessionCounter();
    }, 2500);
  }

  // --- Milestone Check ---

  function isMilestone(streak) {
    if (streak < 5) return false;
    if (streak <= 50) return streak % 5 === 0;
    if (streak <= 100) return streak % 10 === 0;
    return streak % 50 === 0;
  }

  // --- Streak Scoreboard ---

  function updateStreakDisplay() {
    var bestEl = document.getElementById('streak-best-val');
    var curEl = document.getElementById('streak-current-val');
    if (!bestEl || !curEl) return;

    bestEl.textContent = bestStreak;
    curEl.textContent = currentStreak;

    if (currentStreak >= 3) {
      curEl.classList.add('streak-active');
    } else {
      curEl.classList.remove('streak-active');
    }
  }

  // --- Celebration System ---

  var celebrationTimer = null;
  var celebrationFlashTimer = null;

  function showCelebration(streak) {
    var overlay = document.getElementById('celebration-overlay');
    if (!overlay) return;

    // Clear any previous celebration
    clearTimeout(celebrationTimer);
    clearInterval(celebrationFlashTimer);
    overlay.innerHTML = '';
    overlay.style.backgroundColor = '';

    // --- Tier config: faster escalation, everything bigger ---
    var emojiCount, emojiSize, duration, textContent, textSize, textFont, flashInterval, flashCount;

    if (streak >= 100) {
      emojiCount = 25; emojiSize = '12rem'; duration = 2500;
      textContent = 'MYTHIQUE !!!'; textSize = '8rem';
      textFont = 'Impact, "Arial Black", sans-serif';
      flashInterval = 60; flashCount = 18;
    } else if (streak >= 50) {
      emojiCount = 20; emojiSize = '10rem'; duration = 2000;
      textContent = 'LÉGENDAIRE !!'; textSize = '6rem';
      textFont = '"Marker Felt", "Comic Sans MS", "Chalkboard SE", cursive';
      flashInterval = 70; flashCount = 14;
    } else if (streak >= 45) {
      emojiCount = 16; emojiSize = '8rem'; duration = 1500;
      textContent = streak + ' d\'affilée !'; textSize = '5rem';
      textFont = '"Marker Felt", "Comic Sans MS", cursive';
      flashInterval = 80; flashCount = 10;
    } else if (streak >= 40) {
      emojiCount = 14; emojiSize = '7rem'; duration = 1400;
      textContent = 'EXTRAORDINAIRE !'; textSize = '4.5rem';
      textFont = '"Marker Felt", "Comic Sans MS", cursive';
      flashInterval = 90; flashCount = 8;
    } else if (streak >= 35) {
      emojiCount = 12; emojiSize = '6rem'; duration = 1300;
      textContent = streak + ' d\'affilée !'; textSize = '3.5rem';
      textFont = '"Trebuchet MS", "Gill Sans", sans-serif';
      flashInterval = 100; flashCount = 6;
    } else if (streak >= 30) {
      emojiCount = 10; emojiSize = '5rem'; duration = 1200;
      textContent = 'INCROYABLE !'; textSize = '3rem';
      textFont = '"Trebuchet MS", "Gill Sans", sans-serif';
      flashInterval = 110; flashCount = 5;
    } else if (streak >= 25) {
      emojiCount = 8; emojiSize = '4rem'; duration = 1100;
      textContent = streak + ' d\'affilée !'; textSize = '2.5rem';
      textFont = 'inherit';
      flashInterval = 130; flashCount = 3;
    } else if (streak >= 20) {
      emojiCount = 6; emojiSize = '3.5rem'; duration = 1000;
      textContent = 'MAGNIFIQUE !'; textSize = '2.2rem';
      textFont = 'inherit';
      flashInterval = 150; flashCount = 2;
    } else if (streak >= 15) {
      emojiCount = 5; emojiSize = '3rem'; duration = 900;
      textContent = streak + ' d\'affilée !'; textSize = '1.8rem';
      textFont = 'inherit';
      flashInterval = 0; flashCount = 1;
    } else if (streak >= 10) {
      emojiCount = 3; emojiSize = '2.5rem'; duration = 700;
      textContent = streak + ' d\'affilée !'; textSize = '1.5rem';
      textFont = 'inherit';
      flashInterval = 0; flashCount = 1;
    } else {
      // streak 5
      emojiCount = 2; emojiSize = '2rem'; duration = 600;
      textContent = streak + ' d\'affilée !'; textSize = '1.3rem';
      textFont = 'inherit';
      flashInterval = 0; flashCount = 0;
    }

    // Pick emojis from appropriate pool
    var pool;
    if (streak >= 50) pool = ['🤩', '🎊', '🥳', '🤯', '🏅', '🦄', '💎', '🌈', '👑', '🎆'];
    else if (streak >= 35) pool = ['🚀', '💥', '🎉', '🙌', '👑', '🏆', '🔥'];
    else if (streak >= 15) pool = ['🔥', '🎯', '💪', '⚡', '🏆'];
    else pool = ['⭐', '✨', '💫', '🌟'];

    // Spawn emojis — with escalating sizes
    for (var i = 0; i < emojiCount; i++) {
      var span = document.createElement('span');
      span.className = 'celebration-emoji';
      span.textContent = pool[Math.floor(Math.random() * pool.length)];
      // Vary size: some normal, some huge
      var sizeVariation = 0.5 + Math.random() * 1.0; // 0.5x to 1.5x of base
      span.style.fontSize = 'calc(' + emojiSize + ' * ' + sizeVariation.toFixed(2) + ')';
      span.style.left = (-5 + Math.random() * 100) + '%';
      span.style.bottom = (-10 + Math.random() * 15) + '%';
      span.style.animationDelay = (Math.random() * 0.4) + 's';
      span.style.animationDuration = (0.9 + Math.random() * 0.8) + 's';
      overlay.appendChild(span);
    }

    // Text flash — always shown now (even at 5)
    var text = document.createElement('div');
    text.className = 'celebration-text';
    text.textContent = textContent;
    text.style.fontSize = textSize;
    if (textFont !== 'inherit') {
      text.style.fontFamily = textFont;
    }
    // At 40+ the text gets extra wild styling
    if (streak >= 50) {
      text.style.letterSpacing = '0.05em';
      text.style.textTransform = 'uppercase';
      text.style.webkitTextStroke = '2px rgba(0,0,0,0.15)';
    } else if (streak >= 40) {
      text.style.letterSpacing = '0.03em';
    }
    overlay.appendChild(text);

    // Background color flashes
    if (flashCount > 0 && flashInterval > 0) {
      var flashColors = ['#FFD54F', '#FF7043', '#AB47BC', '#42A5F5', '#66BB6A', '#FF4081'];
      // Higher streaks = more opaque flashes
      var flashOpacity = streak >= 50 ? '50' : streak >= 35 ? '40' : '30';
      var flashIdx = 0;
      var flashed = 0;
      celebrationFlashTimer = setInterval(function() {
        overlay.style.backgroundColor = flashColors[flashIdx % flashColors.length] + flashOpacity;
        flashIdx++;
        flashed++;
        if (flashed >= flashCount * 2) {
          clearInterval(celebrationFlashTimer);
          overlay.style.backgroundColor = '';
        } else {
          setTimeout(function() { overlay.style.backgroundColor = ''; }, flashInterval / 2);
        }
      }, flashInterval);
    } else if (flashCount === 1) {
      overlay.style.backgroundColor = 'rgba(255, 213, 79, 0.15)';
      setTimeout(function() { overlay.style.backgroundColor = ''; }, 300);
    }

    // Cleanup
    celebrationTimer = setTimeout(function() {
      clearInterval(celebrationFlashTimer);
      overlay.innerHTML = '';
      overlay.style.backgroundColor = '';
    }, duration + 800);
  }

  // --- Pause Stats ---

  function togglePauseStats() {
    statsPaused = !statsPaused;
    updatePauseButton();
  }

  function updatePauseButton() {
    var btn = document.getElementById('btn-pause-stats');
    if (btn) {
      btn.textContent = statsPaused ? 'Stats paused' : 'Stats on';
      btn.classList.toggle('paused', statsPaused);
    }
  }

  // --- Turn Off (two-tap confirmation) ---

  var turnOffConfirmItem = null;
  var turnOffTimer = null;

  function turnOffCurrentItem() {
    if (currentPracticeItem === null || currentPracticeItem === undefined) return;
    var btn = document.getElementById('btn-turn-off');
    if (!btn) return;

    if (currentMode === 'numbers') {
      turnOffNumberTier();
      return;
    }

    // Phonics: turn off individual item
    var selected = Storage.getSelectedItems();
    var filtered = selected.filter(function(id) { return id !== currentPracticeItem; });

    if (filtered.length === 0) {
      btn.textContent = "Can't — last item";
      btn.classList.add('confirm');
      setTimeout(function() { updateTurnOffLabel(PracticeItems.getDisplay(currentPracticeItem)); }, 1500);
      return;
    }

    if (turnOffConfirmItem !== currentPracticeItem) {
      turnOffConfirmItem = currentPracticeItem;
      btn.textContent = 'Tap again to confirm';
      btn.classList.add('confirm');
      clearTimeout(turnOffTimer);
      turnOffTimer = setTimeout(function() {
        updateTurnOffLabel(PracticeItems.getDisplay(currentPracticeItem));
        turnOffConfirmItem = null;
      }, 3000);
      return;
    }

    clearTimeout(turnOffTimer);
    turnOffConfirmItem = null;
    Storage.setSelectedItems(filtered);
    showNextPracticeItem();
  }

  function turnOffNumberTier() {
    var btn = document.getElementById('btn-turn-off');
    var tierIdx = NumberEngine.getTierForNumber(currentPracticeItem);
    var enabled = NumberEngine.getEnabledTiers();
    var filtered = enabled.filter(function(t) { return t !== tierIdx; });

    if (filtered.length === 0) {
      btn.textContent = "Can't — last tier";
      btn.classList.add('confirm');
      setTimeout(function() { showNextPracticeItem(); }, 1500);
      return;
    }

    var tierLabel = NumberEngine.getTiers()[tierIdx] ? NumberEngine.getTiers()[tierIdx].label : '?';

    if (turnOffConfirmItem !== tierIdx) {
      turnOffConfirmItem = tierIdx;
      btn.textContent = 'Turn off ' + tierLabel + '?';
      btn.classList.add('confirm');
      clearTimeout(turnOffTimer);
      turnOffTimer = setTimeout(function() {
        showNextPracticeItem();
        turnOffConfirmItem = null;
      }, 3000);
      return;
    }

    clearTimeout(turnOffTimer);
    turnOffConfirmItem = null;
    NumberEngine.setEnabledTiers(filtered);
    showNextPracticeItem();
  }

  // ============================
  // PHONICS CONFIG
  // ============================

  function renderConfig() {
    var container = document.getElementById('config-list');
    if (!container) return;
    container.innerHTML = '';

    var selected = Storage.getSelectedItems();
    var categories = PracticeItems.getCategories();
    var catOrder = ['letters', 'nasals', 'digraphs', 'accents', 'consonants'];

    catOrder.forEach(function(catKey) {
      var cat = categories[catKey];
      if (!cat) return;

      var header = document.createElement('div');
      header.className = 'config-category';
      header.textContent = cat.label;
      container.appendChild(header);

      var grid = document.createElement('div');
      grid.className = 'config-grid';

      cat.items.forEach(function(item) {
        var isOn = selected.indexOf(item.id) !== -1;
        var btn = document.createElement('button');
        btn.className = 'config-item' + (isOn ? ' selected' : '');
        btn.textContent = item.display;
        btn.setAttribute('data-id', item.id);
        btn.addEventListener('click', function() {
          btn.classList.toggle('selected');
          Haptics.select();
        });
        grid.appendChild(btn);
      });

      container.appendChild(grid);
    });
  }

  function saveConfig() {
    var buttons = document.querySelectorAll('#config-list .config-item.selected');
    var selected = [];
    buttons.forEach(function(btn) {
      selected.push(btn.getAttribute('data-id'));
    });

    if (selected.length === 0) {
      var msg = document.getElementById('config-message');
      if (msg) {
        msg.textContent = 'Select at least one item!';
        msg.classList.add('show');
        setTimeout(function() { msg.classList.remove('show'); }, 2000);
      }
      return;
    }

    Storage.setSelectedItems(selected);
    navigate('home');
  }

  function resetConfigDefaults() {
    Storage.setSelectedItems(PracticeItems.getDefaults());
    renderConfig();
  }

  function selectAllConfig() {
    document.querySelectorAll('#config-list .config-item').forEach(function(btn) {
      btn.classList.add('selected');
    });
  }

  function clearAllConfig() {
    document.querySelectorAll('#config-list .config-item').forEach(function(btn) {
      btn.classList.remove('selected');
    });
  }

  // ============================
  // NUMBERS CONFIG
  // ============================

  function renderNumbersConfig() {
    var container = document.getElementById('numconfig-list');
    if (!container) return;
    container.innerHTML = '';

    var enabled = NumberEngine.getEnabledTiers();
    var allTiers = NumberEngine.getTiers();

    allTiers.forEach(function(tier) {
      var isOn = enabled.indexOf(tier.id) !== -1;
      var btn = document.createElement('button');
      btn.className = 'config-item config-item-wide' + (isOn ? ' selected' : '');
      btn.textContent = tier.label + '  ' + tier.description;
      btn.setAttribute('data-tier', tier.id);
      btn.addEventListener('click', function() {
        btn.classList.toggle('selected');
        Haptics.select();
      });
      container.appendChild(btn);
    });
  }

  function saveNumbersConfig() {
    var buttons = document.querySelectorAll('#numconfig-list .config-item.selected');
    var selected = [];
    buttons.forEach(function(btn) {
      selected.push(parseInt(btn.getAttribute('data-tier'), 10));
    });

    if (selected.length === 0) {
      var msg = document.getElementById('numconfig-message');
      if (msg) {
        msg.textContent = 'Select at least one tier!';
        msg.classList.add('show');
        setTimeout(function() { msg.classList.remove('show'); }, 2000);
      }
      return;
    }

    NumberEngine.setEnabledTiers(selected);
    navigate('home');
  }

  function resetNumbersConfigDefaults() {
    NumberEngine.setEnabledTiers([0]);
    renderNumbersConfig();
  }

  function selectAllNumbersConfig() {
    document.querySelectorAll('#numconfig-list .config-item').forEach(function(btn) {
      btn.classList.add('selected');
    });
  }

  function clearAllNumbersConfig() {
    document.querySelectorAll('#numconfig-list .config-item').forEach(function(btn) {
      btn.classList.remove('selected');
    });
  }

  // ============================
  // PHONICS STATS
  // ============================

  function renderStats() {
    var container = document.getElementById('stats-content');
    if (!container) return;

    var summary = Storage.getSummary();
    var html = '';

    if (!summary || summary.totalAttempts === 0) {
      html = '<div class="stats-empty">' +
        '<p>No stats yet!</p>' +
        '<p class="stats-empty-sub">Practice to start tracking.</p>' +
        '</div>';
      container.innerHTML = html;
      return;
    }

    html += '<div class="stats-summary">';
    html += '<div class="stats-big-number">' + summary.overallPct + '%</div>';
    html += '<div class="stats-big-label">Career Accuracy</div>';
    html += '<div class="stats-row">';
    html += '<span>' + summary.totalAttempts + ' total</span>';
    html += '<span>' + summary.totalCorrect + ' correct</span>';
    html += '<span>' + summary.itemCount + ' items</span>';
    html += '</div>';
    if (summary.strongest && summary.strongest.total >= 3) {
      html += '<div class="stats-highlight good">Strongest: <strong>' +
        PracticeItems.getDisplay(summary.strongest.item) + '</strong> (' +
        summary.strongest.pct + '%)</div>';
    }
    if (summary.weakest && summary.weakest.total >= 3 && summary.weakest.item !== summary.strongest.item) {
      html += '<div class="stats-highlight weak">Needs work: <strong>' +
        PracticeItems.getDisplay(summary.weakest.item) + '</strong> (' +
        summary.weakest.pct + '%)</div>';
    }
    html += '</div>';

    var board = Storage.getLeaderboard();
    html += '<div class="stats-table">';
    html += '<div class="stats-table-header">';
    html += '<span class="stats-col-item">Item</span>';
    html += '<span class="stats-col-mastery"></span>';
    html += '<span class="stats-col">Career</span>';
    html += '<span class="stats-col">30d</span>';
    html += '<span class="stats-col">7d</span>';
    html += '<span class="stats-col">Today</span>';
    html += '</div>';

    board.forEach(function(entry) {
      var itemStats = Storage.getStats(entry.item);
      var m = Storage.getMastery(entry.item);
      html += '<div class="stats-table-row">';
      html += '<span class="stats-col-item stats-item-name">' + PracticeItems.getDisplay(entry.item) + '</span>';
      html += '<span class="stats-col-mastery"><span class="mastery-bar"><span class="mastery-fill' +
        (m.mastery >= 80 ? ' mastered' : '') + '" style="width:' + m.mastery + '%"></span></span></span>';
      html += renderStatCell(itemStats.career);
      html += renderStatCell(itemStats.last30);
      html += renderStatCell(itemStats.last7);
      html += renderStatCell(itemStats.today);
      html += '</div>';
    });

    html += '</div>';

    board.forEach(function(entry) {
      if (entry.bestStreak >= 3) {
        html += '<div class="stats-streak">' +
          PracticeItems.getDisplay(entry.item) + ': ' +
          entry.streak + ' current streak, ' +
          entry.bestStreak + ' best</div>';
      }
    });

    html += '<button class="toolbar-btn stats-reset-btn" id="btn-reset-stats">Reset all stats</button>';

    container.innerHTML = html;

    document.getElementById('btn-reset-stats').addEventListener('click', function(e) {
      e.stopPropagation();
      resetStats('phonics');
    });
  }

  // ============================
  // NUMBERS STATS
  // ============================

  function renderNumbersStats() {
    var container = document.getElementById('numbers-stats-content');
    if (!container) return;

    var summary = NumberEngine.getSummary();
    var html = '';

    if (!summary || summary.totalAttempts === 0) {
      html = '<div class="stats-empty">' +
        '<p>No stats yet!</p>' +
        '<p class="stats-empty-sub">Practice numbers to start tracking.</p>' +
        '</div>';
      container.innerHTML = html;
      return;
    }

    html += '<div class="stats-summary">';
    html += '<div class="stats-big-number">' + summary.overallPct + '%</div>';
    html += '<div class="stats-big-label">Career Accuracy</div>';
    html += '<div class="stats-row">';
    html += '<span>' + summary.totalAttempts + ' total</span>';
    html += '<span>' + summary.totalCorrect + ' correct</span>';
    html += '</div>';
    html += '</div>';

    // Tier rows with per-day stats
    var allTiers = NumberEngine.getTiers();
    var enabled = NumberEngine.getEnabledTiers();

    html += '<div class="stats-table">';
    html += '<div class="stats-table-header">';
    html += '<span class="stats-col-item">Tier</span>';
    html += '<span class="stats-col-mastery"></span>';
    html += '<span class="stats-col">Career</span>';
    html += '<span class="stats-col">30d</span>';
    html += '<span class="stats-col">7d</span>';
    html += '<span class="stats-col">Today</span>';
    html += '</div>';

    allTiers.forEach(function(tier) {
      var stats = NumberEngine.getTierStats(tier.id);
      var dayStats = NumberEngine.getTierDayStats(tier.id);
      var isLocked = enabled.indexOf(tier.id) === -1;
      html += '<div class="stats-table-row' + (isLocked ? ' stats-locked' : '') + '">';
      html += '<span class="stats-col-item stats-item-name">' + tier.label + (isLocked ? ' <small>locked</small>' : '') + '</span>';
      html += '<span class="stats-col-mastery"><span class="mastery-bar"><span class="mastery-fill' +
        (stats.mastery >= 80 ? ' mastered' : '') + '" style="width:' + stats.mastery + '%"></span></span></span>';
      html += renderStatCell(dayStats.career);
      html += renderStatCell(dayStats.last30);
      html += renderStatCell(dayStats.last7);
      html += renderStatCell(dayStats.today);
      html += '</div>';
    });

    html += '</div>';

    html += '<button class="toolbar-btn stats-reset-btn" id="btn-reset-num-stats">Reset number stats</button>';

    container.innerHTML = html;

    document.getElementById('btn-reset-num-stats').addEventListener('click', function(e) {
      e.stopPropagation();
      resetStats('numbers');
    });
  }

  // --- Reset Stats (shared, two-tap) ---

  var resetStatsConfirm = false;
  var resetStatsTimer = null;
  var resetStatsMode = null;

  function resetStats(mode) {
    var btnId = mode === 'numbers' ? 'btn-reset-num-stats' : 'btn-reset-stats';
    var btn = document.getElementById(btnId);
    if (!btn) return;

    if (!resetStatsConfirm || resetStatsMode !== mode) {
      resetStatsConfirm = true;
      resetStatsMode = mode;
      btn.textContent = 'Tap again to confirm';
      btn.classList.add('confirm');
      clearTimeout(resetStatsTimer);
      resetStatsTimer = setTimeout(function() {
        resetStatsConfirm = false;
        resetStatsMode = null;
        btn.textContent = mode === 'numbers' ? 'Reset number stats' : 'Reset all stats';
        btn.classList.remove('confirm');
      }, 3000);
      return;
    }

    clearTimeout(resetStatsTimer);
    resetStatsConfirm = false;
    resetStatsMode = null;

    if (mode === 'numbers') {
      NumberEngine.clearStats();
      try { localStorage.removeItem('eclairs_best_streak_numbers'); } catch(e) {}
      renderNumbersStats();
    } else {
      Storage.clearStats();
      try { localStorage.removeItem('eclairs_best_streak_phonics'); } catch(e) {}
      renderStats();
    }
  }

  function renderStatCell(stats) {
    if (stats.total === 0) return '<span class="stats-col stats-na">—</span>';
    var cls = stats.pct >= 80 ? 'good' : stats.pct >= 50 ? 'mid' : 'weak';
    return '<span class="stats-col stats-' + cls + '">' + stats.pct + '%<small>' + stats.total + '</small></span>';
  }

  // ============================
  // SONG PICKER
  // ============================

  function updateSongPicker() {
    var current = MusicEngine.getCurrentSong();
    document.querySelectorAll('.song-btn').forEach(function(btn) {
      var isCurrent = parseInt(btn.getAttribute('data-song'), 10) === current;
      btn.classList.toggle('active', isCurrent && !musicOff);
    });
  }

  // ============================
  // EVENT BINDING
  // ============================

  function init() {
    // Navigation
    var navSounds = {
      practice: SoundEngine.playMenuPractice,
      'numbers-practice': SoundEngine.playMenuPractice,
      stats: SoundEngine.playMenuStats,
      'numbers-stats': SoundEngine.playMenuStats,
      config: SoundEngine.playMenuSettings,
      'numbers-config': SoundEngine.playMenuSettings,
      home: SoundEngine.playMenuBack
    };
    document.querySelectorAll('[data-nav]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var target = btn.getAttribute('data-nav');
        if (navSounds[target]) navSounds[target]();
        Haptics.light();
        navigate(target);
      });
    });

    // Mode switch
    document.getElementById('mode-switch').addEventListener('click', function(e) {
      e.stopPropagation();
      SoundEngine.playModeSwitch();
      Haptics.medium();
      toggleMode();
    });

    // Score buttons
    document.getElementById('btn-correct').addEventListener('click', function(e) {
      e.stopPropagation();
      Haptics.medium();
      scorePractice(true);
    });
    document.getElementById('btn-wrong').addEventListener('click', function(e) {
      e.stopPropagation();
      Haptics.medium();
      scorePractice(false);
    });

    // Toolbar
    document.getElementById('btn-pause-stats').addEventListener('click', function(e) {
      e.stopPropagation();
      Haptics.select();
      togglePauseStats();
    });
    document.getElementById('btn-turn-off').addEventListener('click', function(e) {
      e.stopPropagation();
      Haptics.light();
      turnOffCurrentItem();
    });

    // Phonics config
    document.getElementById('btn-config-save').addEventListener('click', function() { Haptics.medium(); saveConfig(); });
    document.getElementById('btn-config-reset').addEventListener('click', function() { Haptics.light(); resetConfigDefaults(); });
    document.getElementById('btn-config-all').addEventListener('click', function() { Haptics.light(); selectAllConfig(); });
    document.getElementById('btn-config-clear').addEventListener('click', function() { Haptics.light(); clearAllConfig(); });

    // Numbers config
    document.getElementById('btn-numconfig-save').addEventListener('click', function() { Haptics.medium(); saveNumbersConfig(); });
    document.getElementById('btn-numconfig-reset').addEventListener('click', function() { Haptics.light(); resetNumbersConfigDefaults(); });
    document.getElementById('btn-numconfig-all').addEventListener('click', function() { Haptics.light(); selectAllNumbersConfig(); });
    document.getElementById('btn-numconfig-clear').addEventListener('click', function() { Haptics.light(); clearAllNumbersConfig(); });

    // Song picker (toggle: click active song to stop, click different to switch)
    document.querySelectorAll('.song-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        Haptics.light();
        var index = parseInt(btn.getAttribute('data-song'), 10);
        if (index === MusicEngine.getCurrentSong() && !musicOff) {
          musicOff = true;
          MusicEngine.stop();
        } else {
          musicOff = false;
          MusicEngine.setSong(index);
          setTimeout(function() { MusicEngine.start(); }, 100);
        }
        updateSongPicker();
      });
    });

    // Keyboard
    document.addEventListener('keydown', function(e) {
      var active = document.querySelector('.screen.active');
      if (!active) return;
      var screenId = active.id.replace('screen-', '');

      if (screenId === 'practice') {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
          e.preventDefault();
          scorePractice(true);
        } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
          e.preventDefault();
          scorePractice(false);
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate('home');
      }
    });

    showScreen('home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
