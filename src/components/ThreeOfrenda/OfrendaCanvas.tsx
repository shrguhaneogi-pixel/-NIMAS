/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - React Three Fiber Canvas & Spatial Interactions
 * Implements:
 * 1. 3D Cursor Light Coupling via Angled Altar Proxy Plane (THREE.PointLight 0xff9d3b, 0.8, 4.0)
 * 2. Diegetic Hover Markers & Spatial Annotations via <Html occlude={[altarHitboxRef]}>
 * 3. 60 FPS PBR Emissive Amber Glow (#F59E0B) on hover/focus via frame interpolation
 * 4. 1.5x Forgiving Invisible Hit-Proxies with delta-based drag suppression (e.delta > 2)
 * 5. 3D Diegetic Typography (<Text>) with local font for sacred ceremonial inscriptions
 * 6. CameraControls smooth tweens with obsidian glass Reset View button and custom cursor state dispatching
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraControls, Text } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildOfrendaScene } from './sceneBuilder';
import { buildOfrendaTexturesAsync, ProceduralTextureSet } from './proceduralTextures';
import { InteractiveRelic } from './InteractiveRelic';
import { DitherCursorPostProcess } from './DitherCursorEffect';
import { VisualDirectionState, OfrendaItemClickData } from '../../types';
import { Loader2, Minimize2 } from 'lucide-react';

const DEFAULT_CAM_X = 0;
const DEFAULT_CAM_Y = 2.4;
const DEFAULT_CAM_Z = 5.8;
const DEFAULT_TARGET_X = 0;
const DEFAULT_TARGET_Y = 1.45;
const DEFAULT_TARGET_Z = 0;

// Reusable math helpers for zero-GC raycasting against angled proxy plane
const _raycaster = new THREE.Raycaster();
const _intersectionPoint = new THREE.Vector3();
const _petalDummy = new THREE.Object3D();

interface OfferingConfig {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  roleSubtitle: string;
  markerOffset: [number, number, number];
  proxyDimensions: [number, number, number];
  focusLookAt: {
    cam: [number, number, number];
    target: [number, number, number];
  };
}

const OFFERING_CONFIGS: OfferingConfig[] = [
  {
    id: 'nicho_elena',
    position: [0, 2.52, -0.38],
    rotation: [0, 0, 0],
    title: 'Elena Reyes',
    roleSubtitle: '1924 – 2012 • Matriarch',
    markerOffset: [0, 0.62, 0.05],
    proxyDimensions: [0.95, 1.25, 0.45],
    focusLookAt: { cam: [0, 2.52, 1.2], target: [0, 2.52, -0.38] }
  },
  {
    id: 'nicho_mateo',
    position: [-0.95, 1.82, -0.05],
    rotation: [0, 0.18, 0],
    title: 'Mateo Reyes',
    roleSubtitle: '1920 – 1998 • Patriarch',
    markerOffset: [0, 0.62, 0.05],
    proxyDimensions: [0.95, 1.25, 0.45],
    focusLookAt: { cam: [-0.95, 1.82, 1.5], target: [-0.95, 1.82, -0.05] }
  },
  {
    id: 'nicho_hector',
    position: [0.95, 1.82, -0.05],
    rotation: [0, -0.18, 0],
    title: 'Tío Héctor',
    roleSubtitle: '1948 – 2016 • Musician',
    markerOffset: [0, 0.62, 0.05],
    proxyDimensions: [0.95, 1.25, 0.45],
    focusLookAt: { cam: [0.95, 1.82, 1.5], target: [0.95, 1.82, -0.05] }
  },
  {
    id: 'nicho_rosa',
    position: [-1.85, 1.1, 0.7],
    rotation: [0, 0.28, 0],
    title: 'Rosa Reyes',
    roleSubtitle: '1952 – 2020 • Chronicler',
    markerOffset: [0, 0.62, 0.05],
    proxyDimensions: [0.95, 1.25, 0.45],
    focusLookAt: { cam: [-1.85, 1.1, 2.1], target: [-1.85, 1.1, 0.7] }
  },
  {
    id: 'nicho_sofia',
    position: [1.85, 1.1, 0.7],
    rotation: [0, -0.28, 0],
    title: 'Dr. Sofia Reyes',
    roleSubtitle: '1975 – Present • Healer',
    markerOffset: [0, 0.62, 0.05],
    proxyDimensions: [0.95, 1.25, 0.45],
    focusLookAt: { cam: [1.85, 1.1, 2.1], target: [1.85, 1.1, 0.7] }
  },
  {
    id: 'offering_calavera',
    position: [0, 1.48, 0.35],
    rotation: [0, 0, 0],
    title: 'Calavera de Azúcar',
    roleSubtitle: 'Decorated Sugar Skull of Lightness',
    markerOffset: [0, 0.42, 0],
    proxyDimensions: [0.65, 0.65, 0.65],
    focusLookAt: { cam: [0, 1.62, 1.6], target: [0, 1.48, 0.35] }
  },
  {
    id: 'offering_pan',
    position: [-0.75, 0.74, 1.05],
    rotation: [0, 0, 0],
    title: 'Pan de Muerto',
    roleSubtitle: 'Anise & Orange-Blossom Brioche',
    markerOffset: [0, 0.38, 0],
    proxyDimensions: [0.65, 0.55, 0.65],
    focusLookAt: { cam: [-0.75, 1.05, 2.05], target: [-0.75, 0.74, 1.05] }
  },
  {
    id: 'offering_copal',
    position: [0.75, 0.74, 1.05],
    rotation: [0, 0, 0],
    title: 'Copal Incense',
    roleSubtitle: 'Sahumerio Cleansing Resin Smoke',
    markerOffset: [0, 0.38, 0],
    proxyDimensions: [0.55, 0.55, 0.55],
    focusLookAt: { cam: [0.75, 1.05, 2.05], target: [0.75, 0.74, 1.05] }
  },
  {
    id: 'offering_guitar',
    position: [2.45, 0, 0.85],
    rotation: [-0.35, -0.4, 0.2],
    title: 'Paracho Guitar',
    roleSubtitle: "Tío Héctor's Palo Escrito Instrument",
    markerOffset: [0, 0.85, 0],
    proxyDimensions: [0.95, 1.4, 0.75],
    focusLookAt: { cam: [2.25, 0.75, 2.25], target: [2.45, 0.45, 0.85] }
  }
];

interface SanctuarySceneProps {
  textures: ProceduralTextureSet;
  visualState: VisualDirectionState;
  selectedOfferingId: string | null;
  cameraControlsRef: React.RefObject<CameraControls | null>;
  onItemClick: (item: OfrendaItemClickData) => void;
  onHoverItemChange?: (itemTitle: string | null) => void;
  setIsDefaultView: (val: boolean) => void;
}

const SanctuaryScene: React.FC<SanctuarySceneProps> = ({
  textures,
  visualState,
  selectedOfferingId,
  cameraControlsRef,
  onItemClick,
  onHoverItemChange,
  setIsDefaultView
}) => {
  const { scene, gl } = useThree();
  const altarHitboxRef = useRef<THREE.Mesh>(null);
  const cursorLightRef = useRef<THREE.PointLight>(null);
  // Angled Altar Proxy Plane matching the stepped slope of the 3-tier altar
  const altarProxyPlane = useMemo(() => {
    return new THREE.Plane(new THREE.Vector3(0, 0.35, 0.94).normalize(), -0.6);
  }, []);

  // Build Procedural Scene Graph
  const graph = useMemo(() => {
    return buildOfrendaScene(scene, textures);
  }, [scene, textures]);

  // Clean up GPU geometries and materials on unmount
  useEffect(() => {
    return () => {
      scene.remove(graph.keyLight);
      scene.remove(graph.fillLight);
      scene.remove(graph.altarGroup);
      scene.remove(graph.interactiveGroup);

      for (const geo of graph.disposables.geometries) {
        geo.dispose();
      }
      for (const mat of graph.disposables.materials) {
        mat.dispose();
      }
    };
  }, [graph, scene]);

  // Environment Studio Reflections
  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    return () => {
      if (scene.environment) scene.environment.dispose();
    };
  }, [gl, scene]);

  // Camera Synchronization with external camera profiles
  useEffect(() => {
    const controls = cameraControlsRef.current;
    if (!controls) return;

    if (visualState.camera_profile === 'inspect_nicho') {
      setIsDefaultView(false);
      controls.setLookAt(0, 2.5, 2.2, 0, 2.4, -0.4, true);
    } else if (visualState.camera_profile === 'inspect_candle') {
      setIsDefaultView(false);
      controls.setLookAt(-1.6, 1.2, 2.8, -2.1, 0.4, 1.8, true);
    } else if (visualState.camera_profile === 'inspect_recipe') {
      setIsDefaultView(false);
      controls.setLookAt(-0.6, 1.3, 2.2, -0.75, 0.8, 1.05, true);
    } else if (visualState.camera_profile === 'overview') {
      setIsDefaultView(true);
      controls.setLookAt(
        DEFAULT_CAM_X,
        DEFAULT_CAM_Y,
        DEFAULT_CAM_Z,
        DEFAULT_TARGET_X,
        DEFAULT_TARGET_Y,
        DEFAULT_TARGET_Z,
        true
      );
    }
  }, [visualState.camera_profile, cameraControlsRef, setIsDefaultView]);

  // Handle direct item selection with smooth camera tween
  const handleSelectRelic = (id: string) => {
    setIsDefaultView(false);
    const data = graph.clickableMap.get(id);
    if (data) {
      onItemClick(data);
    }

    const cfg = OFFERING_CONFIGS.find((c) => c.id === id);
    if (cfg && cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(
        cfg.focusLookAt.cam[0],
        cfg.focusLookAt.cam[1],
        cfg.focusLookAt.cam[2],
        cfg.focusLookAt.target[0],
        cfg.focusLookAt.target[1],
        cfg.focusLookAt.target[2],
        true
      );
    }
  };

  // Hover item change dispatcher with custom cursor sync
  const handleHoverChange = (title: string | null) => {
    onHoverItemChange?.(title);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('animas:cursor-state', {
          detail: { mode: title ? 'hover_relic' : 'default' }
        })
      );
    }
  };

  // Render loop animations for 3D cursor light, candles, smoke, and petals
  useFrame((state, delta) => {
    const clockDelta = Math.min(delta, 0.1);
    const elapsed = performance.now() * 0.001;

    // 1. Reactive 3D Cursor Light Projection on Angled Altar Plane
    if (cursorLightRef.current) {
      _raycaster.setFromCamera(state.pointer, state.camera);
      const hit = _raycaster.ray.intersectPlane(altarProxyPlane, _intersectionPoint);
      if (hit) {
        // Clamp inside sanctuary bounds
        const targetX = THREE.MathUtils.clamp(_intersectionPoint.x, -3.5, 3.5);
        const targetY = THREE.MathUtils.clamp(_intersectionPoint.y, 0.4, 3.8);
        const targetZ = THREE.MathUtils.clamp(_intersectionPoint.z + 0.35, -1.5, 2.5);

        cursorLightRef.current.position.lerp(
          new THREE.Vector3(targetX, targetY, targetZ),
          0.14
        );
      }

      // Warm candle light tracking altar plane with subtle natural flame shimmer
      cursorLightRef.current.color.setHex(0xff9d3b);
      const candleShimmer = Math.sin(elapsed * 3.6) * 0.05 + Math.cos(elapsed * 6.8) * 0.03;
      cursorLightRef.current.intensity = 1.0 + candleShimmer;
      cursorLightRef.current.distance = 4.5;
    }

    // 2. Candle Flame Flickering
    const flameWarmthMult =
      visualState.lighting_profile === 'warm_candle'
        ? 1.35
        : visualState.lighting_profile === 'soft_candle'
        ? 1.0
        : visualState.lighting_profile === 'subdued_amber'
        ? 0.75
        : visualState.lighting_profile === 'balanced_warm'
        ? 1.2
        : 0.85;

    for (let i = 0; i < graph.candles.length; i++) {
      const c = graph.candles[i];
      const flicker =
        Math.sin(elapsed * c.flickerSpeed + c.flickerOffset) * 0.15 +
        Math.cos(elapsed * (c.flickerSpeed * 1.6) + c.flickerOffset) * 0.08;
      const currentIntensity = Math.max(0.1, (c.baseIntensity + flicker) * flameWarmthMult);

      if (c.light) {
        c.light.intensity = currentIntensity;
      }

      const fScale = 1.0 + flicker * 0.6;
      c.flameMesh.scale.set(fScale, fScale * 1.1, fScale);
      c.flameInner.scale.set(fScale, fScale, fScale);

      if (c.haloSprite) {
        const hScale = 0.65 * (1.0 + flicker * 0.4);
        c.haloSprite.scale.set(hScale, hScale, 1.0);
      }
    }

    // 4. Copal Smoke Rise
    const smoke = graph.copalSmoke;
    const sPositions = smoke.points.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < smoke.count; i++) {
      sPositions[i * 3 + 1] += smoke.velocities[i * 3 + 1] * clockDelta;
      sPositions[i * 3 + 0] += Math.sin(elapsed * 2.0 + i) * 0.003;

      smoke.lifetimes[i] += clockDelta * 0.35;
      if (smoke.lifetimes[i] > 1.0 || sPositions[i * 3 + 1] > 2.8) {
        sPositions[i * 3 + 0] = 0.75 + (Math.random() - 0.5) * 0.05;
        sPositions[i * 3 + 1] = 0.86;
        sPositions[i * 3 + 2] = 1.05 + (Math.random() - 0.5) * 0.05;
        smoke.lifetimes[i] = 0;
      }
    }
    smoke.points.geometry.attributes.position.needsUpdate = true;

    // 5. Swirling Cempasúchil Petals
    const petals = graph.petals;
    const pSpeedMult =
      visualState.particle_profile === 'petal_drift'
        ? 1.3
        : visualState.particle_profile === 'gentle_drift'
        ? 0.8
        : visualState.particle_profile === 'none'
        ? 0.0
        : 0.5;

    for (let i = 0; i < petals.count; i++) {
      petals.positions[i * 3 + 0] += petals.velocities[i * 3 + 0] * clockDelta * pSpeedMult;
      petals.positions[i * 3 + 1] += petals.velocities[i * 3 + 1] * clockDelta * pSpeedMult;
      petals.positions[i * 3 + 2] += petals.velocities[i * 3 + 2] * clockDelta * pSpeedMult;

      petals.rotations[i * 3 + 0] += clockDelta * 1.5;
      petals.rotations[i * 3 + 1] += clockDelta * 1.2;

      if (petals.positions[i * 3 + 1] < 0.02 || petals.positions[i * 3 + 0] > 4.5) {
        petals.positions[i * 3 + 0] = -4.5 + (Math.random() - 0.5) * 1.5;
        petals.positions[i * 3 + 1] = 4.2 + Math.random() * 1.5;
        petals.positions[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
      }

      _petalDummy.position.set(petals.positions[i * 3], petals.positions[i * 3 + 1], petals.positions[i * 3 + 2]);
      _petalDummy.rotation.set(petals.rotations[i * 3], petals.rotations[i * 3 + 1], petals.rotations[i * 3 + 2]);
      _petalDummy.scale.setScalar(petals.scales[i]);
      _petalDummy.updateMatrix();
      petals.mesh.setMatrixAt(i, _petalDummy.matrix);
    }
    petals.mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Reactive 3D Cursor PointLight illuminating stone pavers, petals & portraits */}
      <pointLight
        ref={cursorLightRef}
        color={0xff9d3b}
        intensity={0.8}
        distance={4.0}
        decay={2.0}
        position={[0, 1.45, 1.0]}
      />

      {/* Targeted Occlusion Hitbox Mesh (Lightweight 12-polygon box preventing scene-wide raycast loops) */}
      <mesh ref={altarHitboxRef} visible={false} position={[0, 1.45, 0.1]}>
        <boxGeometry args={[4.4, 3.2, 2.6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 3D Diegetic Ceremonial Inscriptions Physically Grounded on Stone & Wood */}
      <group name="diegetic_sacred_typography">
        {/* Archway Keystone */}
        <Text
          position={[0, 3.42, -0.72]}
          fontSize={0.16}
          letterSpacing={0.2}
          color="#ea580c"
          font="/fonts/ceremonial.ttf"
          anchorX="center"
          anchorY="middle"
        >
          RECUERDA
          <meshStandardMaterial
            color="#ea580c"
            emissive="#d97706"
            emissiveIntensity={0.65}
            roughness={0.4}
          />
        </Text>

        {/* Tier 3 Riser */}
        <Text
          position={[0, 2.12, -0.42]}
          fontSize={0.09}
          letterSpacing={0.16}
          color="#f59e0b"
          font="/fonts/ceremonial.ttf"
          anchorX="center"
          anchorY="middle"
        >
          TRASCENDENCIA
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={0.55}
            roughness={0.4}
          />
        </Text>

        {/* Tier 2 Riser */}
        <Text
          position={[0, 1.42, 0.28]}
          fontSize={0.1}
          letterSpacing={0.18}
          color="#f59e0b"
          font="/fonts/ceremonial.ttf"
          anchorX="center"
          anchorY="middle"
        >
          MEMORIA
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={0.55}
            roughness={0.4}
          />
        </Text>

        {/* Tier 1 Riser */}
        <Text
          position={[0, 0.72, 0.98]}
          fontSize={0.1}
          letterSpacing={0.18}
          color="#ea580c"
          font="/fonts/ceremonial.ttf"
          anchorX="center"
          anchorY="middle"
        >
          TIERRA
          <meshStandardMaterial
            color="#ea580c"
            emissive="#d97706"
            emissiveIntensity={0.6}
            roughness={0.4}
          />
        </Text>
      </group>

      {/* 9 Interactive Offerings with Forgiving Proxies and Diegetic Markers */}
      {OFFERING_CONFIGS.map((cfg) => {
        const relicGroup = graph.relicGroups.get(cfg.id);
        if (!relicGroup) return null;

        return (
          <InteractiveRelic
            key={cfg.id}
            id={cfg.id}
            position={cfg.position}
            rotation={cfg.rotation}
            title={cfg.title}
            roleSubtitle={cfg.roleSubtitle}
            markerOffset={cfg.markerOffset}
            proxyDimensions={cfg.proxyDimensions}
            occludeTargets={[altarHitboxRef]}
            isSelected={selectedOfferingId === cfg.id}
            isDrawerOpen={!!selectedOfferingId}
            onSelect={handleSelectRelic}
            onHoverChange={handleHoverChange}
          >
            {/* The actual procedural relic meshes */}
            <primitive object={relicGroup} position={[0, 0, 0]} rotation={[0, 0, 0]} />
          </InteractiveRelic>
        );
      })}
    </>
  );
};

interface OfrendaCanvasProps {
  visualState: VisualDirectionState;
  onItemClick: (item: OfrendaItemClickData) => void;
  onHoverItemChange?: (itemTitle: string | null) => void;
  isCinematicActive?: boolean;
  selectedOfferingId?: string | null;
  onResetView?: () => void;
}

export const OfrendaCanvas: React.FC<OfrendaCanvasProps> = ({
  visualState,
  onItemClick,
  onHoverItemChange,
  isCinematicActive = false,
  selectedOfferingId = null,
  onResetView
}) => {
  const cameraControlsRef = useRef<CameraControls | null>(null);
  const [textures, setTextures] = useState<ProceduralTextureSet | null>(null);
  const [preloadProgress, setPreloadProgress] = useState<number | null>(0);
  const [isDefaultView, setIsDefaultView] = useState<boolean>(true);

  // Asynchronous procedural texture generation with yielding
  useEffect(() => {
    let isMounted = true;
    buildOfrendaTexturesAsync((pct) => {
      if (isMounted) setPreloadProgress(pct);
    }).then((tex) => {
      if (isMounted) {
        setTextures(tex);
        setPreloadProgress(null);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleZoomOut = () => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(
        DEFAULT_CAM_X,
        DEFAULT_CAM_Y,
        DEFAULT_CAM_Z,
        DEFAULT_TARGET_X,
        DEFAULT_TARGET_Y,
        DEFAULT_TARGET_Z,
        true
      );
    }
    setIsDefaultView(true);
    onResetView?.();
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-stone-950">
      {/* 3D WebGL Canvas Host with 0.32x Nearest-Neighbor Upscaling */}
      {textures && (
        <Canvas
          dpr={0.32}
          gl={{
            antialias: false,
            powerPreference: 'high-performance',
            precision: 'mediump',
            alpha: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.18,
            outputColorSpace: THREE.SRGBColorSpace
          }}
          camera={{
            position: [DEFAULT_CAM_X, DEFAULT_CAM_Y, DEFAULT_CAM_Z],
            fov: 44,
            near: 0.1,
            far: 50
          }}
          className="absolute inset-0 w-full h-full pixel-canvas"
          style={{ touchAction: 'none', imageRendering: 'pixelated' }}
        >
          <CameraControls
            ref={cameraControlsRef}
            makeDefault
            dampingFactor={0.05}
            draggingDampingFactor={0.05}
            minDistance={2.6}
            maxDistance={11.0}
            maxPolarAngle={Math.PI / 2 - 0.04}
            minPolarAngle={0.08}
            onStart={() => {
              setIsDefaultView(false);
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('animas:cursor-state', { detail: { mode: 'dragging_orbit' } })
                );
              }
            }}
            onEnd={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('animas:cursor-state', { detail: { mode: 'default' } })
                );
              }
            }}
          />

          <SanctuaryScene
            textures={textures}
            visualState={visualState}
            selectedOfferingId={selectedOfferingId}
            cameraControlsRef={cameraControlsRef}
            onItemClick={onItemClick}
            onHoverItemChange={onHoverItemChange}
            setIsDefaultView={setIsDefaultView}
          />

          {/* WebGL-Native 4x4 Bayer Dither Cursor & FBO Trail Post-Processing Pass */}
          <DitherCursorPostProcess />
        </Canvas>
      )}

      {/* Retro 16-Bit Ceremonial Loading Indicator */}
      {preloadProgress !== null && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#07080d]/95 p-6">
          <div className="pixel-box-amber p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-10 h-10 mx-auto flex items-center justify-center border-2 border-amber-500 bg-amber-950/40">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            </div>
            <div className="space-y-2">
              <h4 className="font-pixel-display text-[11px] text-amber-300 leading-relaxed uppercase">
                Awakening Altar
              </h4>
              <p className="font-pixel-body text-[10px] text-stone-300 leading-normal">
                Quantizing 16-bit dithered textures ({preloadProgress}%)
              </p>
            </div>
            {/* Stepped Pixel Progress Bar */}
            <div className="w-full h-3 border-2 border-[#353f63] bg-[#07080d] p-0.5">
              <div
                className="h-full bg-amber-500 transition-all duration-100"
                style={{ width: `${preloadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Stepped Pixel "Reset View" Button */}
      <button
        onClick={handleZoomOut}
        data-cursor="interactive"
        disabled={isDefaultView && !selectedOfferingId}
        className={`pixel-btn pixel-btn-amber absolute bottom-6 right-6 px-3.5 py-2 font-pixel-display text-[9px] uppercase tracking-wider select-none z-20 cursor-pointer flex items-center gap-2 ${
          isDefaultView && !selectedOfferingId
            ? 'opacity-0 pointer-events-none translate-y-2'
            : 'opacity-100 translate-y-0'
        }`}
        aria-label="Reset View to Sanctuary Overview"
        title="Reset camera to default monumental overview"
      >
        <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
        <span>Overview</span>
      </button>
    </div>
  );
};
