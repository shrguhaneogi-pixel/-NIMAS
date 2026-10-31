/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Three.js WebGL Canvas Host
 * Implements CameraControls with smooth setLookAt tweening, Cyber-Mystic Reset View button,
 * r160+ PBR rendering, PMREM RoomEnvironment, software-GL guard, and strict disposal.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildOfrendaScene, OfrendaSceneGraph } from './sceneBuilder';
import { buildOfrendaTexturesAsync } from './proceduralTextures';
import { VisualDirectionState, OfrendaItemClickData } from '../../types';
import { Sparkles, Loader2, Minimize2 } from 'lucide-react';

// Install CameraControls with Three.js namespace
CameraControls.install({ THREE });

// Pre-allocated reusable module-scope math helpers (Zero GC in render loop)
const _pointer = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();

const DEFAULT_CAM_X = 0;
const DEFAULT_CAM_Y = 2.4;
const DEFAULT_CAM_Z = 5.8;
const DEFAULT_TARGET_X = 0;
const DEFAULT_TARGET_Y = 1.45;
const DEFAULT_TARGET_Z = 0;

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
  const mountRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<OfrendaSceneGraph | null>(null);
  const cameraControlsRef = useRef<CameraControls | null>(null);
  const [preloadProgress, setPreloadProgress] = useState<number | null>(0);
  const [isDefaultView, setIsDefaultView] = useState<boolean>(true);

  const visualStateRef = useRef<VisualDirectionState>(visualState);
  visualStateRef.current = visualState;

  const onItemClickRef = useRef(onItemClick);
  onItemClickRef.current = onItemClick;

  const onHoverRef = useRef(onHoverItemChange);
  onHoverRef.current = onHoverItemChange;

  const onResetViewRef = useRef(onResetView);
  onResetViewRef.current = onResetView;

  // Camera Zoom Out / Reset View handler
  const handleZoomOut = () => {
    if (cameraControlsRef.current) {
      // Smoothly tween back to default wide coordinates capturing monumental crypt and altar
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
    // Clear selected memory offering and close inspector
    onResetViewRef.current?.();
  };

  // Sync camera controls when visual state camera_profile changes externally
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
  }, [visualState.camera_profile]);

  useEffect(() => {
    if (selectedOfferingId) {
      setIsDefaultView(false);
    }
  }, [selectedOfferingId]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;
    let frameId = 0;
    let cleanupScene: (() => void) | null = null;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    async function initAsync() {
      if (!container) return;

      // 1. Asynchronously build procedural textures with main-thread yielding
      const textures = await buildOfrendaTexturesAsync(pct => {
        if (!isDisposed) setPreloadProgress(pct);
      });

      if (isDisposed || !container) {
        textures.allTextures.forEach(t => t.dispose());
        return;
      }
      setPreloadProgress(null); // Textures ready!

      // 2. Initialize Scene, Camera, Renderer
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0c0c16);

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 50);
      camera.position.set(DEFAULT_CAM_X, DEFAULT_CAM_Y, DEFAULT_CAM_Z);

      const renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);

      // 3. CameraControls setup
      const controls = new CameraControls(camera, renderer.domElement);
      controls.dampingFactor = 0.05;
      controls.draggingDampingFactor = 0.05;
      controls.minDistance = 2.6;
      controls.maxDistance = 11.0;
      controls.maxPolarAngle = Math.PI / 2 - 0.04;
      controls.minPolarAngle = 0.08;
      controls.setLookAt(
        DEFAULT_CAM_X,
        DEFAULT_CAM_Y,
        DEFAULT_CAM_Z,
        DEFAULT_TARGET_X,
        DEFAULT_TARGET_Y,
        DEFAULT_TARGET_Z,
        false
      );
      cameraControlsRef.current = controls;

      // When user starts dragging or zooming, mark view as non-default
      controls.addEventListener('controlstart', () => {
        setIsDefaultView(false);
      });

      // 4. Studio Reflections
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTexture;
      pmremGenerator.dispose();

      // 5. Build Sanctuary Scene Graph
      const graph = buildOfrendaScene(scene, textures);
      graphRef.current = graph;

      const handlePointerMove = (e: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        // Raycast strictly against isolated interactive offerings
        _raycaster.setFromCamera(_pointer, camera);
        const intersects = _raycaster.intersectObjects(graph.interactiveObjects, true);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const id = hit.userData?.id;
          const data = id ? graph.clickableMap.get(id) : null;
          if (data) {
            renderer.domElement.style.cursor = 'pointer';
            onHoverRef.current?.(data.title);
            return;
          }
        }
        renderer.domElement.style.cursor = 'default';
        onHoverRef.current?.(null);
      };

      const handleClick = (e: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        _pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        _raycaster.setFromCamera(_pointer, camera);
        const intersects = _raycaster.intersectObjects(graph.interactiveObjects, true);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const id = hit.userData?.id;
          const data = id ? graph.clickableMap.get(id) : null;
          if (data) {
            setIsDefaultView(false);
            onItemClickRef.current(data);
          }
        }
      };

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      const dom = renderer.domElement;
      dom.addEventListener('pointermove', handlePointerMove);
      dom.addEventListener('click', handleClick);
      window.addEventListener('resize', handleResize);

      // Software WebGL pacing helper
      const afterDraw = (cb: () => void) => {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      };

      // Animation Render Loop
      const clock = new THREE.Clock();
      const tick = () => {
        if (isDisposed) return;
        const delta = Math.min(clock.getDelta(), 0.1);
        const elapsed = clock.getElapsedTime();
        const vState = visualStateRef.current;

        // Update camera-controls smooth transitions
        controls.update(delta);

        // Candle Flame Flickering & Halo Pulse
        const flameWarmthMult = vState.lighting_profile === 'warm_candle' ? 1.35 :
                                vState.lighting_profile === 'soft_candle' ? 1.0 :
                                vState.lighting_profile === 'subdued_amber' ? 0.75 :
                                vState.lighting_profile === 'balanced_warm' ? 1.2 : 0.85;

        for (let i = 0; i < graph.candles.length; i++) {
          const c = graph.candles[i];
          const flicker = Math.sin(elapsed * c.flickerSpeed + c.flickerOffset) * 0.15 +
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

        // Copal Smoke Rise
        const smoke = graph.copalSmoke;
        const sPositions = smoke.points.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < smoke.count; i++) {
          sPositions[i * 3 + 1] += smoke.velocities[i * 3 + 1] * delta;
          sPositions[i * 3 + 0] += Math.sin(elapsed * 2.0 + i) * 0.003;

          smoke.lifetimes[i] += delta * 0.35;
          if (smoke.lifetimes[i] > 1.0 || sPositions[i * 3 + 1] > 2.8) {
            sPositions[i * 3 + 0] = 0.75 + (Math.random() - 0.5) * 0.05;
            sPositions[i * 3 + 1] = 0.86;
            sPositions[i * 3 + 2] = 1.05 + (Math.random() - 0.5) * 0.05;
            smoke.lifetimes[i] = 0;
          }
        }
        smoke.points.geometry.attributes.position.needsUpdate = true;

        // Ambient Swirling Marigold Petals
        const petals = graph.petals;
        const pSpeedMult = vState.particle_profile === 'petal_drift' ? 1.3 :
                           vState.particle_profile === 'gentle_drift' ? 0.8 :
                           vState.particle_profile === 'none' ? 0.0 : 0.5;

        for (let i = 0; i < petals.count; i++) {
          petals.positions[i * 3 + 0] += petals.velocities[i * 3 + 0] * delta * pSpeedMult;
          petals.positions[i * 3 + 1] += petals.velocities[i * 3 + 1] * delta * pSpeedMult;
          petals.positions[i * 3 + 2] += petals.velocities[i * 3 + 2] * delta * pSpeedMult;

          petals.rotations[i * 3 + 0] += delta * 1.5;
          petals.rotations[i * 3 + 1] += delta * 1.2;

          // Recycle petals when they touch the floor or drift out of bounds
          if (petals.positions[i * 3 + 1] < 0.02 || petals.positions[i * 3 + 0] > 4.5) {
            petals.positions[i * 3 + 0] = -4.5 + (Math.random() - 0.5) * 1.5;
            petals.positions[i * 3 + 1] = 4.2 + Math.random() * 1.5;
            petals.positions[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
          }

          const dummy = new THREE.Object3D();
          dummy.position.set(petals.positions[i * 3], petals.positions[i * 3 + 1], petals.positions[i * 3 + 2]);
          dummy.rotation.set(petals.rotations[i * 3], petals.rotations[i * 3 + 1], petals.rotations[i * 3 + 2]);
          dummy.scale.setScalar(petals.scales[i]);
          dummy.updateMatrix();
          petals.mesh.setMatrixAt(i, dummy.matrix);
        }
        petals.mesh.instanceMatrix.needsUpdate = true;

        renderer.render(scene, camera);

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      };

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
        frameId = requestAnimationFrame(tick);
      } else {
        tick();
      }

      cleanupScene = () => {
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        window.removeEventListener('resize', handleResize);
        dom.removeEventListener('pointermove', handlePointerMove);
        dom.removeEventListener('click', handleClick);

        controls.dispose();
        cameraControlsRef.current = null;

        // Exhaustive WebGL Resource Disposal Protocol
        graph.disposables.geometries.forEach(geo => geo.dispose());
        graph.disposables.materials.forEach(mat => {
          if (Array.isArray(mat)) mat.forEach(m => m.dispose());
          else mat.dispose();
        });
        graph.disposables.textures.forEach(tex => tex.dispose());

        if (scene.environment) {
          scene.environment.dispose();
        }

        renderer.dispose();
        if (container.contains(dom)) {
          container.removeChild(dom);
        }
      };
    }

    initAsync();

    return () => {
      isDisposed = true;
      if (cleanupScene) cleanupScene();
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-stone-950">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: 'none' }}
      />

      {/* Ceremonial Loading Indicator during Asynchronous Texture Preloading */}
      {preloadProgress !== null && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-stone-950/90 backdrop-blur-sm space-y-4">
          <div className="w-12 h-12 rounded-full border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          </div>
          <div className="text-center space-y-1">
            <h4 className="font-serif text-sm font-bold text-amber-200">
              Awakening The Sovereign Sanctuary
            </h4>
            <p className="text-[11px] font-mono text-stone-400">
              Generating procedural stone vaults, cempasúchil blooms & papel picado ({preloadProgress}%)
            </p>
          </div>
        </div>
      )}

      {/* Forgiving 2D Offering Quick-Access Strip (Mobile Touch Forgiveness) */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-center gap-2">
        <div className="pointer-events-auto bg-stone-950/80 border border-stone-800/80 px-3 py-1.5 rounded-full flex items-center gap-2.5 text-[11px] font-mono shadow-lg text-stone-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline text-stone-400">Offerings on Altar:</span>
          <button
            onClick={() => {
              const item = graphRef.current?.clickableMap.get('nicho_elena');
              if (item) {
                setIsDefaultView(false);
                onItemClickRef.current(item);
              }
            }}
            className="hover:text-amber-300 transition underline underline-offset-2"
          >
            Elena
          </button>
          <span className="text-stone-600">·</span>
          <button
            onClick={() => {
              const item = graphRef.current?.clickableMap.get('nicho_mateo');
              if (item) {
                setIsDefaultView(false);
                onItemClickRef.current(item);
              }
            }}
            className="hover:text-amber-300 transition underline underline-offset-2"
          >
            Mateo
          </button>
          <span className="text-stone-600">·</span>
          <button
            onClick={() => {
              const item = graphRef.current?.clickableMap.get('nicho_hector');
              if (item) {
                setIsDefaultView(false);
                onItemClickRef.current(item);
              }
            }}
            className="hover:text-amber-300 transition underline underline-offset-2"
          >
            Héctor
          </button>
          <span className="text-stone-600">·</span>
          <button
            onClick={() => {
              const item = graphRef.current?.clickableMap.get('offering_calavera');
              if (item) {
                setIsDefaultView(false);
                onItemClickRef.current(item);
              }
            }}
            className="hover:text-amber-300 transition underline underline-offset-2"
          >
            Sugar Skull
          </button>
          <span className="text-stone-600">·</span>
          <button
            onClick={() => {
              const item = graphRef.current?.clickableMap.get('offering_pan');
              if (item) {
                setIsDefaultView(false);
                onItemClickRef.current(item);
              }
            }}
            className="hover:text-amber-300 transition underline underline-offset-2"
          >
            Pan de Muerto
          </button>
        </div>
      </div>

      {/* Cyber-Mystic "Reset View" / "Zoom Out" Button Overlay */}
      <button
        onClick={handleZoomOut}
        disabled={isDefaultView && !selectedOfferingId}
        className={`absolute bottom-6 right-6 px-4 py-2 bg-stone-950/90 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-amber-500 hover:border-amber-500 rounded-md transition-all flex items-center gap-2 text-xs font-mono select-none z-20 ${
          isDefaultView && !selectedOfferingId
            ? 'opacity-0 pointer-events-none translate-y-2'
            : 'opacity-100 shadow-2xl translate-y-0'
        }`}
        aria-label="Reset View to Sanctuary Overview"
        title="Reset camera to default monumental overview"
      >
        <Minimize2 className="w-3.5 h-3.5" />
        <span>Reset View</span>
      </button>
    </div>
  );
};
