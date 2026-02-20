/**
 * Éclairs - Number Engine
 * French number identification mode with 7 difficulty tiers.
 * Parallel system to PracticeItems/Storage for phonics.
 */

var NumberEngine = (function() {
  'use strict';

  // --- Tier Definitions ---
  // Each tier: { id, label, range: [min, max], description }

  var tiers = [
    { id: 0, label: '1–10',  range: [1, 10],  description: 'Basic' },
    { id: 1, label: '11–16', range: [11, 16], description: 'Irregular teens' },
    { id: 2, label: '17–20', range: [17, 20], description: 'Composed teens' },
    { id: 3, label: '21–69', range: [21, 69], description: 'Regular pattern' },
    { id: 4, label: '70–79', range: [70, 79], description: 'Soixante-dix' },
    { id: 5, label: '80–89', range: [80, 89], description: 'Quatre-vingts' },
    { id: 6, label: '90–99', range: [90, 99], description: 'Quatre-vingt-dix' }
  ];

  var DEFAULT_TIERS = [0, 1];

  function getTiers() { return tiers; }

  function getTierForNumber(n) {
    for (var i = 0; i < tiers.length; i++) {
      if (n >= tiers[i].range[0] && n <= tiers[i].range[1]) return i;
    }
    return -1;
  }

  function getNumbersInTier(tierIndex) {
    var t = tiers[tierIndex];
    if (!t) return [];
    var nums = [];
    for (var n = t.range[0]; n <= t.range[1]; n++) nums.push(n);
    return nums;
  }

  // --- Number Display ---
  // Returns the Arabic numeral as a string (the child reads aloud in French)

  function getDisplay(n) {
    return String(n);
  }

  // --- Storage Keys (separate from phonics) ---

  var ATTEMPTS_KEY = 'eclairs_num_attempts';
  var CONFIG_KEY = 'eclairs_num_config';
  var AUTO_DISABLED_KEY = 'eclairs_num_auto_disabled';

  function getAttempts() {
    try { return JSON.parse(localStorage.getItem(ATTEMPTS_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveAttempts(attempts) {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  }

  function recordAttempt(number, correct) {
    var attempts = getAttempts();
    attempts.push({ item: String(number), correct: correct, ts: Date.now() });
    saveAttempts(attempts);
  }

  // --- Config ---

  function getConfig() {
    try { return JSON.parse(localStorage.getItem(CONFIG_KEY)) || null; }
    catch (e) { return null; }
  }

  function saveConfig(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  function getEnabledTiers() {
    var config = getConfig();
    if (config && config.enabledTiers && config.enabledTiers.length > 0) {
      return config.enabledTiers;
    }
    return DEFAULT_TIERS.slice();
  }

  function setEnabledTiers(tierIds) {
    saveConfig({ enabledTiers: tierIds });
  }

  // --- Auto-Disabled ---

  function getAutoDisabled() {
    try { return JSON.parse(localStorage.getItem(AUTO_DISABLED_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function saveAutoDisabled(data) {
    localStorage.setItem(AUTO_DISABLED_KEY, JSON.stringify(data));
  }

  // --- Mastery (per-number, same algorithm as phonics) ---

  function getMastery(number) {
    var all = getAttempts();
    var key = String(number);
    var itemAttempts = all.filter(function(a) { return a.item === key; });

    if (itemAttempts.length === 0) return { mastery: 0, weight: 3 };

    var recent = itemAttempts.slice(-20);
    var total = recent.length;

    // Weighted accuracy: recent attempts count more
    var weightedCorrect = 0;
    var weightedTotal = 0;
    for (var i = 0; i < total; i++) {
      var recency = (i + 1) / total;
      weightedTotal += recency;
      if (recent[i].correct) weightedCorrect += recency;
    }
    var accuracy = weightedTotal > 0 ? weightedCorrect / weightedTotal : 0;

    // Streak bonus
    var streak = 0;
    for (var j = recent.length - 1; j >= 0; j--) {
      if (recent[j].correct) streak++;
      else break;
    }
    var streakBonus = Math.min(streak * 3, 20);

    var mastery = Math.round(accuracy * 80 + streakBonus);
    mastery = Math.min(100, Math.max(0, mastery));

    // Decay
    var lastSeen = itemAttempts[itemAttempts.length - 1].ts;
    var daysSince = (Date.now() - lastSeen) / (24 * 60 * 60 * 1000);
    if (daysSince > 3) {
      var decay = Math.min((daysSince - 3) * 5, 40);
      mastery = Math.max(0, mastery - Math.round(decay));
    }

    var weight = 0.5 + 4.5 * (1 - mastery / 100);
    if (total < 5) weight = Math.max(weight, 3);

    return { mastery: mastery, weight: weight };
  }

  // --- Tier Mastery (average of all numbers in tier) ---

  function getTierMastery(tierIndex) {
    var nums = getNumbersInTier(tierIndex);
    if (nums.length === 0) return 0;
    var total = 0;
    nums.forEach(function(n) { total += getMastery(n).mastery; });
    return Math.round(total / nums.length);
  }

  // --- Tier Stats ---

  function getTierStats(tierIndex) {
    var nums = getNumbersInTier(tierIndex);
    var all = getAttempts();
    var totalAttempts = 0;
    var totalCorrect = 0;
    nums.forEach(function(n) {
      var key = String(n);
      all.forEach(function(a) {
        if (a.item === key) {
          totalAttempts++;
          if (a.correct) totalCorrect++;
        }
      });
    });
    return {
      attempts: totalAttempts,
      correct: totalCorrect,
      pct: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
      mastery: getTierMastery(tierIndex)
    };
  }

  // --- Generator ---

  var lastNumber = null;

  function getNextNumber() {
    var enabledTiers = getEnabledTiers();
    if (enabledTiers.length === 0) return null;

    // Build pool: all numbers from enabled tiers with weights
    var pool = [];
    enabledTiers.forEach(function(tierIdx) {
      var nums = getNumbersInTier(tierIdx);
      nums.forEach(function(n) {
        var m = getMastery(n);
        pool.push({ number: n, weight: m.weight });
      });
    });

    if (pool.length === 0) return null;
    if (pool.length === 1) return pool[0].number;

    // Weighted random with no-repeat
    var totalWeight = 0;
    for (var i = 0; i < pool.length; i++) totalWeight += pool[i].weight;

    var next, attempts = 0;
    do {
      var r = Math.random() * totalWeight;
      var cumulative = 0;
      next = pool[0].number;
      for (var j = 0; j < pool.length; j++) {
        cumulative += pool[j].weight;
        if (r <= cumulative) { next = pool[j].number; break; }
      }
      attempts++;
    } while (next === lastNumber && attempts < 10);
    lastNumber = next;
    return next;
  }

  // --- Assess (frustration + promotion, same pattern as phonics) ---

  function assess() {
    var enabledTiers = getEnabledTiers();
    var all = getAttempts();
    var changed = false;
    var promoted = [];
    var demoted = [];

    // --- Frustration: disable tiers where recent accuracy is terrible ---
    var FRUST_WINDOW = 12;
    var FRUST_THRESHOLD = 25;
    var MIN_TIERS = 1;

    enabledTiers.forEach(function(tierIdx) {
      if (enabledTiers.length - demoted.length <= MIN_TIERS) return;
      var nums = getNumbersInTier(tierIdx);
      var tierAttempts = [];
      nums.forEach(function(n) {
        var key = String(n);
        all.forEach(function(a) { if (a.item === key) tierAttempts.push(a); });
      });
      if (tierAttempts.length < FRUST_WINDOW) return;
      // Sort by timestamp, take last window
      tierAttempts.sort(function(a, b) { return a.ts - b.ts; });
      var recent = tierAttempts.slice(-FRUST_WINDOW);
      var correct = recent.filter(function(a) { return a.correct; }).length;
      var pct = Math.round((correct / FRUST_WINDOW) * 100);
      if (pct < FRUST_THRESHOLD) {
        demoted.push(tierIdx);
        changed = true;
      }
    });

    // Remove demoted tiers
    if (demoted.length > 0) {
      enabledTiers = enabledTiers.filter(function(t) { return demoted.indexOf(t) === -1; });
      var autoDisabled = getAutoDisabled();
      demoted.forEach(function(t) { autoDisabled[t] = Date.now(); });
      saveAutoDisabled(autoDisabled);
    }

    // --- Promotion: if current tiers are well-mastered, unlock next ---
    var PROMO_THRESHOLD = 70;
    var PROMO_MIN_ATTEMPTS = 5;

    // Check all enabled tiers have enough attempts
    var allTested = enabledTiers.every(function(tierIdx) {
      var stats = getTierStats(tierIdx);
      return stats.attempts >= PROMO_MIN_ATTEMPTS;
    });

    if (allTested && enabledTiers.length > 0) {
      var avgMastery = 0;
      enabledTiers.forEach(function(tierIdx) { avgMastery += getTierMastery(tierIdx); });
      avgMastery = avgMastery / enabledTiers.length;

      if (avgMastery >= PROMO_THRESHOLD) {
        var maxTier = Math.max.apply(null, enabledTiers);
        var nextTier = maxTier + 1;
        if (nextTier < tiers.length && enabledTiers.indexOf(nextTier) === -1) {
          enabledTiers.push(nextTier);
          promoted.push(nextTier);
          changed = true;
        }
      }
    }

    // --- Re-enable: bring back auto-disabled tiers after 2 days ---
    var RETRY_DAYS = 2;
    var autoDisabled = getAutoDisabled();
    var now = Date.now();
    var maxEnabled = enabledTiers.length > 0 ? Math.max.apply(null, enabledTiers) : -1;

    Object.keys(autoDisabled).forEach(function(key) {
      var tierIdx = parseInt(key, 10);
      var daysSince = (now - autoDisabled[key]) / (24 * 60 * 60 * 1000);
      if (daysSince >= RETRY_DAYS && enabledTiers.indexOf(tierIdx) === -1 && tierIdx <= maxEnabled) {
        enabledTiers.push(tierIdx);
        promoted.push(tierIdx);
        delete autoDisabled[key];
        changed = true;
      }
    });
    if (changed) saveAutoDisabled(autoDisabled);

    if (changed) setEnabledTiers(enabledTiers);

    return { changed: changed, promoted: promoted, demoted: demoted };
  }

  // --- Summary Stats ---

  function getSummary() {
    var all = getAttempts();
    if (all.length === 0) return null;
    var totalCorrect = all.filter(function(a) { return a.correct; }).length;
    return {
      totalAttempts: all.length,
      totalCorrect: totalCorrect,
      overallPct: Math.round((totalCorrect / all.length) * 100)
    };
  }

  // --- Clear ---

  function clearStats() {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(AUTO_DISABLED_KEY);
  }

  function clearAllData() {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(CONFIG_KEY);
    localStorage.removeItem(AUTO_DISABLED_KEY);
  }

  // --- Color Palettes (warm-toned for numbers mode) ---

  var colorPalettes = [
    { bg: '#FFF8E7', text: '#1A2744' },  // Warm Cream / Slate
    { bg: '#FFE8D6', text: '#5D2E0C' },  // Peach / Espresso
    { bg: '#F5E6CA', text: '#3E2723' },  // Sand / Dark Brown
    { bg: '#FFF3CD', text: '#33691E' },  // Soft Gold / Olive
    { bg: '#F0E6D3', text: '#4A148C' },  // Warm Beige / Deep Purple
    { bg: '#FFE0CC', text: '#BF360C' },  // Pale Terracotta / Burnt Orange
    { bg: '#E8DDD3', text: '#263238' },  // Warm Gray / Dark Slate
    { bg: '#FDDDE6', text: '#880E4F' },  // Dusty Rose / Dark Rose
    { bg: '#E0EDDA', text: '#1B5E20' },  // Light Sage / Forest Green
    { bg: '#FFF5E6', text: '#5D4037' }   // Cream / Warm Brown
  ];

  function getColorPalettes() { return colorPalettes; }

  return {
    getTiers: getTiers,
    getTierForNumber: getTierForNumber,
    getNumbersInTier: getNumbersInTier,
    getDisplay: getDisplay,
    getEnabledTiers: getEnabledTiers,
    setEnabledTiers: setEnabledTiers,
    recordAttempt: recordAttempt,
    getAttempts: getAttempts,
    getMastery: getMastery,
    getTierMastery: getTierMastery,
    getTierStats: getTierStats,
    getNextNumber: getNextNumber,
    assess: assess,
    getSummary: getSummary,
    clearStats: clearStats,
    clearAllData: clearAllData,
    getColorPalettes: getColorPalettes
  };
})();
