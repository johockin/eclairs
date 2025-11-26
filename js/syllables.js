/**
 * French Syllables for Eclairs - Phonics Flashcards
 *
 * Sources:
 * - French 36 phonemes (CCFS Sorbonne)
 * - French CP curriculum phonics progression
 * - French phonics teaching resources (sons simples + sons complexes)
 *
 * Categories:
 * - Simple vowels: a, e, i, o, u
 * - Accented vowels: é, è, ê
 * - CV syllables: consonant + vowel combinations
 * - Complex sounds (sons complexes): ou, on, an, en, in, oi, ai, au, eau, eu, ch, gn
 *
 * Weighting: 5x = very common, 3x = common, 2x = moderate, 1x = less common
 */

const syllableData = [
  // === SIMPLE VOWELS (High frequency - foundation) ===
  { syllable: 'a', weight: 5 },
  { syllable: 'e', weight: 5 },
  { syllable: 'i', weight: 5 },
  { syllable: 'o', weight: 5 },
  { syllable: 'u', weight: 5 },

  // === ACCENTED VOWELS (Common in French) ===
  { syllable: 'é', weight: 5 },    // accent aigu - très common
  { syllable: 'è', weight: 3 },    // accent grave
  { syllable: 'ê', weight: 2 },    // circonflexe

  // === COMPLEX SOUNDS / DIGRAPHS (Sons complexes) ===
  // These are critical for French reading

  // OU sound [u] - as in "ou", "vous", "tout"
  { syllable: 'ou', weight: 5 },

  // ON/OM nasal [ɔ̃] - as in "bon", "nom"
  { syllable: 'on', weight: 5 },

  // AN/EN nasal [ɑ̃] - as in "dans", "vent"
  { syllable: 'an', weight: 5 },
  { syllable: 'en', weight: 5 },

  // IN nasal [ɛ̃] - as in "vin", "main"
  { syllable: 'in', weight: 4 },
  { syllable: 'ain', weight: 3 },
  { syllable: 'ein', weight: 2 },

  // OI sound [wa] - as in "moi", "toi"
  { syllable: 'oi', weight: 4 },

  // AI/EI sound [ɛ] - as in "mai", "neige"
  { syllable: 'ai', weight: 4 },
  { syllable: 'ei', weight: 2 },

  // AU/EAU sound [o] - as in "eau", "beau"
  { syllable: 'au', weight: 4 },
  { syllable: 'eau', weight: 4 },

  // EU/OEU sound [ø] - as in "feu", "bleu"
  { syllable: 'eu', weight: 3 },

  // CH sound [ʃ] - as in "chat", "chien"
  { syllable: 'ch', weight: 3 },

  // GN sound [ɲ] - as in "montagne"
  { syllable: 'gn', weight: 2 },

  // UI sound [ɥi] - as in "lui", "fruit"
  { syllable: 'ui', weight: 2 },

  // OIN sound [wɛ̃] - as in "coin", "loin"
  { syllable: 'oin', weight: 2 },

  // === CV SYLLABLES (Consonant + Vowel) ===
  // Most common pattern in French - open syllables

  // L family (very common)
  { syllable: 'la', weight: 5 },
  { syllable: 'le', weight: 5 },
  { syllable: 'li', weight: 3 },
  { syllable: 'lo', weight: 3 },
  { syllable: 'lu', weight: 3 },
  { syllable: 'lé', weight: 3 },

  // M family (very common)
  { syllable: 'ma', weight: 5 },
  { syllable: 'me', weight: 4 },
  { syllable: 'mi', weight: 3 },
  { syllable: 'mo', weight: 3 },
  { syllable: 'mu', weight: 2 },
  { syllable: 'mé', weight: 3 },

  // N family
  { syllable: 'na', weight: 3 },
  { syllable: 'ne', weight: 4 },
  { syllable: 'ni', weight: 3 },
  { syllable: 'no', weight: 3 },
  { syllable: 'nu', weight: 2 },
  { syllable: 'né', weight: 3 },

  // P family
  { syllable: 'pa', weight: 4 },
  { syllable: 'pe', weight: 3 },
  { syllable: 'pi', weight: 3 },
  { syllable: 'po', weight: 3 },
  { syllable: 'pu', weight: 2 },
  { syllable: 'pé', weight: 3 },

  // B family
  { syllable: 'ba', weight: 3 },
  { syllable: 'be', weight: 3 },
  { syllable: 'bi', weight: 3 },
  { syllable: 'bo', weight: 3 },
  { syllable: 'bu', weight: 2 },
  { syllable: 'bé', weight: 2 },

  // T family
  { syllable: 'ta', weight: 3 },
  { syllable: 'te', weight: 4 },
  { syllable: 'ti', weight: 3 },
  { syllable: 'to', weight: 3 },
  { syllable: 'tu', weight: 3 },
  { syllable: 'té', weight: 3 },

  // D family
  { syllable: 'da', weight: 3 },
  { syllable: 'de', weight: 5 },
  { syllable: 'di', weight: 3 },
  { syllable: 'do', weight: 3 },
  { syllable: 'du', weight: 3 },
  { syllable: 'dé', weight: 3 },

  // S family
  { syllable: 'sa', weight: 3 },
  { syllable: 'se', weight: 4 },
  { syllable: 'si', weight: 3 },
  { syllable: 'so', weight: 2 },
  { syllable: 'su', weight: 2 },
  { syllable: 'sé', weight: 2 },

  // R family
  { syllable: 'ra', weight: 3 },
  { syllable: 're', weight: 4 },
  { syllable: 'ri', weight: 3 },
  { syllable: 'ro', weight: 3 },
  { syllable: 'ru', weight: 2 },
  { syllable: 'ré', weight: 3 },

  // F family
  { syllable: 'fa', weight: 3 },
  { syllable: 'fe', weight: 2 },
  { syllable: 'fi', weight: 3 },
  { syllable: 'fo', weight: 2 },
  { syllable: 'fu', weight: 2 },
  { syllable: 'fé', weight: 2 },

  // V family
  { syllable: 'va', weight: 3 },
  { syllable: 've', weight: 3 },
  { syllable: 'vi', weight: 3 },
  { syllable: 'vo', weight: 2 },
  { syllable: 'vu', weight: 2 },
  { syllable: 'vé', weight: 2 },

  // C family (hard c = [k])
  { syllable: 'ca', weight: 3 },
  { syllable: 'co', weight: 3 },
  { syllable: 'cu', weight: 2 },

  // C family (soft c = [s] before e, i)
  { syllable: 'ce', weight: 3 },
  { syllable: 'ci', weight: 3 },

  // G family (hard g)
  { syllable: 'ga', weight: 2 },
  { syllable: 'go', weight: 2 },
  { syllable: 'gu', weight: 2 },

  // G family (soft g = [ʒ] before e, i)
  { syllable: 'ge', weight: 2 },
  { syllable: 'gi', weight: 2 },

  // J family [ʒ]
  { syllable: 'ja', weight: 2 },
  { syllable: 'je', weight: 3 },
  { syllable: 'ji', weight: 1 },
  { syllable: 'jo', weight: 2 },
  { syllable: 'ju', weight: 2 },

  // QU family [k]
  { syllable: 'que', weight: 4 },
  { syllable: 'qui', weight: 3 },

  // === CH + VOWEL COMBINATIONS ===
  { syllable: 'cha', weight: 2 },
  { syllable: 'che', weight: 2 },
  { syllable: 'chi', weight: 2 },
  { syllable: 'cho', weight: 2 },
  { syllable: 'chu', weight: 1 },
  { syllable: 'ché', weight: 2 },

  // === COMMON WORD ENDINGS ===
  { syllable: 'er', weight: 4 },   // infinitive ending
  { syllable: 'es', weight: 3 },   // plural/verb ending
  { syllable: 'et', weight: 3 },   // common ending
  { syllable: 'ez', weight: 3 },   // vous verb ending
  { syllable: 'ir', weight: 3 },   // infinitive ending
  { syllable: 'tion', weight: 2 }, // -tion ending

  // === COMMON SINGLE-SYLLABLE WORDS (function words) ===
  { syllable: 'un', weight: 5 },   // a/one
  { syllable: 'les', weight: 4 },  // the (plural)
  { syllable: 'des', weight: 4 },  // some/of the
  { syllable: 'est', weight: 4 },  // is
  { syllable: 'et', weight: 4 },   // and
  { syllable: 'il', weight: 4 },   // he/it
];

// Build weighted array (syllables appear multiple times based on weight)
const syllables = syllableData.flatMap(item =>
  Array(item.weight).fill(item.syllable)
);

/**
 * Color palettes - light pastel backgrounds with soft dark text
 * All combinations pass WCAG AA (4.5:1+ contrast ratio)
 */
const colorPalettes = [
  { bg: '#E6E6FA', text: '#4A148C' },  // Lavender / Deep Purple
  { bg: '#FFE4E1', text: '#880E4F' },  // Pale Pink / Dark Rose
  { bg: '#E0F2F1', text: '#1B5E20' },  // Light Mint / Forest Green
  { bg: '#FFFACD', text: '#33691E' },  // Pale Yellow / Dark Olive
  { bg: '#E0F7FA', text: '#01579B' },  // Light Sky Blue / Navy Blue
  { bg: '#FFE5CC', text: '#BF360C' },  // Pale Peach / Burnt Orange
  { bg: '#F3E5F5', text: '#4A148C' },  // Soft Lilac / Deep Plum
  { bg: '#FFEAEB', text: '#880E4F' },  // Light Coral / Dark Burgundy
  { bg: '#E0F7FA', text: '#004D40' },  // Pale Aqua / Teal
  { bg: '#FFF8DC', text: '#3E2723' },  // Cream / Dark Brown
];
