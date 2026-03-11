import * as THREE from 'three';
import { OBJLoader }       from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls }    from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment }  from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer }   from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }       from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass }  from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass }       from 'three/addons/postprocessing/OutputPass.js';

/* ═══════════════════════════════════════════
   Component & Organelle Data
   ═══════════════════════════════════════════ */
const MODELS = [
  { id: 0, name: 'Plasmid',       color: 0xb07ae8, roughness: 0.35, metalness: 0.0, clearcoat: 0.7, clearcoatRoughness: 0.12, opacity: 1.0,  emissive: 0x2a0050, emissiveIntensity: 0.20 },
  { id: 1, name: 'Circular DNA',  color: 0xb07ae8, roughness: 0.06, metalness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.02, opacity: 1.0,  emissive: 0x3a1028, emissiveIntensity: 0.06 },
  { id: 2, name: 'Flagellum',     color: 0x0d8a7a, roughness: 0.18, metalness: 0.0, clearcoat: 0.9, clearcoatRoughness: 0.06, opacity: 1.0,  emissive: 0x064a40, emissiveIntensity: 0.18 },
  { id: 3, name: 'Flagellum',     color: 0x18b8a4, roughness: 0.16, metalness: 0.0, clearcoat: 0.9, clearcoatRoughness: 0.05, opacity: 1.0,  emissive: 0x085850, emissiveIntensity: 0.14 },
  { id: 4, name: 'Capsule',       color: 0x0a7e6e, roughness: 0.22, metalness: 0.0, clearcoat: 0.85,clearcoatRoughness: 0.08, opacity: 1.0,  emissive: 0x044038, emissiveIntensity: 0.18 },
  { id: 5, name: 'Cell wall',     color: 0x9dbb4a, roughness: 0.36, metalness: 0.0, clearcoat: 0.6, clearcoatRoughness: 0.14, opacity: 1.0,  emissive: 0x2a3408, emissiveIntensity: 0.10 },
  { id: 6, name: 'Cell Membrane', color: 0xbfb77a, roughness: 0.48, metalness: 0.0, clearcoat: 0.25,clearcoatRoughness: 0.26, opacity: 1.0,  emissive: 0x1a1900, emissiveIntensity: 0.06 },
  { id: 7, name: 'Pili',          color: 0x0a6e60, roughness: 0.18, metalness: 0.0, clearcoat: 0.9, clearcoatRoughness: 0.05, opacity: 1.0,  emissive: 0x064a40, emissiveIntensity: 0.18 },
  { id: 8, name: 'Ribosomes',     color: 0xe82050, roughness: 0.38, metalness: 0.0, clearcoat: 0.6, clearcoatRoughness: 0.15, opacity: 1.0,  emissive: 0x500010, emissiveIntensity: 0.20 },
  { id: 9, name: 'Cytoplasm',     color: 0xc9cbcc, roughness: 0.10, metalness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.04, opacity: 0.25, emissive: 0x070708, emissiveIntensity: 0.02 },
];

const ORGANELLES = [
  {
    num: 1, name: 'Plasmid', sub: 'DNA Ekstra-kromosomal',
    modelId: 0, icon: '🔮', color: '#a78bfa',
    desc: 'Molekul DNA kecil berbentuk lingkaran yang terpisah dari DNA kromosom utama. Bisa berpindah antar bakteri!',
    detail: [
      'Membawa gen resistensi antibiotik',
      'Bisa dipindahkan ke bakteri lain lewat konjugasi',
      'Digunakan ilmuwan untuk rekayasa genetika'
    ]
  },
  {
    num: 2, name: 'DNA Sirkuler', sub: 'Circular DNA — Nukleoid',
    modelId: 1, icon: '🧬', color: '#c084fc',
    desc: 'DNA utama bakteri berbentuk cincin melingkar tanpa membran inti. Menyimpan seluruh informasi genetik.',
    detail: [
      'Panjang DNA E. coli bisa 1,6 mm — 800× lebih panjang dari selnya!',
      'Terletak di area nukleoid (bukan nukleus)',
      'Tidak dibungkus membran, langsung di sitoplasma'
    ]
  },
  {
    num: 3, name: 'Flagellum', sub: 'Alat Gerak Bakteri',
    modelId: 2, icon: '🏊', color: '#22d3ee',
    desc: 'Struktur seperti ekor cambuk yang berputar bagai baling-baling untuk menggerakan bakteri.',
    detail: [
      'Bisa berputar hingga 1.000 putaran per detik!',
      'Motor nano paling efisien di alam',
      'Beberapa bakteri punya banyak flagellum'
    ]
  },
  {
    num: 4, name: 'Kapsul', sub: 'Capsule — Lapisan Pelindung',
    modelId: 4, icon: '🛡️', color: '#14b8a6',
    desc: 'Lapisan berlendir di luar dinding sel — perisai pelindung dari serangan sel darah putih.',
    detail: [
      'Membuat bakteri "tak terlihat" oleh sistem imun',
      'Terbuat dari polisakarida atau polipeptida',
      'Bakteri berkapsul lebih berbahaya/patogenik'
    ]
  },
  {
    num: 5, name: 'Dinding Sel', sub: 'Cell Wall — Peptidoglikan',
    modelId: 5, icon: '🧱', color: '#34d399',
    desc: 'Lapisan kaku dari peptidoglikan yang memberi bentuk dan kekuatan pada bakteri.',
    detail: [
      'Target antibiotik penisilin',
      'Gram+ punya dinding tebal, Gram− punya tipis',
      'Tanpa dinding sel, bakteri pecah!'
    ]
  },
  {
    num: 6, name: 'Membran Sel', sub: 'Cell Membrane — Fosfolipid Bilayer',
    modelId: 6, icon: '🫧', color: '#fbbf24',
    desc: 'Lapisan tipis fosfolipid yang mengatur lalu-lintas zat masuk-keluar sel, seperti pintu gerbang!',
    detail: [
      'Tidak mengandung kolesterol (beda dg sel hewan)',
      'Tempat respirasi sel bakteri berlangsung',
      'Bergerak terus — model "mosaik fluida"'
    ]
  },
  {
    num: 7, name: 'Pili', sub: 'Fimbriae — Rambut Halus Bakteri',
    modelId: 7, icon: '🦑', color: '#06b6d4',
    desc: 'Rambut-rambut halus di permukaan bakteri untuk menempel pada permukaan dan bakteri lain.',
    detail: [
      'Pili seks untuk bertukar DNA (konjugasi)',
      'Satu bakteri bisa punya ratusan pili',
      'Menempel di usus, gigi, dan permukaan lain'
    ]
  },
  {
    num: 8, name: 'Ribosom', sub: 'Ribosome — Pabrik Protein',
    modelId: 8, icon: '🔩', color: '#f87171',
    desc: 'Organel super kecil — pabrik mini yang membuat protein dari instruksi DNA.',
    detail: [
      'Ribosom bakteri 70S (lebih kecil dari manusia 80S)',
      'Target antibiotik tanpa merusak sel manusia',
      'Satu E. coli punya ~20.000 ribosom!'
    ]
  },
  {
    num: 9, name: 'Sitoplasma', sub: 'Cytoplasm — Cairan Sel',
    modelId: 9, icon: '🫠', color: '#94a3b8',
    desc: 'Cairan kental seperti jeli yang mengisi seluruh ruang sel — tempat semua reaksi kimia berlangsung.',
    detail: [
      'Mengandung 70-80% air',
      'Ribuan jenis enzim bekerja di dalamnya',
      'Arus sitoplasma mendistribusikan nutrisi'
    ]
  },
];

/* ═══════════════════════════════════════════
   Label Location Tuning (edit here)
   - anchorsByModelId: [x, y, z] multiplier dari ukuran bounding-box model
   - showGuideLines: true untuk menampilkan garis center -> titik label
   ═══════════════════════════════════════════ */
const LABEL_LOCATION_CONFIG = {
  labelEditable: 1,
  showGuideLines: false,
  guideLineColor: 0x22d3ee,
  fallbackAnchor: [0.15, 0.35, 0.15],
  anchorsByModelId: {
    0: [0.20, 0.35, 0.30],
    1: [-0.20, 0.28, 0.30],
    2: [0.35, 0.10, -0.35],
    4: [0.22, 0.34, 0.30],
    5: [-0.56, 0.18, 0.18],
    6: [0.18, -0.14, 0.56],
    7: [0.00, 0.68, -0.56],
    8: [-0.24, -0.22, -0.24],
    9: [0.00, -0.44, 0.00],
  },
};

const LABEL_CONF_FILE = 'conf.json';
const LABEL_CONF_STORAGE_KEY = 'biocell.labelLocationConfig.v1';

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function ensureAnchorForModel(modelId) {
  if (!LABEL_LOCATION_CONFIG.anchorsByModelId[modelId]) {
    LABEL_LOCATION_CONFIG.anchorsByModelId[modelId] = [...LABEL_LOCATION_CONFIG.fallbackAnchor];
  }
  return LABEL_LOCATION_CONFIG.anchorsByModelId[modelId];
}

function parseLabelEditable(value) {
  if (value === true || value === 1 || value === '1') return 1;
  if (value === false || value === 0 || value === '0') return 0;
  return LABEL_LOCATION_CONFIG.labelEditable;
}

function isLabelEditingEnabled() {
  return Number(LABEL_LOCATION_CONFIG.labelEditable) === 1;
}

function getLabelConfigSnapshot() {
  return {
    version: 1,
    labelEditable: isLabelEditingEnabled() ? 1 : 0,
    showGuideLines: !!LABEL_LOCATION_CONFIG.showGuideLines,
    guideLineColor: LABEL_LOCATION_CONFIG.guideLineColor,
    fallbackAnchor: [...LABEL_LOCATION_CONFIG.fallbackAnchor],
    anchorsByModelId: Object.fromEntries(
      Object.entries(LABEL_LOCATION_CONFIG.anchorsByModelId).map(([k, arr]) => [
        Number(k),
        [Number(arr[0]), Number(arr[1]), Number(arr[2])],
      ])
    ),
    updatedAt: new Date().toISOString(),
  };
}

function applyLabelConfig(data) {
  if (!data || typeof data !== 'object') return false;

  if (Object.prototype.hasOwnProperty.call(data, 'labelEditable')) {
    LABEL_LOCATION_CONFIG.labelEditable = parseLabelEditable(data.labelEditable);
  }

  if (Array.isArray(data.fallbackAnchor) && data.fallbackAnchor.length === 3) {
    LABEL_LOCATION_CONFIG.fallbackAnchor = data.fallbackAnchor.map(v => Number(v) || 0);
  }

  if (typeof data.showGuideLines === 'boolean') {
    LABEL_LOCATION_CONFIG.showGuideLines = data.showGuideLines;
  }

  if (typeof data.guideLineColor === 'number') {
    LABEL_LOCATION_CONFIG.guideLineColor = data.guideLineColor;
  }

  if (data.anchorsByModelId && typeof data.anchorsByModelId === 'object') {
    Object.entries(data.anchorsByModelId).forEach(([id, arr]) => {
      if (!Array.isArray(arr) || arr.length !== 3) return;
      LABEL_LOCATION_CONFIG.anchorsByModelId[Number(id)] = arr.map(v => Number(v) || 0);
    });
  }

  return true;
}

function saveLabelConfigToLocalStorage() {
  try {
    localStorage.setItem(LABEL_CONF_STORAGE_KEY, JSON.stringify(getLabelConfigSnapshot()));
    return true;
  } catch (err) {
    console.warn('Gagal menyimpan konfigurasi label ke localStorage:', err);
    return false;
  }
}

function loadLabelConfigFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LABEL_CONF_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return applyLabelConfig(parsed);
  } catch (err) {
    console.warn('Gagal memuat konfigurasi label dari localStorage:', err);
    return false;
  }
}

async function loadLabelConfigFromFile() {
  try {
    const res = await fetch(`${LABEL_CONF_FILE}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return false;
    const parsed = await res.json();
    return applyLabelConfig(parsed);
  } catch {
    return false;
  }
}

function downloadCurrentLabelConfig() {
  const text = JSON.stringify(getLabelConfigSnapshot(), null, 2);
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'conf.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function initLabelLocationConfig() {
  // Prioritas: file conf.json, lalu override dari localStorage jika user pernah save manual.
  await loadLabelConfigFromFile();
  loadLabelConfigFromLocalStorage();
  syncLabelTuningAvailability();
  if (labels3D.length > 0) updateAllLabelPositions();
}

initLabelLocationConfig();

function getAnchorVector(modelId) {
  const a = ensureAnchorForModel(modelId);
  return new THREE.Vector3(a[0], a[1], a[2]);
}

function addLabelGuideLine(center, anchor, colorHex) {
  if (!LABEL_LOCATION_CONFIG.showGuideLines) return;
  const points = [center.clone(), anchor.clone()];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: colorHex ?? LABEL_LOCATION_CONFIG.guideLineColor,
    transparent: true,
    opacity: 0.85,
  });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  return line;
}

/* ═══════════════════════════════════════════
   Procedural Slime Textures
   ═══════════════════════════════════════════ */
function hash2D(ix, iy) {
  let n = ix * 374761393 + iy * 668265263;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) & 0x7fffffff) / 0x7fffffff;
}
function smoothNoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash2D(ix, iy), b = hash2D(ix + 1, iy);
  const c = hash2D(ix, iy + 1), d = hash2D(ix + 1, iy + 1);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
function fbm(x, y, octaves = 5) {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * smoothNoise(x * freq, y * freq);
    amp *= 0.5; freq *= 2.1;
  }
  return val;
}

function makeSlimeNormalMap(size = 512, scale = 6, strength = 1.2) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(size, size);
  const d = img.data;
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      h[y * size + x] = fbm(x / size * scale, y / size * scale, 5);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      const l = h[y * size + ((x - 1 + size) % size)];
      const r = h[y * size + ((x + 1) % size)];
      const u = h[((y - 1 + size) % size) * size + x];
      const dn = h[((y + 1) % size) * size + x];
      let nx = (l - r) * strength, ny = (u - dn) * strength, nz = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx /= len; ny /= len; nz /= len;
      const p = idx * 4;
      d[p]   = Math.round((nx * 0.5 + 0.5) * 255);
      d[p+1] = Math.round((ny * 0.5 + 0.5) * 255);
      d[p+2] = Math.round((nz * 0.5 + 0.5) * 255);
      d[p+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

function makeSlimeRoughnessMap(size = 512, scale = 8) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const v1 = fbm(x / size * scale, y / size * scale, 4);
      const v2 = fbm(x / size * scale * 2.3 + 50, y / size * scale * 2.3 + 50, 3);
      let v = Math.pow(v1 * 0.6 + v2 * 0.4, 1.4);
      const c = Math.round(v * 180 + 30);
      const p = (y * size + x) * 4;
      d[p] = d[p+1] = d[p+2] = c; d[p+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

const slimeNormal        = makeSlimeNormalMap(512, 6, 1.5);
const slimeRoughness     = makeSlimeRoughnessMap(512, 8);
const slimeNormalFine    = makeSlimeNormalMap(256, 12, 0.8);
const slimeRoughnessFine = makeSlimeRoughnessMap(256, 14);

/* ═══════════════════════════════════════════
   Renderer & Scene Setup
   ═══════════════════════════════════════════ */
const canvas   = document.getElementById('three-canvas');
const viewWrap = document.getElementById('viewer-wrap');

const IS_TOUCH_DEVICE =
  window.matchMedia('(pointer: coarse)').matches ||
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const PERF = {
  maxPixelRatio: IS_TOUCH_DEVICE ? 0.75 : 2,
  usePostProcessing: !IS_TOUCH_DEVICE,
  useShadows: !IS_TOUCH_DEVICE,
  usePhysicalLights: !IS_TOUCH_DEVICE,
  useEnvironment: !IS_TOUCH_DEVICE,
  useMeshPhysicalMaterial: !IS_TOUCH_DEVICE,
  useDetailMaps: !IS_TOUCH_DEVICE,
  mobileExposure: IS_TOUCH_DEVICE ? 1.06 : 0.62,
  mobileColorBoost: IS_TOUCH_DEVICE ? 1.28 : 1.0,
  labelOcclusionIntervalMs: IS_TOUCH_DEVICE ? 1200 : 450,
  enableLabelOcclusion: !IS_TOUCH_DEVICE,
};

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: !IS_TOUCH_DEVICE,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, PERF.maxPixelRatio));
renderer.shadowMap.enabled = PERF.useShadows;
renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = PERF.usePhysicalLights;
renderer.toneMapping         = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = PERF.mobileExposure;
renderer.outputColorSpace    = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 0);

const scene  = new THREE.Scene();
scene.background = null;
scene.fog = new THREE.FogExp2(IS_TOUCH_DEVICE ? 0x30457a : 0x111a2e, IS_TOUCH_DEVICE ? 0.0052 : 0.0105);

const camera = new THREE.PerspectiveCamera(45, 1, 0.0001, 5000);
camera.position.set(0, 0, 5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping  = !IS_TOUCH_DEVICE;
controls.dampingFactor  = 0.06;
controls.minDistance    = 0.001;
controls.maxDistance    = 2000;
controls.addEventListener('change', requestRender);

/* CSS2D Label Renderer */
const labelRenderer = new CSS2DRenderer();
labelRenderer.domElement.style.position      = 'absolute';
labelRenderer.domElement.style.top           = '0';
labelRenderer.domElement.style.left          = '0';
labelRenderer.domElement.style.zIndex        = '2';
labelRenderer.domElement.style.pointerEvents = 'none';
viewWrap.appendChild(labelRenderer.domElement);

/* Environment (IBL) */
if (PERF.useEnvironment) {
  const pmremGen = new THREE.PMREMGenerator(renderer);
  pmremGen.compileEquirectangularShader();
  scene.environment = pmremGen.fromScene(new RoomEnvironment(), 0.01).texture;
  pmremGen.dispose();
}

/* ═══════════════════════════════════════════
   Render-on-demand
   ═══════════════════════════════════════════ */
let needsRender = true;
function requestRender() { needsRender = true; }

/* ═══════════════════════════════════════════
   Lighting (named refs for sliders)
   ═══════════════════════════════════════════ */
const hemiLight = new THREE.HemisphereLight(0xd4ccff, 0xc8e4b0, 0.12);
if (IS_TOUCH_DEVICE) hemiLight.intensity = 0.30;
scene.add(hemiLight);

const keyLight = new THREE.DirectionalLight(0xfff6ee, 0.7);
keyLight.position.set(6, 8, 7);
if (IS_TOUCH_DEVICE) keyLight.intensity = 1.15;
keyLight.castShadow = PERF.useShadows;
if (PERF.useShadows) {
  keyLight.shadow.mapSize.set(IS_TOUCH_DEVICE ? 1024 : 2048, IS_TOUCH_DEVICE ? 1024 : 2048);
  keyLight.shadow.bias = -0.0005;
}
scene.add(keyLight);

const dl1 = new THREE.DirectionalLight(0xaabcff, 0.15);
dl1.position.set(-7, 3, -2);
if (IS_TOUCH_DEVICE) dl1.intensity = 0.30;
scene.add(dl1);

const dl2 = new THREE.DirectionalLight(0xffe0a0, 0.18);
dl2.position.set(-2, -4, -7);
if (IS_TOUCH_DEVICE) dl2.intensity = 0.36;
scene.add(dl2);

const dl3 = new THREE.DirectionalLight(0xffffff, 0.12);
dl3.position.set(0, 12, 2);
if (IS_TOUCH_DEVICE) dl3.intensity = 0.28;
scene.add(dl3);

/* ═══════════════════════════════════════════
   Post-processing (Bloom)
   ═══════════════════════════════════════════ */
let composer = null;
if (PERF.usePostProcessing) {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.32, 0.6, 0.7
  ));
  composer.addPass(new OutputPass());
}

/* ═══════════════════════════════════════════
   Model Loading
   ═══════════════════════════════════════════ */
const group   = new THREE.Group();
scene.add(group);
const meshMap = {}, matMap = {}, layerVisible = {};
let loadedCount = 0, failCount = 0;
const TOTAL = MODELS.length;
let initCamPos, initTarget;

function onProgress(count) {
  document.getElementById('load-label').textContent = `Memuat model… ${count} / ${TOTAL}`;
  document.getElementById('progress-bar').style.width = `${(count / TOTAL) * 100}%`;
  if (count === TOTAL) {
    const ld = document.getElementById('loading');
    ld.classList.add('hidden');
    setTimeout(() => { ld.style.display = 'none'; }, 600);
    fitCamera();
    applyModelColors();
    createLabels();
    rebuildMeshCache();
    requestRender();
    setTimeout(() => {
      const h = document.getElementById('controls-hint');
      if (h) h.style.opacity = '0';
    }, 5000);
  }
}

function fitCamera() {
  const box = new THREE.Box3().setFromObject(group);
  if (box.isEmpty()) return;
  const center = box.getCenter(new THREE.Vector3());
  const size   = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fovRad = camera.fov * (Math.PI / 180);
  const dist   = (maxDim / (2 * Math.tan(fovRad / 2))) * 1.0;

  camera.near = dist / 1000;
  camera.far  = dist * 100;
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  camera.position.copy(center).add(new THREE.Vector3(maxDim * 0.48, maxDim * 0.24, dist * 0.72));
  controls.update();

  initCamPos = camera.position.clone();
  initTarget = controls.target.clone();

  // External point lights scaled to model size
  const ext1 = new THREE.PointLight(0xfff6e8, 0.60, maxDim * 4.0);
  ext1.position.copy(center).add(new THREE.Vector3(maxDim * 1.2, maxDim * 0.6, maxDim * 0.8));
  ext1.castShadow = PERF.useShadows;
  if (PERF.useShadows) {
    ext1.shadow.mapSize.set(IS_TOUCH_DEVICE ? 512 : 1024, IS_TOUCH_DEVICE ? 512 : 1024);
  }
  scene.add(ext1);
  const pl1 = new THREE.PointLight(0x66e0ff, 0.18, maxDim * 3.5);
  pl1.position.copy(center.clone().add(new THREE.Vector3(-maxDim, maxDim * 0.35, -maxDim * 0.6)));
  scene.add(pl1);

  const pl2 = new THREE.PointLight(0xffe0b0, 0.14, maxDim * 3.0);
  pl2.position.copy(center.clone().add(new THREE.Vector3(0, -maxDim * 0.9, -maxDim * 0.9)));
  scene.add(pl2);
}

const loader = new OBJLoader();

MODELS.forEach(def => {
  const isGlassy = def.opacity < 1;
  const isSmall  = [0, 2, 3, 8].includes(def.id);
  const nMap = PERF.useDetailMaps ? (isSmall ? slimeNormalFine : slimeNormal) : null;
  const rMap = PERF.useDetailMaps ? (isSmall ? slimeRoughnessFine : slimeRoughness) : null;

  const baseMaterialConfig = {
    color:             new THREE.Color(def.color).multiplyScalar(PERF.mobileColorBoost),
    roughness:         Math.max(0.04, def.roughness * 0.55),
    metalness:         def.metalness,
    emissive:          new THREE.Color(def.emissive),
    emissiveIntensity: def.emissiveIntensity * (IS_TOUCH_DEVICE ? 1.85 : 1.0),
    envMapIntensity:   PERF.useEnvironment ? 2.2 : 0.0,
    transparent:       isGlassy,
    opacity:           def.opacity,
    side:              isGlassy ? THREE.DoubleSide : THREE.FrontSide,
    depthWrite:        !isGlassy,
  };

  const mat = PERF.useMeshPhysicalMaterial
    ? new THREE.MeshPhysicalMaterial({
        ...baseMaterialConfig,
        clearcoat:          Math.min(1.0, def.clearcoat + 0.30),
        clearcoatRoughness: def.clearcoatRoughness,
        normalMap:          nMap,
        normalScale:        new THREE.Vector2(0.35, 0.35),
        roughnessMap:       rMap,
        clearcoatNormalMap:   nMap,
        clearcoatNormalScale: new THREE.Vector2(0.2, 0.2),
      })
    : new THREE.MeshStandardMaterial({
        ...baseMaterialConfig,
        metalness: Math.min(0.3, def.metalness),
      });
  matMap[def.id] = mat;
  layerVisible[def.id] = true;

  loader.load(
    `Bacterial cell structure/model_${def.id}.obj`,
    obj => {
      obj.traverse(c => { if (c.isMesh) c.material = mat; });

      // Pili vertex color gradient (dark teal root → bright cyan tips)
      if (def.id === 7) {
        mat.vertexColors = true;
        mat.needsUpdate = true;
        obj.traverse(c => {
          if (!c.isMesh) return;
          const geo = c.geometry, pos = geo.attributes.position, count = pos.count;
          geo.computeBoundingBox();
          const bb = geo.boundingBox;
          const cx = (bb.min.x + bb.max.x) / 2;
          const cy = (bb.min.y + bb.max.y) / 2;
          const cz = (bb.min.z + bb.max.z) / 2;
          let maxDist = 0;
          for (let i = 0; i < count; i++) {
            const dx = pos.getX(i) - cx, dy = pos.getY(i) - cy, dz = pos.getZ(i) - cz;
            const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
            if (d > maxDist) maxDist = d;
          }
          const colors = new Float32Array(count * 3);
          const dark = new THREE.Color(0x064038), bright = new THREE.Color(0x60f0d8);
          for (let i = 0; i < count; i++) {
            const dx = pos.getX(i) - cx, dy = pos.getY(i) - cy, dz = pos.getZ(i) - cz;
            let t = maxDist > 0 ? Math.sqrt(dx*dx + dy*dy + dz*dz) / maxDist : 0;
            t = Math.pow(t, 1.8);
            const col = new THREE.Color().lerpColors(dark, bright, t);
            colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;
          }
          geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        });
      }

      meshMap[def.id] = obj;
      group.add(obj);
      loadedCount++;
      onProgress(loadedCount);
    },
    undefined,
    err => {
      console.warn(`model_${def.id}.obj failed:`, err);
      loadedCount++; failCount++;
      onProgress(loadedCount);
    }
  );
});

function applyModelColors() {
  MODELS.forEach(def => {
    const mat = matMap[def.id];
    if (!mat) return;
    mat.color.set(def.color).multiplyScalar(PERF.mobileColorBoost);
    mat.emissive.set(def.emissive);
    mat.emissiveIntensity = def.emissiveIntensity * (IS_TOUCH_DEVICE ? 2.15 : 1.4);
    mat.roughness = Math.max(0.01, def.roughness * 0.5);
    if ('clearcoat' in mat) {
      mat.clearcoat = Math.min(1.0, def.clearcoat + 0.30);
    }
    if ('envMapIntensity' in mat) {
      mat.envMapIntensity = PERF.useEnvironment ? 2.2 : 0.0;
    }
    mat.needsUpdate = true;
  });
}

/* ═══════════════════════════════════════════
   3D Labels (CSS2D) — Annotation Points
   ═══════════════════════════════════════════ */
const labels3D = [];
const labelEls = [];
const labelModelIds = [];
const labelGuideLines = [];
let labelsVisible = true;
const labelAnchorByNum = new Map();
let selectedTuneModelId = ORGANELLES[0]?.modelId ?? 0;
let tuneUI = null;
const dragTuneState = {
  active: false,
  modelId: null,
  startX: 0,
  startY: 0,
  startAnchor: [0, 0, 0],
};

function syncLabelVisibility() {
  labels3D.forEach((label, i) => {
    const modelId = labelModelIds[i];
    const layerOn = layerVisible[modelId] !== false;
    label.visible = labelsVisible && layerOn;
  });
}

function removeLabelGuideLines() {
  while (labelGuideLines.length) {
    const line = labelGuideLines.pop();
    scene.remove(line);
    line.geometry?.dispose?.();
    line.material?.dispose?.();
  }
}

function rebuildLabelGuideLines() {
  removeLabelGuideLines();
  if (!LABEL_LOCATION_CONFIG.showGuideLines) return;

  ORGANELLES.forEach((o, i) => {
    const obj = meshMap[o.modelId];
    const css2d = labels3D[i];
    if (!obj || !css2d) return;
    const center = new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
    const line = addLabelGuideLine(center, css2d.position, o.color);
    if (line) labelGuideLines.push(line);
  });
}

function updateAllLabelPositions() {
  ORGANELLES.forEach((o, i) => {
    const obj = meshMap[o.modelId];
    const css2d = labels3D[i];
    if (!obj || !css2d) return;
    const pos = getLabelAnchorPosition(obj, o.modelId);
    css2d.position.copy(pos);
    labelAnchorByNum.set(o.num, pos.clone());
  });

  rebuildLabelGuideLines();
  updateLabelTuneUI();
  requestRender();
}

function setSelectedTuneModel(modelId) {
  selectedTuneModelId = Number(modelId);
  if (!isLabelEditingEnabled()) {
    labelEls.forEach(el => el.classList.remove('tune-active'));
    updateLabelTuneUI();
    return;
  }
  labelEls.forEach((el, i) => {
    const isActive = labelModelIds[i] === selectedTuneModelId;
    el.classList.toggle('tune-active', isActive);
  });
  updateLabelTuneUI();
}

function startLabelAnchorDrag(modelId, ev) {
  if (!isLabelEditingEnabled()) return;
  const anchor = ensureAnchorForModel(modelId);
  dragTuneState.active = true;
  dragTuneState.modelId = Number(modelId);
  dragTuneState.startX = ev.clientX;
  dragTuneState.startY = ev.clientY;
  dragTuneState.startAnchor = [...anchor];
  controls.enabled = false;
  setSelectedTuneModel(modelId);
}

function onLabelAnchorDragMove(ev) {
  if (!isLabelEditingEnabled()) return;
  if (!dragTuneState.active) return;
  const arr = ensureAnchorForModel(dragTuneState.modelId);
  const dx = ev.clientX - dragTuneState.startX;
  const dy = ev.clientY - dragTuneState.startY;
  const speed = 0.003;

  arr[0] = clamp(dragTuneState.startAnchor[0] + dx * speed, -2, 2);
  arr[1] = clamp(dragTuneState.startAnchor[1] - dy * speed, -2, 2);
  if (ev.shiftKey) {
    arr[2] = clamp(dragTuneState.startAnchor[2] - dy * speed, -2, 2);
  }

  updateAllLabelPositions();
}

function stopLabelAnchorDrag() {
  if (!dragTuneState.active) return;
  dragTuneState.active = false;
  controls.enabled = true;
  saveLabelConfigToLocalStorage();
}

function getLabelAnchorPosition(obj, modelId) {
  if (modelId === 7) {
    const piliAnchor = getPiliHairAnchorPosition(obj);
    if (piliAnchor) return piliAnchor;
  }

  const box = new THREE.Box3().setFromObject(obj);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const k = getAnchorVector(modelId);

  return center.clone().add(new THREE.Vector3(
    size.x * k.x,
    size.y * k.y,
    size.z * k.z
  ));
}

function getPiliHairAnchorPosition(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  if (box.isEmpty()) return null;

  const center = box.getCenter(new THREE.Vector3());
  const spanY = Math.max(0.0001, box.max.y - box.min.y);

  const local = new THREE.Vector3();
  const world = new THREE.Vector3();
  let bestPos = null;
  let bestScore = -Infinity;

  obj.traverse(c => {
    if (!c.isMesh || !c.geometry?.attributes?.position) return;
    const pos = c.geometry.attributes.position;

    // Sample vertices so this stays light even on dense meshes.
    const step = Math.max(1, Math.floor(pos.count / 2200));
    for (let i = 0; i < pos.count; i += step) {
      local.fromBufferAttribute(pos, i);
      world.copy(local).applyMatrix4(c.matrixWorld);

      const radial = world.distanceTo(center);
      const yNorm = (world.y - box.min.y) / spanY;

      // Prefer outer and upper strands so the label sits near the pili hairs.
      const score = radial + yNorm * 0.45;
      if (score > bestScore) {
        bestScore = score;
        bestPos = world.clone();
      }
    }
  });

  if (!bestPos) return null;
  return center.clone().lerp(bestPos, 0.92);
}

function createLabels() {
  ORGANELLES.forEach(o => {
    const obj = meshMap[o.modelId];
    const pos = obj
      ? getLabelAnchorPosition(obj, o.modelId)
      : new THREE.Vector3(0, 0, 0);

    labelAnchorByNum.set(o.num, pos.clone());

    const el = document.createElement('div');
    el.className = 'label3d';
    el.style.setProperty('--lc', o.color);
    el.innerHTML =
      `<span class="lnum">${o.num}</span>` +
      `<span class="lname">${o.icon} ${o.name}</span>`;
    el.addEventListener('pointerdown', e => {
      if (e.button === 2) {
        if (!isLabelEditingEnabled()) return;
        e.preventDefault();
        e.stopPropagation();
        startLabelAnchorDrag(o.modelId, e);
        return;
      }
      e.stopPropagation();
      showInfo(o);
      flyToOrganelle(css2d.position.clone());
    });

    el.addEventListener('contextmenu', e => {
      if (!isLabelEditingEnabled()) return;
      e.preventDefault();
      e.stopPropagation();
      setSelectedTuneModel(o.modelId);
      setSettingsPanelOpen(true);
    });

    const css2d = new CSS2DObject(el);
    css2d.position.copy(pos);
    scene.add(css2d);
    labels3D.push(css2d);
    labelEls.push(el);
    labelModelIds.push(o.modelId);
  });

  setSelectedTuneModel(selectedTuneModelId);
  rebuildLabelGuideLines();
  syncLabelVisibility();
}

/* ═══════════════════════════════════════════
   Label Occlusion Check (Raycasting)
   ═══════════════════════════════════════════ */
let cachedMeshes = [];
function rebuildMeshCache() {
  cachedMeshes = [];
  scene.traverse(c => { if (c.isMesh) cachedMeshes.push(c); });
}

const occRay = new THREE.Raycaster();
const _lPos  = new THREE.Vector3();
const _lDir  = new THREE.Vector3();
const OCCLUDER_FADE_OPACITY = 0.22;
const fadedOccluderMaterials = new Set();
const occluderMaterialState = new WeakMap();

function getMeshMaterials(mesh) {
  if (!mesh?.isMesh || !mesh.material) return [];
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}

function restoreOccluderOpacity() {
  fadedOccluderMaterials.forEach(mat => {
    const prev = occluderMaterialState.get(mat);
    if (!prev) return;
    mat.transparent = prev.transparent;
    mat.opacity = prev.opacity;
    mat.depthWrite = prev.depthWrite;
    mat.needsUpdate = true;
  });
  fadedOccluderMaterials.clear();
}

function fadeOccluder(mesh) {
  getMeshMaterials(mesh).forEach(mat => {
    if (!mat || typeof mat.opacity !== 'number') return;
    if (!occluderMaterialState.has(mat)) {
      occluderMaterialState.set(mat, {
        transparent: mat.transparent,
        opacity: mat.opacity,
        depthWrite: mat.depthWrite,
      });
    }

    mat.transparent = true;
    mat.opacity = Math.min(mat.opacity, OCCLUDER_FADE_OPACITY);
    mat.depthWrite = false;
    mat.needsUpdate = true;
    fadedOccluderMaterials.add(mat);
  });
}

function updateLabelOcclusion() {
  restoreOccluderOpacity();

  if (!PERF.enableLabelOcclusion) {
    labelEls.forEach(el => { el.style.opacity = '1'; });
    return;
  }
  if (!labelsVisible || labels3D.length === 0) return;
  if (cachedMeshes.length === 0) rebuildMeshCache();

  const camPos = camera.position;
  labels3D.forEach((css2d, i) => {
    if (!css2d.visible) {
      labelEls[i].style.opacity = '0';
      return;
    }

    css2d.getWorldPosition(_lPos);
    _lDir.subVectors(_lPos, camPos);
    const dist = _lDir.length();
    _lDir.divideScalar(dist);
    occRay.set(camPos, _lDir);
    occRay.far = dist;
    const hits = occRay.intersectObjects(cachedMeshes, false);
    const occ = hits.length > 0 && hits[0].distance < dist - 0.5;
    if (occ && hits[0]?.object) {
      fadeOccluder(hits[0].object);
    }
    labelEls[i].style.opacity = '1';
  });
}

/* ═══════════════════════════════════════════
   Camera Fly-To Animation
   ═══════════════════════════════════════════ */
let flyAnim = null;

function flyToOrganelle(targetPos) {
  const diff = targetPos.clone().sub(controls.target);
  const dir = diff.length() > 0.001
    ? diff.normalize()
    : new THREE.Vector3(0, 0.5, 1).normalize();
  const camDest = targetPos.clone().add(
    dir.multiplyScalar(camera.position.distanceTo(controls.target) * 0.3)
  );
  camDest.y += 0.3;

  const startPos    = camera.position.clone();
  const startTarget = controls.target.clone();
  const startTime   = performance.now();
  const duration    = 800;

  if (flyAnim) cancelAnimationFrame(flyAnim);

  function step() {
    const elapsed = performance.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    const ease = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;

    camera.position.lerpVectors(startPos, camDest, ease);
    controls.target.lerpVectors(startTarget, targetPos, ease);
    controls.update();

    if (t < 1) flyAnim = requestAnimationFrame(step);
    else flyAnim = null;
  }
  step();
}

/* ═══════════════════════════════════════════
   Info Popup
   ═══════════════════════════════════════════ */
function showInfo(o) {
  const popup = document.getElementById('info-popup');
  popup.style.setProperty('--popup-color', o.color);
  document.getElementById('popup-accent').style.background = o.color;
  document.getElementById('popup-icon').textContent = o.icon;
  document.getElementById('popup-num').textContent  = '#' + o.num;
  document.getElementById('popup-name').textContent = o.name;
  document.getElementById('popup-sub').textContent  = o.sub;
  document.getElementById('popup-desc').textContent = o.desc;
  document.getElementById('popup-detail').innerHTML =
    o.detail.map(d => '<li>' + d + '</li>').join('');
  popup.classList.add('visible');
}

function closeInfo() {
  document.getElementById('info-popup').classList.remove('visible');
}

/* ═══════════════════════════════════════════
   Toolbar / Settings Functions
   ═══════════════════════════════════════════ */
function toggleLabels() {
  labelsVisible = !labelsVisible;
  syncLabelVisibility();
  document.getElementById('btn-labels').classList.toggle('active', labelsVisible);
}

function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  const willOpen = !panel.classList.contains('open');
  panel.classList.toggle('open', willOpen);
  panel.classList.toggle('hidden', !willOpen);
  document.getElementById('btn-settings').classList.toggle('active', willOpen);
}

function setSettingsPanelOpen(isOpen) {
  const panel = document.getElementById('settingsPanel');
  panel.classList.toggle('open', isOpen);
  panel.classList.toggle('hidden', !isOpen);
  document.getElementById('btn-settings').classList.toggle('active', isOpen);
}

function resetCamera() {
  if (!initCamPos) return;
  camera.position.copy(initCamPos);
  controls.target.copy(initTarget);
  controls.update();
  requestRender();
}

function focusOrganelle(num) {
  const o = ORGANELLES.find(x => x.num === num);
  if (!o) return;
  const anchorPos = labelAnchorByNum.get(num);
  const obj = meshMap[o.modelId];
  if (anchorPos) {
    showInfo(o);
    flyToOrganelle(anchorPos.clone());
    return;
  }
  if (obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    showInfo(o);
    flyToOrganelle(center);
  }
}

/* ── Lighting sliders ── */
function setAmbient(v) {
  hemiLight.intensity = +v;
  document.getElementById('v-amb').textContent = (+v).toFixed(2);
  requestRender();
}
function setDirectional(v) {
  keyLight.intensity = +v;
  document.getElementById('v-dir').textContent = (+v).toFixed(2);
  requestRender();
}
function setEnv(v) {
  renderer.toneMappingExposure = +v;
  document.getElementById('v-env').textContent = (+v).toFixed(2);
  requestRender();
}

function toggleLayer(id) {
  if (meshMap[id] === undefined) return;
  layerVisible[id] = !layerVisible[id];
  if (meshMap[id]) meshMap[id].visible = layerVisible[id];
  syncLabelVisibility();
  const row = document.getElementById('sp-layer-' + id);
  if (row) row.classList.toggle('active', layerVisible[id]);
  requestRender();
}

function updateLabelTuneUI() {
  if (!tuneUI) return;
  const arr = ensureAnchorForModel(selectedTuneModelId);
  const org = ORGANELLES.find(o => o.modelId === selectedTuneModelId);

  tuneUI.select.value = String(selectedTuneModelId);
  tuneUI.status.textContent = org
    ? `Target: ${org.icon} ${org.name} (model_${selectedTuneModelId})`
    : `Target: model_${selectedTuneModelId}`;

  tuneUI.x.value = String(arr[0]);
  tuneUI.y.value = String(arr[1]);
  tuneUI.z.value = String(arr[2]);
  tuneUI.xVal.textContent = Number(arr[0]).toFixed(3);
  tuneUI.yVal.textContent = Number(arr[1]).toFixed(3);
  tuneUI.zVal.textContent = Number(arr[2]).toFixed(3);
  tuneUI.guides.checked = !!LABEL_LOCATION_CONFIG.showGuideLines;
}

function applyAxisFromSlider(axisIndex, rawValue) {
  if (!isLabelEditingEnabled()) return;
  const arr = ensureAnchorForModel(selectedTuneModelId);
  arr[axisIndex] = clamp(Number(rawValue), -2, 2);
  updateAllLabelPositions();
}

function syncLabelTuningAvailability() {
  const section = document.getElementById('sp-label-tune');

  if (!isLabelEditingEnabled()) {
    if (dragTuneState.active) stopLabelAnchorDrag();
    if (section) section.remove();
    tuneUI = null;
    labelEls.forEach(el => el.classList.remove('tune-active'));
    return;
  }

  if (!section) {
    buildLabelTuneSection();
    return;
  }

  updateLabelTuneUI();
}

function buildLabelTuneSection() {
  if (!isLabelEditingEnabled()) return;
  const settingsPanel = document.getElementById('settingsPanel');
  if (!settingsPanel || document.getElementById('sp-label-tune')) return;

  const section = document.createElement('div');
  section.className = 'sp-section';
  section.id = 'sp-label-tune';

  const options = MODELS.map(m => {
    const org = ORGANELLES.find(o => o.modelId === m.id);
    const label = org ? `${org.icon} ${org.name} (model_${m.id})` : `${m.name} (model_${m.id})`;
    return `<option value="${m.id}">${label}</option>`;
  }).join('');

  section.innerHTML = `
    <h3>🧭 Label Tuning</h3>
    <div class="sp-slider">
      <label for="tune-model">Target Model</label>
      <select id="tune-model" class="sp-input">${options}</select>
      <div class="sp-note" id="tune-status"></div>
    </div>
    <div class="sp-slider">
      <label>X Offset <span id="tune-x-val">0.000</span></label>
      <input id="tune-x" type="range" min="-2" max="2" step="0.002">
    </div>
    <div class="sp-slider">
      <label>Y Offset <span id="tune-y-val">0.000</span></label>
      <input id="tune-y" type="range" min="-2" max="2" step="0.002">
    </div>
    <div class="sp-slider">
      <label>Z Offset <span id="tune-z-val">0.000</span></label>
      <input id="tune-z" type="range" min="-2" max="2" step="0.002">
    </div>
    <div class="sp-switch-row">
      <label><input type="checkbox" id="tune-guides"> Tampilkan garis bantu</label>
    </div>
    <div class="sp-btns">
      <button class="sp-btn sp-btn-outline" id="btn-tune-save-local">💾 Save (browser)</button>
      <button class="sp-btn sp-btn-outline" id="btn-tune-download-json">⬇️ Download conf.json</button>
      <button class="sp-btn sp-btn-outline" id="btn-tune-upload-json">⬆️ Load conf.json</button>
    </div>
    <input id="tune-upload-input" type="file" accept="application/json,.json" style="display:none;">
  `;

  settingsPanel.appendChild(section);

  tuneUI = {
    section,
    select: section.querySelector('#tune-model'),
    status: section.querySelector('#tune-status'),
    x: section.querySelector('#tune-x'),
    y: section.querySelector('#tune-y'),
    z: section.querySelector('#tune-z'),
    xVal: section.querySelector('#tune-x-val'),
    yVal: section.querySelector('#tune-y-val'),
    zVal: section.querySelector('#tune-z-val'),
    guides: section.querySelector('#tune-guides'),
    saveLocalBtn: section.querySelector('#btn-tune-save-local'),
    downloadBtn: section.querySelector('#btn-tune-download-json'),
    uploadBtn: section.querySelector('#btn-tune-upload-json'),
    uploadInput: section.querySelector('#tune-upload-input'),
  };

  tuneUI.select.addEventListener('change', () => {
    setSelectedTuneModel(Number(tuneUI.select.value));
  });
  tuneUI.x.addEventListener('input', () => applyAxisFromSlider(0, tuneUI.x.value));
  tuneUI.y.addEventListener('input', () => applyAxisFromSlider(1, tuneUI.y.value));
  tuneUI.z.addEventListener('input', () => applyAxisFromSlider(2, tuneUI.z.value));

  tuneUI.guides.addEventListener('change', () => {
    LABEL_LOCATION_CONFIG.showGuideLines = tuneUI.guides.checked;
    rebuildLabelGuideLines();
    saveLabelConfigToLocalStorage();
    requestRender();
  });

  tuneUI.saveLocalBtn.addEventListener('click', () => {
    saveLabelConfigToLocalStorage();
    tuneUI.status.textContent = 'Tersimpan ke browser localStorage.';
  });

  tuneUI.downloadBtn.addEventListener('click', () => {
    downloadCurrentLabelConfig();
    tuneUI.status.textContent = 'conf.json berhasil di-download.';
  });

  tuneUI.uploadBtn.addEventListener('click', () => {
    tuneUI.uploadInput.click();
  });

  tuneUI.uploadInput.addEventListener('change', async () => {
    const file = tuneUI.uploadInput.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!applyLabelConfig(data)) throw new Error('Format conf.json tidak valid');
      saveLabelConfigToLocalStorage();
      updateAllLabelPositions();
      syncLabelTuningAvailability();
      if (tuneUI?.status) {
        tuneUI.status.textContent = `Loaded: ${file.name}`;
      }
    } catch (err) {
      console.warn(err);
      if (tuneUI?.status) {
        tuneUI.status.textContent = 'Gagal load conf.json.';
      }
    } finally {
      if (tuneUI?.uploadInput) {
        tuneUI.uploadInput.value = '';
      }
    }
  });

  updateLabelTuneUI();
}

/* ═══════════════════════════════════════════
   Build Settings Panel UI
   ═══════════════════════════════════════════ */
const layerList = document.getElementById('layer-list');
MODELS.forEach(def => {
  const hex = '#' + def.color.toString(16).padStart(6, '0');
  const div = document.createElement('div');
  div.className = 'sp-layer active';
  div.id = 'sp-layer-' + def.id;
  div.innerHTML = `<div class="sp-dot" style="background:${hex}"></div>${def.name}<div class="sp-check">&#x2713;</div>`;
  div.addEventListener('click', () => toggleLayer(def.id));
  layerList.appendChild(div);
});

const orgTags = document.getElementById('org-tags');
ORGANELLES.forEach(o => {
  const btn = document.createElement('button');
  btn.className = 'sp-tag';
  btn.textContent = `${o.icon} ${o.name}`;
  btn.addEventListener('click', () => focusOrganelle(o.num));
  orgTags.appendChild(btn);
});

buildLabelTuneSection();

syncLabelTuningAvailability();

/* ═══════════════════════════════════════════
   Resize
   ═══════════════════════════════════════════ */
function resize() {
  const w = viewWrap.clientWidth, h = viewWrap.clientHeight;
  if (w === 0 || h === 0) return;
  renderer.setSize(w, h);
  if (composer) composer.setSize(w, h);
  labelRenderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
new ResizeObserver(resize).observe(viewWrap);
resize();
requestAnimationFrame(() => { resize(); requestAnimationFrame(resize); });

/* ═══════════════════════════════════════════
   Animation Loop
   ═══════════════════════════════════════════ */
setInterval(() => { updateLabelOcclusion(); }, PERF.labelOcclusionIntervalMs);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (needsRender) {
    needsRender = false;
    if (composer) composer.render();
    else renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }
}
animate();

/* Close settings panel when clicking on canvas */
canvas.addEventListener('click', () => {
  const sp = document.getElementById('settingsPanel');
  if (sp.classList.contains('open') || !sp.classList.contains('hidden')) {
    sp.classList.remove('open');
    sp.classList.add('hidden');
    document.getElementById('btn-settings').classList.remove('active');
  }
});

window.addEventListener('pointermove', onLabelAnchorDragMove);
window.addEventListener('pointerup', stopLabelAnchorDrag);
window.addEventListener('pointercancel', stopLabelAnchorDrag);

/* Expose functions to inline HTML onclick handlers */
Object.assign(window, {
  toggleLabels, toggleSettings,
  resetCamera, focusOrganelle, closeInfo, toggleLayer,
  setAmbient, setDirectional, setEnv
});
