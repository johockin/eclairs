/**
 * Éclairs - French Phonics Flashcards
 * Multi-screen SPA: Home, Free Practice, Scored Practice, Config, Stats
 */

(function() {
  'use strict';

  // --- State ---
  var lastSyllable = null;
  var lastColorIndex = -1;
  var lastPracticeItem = null;
  var currentPracticeItem = null;
  var sessionCorrect = 0;
  var sessionTotal = 0;

  // --- Routing ---

  var screens = ['home', 'free', 'practice', 'config', 'stats'];

  function showScreen(id) {
    screens.forEach(function(s) {
      var el = document.getElementById('screen-' + s);
      if (el) el.classList.toggle('active', s === id);
    });

    if (id === 'free') initFreeMode();
    if (id === 'practice') initPracticeMode();
    if (id === 'config') renderConfig();
    if (id === 'stats') renderStats();

    // Reset background for non-practice screens
    if (id === 'home' || id === 'config' || id === 'stats') {
      document.body.style.setProperty('--bg-color', '#E6E6FA');
      document.body.style.setProperty('--text-color', '#4A148C');
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#E6E6FA');
    }
  }

  function navigate(screen) {
    showScreen(screen);
  }

  // --- Color Cycling (shared) ---

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
  // FREE PRACTICE MODE
  // ============================

  function initFreeMode() {
    showNextFree();
  }

  function getNextSyllable() {
    if (syllables.length === 0) return 'le';
    if (syllables.length === 1) return syllables[0];
    var next, attempts = 0;
    do {
      next = syllables[Math.floor(Math.random() * syllables.length)];
      attempts++;
    } while (next === lastSyllable && attempts < 10);
    lastSyllable = next;
    return next;
  }

  function showNextFree() {
    var el = document.getElementById('free-syllable');
    if (el) el.textContent = getNextSyllable();
    applyColor(getNextColor());
  }

  // ============================
  // SCORED PRACTICE MODE
  // ============================

  function initPracticeMode() {
    sessionCorrect = 0;
    sessionTotal = 0;
    updateSessionCounter();
    showNextPracticeItem();
  }

  function getNextPracticeItem() {
    var selected = Storage.getSelectedItems();
    if (selected.length === 0) return null;
    if (selected.length === 1) return selected[0];
    var next, attempts = 0;
    do {
      next = selected[Math.floor(Math.random() * selected.length)];
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
      return;
    }
    currentPracticeItem = itemId;
    var display = PracticeItems.getDisplay(itemId);
    document.getElementById('practice-syllable').textContent = display;
    applyColor(getNextColor());
  }

  function scorePractice(correct) {
    if (!currentPracticeItem) return;

    Storage.recordAttempt(currentPracticeItem, correct);
    sessionTotal++;
    if (correct) sessionCorrect++;
    updateSessionCounter();

    if (correct) {
      SoundEngine.playCorrect();
      flashFeedback('correct');
    } else {
      SoundEngine.playWrong();
      flashFeedback('wrong');
    }

    // Brief pause then next item
    setTimeout(showNextPracticeItem, 350);
  }

  function updateSessionCounter() {
    var el = document.getElementById('practice-counter');
    if (el) {
      if (sessionTotal === 0) {
        el.textContent = 'Ready!';
      } else {
        var pct = Math.round((sessionCorrect / sessionTotal) * 100);
        el.textContent = sessionCorrect + '/' + sessionTotal + ' (' + pct + '%)';
      }
    }
  }

  function flashFeedback(type) {
    var el = document.getElementById('practice-feedback');
    if (!el) return;
    el.className = 'feedback-flash ' + type;
    el.textContent = type === 'correct' ? '\u2713' : '\u2717';
    // Force reflow then animate
    el.offsetWidth;
    el.classList.add('show');
    setTimeout(function() { el.classList.remove('show'); }, 300);
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
      // Flash warning
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
    var buttons = document.querySelectorAll('#config-list .config-item');
    buttons.forEach(function(btn) { btn.classList.add('selected'); });
  }

  function clearAllConfig() {
    var buttons = document.querySelectorAll('#config-list .config-item');
    buttons.forEach(function(btn) { btn.classList.remove('selected'); });
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
        '<p class="stats-empty-sub">Practice in scored mode to start tracking.</p>' +
        '</div>';
      container.innerHTML = html;
      return;
    }

    // Overall summary card
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

    // Per-item breakdown
    var board = Storage.getLeaderboard();
    html += '<div class="stats-table">';
    html += '<div class="stats-table-header">';
    html += '<span class="stats-col-item">Item</span>';
    html += '<span class="stats-col">Career</span>';
    html += '<span class="stats-col">30d</span>';
    html += '<span class="stats-col">7d</span>';
    html += '<span class="stats-col">Today</span>';
    html += '</div>';

    board.forEach(function(entry) {
      var itemStats = Storage.getStats(entry.item);
      html += '<div class="stats-table-row">';
      html += '<span class="stats-col-item stats-item-name">' + PracticeItems.getDisplay(entry.item) + '</span>';
      html += renderStatCell(itemStats.career);
      html += renderStatCell(itemStats.last30);
      html += renderStatCell(itemStats.last7);
      html += renderStatCell(itemStats.today);
      html += '</div>';
    });

    html += '</div>';

    // Streak info
    board.forEach(function(entry) {
      if (entry.bestStreak >= 3) {
        html += '<div class="stats-streak">' +
          PracticeItems.getDisplay(entry.item) + ': ' +
          entry.streak + ' current streak, ' +
          entry.bestStreak + ' best</div>';
      }
    });

    container.innerHTML = html;
  }

  function renderStatCell(stats) {
    if (stats.total === 0) return '<span class="stats-col stats-na">—</span>';
    var cls = stats.pct >= 80 ? 'good' : stats.pct >= 50 ? 'mid' : 'weak';
    return '<span class="stats-col stats-' + cls + '">' + stats.pct + '%<small>' + stats.total + '</small></span>';
  }

  // ============================
  // EVENT BINDING
  // ============================

  function init() {
    // Navigation buttons
    document.querySelectorAll('[data-nav]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        navigate(btn.getAttribute('data-nav'));
      });
    });

    // Free practice: tap anywhere on display area
    var freeArea = document.getElementById('screen-free');
    if (freeArea) {
      freeArea.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-nav')) return;
        showNextFree();
      });
    }

    // Scored practice buttons
    var correctBtn = document.getElementById('btn-correct');
    var wrongBtn = document.getElementById('btn-wrong');
    if (correctBtn) correctBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      scorePractice(true);
    });
    if (wrongBtn) wrongBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      scorePractice(false);
    });

    // Config actions
    var saveBtn = document.getElementById('btn-config-save');
    if (saveBtn) saveBtn.addEventListener('click', saveConfig);

    var resetBtn = document.getElementById('btn-config-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetConfigDefaults);

    var selectAllBtn = document.getElementById('btn-config-all');
    if (selectAllBtn) selectAllBtn.addEventListener('click', selectAllConfig);

    var clearBtn = document.getElementById('btn-config-clear');
    if (clearBtn) clearBtn.addEventListener('click', clearAllConfig);

    // Keyboard support (free mode mainly)
    document.addEventListener('keydown', function(e) {
      var active = document.querySelector('.screen.active');
      if (!active) return;
      var screenId = active.id.replace('screen-', '');

      if (screenId === 'free') {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
          e.preventDefault();
          showNextFree();
        }
      } else if (screenId === 'practice') {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
          e.preventDefault();
          scorePractice(true);
        } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
          e.preventDefault();
          scorePractice(false);
        }
      }

      // Escape to go home
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate('home');
      }
    });

    // Start on home screen
    showScreen('home');
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
