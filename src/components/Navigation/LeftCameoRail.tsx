/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Left-Edge Vertical Pixel Cameo Rail
 * Stepped Pixel Medallions, Press Start 2P Initials, Zero Backdrop Blur.
 */

import React, { useState } from 'react';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { CempasuchilRosette } from '../UI/SacredIcons';

export interface CameoItem {
  id: string;
  name: string;
  role: string;
  type: 'nicho' | 'offering';
  initials: string;
}

const CAMEO_ITEMS: CameoItem[] = [
  { id: 'nicho_elena', name: 'Elena Reyes', role: 'Matriarch', type: 'nicho', initials: 'ER' },
  { id: 'nicho_mateo', name: 'Mateo Reyes', role: 'Patriarch', type: 'nicho', initials: 'MR' },
  { id: 'nicho_hector', name: 'Tío Héctor', role: 'Musician', type: 'nicho', initials: 'TH' },
  { id: 'nicho_rosa', name: 'Rosa Reyes', role: 'Chronicler', type: 'nicho', initials: 'RR' },
  { id: 'nicho_sofia', name: 'Dr. Sofia Reyes', role: 'Healer', type: 'nicho', initials: 'SR' },
  { id: 'offering_calavera', name: 'Sugar Skull', role: 'Confection', type: 'offering', initials: 'CA' },
  { id: 'offering_pan', name: 'Pan de Muerto', role: 'Anise Brioche', type: 'offering', initials: 'PM' },
  { id: 'offering_copal', name: 'Copal Incense', role: 'Sacred Smoke', type: 'offering', initials: 'CP' },
  { id: 'offering_guitar', name: 'Paracho Guitar', role: 'Palo Escrito', type: 'offering', initials: 'PG' }
];

interface LeftCameoRailProps {
  selectedOfferingId: string | null;
  onSelectRelic: (id: string) => void;
}

export const LeftCameoRail: React.FC<LeftCameoRailProps> = ({
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

        {/* Cameo Square Pixel Buttons List */}
        {!isCollapsed && (
          <div className="flex flex-col items-center space-y-1 pt-1 border-t-2 border-[#232a42]">
            {CAMEO_ITEMS.map((item) => {
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
                    className={`w-7 h-7 flex items-center justify-center cursor-pointer transition-none ${
                      isSelected
                        ? 'border-2 border-amber-400 bg-amber-600 text-[#07080d] shadow-[2px_2px_0px_#000]'
                        : 'border-2 border-[#282e46] bg-[#121526] text-stone-300 hover:border-amber-400 hover:text-amber-300 shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    <span className="font-pixel-display text-[8px] font-bold">
                      {item.initials}
                    </span>
                  </button>

                  {/* Right-Anchored Pixel Tooltip */}
                  <div
                    className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 pixel-box-amber pointer-events-none z-50 whitespace-nowrap ${
                      isHovered
                        ? 'block'
                        : 'hidden'
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
