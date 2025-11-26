/**
 * French Syllables for Eclairs - Phonics Flashcards
 *
 * Sources:
 * - MANULEX Database (French children's reading acquisition)
 * - French CP (Cours Préparatoire) curriculum standards
 * - Academic research on French phonics instruction
 *
 * Weighting: 5x = very common, 4x = high frequency, 3x = common, 2x = moderate, 1x = less common
 */

const syllableData = [
  // VERY HIGH FREQUENCY (5x) - From top French words
  { syllable: 'le', weight: 5 },
  { syllable: 'la', weight: 5 },
  { syllable: 'de', weight: 5 },
  { syllable: 'un', weight: 5 },
  { syllable: 'une', weight: 5 },
  { syllable: 'et', weight: 5 },
  { syllable: 'les', weight: 5 },

  // HIGH FREQUENCY (4x) - Essential pronouns and function words
  { syllable: 'me', weight: 4 },
  { syllable: 'te', weight: 4 },
  { syllable: 'se', weight: 4 },
  { syllable: 'ne', weight: 4 },
  { syllable: 'que', weight: 4 },
  { syllable: 'pour', weight: 4 },
  { syllable: 'sur', weight: 4 },

  // COMMON (3x) - Possessives and basic words
  { syllable: 'ma', weight: 3 },
  { syllable: 'mon', weight: 3 },
  { syllable: 'son', weight: 3 },
  { syllable: 'ton', weight: 3 },
  { syllable: 'li', weight: 3 },
  { syllable: 'lu', weight: 3 },
  { syllable: 'il', weight: 3 },
  { syllable: 'elle', weight: 3 },
  { syllable: 'est', weight: 3 },
  { syllable: 'dans', weight: 3 },
  { syllable: 'avec', weight: 3 },

  // COMMON (3x) - Essential digraphs for CP
  { syllable: 'on', weight: 3 },
  { syllable: 'ou', weight: 3 },
  { syllable: 'an', weight: 3 },
  { syllable: 'en', weight: 3 },
  { syllable: 'in', weight: 3 },
  { syllable: 'ai', weight: 3 },
  { syllable: 'au', weight: 3 },
  { syllable: 'eau', weight: 3 },

  // COMMON (3x) - P family (Block 2)
  { syllable: 'pa', weight: 3 },
  { syllable: 'pe', weight: 3 },
  { syllable: 'pi', weight: 3 },
  { syllable: 'po', weight: 3 },
  { syllable: 'pu', weight: 3 },

  // COMMON (3x) - B family (Block 3)
  { syllable: 'ba', weight: 3 },
  { syllable: 'be', weight: 3 },
  { syllable: 'bi', weight: 3 },
  { syllable: 'bo', weight: 3 },
  { syllable: 'bu', weight: 3 },

  // MODERATE (2x) - R family (Block 2)
  { syllable: 'ra', weight: 2 },
  { syllable: 're', weight: 2 },
  { syllable: 'ri', weight: 2 },
  { syllable: 'ro', weight: 2 },
  { syllable: 'ru', weight: 2 },

  // MODERATE (2x) - S family (Block 1)
  { syllable: 'sa', weight: 2 },
  { syllable: 'si', weight: 2 },
  { syllable: 'so', weight: 2 },
  { syllable: 'su', weight: 2 },

  // MODERATE (2x) - T family (Block 1)
  { syllable: 'ta', weight: 2 },
  { syllable: 'ti', weight: 2 },
  { syllable: 'to', weight: 2 },
  { syllable: 'tu', weight: 2 },

  // MODERATE (2x) - D family (Block 2)
  { syllable: 'da', weight: 2 },
  { syllable: 'di', weight: 2 },
  { syllable: 'do', weight: 2 },
  { syllable: 'du', weight: 2 },

  // MODERATE (2x) - C family (Block 2)
  { syllable: 'ca', weight: 2 },
  { syllable: 'co', weight: 2 },
  { syllable: 'cu', weight: 2 },

  // MODERATE (2x) - N family (Block 2)
  { syllable: 'na', weight: 2 },
  { syllable: 'ni', weight: 2 },
  { syllable: 'no', weight: 2 },
  { syllable: 'nu', weight: 2 },

  // MODERATE (2x) - M family (Block 1)
  { syllable: 'mi', weight: 2 },
  { syllable: 'mo', weight: 2 },
  { syllable: 'mu', weight: 2 },

  // MODERATE (2x) - F family (Block 3)
  { syllable: 'fa', weight: 2 },
  { syllable: 'fe', weight: 2 },
  { syllable: 'fi', weight: 2 },
  { syllable: 'fo', weight: 2 },
  { syllable: 'fu', weight: 2 },

  // MODERATE (2x) - V family (Block 3)
  { syllable: 'va', weight: 2 },
  { syllable: 've', weight: 2 },
  { syllable: 'vi', weight: 2 },
  { syllable: 'vo', weight: 2 },
  { syllable: 'vu', weight: 2 },

  // LESS COMMON (1x) - G family (Block 3)
  { syllable: 'ga', weight: 1 },
  { syllable: 'ge', weight: 1 },
  { syllable: 'gi', weight: 1 },
  { syllable: 'go', weight: 1 },
  { syllable: 'gu', weight: 1 },

  // LESS COMMON (1x) - J family (Block 3)
  { syllable: 'ja', weight: 1 },
  { syllable: 'je', weight: 1 },
  { syllable: 'ji', weight: 1 },
  { syllable: 'jo', weight: 1 },
  { syllable: 'ju', weight: 1 },

  // LESS COMMON (1x) - CH digraph (Block 4)
  { syllable: 'cha', weight: 1 },
  { syllable: 'che', weight: 1 },
  { syllable: 'chi', weight: 1 },
  { syllable: 'cho', weight: 1 },
  { syllable: 'chu', weight: 1 },

  // LESS COMMON (1x) - Other common patterns
  { syllable: 'oi', weight: 1 },
  { syllable: 'ui', weight: 1 },
  { syllable: 'eu', weight: 1 },
  { syllable: 'er', weight: 1 },
  { syllable: 'es', weight: 1 },
  { syllable: 'ar', weight: 1 },
  { syllable: 'or', weight: 1 },
  { syllable: 'ir', weight: 1 },
  { syllable: 'ur', weight: 1 },
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
