/**
 * Éclairs - Stats & Storage Engine
 * localStorage-backed attempt tracking with time-windowed stats
 */

var Storage = (function() {
  'use strict';

  var ATTEMPTS_KEY = 'eclairs_attempts';
  var CONFIG_KEY = 'eclairs_config';

  // --- Persistence ---

  function getAttempts() {
    try {
      return JSON.parse(localStorage.getItem(ATTEMPTS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveAttempts(attempts) {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  }

  function recordAttempt(item, correct) {
    var attempts = getAttempts();
    attempts.push({
      item: item,
      correct: correct,
      ts: Date.now()
    });
    saveAttempts(attempts);
  }

  // --- Config ---

  function getConfig() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG_KEY)) || null;
    } catch (e) {
      return null;
    }
  }

  function saveConfig(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  function getSelectedItems() {
    var config = getConfig();
    if (config && config.selectedItems && config.selectedItems.length > 0) {
      return config.selectedItems;
    }
    // Return defaults if nothing configured
    return PracticeItems ? PracticeItems.getDefaults() : [];
  }

  function setSelectedItems(items) {
    saveConfig({ selectedItems: items });
  }

  // --- Time Helpers ---

  function startOfDay(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function startOfWeek(date) {
    var d = new Date(date);
    var day = d.getDay();
    var diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function startOfMonth(date) {
    var d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function daysAgo(n) {
    return Date.now() - (n * 24 * 60 * 60 * 1000);
  }

  // --- Stats Calculation ---

  function filterAttempts(attempts, item, since) {
    return attempts.filter(function(a) {
      var matchItem = !item || a.item === item;
      var matchTime = !since || a.ts >= since;
      return matchItem && matchTime;
    });
  }

  function calcStats(filtered) {
    var total = filtered.length;
    var correct = filtered.filter(function(a) { return a.correct; }).length;
    var pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Current streak (consecutive correct from most recent)
    var streak = 0;
    for (var i = filtered.length - 1; i >= 0; i--) {
      if (filtered[i].correct) { streak++; } else { break; }
    }

    // Best streak
    var bestStreak = 0;
    var currentRun = 0;
    for (var j = 0; j < filtered.length; j++) {
      if (filtered[j].correct) {
        currentRun++;
        if (currentRun > bestStreak) bestStreak = currentRun;
      } else {
        currentRun = 0;
      }
    }

    return {
      total: total,
      correct: correct,
      pct: pct,
      streak: streak,
      bestStreak: bestStreak
    };
  }

  /**
   * Get NBA-style stats for a specific item or overall
   * @param {string|null} item - specific item or null for overall
   * @returns {object} stats by time window
   */
  function getStats(item) {
    var all = getAttempts();
    var now = new Date();

    return {
      career: calcStats(filterAttempts(all, item, null)),
      month: calcStats(filterAttempts(all, item, startOfMonth(now))),
      week: calcStats(filterAttempts(all, item, startOfWeek(now))),
      today: calcStats(filterAttempts(all, item, startOfDay(now))),
      last7: calcStats(filterAttempts(all, item, daysAgo(7))),
      last30: calcStats(filterAttempts(all, item, daysAgo(30)))
    };
  }

  /**
   * Get leaderboard: all practiced items ranked by career accuracy
   */
  function getLeaderboard() {
    var all = getAttempts();
    var itemMap = {};

    all.forEach(function(a) {
      if (!itemMap[a.item]) itemMap[a.item] = [];
      itemMap[a.item].push(a);
    });

    var items = Object.keys(itemMap).map(function(item) {
      var stats = calcStats(itemMap[item]);
      return {
        item: item,
        total: stats.total,
        correct: stats.correct,
        pct: stats.pct,
        streak: stats.streak,
        bestStreak: stats.bestStreak
      };
    });

    // Sort by total attempts descending
    items.sort(function(a, b) { return b.total - a.total; });
    return items;
  }

  /**
   * Get overall summary stats
   */
  function getSummary() {
    var board = getLeaderboard();
    if (board.length === 0) return null;

    var totalAttempts = 0;
    var totalCorrect = 0;
    var weakest = board[0];
    var strongest = board[0];

    board.forEach(function(b) {
      totalAttempts += b.total;
      totalCorrect += b.correct;
      if (b.total >= 3 && b.pct < weakest.pct) weakest = b;
      if (b.total >= 3 && b.pct > strongest.pct) strongest = b;
    });

    return {
      totalAttempts: totalAttempts,
      totalCorrect: totalCorrect,
      overallPct: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
      itemCount: board.length,
      weakest: weakest,
      strongest: strongest,
      mostPracticed: board[0] // already sorted by total desc
    };
  }

  /**
   * Calculate mastery score (0-100) for an item.
   * Based on last 20 attempts, weighted toward recent performance.
   * Decays if item hasn't been seen recently.
   */
  function getMastery(item) {
    var all = getAttempts();
    var itemAttempts = all.filter(function(a) { return a.item === item; });

    // Never seen → mastery 0
    if (itemAttempts.length === 0) return { mastery: 0, weight: 3 };

    // Last 20 attempts, most recent first
    var recent = itemAttempts.slice(-20);
    var total = recent.length;

    // Weighted accuracy: recent attempts count more
    var weightedCorrect = 0;
    var weightedTotal = 0;
    for (var i = 0; i < total; i++) {
      var recency = (i + 1) / total; // 0.05..1.0 (later = more weight)
      weightedTotal += recency;
      if (recent[i].correct) weightedCorrect += recency;
    }
    var accuracy = weightedTotal > 0 ? weightedCorrect / weightedTotal : 0;

    // Streak bonus: consecutive correct at the end boosts mastery
    var streak = 0;
    for (var j = recent.length - 1; j >= 0; j--) {
      if (recent[j].correct) streak++;
      else break;
    }
    var streakBonus = Math.min(streak * 3, 20); // up to +20 for 7+ streak

    // Base mastery from accuracy (0-80) + streak bonus (0-20)
    var mastery = Math.round(accuracy * 80 + streakBonus);
    mastery = Math.min(100, Math.max(0, mastery));

    // Decay: if not seen in a while, pull mastery down to retest
    var lastSeen = itemAttempts[itemAttempts.length - 1].ts;
    var daysSince = (Date.now() - lastSeen) / (24 * 60 * 60 * 1000);
    if (daysSince > 3) {
      var decay = Math.min((daysSince - 3) * 5, 40); // lose up to 40 pts
      mastery = Math.max(0, mastery - Math.round(decay));
    }

    // Weight: low mastery = high weight (appears more)
    // mastery 0 → weight 5, mastery 100 → weight 0.5
    var weight = 0.5 + 4.5 * (1 - mastery / 100);

    // Minimum sample boost: fewer than 5 attempts → bump weight
    if (total < 5) {
      weight = Math.max(weight, 3);
    }

    return { mastery: mastery, weight: weight };
  }

  /**
   * Get weights for all selected items (for weighted random selection)
   */
  function getWeights(selectedItems) {
    return selectedItems.map(function(id) {
      var m = getMastery(id);
      return { item: id, mastery: m.mastery, weight: m.weight };
    });
  }

  /**
   * Run after each attempt. Auto-adjusts selected items:
   * - Frustration: item with <25% accuracy over last 8+ attempts → disable it
   * - Promotion: average mastery of current pool ≥ 70% → enable next tier
   * - Re-enable: previously frustrated items retry after 2 days
   *
   * Returns { changed: bool, promoted: [ids], demoted: [ids] }
   */
  function assess() {
    var selected = getSelectedItems();
    var all = getAttempts();
    var changed = false;
    var promoted = [];
    var demoted = [];

    // --- Frustration detection: disable items that are too hard ---
    var FRUST_WINDOW = 8;    // look at last N attempts for this item
    var FRUST_THRESHOLD = 25; // below this % accuracy = too hard
    var MIN_POOL = 3;        // never shrink below this many items

    selected.forEach(function(id) {
      if (selected.length - demoted.length <= MIN_POOL) return; // floor
      var itemAttempts = all.filter(function(a) { return a.item === id; });
      if (itemAttempts.length < FRUST_WINDOW) return; // not enough data
      var recent = itemAttempts.slice(-FRUST_WINDOW);
      var correct = recent.filter(function(a) { return a.correct; }).length;
      var pct = Math.round((correct / FRUST_WINDOW) * 100);
      if (pct < FRUST_THRESHOLD) {
        demoted.push(id);
        changed = true;
      }
    });

    // Remove demoted items
    if (demoted.length > 0) {
      selected = selected.filter(function(id) { return demoted.indexOf(id) === -1; });
      // Track what was auto-disabled and when
      var autoDisabled = getAutoDisabled();
      demoted.forEach(function(id) { autoDisabled[id] = Date.now(); });
      saveAutoDisabled(autoDisabled);
    }

    // --- Promotion: if current pool is well-mastered, unlock next tier ---
    var PROMO_THRESHOLD = 70; // average mastery needed to promote
    var PROMO_MIN_ATTEMPTS = 3; // each item needs at least this many attempts

    // Check if all current items have enough attempts
    var allTested = selected.every(function(id) {
      var count = all.filter(function(a) { return a.item === id; }).length;
      return count >= PROMO_MIN_ATTEMPTS;
    });

    if (allTested && selected.length > 0) {
      var totalMastery = 0;
      selected.forEach(function(id) {
        totalMastery += getMastery(id).mastery;
      });
      var avgMastery = totalMastery / selected.length;

      if (avgMastery >= PROMO_THRESHOLD) {
        // Find the highest tier currently in the pool
        var maxTier = -1;
        selected.forEach(function(id) {
          var t = PracticeItems.getTierForItem(id);
          if (t > maxTier) maxTier = t;
        });

        // Unlock next tier
        var tiers = PracticeItems.getTiers();
        var nextTier = maxTier + 1;
        if (nextTier < tiers.length) {
          tiers[nextTier].forEach(function(id) {
            if (selected.indexOf(id) === -1) {
              selected.push(id);
              promoted.push(id);
              changed = true;
            }
          });
        }
      }
    }

    // --- Re-enable: try bringing back auto-disabled items after 2 days ---
    var RETRY_DAYS = 2;
    var autoDisabled = getAutoDisabled();
    var now = Date.now();
    Object.keys(autoDisabled).forEach(function(id) {
      var daysSince = (now - autoDisabled[id]) / (24 * 60 * 60 * 1000);
      if (daysSince >= RETRY_DAYS && selected.indexOf(id) === -1) {
        selected.push(id);
        promoted.push(id);
        delete autoDisabled[id];
        changed = true;
      }
    });
    if (changed) {
      saveAutoDisabled(autoDisabled);
    }

    // Save if anything changed
    if (changed) {
      setSelectedItems(selected);
    }

    return { changed: changed, promoted: promoted, demoted: demoted };
  }

  // --- Auto-disabled tracking ---
  var AUTO_DISABLED_KEY = 'eclairs_auto_disabled';

  function getAutoDisabled() {
    try {
      return JSON.parse(localStorage.getItem(AUTO_DISABLED_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveAutoDisabled(data) {
    localStorage.setItem(AUTO_DISABLED_KEY, JSON.stringify(data));
  }

  function clearStats() {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(AUTO_DISABLED_KEY);
  }

  function clearAllData() {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(CONFIG_KEY);
    localStorage.removeItem(AUTO_DISABLED_KEY);
  }

  return {
    recordAttempt: recordAttempt,
    getAttempts: getAttempts,
    getStats: getStats,
    getLeaderboard: getLeaderboard,
    getSummary: getSummary,
    getSelectedItems: getSelectedItems,
    setSelectedItems: setSelectedItems,
    getMastery: getMastery,
    getWeights: getWeights,
    assess: assess,
    clearStats: clearStats,
    clearAllData: clearAllData
  };
})();
