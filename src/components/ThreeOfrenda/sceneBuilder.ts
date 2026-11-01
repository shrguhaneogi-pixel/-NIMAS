/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Three.js Procedural Scene Builder
 * Optimized Low-Poly Retro-Geometry (6-8 segments) & Lightweight 16-Bit Lighting Rig.
 * Locks 60 FPS on integrated GPUs and mobile chipsets.
 */

import * as THREE from 'three';
import { ProceduralTextureSet } from './proceduralTextures';
import { OfrendaItemClickData } from '../../types';

export interface CandleRef {
  light?: THREE.PointLight;
  flameMesh: THREE.Mesh;
  flameInner: THREE.Mesh;
  haloSprite?: THREE.Sprite;
  baseIntensity: number;
  flickerSpeed: number;
  flickerOffset: number;
  id: string;
}

export interface PetalSystem {
  mesh: THREE.InstancedMesh;
  count: number;
  positions: Float32Array;
  rotations: Float32Array;
  velocities: Float32Array;
  scales: Float32Array;
}

export interface CopalSmokeSystem {
  points: THREE.Points;
  count: number;
  positions: Float32Array;
  velocities: Float32Array;
  lifetimes: Float32Array;
}

export interface OfrendaSceneGraph {
  scene: THREE.Scene;
  interactiveObjects: THREE.Object3D[];
  interactiveGroup: THREE.Group;
  candles: CandleRef[];
  petals: PetalSystem;
  copalSmoke: CopalSmokeSystem;
  clickableMap: Map<string, OfrendaItemClickData>;
  relicGroups: Map<string, THREE.Group>;
  keyLight: THREE.DirectionalLight;
  fillLight: THREE.HemisphereLight;
  altarGroup: THREE.Group;
  disposables: {
    geometries: THREE.BufferGeometry[];
    materials: THREE.Material[];
    textures: THREE.Texture[];
  };
}

export function buildOfrendaScene(
  scene: THREE.Scene,
  textures: ProceduralTextureSet
): OfrendaSceneGraph {
  const interactiveObjects: THREE.Object3D[] = [];
  const interactiveGroup = new THREE.Group();
  interactiveGroup.name = 'interactive_offerings_group';
  scene.add(interactiveGroup);

  const candles: CandleRef[] = [];
  const clickableMap = new Map<string, OfrendaItemClickData>();
  const relicGroups = new Map<string, THREE.Group>();

  // Disposal tracking registry
  const disposables = {
    geometries: [] as THREE.BufferGeometry[],
    materials: [] as THREE.Material[],
    textures: [...textures.allTextures] as THREE.Texture[]
  };

  const regGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposables.geometries.push(geo);
    return geo;
  };
  const regMat = <T extends THREE.Material>(mat: T): T => {
    disposables.materials.push(mat);
    return mat;
  };

  // ----------------------------------------------------
  // 1. LIGHTWEIGHT RETRO LIGHTING RIG (No GPU Shadow Passes)
  // ----------------------------------------------------
  const keyLight = new THREE.DirectionalLight(0xffb066, 1.8);
  keyLight.position.set(4, 9, 6);
  keyLight.castShadow = false;
  scene.add(keyLight);

  const fillLight = new THREE.HemisphereLight(0x232742, 0x140e0a, 0.95);
  scene.add(fillLight);

  // Atmospheric fog
  scene.fog = new THREE.FogExp2(0x0c0c16, 0.045);

  const altarGroup = new THREE.Group();
  scene.add(altarGroup);

  // ----------------------------------------------------
  // 2. RETRO PBR MATERIALS (NearestFilter Textures)
  // ----------------------------------------------------
  const stoneMat = regMat(new THREE.MeshStandardMaterial({
    map: textures.corbelledStone,
    roughness: 0.88,
    metalness: 0.1
  }));

  const chevronFloorMat = regMat(new THREE.MeshStandardMaterial({
    map: textures.chevronFloor,
    roughness: 0.82,
    metalness: 0.08
  }));

  const woodMat = regMat(new THREE.MeshStandardMaterial({
    map: textures.wood,
    roughness: 0.75,
    metalness: 0.1
  }));

  const goldFrameMat = regMat(new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.35,
    metalness: 0.85
  }));

  const brassTrimMat = regMat(new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.4,
    metalness: 0.7
  }));

  const waxCandleMat = regMat(new THREE.MeshStandardMaterial({
    color: 0xfde68a,
    roughness: 0.45,
    metalness: 0.04
  }));

  const flameOuterMat = regMat(new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.9
  }));

  const flameInnerMat = regMat(new THREE.MeshBasicMaterial({
    color: 0xfffbeb
  }));

  const flameSpriteMat = regMat(new THREE.SpriteMaterial({
    map: textures.flameGlowSprite,
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));

  const marigoldOrangeMat = regMat(new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.6,
    metalness: 0.05
  }));

  const shadowPlaneMat = regMat(new THREE.MeshBasicMaterial({
    map: textures.contactShadow,
    transparent: true,
    opacity: 0.75,
    depthWrite: false
  }));

  // ----------------------------------------------------
  // 3. LOW-POLY CORBELLED STONE ARCH VAULT
  // ----------------------------------------------------
  const cryptGroup = new THREE.Group();
  altarGroup.add(cryptGroup);

  const archSteps = 9;
  for (let i = 0; i < archSteps; i++) {
    const y = 2.0 + i * 0.45;
    const inset = i * 0.32;
    const span = 11.0 - inset * 2;
    const thickness = 0.42;
    const depth = 16.0;

    const leftBeamGeo = regGeo(new THREE.BoxGeometry(2.4, thickness, depth));
    const leftBeam = new THREE.Mesh(leftBeamGeo, stoneMat);
    leftBeam.position.set(-span / 2 - 0.9, y, -0.5);
    cryptGroup.add(leftBeam);

    const rightBeamGeo = regGeo(new THREE.BoxGeometry(2.4, thickness, depth));
    const rightBeam = new THREE.Mesh(rightBeamGeo, stoneMat);
    rightBeam.position.set(span / 2 + 0.9, y, -0.5);
    cryptGroup.add(rightBeam);
  }

  const capstoneGeo = regGeo(new THREE.BoxGeometry(2.8, 0.4, 16.0));
  const capstone = new THREE.Mesh(capstoneGeo, stoneMat);
  capstone.position.set(0, 6.0, -0.5);
  cryptGroup.add(capstone);

  const apertureMat = regMat(new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
  const apertureMesh = new THREE.Mesh(regGeo(new THREE.BoxGeometry(1.4, 0.2, 3.2)), apertureMat);
  apertureMesh.position.set(0, 5.85, -2.5);
  cryptGroup.add(apertureMesh);

  // Aperture point light
  const apertureLight = new THREE.PointLight(0xf59e0b, 1.2, 10);
  apertureLight.position.set(0, 5.5, -2.5);
  cryptGroup.add(apertureLight);

  // Rear wall
  const backWallGeo = regGeo(new THREE.BoxGeometry(12.0, 7.0, 0.6));
  const backWall = new THREE.Mesh(backWallGeo, stoneMat);
  backWall.position.set(0, 3.5, -6.5);
  cryptGroup.add(backWall);

  // Distant glowing portal
  const portalGlowMat = regMat(new THREE.MeshBasicMaterial({ color: 0xd97706 }));
  const portalMesh = new THREE.Mesh(regGeo(new THREE.PlaneGeometry(1.6, 3.2)), portalGlowMat);
  portalMesh.position.set(0, 1.6, -6.18);
  cryptGroup.add(portalMesh);

  // Side walls
  const sideWallGeo = regGeo(new THREE.BoxGeometry(0.8, 6.0, 16.0));
  const leftWall = new THREE.Mesh(sideWallGeo, stoneMat);
  leftWall.position.set(-6.2, 3.0, -0.5);
  cryptGroup.add(leftWall);

  const rightWall = new THREE.Mesh(sideWallGeo, stoneMat);
  rightWall.position.set(6.2, 3.0, -0.5);
  cryptGroup.add(rightWall);

  // ----------------------------------------------------
  // 4. CHEVRON FLOOR
  // ----------------------------------------------------
  const floorGeo = regGeo(new THREE.PlaneGeometry(14.0, 16.0));
  const floorMesh = new THREE.Mesh(floorGeo, chevronFloorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, -0.01, -0.5);
  altarGroup.add(floorMesh);

  // ----------------------------------------------------
  // 5. 3-TIER ALTAR
  // ----------------------------------------------------
  const shadowMesh = new THREE.Mesh(regGeo(new THREE.PlaneGeometry(7.0, 4.5)), shadowPlaneMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, 0.01, 0.2);
  altarGroup.add(shadowMesh);

  // Tier 1
  const tier1Mesh = new THREE.Mesh(regGeo(new THREE.BoxGeometry(5.0, 0.72, 2.4)), woodMat);
  tier1Mesh.position.set(0, 0.36, 0.2);
  altarGroup.add(tier1Mesh);

  const trim1Mesh = new THREE.Mesh(regGeo(new THREE.BoxGeometry(5.12, 0.08, 2.52)), brassTrimMat);
  trim1Mesh.position.set(0, 0.72, 0.2);
  altarGroup.add(trim1Mesh);

  // Tier 2
  const tier2Mesh = new THREE.Mesh(regGeo(new THREE.BoxGeometry(3.8, 0.72, 1.6)), woodMat);
  tier2Mesh.position.set(0, 1.08, -0.15);
  altarGroup.add(tier2Mesh);

  const trim2Mesh = new THREE.Mesh(regGeo(new THREE.BoxGeometry(3.92, 0.08, 1.72)), brassTrimMat);
  trim2Mesh.position.set(0, 1.44, -0.15);
  altarGroup.add(trim2Mesh);

  // Tier 3
  const tier3Mesh = new THREE.Mesh(regGeo(new THREE.BoxGeometry(2.6, 0.72, 1.0)), woodMat);
  tier3Mesh.position.set(0, 1.8, -0.45);
  altarGroup.add(tier3Mesh);

  const trim3Mesh = new THREE.Mesh(regGeo(new THREE.BoxGeometry(2.7, 0.08, 1.08)), brassTrimMat);
  trim3Mesh.position.set(0, 2.16, -0.45);
  altarGroup.add(trim3Mesh);

  // ----------------------------------------------------
  // 6. PAPEL PICADO OVERHEAD BUNTING
  // ----------------------------------------------------
  const buntingGroup = new THREE.Group();
  altarGroup.add(buntingGroup);

  const createOverheadBunting = (zPos: number, yBase: number, sag: number) => {
    const bannerW = 0.42;
    const bannerH = 0.58;
    const totalSpan = 8.8;
    const bannerCount = 12;
    const startX = -totalSpan / 2;
    const stepX = totalSpan / (bannerCount - 1);

    for (let i = 0; i < bannerCount; i++) {
      const x = startX + i * stepX;
      const norm = x / (totalSpan / 2);
      const y = yBase - Math.cos(norm * (Math.PI / 2.2)) * sag;

      const tex = textures.papelPicado[i % textures.papelPicado.length];
      const bannerMat = regMat(new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
        roughness: 0.85,
        alphaTest: 0.12
      }));

      const bannerMesh = new THREE.Mesh(regGeo(new THREE.PlaneGeometry(bannerW, bannerH)), bannerMat);
      bannerMesh.position.set(x, y - bannerH * 0.48, zPos);
      bannerMesh.rotation.x = 0.15 * Math.sin(i * 1.2 + zPos);
      buntingGroup.add(bannerMesh);
    }
  };

  createOverheadBunting(2.4, 4.8, 0.65);
  createOverheadBunting(0.8, 5.1, 0.55);
  createOverheadBunting(-1.2, 5.3, 0.45);

  // ----------------------------------------------------
  // 7. LOW-POLY CANDLE COLONNADE (6 Radial Segments)
  // ----------------------------------------------------
  const createCandle = (
    x: number,
    y: number,
    z: number,
    height: number,
    id: string
  ): THREE.Group => {
    const candleGroup = new THREE.Group();
    candleGroup.position.set(x, y, z);
    candleGroup.name = id;

    // Sconce base: 6 segments
    const sconceMat = regMat(new THREE.MeshStandardMaterial({
      color: 0x12141f,
      roughness: 0.9,
      metalness: 0.2
    }));
    const sconceMesh = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.09, 0.11, 0.04, 6)), sconceMat);
    sconceMesh.position.y = 0.02;
    candleGroup.add(sconceMesh);

    // Wax body: 6 segments
    const bodyMesh = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.06, 0.065, height, 6)), waxCandleMat);
    bodyMesh.position.y = height / 2 + 0.04;
    candleGroup.add(bodyMesh);

    // Wax drips: 4 segments
    for (let d = 0; d < 2; d++) {
      const drip = new THREE.Mesh(regGeo(new THREE.SphereGeometry(0.022, 4, 4)), waxCandleMat);
      const angle = (d * Math.PI * 2) / 2;
      drip.position.set(
        Math.cos(angle) * 0.055,
        height * 0.7 - d * 0.1,
        Math.sin(angle) * 0.055
      );
      candleGroup.add(drip);
    }

    // Flame Cone: 6 segments
    const flameMesh = new THREE.Mesh(regGeo(new THREE.ConeGeometry(0.028, 0.09, 6)), flameOuterMat);
    flameMesh.position.y = height + 0.08;
    candleGroup.add(flameMesh);

    const flameInner = new THREE.Mesh(regGeo(new THREE.ConeGeometry(0.016, 0.05, 5)), flameInnerMat);
    flameInner.position.y = height + 0.065;
    candleGroup.add(flameInner);

    // Additive pixel halo sprite
    const haloSprite = new THREE.Sprite(flameSpriteMat);
    haloSprite.position.y = height + 0.08;
    haloSprite.scale.set(0.65, 0.65, 1.0);
    candleGroup.add(haloSprite);

    candles.push({
      flameMesh,
      flameInner,
      haloSprite,
      baseIntensity: 0.85,
      flickerSpeed: 3.0 + Math.random() * 4.0,
      flickerOffset: Math.random() * Math.PI * 2,
      id
    });

    altarGroup.add(candleGroup);
    return candleGroup;
  };

  // Colonnade rows flanking pathway
  const pathZ = [4.2, 3.4, 2.6, 1.8, 1.0, 0.2];
  for (let idx = 0; idx < pathZ.length; idx++) {
    const z = pathZ[idx];
    const hLeft = 0.35 + (idx % 3) * 0.12;
    const hRight = 0.32 + ((idx + 1) % 3) * 0.14;
    createCandle(-2.1, 0, z, hLeft, `colonnade_left_${idx}`);
    createCandle(2.1, 0, z, hRight, `colonnade_right_${idx}`);
  }

  // Altar step candles
  createCandle(-2.2, 0.72, 1.25, 0.42, 'altar_c_1');
  createCandle(2.2, 0.72, 1.25, 0.42, 'altar_c_2');
  createCandle(-1.6, 1.44, 0.5, 0.38, 'altar_c_3');
  createCandle(1.6, 1.44, 0.5, 0.38, 'altar_c_4');
  createCandle(-0.9, 2.16, -0.15, 0.32, 'altar_c_5');
  createCandle(0.9, 2.16, -0.15, 0.32, 'altar_c_6');

  // ----------------------------------------------------
  // 8. CEMPASÚCHIL FLOWER BANKS (Low-Poly 6-Segment Instanced)
  // ----------------------------------------------------
  const flowerGroup = new THREE.Group();
  altarGroup.add(flowerGroup);

  const flowerCount = 60;
  const flowerGeo = regGeo(new THREE.CylinderGeometry(0.11, 0.06, 0.06, 6));
  const flowerInstanced = new THREE.InstancedMesh(flowerGeo, marigoldOrangeMat, flowerCount);

  const dummy = new THREE.Object3D();
  let flowerIdx = 0;

  for (let z = 4.4; z >= 0.2; z -= 0.42) {
    if (flowerIdx >= flowerCount - 2) break;

    const lx = -2.5 - Math.random() * 0.3;
    dummy.position.set(lx, 0.08, z);
    dummy.scale.setScalar(0.85 + Math.random() * 0.3);
    dummy.rotation.set(0, Math.random() * Math.PI, 0);
    dummy.updateMatrix();
    flowerInstanced.setMatrixAt(flowerIdx++, dummy.matrix);

    const rx = 2.5 + Math.random() * 0.3;
    dummy.position.set(rx, 0.08, z);
    dummy.scale.setScalar(0.85 + Math.random() * 0.3);
    dummy.rotation.set(0, Math.random() * Math.PI, 0);
    dummy.updateMatrix();
    flowerInstanced.setMatrixAt(flowerIdx++, dummy.matrix);
  }

  for (let x = -2.2; x <= 2.2; x += 0.35) {
    if (flowerIdx >= flowerCount) break;
    dummy.position.set(x, 0.76, 1.35);
    dummy.scale.setScalar(0.8 + Math.random() * 0.3);
    dummy.rotation.set(0.1, Math.random() * Math.PI, 0);
    dummy.updateMatrix();
    flowerInstanced.setMatrixAt(flowerIdx++, dummy.matrix);
  }

  flowerInstanced.instanceMatrix.needsUpdate = true;
  flowerGroup.add(flowerInstanced);

  // ----------------------------------------------------
  // 9. DEDICATED INTERACTIVE MEMORIAL OFFERINGS
  // ----------------------------------------------------
  const createNicho = (
    x: number,
    y: number,
    z: number,
    rotY: number,
    name: string,
    subtitle: string,
    id: string,
    memoryId: string
  ) => {
    const nichoGroup = new THREE.Group();
    nichoGroup.position.set(x, y, z);
    nichoGroup.rotation.y = rotY;
    nichoGroup.name = id;

    const frameW = 0.62;
    const frameH = 0.78;
    const borderThick = 0.05;

    // Portrait canvas
    const portraitTex = textures.portraits.get(id);
    const portraitMat = regMat(new THREE.MeshStandardMaterial({
      map: portraitTex,
      roughness: 0.45,
      metalness: 0.05
    }));
    const portraitMesh = new THREE.Mesh(regGeo(new THREE.PlaneGeometry(frameW - 0.09, frameH - 0.09)), portraitMat);
    portraitMesh.position.z = 0.025;
    nichoGroup.add(portraitMesh);

    // Frame backboard
    const backMesh = new THREE.Mesh(regGeo(new THREE.BoxGeometry(frameW, frameH, 0.035)), woodMat);
    nichoGroup.add(backMesh);

    // Stepped Gilded Frame Borders
    const topBar = new THREE.Mesh(regGeo(new THREE.BoxGeometry(frameW + 0.05, borderThick, 0.05)), goldFrameMat);
    topBar.position.set(0, frameH / 2, 0.02);
    nichoGroup.add(topBar);

    const botBar = new THREE.Mesh(regGeo(new THREE.BoxGeometry(frameW + 0.05, borderThick, 0.05)), goldFrameMat);
    botBar.position.set(0, -frameH / 2, 0.02);
    nichoGroup.add(botBar);

    const leftBar = new THREE.Mesh(regGeo(new THREE.BoxGeometry(borderThick, frameH, 0.05)), goldFrameMat);
    leftBar.position.set(-frameW / 2, 0, 0.02);
    nichoGroup.add(leftBar);

    const rightBar = new THREE.Mesh(regGeo(new THREE.BoxGeometry(borderThick, frameH, 0.05)), goldFrameMat);
    rightBar.position.set(frameW / 2, 0, 0.02);
    nichoGroup.add(rightBar);

    // Stepped Crown: 4-sided pyramid
    const crownGeo = regGeo(new THREE.ConeGeometry(0.14, 0.16, 4));
    crownGeo.rotateY(Math.PI / 4);
    const crownMesh = new THREE.Mesh(crownGeo, goldFrameMat);
    crownMesh.position.set(0, frameH / 2 + 0.09, 0.02);
    nichoGroup.add(crownMesh);

    interactiveObjects.push(portraitMesh);
    portraitMesh.userData = { id, type: 'nicho' };

    clickableMap.set(id, {
      id,
      title: `Memorial Nicho: ${name}`,
      type: 'nicho',
      description: `${subtitle} — Click to inspect archived memories and ground questions.`,
      associated_memory_id: memoryId,
      tier: y > 1.8 ? 3 : y > 1.2 ? 2 : 1
    });

    interactiveGroup.add(nichoGroup);
    relicGroups.set(id, nichoGroup);
    return nichoGroup;
  };

  createNicho(0, 2.52, -0.38, 0, 'Elena Reyes', '1924–2012 • Matriarch', 'nicho_elena', 'mem_001');
  createNicho(-0.95, 1.82, -0.05, 0.18, 'Mateo Reyes', '1920–1998 • Patriarch', 'nicho_mateo', 'mem_003');
  createNicho(0.95, 1.82, -0.05, -0.18, 'Tío Héctor', '1948–2016 • Musician', 'nicho_hector', 'mem_002');
  createNicho(-1.85, 1.1, 0.7, 0.28, 'Rosa Reyes', '1952–2020 • Chronicler', 'nicho_rosa', 'mem_004');
  createNicho(1.85, 1.1, 0.7, -0.28, 'Dr. Sofia Reyes', '1975–Now • Healer', 'nicho_sofia', 'mem_008');

  // Low-Poly Calavera de Azúcar (8 Segments)
  const calaveraGroup = new THREE.Group();
  calaveraGroup.position.set(0, 1.48, 0.35);
  calaveraGroup.scale.setScalar(1.25);

  const craniumGeo = regGeo(new THREE.SphereGeometry(0.16, 8, 8));
  craniumGeo.scale(1.0, 1.15, 0.95);
  const calaveraMat = regMat(new THREE.MeshStandardMaterial({
    map: textures.sugarSkull,
    roughness: 0.35,
    metalness: 0.05
  }));
  const craniumMesh = new THREE.Mesh(craniumGeo, calaveraMat);
  craniumMesh.position.y = 0.16;
  calaveraGroup.add(craniumMesh);

  const jawMesh = new THREE.Mesh(regGeo(new THREE.BoxGeometry(0.18, 0.1, 0.15)), calaveraMat);
  jawMesh.position.set(0, 0.06, 0.04);
  calaveraGroup.add(jawMesh);

  interactiveObjects.push(craniumMesh);
  craniumMesh.userData = { id: 'offering_calavera', type: 'calavera' };
  clickableMap.set('offering_calavera', {
    id: 'offering_calavera',
    title: 'Calavera de Azúcar',
    type: 'calavera',
    description: 'Decorated sugar skull honoring the sweetness of remembrance.',
    associated_memory_id: 'mem_015',
    tier: 2
  });
  interactiveGroup.add(calaveraGroup);
  relicGroups.set('offering_calavera', calaveraGroup);

  // Low-Poly Pan de Muerto (8 Segments)
  const panGroup = new THREE.Group();
  panGroup.position.set(-0.75, 0.74, 1.05);
  const breadMat = regMat(new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.85,
    metalness: 0.04
  }));

  const breadBaseGeo = regGeo(new THREE.SphereGeometry(0.18, 8, 6));
  breadBaseGeo.scale(1.2, 0.6, 1.2);
  const breadMesh = new THREE.Mesh(breadBaseGeo, breadMat);
  breadMesh.position.y = 0.06;
  panGroup.add(breadMesh);

  const bone1 = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.36, 5)), breadMat);
  bone1.rotateZ(Math.PI / 2);
  bone1.position.y = 0.14;
  panGroup.add(bone1);

  const bone2 = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.36, 5)), breadMat);
  bone2.rotateX(Math.PI / 2);
  bone2.position.y = 0.14;
  panGroup.add(bone2);

  const tearKnob = new THREE.Mesh(regGeo(new THREE.SphereGeometry(0.035, 5, 5)), breadMat);
  tearKnob.position.y = 0.18;
  panGroup.add(tearKnob);

  interactiveObjects.push(breadMesh);
  breadMesh.userData = { id: 'offering_pan', type: 'pan_de_muerto' };
  clickableMap.set('offering_pan', {
    id: 'offering_pan',
    title: 'Pan de Muerto',
    type: 'pan_de_muerto',
    description: 'Anise and orange-blossom scented brioche baked for departed souls.',
    associated_memory_id: 'mem_007',
    tier: 1
  });
  interactiveGroup.add(panGroup);
  relicGroups.set('offering_pan', panGroup);

  // Copal Sahumerio (8 Segments)
  const copalGroup = new THREE.Group();
  copalGroup.position.set(0.75, 0.74, 1.05);
  const clayMat = regMat(new THREE.MeshStandardMaterial({
    color: 0x23161c,
    roughness: 0.95,
    metalness: 0.05
  }));

  const bowlMesh = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.12, 0.05, 0.12, 8)), clayMat);
  bowlMesh.position.y = 0.06;
  copalGroup.add(bowlMesh);

  const emberMat = regMat(new THREE.MeshBasicMaterial({ color: 0xd97706 }));
  const emberMesh = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 6)), emberMat);
  emberMesh.position.y = 0.11;
  copalGroup.add(emberMesh);

  interactiveObjects.push(bowlMesh);
  bowlMesh.userData = { id: 'offering_copal', type: 'copal' };
  clickableMap.set('offering_copal', {
    id: 'offering_copal',
    title: 'Copal Sahumerio',
    type: 'copal',
    description: 'Sacred resin smoke cleansing negative energies and guiding souls.',
    associated_memory_id: 'mem_007',
    tier: 1
  });
  interactiveGroup.add(copalGroup);
  relicGroups.set('offering_copal', copalGroup);

  // Copal Smoke Particles
  const smokeCount = 45;
  const smokePositions = new Float32Array(smokeCount * 3);
  const smokeVelocities = new Float32Array(smokeCount * 3);
  const smokeLifetimes = new Float32Array(smokeCount);

  for (let i = 0; i < smokeCount; i++) {
    smokePositions[i * 3 + 0] = copalGroup.position.x + (Math.random() - 0.5) * 0.05;
    smokePositions[i * 3 + 1] = copalGroup.position.y + 0.12 + Math.random() * 0.8;
    smokePositions[i * 3 + 2] = copalGroup.position.z + (Math.random() - 0.5) * 0.05;

    smokeVelocities[i * 3 + 0] = (Math.random() - 0.5) * 0.08;
    smokeVelocities[i * 3 + 1] = 0.2 + Math.random() * 0.25;
    smokeVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.08;

    smokeLifetimes[i] = Math.random();
  }

  const smokeGeo = regGeo(new THREE.BufferGeometry());
  smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
  const smokePointsMat = regMat(new THREE.PointsMaterial({
    color: 0xfde68a,
    size: 0.06,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  }));
  const smokePoints = new THREE.Points(smokeGeo, smokePointsMat);
  altarGroup.add(smokePoints);

  // Low-Poly Guitar (8 Segments)
  const guitarGroup = new THREE.Group();
  guitarGroup.position.set(2.45, 0, 0.85);
  guitarGroup.rotation.set(-0.35, -0.4, 0.2);

  const guitarWoodMat = regMat(new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.4,
    metalness: 0.1
  }));

  const lowerBout = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 8)), guitarWoodMat);
  lowerBout.scale.set(1.0, 1.0, 0.7);
  guitarGroup.add(lowerBout);

  const upperBout = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.14, 8)), guitarWoodMat);
  upperBout.position.y = 0.32;
  upperBout.scale.set(1.0, 1.0, 0.7);
  guitarGroup.add(upperBout);

  const neck = new THREE.Mesh(regGeo(new THREE.BoxGeometry(0.06, 0.55, 0.04)), woodMat);
  neck.position.set(0, 0.68, 0.02);
  guitarGroup.add(neck);

  const head = new THREE.Mesh(regGeo(new THREE.BoxGeometry(0.08, 0.14, 0.03)), guitarWoodMat);
  head.position.set(0, 1.0, 0.02);
  guitarGroup.add(head);

  const rosette = new THREE.Mesh(regGeo(new THREE.CircleGeometry(0.06, 8)), regMat(new THREE.MeshBasicMaterial({ color: 0x07080d })));
  rosette.position.set(0, 0.22, 0.075);
  guitarGroup.add(rosette);

  interactiveObjects.push(lowerBout);
  lowerBout.userData = { id: 'offering_guitar', type: 'guitar' };
  clickableMap.set('offering_guitar', {
    id: 'offering_guitar',
    title: "Tío Héctor's Classical Guitar",
    type: 'guitar',
    description: 'Crafted in 1971 of palo escrito in Michoacán; played on Veracruz nights.',
    associated_memory_id: 'mem_002',
    tier: 1
  });
  interactiveGroup.add(guitarGroup);
  relicGroups.set('offering_guitar', guitarGroup);

  // ----------------------------------------------------
  // 10. RETRO DRIFTING PETALS (Low Count Instanced)
  // ----------------------------------------------------
  const petalCount = 80;
  const petalGeo = regGeo(new THREE.PlaneGeometry(0.08, 0.05));
  const petalMat = regMat(new THREE.MeshStandardMaterial({
    map: textures.marigoldPetal,
    side: THREE.DoubleSide,
    roughness: 0.6,
    metalness: 0.05,
    alphaTest: 0.1
  }));

  const petalInstancedMesh = new THREE.InstancedMesh(petalGeo, petalMat, petalCount);
  petalInstancedMesh.frustumCulled = false;

  const pPositions = new Float32Array(petalCount * 3);
  const pRotations = new Float32Array(petalCount * 3);
  const pVelocities = new Float32Array(petalCount * 3);
  const pScales = new Float32Array(petalCount);

  for (let i = 0; i < petalCount; i++) {
    pPositions[i * 3 + 0] = (Math.random() - 0.5) * 8.0;
    pPositions[i * 3 + 1] = Math.random() * 5.5;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 5.0;

    pRotations[i * 3 + 0] = Math.random() * Math.PI * 2;
    pRotations[i * 3 + 1] = Math.random() * Math.PI * 2;
    pRotations[i * 3 + 2] = Math.random() * Math.PI * 2;

    pVelocities[i * 3 + 0] = 0.12 + Math.random() * 0.22;
    pVelocities[i * 3 + 1] = -(0.2 + Math.random() * 0.32);
    pVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.18;

    pScales[i] = 0.6 + Math.random() * 0.8;

    dummy.position.set(pPositions[i * 3], pPositions[i * 3 + 1], pPositions[i * 3 + 2]);
    dummy.rotation.set(pRotations[i * 3], pRotations[i * 3 + 1], pRotations[i * 3 + 2]);
    dummy.scale.setScalar(pScales[i]);
    dummy.updateMatrix();
    petalInstancedMesh.setMatrixAt(i, dummy.matrix);
  }
  petalInstancedMesh.instanceMatrix.needsUpdate = true;
  altarGroup.add(petalInstancedMesh);

  return {
    scene,
    interactiveObjects,
    interactiveGroup,
    candles,
    petals: {
      mesh: petalInstancedMesh,
      count: petalCount,
      positions: pPositions,
      rotations: pRotations,
      velocities: pVelocities,
      scales: pScales
    },
    copalSmoke: {
      points: smokePoints,
      count: smokeCount,
      positions: smokePositions,
      velocities: smokeVelocities,
      lifetimes: smokeLifetimes
    },
    clickableMap,
    relicGroups,
    keyLight,
    fillLight,
    altarGroup,
    disposables
  };
}
