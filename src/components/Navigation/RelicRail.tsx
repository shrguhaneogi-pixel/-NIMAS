/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Left-Edge Vertical Relic Rail
 * 16x16 Pixel-Art Icons replacing text initials.
 * 100% Visual Stepped Buttons, Shape-Rendering CrispEdges, Día de los Muertos Palette.
 */

import React, { useState } from 'react';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { CempasuchilRosette } from '../UI/SacredIcons';

export interface RelicItem {
  id: string;
  name: string;
  role: string;
  type: 'nicho' | 'offering';
}

export const RELIC_ITEMS: RelicItem[] = [
  { id: 'nicho_elena', name: 'Elena Reyes', role: 'Matriarch', type: 'nicho' },
  { id: 'nicho_mateo', name: 'Mateo Reyes', role: 'Patriarch', type: 'nicho' },
  { id: 'nicho_hector', name: 'Tío Héctor', role: 'Musician', type: 'nicho' },
  { id: 'nicho_rosa', name: 'Rosa Reyes', role: 'Chronicler', type: 'nicho' },
  { id: 'nicho_sofia', name: 'Dr. Sofia Reyes', role: 'Healer', type: 'nicho' },
  { id: 'offering_calavera', name: 'Sugar Skull', role: 'Confection', type: 'offering' },
  { id: 'offering_pan', name: 'Pan de Muerto', role: 'Anise Brioche', type: 'offering' },
  { id: 'offering_copal', name: 'Copal Incense', role: 'Sacred Smoke', type: 'offering' },
  { id: 'offering_guitar', name: 'Paracho Guitar', role: 'Palo Escrito', type: 'offering' }
];

// Bespoke 16x16 Pixel-Art SVG Icons

export const ElenaCameoIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    {/* Stepped Cameo Frame */}
    <rect x="5" y="1" width="6" height="1" fill="#d97706" />
    <rect x="3" y="2" width="2" height="1" fill="#d97706" />
    <rect x="11" y="2" width="2" height="1" fill="#d97706" />
    <rect x="2" y="3" width="1" height="10" fill="#d97706" />
    <rect x="13" y="3" width="1" height="10" fill="#d97706" />
    <rect x="3" y="13" width="2" height="1" fill="#d97706" />
    <rect x="11" y="13" width="2" height="1" fill="#d97706" />
    <rect x="5" y="14" width="6" height="1" fill="#d97706" />
    {/* Frame Inner Backing */}
    <rect x="3" y="3" width="10" height="10" fill="#23161c" />
    {/* Matriarch Silhouette (High Bun, Profile & Rebozo) */}
    <rect x="7" y="3" width="2" height="2" fill="#fffbeb" />
    <rect x="9" y="3" width="1" height="1" fill="#ec4899" /> {/* Rosette pin */}
    <rect x="6" y="5" width="4" height="3" fill="#fffbeb" />
    <rect x="7" y="8" width="2" height="1" fill="#fde68a" />
    <rect x="5" y="9" width="6" height="2" fill="#fffbeb" />
    <rect x="4" y="11" width="8" height="2" fill="#fde68a" />
  </svg>
);

export const MateoCameoIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    {/* Stepped Cameo Frame */}
    <rect x="5" y="1" width="6" height="1" fill="#d97706" />
    <rect x="3" y="2" width="2" height="1" fill="#d97706" />
    <rect x="11" y="2" width="2" height="1" fill="#d97706" />
    <rect x="2" y="3" width="1" height="10" fill="#d97706" />
    <rect x="13" y="3" width="1" height="10" fill="#d97706" />
    <rect x="3" y="13" width="2" height="1" fill="#d97706" />
    <rect x="11" y="13" width="2" height="1" fill="#d97706" />
    <rect x="5" y="14" width="6" height="1" fill="#d97706" />
    {/* Frame Inner Backing */}
    <rect x="3" y="3" width="10" height="10" fill="#12141f" />
    {/* Patriarch Silhouette (Hat Crown, Wide Brim & Mustache) */}
    <rect x="6" y="3" width="4" height="2" fill="#78350f" />
    <rect x="4" y="5" width="8" height="1" fill="#f59e0b" /> {/* Hat Brim */}
    <rect x="6" y="6" width="4" height="2" fill="#fffbeb" />
    <rect x="5" y="8" width="6" height="1" fill="#23161c" /> {/* Mustache */}
    <rect x="7" y="9" width="2" height="1" fill="#fffbeb" />
    <rect x="5" y="10" width="6" height="3" fill="#4a1525" /> {/* Coat */}
  </svg>
);

export const HectorCameoIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    {/* Stepped Cameo Frame */}
    <rect x="5" y="1" width="6" height="1" fill="#d97706" />
    <rect x="3" y="2" width="2" height="1" fill="#d97706" />
    <rect x="11" y="2" width="2" height="1" fill="#d97706" />
    <rect x="2" y="3" width="1" height="10" fill="#d97706" />
    <rect x="13" y="3" width="1" height="10" fill="#d97706" />
    <rect x="3" y="13" width="2" height="1" fill="#d97706" />
    <rect x="11" y="13" width="2" height="1" fill="#d97706" />
    <rect x="5" y="14" width="6" height="1" fill="#d97706" />
    {/* Frame Inner Backing */}
    <rect x="3" y="3" width="10" height="10" fill="#23161c" />
    {/* Musician Silhouette (Tilted Hat & Instrument Silhouette) */}
    <rect x="6" y="3" width="4" height="1" fill="#f59e0b" />
    <rect x="4" y="4" width="8" height="1" fill="#f59e0b" />
    <rect x="6" y="5" width="4" height="3" fill="#fffbeb" />
    <rect x="4" y="8" width="2" height="4" fill="#a16207" /> {/* Peghead / neck */}
    <rect x="7" y="8" width="4" height="5" fill="#a16207" /> {/* Torso */}
    <rect x="5" y="9" width="1" height="1" fill="#fde68a" />
  </svg>
);

export const RosaCameoIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    {/* Stepped Cameo Frame */}
    <rect x="5" y="1" width="6" height="1" fill="#d97706" />
    <rect x="3" y="2" width="2" height="1" fill="#d97706" />
    <rect x="11" y="2" width="2" height="1" fill="#d97706" />
    <rect x="2" y="3" width="1" height="10" fill="#d97706" />
    <rect x="13" y="3" width="1" height="10" fill="#d97706" />
    <rect x="3" y="13" width="2" height="1" fill="#d97706" />
    <rect x="11" y="13" width="2" height="1" fill="#d97706" />
    <rect x="5" y="14" width="6" height="1" fill="#d97706" />
    {/* Frame Inner Backing */}
    <rect x="3" y="3" width="10" height="10" fill="#12141f" />
    {/* Chronicler Silhouette (Coiffure, Spectacles & Open Codex) */}
    <rect x="6" y="3" width="4" height="2" fill="#fffbeb" />
    <rect x="10" y="3" width="1" height="1" fill="#ec4899" /> {/* Dahlia blossom */}
    <rect x="5" y="5" width="6" height="2" fill="#fffbeb" />
    <rect x="6" y="6" width="4" height="1" fill="#06b6d4" /> {/* Spectacles */}
    <rect x="7" y="7" width="2" height="2" fill="#fffbeb" />
    <rect x="4" y="9" width="8" height="4" fill="#fde68a" /> {/* Open Ledger */}
    <rect x="7" y="9" width="2" height="4" fill="#23161c" /> {/* Ledger Spine */}
  </svg>
);

export const SofiaCameoIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    {/* Stepped Cameo Frame */}
    <rect x="5" y="1" width="6" height="1" fill="#d97706" />
    <rect x="3" y="2" width="2" height="1" fill="#d97706" />
    <rect x="11" y="2" width="2" height="1" fill="#d97706" />
    <rect x="2" y="3" width="1" height="10" fill="#d97706" />
    <rect x="13" y="3" width="1" height="10" fill="#d97706" />
    <rect x="3" y="13" width="2" height="1" fill="#d97706" />
    <rect x="11" y="13" width="2" height="1" fill="#d97706" />
    <rect x="5" y="14" width="6" height="1" fill="#d97706" />
    {/* Frame Inner Backing */}
    <rect x="3" y="3" width="10" height="10" fill="#23161c" />
    {/* Healer Silhouette (Updo, Doctor Lapels & Sacred Agave Plant) */}
    <rect x="6" y="3" width="4" height="2" fill="#fffbeb" />
    <rect x="6" y="5" width="4" height="3" fill="#fffbeb" />
    <rect x="5" y="8" width="6" height="2" fill="#fffbeb" />
    <rect x="7" y="10" width="2" height="3" fill="#10b981" /> {/* Agave stalk */}
    <rect x="5" y="11" width="2" height="1" fill="#10b981" /> {/* Agave leaf */}
    <rect x="9" y="11" width="2" height="1" fill="#10b981" /> {/* Agave leaf */}
  </svg>
);

export const SugarSkullIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    {/* Forehead Floral Corona */}
    <rect x="5" y="1" width="2" height="1" fill="#ec4899" />
    <rect x="7" y="1" width="2" height="1" fill="#f59e0b" />
    <rect x="9" y="1" width="2" height="1" fill="#06b6d4" />
    {/* Cranium Dome */}
    <rect x="4" y="2" width="8" height="2" fill="#fffbeb" />
    <rect x="3" y="4" width="10" height="4" fill="#fffbeb" />
    {/* Eye Sockets with Gem Pupils */}
    <rect x="4" y="5" width="3" height="3" fill="#23161c" />
    <rect x="9" y="5" width="3" height="3" fill="#23161c" />
    <rect x="5" y="6" width="1" height="1" fill="#06b6d4" /> {/* Cyan eye sparkle */}
    <rect x="10" y="6" width="1" height="1" fill="#ec4899" /> {/* Magenta eye sparkle */}
    {/* Nose Cavity & Cheeks */}
    <rect x="7" y="8" width="2" height="2" fill="#23161c" />
    <rect x="4" y="8" width="2" height="1" fill="#f59e0b" />
    <rect x="10" y="8" width="2" height="1" fill="#f59e0b" />
    {/* Teeth / Jaw */}
    <rect x="4" y="9" width="8" height="1" fill="#fffbeb" />
    <rect x="5" y="10" width="1" height="3" fill="#fffbeb" />
    <rect x="6" y="10" width="1" height="3" fill="#23161c" />
    <rect x="7" y="10" width="1" height="3" fill="#fffbeb" />
    <rect x="8" y="10" width="1" height="3" fill="#23161c" />
    <rect x="9" y="10" width="1" height="3" fill="#fffbeb" />
    <rect x="10" y="10" width="1" height="3" fill="#23161c" />
    <rect x="6" y="13" width="4" height="1" fill="#d97706" />
  </svg>
);

export const PanDeMuertoIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    {/* Central Knob / Skull Teardrop ("La Coronilla") */}
    <rect x="7" y="3" width="2" height="2" fill="#fffbeb" />
    <rect x="6" y="4" width="4" height="1" fill="#fde68a" />
    {/* Crossed Bones ("Canillas") & Baked Golden Loaf */}
    <rect x="5" y="5" width="6" height="1" fill="#d97706" />
    <rect x="7" y="5" width="2" height="7" fill="#fffbeb" /> {/* Vertical bone */}
    <rect x="4" y="6" width="8" height="1" fill="#f59e0b" />
    <rect x="3" y="7" width="10" height="1" fill="#f59e0b" />
    <rect x="2" y="8" width="12" height="2" fill="#fde68a" /> {/* Horizontal bone */}
    <rect x="3" y="10" width="10" height="2" fill="#d97706" />
    <rect x="4" y="12" width="8" height="1" fill="#a16207" />
    <rect x="5" y="13" width="6" height="1" fill="#78350f" />
    {/* Sugar Crystal Glint Dots */}
    <rect x="4" y="7" width="1" height="1" fill="#fffbeb" />
    <rect x="11" y="7" width="1" height="1" fill="#fffbeb" />
    <rect x="4" y="11" width="1" height="1" fill="#fffbeb" />
    <rect x="11" y="11" width="1" height="1" fill="#fffbeb" />
  </svg>
);

export const CopalChaliceIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    {/* Twisting Sacred Smoke Wisps */}
    <rect x="6" y="1" width="2" height="1" fill="#fffbeb" />
    <rect x="9" y="1" width="1" height="1" fill="#06b6d4" />
    <rect x="5" y="2" width="1" height="2" fill="#fffbeb" />
    <rect x="8" y="2" width="2" height="1" fill="#06b6d4" />
    <rect x="7" y="3" width="1" height="2" fill="#fde68a" />
    <rect x="10" y="3" width="1" height="1" fill="#0e7490" />
    <rect x="6" y="5" width="3" height="1" fill="#fffbeb" />
    <rect x="7" y="6" width="2" height="1" fill="#fde68a" />
    {/* Glowing Copal Embers inside Bowl */}
    <rect x="5" y="7" width="6" height="1" fill="#f59e0b" />
    <rect x="7" y="7" width="2" height="1" fill="#fffbeb" />
    {/* Sahumerio Chalice Bowl */}
    <rect x="3" y="8" width="10" height="1" fill="#d97706" />
    <rect x="4" y="9" width="8" height="2" fill="#78350f" />
    {/* Chalice Stem */}
    <rect x="7" y="11" width="2" height="2" fill="#a16207" />
    {/* Pedestal Base */}
    <rect x="5" y="13" width="6" height="1" fill="#d97706" />
    <rect x="4" y="14" width="8" height="1" fill="#78350f" />
  </svg>
);

export const ParachoGuitarIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    {/* Headstock & Tuning Pegs */}
    <rect x="6" y="1" width="1" height="1" fill="#fde68a" />
    <rect x="7" y="1" width="2" height="2" fill="#78350f" />
    <rect x="9" y="1" width="1" height="1" fill="#fde68a" />
    {/* Rosewood Fretboard Neck & Strings */}
    <rect x="7" y="3" width="2" height="4" fill="#4a1525" />
    <rect x="7" y="3" width="1" height="4" fill="#fffbeb" /> {/* String pair 1 */}
    <rect x="8" y="3" width="1" height="4" fill="#fde68a" /> {/* String pair 2 */}
    {/* Upper Bout */}
    <rect x="5" y="7" width="6" height="2" fill="#a16207" />
    {/* Narrow Waist & Rosette Soundhole */}
    <rect x="6" y="9" width="4" height="2" fill="#f59e0b" />
    <rect x="7" y="9" width="2" height="2" fill="#23161c" /> {/* Soundhole */}
    {/* Lower Bout */}
    <rect x="4" y="11" width="8" height="3" fill="#a16207" />
    {/* Classical Bridge */}
    <rect x="6" y="12" width="4" height="1" fill="#23161c" />
    <rect x="7" y="12" width="2" height="1" fill="#fffbeb" /> {/* Bone saddle */}
    <rect x="5" y="14" width="6" height="1" fill="#78350f" />
  </svg>
);

/**
 * Returns the bespoke 16x16 pixel-art icon component for a given relic ID.
 */
export function getRelicPixelIcon(id: string): React.ReactElement {
  switch (id) {
    case 'nicho_elena':
      return <ElenaCameoIcon />;
    case 'nicho_mateo':
      return <MateoCameoIcon />;
    case 'nicho_hector':
      return <HectorCameoIcon />;
    case 'nicho_rosa':
      return <RosaCameoIcon />;
    case 'nicho_sofia':
      return <SofiaCameoIcon />;
    case 'offering_calavera':
      return <SugarSkullIcon />;
    case 'offering_pan':
      return <PanDeMuertoIcon />;
    case 'offering_copal':
      return <CopalChaliceIcon />;
    case 'offering_guitar':
      return <ParachoGuitarIcon />;
    default:
      return <SugarSkullIcon />;
  }
}

interface RelicRailProps {
  selectedOfferingId: string | null;
  onSelectRelic: (id: string) => void;
}

export const RelicRail: React.FC<RelicRailProps> = ({
  selectedOfferingId,
  onSelectRelic
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside
      aria-label="Memorial Relics Rail"
      className="fixed left-3 top-1/2 -translate-y-1/2 z-30 pointer-events-auto hidden md:flex flex-col items-center select-none"
    >
      <div className="pixel-box p-1.5 flex flex-col items-center space-y-1">
        {/* Rail Top Header / Collapse Trigger */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          data-cursor="interactive"
          className="pixel-btn w-8 h-8 flex items-center justify-center text-amber-400 cursor-pointer"
          aria-label={isCollapsed ? 'Expand Relics Rail' : 'Collapse Relics Rail'}
          title={isCollapsed ? 'Show altar relics rail' : 'Minimize rail'}
        >
          {isCollapsed ? (
            <CempasuchilRosette className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-stone-400" />
          )}
        </button>

        {/* 100% Visual Pixel-Art Relic Buttons List (Zero text initials) */}
        {!isCollapsed && (
          <div className="flex flex-col items-center space-y-1 pt-1 border-t-2 border-[#232a42]">
            {RELIC_ITEMS.map((item) => {
              const isSelected = selectedOfferingId === item.id;
              const isHovered = hoveredId === item.id;

              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => onSelectRelic(item.id)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(item.id)}
                    onBlur={() => setHoveredId(null)}
                    data-cursor="relic"
                    aria-label={`Inspect ${item.name}: ${item.role}`}
                    className={`pixel-btn w-7 h-7 flex items-center justify-center cursor-pointer transition-none ${
                      isSelected
                        ? 'border-2 border-amber-400 bg-amber-600 shadow-[2px_2px_0px_#000]'
                        : 'border-2 border-[#282e46] bg-[#121526] hover:border-amber-400 shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    {/* Strict 16x16 Bespoke Pixel-Art Icon */}
                    {getRelicPixelIcon(item.id)}
                  </button>

                  {/* Right-Anchored Pixel Tooltip */}
                  <div
                    className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 pixel-box-amber pointer-events-none z-50 whitespace-nowrap ${
                      isHovered ? 'block' : 'hidden'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      <h6 className="font-pixel-display text-[9px] text-amber-300 uppercase">
                        {item.name}
                      </h6>
                    </div>
                    <p className="font-pixel-body text-[9px] text-stone-300 mt-0.5">
                      {item.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
