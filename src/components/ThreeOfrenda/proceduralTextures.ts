/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Procedural Pixel Textures
 * 16-Bit Sacred Aesthetic with 4x4 Ordered Bayer Matrix Dithering & Color Quantization.
 * 64x64 / 128x128 Internal Resolution, NearestFilter, Zero Mipmap Overhead.
 */

import * as THREE from 'three';

export interface ProceduralTextureSet {
  wood: THREE.CanvasTexture;
  corbelledStone: THREE.CanvasTexture;
  chevronFloor: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  sugarSkull: THREE.CanvasTexture;
  flameGlowSprite: THREE.CanvasTexture;
  marigoldPetal: THREE.CanvasTexture;
  papelPicado: THREE.CanvasTexture[];
  portraits: Map<string, THREE.CanvasTexture>;
  noiseNormalMap: THREE.CanvasTexture;
  thermalGradientRamp: THREE.CanvasTexture;
  allTextures: THREE.CanvasTexture[];
}

/** Yield to main thread to guarantee 60fps frame pacing during startup */
export const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

// ----------------------------------------------------
// 16-COLOR DÍA DE LOS MUERTOS SACRED PALETTE
// ----------------------------------------------------
export interface RGBColor {
  r: number;
  g: number;
  b: number;
  hex: string;
}

export const SACRED_PALETTE: RGBColor[] = [
  { r: 7, g: 8, b: 13, hex: '#07080d' },       // 0: Obsidian Void
  { r: 18, g: 20, b: 31, hex: '#12141f' },     // 1: Midnight Deep
  { r: 35, g: 22, b: 28, hex: '#23161c' },     // 2: Sacred Copal
  { r: 74, g: 21, b: 37, hex: '#4a1525' },     // 3: Dried Dahlia Wine
  { r: 120, g: 53, b: 15, hex: '#78350f' },    // 4: Terracotta Earth
  { r: 161, g: 98, b: 7, hex: '#a16207' },     // 5: Aged Cempasúchil
  { r: 217, g: 119, b: 6, hex: '#d97706' },    // 6: Golden Sun Gold
  { r: 245, g: 158, b: 11, hex: '#f59e0b' },   // 7: Luminous Marigold
  { r: 253, g: 230, b: 138, hex: '#fde68a' },  // 8: Candle Wax Amber
  { r: 255, g: 251, b: 235, hex: '#fffbeb' },  // 9: Bone White
  { r: 112, g: 26, b: 117, hex: '#701a75' },   // 10: Mystic Velvet Purple
  { r: 162, g: 28, b: 175, hex: '#a21caf' },   // 11: Papel Picado Magenta
  { r: 236, g: 72, b: 153, hex: '#ec4899' },   // 12: Ceremonial Rose
  { r: 14, g: 116, b: 144, hex: '#0e7490' },   // 13: Spirit Turquoise
  { r: 6, g: 182, b: 212, hex: '#06b6d4' },    // 14: Ancestral Cyan
  { r: 16, g: 185, b: 129, hex: '#10b981' }    // 15: Sacred Agave Green
];

// 4x4 Bayer Matrix for Ordered Dithering
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

/**
 * Quantize an RGB pixel with 4x4 Bayer matrix ordered dithering
 */
function applyBayerDither(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  ditherStrength = 36,
  preserveAlpha = true
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = data[idx + 3];

      if (preserveAlpha && alpha < 32) {
        data[idx + 3] = 0;
        continue;
      }

      const bayerVal = (BAYER_4X4[y % 4][x % 4] / 16.0 - 0.5) * ditherStrength;

      const r = Math.min(255, Math.max(0, data[idx + 0] + bayerVal));
      const g = Math.min(255, Math.max(0, data[idx + 1] + bayerVal));
      const b = Math.min(255, Math.max(0, data[idx + 2] + bayerVal));

      // Find closest color in SACRED_PALETTE by Euclidean distance
      let minDist = Infinity;
      let best = SACRED_PALETTE[0];

      for (let i = 0; i < SACRED_PALETTE.length; i++) {
        const pal = SACRED_PALETTE[i];
        // Weighted perception distance (Red: 0.3, Green: 0.59, Blue: 0.11)
        const dr = r - pal.r;
        const dg = g - pal.g;
        const db = b - pal.b;
        const dist = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11;
        if (dist < minDist) {
          minDist = dist;
          best = pal;
        }
      }

      data[idx + 0] = best.r;
      data[idx + 1] = best.g;
      data[idx + 2] = best.b;
      if (preserveAlpha && alpha >= 32) {
        data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/** Configures a canvas texture with crisp nearest-neighbor retro sampling */
function setupPixelTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 64x64 Dithered Basalt / Corbelled Stone Texture
 */
export function createCorbelledStoneTexture(): THREE.CanvasTexture {
  const w = 64, h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#161821';
  ctx.fillRect(0, 0, w, h);

  // Stepped stone block horizontal seams
  for (let y = 0; y < h; y += 16) {
    ctx.fillStyle = '#07080d';
    ctx.fillRect(0, y, w, 2);

    ctx.fillStyle = '#32374e';
    ctx.fillRect(0, y + 2, w, 1);

    // Vertical joints staggered
    const offset = (y / 16) % 2 === 0 ? 0 : 16;
    for (let x = offset; x < w; x += 32) {
      ctx.fillStyle = '#07080d';
      ctx.fillRect(x, y, 2, 16);
      ctx.fillStyle = '#32374e';
      ctx.fillRect(x + 2, y, 1, 16);
    }
  }

  // Chiseled flecks
  for (let i = 0; i < 40; i++) {
    const rx = Math.floor(Math.random() * w);
    const ry = Math.floor(Math.random() * h);
    ctx.fillStyle = Math.random() > 0.5 ? '#23161c' : '#3c4465';
    ctx.fillRect(rx, ry, 2, 1);
  }

  applyBayerDither(ctx, w, h, 28, false);

  const texture = setupPixelTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * 64x64 Dithered Chevron Herringbone Stone Floor Texture
 */
export function createChevronFloorTexture(): THREE.CanvasTexture {
  const w = 64, h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f1118';
  ctx.fillRect(0, 0, w, h);

  const cw = 16, ch = 8;
  for (let y = 0; y < h; y += ch) {
    for (let x = 0; x < w; x += cw) {
      const isLeft = (x / cw) % 2 === 0;
      ctx.fillStyle = (x + y) % 16 === 0 ? '#1b1e2c' : '#141724';

      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + cw, y + ch);
        ctx.lineTo(x + cw, y + ch + 6);
        ctx.lineTo(x, y + 6);
      } else {
        ctx.moveTo(x, y + ch);
        ctx.lineTo(x + cw, y);
        ctx.lineTo(x + cw, y + 6);
        ctx.lineTo(x, y + ch + 6);
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#07080d';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  applyBayerDither(ctx, w, h, 24, false);

  const texture = setupPixelTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * 64x64 Dithered Mexican Cedar Wood Grain Texture
 */
export function createWoodTexture(): THREE.CanvasTexture {
  const w = 64, h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2c1810';
  ctx.fillRect(0, 0, w, h);

  // Horizontal wood grain bands
  for (let y = 0; y < h; y += 4) {
    ctx.fillStyle = y % 8 === 0 ? '#451a03' : '#1b0e07';
    ctx.fillRect(0, y, w, 2);
  }

  // Plank edge border
  ctx.fillStyle = '#07080d';
  ctx.fillRect(0, 0, w, 2);
  ctx.fillRect(0, h - 2, w, 2);

  applyBayerDither(ctx, w, h, 32, false);

  const texture = setupPixelTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * 64x64 Dithered Papel Picado Cutout Banner Texture
 */
export function createPapelPicadoTexture(colorHex: string, patternType: number): THREE.CanvasTexture {
  const w = 64, h = 80;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, w, h);

  // Cutout punch holes
  ctx.globalCompositeOperation = 'destination-out';

  // Bottom serrations
  for (let x = 0; x < w; x += 8) {
    ctx.beginPath();
    ctx.moveTo(x, h);
    ctx.lineTo(x + 4, h - 8);
    ctx.lineTo(x + 8, h);
    ctx.fill();
  }

  const cx = 32, cy = 36;
  if (patternType === 0) {
    // Pixel Calavera Skull punchout
    ctx.fillRect(cx - 10, cy - 12, 20, 16);
    ctx.fillRect(cx - 6, cy + 4, 12, 8);

    // Eye sockets preserved
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = colorHex;
    ctx.fillRect(cx - 7, cy - 8, 5, 5);
    ctx.fillRect(cx + 2, cy - 8, 5, 5);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(cx - 5, cy - 6, 2, 2);
    ctx.fillRect(cx + 3, cy - 6, 2, 2);
    ctx.fillRect(cx - 2, cy - 1, 4, 3);
  } else if (patternType === 1) {
    // Sacred Cempasúchil bloom punchout
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8;
      ctx.fillRect(cx + Math.cos(a) * 14 - 2, cy + Math.sin(a) * 14 - 2, 5, 5);
    }
  } else if (patternType === 2) {
    // Stepped Sunburst Diamond
    for (let r = 4; r <= 16; r += 4) {
      ctx.strokeRect(cx - r, cy - r, r * 2, r * 2);
    }
  } else {
    // Checker lace slits
    for (let y = 14; y < h - 16; y += 8) {
      for (let x = 10; x < w - 10; x += 8) {
        ctx.fillRect(x, y, 3, 3);
      }
    }
  }

  // Border perforations
  for (let x = 6; x < w - 6; x += 6) {
    ctx.fillRect(x, 4, 2, 2);
  }
  for (let y = 10; y < h - 10; y += 6) {
    ctx.fillRect(4, y, 2, 2);
    ctx.fillRect(w - 6, y, 2, 2);
  }

  ctx.globalCompositeOperation = 'source-over';
  applyBayerDither(ctx, w, h, 20, true);

  return setupPixelTexture(canvas);
}

/**
 * 128x128 Dithered Linocut Engraving Portrait Texture
 */
export function createPortraitTexture(name: string, subtitle: string, accentColor: string): THREE.CanvasTexture {
  const w = 128, h = 160;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const cx = 64, cy = 68;

  // Aged parchment base
  ctx.fillStyle = '#f8f1e0';
  ctx.fillRect(0, 0, w, h);

  // Stepped 2px border
  ctx.fillStyle = '#2d1b0f';
  ctx.fillRect(2, 2, w - 4, 3);
  ctx.fillRect(2, h - 5, w - 4, 3);
  ctx.fillRect(2, 2, 3, h - 4);
  ctx.fillRect(w - 5, 2, 3, h - 4);

  // Accent inner border
  ctx.fillStyle = accentColor;
  ctx.fillRect(6, 6, w - 12, 1);
  ctx.fillRect(6, h - 8, w - 12, 1);
  ctx.fillRect(6, 6, 1, h - 14);
  ctx.fillRect(w - 7, 6, 1, h - 14);

  // Central Portrait Medallion
  ctx.fillStyle = '#ecd8b4';
  ctx.beginPath();
  ctx.arc(cx, cy, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#2d1b0f';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Torso / Shoulders Silhouette
  ctx.fillStyle = '#1e1008';
  ctx.beginPath();
  ctx.moveTo(cx - 36, cy + 42);
  ctx.lineTo(cx - 16, cy + 18);
  ctx.lineTo(cx + 16, cy + 18);
  ctx.lineTo(cx + 36, cy + 42);
  ctx.closePath();
  ctx.fill();

  // Head contour
  ctx.fillStyle = '#1e1008';
  ctx.beginPath();
  ctx.arc(cx, cy - 4, 18, 0, Math.PI * 2);
  ctx.fill();

  // Face flesh
  ctx.fillStyle = '#ecd8b4';
  ctx.beginPath();
  ctx.arc(cx, cy - 3, 14, 0, Math.PI * 2);
  ctx.fill();

  // Eyes & Eyebrows
  ctx.fillStyle = '#1e1008';
  ctx.fillRect(cx - 8, cy - 8, 5, 2);
  ctx.fillRect(cx + 3, cy - 8, 5, 2);
  ctx.fillRect(cx - 6, cy - 5, 2, 2);
  ctx.fillRect(cx + 4, cy - 5, 2, 2);

  // Nose & Mouth
  ctx.fillRect(cx - 1, cy - 2, 2, 4);
  ctx.fillRect(cx - 4, cy + 4, 8, 2);

  // Character iconography
  if (name.includes('Elena')) {
    // Flower hair crown
    ctx.fillStyle = '#ea580c';
    for (let f = -3; f <= 3; f++) {
      ctx.fillRect(cx + f * 5 - 2, cy - 22, 4, 4);
    }
  } else if (name.includes('Mateo')) {
    // Mustache & Sombrero brim
    ctx.fillStyle = '#1e1008';
    ctx.fillRect(cx - 9, cy + 2, 18, 3);
    ctx.fillRect(cx - 26, cy - 20, 52, 4);
  } else if (name.includes('Héctor') || name.includes('Hector')) {
    // Fedora hat & music rosette
    ctx.fillStyle = '#1e1008';
    ctx.fillRect(cx - 20, cy - 20, 40, 4);
    ctx.fillRect(cx - 12, cy - 28, 24, 8);
  } else if (name.includes('Rosa')) {
    // Mantilla veil
    ctx.fillStyle = '#a21caf';
    ctx.fillRect(cx - 20, cy - 16, 40, 4);
  } else if (name.includes('Sofia')) {
    // Healer leaves
    ctx.fillStyle = '#10b981';
    ctx.fillRect(cx - 22, cy + 8, 6, 6);
    ctx.fillRect(cx + 16, cy + 8, 6, 6);
  }

  // Name Cartouche Plaque at bottom
  ctx.fillStyle = '#12141f';
  ctx.fillRect(10, h - 32, w - 20, 24);
  ctx.strokeStyle = accentColor;
  ctx.strokeRect(10, h - 32, w - 20, 24);

  // Pixel Text using Canvas
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(name.toUpperCase(), cx, h - 20);

  ctx.fillStyle = '#f59e0b';
  ctx.font = '6px monospace';
  ctx.fillText(subtitle.slice(0, 18), cx, h - 11);

  applyBayerDither(ctx, w, h, 24, false);

  return setupPixelTexture(canvas);
}

/**
 * 64x64 Soft Radial Dithered Contact Shadow Texture
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const w = 64, h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  applyBayerDither(ctx, w, h, 30, true);

  return setupPixelTexture(canvas);
}

/**
 * 64x64 Dithered Sugar Skull Face Texture
 */
export function createSugarSkullTexture(): THREE.CanvasTexture {
  const w = 64, h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(0, 0, w, h);

  // Cyan & Magenta floral eye sockets
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(16, 22, 12, 12);
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(36, 22, 12, 12);

  // Hollow eye center
  ctx.fillStyle = '#07080d';
  ctx.fillRect(20, 26, 4, 4);
  ctx.fillRect(40, 26, 4, 4);

  // Inverted heart nose
  ctx.fillStyle = '#07080d';
  ctx.fillRect(30, 38, 4, 5);

  // Forehead marigold jewel
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(28, 8, 8, 8);
  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(31, 11, 2, 2);

  // Stitched tooth grin
  ctx.fillStyle = '#07080d';
  ctx.fillRect(20, 50, 24, 2);
  for (let x = 22; x <= 42; x += 4) {
    ctx.fillRect(x, 47, 2, 8);
  }

  applyBayerDither(ctx, w, h, 20, false);

  return setupPixelTexture(canvas);
}

/**
 * 64x64 Additive Pixel Candle Glow Billboard Sprite Texture
 */
export function createFlameGlowSpriteTexture(): THREE.CanvasTexture {
  const w = 64, h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255, 251, 235, 1.0)');
  grad.addColorStop(0.25, 'rgba(245, 158, 11, 0.7)');
  grad.addColorStop(0.6, 'rgba(217, 119, 6, 0.25)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  applyBayerDither(ctx, w, h, 28, true);

  return setupPixelTexture(canvas);
}

/**
 * 32x64 Dithered Marigold Petal Texture
 */
export function createMarigoldPetalTexture(): THREE.CanvasTexture {
  const w = 32, h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000000';
  ctx.clearRect(0, 0, w, h);

  // Petal shape
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(16, 60);
  ctx.lineTo(4, 24);
  ctx.lineTo(10, 6);
  ctx.lineTo(16, 12);
  ctx.lineTo(22, 6);
  ctx.lineTo(28, 24);
  ctx.closePath();
  ctx.fill();

  // Base gradient & central vein
  ctx.fillStyle = '#78350f';
  ctx.fillRect(15, 30, 2, 28);

  applyBayerDither(ctx, w, h, 24, true);

  return setupPixelTexture(canvas);
}

/**
 * 128x128 Tileable Seamless Noise & Normal Map Texture Generator
 * Encodes horizontal tangent deflection in R, vertical convective flow in G,
 * and multi-scale thermal density mask in B.
 */
export function createNoiseNormalMap(width = 128, height = 128): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const twoPi = Math.PI * 2;

  for (let y = 0; y < height; y++) {
    const v = (y / height) * twoPi;
    for (let x = 0; x < width; x++) {
      const u = (x / width) * twoPi;

      // Seamless periodic trigonometric harmonics
      const n1 = Math.sin(u) + Math.cos(v);
      const n2 = Math.sin(2 * u + 1.2) * 0.5 + Math.cos(2 * v + 0.8) * 0.5;
      const n3 = Math.sin(4 * u - v) * 0.25 + Math.cos(3 * u + 4 * v) * 0.25;
      const n4 = Math.sin(6 * u + 2 * v) * 0.12 + Math.cos(2 * u - 6 * v) * 0.12;

      const density = (n1 + n2 + n3 + n4) / 1.87;

      // Derivatives for normal/gradient deflection
      const dx = Math.cos(u) + Math.cos(2 * u + 1.2) + 4 * Math.cos(4 * u - v) * 0.25 + 6 * Math.cos(6 * u + 2 * v) * 0.12;
      const dy = -Math.sin(v) - Math.sin(2 * v + 0.8) - 4 * Math.sin(3 * u + 4 * v) * 0.25 - 6 * Math.sin(2 * u - 6 * v) * 0.12;

      const idx = (y * width + x) * 4;
      data[idx + 0] = Math.min(255, Math.max(0, Math.floor(128 + dx * 45))); // R: Tangent dx
      data[idx + 1] = Math.min(255, Math.max(0, Math.floor(128 + dy * 45))); // G: Convection dy
      data[idx + 2] = Math.min(255, Math.max(0, Math.floor(128 + density * 65))); // B: Turbulence
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/**
 * 256x1 Solar Golden Thermal Gradient Lookup Ramp
 * Ramp: Obsidian Void -> Wine Amber -> Saffron Orange -> Luminous Gold -> Candle Amber -> White-Hot Core
 */
export function createThermalGradientRamp(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0.0, 'rgba(7, 8, 13, 0.0)');
  grad.addColorStop(0.18, 'rgba(74, 21, 37, 0.35)');
  grad.addColorStop(0.42, 'rgba(234, 88, 12, 0.7)');
  grad.addColorStop(0.68, 'rgba(245, 158, 11, 0.9)');
  grad.addColorStop(0.88, 'rgba(253, 230, 138, 0.98)');
  grad.addColorStop(1.0, 'rgba(255, 251, 235, 1.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Asynchronously build all retro 16-color dithered textures
 */
export async function buildOfrendaTexturesAsync(
  onProgress?: (progressPct: number) => void
): Promise<ProceduralTextureSet> {
  const allTextures: THREE.CanvasTexture[] = [];

  onProgress?.(10);
  await yieldToMain();
  const wood = createWoodTexture();
  allTextures.push(wood);

  onProgress?.(25);
  await yieldToMain();
  const corbelledStone = createCorbelledStoneTexture();
  allTextures.push(corbelledStone);

  onProgress?.(40);
  await yieldToMain();
  const chevronFloor = createChevronFloorTexture();
  allTextures.push(chevronFloor);

  onProgress?.(55);
  await yieldToMain();
  const contactShadow = createContactShadowTexture();
  const sugarSkull = createSugarSkullTexture();
  const flameGlowSprite = createFlameGlowSpriteTexture();
  const marigoldPetal = createMarigoldPetalTexture();
  allTextures.push(contactShadow, sugarSkull, flameGlowSprite, marigoldPetal);

  onProgress?.(70);
  await yieldToMain();
  // 5 vibrant papel picado variants
  const bannerHues = ['#701a75', '#d97706', '#06b6d4', '#ec4899', '#10b981'];
  const papelPicado: THREE.CanvasTexture[] = [];
  for (let i = 0; i < bannerHues.length; i++) {
    const tex = createPapelPicadoTexture(bannerHues[i], i % 4);
    papelPicado.push(tex);
    allTextures.push(tex);
  }

  onProgress?.(85);
  await yieldToMain();
  // 5 nicho portrait textures
  const portraits = new Map<string, THREE.CanvasTexture>();
  const portraitDefs = [
    { id: 'nicho_elena', name: 'Elena Reyes', sub: '1924–2012 • Matriarch', col: '#d97706' },
    { id: 'nicho_mateo', name: 'Mateo Reyes', sub: '1920–1998 • Patriarch', col: '#06b6d4' },
    { id: 'nicho_hector', name: 'Tío Héctor', sub: '1948–2016 • Musician', col: '#f59e0b' },
    { id: 'nicho_rosa', name: 'Rosa Reyes', sub: '1952–2020 • Chronicler', col: '#ec4899' },
    { id: 'nicho_sofia', name: 'Dr. Sofia Reyes', sub: '1975–Now • Healer', col: '#10b981' }
  ];

  for (const p of portraitDefs) {
    const pTex = createPortraitTexture(p.name, p.sub, p.col);
    portraits.set(p.id, pTex);
    allTextures.push(pTex);
  }

  onProgress?.(95);
  await yieldToMain();
  // Thermal Heat Shimmer maps
  const noiseNormalMap = createNoiseNormalMap(128, 128);
  const thermalGradientRamp = createThermalGradientRamp();
  allTextures.push(noiseNormalMap, thermalGradientRamp);

  onProgress?.(100);
  await yieldToMain();

  return {
    wood,
    corbelledStone,
    chevronFloor,
    contactShadow,
    sugarSkull,
    flameGlowSprite,
    marigoldPetal,
    papelPicado,
    portraits,
    noiseNormalMap,
    thermalGradientRamp,
    allTextures
  };
}
