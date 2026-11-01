/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Interactive Diegetic Relic Wrapper
 * Implements:
 * 1. Forgiving 1.5x invisible hit-proxy for precise mobile/desktop raycasting
 * 2. Targeted Drei <Html> occlusion reference (avoiding scene-wide raycast loops)
 * 3. Strict e.stopPropagation() and e.delta > 2 click throttling (preventing drag-orbit conflicts)
 * 4. WCAG AA keyboard accessibility (tabIndex, role="button", aria-label, Enter/Space keydown)
 * 5. Smooth 60fps PBR emissive amber shader glow (#F59E0B) via frame interpolation
 */

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Sparkles } from 'lucide-react';

export interface InteractiveRelicProps {
  id: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  roleSubtitle: string;
  markerOffset?: [number, number, number];
  proxyDimensions?: [number, number, number];
  occludeTargets?: React.RefObject<THREE.Object3D | null>[];
  isSelected?: boolean;
  isDrawerOpen?: boolean;
  onSelect: (id: string) => void;
  onHoverChange?: (title: string | null) => void;
  children: React.ReactNode;
}

export const InteractiveRelic: React.FC<InteractiveRelicProps> = ({
  id,
  position,
  rotation = [0, 0, 0],
  title,
  roleSubtitle,
  markerOffset = [0, 0.55, 0],
  proxyDimensions = [0.85, 0.95, 0.85],
  occludeTargets,
  isSelected = false,
  isDrawerOpen = false,
  onSelect,
  onHoverChange,
  children
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const emissiveIntensityRef = useRef(0);
  const amberColor = useRef(new THREE.Color(0xf59e0b));
  const blackColor = useRef(new THREE.Color(0x000000));

  // Clean hover notification
  useEffect(() => {
    if (isHovered || isFocused) {
      onHoverChange?.(title);
    } else {
      onHoverChange?.(null);
    }
  }, [isHovered, isFocused, title, onHoverChange]);

  // Smooth 60 FPS PBR Emissive Amber Lerp on Mesh Standard Materials
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetIntensity = isHovered || isFocused || isSelected ? 0.85 : 0.0;
    emissiveIntensityRef.current = THREE.MathUtils.damp(
      emissiveIntensityRef.current,
      targetIntensity,
      8.0,
      delta
    );

    const currentIntensity = emissiveIntensityRef.current;

    groupRef.current.traverse((child) => {
      // Exclude helper meshes and proxies
      if ((child as THREE.Mesh).isMesh && child.name !== 'proxy_mesh') {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const mat of mats) {
            if ('emissive' in mat && 'emissiveIntensity' in mat) {
              const stdMat = mat as THREE.MeshStandardMaterial;
              stdMat.emissive.lerpColors(
                blackColor.current,
                amberColor.current,
                Math.min(1.0, currentIntensity * 1.2)
              );
              stdMat.emissiveIntensity = currentIntensity;
            }
          }
        }
      }
    });
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setIsHovered(false);
  };

  // Delta-based Click Throttling: prevents camera drag releases from triggering clicks
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (e.delta !== undefined && e.delta > 2) {
      return; // Dragged orbit detected, suppress click
    }
    onSelect(id);
  };

  const isExpanded = isHovered || isFocused;
  const isHidden = isDrawerOpen && !isSelected;

  return (
    <group ref={groupRef} position={position} rotation={rotation} name={`interactive_relic_${id}`}>
      {/* 1.5x Invisible Hit-Proxy Mesh for Generous Touch/Pointer Interaction */}
      <mesh
        name="proxy_mesh"
        visible={false}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <boxGeometry args={proxyDimensions} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Actual 3D Procedural Mesh Content */}
      {children}

      {/* Diegetic HTML Spatial Marker */}
      <Html
        position={markerOffset}
        center
        distanceFactor={7.5}
        occlude={occludeTargets as any}
        className={`select-none transition-all duration-300 ${
          isHidden ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'
        }`}
      >
        <div
          role="button"
          tabIndex={0}
          aria-label={`Inspect memorial offering: ${title}, ${roleSubtitle}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onSelect(id);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          className={`relative group flex items-center justify-center cursor-pointer transition-none focus-visible:outline-none`}
        >
          {/* Stepped Pixel Beacon */}
          <div
            className={`w-5 h-5 pixel-box-amber flex items-center justify-center transition-none ${
              isExpanded
                ? 'border-amber-400 bg-amber-600 shadow-[2px_2px_0px_#000]'
                : 'shadow-[1px_1px_0px_#000]'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 ${
                isExpanded ? 'bg-amber-200' : 'bg-amber-400 animate-pulse'
              }`}
            />
          </div>

          {/* Stepped Pixel Metadata Tooltip */}
          <div
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[240px] p-2 pixel-box-amber text-left pointer-events-none z-50 ${
              isExpanded
                ? 'block'
                : 'hidden'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <h5 className="font-pixel-display text-[9px] text-amber-300 uppercase truncate">
                {title}
              </h5>
            </div>
            <p className="font-pixel-body text-[8px] text-stone-300 leading-snug truncate">
              {roleSubtitle}
            </p>
            <div className="mt-1 pt-1 border-t border-[#78350f] flex items-center justify-between text-[7px] font-pixel-body text-amber-400">
              <span>[Enter] Inspect</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};
