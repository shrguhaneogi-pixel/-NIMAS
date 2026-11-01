/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Top-Down Lit White Candle DOM Cursor
 * Features:
 * 1. Strict top-down circular white wax pillar with centered 2x2 yellow/orange wick flame.
 * 2. Static, snappy DOM sprite tracking mouse via integer-snapped translate3d.
 * 3. transform-origin: center center with -50% translation offset (center flame is exact click hotspot).
 * 4. Zero pointerdown morphing, zero scaling, zero turbulence/heat-haze filters, zero reticle churn.
 * 5. Touch device bypass with clean touch handling.
 */

import React, { useEffect, useState, useRef } from 'react';

export type CursorMode = 'default' | 'hover_interactive' | 'hover_relic' | 'dragging_orbit';

export interface CursorStateDetail {
  mode: CursorMode;
}

export const CustomSanctuaryCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorContainerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Coarse pointer / touch screen bypass
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const updateTransform = () => {
      if (cursorContainerRef.current) {
        cursorContainerRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Snappy integer-snapped coordinates
      posRef.current.x = Math.round(e.clientX);
      posRef.current.y = Math.round(e.clientY);

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
        document.body.classList.add('has-custom-cursor');
      }

      // Fast synchronous DOM update with zero React re-render churn
      updateTransform();
    };

    const handlePointerLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
      document.body.classList.remove('has-custom-cursor');
    };

    const handleBlur = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
      document.body.classList.remove('has-custom-cursor');
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('blur', handleBlur);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <div
      ref={cursorContainerRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] select-none"
      style={{
        willChange: 'transform',
        transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`,
        transformOrigin: 'center center'
      }}
    >
      {/* 
        Centering Wrapper:
        -50% horizontal and vertical translation offsets the container so that
        the absolute center flame of the 16x16 pixel-art candle is the precise click hotspot.
      */}
      <div
        className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '16px',
          height: '16px',
          transformOrigin: 'center center'
        }}
      >
        {/* Strict 16x16 Top-Down Lit White Candle Pixel-Art SVG */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          className="block w-4 h-4"
          aria-hidden="true"
        >
          {/* Outer Shaded Cylinder Lip (Top-Down Wax Pillar Boundary) */}
          <rect x="6" y="2" width="4" height="1" fill="#d4d4d8" />
          <rect x="4" y="3" width="2" height="1" fill="#d4d4d8" />
          <rect x="10" y="3" width="2" height="1" fill="#d4d4d8" />
          <rect x="3" y="4" width="1" height="1" fill="#d4d4d8" />
          <rect x="12" y="4" width="1" height="1" fill="#d4d4d8" />
          <rect x="2" y="5" width="1" height="6" fill="#d4d4d8" />
          <rect x="13" y="5" width="1" height="6" fill="#d4d4d8" />
          <rect x="3" y="11" width="1" height="1" fill="#d4d4d8" />
          <rect x="12" y="11" width="1" height="1" fill="#d4d4d8" />
          <rect x="4" y="12" width="2" height="1" fill="#a1a1aa" />
          <rect x="10" y="12" width="2" height="1" fill="#a1a1aa" />
          <rect x="6" y="13" width="4" height="1" fill="#a1a1aa" />

          {/* White Circular Wax Body */}
          <rect x="6" y="3" width="4" height="1" fill="#fffbeb" />
          <rect x="4" y="4" width="8" height="1" fill="#ffffff" />
          <rect x="3" y="5" width="2" height="6" fill="#ffffff" />
          <rect x="11" y="5" width="2" height="6" fill="#ffffff" />
          <rect x="5" y="5" width="6" height="1" fill="#fffbeb" />
          <rect x="5" y="10" width="6" height="1" fill="#fffbeb" />
          <rect x="4" y="11" width="8" height="1" fill="#ffffff" />
          <rect x="6" y="12" width="4" height="1" fill="#fffbeb" />

          {/* Warm Melted Wax Pool Around Central Wick */}
          <rect x="5" y="6" width="6" height="4" fill="#fef3c7" />

          {/* Outer Flame Corona / Warm Ember Glow */}
          <rect x="6" y="7" width="1" height="1" fill="#f59e0b" />
          <rect x="9" y="7" width="1" height="1" fill="#f59e0b" />
          <rect x="6" y="8" width="1" height="1" fill="#ea580c" />
          <rect x="9" y="8" width="1" height="1" fill="#ea580c" />

          {/* 
            Absolute Center 2x2 Wick & Lit Flame (Hotspot)
            (7,7): Bone white hot core
            (8,7): Bright wax amber flame
            (7,8): Luminous marigold flame
            (8,8): Orange-carbon wick ember
          */}
          <rect x="7" y="7" width="1" height="1" fill="#fffbeb" />
          <rect x="8" y="7" width="1" height="1" fill="#fde68a" />
          <rect x="7" y="8" width="1" height="1" fill="#f59e0b" />
          <rect x="8" y="8" width="1" height="1" fill="#ea580c" />
        </svg>
      </div>
    </div>
  );
};
