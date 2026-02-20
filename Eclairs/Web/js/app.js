/**
 * Éclairs - French Phonics Flashcards
 * Screens: Home, Practice, Config, Stats
 */

(function() {
  'use strict';

  // --- State ---
  var lastColorIndex = -1;
  var lastPracticeItem = null;
  var currentPracticeItem = null;
  var sessionCorrect = 0;
  var sessionTotal = 0;
  var statsPaused = false;
  var inputLocked = false;
  var musicOff = false;

  // --- Routing ---

  var screens = ['home', 'practice', 'config', 'stats'];

  function showScreen(id) {
    screens.forEach(function(s) {
      var el = document.getElementById('screen-' + s);
      if (el) el.classList.toggle('active', s === id);
    });

    if (id === 'practice') initPracticeMode();
    if (id === 'config') renderConfig();
    if (id === 'stats') renderStats();

    // Background music: play everywhere except practice (if not toggled off)
    if (id !== 'practice' && !musicOff) {
      MusicEngine.start();
    } else {
      MusicEngine.stop();
    }

    if (id !== 'practice') {
      document.body.style.setProperty('--bg-color', '#E6E6FA');
      document.body.style.setProperty('--text-color', '#4A148C');
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#E6E6FA');
    }
  }

  function navigate(screen) { showScreen(screen); }

  // --- Color Cycling ---

  function getNextColor() {
    if (colorPalettes.length <= 1) return colorPalettes[0] || { bg: '#E6E6FA', text: '#4A148C' };
    var index;
    do { index = Math.floor(Math.random() * colorPalettes.length); }
    while (index === lastColorIndex);
    lastColorIndex = index;
    return colorPalettes[index];
  }

  function applyColor(color) {
    document.body.style.setProperty('--bg-color', color.bg);
    document.body.style.setProperty('--text-color', color.text);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color.bg);
  }

  // ============================
  // PRACTICE MODE
  // ============================

  function initPracticeMode() {
    sessionCorrect = 0;
    sessionTotal = 0;
    inputLocked = false;
    updateSessionCounter();
    updatePauseButton();
    showNextPracticeItem();
  }

  function getNextPracticeItem() {
    var selected = Storage.getSelectedItems();
    if (selected.length === 0) return null;
    if (selected.length === 1) return selected[0];

    // Weighted random: struggling items appear more often
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
    var itemId = getNextPracticeItem();
    if (!itemId) {
      document.getElementById('practice-syllable').textContent = '?';
      document.getElementById('practice-counter').textContent = 'No items selected';
      document.getElementById('turn-off-label').textContent = '?';
      return;
    }
    currentPracticeItem = itemId;
    var display = PracticeItems.getDisplay(itemId);
    document.getElementById('practice-syllable').textContent = display;
    applyColor(getNextColor());
    inputLocked = false;
    // Reset turn-off confirmation state for new item
    turnOffConfirmItem = null;
    clearTimeout(turnOffTimer);
    resetTurnOffButton();
  }

  function scorePractice(correct) {
    if (!currentPracticeItem || inputLocked) return;
    inputLocked = true;

    // Record stats (unless paused)
    if (!statsPaused) {
      Storage.recordAttempt(currentPracticeItem, correct);

      // Auto-adjust: promote/demote items based on performance
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
    sessionTotal++;
    if (correct) sessionCorrect++;
    updateSessionCounter();

    // Sound
    if (correct) {
      SoundEngine.playCorrect();
    } else {
      SoundEngine.playWrong();
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

  // --- Assess Notice (brief toast when items auto-change) ---

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

  // --- Turn Off Current Item (two-tap confirmation) ---

  var turnOffConfirmItem = null;
  var turnOffTimer = null;

  function turnOffCurrentItem() {
    if (!currentPracticeItem) return;
    var btn = document.getElementById('btn-turn-off');
    if (!btn) return;

    var selected = Storage.getSelectedItems();
    var filtered = selected.filter(function(id) { return id !== currentPracticeItem; });

    if (filtered.length === 0) {
      btn.textContent = "Can't — last item";
      btn.classList.add('confirm');
      setTimeout(function() {
        resetTurnOffButton();
      }, 1500);
      return;
    }

    // First tap — ask for confirmation
    if (turnOffConfirmItem !== currentPracticeItem) {
      turnOffConfirmItem = currentPracticeItem;
      btn.textContent = 'Tap again to confirm';
      btn.classList.add('confirm');
      clearTimeout(turnOffTimer);
      turnOffTimer = setTimeout(function() {
        resetTurnOffButton();
      }, 3000);
      return;
    }

    // Second tap — confirmed, turn it off
    clearTimeout(turnOffTimer);
    turnOffConfirmItem = null;
    Storage.setSelectedItems(filtered);
    showNextPracticeItem();
  }

  function resetTurnOffButton() {
    turnOffConfirmItem = null;
    var btn = document.getElementById('btn-turn-off');
    if (btn && currentPracticeItem) {
      btn.innerHTML = 'Turn off <span id="turn-off-label">' +
        PracticeItems.getDisplay(currentPracticeItem) + '</span>';
      btn.classList.remove('confirm');
    }
  }

  // ============================
  // CONFIG SCREEN
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
  // STATS SCREEN
  // ============================

  function renderStats() {
    var container = document.getElementById('stats-content');
    if (!container) return;

    var summary = Storage.getSummary();
    var html = '';

    if (!summary || summary.totalAttempts === 0) {
      html = '<div class="stats-empty">' +
        '<div class="stats-empty-icon">📊</div>' +
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
      resetStats();
    });
  }

  var resetStatsConfirm = false;
  var resetStatsTimer = null;

  function resetStats() {
    var btn = document.getElementById('btn-reset-stats');
    if (!btn) return;

    if (!resetStatsConfirm) {
      resetStatsConfirm = true;
      btn.textContent = 'Tap again to confirm';
      btn.classList.add('confirm');
      clearTimeout(resetStatsTimer);
      resetStatsTimer = setTimeout(function() {
        resetStatsConfirm = false;
        btn.textContent = 'Reset all stats';
        btn.classList.remove('confirm');
      }, 3000);
      return;
    }

    // Confirmed
    clearTimeout(resetStatsTimer);
    resetStatsConfirm = false;
    Storage.clearStats();
    renderStats();
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
      stats: SoundEngine.playMenuStats,
      config: SoundEngine.playMenuSettings,
      home: SoundEngine.playMenuBack
    };
    document.querySelectorAll('[data-nav]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var target = btn.getAttribute('data-nav');
        if (navSounds[target]) navSounds[target]();
        navigate(target);
      });
    });

    // Score buttons
    document.getElementById('btn-correct').addEventListener('click', function(e) {
      e.stopPropagation();
      scorePractice(true);
    });
    document.getElementById('btn-wrong').addEventListener('click', function(e) {
      e.stopPropagation();
      scorePractice(false);
    });

    // Toolbar
    document.getElementById('btn-pause-stats').addEventListener('click', function(e) {
      e.stopPropagation();
      togglePauseStats();
    });
    document.getElementById('btn-turn-off').addEventListener('click', function(e) {
      e.stopPropagation();
      turnOffCurrentItem();
    });

    // Config
    document.getElementById('btn-config-save').addEventListener('click', saveConfig);
    document.getElementById('btn-config-reset').addEventListener('click', resetConfigDefaults);
    document.getElementById('btn-config-all').addEventListener('click', selectAllConfig);
    document.getElementById('btn-config-clear').addEventListener('click', clearAllConfig);

    // Song picker (toggle: click active song to stop, click different to switch)
    document.querySelectorAll('.song-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var index = parseInt(btn.getAttribute('data-song'), 10);
        if (index === MusicEngine.getCurrentSong() && !musicOff) {
          // Toggle off
          musicOff = true;
          MusicEngine.stop();
        } else {
          // Switch song (or re-enable)
          musicOff = false;
          MusicEngine.setSong(index);
          // setSong stops playback; restart after brief fade-out
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
