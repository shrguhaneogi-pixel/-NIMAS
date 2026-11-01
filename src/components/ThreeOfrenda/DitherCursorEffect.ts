/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - WebGL-Native Dither Cursor Effect
 * 
 * Implements:
 * 1. ReactBits "Dither Cursor" post-processing effect inside Three.js pipeline.
 * 2. Ping-pong Framebuffer Object (FBO) trailing effect with 0.92 decaying alpha multiplier.
 * 3. Localized 4x4 Bayer matrix ordered dithering inside UV radius 0.08.
 * 4. Strictly WebGL-native (zero DOM canvas overlays, zero raycasting interference).
 * 5. Runs at 0.32 pixel ratio for lightning-fast performance and authentic retro aesthetic.
 * 6. Delta-time scaled decay guaranteeing consistent trail duration across any display refresh rate (60Hz, 120Hz, 144Hz).
 * 7. Aspect-ratio invariant Euclidean distance calculation preventing distortion on ultrawide and portrait screens.
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';

/**
 * Shared Fullscreen Quad Vertex Shader
 */
export const DitherVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Ping-Pong FBO Trail Shader:
 * Decays previous trail by color.a *= 0.92 and imprints current mouse cursor within radius.
 */
export const DitherTrailShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uMouse: { value: new THREE.Vector2(-10.0, -10.0) },
    uResolution: { value: new THREE.Vector2(1.0, 1.0) },
    uCoreRadius: { value: 0.022 },
    uRing1Radius: { value: 0.045 },
    uRing1Width: { value: 0.012 },
    uRing2Radius: { value: 0.080 },
    uRing2Width: { value: 0.018 },
    uDecay: { value: 0.92 }
  },
  vertexShader: DitherVertexShader,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uCoreRadius;
    uniform float uRing1Radius;
    uniform float uRing1Width;
    uniform float uRing2Radius;
    uniform float uRing2Width;
    uniform float uDecay;
    varying vec2 vUv;

    void main() {
      // Sample previous frame trail from read FBO
      vec4 prev = texture2D(tDiffuse, vUv);
      float decayed = prev.a * uDecay;

      // Aspect-ratio invariant distance to mouse
      vec2 aspect = uResolution / min(uResolution.x, uResolution.y);
      float dist = length((vUv - uMouse) * aspect);

      // Concentric Rings calculation with Uncolored Core (Zero intensity inside uCoreRadius)
      float ringIntensity = 0.0;
      if (dist >= uCoreRadius) {
        // Ring 1 (Inner golden glow halo)
        float d1 = (dist - uRing1Radius) / max(uRing1Width, 0.001);
        float r1 = exp(-d1 * d1) * 0.95;

        // Ring 2 (Outer marigold corona)
        float d2 = (dist - uRing2Radius) / max(uRing2Width, 0.001);
        float r2 = exp(-d2 * d2) * 0.70;

        ringIntensity = max(r1, r2);
      }

      // Persist trailing intensity
      float trail = clamp(max(decayed, ringIntensity), 0.0, 1.0);
      gl_FragColor = vec4(vec3(trail), trail);
    }
  `
};

/**
 * Dither Composite Shader:
 * Applies localized 4x4 Bayer matrix ordered dither to scene pixels within the cursor trail.
 */
export const DitherCursorShader = {
  uniforms: {
    tScene: { value: null as THREE.Texture | null },
    tTrail: { value: null as THREE.Texture | null },
    uMouse: { value: new THREE.Vector2(-10.0, -10.0) },
    uResolution: { value: new THREE.Vector2(1.0, 1.0) },
    uCoreRadius: { value: 0.022 },
    uRing1Radius: { value: 0.045 },
    uRing2Radius: { value: 0.080 }
  },
  vertexShader: DitherVertexShader,
  fragmentShader: /* glsl */ `
    uniform sampler2D tScene;
    uniform sampler2D tTrail;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uCoreRadius;
    uniform float uRing1Radius;
    uniform float uRing2Radius;
    varying vec2 vUv;

    // 4x4 Bayer Matrix
    //  0  8  2 10
    // 12  4 14  6
    //  3 11  1  9
    // 15  7 13  5
    float getBayerValue(vec2 coord) {
      int x = int(mod(coord.x, 4.0));
      int y = int(mod(coord.y, 4.0));

      if (x == 0) {
        if (y == 0) return 0.0 / 16.0;
        if (y == 1) return 12.0 / 16.0;
        if (y == 2) return 3.0 / 16.0;
        return 15.0 / 16.0;
      } else if (x == 1) {
        if (y == 0) return 8.0 / 16.0;
        if (y == 1) return 4.0 / 16.0;
        if (y == 2) return 11.0 / 16.0;
        return 7.0 / 16.0;
      } else if (x == 2) {
        if (y == 0) return 2.0 / 16.0;
        if (y == 1) return 14.0 / 16.0;
        if (y == 2) return 1.0 / 16.0;
        return 13.0 / 16.0;
      } else {
        if (y == 0) return 10.0 / 16.0;
        if (y == 1) return 6.0 / 16.0;
        if (y == 2) return 9.0 / 16.0;
        return 5.0 / 16.0;
      }
    }

    void main() {
      vec4 sceneColor = texture2D(tScene, vUv);
      vec4 trailSample = texture2D(tTrail, vUv);

      // Aspect-ratio invariant distance to mouse
      vec2 aspect = uResolution / min(uResolution.x, uResolution.y);
      float dist = length((vUv - uMouse) * aspect);

      // Core Exclusion Zone: pixels closest to the cursor do not have colour
      if (dist < uCoreRadius && trailSample.a < 0.01) {
        gl_FragColor = sceneColor;
        return;
      }

      // Calculate instantaneous concentric rings
      float instantRing = 0.0;
      float ringMix = 0.0;
      if (dist >= uCoreRadius) {
        float d1 = (dist - uRing1Radius) / 0.012;
        float r1 = exp(-d1 * d1) * 0.95;

        float d2 = (dist - uRing2Radius) / 0.018;
        float r2 = exp(-d2 * d2) * 0.70;

        instantRing = max(r1, r2);
        // ringMix: 1.0 for inner golden ring, 0.0 for outer marigold ring
        ringMix = clamp((uRing2Radius - dist) / max(uRing2Radius - uRing1Radius, 0.001), 0.0, 1.0);
      }

      float ditherStrength = clamp(max(instantRing, trailSample.a), 0.0, 1.0);

      // If inside core exclusion zone, mask off color dither
      if (dist < uCoreRadius) {
        ditherStrength *= smoothstep(uCoreRadius * 0.5, uCoreRadius, dist);
      }

      if (ditherStrength > 0.005) {
        // Standard ordered dithering via 4x4 Bayer matrix
        float bayer = getBayerValue(gl_FragCoord.xy);

        // 6-step color quantization
        float levels = 6.0;
        vec3 dithered = floor(sceneColor.rgb * (levels - 1.0) + bayer) / (levels - 1.0);
        dithered = clamp(dithered, 0.0, 1.0);

        // Two distinct candle glow ring temperatures:
        // Ring 1 (Inner): Luminous warm white-gold flame halo (vec3(1.25, 1.10, 0.75))
        // Ring 2 (Outer): Sacred marigold/cempasúchil amber radiance (vec3(1.15, 0.75, 0.25))
        vec3 innerGlow = dithered * vec3(1.25, 1.10, 0.75) + vec3(0.08, 0.05, 0.01);
        vec3 outerGlow = dithered * vec3(1.15, 0.75, 0.25) + vec3(0.04, 0.01, 0.0);
        vec3 candleGlow = mix(outerGlow, innerGlow, ringMix);

        // Blend between pristine scene and glowing candle dither
        vec3 finalColor = mix(sceneColor.rgb, candleGlow, ditherStrength);
        gl_FragColor = vec4(finalColor, sceneColor.a);
      } else {
        gl_FragColor = sceneColor;
      }
    }
  `
};

/**
 * High-Performance Ping-Pong FBO Post-Processing Pipeline
 */
export class DitherCursorPipeline {
  private gl: THREE.WebGLRenderer;
  private sceneTarget: THREE.WebGLRenderTarget;
  private trailTargetA: THREE.WebGLRenderTarget;
  private trailTargetB: THREE.WebGLRenderTarget;
  private currentReadTarget: THREE.WebGLRenderTarget;
  private currentWriteTarget: THREE.WebGLRenderTarget;

  private quadCamera: THREE.OrthographicCamera;
  private quadScene: THREE.Scene;
  private quadMesh: THREE.Mesh;

  private trailMaterial: THREE.ShaderMaterial;
  private ditherMaterial: THREE.ShaderMaterial;

  public mouseUv: THREE.Vector2 = new THREE.Vector2(-10.0, -10.0);
  public coreRadius: number = 0.022;
  public ring1Radius: number = 0.045;
  public ring1Width: number = 0.012;
  public ring2Radius: number = 0.080;
  public ring2Width: number = 0.018;
  public decay: number = 0.92;

  constructor(gl: THREE.WebGLRenderer, width: number, height: number) {
    this.gl = gl;

    // Universal UnsignedByteType for 100% hardware compatibility without float-texture extensions
    const targetOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      stencilBuffer: false,
      depthBuffer: true
    };

    const trailOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      stencilBuffer: false,
      depthBuffer: false
    };

    this.sceneTarget = new THREE.WebGLRenderTarget(width, height, targetOptions);
    this.trailTargetA = new THREE.WebGLRenderTarget(width, height, trailOptions);
    this.trailTargetB = new THREE.WebGLRenderTarget(width, height, trailOptions);

    this.currentReadTarget = this.trailTargetA;
    this.currentWriteTarget = this.trailTargetB;

    // Orthographic Full-screen Quad Setup
    this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quadScene = new THREE.Scene();
    const quadGeometry = new THREE.PlaneGeometry(2, 2);

    this.trailMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(DitherTrailShader.uniforms),
      vertexShader: DitherTrailShader.vertexShader,
      fragmentShader: DitherTrailShader.fragmentShader,
      depthTest: false,
      depthWrite: false
    });

    this.ditherMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(DitherCursorShader.uniforms),
      vertexShader: DitherCursorShader.vertexShader,
      fragmentShader: DitherCursorShader.fragmentShader,
      depthTest: false,
      depthWrite: false
    });

    this.quadMesh = new THREE.Mesh(quadGeometry, this.trailMaterial);
    this.quadScene.add(this.quadMesh);
  }

  public setSize(width: number, height: number): void {
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));

    this.sceneTarget.setSize(w, h);
    this.trailTargetA.setSize(w, h);
    this.trailTargetB.setSize(w, h);

    this.trailMaterial.uniforms.uResolution.value.set(w, h);
    this.ditherMaterial.uniforms.uResolution.value.set(w, h);
  }

  public render(scene: THREE.Scene, camera: THREE.Camera, delta: number = 1 / 60): void {
    const gl = this.gl;

    // 1. Render main 3D scene to offscreen scene target
    gl.setRenderTarget(this.sceneTarget);
    gl.clear();
    gl.render(scene, camera);

    // Delta-time scaled decay: pow(0.92, delta * 60.0) guarantees consistent dissipation duration across 60Hz, 120Hz, 144Hz
    const effectiveDecay = Math.pow(this.decay, Math.min(delta, 0.1) * 60.0);

    // 2. Ping-Pong Trail Pass
    this.trailMaterial.uniforms.tDiffuse.value = this.currentReadTarget.texture;
    this.trailMaterial.uniforms.uMouse.value.copy(this.mouseUv);
    this.trailMaterial.uniforms.uCoreRadius.value = this.coreRadius;
    this.trailMaterial.uniforms.uRing1Radius.value = this.ring1Radius;
    this.trailMaterial.uniforms.uRing1Width.value = this.ring1Width;
    this.trailMaterial.uniforms.uRing2Radius.value = this.ring2Radius;
    this.trailMaterial.uniforms.uRing2Width.value = this.ring2Width;
    this.trailMaterial.uniforms.uDecay.value = effectiveDecay;

    this.quadMesh.material = this.trailMaterial;
    gl.setRenderTarget(this.currentWriteTarget);
    gl.render(this.quadScene, this.quadCamera);

    // Swap read & write trail targets
    const prevRead = this.currentReadTarget;
    this.currentReadTarget = this.currentWriteTarget;
    this.currentWriteTarget = prevRead;

    // 3. Final Dither Composite Pass directly to screen
    this.ditherMaterial.uniforms.tScene.value = this.sceneTarget.texture;
    this.ditherMaterial.uniforms.tTrail.value = this.currentReadTarget.texture;
    this.ditherMaterial.uniforms.uMouse.value.copy(this.mouseUv);
    this.ditherMaterial.uniforms.uCoreRadius.value = this.coreRadius;
    this.ditherMaterial.uniforms.uRing1Radius.value = this.ring1Radius;
    this.ditherMaterial.uniforms.uRing2Radius.value = this.ring2Radius;

    this.quadMesh.material = this.ditherMaterial;
    gl.setRenderTarget(null);
    gl.render(this.quadScene, this.quadCamera);
  }

  public dispose(): void {
    this.sceneTarget.dispose();
    this.trailTargetA.dispose();
    this.trailTargetB.dispose();
    this.trailMaterial.dispose();
    this.ditherMaterial.dispose();
    this.quadMesh.geometry.dispose();
  }
}

/**
 * React Three Fiber Post-Processing Component
 * Placed inside <Canvas> to automatically manage the WebGL Dither Cursor pipeline.
 */
export const DitherCursorPostProcess: React.FC = () => {
  const { gl, scene, camera, size } = useThree();
  const pipelineRef = useRef<DitherCursorPipeline | null>(null);
  const pointerActiveRef = useRef(false);

  // Initialize pipeline
  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const width = Math.floor(size.width * dpr);
    const height = Math.floor(size.height * dpr);

    const pipeline = new DitherCursorPipeline(gl, width, height);
    pipelineRef.current = pipeline;

    const onPointerMove = () => {
      pointerActiveRef.current = true;
    };
    const onPointerLeave = () => {
      pointerActiveRef.current = false;
      if (pipelineRef.current) {
        pipelineRef.current.mouseUv.set(-10.0, -10.0);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      pipeline.dispose();
      pipelineRef.current = null;
    };
  }, [gl]);

  // Handle resizing at 0.32 DPR
  useEffect(() => {
    if (pipelineRef.current) {
      const dpr = gl.getPixelRatio();
      pipelineRef.current.setSize(size.width * dpr, size.height * dpr);
    }
  }, [size, gl]);

  // Render loop with priority 1 (bypasses R3F's default gl.render)
  useFrame((state, delta) => {
    if (!pipelineRef.current) return;

    if (pointerActiveRef.current) {
      // Map pointer [-1, 1] to UV [0, 1]
      const uX = (state.pointer.x + 1.0) * 0.5;
      const uY = (state.pointer.y + 1.0) * 0.5;
      pipelineRef.current.mouseUv.set(uX, uY);
    } else {
      pipelineRef.current.mouseUv.set(-10.0, -10.0);
    }

    pipelineRef.current.render(scene, camera, delta);
  }, 1);

  return null;
};
