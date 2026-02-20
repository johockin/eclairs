/**
 * Éclairs — Icon Exploration Grid
 *
 * Usage: node generate-icon-grid.js
 * Requires: npm install canvas
 *
 * NOTE: System fonts are unavailable in node-canvas on this machine.
 * All letter shapes are drawn manually with canvas paths for pixel-perfect control.
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const SIZE = 1024;
const CENTER = SIZE / 2;

// ============ HELPERS ============

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function newCanvas(bgColor) {
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bgColor || '#FFFFFF';
  ctx.fillRect(0, 0, SIZE, SIZE);
  return { canvas, ctx };
}

/**
 * Draw a lowercase "e" shape using canvas paths.
 * cx, cy = center of the letter
 * size = overall diameter of the letter body
 * thickness = stroke weight
 *
 * Refined approach: draw the "e" as a thick arc (not a full circle cutout).
 * The letter is an open ring (~300 degrees) with a horizontal crossbar.
 */
function drawLetterE(ctx, cx, cy, size, thickness, color) {
  var r = size / 2; // outer radius
  var midR = r - thickness / 2; // center of the stroke

  ctx.save();
  ctx.translate(cx, cy);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = 'round';
  ctx.lineWidth = thickness;

  // Main body: arc from about 25 degrees (opening) around to about 345 degrees
  // The opening faces bottom-right
  var openAngle = 0.45; // radians — size of the gap (~26 degrees)
  ctx.beginPath();
  ctx.arc(0, 0, midR, openAngle, Math.PI * 2 - 0.05);
  ctx.stroke();

  // Crossbar: horizontal line across the middle
  ctx.lineCap = 'butt';
  ctx.lineWidth = thickness * 0.9;
  ctx.beginPath();
  ctx.moveTo(-r + thickness * 0.3, 0);
  ctx.lineTo(r - thickness * 0.1, 0);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw an acute accent mark (the ´ above the e).
 * cx, cy = center position of the accent
 * length = length of the accent stroke
 * thickness = width of the stroke
 */
function drawAccent(ctx, cx, cy, length, thickness, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0.35); // ~20 degrees tilted right

  // Clean rounded line
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(0, -length / 2);
  ctx.lineTo(0, length / 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw a complete "é" character using paths.
 * cx, cy = center of the whole character (including accent)
 * scale = multiplier (1.0 = roughly 300px tall)
 */
function drawAccentedE(ctx, cx, cy, scale, color) {
  var eSize = 130 * scale;        // radius of the e body
  var eThickness = 42 * scale;    // stroke weight of the e
  var eOffsetY = 30 * scale;      // push e body down slightly to make room for accent
  var accentLen = 80 * scale;     // accent stroke length
  var accentThick = 32 * scale;   // accent stroke width
  var accentOffsetY = -(eSize + 30 * scale); // above the e

  // Draw the e body
  drawLetterE(ctx, cx, cy + eOffsetY, eSize, eThickness, color);

  // Draw the accent above
  drawAccent(ctx, cx + 15 * scale, cy + eOffsetY + accentOffsetY, accentLen, accentThick, color);
}


// ============ ROUND 1: THREE METAPHORS ============
// Metaphor A: Lightning bolt — literal meaning of "Éclairs"
// Metaphor B: Letter tile — physical alphabet block, candy skeuomorphic
// Metaphor C: Accent mark — the French diacritical as abstract bold shape

// --- METAPHOR A: LIGHTNING BOLT ---

function r1_bolt_lavender() {
  // Bold geometric lightning bolt, centered, on the app's signature lavender
  var c = newCanvas('#D8D0F0');
  var ctx = c.ctx;

  ctx.save();
  ctx.translate(CENTER, CENTER);

  ctx.beginPath();
  ctx.moveTo(-100, -380);
  ctx.lineTo(120, -380);
  ctx.lineTo(30, -60);
  ctx.lineTo(180, -60);
  ctx.lineTo(-40, 380);
  ctx.lineTo(50, 40);
  ctx.lineTo(-120, 40);
  ctx.closePath();

  ctx.shadowColor = 'rgba(50, 10, 80, 0.25)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;

  ctx.fillStyle = '#4A148C';
  ctx.fill();
  ctx.restore();

  return c.canvas;
}

function r1_bolt_coral() {
  // Lightning bolt on bold coral — break from app palette
  var c = newCanvas('#E8453C');
  var ctx = c.ctx;

  ctx.save();
  ctx.translate(CENTER, CENTER);

  ctx.beginPath();
  ctx.moveTo(-100, -380);
  ctx.lineTo(120, -380);
  ctx.lineTo(30, -60);
  ctx.lineTo(180, -60);
  ctx.lineTo(-40, 380);
  ctx.lineTo(50, 40);
  ctx.lineTo(-120, 40);
  ctx.closePath();

  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;

  ctx.fillStyle = '#FFF8E8';
  ctx.fill();
  ctx.restore();

  return c.canvas;
}

function r1_bolt_rounded() {
  // Softer, thicker bolt — more candy, friendlier proportions
  var c = newCanvas('#FFF3E0');
  var ctx = c.ctx;

  ctx.save();
  ctx.translate(CENTER, CENTER);

  // Thicker, chunkier bolt with rounded corners via line joins
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(-80, -350);
  ctx.lineTo(130, -350);
  ctx.lineTo(40, -50);
  ctx.lineTo(170, -50);
  ctx.lineTo(-30, 350);
  ctx.lineTo(60, 50);
  ctx.lineTo(-100, 50);
  ctx.closePath();

  ctx.shadowColor = 'rgba(200, 100, 0, 0.2)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 14;

  ctx.fillStyle = '#E65100';
  ctx.fill();

  // Also stroke it thick for rounded feel
  ctx.strokeStyle = '#E65100';
  ctx.lineWidth = 20;
  ctx.stroke();

  ctx.restore();

  return c.canvas;
}

// --- METAPHOR B: LETTER TILE ---

function r1_tile_cream() {
  // Raised cream tile with hand-drawn "é" on lavender
  var c = newCanvas('#D8D0F0');
  var ctx = c.ctx;

  var tileSize = 620;
  var tileX = (SIZE - tileSize) / 2;
  var tileY = (SIZE - tileSize) / 2 + 20;
  var r = 80;

  // Drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(50, 10, 80, 0.2)';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 20;
  roundRectPath(ctx, tileX, tileY, tileSize, tileSize, r);
  ctx.fillStyle = '#FFF8F0';
  ctx.fill();
  ctx.restore();

  // Top highlight
  ctx.save();
  roundRectPath(ctx, tileX, tileY, tileSize, tileSize, r);
  ctx.clip();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(tileX, tileY, tileSize, 30);
  ctx.restore();

  // Bottom edge
  ctx.save();
  roundRectPath(ctx, tileX, tileY, tileSize, tileSize, r);
  ctx.clip();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  ctx.fillRect(tileX, tileY + tileSize - 12, tileSize, 12);
  ctx.restore();

  // Border
  roundRectPath(ctx, tileX, tileY, tileSize, tileSize, r);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Hand-drawn "é"
  drawAccentedE(ctx, CENTER, CENTER + 20, 2.0, '#4A148C');

  return c.canvas;
}

function r1_tile_deep() {
  // Deep purple tile with white "é" — inverted, bold
  var c = newCanvas('#F5F0FF');
  var ctx = c.ctx;

  var tileSize = 640;
  var tileX = (SIZE - tileSize) / 2;
  var tileY = (SIZE - tileSize) / 2 + 16;
  var r = 80;

  // Drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(50, 10, 80, 0.3)';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 20;
  roundRectPath(ctx, tileX, tileY, tileSize, tileSize, r);
  ctx.fillStyle = '#4A148C';
  ctx.fill();
  ctx.restore();

  // Top highlight
  ctx.save();
  roundRectPath(ctx, tileX, tileY, tileSize, tileSize, r);
  ctx.clip();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(tileX, tileY, tileSize, 24);
  ctx.restore();

  // Hand-drawn "é" in white
  drawAccentedE(ctx, CENTER, CENTER + 20, 2.0, '#FFFFFF');

  return c.canvas;
}

function r1_tile_coral() {
  // Cream tile on coral — palette-breaking
  var c = newCanvas('#E8453C');
  var ctx = c.ctx;

  var tileSize = 580;
  var tileX = (SIZE - tileSize) / 2;
  var tileY = (SIZE - tileSize) / 2 + 16;
  var r = 72;

  // Drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 20;
  roundRectPath(ctx, tileX, tileY, tileSize, tileSize, r);
  ctx.fillStyle = '#FFF8E8';
  ctx.fill();
  ctx.restore();

  // Border
  roundRectPath(ctx, tileX, tileY, tileSize, tileSize, r);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Hand-drawn "é" in deep red
  drawAccentedE(ctx, CENTER, CENTER + 16, 1.8, '#B71C1C');

  return c.canvas;
}

// --- METAPHOR C: ACCENT MARK ---

function r1_accent_giant() {
  // Giant acute accent mark — oversized, abstract, on lavender
  var c = newCanvas('#D8D0F0');
  var ctx = c.ctx;

  ctx.save();
  ctx.translate(CENTER, CENTER);

  // Big bold accent — a thick diagonal parallelogram
  ctx.beginPath();
  ctx.moveTo(-30, -350);
  ctx.lineTo(70, -370);
  ctx.lineTo(150, 80);
  ctx.lineTo(50, 100);
  ctx.closePath();

  ctx.shadowColor = 'rgba(50, 10, 80, 0.2)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;

  ctx.fillStyle = '#4A148C';
  ctx.fill();
  ctx.restore();

  // Small "e" shape below — just a simple circle with crossbar cutout
  ctx.save();
  ctx.translate(CENTER + 50, CENTER + 260);
  ctx.beginPath();
  ctx.arc(0, 0, 80, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(74, 20, 140, 0.2)';
  ctx.fill();

  // Cut inner
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(0, 0, 52, 0, Math.PI * 2);
  ctx.fill();

  // Restore and draw crossbar
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(74, 20, 140, 0.2)';
  ctx.fillRect(-80, -14, 160, 28);

  // Cut opening
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 84, 0.15, 0.85);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  return c.canvas;
}

function r1_accent_warm() {
  // Warm accent on cream — thick, organic, confident
  var c = newCanvas('#FFF5E6');
  var ctx = c.ctx;

  ctx.save();
  ctx.translate(CENTER - 20, CENTER - 60);

  // Thick accent stroke
  ctx.beginPath();
  ctx.moveTo(-40, -280);
  ctx.lineTo(60, -300);
  ctx.lineTo(180, 140);
  ctx.lineTo(80, 160);
  ctx.closePath();

  ctx.shadowColor = 'rgba(180, 80, 0, 0.15)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;

  ctx.fillStyle = '#BF360C';
  ctx.fill();
  ctx.restore();

  return c.canvas;
}

function r1_accent_neon() {
  // Glowing accent on dark — bold, anti-convention
  var c = newCanvas('#1A1A2E');
  var ctx = c.ctx;

  ctx.save();
  ctx.translate(CENTER, CENTER - 40);

  // Glowing accent
  ctx.beginPath();
  ctx.moveTo(-30, -300);
  ctx.lineTo(70, -320);
  ctx.lineTo(170, 120);
  ctx.lineTo(70, 140);
  ctx.closePath();

  ctx.shadowColor = 'rgba(200, 140, 255, 0.6)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = '#CE93D8';
  ctx.fill();
  ctx.restore();

  // Subtle "e" below using paths
  ctx.save();
  ctx.translate(CENTER + 50, CENTER + 280);
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(200, 140, 255, 0.2)';
  ctx.fill();

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(200, 140, 255, 0.2)';
  ctx.fillRect(-60, -11, 120, 22);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 64, 0.15, 0.85);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  return c.canvas;
}


// ============ ROUND 2: BOLT REFINEMENT + "LÉ" FUSION ============
// Feedback: C (accent) is the winner — all 3 are contenders. B (tile) dropped.
// Iterate on A (bolt): try different proportions, weights.
// New metaphor D: Lightning bolt IS the letter "l", paired with "é" = "lé".
// The bolt serves double duty — it's both the app name reference AND a letter.

// --- A2: BOLT REFINEMENT ---

function r2_bolt_thick_lavender() {
  // Much thicker, chunkier bolt — more mass, less spiky
  var c = newCanvas('#D8D0F0');
  var ctx = c.ctx;

  ctx.save();
  ctx.translate(CENTER, CENTER);

  ctx.beginPath();
  ctx.moveTo(-140, -340);
  ctx.lineTo(140, -340);
  ctx.lineTo(60, -40);
  ctx.lineTo(200, -40);
  ctx.lineTo(-20, 340);
  ctx.lineTo(60, 60);
  ctx.lineTo(-160, 60);
  ctx.closePath();

  ctx.shadowColor = 'rgba(50, 10, 80, 0.25)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;

  ctx.fillStyle = '#4A148C';
  ctx.fill();
  ctx.restore();

  return c.canvas;
}

function r2_bolt_mini_coral() {
  // Smaller, centered bolt with more breathing room — negative space
  var c = newCanvas('#E8453C');
  var ctx = c.ctx;

  ctx.save();
  ctx.translate(CENTER, CENTER);

  // Scale down to ~60% size
  var s = 0.6;
  ctx.beginPath();
  ctx.moveTo(-100*s, -380*s);
  ctx.lineTo(120*s, -380*s);
  ctx.lineTo(30*s, -60*s);
  ctx.lineTo(180*s, -60*s);
  ctx.lineTo(-40*s, 380*s);
  ctx.lineTo(50*s, 40*s);
  ctx.lineTo(-120*s, 40*s);
  ctx.closePath();

  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;

  ctx.fillStyle = '#FFF8E8';
  ctx.fill();
  ctx.restore();

  return c.canvas;
}

function r2_bolt_soft_pink() {
  // Bolt on soft pink — try a different palette, rounder
  var c = newCanvas('#F8E0E6');
  var ctx = c.ctx;

  ctx.save();
  ctx.translate(CENTER, CENTER);

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(-90, -350);
  ctx.lineTo(120, -350);
  ctx.lineTo(35, -50);
  ctx.lineTo(170, -50);
  ctx.lineTo(-30, 350);
  ctx.lineTo(55, 50);
  ctx.lineTo(-110, 50);
  ctx.closePath();

  ctx.shadowColor = 'rgba(120, 20, 60, 0.2)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;

  ctx.fillStyle = '#880E4F';
  ctx.fill();

  // Round the joins
  ctx.strokeStyle = '#880E4F';
  ctx.lineWidth = 16;
  ctx.stroke();

  ctx.restore();

  return c.canvas;
}

// --- D: BOLT + É = "LÉ" FUSION ---
// The lightning bolt IS the letter "l". Next to it, an "é".
// Together they read as "lé" — absurd, dumb-French, perfect.

function r2_le_lavender() {
  // "lé" on lavender — bolt as "l" + path-drawn "é", centered pair
  var c = newCanvas('#D8D0F0');
  var ctx = c.ctx;

  // The bolt/l on the left, é on the right
  // Shift everything left a bit so the pair is centered
  var offsetX = -100;

  // Lightning bolt as "l" — tall, slightly narrower
  ctx.save();
  ctx.translate(CENTER + offsetX, CENTER);

  ctx.beginPath();
  ctx.moveTo(-60, -360);
  ctx.lineTo(80, -360);
  ctx.lineTo(20, -40);
  ctx.lineTo(120, -40);
  ctx.lineTo(-10, 340);
  ctx.lineTo(40, 40);
  ctx.lineTo(-80, 40);
  ctx.closePath();

  ctx.shadowColor = 'rgba(50, 10, 80, 0.2)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;

  ctx.fillStyle = '#4A148C';
  ctx.fill();
  ctx.restore();

  // The "é" to the right — baseline-aligned with bolt bottom
  drawAccentedE(ctx, CENTER + offsetX + 260, CENTER + 40, 1.5, '#4A148C');

  return c.canvas;
}

function r2_le_coral() {
  // "lé" on coral — cream on red, bolder
  var c = newCanvas('#E8453C');
  var ctx = c.ctx;

  var offsetX = -100;
  var color = '#FFF8E8';

  // Lightning bolt "l"
  ctx.save();
  ctx.translate(CENTER + offsetX, CENTER);

  ctx.beginPath();
  ctx.moveTo(-60, -360);
  ctx.lineTo(80, -360);
  ctx.lineTo(20, -40);
  ctx.lineTo(120, -40);
  ctx.lineTo(-10, 340);
  ctx.lineTo(40, 40);
  ctx.lineTo(-80, 40);
  ctx.closePath();

  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;

  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();

  // "é"
  drawAccentedE(ctx, CENTER + offsetX + 260, CENTER + 40, 1.5, color);

  return c.canvas;
}

function r2_le_dark() {
  // "lé" on dark navy — neon/light treatment
  var c = newCanvas('#1A1A2E');
  var ctx = c.ctx;

  var offsetX = -100;
  var color = '#CE93D8';

  // Lightning bolt "l"
  ctx.save();
  ctx.translate(CENTER + offsetX, CENTER);

  ctx.beginPath();
  ctx.moveTo(-60, -360);
  ctx.lineTo(80, -360);
  ctx.lineTo(20, -40);
  ctx.lineTo(120, -40);
  ctx.lineTo(-10, 340);
  ctx.lineTo(40, 40);
  ctx.lineTo(-80, 40);
  ctx.closePath();

  ctx.shadowColor = 'rgba(200, 140, 255, 0.4)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();

  // "é"
  drawAccentedE(ctx, CENTER + offsetX + 260, CENTER + 40, 1.5, color);

  return c.canvas;
}


// ============ ROUND 3: REFINED BOLT — FAT, ROUND, GOLDEN RATIO ============
// Feedback: bolts need to be fatter and rounder. "Perfect golden ratio vibe."
// Accent contenders stay exactly as-is. Iconic simplicity, mot juste.

/**
 * Draw a refined lightning bolt — fat, rounded, harmonious.
 * cx, cy = center of bolt
 * scale = 1.0 produces a bolt ~680px tall
 * The shape uses rounded joins and balanced proportions:
 *   - Upper "arm" is wider and shorter (golden ratio: lower section ~1.618x upper)
 *   - The notch/waist is thick, not pinched
 *   - All corners are generously rounded via thick stroke
 */
function drawBoltRefined(ctx, cx, cy, scale, color) {
  ctx.save();
  ctx.translate(cx, cy);
  if (scale !== 1) ctx.scale(scale, scale);

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Fat, balanced bolt silhouette
  // Upper section: wide arm pointing right, ~260px tall
  // Lower section: longer tail pointing down-left, ~420px tall (~1.6x upper)
  // The "waist" where they meet is thick (~200px wide)
  ctx.beginPath();

  // Start top-left of upper arm
  ctx.moveTo(-120, -340);
  // Top edge, wide
  ctx.lineTo(160, -340);
  // Down to the notch — this is the right edge of the upper arm
  // The notch sits at about -80 (not at center — shifted up for golden ratio)
  ctx.lineTo(80, -80);
  // Right point of the notch (the bump-out that gives the zigzag)
  ctx.lineTo(190, -80);
  // The bolt's bottom tip — this is the drama
  ctx.lineTo(-30, 340);
  // Back up to the notch's lower-left — forms the lower arm
  ctx.lineTo(60, 60);
  // Left side of the lower portion, back to start
  ctx.lineTo(-140, 60);

  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  // Fat rounded stroke to soften all corners
  ctx.strokeStyle = color;
  ctx.lineWidth = 40;
  ctx.stroke();

  ctx.restore();
}

// --- Round 3: Standalone bolt, 3 colorways ---

function r3_bolt_lavender() {
  var c = newCanvas('#D8D0F0');
  var ctx = c.ctx;

  ctx.shadowColor = 'rgba(50, 10, 80, 0.22)';
  ctx.shadowBlur = 44;
  ctx.shadowOffsetY = 16;

  drawBoltRefined(ctx, CENTER, CENTER, 1.0, '#4A148C');
  return c.canvas;
}

function r3_bolt_coral() {
  var c = newCanvas('#E8453C');
  var ctx = c.ctx;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;

  drawBoltRefined(ctx, CENTER, CENTER, 1.0, '#FFF8E8');
  return c.canvas;
}

function r3_bolt_dark() {
  var c = newCanvas('#1A1A2E');
  var ctx = c.ctx;

  ctx.shadowColor = 'rgba(200, 140, 255, 0.5)';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 0;

  drawBoltRefined(ctx, CENTER, CENTER, 1.0, '#CE93D8');
  return c.canvas;
}

// --- Round 3: "lé" fusion with refined bolt ---

function r3_le_lavender() {
  var c = newCanvas('#D8D0F0');
  var ctx = c.ctx;
  var color = '#4A148C';

  ctx.shadowColor = 'rgba(50, 10, 80, 0.2)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;

  // Bolt as "l" — shifted left, slightly smaller
  drawBoltRefined(ctx, CENTER - 120, CENTER, 0.78, color);

  // "é" to the right — clear of the bolt
  ctx.shadowColor = 'transparent';
  drawAccentedE(ctx, CENTER + 175, CENTER + 50, 1.5, color);

  return c.canvas;
}

function r3_le_coral() {
  var c = newCanvas('#E8453C');
  var ctx = c.ctx;
  var color = '#FFF8E8';

  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;

  drawBoltRefined(ctx, CENTER - 120, CENTER, 0.78, color);

  ctx.shadowColor = 'transparent';
  drawAccentedE(ctx, CENTER + 175, CENTER + 50, 1.5, color);

  return c.canvas;
}

function r3_le_dark() {
  var c = newCanvas('#1A1A2E');
  var ctx = c.ctx;
  var color = '#CE93D8';

  ctx.shadowColor = 'rgba(200, 140, 255, 0.35)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 0;

  drawBoltRefined(ctx, CENTER - 120, CENTER, 0.78, color);

  ctx.shadowColor = 'transparent';
  drawAccentedE(ctx, CENTER + 175, CENTER + 50, 1.5, color);

  return c.canvas;
}


// ============ GENERATE ALL + HTML ============

async function main() {
  var outDir = path.join(__dirname, 'icon-grid');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // --- CONTENDERS (carry forward) ---
  var contenders = [
    { name: 'r1-accent-giant', label: 'CONTENDER: Giant accent on lavender', fn: r1_accent_giant },
    { name: 'r1-accent-warm', label: 'CONTENDER: Warm accent on cream', fn: r1_accent_warm },
    { name: 'r1-accent-neon', label: 'CONTENDER: Glowing accent on dark', fn: r1_accent_neon },
  ];

  // --- Round 1 (kept for history, not re-rendered in main grid) ---
  var round1_history = [
    { name: 'r1-bolt-lavender', label: 'R1: Bolt on lavender', fn: r1_bolt_lavender },
    { name: 'r1-bolt-coral', label: 'R1: Bolt on coral', fn: r1_bolt_coral },
    { name: 'r1-bolt-rounded', label: 'R1: Bolt rounded', fn: r1_bolt_rounded },
  ];

  // --- Round 2: Bolt refinement ---
  var round2_bolt = [
    { name: 'r2-bolt-thick', label: 'Thicker chunky bolt on lavender', fn: r2_bolt_thick_lavender },
    { name: 'r2-bolt-mini', label: 'Small bolt, more negative space, coral', fn: r2_bolt_mini_coral },
    { name: 'r2-bolt-pink', label: 'Rounded bolt on soft pink', fn: r2_bolt_soft_pink },
  ];

  // --- Round 2: "lé" fusion ---
  var round2_le = [
    { name: 'r2-le-lavender', label: 'Bolt + é = "lé" on lavender', fn: r2_le_lavender },
    { name: 'r2-le-coral', label: 'Bolt + é = "lé" on coral', fn: r2_le_coral },
    { name: 'r2-le-dark', label: 'Bolt + é = "lé" on dark navy', fn: r2_le_dark },
  ];

  // --- Round 3: Refined bolt (fat, rounded, golden ratio) ---
  var round3_bolt = [
    { name: 'r3-bolt-lavender', label: 'Fat rounded bolt on lavender', fn: r3_bolt_lavender },
    { name: 'r3-bolt-coral', label: 'Fat rounded bolt on coral', fn: r3_bolt_coral },
    { name: 'r3-bolt-dark', label: 'Fat rounded bolt on dark navy', fn: r3_bolt_dark },
  ];

  // --- Round 3: "lé" fusion with refined bolt ---
  var round3_le = [
    { name: 'r3-le-lavender', label: 'Refined bolt + é = "lé" on lavender', fn: r3_le_lavender },
    { name: 'r3-le-coral', label: 'Refined bolt + é = "lé" on coral', fn: r3_le_coral },
    { name: 'r3-le-dark', label: 'Refined bolt + é = "lé" on dark navy', fn: r3_le_dark },
  ];

  var all = [].concat(contenders, round3_bolt, round3_le, round2_bolt, round2_le, round1_history);

  for (var i = 0; i < all.length; i++) {
    var v = all[i];
    var canvas = v.fn();
    var buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(outDir, v.name + '.png'), buffer);
    console.log('  ' + v.name + ': ' + v.label);
  }

  // Build HTML
  function cardHtml(v) {
    return '<div class="card">' +
      '<div class="icon"><img src="' + v.name + '.png"></div>' +
      '<div class="meta">' +
        '<span class="id">' + v.name + '</span>' +
        '<span class="label">' + v.label + '</span>' +
      '</div>' +
      '<div class="sizes">' +
        '<div class="size"><div class="icon" style="width:60px;height:60px"><img src="' + v.name + '.png"></div><span>Home</span></div>' +
        '<div class="size"><div class="icon" style="width:29px;height:29px"><img src="' + v.name + '.png"></div><span>Settings</span></div>' +
      '</div>' +
    '</div>';
  }

  var secContenders = contenders.map(cardHtml).join('\n');
  var secR3Bolt = round3_bolt.map(cardHtml).join('\n');
  var secR3Le = round3_le.map(cardHtml).join('\n');
  var secR2Bolt = round2_bolt.map(cardHtml).join('\n');
  var secR2Le = round2_le.map(cardHtml).join('\n');
  var secR1 = round1_history.map(cardHtml).join('\n');

  var html = '<!DOCTYPE html>\n<html><head>\n' +
    '<meta charset="UTF-8">\n' +
    '<title>Éclairs Icon Grid</title>\n' +
    '<style>\n' +
    '  * { margin: 0; padding: 0; box-sizing: border-box; }\n' +
    '  body { font-family: -apple-system, system-ui, sans-serif; background: #111; color: #eee; padding: 40px; max-width: 1200px; margin: 0 auto; }\n' +
    '  h1 { font-size: 28px; margin-bottom: 8px; }\n' +
    '  .subtitle { font-size: 14px; color: #666; margin-bottom: 32px; }\n' +
    '  h2 { font-size: 18px; color: #888; margin: 32px 0 16px; padding-top: 24px; border-top: 1px solid #333; }\n' +
    '  h2.contender { color: #4ED45A; }\n' +
    '  h2.current { color: #FFA726; }\n' +
    '  h2.history { color: #555; }\n' +
    '  .grid { display: flex; gap: 24px; flex-wrap: wrap; }\n' +
    '  .card { background: #222; border-radius: 16px; padding: 20px; width: 220px; }\n' +
    '  .card .icon { width: 180px; height: 180px; border-radius: 22.37%; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.5); margin: 0 auto 12px; }\n' +
    '  .card .icon img { width: 100%; height: 100%; display: block; }\n' +
    '  .meta { text-align: center; margin-bottom: 12px; }\n' +
    '  .id { display: block; font-size: 11px; color: #555; font-family: "SF Mono", Menlo, monospace; }\n' +
    '  .label { display: block; font-size: 12px; color: #999; margin-top: 2px; line-height: 1.3; }\n' +
    '  .sizes { display: flex; justify-content: center; gap: 16px; padding-top: 12px; border-top: 1px solid #333; }\n' +
    '  .size { text-align: center; }\n' +
    '  .size .icon { margin: 0 auto 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); }\n' +
    '  .size span { font-size: 10px; color: #555; }\n' +
    '</style>\n</head><body>\n' +
    '<h1>Éclairs — Icon Grid</h1>\n' +
    '<p class="subtitle">Round 3: Fat, rounded bolt with golden ratio proportions. Accent contenders unchanged.</p>\n' +
    '<h2 class="contender">Contenders (Accent Mark — from Round 1)</h2>\n' +
    '<div class="grid">' + secContenders + '</div>\n' +
    '<h2 class="current">Round 3 — A: Refined Bolt (Fat + Rounded)</h2>\n' +
    '<div class="grid">' + secR3Bolt + '</div>\n' +
    '<h2 class="current">Round 3 — D: Refined "lé" Fusion</h2>\n' +
    '<div class="grid">' + secR3Le + '</div>\n' +
    '<h2 class="history">Round 2 History — Bolt Refinement</h2>\n' +
    '<div class="grid">' + secR2Bolt + '</div>\n' +
    '<h2 class="history">Round 2 History — "lé" Fusion</h2>\n' +
    '<div class="grid">' + secR2Le + '</div>\n' +
    '<h2 class="history">Round 1 History — Original Bolts</h2>\n' +
    '<div class="grid">' + secR1 + '</div>\n' +
    '</body></html>';

  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log('\n  Open _icons/icon-grid/index.html to review.');
}

main().catch(console.error);
