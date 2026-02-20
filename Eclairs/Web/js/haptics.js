/**
 * Éclairs - Haptic Feedback Bridge
 * Thin wrapper for JS → Swift Taptic Engine communication.
 * No-ops gracefully when running in a browser (non-WKWebView).
 */

var Haptics = {
  fire: function(style) {
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.haptic) {
      window.webkit.messageHandlers.haptic.postMessage(style);
    }
  },
  light:   function() { this.fire('light'); },
  medium:  function() { this.fire('medium'); },
  heavy:   function() { this.fire('heavy'); },
  success: function() { this.fire('success'); },
  error:   function() { this.fire('error'); },
  select:  function() { this.fire('select'); }
};
