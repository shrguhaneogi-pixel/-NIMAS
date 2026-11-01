/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Reactive Ceremonial Candle & Thermal Heat-Haze Cursor
 * Features:
 * 1. State A (Idle): Ceremonial Taper Candle & Torch angled at -25deg with exact hotspot alignment at the wick tip.
 *    Velocity-reactive flame sway (opposite horizontal motion vector vx) and rising ember trail.
 * 2. State B (Pressed/Held): Smooth morph into radiant Thermal Heat-Mirage Orb with SVG turbulence/displacement filter.
 * 3. Zero-Lag rAF Loop with mutable refs (Zero React re-render churn on pointermove).
 * 4. Dispatches 'animas:cursor-press' events to synchronize 3D WebGL GLSL shader quad and PointLight.
 * 5. Touch device bypass with localized thermal shimmer burst on tap.
 */

import React, { useEffect, useState, useRef } from 'react';

export type CursorMode = 'default' | 'hover_interactive' | 'hover_relic' | 'dragging_orbit';

export interface CursorStateDetail {
  mode: CursorMode;
}

interface EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const CustomSanctuaryCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [tapRipples, setTapRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const cursorContainerRef = useRef<HTMLDivElement>(null);
  const candleBodyRef = useRef<SVGGElement>(null);
  const flameTipRef = useRef<SVGGElement>(null);
  const thermalOrbRef = useRef<HTMLDivElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const emberContainerRef = useRef<HTMLDivElement>(null);

  // Position, velocity, and press tracking
  const posRef = useRef({ x: -200, y: -200, prevX: -200, prevY: -200, vx: 0, vy: 0, lastTime: 0 });
  const isVisibleRef = useRef(false);
  const isPressedRef = useRef(false);
  const pressIntensityRef = useRef(0.0);
  const embersRef = useRef<EmberParticle[]>([]);
  const emberDivsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rippleIdRef = useRef(0);

  useEffect(() => {
    // Touchscreen / coarse pointer detection
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    setIsTouchDevice(isTouch);

    if (isTouch) {
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          const newId = ++rippleIdRef.current;
          setTapRipples((prev) => [...prev.slice(-3), { id: newId, x: touch.clientX, y: touch.clientY }]);
          setTimeout(() => {
            setTapRipples((prev) => prev.filter((r) => r.id !== newId));
          }, 550);
        }
      };
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      return () => window.removeEventListener('touchstart', handleTouchStart);
    }

    // Initialize 10 ember particles pool
    embersRef.current = Array.from({ length: 10 }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      size: 2,
      color: '#f59e0b'
    }));

    // Desktop Pointer Listeners
    const handlePointerMove = (e: PointerEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
        document.body.classList.add('has-custom-cursor');
      }

      const target = (e.target as HTMLElement)?.closest('[data-cursor], button, a, input, select');
      if (target) {
        const customType = target.getAttribute('data-cursor');
        setCursorMode(customType === 'relic' ? 'hover_relic' : 'hover_interactive');
      } else {
        setCursorMode((prev) => (prev === 'hover_interactive' ? 'default' : prev));
      }
    };

    const handlePointerDown = () => {
      isPressedRef.current = true;
      window.dispatchEvent(new CustomEvent('animas:cursor-press', { detail: { isPressed: true } }));
    };

    const handlePointerUp = () => {
      isPressedRef.current = false;
      window.dispatchEvent(new CustomEvent('animas:cursor-press', { detail: { isPressed: false } }));
    };

    const handlePointerLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
      isPressedRef.current = false;
      document.body.classList.remove('has-custom-cursor');
      window.dispatchEvent(new CustomEvent('animas:cursor-press', { detail: { isPressed: false } }));
    };

    const handleBlur = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
      isPressedRef.current = false;
      document.body.classList.remove('has-custom-cursor');
      window.dispatchEvent(new CustomEvent('animas:cursor-press', { detail: { isPressed: false } }));
    };

    const handleCursorStateEvent = (e: Event) => {
      const customEvent = e as CustomEvent<CursorStateDetail>;
      if (customEvent.detail && customEvent.detail.mode) {
        setCursorMode(customEvent.detail.mode);
        if (customEvent.detail.mode === 'dragging_orbit') {
          isPressedRef.current = true;
          window.dispatchEvent(new CustomEvent('animas:cursor-press', { detail: { isPressed: true } }));
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('animas:cursor-state', handleCursorStateEvent);

    // High-performance requestAnimationFrame Loop (Zero React re-render thrashing)
    let animationFrameId: number;
    let flameEmberTimer = 0;

    const renderLoop = (time: number) => {
      const p = posRef.current;
      const dt = Math.max(0.001, (time - p.lastTime) * 0.001);
      p.lastTime = time;

      // Calculate instantaneous mouse velocity
      p.vx = (p.x - p.prevX) / dt;
      p.vy = (p.y - p.prevY) / dt;
      p.prevX = p.x;
      p.prevY = p.y;

      // Smooth press intensity lerp
      const targetIntensity = isPressedRef.current ? 1.0 : 0.0;
      pressIntensityRef.current += (targetIntensity - pressIntensityRef.current) * Math.min(1.0, dt * 10.0);
      const intensity = pressIntensityRef.current;

      // 1. Position the cursor root at the exact (clientX, clientY) click hotspot
      if (cursorContainerRef.current) {
        cursorContainerRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }

      // 2. Animate SVG heat-shimmer turbulence frequency over time
      if (turbulenceRef.current) {
        const baseFreqX = 0.038 + Math.sin(time * 0.0035) * 0.012;
        const baseFreqY = 0.085 + Math.cos(time * 0.0042) * 0.018;
        turbulenceRef.current.setAttribute('baseFrequency', `${baseFreqX.toFixed(4)} ${baseFreqY.toFixed(4)}`);
      }

      // 3. Dynamic Flame Swaying (opposite to horizontal movement vector vx)
      const flameSway = Math.max(-28, Math.min(28, -p.vx * 0.035));
      const naturalFlicker = Math.sin(time * 0.018) * 3.5 + Math.cos(time * 0.031) * 2.0;
      const totalFlameAngle = flameSway + naturalFlicker;

      if (flameTipRef.current) {
        flameTipRef.current.style.transform = `rotate(${totalFlameAngle}deg)`;
      }

      // 4. State Morphing: Candle body fades out as thermal orb blooms
      if (candleBodyRef.current) {
        candleBodyRef.current.style.opacity = `${(1.0 - intensity * 0.95).toFixed(3)}`;
        candleBodyRef.current.style.transform = `scale(${Math.max(0.2, 1.0 - intensity * 0.6).toFixed(3)})`;
      }

      if (thermalOrbRef.current) {
        const orbScale = THREE_lerp(0.0, 1.0, intensity);
        thermalOrbRef.current.style.transform = `scale(${orbScale.toFixed(3)})`;
        thermalOrbRef.current.style.opacity = `${Math.min(1.0, intensity * 1.2).toFixed(3)}`;
      }

      // 5. Rising Ember Particles
      flameEmberTimer += dt;
      if (flameEmberTimer > 0.09) {
        flameEmberTimer = 0;
        // Spawn an ember from flame tip if moving or idle
        const inactiveEmber = embersRef.current.find((e) => e.life <= 0);
        if (inactiveEmber) {
          inactiveEmber.x = (Math.random() - 0.5) * 6;
          inactiveEmber.y = -4 - Math.random() * 4;
          inactiveEmber.vx = (Math.random() - 0.5) * 24 - p.vx * 0.02;
          inactiveEmber.vy = -35 - Math.random() * 45;
          inactiveEmber.life = 0.001;
          inactiveEmber.maxLife = 0.5 + Math.random() * 0.4;
          inactiveEmber.size = Math.random() > 0.5 ? 2.5 : 1.5;
          inactiveEmber.color = Math.random() > 0.4 ? '#f59e0b' : '#fde68a';
        }
      }

      // Update embers pool
      for (let i = 0; i < embersRef.current.length; i++) {
        const ember = embersRef.current[i];
        const domEl = emberDivsRef.current[i];

        if (ember.life > 0 && ember.life < ember.maxLife) {
          ember.life += dt;
          ember.x += ember.vx * dt;
          ember.y += ember.vy * dt;
          const progress = ember.life / ember.maxLife;
          const opacity = Math.max(0, 1.0 - progress * progress);

          if (domEl) {
            domEl.style.transform = `translate3d(${ember.x.toFixed(1)}px, ${ember.y.toFixed(1)}px, 0)`;
            domEl.style.opacity = `${opacity.toFixed(2)}`;
            domEl.style.display = 'block';
          }
        } else {
          ember.life = 0;
          if (domEl) {
            domEl.style.display = 'none';
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('animas:cursor-state', handleCursorStateEvent);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  // Touch screen mobile tap / hold thermal ripple fallback
  if (isTouchDevice) {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {tapRipples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute rounded-full border-2 border-amber-400 bg-amber-500/20 shadow-[0_0_24px_rgba(245,158,11,0.6)] pointer-events-none animate-ping"
            style={{
              left: ripple.x - 24,
              top: ripple.y - 24,
              width: 48,
              height: 48
            }}
          />
        ))}
      </div>
    );
  }

  if (!isVisible) return null;

  const isRelic = cursorMode === 'hover_relic';
  const isInteractive = cursorMode === 'hover_interactive';

  return (
    <>
      {/* SVG Shimmer / Heat-Distortion Filter definition for DOM elements */}
      <svg className="fixed top-0 left-0 w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="animas-heat-shimmer" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.04 0.09"
              numOctaves="2"
              seed="5"
              result="heatNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="heatNoise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Root Cursor Container anchored strictly at (clientX, clientY) */}
      <div
        ref={cursorContainerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] select-none"
        style={{ willChange: 'transform' }}
      >
        {/* 1. STATE B: Thermal Heat-Mirage Orb (Expands on Press / Hold) */}
        <div
          ref={thermalOrbRef}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none flex items-center justify-center transition-opacity"
          style={{
            filter: 'url(#animas-heat-shimmer)',
            transformOrigin: 'center center'
          }}
        >
          {/* Outer Heat Mirage Shockwave Halo */}
          <div className="w-full h-full rounded-full border-2 border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-orange-500/25 to-yellow-300/30 animate-pulse" />
          
          {/* Inner Incandescent Core */}
          <div className="absolute w-10 h-10 rounded-full bg-gradient-to-r from-[#fffbeb] via-[#fde68a] to-[#f59e0b] shadow-[0_0_28px_8px_rgba(251,146,60,0.85)]" />
        </div>

        {/* 2. STATE A: Ceremonial Taper Candle & Torch (Idle / Moving) */}
        <div className="relative pointer-events-none" style={{ transformOrigin: '0 0' }}>
          
          {/* Flame Tip Layer (Centered at Wick Tip 0,0) */}
          <svg
            className="overflow-visible"
            width="32"
            height="32"
            viewBox="-16 -24 32 32"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <g ref={flameTipRef} style={{ transformOrigin: '0 0' }}>
              {/* Outer Golden Corona */}
              <ellipse cx="0" cy="-8" rx="7" ry="11" fill="#ea580c" opacity="0.65" />
              
              {/* Saffron Marigold Body */}
              <ellipse cx="0" cy="-7" rx="5" ry="8" fill="#f59e0b" />
              
              {/* Wax Amber Inner Core */}
              <ellipse cx="0" cy="-5" rx="3" ry="5.5" fill="#fde68a" />
              
              {/* White-Hot Flame Center */}
              <ellipse cx="0" cy="-3.5" rx="1.5" ry="3" fill="#fffbeb" />
              
              {/* Wick Carbon Thread */}
              <line x1="0" y1="0" x2="0" y2="-3" stroke="#23161c" strokeWidth="1.25" strokeLinecap="round" />
            </g>

            {/* Contextual Relic / Interactive Reticle Accent */}
            {isRelic && (
              <g className="animate-spin" style={{ transformOrigin: '0 0' }}>
                <circle cx="0" cy="0" r="14" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
                <rect x="-1" y="-1" width="2" height="2" fill="#fffbeb" />
              </g>
            )}

            {isInteractive && !isRelic && (
              <rect
                x="-10"
                y="-10"
                width="20"
                height="20"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.25"
                strokeDasharray="2 3"
              />
            )}
          </svg>

          {/* Angled Taper Candle / Matchstick Body (-25deg angle away from wick tip) */}
          <svg
            className="overflow-visible"
            width="36"
            height="48"
            viewBox="0 0 36 48"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <g
              ref={candleBodyRef}
              style={{
                transform: 'rotate(-25deg)',
                transformOrigin: '0 0',
                transition: 'opacity 0.15s ease-out'
              }}
            >
              {/* Wax Sconce Top Collar */}
              <ellipse cx="0" cy="1" rx="3.5" ry="1.2" fill="#fde68a" stroke="#78350f" strokeWidth="0.5" />
              
              {/* Taper Candle Stick Shaft */}
              <polygon
                points="-3,1 3,1 2,36 -2,36"
                fill="url(#candle-wax-gradient)"
                stroke="#4a1525"
                strokeWidth="0.75"
              />

              {/* Terracotta/Brass Base ferrule */}
              <rect x="-2.5" y="36" width="5" height="4" fill="#78350f" stroke="#23161c" strokeWidth="0.5" />

              <defs>
                <linearGradient id="candle-wax-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="50%" stopColor="#fffbeb" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </g>
          </svg>
        </div>

        {/* 3. Rising Pixel Ember Particles Trail */}
        <div ref={emberContainerRef} className="absolute top-0 left-0 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { emberDivsRef.current[i] = el; }}
              className="absolute w-1 h-1 rounded-sm shadow-[0_0_4px_#f59e0b] pointer-events-none"
              style={{
                backgroundColor: i % 2 === 0 ? '#f59e0b' : '#fde68a',
                display: 'none'
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

// Math helper for linear interpolation
function THREE_lerp(start: number, end: number, t: number): number {
  return start * (1.0 - t) + end * t;
}
