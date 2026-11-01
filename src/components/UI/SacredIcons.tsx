/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: 16x16 Integer Pixel-Grid Ceremonial SVG Iconography
 * Strict pixel rectangles, crisp edges, zero curved bezier paths, zero emojis.
 */

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 16x16 Pixel Cempasúchil Rosette Brand Mark
export const CempasuchilRosette: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    {/* Central Solar Core */}
    <rect x="7" y="7" width="2" height="2" className="fill-amber-300" />
    <rect x="6" y="6" width="4" height="4" fillOpacity="0.25" className="fill-amber-400" />

    {/* Cardinal Petals */}
    <rect x="7" y="2" width="2" height="3" className="fill-amber-500" />
    <rect x="7" y="11" width="2" height="3" className="fill-amber-500" />
    <rect x="2" y="7" width="3" height="2" className="fill-amber-500" />
    <rect x="11" y="7" width="3" height="2" className="fill-amber-500" />

    {/* Diagonal Petal Blocks */}
    <rect x="4" y="4" width="2" height="2" className="fill-amber-600" />
    <rect x="10" y="4" width="2" height="2" className="fill-amber-600" />
    <rect x="4" y="10" width="2" height="2" className="fill-amber-600" />
    <rect x="10" y="10" width="2" height="2" className="fill-amber-600" />
  </svg>
);

// 16x16 Stepped Mesoamerican Temple Glyph (The Sovereign Sanctuary Tab)
export const SanctuaryTemple: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    {/* Base Tier 1 */}
    <rect x="1" y="13" width="14" height="2" />
    {/* Tier 2 */}
    <rect x="3" y="10" width="10" height="2" />
    {/* Tier 3 */}
    <rect x="5" y="7" width="6" height="2" />
    {/* Apex Shrine */}
    <rect x="6" y="4" width="4" height="2" />
    {/* Apex Beacon */}
    <rect x="7" y="1" width="2" height="2" className="fill-amber-400" />
    {/* Portal Shrine Doorway */}
    <rect x="7" y="11" width="2" height="2" className="fill-black" />
  </svg>
);

// 16x16 Pixel Sacred Archive Scroll (Archive Explorer Tab)
export const ArchiveScroll: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    {/* Scroll Border */}
    <rect x="3" y="2" width="10" height="12" fillOpacity="0.2" />
    <rect x="3" y="2" width="10" height="1" />
    <rect x="3" y="13" width="10" height="1" />
    <rect x="2" y="3" width="1" height="10" />
    <rect x="13" y="3" width="1" height="10" />

    {/* Text Lines */}
    <rect x="5" y="5" width="6" height="1" className="fill-amber-300" />
    <rect x="5" y="7" width="6" height="1" />
    <rect x="5" y="9" width="4" height="1" />

    {/* Wax Seal */}
    <rect x="10" y="10" width="2" height="2" className="fill-amber-500" />
  </svg>
);

// 16x16 Intersecting Pixel Forensic Audit Lens (Audit Studio Tab)
export const AuditLens: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    {/* Octagonal Lens Rim */}
    <rect x="4" y="2" width="4" height="1" />
    <rect x="2" y="4" width="1" height="4" />
    <rect x="9" y="4" width="1" height="4" />
    <rect x="4" y="9" width="4" height="1" />
    <rect x="3" y="3" width="1" height="1" />
    <rect x="8" y="3" width="1" height="1" />
    <rect x="3" y="8" width="1" height="1" />
    <rect x="8" y="8" width="1" height="1" />

    {/* Center Reticle Cross */}
    <rect x="5" y="5" width="2" height="2" className="fill-amber-400" />

    {/* Handle */}
    <rect x="9" y="9" width="2" height="2" />
    <rect x="11" y="11" width="2" height="2" />
    <rect x="13" y="13" width="2" height="2" />
  </svg>
);

// 16x16 Ceremonial Pixel Stele / Data Casket (Scaffold Exporter Tab)
export const ExporterStele: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    {/* Stele Body */}
    <rect x="3" y="3" width="10" height="11" fillOpacity="0.2" />
    <rect x="4" y="2" width="8" height="1" />
    <rect x="2" y="14" width="12" height="1" />
    <rect x="2" y="3" width="1" height="11" />
    <rect x="13" y="3" width="1" height="11" />

    {/* Arrow Down Export Glyph */}
    <rect x="7" y="5" width="2" height="4" className="fill-amber-400" />
    <rect x="5" y="8" width="6" height="1" className="fill-amber-400" />
    <rect x="6" y="9" width="4" height="1" className="fill-amber-400" />
    <rect x="7" y="10" width="2" height="1" className="fill-amber-400" />
  </svg>
);

// 16x16 Pixel Architectural Blueprint Grid (Phase 3 Blueprint Tab)
export const BlueprintGrid: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    {/* Outer Frame */}
    <rect x="2" y="2" width="12" height="1" />
    <rect x="2" y="13" width="12" height="1" />
    <rect x="2" y="2" width="1" height="12" />
    <rect x="13" y="2" width="1" height="12" />

    {/* Grid Lines */}
    <rect x="6" y="2" width="1" height="12" fillOpacity="0.6" />
    <rect x="10" y="2" width="1" height="12" fillOpacity="0.6" />
    <rect x="2" y="6" width="12" height="1" fillOpacity="0.6" />
    <rect x="2" y="10" width="12" height="1" fillOpacity="0.6" />

    {/* Center Node */}
    <rect x="7" y="7" width="2" height="2" className="fill-amber-400" />
  </svg>
);

// 16x16 Pixel Sacred Candle Torch (Lighting Control)
export const SacredFlame: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    {/* Candle Base & Wax Pillar */}
    <rect x="4" y="14" width="8" height="1" />
    <rect x="6" y="8" width="4" height="6" fillOpacity="0.3" />
    <rect x="5" y="8" width="1" height="6" />
    <rect x="10" y="8" width="1" height="6" />

    {/* Wick */}
    <rect x="7" y="7" width="2" height="1" />

    {/* Stepped Pixel Flame */}
    <rect x="7" y="1" width="2" height="2" className="fill-amber-300" />
    <rect x="6" y="3" width="4" height="2" className="fill-amber-400" />
    <rect x="5" y="5" width="6" height="2" className="fill-amber-500" />
  </svg>
);

// 16x16 Pixel Botanical Petal (Particles Control)
export const BotanicalPetal: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    <rect x="7" y="2" width="2" height="2" />
    <rect x="5" y="4" width="6" height="3" className="fill-amber-500" />
    <rect x="4" y="7" width="8" height="4" className="fill-amber-500" />
    <rect x="5" y="11" width="6" height="2" className="fill-amber-600" />
    <rect x="7" y="13" width="2" height="2" className="fill-amber-700" />
    <rect x="7" y="5" width="2" height="7" className="fill-amber-300" />
  </svg>
);

// 16x16 Pixel Eye of Memory (Camera Views Control)
export const MinimalEye: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    {/* Stepped Eye Outline */}
    <rect x="5" y="4" width="6" height="1" />
    <rect x="3" y="5" width="2" height="1" />
    <rect x="11" y="5" width="2" height="1" />
    <rect x="1" y="6" width="2" height="3" />
    <rect x="13" y="6" width="2" height="3" />
    <rect x="3" y="9" width="2" height="1" />
    <rect x="11" y="9" width="2" height="1" />
    <rect x="5" y="10" width="6" height="1" />

    {/* Pupil */}
    <rect x="7" y="6" width="2" height="3" className="fill-amber-400" />
    <rect x="6" y="7" width="4" height="1" className="fill-amber-400" />
  </svg>
);

// 16x16 Pixel Sound Horn / Tuning Wave (Ambience Soundscape)
export const TuningForkWave: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    {/* Speaker Horn */}
    <rect x="2" y="6" width="3" height="4" />
    <rect x="5" y="5" width="2" height="6" />
    <rect x="7" y="4" width="2" height="8" />

    {/* Stepped Sound Waves */}
    <rect x="10" y="6" width="1" height="4" className="fill-amber-400" />
    <rect x="12" y="4" width="1" height="8" className="fill-amber-400" />
    <rect x="14" y="2" width="1" height="12" className="fill-amber-500" />
  </svg>
);

// 16x16 Pixel Sovereign Shield (Zero-Cloud Privacy Badge)
export const ShieldLocal: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    {/* Stepped Shield Rim */}
    <rect x="2" y="2" width="12" height="2" />
    <rect x="2" y="4" width="2" height="5" />
    <rect x="12" y="4" width="2" height="5" />
    <rect x="3" y="9" width="2" height="2" />
    <rect x="11" y="9" width="2" height="2" />
    <rect x="5" y="11" width="2" height="2" />
    <rect x="9" y="11" width="2" height="2" />
    <rect x="7" y="13" width="2" height="2" />

    {/* Checkmark */}
    <rect x="5" y="7" width="2" height="2" className="fill-emerald-400" />
    <rect x="7" y="9" width="2" height="2" className="fill-emerald-400" />
    <rect x="9" y="5" width="2" height="4" className="fill-emerald-400" />
  </svg>
);

// 16x16 Pixel Dialogue Glyph (Ask Archive)
export const InquestDialogue: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    shapeRendering="crispEdges"
    className={className}
  >
    {/* Speech Bubble */}
    <rect x="2" y="3" width="12" height="8" fillOpacity="0.2" />
    <rect x="3" y="2" width="10" height="1" />
    <rect x="2" y="3" width="1" height="8" />
    <rect x="13" y="3" width="1" height="8" />
    <rect x="3" y="11" width="10" height="1" />

    {/* Tail */}
    <rect x="4" y="12" width="3" height="1" />
    <rect x="3" y="13" width="2" height="1" />

    {/* 3 Pixel Dots */}
    <rect x="4" y="6" width="2" height="2" className="fill-amber-400" />
    <rect x="7" y="6" width="2" height="2" className="fill-amber-400" />
    <rect x="10" y="6" width="2" height="2" className="fill-amber-400" />
  </svg>
);
