/**
 * Éclairs - Syllable & Practice Item Data
 *
 * Sources:
 * - French 36 phonemes (CCFS Sorbonne)
 * - French CP curriculum phonics progression
 * - Research on common reading difficulties for young French learners
 *
 * Two systems:
 * 1. PracticeItems - curated items for scored practice mode
 * 2. syllableData / syllables - full weighted set for free practice mode
 */

// === PRACTICE ITEMS (for scored mode) ===
// Curated list of commonly difficult items for kids learning French

var PracticeItems = (function() {
  'use strict';

  var items = [
    // --- Confusable Letters (visual mirror confusion) ---
    { id: 'b', display: 'b', category: 'letters', label: 'Lettres miroir', defaultOn: true },
    { id: 'd', display: 'd', category: 'letters', label: 'Lettres miroir', defaultOn: true },
    { id: 'p', display: 'p', category: 'letters', label: 'Lettres miroir', defaultOn: true },
    { id: 'q', display: 'q', category: 'letters', label: 'Lettres miroir', defaultOn: true },
    { id: 'm', display: 'm', category: 'letters', label: 'Lettres similaires', defaultOn: true },
    { id: 'n', display: 'n', category: 'letters', label: 'Lettres similaires', defaultOn: true },

    // --- Nasal Vowels (sons nasaux) - very hard for learners ---
    { id: 'on', display: 'on', category: 'nasals', label: 'Sons nasaux', defaultOn: true },
    { id: 'an', display: 'an', category: 'nasals', label: 'Sons nasaux', defaultOn: true },
    { id: 'in', display: 'in', category: 'nasals', label: 'Sons nasaux', defaultOn: true },
    { id: 'en', display: 'en', category: 'nasals', label: 'Sons nasaux', defaultOn: true },
    { id: 'ain', display: 'ain', category: 'nasals', label: 'Sons nasaux', defaultOn: false },
    { id: 'ein', display: 'ein', category: 'nasals', label: 'Sons nasaux', defaultOn: false },
    { id: 'oin', display: 'oin', category: 'nasals', label: 'Sons nasaux', defaultOn: false },

    // --- Common Digraphs / Complex Sounds ---
    { id: 'ou', display: 'ou', category: 'digraphs', label: 'Sons complexes', defaultOn: true },
    { id: 'oi', display: 'oi', category: 'digraphs', label: 'Sons complexes', defaultOn: true },
    { id: 'ch', display: 'ch', category: 'digraphs', label: 'Sons complexes', defaultOn: true },
    { id: 'gn', display: 'gn', category: 'digraphs', label: 'Sons complexes', defaultOn: true },
    { id: 'ai', display: 'ai', category: 'digraphs', label: 'Sons complexes', defaultOn: true },
    { id: 'au', display: 'au', category: 'digraphs', label: 'Sons complexes', defaultOn: true },
    { id: 'eau', display: 'eau', category: 'digraphs', label: 'Sons complexes', defaultOn: true },
    { id: 'eu', display: 'eu', category: 'digraphs', label: 'Sons complexes', defaultOn: true },
    { id: 'ui', display: 'ui', category: 'digraphs', label: 'Sons complexes', defaultOn: false },

    // --- Accented Vowels (accent confusion) ---
    { id: 'e_acute', display: 'é', category: 'accents', label: 'Accents', defaultOn: true },
    { id: 'e_grave', display: 'è', category: 'accents', label: 'Accents', defaultOn: true },
    { id: 'e_circ', display: 'ê', category: 'accents', label: 'Accents', defaultOn: false },

    // --- Soft/Hard consonant confusion ---
    { id: 'c_hard', display: 'ca', category: 'consonants', label: 'C/G dur et doux', defaultOn: false },
    { id: 'c_soft', display: 'ce', category: 'consonants', label: 'C/G dur et doux', defaultOn: false },
    { id: 'g_hard', display: 'ga', category: 'consonants', label: 'C/G dur et doux', defaultOn: false },
    { id: 'g_soft', display: 'ge', category: 'consonants', label: 'C/G dur et doux', defaultOn: false }
  ];

  function getAll() { return items; }

  function getDefaults() {
    return items.filter(function(it) { return it.defaultOn; }).map(function(it) { return it.id; });
  }

  function getById(id) {
    return items.find(function(it) { return it.id === id; }) || null;
  }

  function getDisplay(id) {
    var item = getById(id);
    return item ? item.display : id;
  }

  function getCategories() {
    var cats = {};
    items.forEach(function(it) {
      if (!cats[it.category]) cats[it.category] = { label: it.label, items: [] };
      cats[it.category].items.push(it);
    });
    return cats;
  }

  return {
    getAll: getAll,
    getDefaults: getDefaults,
    getById: getById,
    getDisplay: getDisplay,
    getCategories: getCategories
  };
})();


// === FREE PRACTICE DATA (existing weighted syllable system) ===

var syllableData = [
  // Simple vowels (high frequency)
  { syllable: 'a', weight: 5 }, { syllable: 'e', weight: 5 },
  { syllable: 'i', weight: 5 }, { syllable: 'o', weight: 5 },
  { syllable: 'u', weight: 5 },

  // Accented vowels
  { syllable: 'é', weight: 5 }, { syllable: 'è', weight: 3 },
  { syllable: 'ê', weight: 2 },

  // Complex sounds / digraphs
  { syllable: 'ou', weight: 5 }, { syllable: 'on', weight: 5 },
  { syllable: 'an', weight: 5 }, { syllable: 'en', weight: 5 },
  { syllable: 'in', weight: 4 }, { syllable: 'ain', weight: 3 },
  { syllable: 'ein', weight: 2 }, { syllable: 'oi', weight: 4 },
  { syllable: 'ai', weight: 4 }, { syllable: 'ei', weight: 2 },
  { syllable: 'au', weight: 4 }, { syllable: 'eau', weight: 4 },
  { syllable: 'eu', weight: 3 }, { syllable: 'ch', weight: 3 },
  { syllable: 'gn', weight: 2 }, { syllable: 'ui', weight: 2 },
  { syllable: 'oin', weight: 2 },

  // CV syllables - L family
  { syllable: 'la', weight: 5 }, { syllable: 'le', weight: 5 },
  { syllable: 'li', weight: 3 }, { syllable: 'lo', weight: 3 },
  { syllable: 'lu', weight: 3 }, { syllable: 'lé', weight: 3 },

  // M family
  { syllable: 'ma', weight: 5 }, { syllable: 'me', weight: 4 },
  { syllable: 'mi', weight: 3 }, { syllable: 'mo', weight: 3 },
  { syllable: 'mu', weight: 2 }, { syllable: 'mé', weight: 3 },

  // N family
  { syllable: 'na', weight: 3 }, { syllable: 'ne', weight: 4 },
  { syllable: 'ni', weight: 3 }, { syllable: 'no', weight: 3 },
  { syllable: 'nu', weight: 2 }, { syllable: 'né', weight: 3 },

  // P family
  { syllable: 'pa', weight: 4 }, { syllable: 'pe', weight: 3 },
  { syllable: 'pi', weight: 3 }, { syllable: 'po', weight: 3 },
  { syllable: 'pu', weight: 2 }, { syllable: 'pé', weight: 3 },

  // B family
  { syllable: 'ba', weight: 3 }, { syllable: 'be', weight: 3 },
  { syllable: 'bi', weight: 3 }, { syllable: 'bo', weight: 3 },
  { syllable: 'bu', weight: 2 }, { syllable: 'bé', weight: 2 },

  // T family
  { syllable: 'ta', weight: 3 }, { syllable: 'te', weight: 4 },
  { syllable: 'ti', weight: 3 }, { syllable: 'to', weight: 3 },
  { syllable: 'tu', weight: 3 }, { syllable: 'té', weight: 3 },

  // D family
  { syllable: 'da', weight: 3 }, { syllable: 'de', weight: 5 },
  { syllable: 'di', weight: 3 }, { syllable: 'do', weight: 3 },
  { syllable: 'du', weight: 3 }, { syllable: 'dé', weight: 3 },

  // S family
  { syllable: 'sa', weight: 3 }, { syllable: 'se', weight: 4 },
  { syllable: 'si', weight: 3 }, { syllable: 'so', weight: 2 },
  { syllable: 'su', weight: 2 }, { syllable: 'sé', weight: 2 },

  // R family
  { syllable: 'ra', weight: 3 }, { syllable: 're', weight: 4 },
  { syllable: 'ri', weight: 3 }, { syllable: 'ro', weight: 3 },
  { syllable: 'ru', weight: 2 }, { syllable: 'ré', weight: 3 },

  // F family
  { syllable: 'fa', weight: 3 }, { syllable: 'fe', weight: 2 },
  { syllable: 'fi', weight: 3 }, { syllable: 'fo', weight: 2 },
  { syllable: 'fu', weight: 2 }, { syllable: 'fé', weight: 2 },

  // V family
  { syllable: 'va', weight: 3 }, { syllable: 've', weight: 3 },
  { syllable: 'vi', weight: 3 }, { syllable: 'vo', weight: 2 },
  { syllable: 'vu', weight: 2 }, { syllable: 'vé', weight: 2 },

  // C/G/J/QU
  { syllable: 'ca', weight: 3 }, { syllable: 'co', weight: 3 },
  { syllable: 'cu', weight: 2 }, { syllable: 'ce', weight: 3 },
  { syllable: 'ci', weight: 3 }, { syllable: 'ga', weight: 2 },
  { syllable: 'go', weight: 2 }, { syllable: 'gu', weight: 2 },
  { syllable: 'ge', weight: 2 }, { syllable: 'gi', weight: 2 },
  { syllable: 'ja', weight: 2 }, { syllable: 'je', weight: 3 },
  { syllable: 'ji', weight: 1 }, { syllable: 'jo', weight: 2 },
  { syllable: 'ju', weight: 2 }, { syllable: 'que', weight: 4 },
  { syllable: 'qui', weight: 3 },

  // CH + vowel
  { syllable: 'cha', weight: 2 }, { syllable: 'che', weight: 2 },
  { syllable: 'chi', weight: 2 }, { syllable: 'cho', weight: 2 },
  { syllable: 'chu', weight: 1 }, { syllable: 'ché', weight: 2 },

  // Common endings
  { syllable: 'er', weight: 4 }, { syllable: 'es', weight: 3 },
  { syllable: 'et', weight: 3 }, { syllable: 'ez', weight: 3 },
  { syllable: 'ir', weight: 3 }, { syllable: 'tion', weight: 2 },

  // Function words
  { syllable: 'un', weight: 5 }, { syllable: 'les', weight: 4 },
  { syllable: 'des', weight: 4 }, { syllable: 'est', weight: 4 },
  { syllable: 'et', weight: 4 }, { syllable: 'il', weight: 4 }
];

// Build weighted array for free practice
var syllables = syllableData.flatMap(function(item) {
  return Array(item.weight).fill(item.syllable);
});

/**
 * Color palettes - light pastel backgrounds with soft dark text
 * All combinations pass WCAG AA (4.5:1+ contrast ratio)
 */
var colorPalettes = [
  { bg: '#E6E6FA', text: '#4A148C' },  // Lavender / Deep Purple
  { bg: '#FFE4E1', text: '#880E4F' },  // Pale Pink / Dark Rose
  { bg: '#E0F2F1', text: '#1B5E20' },  // Light Mint / Forest Green
  { bg: '#FFFACD', text: '#33691E' },  // Pale Yellow / Dark Olive
  { bg: '#E0F7FA', text: '#01579B' },  // Light Sky Blue / Navy Blue
  { bg: '#FFE5CC', text: '#BF360C' },  // Pale Peach / Burnt Orange
  { bg: '#F3E5F5', text: '#4A148C' },  // Soft Lilac / Deep Plum
  { bg: '#FFEAEB', text: '#880E4F' },  // Light Coral / Dark Burgundy
  { bg: '#E0F7FA', text: '#004D40' },  // Pale Aqua / Teal
  { bg: '#FFF8DC', text: '#3E2723' }   // Cream / Dark Brown
];
