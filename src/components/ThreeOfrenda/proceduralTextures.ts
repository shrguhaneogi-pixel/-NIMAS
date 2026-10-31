/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Procedural Textures
 * Zero external image dependencies (zero 404s). Generated via HTML5 Canvas.
 * Supports asynchronous yielding to prevent main-thread freezing.
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
  allTextures: THREE.CanvasTexture[];
}

/** Yield to main thread to ensure smooth UI and 60fps frame pacing */
export const yieldToMain = () => new Promise<void>(resolve => setTimeout(resolve, 0));

/**
 * Procedural aged basalt/granite corbelled stone texture with mortar joints and chisel grain
 */
export function createCorbelledStoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian/basalt dark stone base
  ctx.fillStyle = '#161821';
  ctx.fillRect(0, 0, 512, 512);

  // Stone grain noise
  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const s = 1 + Math.random() * 3;
    const lum = Math.floor(25 + Math.random() * 35);
    ctx.fillStyle = `rgb(${lum}, ${lum + 2}, ${lum + 8})`;
    ctx.fillRect(x, y, s, s);
  }

  // Stone blocks / horizontal courses with mortar
  const courseHeight = 64;
  for (let y = 0; y <= 512; y += courseHeight) {
    // Mortar shadow line
    ctx.strokeStyle = '#08090d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    // Mortar highlight edge
    ctx.strokeStyle = 'rgba(70, 75, 95, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y + 2);
    ctx.lineTo(512, y + 2);
    ctx.stroke();

    // Vertical joints staggered
    const offset = (y / courseHeight) % 2 === 0 ? 0 : 128;
    for (let x = offset; x <= 512; x += 256) {
      ctx.strokeStyle = '#08090d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + courseHeight);
      ctx.stroke();
    }
  }

  // Subtle chisel marks
  ctx.strokeStyle = 'rgba(100, 110, 140, 0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 300; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    const angle = 0.2 + (Math.random() - 0.5) * 0.4;
    const len = 12 + Math.random() * 20;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural deep slate chevron herringbone floor texture (inspired by reference image 3)
 */
export function createChevronFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep slate background
  ctx.fillStyle = '#0f1118';
  ctx.fillRect(0, 0, 512, 512);

  // Chevron herringbone stone pavers
  const chevronW = 64;
  const chevronH = 32;

  ctx.lineWidth = 2.5;

  for (let y = -chevronH * 2; y <= 512 + chevronH * 2; y += chevronH) {
    for (let x = 0; x < 512; x += chevronW) {
      const isLeft = (x / chevronW) % 2 === 0;

      // Color variation across slate pavers
      const shade = 18 + Math.floor(Math.sin(x * 0.05 + y * 0.08) * 8 + Math.random() * 6);
      ctx.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 6})`;

      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + chevronW, y + chevronH);
        ctx.lineTo(x + chevronW, y + chevronH + 28);
        ctx.lineTo(x, y + 28);
      } else {
        ctx.moveTo(x, y + chevronH);
        ctx.lineTo(x + chevronW, y);
        ctx.lineTo(x + chevronW, y + 28);
        ctx.lineTo(x, y + chevronH + 28);
      }
      ctx.closePath();
      ctx.fill();

      // Stone paver outline
      ctx.strokeStyle = '#07080b';
      ctx.stroke();

      // Top bevel highlight
      ctx.strokeStyle = 'rgba(75, 85, 110, 0.2)';
      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + chevronW, y + chevronH);
      } else {
        ctx.moveTo(x, y + chevronH);
        ctx.lineTo(x + chevronW, y);
      }
      ctx.stroke();
    }
  }

  // Stone surface speckle
  for (let i = 0; i < 1500; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 0, 0, 0.25)' : 'rgba(90, 105, 130, 0.15)';
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural Mexican dark cedar wood grain texture
 */
export function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base rich dark cedar
  ctx.fillStyle = '#2c1810';
  ctx.fillRect(0, 0, 512, 512);

  // Planks and grain rings
  for (let y = 0; y < 512; y += 4) {
    const alpha = 0.08 + Math.sin(y * 0.05) * 0.04 + Math.random() * 0.05;
    ctx.fillStyle = `rgba(18, 9, 5, ${alpha})`;
    ctx.fillRect(0, y, 512, 2);
  }

  // Fine wood fibers
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const len = 30 + Math.random() * 80;
    ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(74, 38, 22, 0.25)' : 'rgba(25, 12, 6, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 5, y + len * 0.5, x - 5, y + len * 0.8, x, y + len);
    ctx.stroke();
  }

  // Soft plank borders
  ctx.strokeStyle = 'rgba(10, 5, 2, 0.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural Papel Picado (perforated tissue paper banner) with vibrant jewel tones
 * (inspired by reference image 1: royal purple, cyan, Aztec gold, marigold orange, ceremonial magenta)
 */
export function createPapelPicadoTexture(colorHex: string, patternType: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 340;
  const ctx = canvas.getContext('2d')!;

  // Background banner color
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 256, 340);

  // Cutout perforations (set to transparent)
  ctx.globalCompositeOperation = 'destination-out';

  // Scalloped / serrated bottom fringing edge
  ctx.beginPath();
  for (let x = 0; x <= 256; x += 32) {
    ctx.arc(x + 16, 340, 16, Math.PI, 0, false);
  }
  ctx.fill();

  // Bottom fringe teeth
  for (let x = 8; x <= 248; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 320);
    ctx.lineTo(x + 8, 335);
    ctx.lineTo(x + 16, 320);
    ctx.fill();
  }

  const cx = 128, cy = 160;

  if (patternType === 0) {
    // Calavera Catrina skull cutout with floral eyes
    ctx.beginPath();
    ctx.arc(cx, cy - 25, 34, 0, Math.PI * 2);
    ctx.rect(cx - 24, cy - 10, 48, 38);
    ctx.fill();

    // Preserve inner eye flowers & nose
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = colorHex;
    // Eye sockets
    ctx.beginPath();
    ctx.arc(cx - 12, cy - 24, 7, 0, Math.PI * 2);
    ctx.arc(cx + 12, cy - 24, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'destination-out';
    // Pupil punch
    ctx.beginPath();
    ctx.arc(cx - 12, cy - 24, 3, 0, Math.PI * 2);
    ctx.arc(cx + 12, cy - 24, 3, 0, Math.PI * 2);
    // Inverted heart nose
    ctx.arc(cx, cy - 5, 5, 0, Math.PI * 2);
    ctx.fill();

    // Teeth slits
    for (let tx = cx - 16; tx <= cx + 16; tx += 8) {
      ctx.fillRect(tx, cy + 14, 4, 12);
    }
  } else if (patternType === 1) {
    // Sacred Cempasúchil Blossom motif
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI * 2) / 12;
      const r = 48;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI * 2) / 12 + Math.PI / 12;
      const r = 70;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (patternType === 2) {
    // Radiant Sunburst & Sacred Cross
    for (let r = 24; r <= 84; r += 20) {
      const petals = r === 24 ? 8 : r === 44 ? 12 : 16;
      for (let j = 0; j < petals; j++) {
        const a = (j * Math.PI * 2) / petals;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else {
    // Diamond lattice lace pattern
    for (let dy = 70; dy <= 260; dy += 28) {
      for (let dx = 40; dx <= 216; dx += 28) {
        ctx.beginPath();
        ctx.moveTo(dx, dy - 8);
        ctx.lineTo(dx + 8, dy);
        ctx.lineTo(dx, dy + 8);
        ctx.lineTo(dx - 8, dy);
        ctx.fill();
      }
    }
  }

  // Border perforations along top and sides
  for (let x = 24; x < 240; x += 20) {
    ctx.beginPath();
    ctx.arc(x, 24, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let y = 36; y < 310; y += 20) {
    ctx.beginPath();
    ctx.arc(20, y, 4, 0, Math.PI * 2);
    ctx.arc(236, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Portrait canvas for memorial nichos
 */
export function createPortraitTexture(name: string, subtitle: string, accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  // Aged sepia parchment background
  const grad = ctx.createRadialGradient(128, 160, 20, 128, 160, 180);
  grad.addColorStop(0, '#f4ecd8');
  grad.addColorStop(0.7, '#d8c29d');
  grad.addColorStop(1, '#9e8156');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 320);

  // Ornate oval frame inner ring
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(128, 140, 80, 100, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Silhouette bust
  ctx.fillStyle = '#3a271d';
  ctx.beginPath();
  ctx.arc(128, 105, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(128, 180, 52, 40, 0, Math.PI, 0, true);
  ctx.fill();

  // Flower crown garland in silhouette
  ctx.fillStyle = '#ff7b00';
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(128 + i * 11, 80 + Math.abs(i) * 3, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Text plate
  ctx.fillStyle = '#22150c';
  ctx.font = 'bold 18px serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, 128, 270);

  ctx.fillStyle = '#6b4d36';
  ctx.font = 'italic 12px sans-serif';
  ctx.fillText(subtitle, 128, 292);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural soft radial contact shadow texture
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Procedural Sugar Skull (Calavera) face texture
 */
export function createSugarSkullTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Smooth sugar porcelain white
  ctx.fillStyle = '#fbf7ee';
  ctx.fillRect(0, 0, 256, 256);

  // Marigold flower eyes (blue / magenta petals)
  const drawFlowerEye = (cx: number, cy: number, color: string) => {
    ctx.fillStyle = color;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * 16, cy + Math.sin(a) * 16, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    // Eye socket
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(cx, cy, 11, 0, Math.PI * 2);
    ctx.fill();
    // Inner jewel sparkle
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 3, 3, 0, Math.PI * 2);
    ctx.fill();
  };

  drawFlowerEye(80, 110, '#e81cff');
  drawFlowerEye(176, 110, '#00d2ff');

  // Heart-shaped nose cavity
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.moveTo(128, 140);
  ctx.bezierCurveTo(128, 134, 122, 130, 118, 130);
  ctx.bezierCurveTo(112, 130, 112, 138, 112, 138);
  ctx.bezierCurveTo(112, 146, 128, 154, 128, 158);
  ctx.bezierCurveTo(128, 154, 144, 146, 144, 138);
  ctx.bezierCurveTo(144, 138, 144, 130, 138, 130);
  ctx.bezierCurveTo(134, 130, 128, 134, 128, 140);
  ctx.fill();

  // Forehead ornate marigold cross
  ctx.strokeStyle = '#ff9900';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(128, 50, 18, 0, Math.PI * 2);
  ctx.stroke();

  // Stitched tooth grin
  ctx.strokeStyle = '#222222';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(85, 200);
  ctx.quadraticCurveTo(128, 215, 171, 200);
  ctx.stroke();

  for (let x = 95; x <= 161; x += 11) {
    ctx.beginPath();
    ctx.moveTo(x, 192);
    ctx.lineTo(x, 215);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural soft luminous flame glow sprite for candle colonnade
 * (Eliminates costly point lights while giving hundreds of radiant candles)
 */
export function createFlameGlowSpriteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
  grad.addColorStop(0, 'rgba(255, 245, 200, 1.0)');
  grad.addColorStop(0.25, 'rgba(255, 160, 40, 0.7)');
  grad.addColorStop(0.55, 'rgba(255, 90, 10, 0.25)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Procedural botanical marigold petal texture (inspired by reference image 2)
 */
export function createMarigoldPetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Organic petal gradient: deep saffron amber at base to bright golden marigold at tip
  const grad = ctx.createLinearGradient(32, 128, 32, 0);
  grad.addColorStop(0, '#c2410c');
  grad.addColorStop(0.4, '#ea580c');
  grad.addColorStop(0.85, '#f59e0b');
  grad.addColorStop(1.0, '#fbbf24');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(32, 120);
  // Curved base to serrated petal tip
  ctx.bezierCurveTo(10, 80, 8, 30, 20, 10);
  // Serrations
  ctx.lineTo(26, 4);
  ctx.lineTo(32, 12);
  ctx.lineTo(38, 4);
  ctx.lineTo(44, 10);
  ctx.bezierCurveTo(56, 30, 54, 80, 32, 120);
  ctx.fill();

  // Subtle central vein
  ctx.strokeStyle = 'rgba(154, 52, 18, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(32, 110);
  ctx.lineTo(32, 20);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Asynchronously build all required ofrenda textures, yielding control to main thread
 * between generation steps to prevent UI freeze and frame drops.
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
  // 5 vibrant papel picado variants (inspired by reference image 1)
  const bannerHues = ['#7e22ce', '#ea580c', '#0891b2', '#ca8a04', '#c026d3'];
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
    { id: 'nicho_elena', name: 'Elena Reyes', sub: '1924 – 2012 • Matriarch', col: '#d4af37' },
    { id: 'nicho_mateo', name: 'Mateo Reyes', sub: '1920 – 1998 • Patriarch', col: '#0891b2' },
    { id: 'nicho_hector', name: 'Tío Héctor', sub: '1948 – 2016 • Musician', col: '#ea580c' },
    { id: 'nicho_rosa', name: 'Rosa Reyes', sub: '1952 – 2020 • Chronicler', col: '#c026d3' },
    { id: 'nicho_sofia', name: 'Dr. Sofia Reyes', sub: '1975 – Present • Healer', col: '#16a34a' }
  ];

  for (const p of portraitDefs) {
    const pTex = createPortraitTexture(p.name, p.sub, p.col);
    portraits.set(p.id, pTex);
    allTextures.push(pTex);
  }

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
    allTextures
  };
}
