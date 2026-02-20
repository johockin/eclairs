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

  function clearAllData() {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(CONFIG_KEY);
  }

  return {
    recordAttempt: recordAttempt,
    getAttempts: getAttempts,
    getStats: getStats,
    getLeaderboard: getLeaderboard,
    getSummary: getSummary,
    getSelectedItems: getSelectedItems,
    setSelectedItems: setSelectedItems,
    clearAllData: clearAllData
  };
})();
