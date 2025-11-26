/**
 * Éclairs - French Phonics Flashcards
 * Core application logic
 */

(function() {
  'use strict';

  // DOM elements
  const syllableEl = document.getElementById('syllable');
  const nextBtn = document.getElementById('nextBtn');

  // State
  let lastSyllable = null;
  let lastColorIndex = -1;

  /**
   * Get a random syllable, avoiding repeats
   */
  function getNextSyllable() {
    if (syllables.length === 0) return 'le';
    if (syllables.length === 1) return syllables[0];

    let next;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      next = syllables[Math.floor(Math.random() * syllables.length)];
      attempts++;
    } while (next === lastSyllable && attempts < maxAttempts);

    lastSyllable = next;
    return next;
  }

  /**
   * Get a random color palette, avoiding immediate repeats
   */
  function getNextColor() {
    if (colorPalettes.length === 0) {
      return { bg: '#E6E6FA', text: '#4A148C' };
    }
    if (colorPalettes.length === 1) {
      return colorPalettes[0];
    }

    let index;
    do {
      index = Math.floor(Math.random() * colorPalettes.length);
    } while (index === lastColorIndex);

    lastColorIndex = index;
    return colorPalettes[index];
  }

  /**
   * Show the next syllable with a new color
   */
  function showNext() {
    const syllable = getNextSyllable();
    const color = getNextColor();

    // Update syllable text
    syllableEl.textContent = syllable;

    // Update colors via CSS custom properties
    document.body.style.setProperty('--bg-color', color.bg);
    document.body.style.setProperty('--text-color', color.text);

    // Update theme-color meta tag for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', color.bg);
    }
  }

  /**
   * Initialize the app
   */
  function init() {
    // Show first syllable
    showNext();

    // Button click
    nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      showNext();
    });

    // Tap anywhere on container (but not the button)
    document.querySelector('.container').addEventListener('click', function(e) {
      if (e.target !== nextBtn && !nextBtn.contains(e.target)) {
        showNext();
      }
    });

    // Keyboard support (spacebar, enter, arrow keys)
    document.addEventListener('keydown', function(e) {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        showNext();
      }
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
