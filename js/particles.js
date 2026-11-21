// 이미지/텍스트를 입자(포인트 클라우드)로 분해해 그리는 WebGL 장면.
// 챕터가 바뀌면 입자들이 흩어졌다가 다음 형태로 다시 모입니다.
import * as THREE from 'three';

const PALETTE = ['#efe6da', '#b9c9a4', '#c9a9c4', '#9fb4c7', '#e3c7a8'].map((c) => new THREE.Color(c));

const VERT = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aColorFrom;
  attribute vec3 aColorTo;
  attribute float aRand;
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uScatter;
  uniform float uDrift;
  uniform float uFocus;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // 입자마다 출발 시점을 조금씩 어긋나게 해서 한꺼번에 움직이지 않게 함
    float p = clamp(uProgress * 1.5 - aRand * 0.5, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);
    vec3 pos = mix(aFrom, aTo, p);

    // 전환 중간에 바깥으로 흩어짐
    float burst = sin(p * 3.14159);
    vec3 dir = normalize(vec3(sin(aRand * 91.7), cos(aRand * 57.3), sin(aRand * 13.1) * 1.5));
    pos += dir * burst * uScatter;

    // 잔잔한 흔들림
    pos.x += sin(uTime * 0.31 + aRand * 40.0) * 0.012 * uDrift;
    pos.y += cos(uTime * 0.27 + aRand * 31.0) * 0.012 * uDrift;
    pos.z += sin(uTime * 0.19 + aRand * 23.0) * 0.03 * uDrift;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float s = uSize * (0.35 + pow(fract(aRand * 13.37), 3.0) * 1.6);
    gl_PointSize = s * uPixelRatio / -mv.z;

    vColor = mix(aColorFrom, aColorTo, p);
    vAlpha = 0.45 + 0.55 * fract(aRand * 7.31);

    // 화면 가운데(제목 자리)의 입자는 흐리게 해서 제목이 묻히지 않게
    vec2 ndc = gl_Position.xy / gl_Position.w;
    float e = length((ndc - vec2(0.0, -0.04)) * vec2(1.6, 3.4));
    vAlpha *= mix(1.0, mix(0.16, 1.0, smoothstep(0.35, 1.1, e)), uFocus);
  }
`;

const FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.18, d);
    gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
  }
`;

const rand = mulberry32(7);

export class ParticleStage {
  constructor(canvas, { count, reducedMotion = false } = {}) {
    this.count = count;
    this.reducedMotion = reducedMotion;
    this.cache = new Map();
    this.pointer = { x: 0, y: 0 };
    this.cam = { x: 0, y: 0, z: 5.2 };
    this.camTarget = { z: 5.2 };
    this.opacityTarget = 1;
    this.anim = null;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, this.cam.z);

    this.points = this.#createPoints(count);
    this.scene.add(this.points);
    this.dust = this.#createDust(Math.round(count * 0.06));
    this.scene.add(this.dust);

    // 처음에는 공중에 흩어진 먼지 구름 상태
    const cloud = cloudShape(count);
    this.#setAttr('aFrom', cloud.positions);
    this.#setAttr('aTo', cloud.positions);
    this.#setAttr('aColorFrom', cloud.colors);
    this.#setAttr('aColorTo', cloud.colors);

    this.#resize();
    window.addEventListener('resize', () => this.#resize());
    window.addEventListener('pointermove', (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    this.clock = new THREE.Clock();
    this.renderer.setAnimationLoop(() => this.#tick());
  }

  /** visual: { image } | { text } | null(먼지 구름) */
  async show(visual) {
    const target = visual ? await this.#sample(visual) : cloudShape(this.count);
    const attr = this.points.geometry.attributes;
    const u = this.points.material.uniforms;

    // 전환 도중이면 현재 보이는 위치에서 다시 출발
    const p = u.uProgress.value;
    if (p > 0 && p < 1) {
      blendInto(attr.aFrom.array, attr.aTo.array, p);
      blendInto(attr.aColorFrom.array, attr.aColorTo.array, p);
    } else {
      attr.aFrom.array.set(attr.aTo.array);
      attr.aColorFrom.array.set(attr.aColorTo.array);
    }
    attr.aTo.array.set(target.positions);
    attr.aColorTo.array.set(target.colors);
    for (const k of ['aFrom', 'aTo', 'aColorFrom', 'aColorTo']) attr[k].needsUpdate = true;

    u.uProgress.value = 0;
    this.anim = { start: performance.now(), duration: this.reducedMotion ? 1 : 2200 };
  }

  /** 'browse' | 'detail' | 'gate' */
  setMode(mode) {
    this.opacityTarget = mode === 'detail' ? 0.28 : 1;
    this.focusTarget = mode === 'browse' ? 1 : 0;
    this.camTarget.z = mode === 'detail' ? 4.3 : mode === 'gate' ? 6.2 : 5.2;
  }

  async preload(visuals) {
    for (const v of visuals) {
      try { await this.#sample(v); } catch { /* 무시: 실제 표시 때 다시 시도 */ }
    }
  }

  // ---------------------------------------------------------------

  #createPoints(n) {
    const g = new THREE.BufferGeometry();
    for (const k of ['aFrom', 'aTo', 'aColorFrom', 'aColorTo']) {
      g.setAttribute(k, new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    }
    const r = new Float32Array(n);
    for (let i = 0; i < n; i++) r[i] = rand();
    g.setAttribute('aRand', new THREE.BufferAttribute(r, 1));
    // three.js는 position 속성이 있어야 그리므로 자리만 채움
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50);

    const m = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uProgress: { value: 1 },
        uTime: { value: 0 },
        uSize: { value: 26 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uScatter: { value: 0.9 },
        uDrift: { value: this.reducedMotion ? 0 : 1 },
        uOpacity: { value: 1 },
        uFocus: { value: 0 },
      },
    });
    return new THREE.Points(g, m);
  }

  #createDust(n) {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (rand() - 0.5) * 12;
      pos[i * 3 + 1] = (rand() - 0.5) * 7;
      pos[i * 3 + 2] = (rand() - 0.5) * 6;
      const c = PALETTE[i % PALETTE.length];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const m = new THREE.PointsMaterial({
      size: 0.022, vertexColors: true, transparent: true, opacity: 0.45, depthWrite: false,
      map: dotTexture(), alphaTest: 0.01,
    });
    return new THREE.Points(g, m);
  }

  #setAttr(name, arr) {
    const a = this.points.geometry.attributes[name];
    a.array.set(arr);
    a.needsUpdate = true;
  }

  #resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // 화면이 좁으면 카메라를 뒤로 빼서 장면이 잘리지 않게
    this.fitScale = Math.max(1, 1.45 / (w / h));
    this.camera.updateProjectionMatrix();
    this.points.material.uniforms.uPixelRatio.value = this.renderer.getPixelRatio() * Math.min(1.25, Math.max(0.7, h / 800));
  }

  #tick() {
    const t = this.clock.getElapsedTime();
    const u = this.points.material.uniforms;
    u.uTime.value = t;

    if (this.anim) {
      const k = Math.min(1, (performance.now() - this.anim.start) / this.anim.duration);
      u.uProgress.value = k;
      if (k >= 1) this.anim = null;
    }
    u.uOpacity.value += (this.opacityTarget - u.uOpacity.value) * 0.05;
    u.uFocus.value += ((this.focusTarget ?? 0) - u.uFocus.value) * 0.05;

    // 마우스 시차 + 느린 자동 회전
    const drift = this.reducedMotion ? 0 : 1;
    const tx = this.pointer.x * 0.55 * drift + Math.sin(t * 0.07) * 0.35 * drift;
    const ty = -this.pointer.y * 0.3 * drift + Math.sin(t * 0.05) * 0.12 * drift;
    this.cam.x += (tx - this.cam.x) * 0.03;
    this.cam.y += (ty - this.cam.y) * 0.03;
    this.cam.z += (this.camTarget.z * this.fitScale - this.cam.z) * 0.04;
    this.camera.position.set(this.cam.x, this.cam.y, this.cam.z);
    this.camera.lookAt(0, 0, 0);

    this.dust.rotation.y = t * 0.01 * drift;
    this.dust.position.y = Math.sin(t * 0.1) * 0.1 * drift;

    this.renderer.render(this.scene, this.camera);
  }

  async #sample(visual) {
    const key = visual.image || (visual.draw ? `draw:${visual.draw}` : `text:${visual.text}`);
    if (this.cache.has(key)) return this.cache.get(key);
    let result;
    if (visual.image) result = sampleImage(await loadImage(visual.image), this.count);
    else if (visual.draw) result = sampleText(drawShape(visual.draw), this.count);
    else result = sampleText(await textCanvas(visual.text), this.count);
    this.cache.set(key, result);
    return result;
  }
}

// ---------------------------------------------------------------
// 샘플링

/** 사진/화면: 윤곽(밝기 변화)이 큰 곳에 입자를 더 많이 뿌려 스캔한 듯한 느낌을 냄 */
function sampleImage(img, n) {
  const maxDim = 360;
  const scale = maxDim / Math.max(img.naturalWidth, img.naturalHeight);
  const w = Math.max(2, Math.round(img.naturalWidth * scale));
  const h = Math.max(2, Math.round(img.naturalHeight * scale));
  const ctx = makeCanvas(w, h).getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    lum[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
  }
  const weight = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const gx = lum[y * w + Math.min(w - 1, x + 1)] - lum[y * w + Math.max(0, x - 1)];
      const gy = lum[Math.min(h - 1, y + 1) * w + x] - lum[Math.max(0, y - 1) * w + x];
      const edge = Math.min(1, Math.hypot(gx, gy) * 3);
      // 아주 밝고 평평한 영역(흰 배경, 하늘)은 거의 뽑지 않음
      const flatBright = lum[i] > 0.85 && edge < 0.06 ? 0.1 : 1;
      // 가장자리로 갈수록 옅어지게 해서 사각형 테두리가 드러나지 않게
      const border = Math.min(1, Math.min(x, w - 1 - x) / (w * 0.14), Math.min(y, h - 1 - y) / (h * 0.14));
      weight[i] = (0.006 + edge * edge * 3 + lum[i] * 0.02) * flatBright * border * border;
    }
  }

  const aspect = w / h;
  const H = Math.min(3.4, 6.2 / aspect);
  const W = H * aspect;
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const pick = weightedPicker(weight);
  const tmp = new THREE.Color();

  for (let k = 0; k < n; k++) {
    const i = pick();
    const x = i % w, y = (i / w) | 0;
    const l = lum[i];
    positions[k * 3] = ((x + rand()) / w - 0.5) * W;
    positions[k * 3 + 1] = -((y + rand()) / h - 0.5) * H;
    positions[k * 3 + 2] = (l - 0.5) * 0.9 + gauss() * 0.18;

    tmp.setRGB(data[i * 4] / 255, data[i * 4 + 1] / 255, data[i * 4 + 2] / 255);
    // 원래 색을 살리되 배경(어두운 색) 위에서 보이도록 밝기를 끌어올리고 팔레트 쪽으로 살짝 당김
    tmp.lerp(PALETTE[k % PALETTE.length], 0.35);
    const hsl = {};
    tmp.getHSL(hsl);
    tmp.setHSL(hsl.h, Math.min(hsl.s, 0.45), Math.max(0.5, Math.min(0.88, hsl.l)));
    colors[k * 3] = tmp.r; colors[k * 3 + 1] = tmp.g; colors[k * 3 + 2] = tmp.b;
  }
  return { positions, colors };
}

/** 글자 모양을 따라 입자를 뿌림 */
function sampleText(canvas, n) {
  const { width: w, height: h } = canvas;
  const data = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
  const weight = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) weight[i] = data[i * 4] / 255 + 0.0015;

  const aspect = w / h;
  const H = Math.min(3.0, 6.0 / aspect);
  const W = H * aspect;
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const pick = weightedPicker(weight);
  for (let k = 0; k < n; k++) {
    const i = pick();
    const x = i % w, y = (i / w) | 0;
    const inside = data[i * 4] > 40;
    positions[k * 3] = ((x + rand()) / w - 0.5) * W;
    positions[k * 3 + 1] = -((y + rand()) / h - 0.5) * H;
    positions[k * 3 + 2] = inside ? gauss() * 0.12 : gauss() * 1.4;
    const c = PALETTE[(k * 7) % PALETTE.length];
    colors[k * 3] = c.r; colors[k * 3 + 1] = c.g; colors[k * 3 + 2] = c.b;
  }
  return { positions, colors };
}

/** 넓게 퍼진 구름 (첫 화면) */
function cloudShape(n) {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  for (let k = 0; k < n; k++) {
    // 가운데(글자 자리)는 비워 둔 타원형 고리
    const r = 2.3 + Math.pow(rand(), 0.7) * 4.2;
    const th = rand() * Math.PI * 2;
    positions[k * 3] = r * Math.cos(th) * 1.35;
    positions[k * 3 + 1] = r * Math.sin(th) * 0.75;
    positions[k * 3 + 2] = gauss() * 1.2 - 1.2;
    const c = PALETTE[k % PALETTE.length];
    colors[k * 3] = c.r; colors[k * 3 + 1] = c.g; colors[k * 3 + 2] = c.b;
  }
  return { positions, colors };
}

// ---------------------------------------------------------------
// 선 그림 (가운데 제목 자리는 비워 두도록 배치)

const SHAPES = {
  // 대화 말풍선: 위쪽은 챗봇 답변, 아래쪽은 사용자 질문
  chat(ctx) {
    ctx.lineWidth = 10;
    bubble(ctx, 90, 40, 640, 250, 40, 'left');
    bubble(ctx, 530, 480, 590, 190, 40, 'right');
    ctx.lineWidth = 16;
    line(ctx, 160, 110, 620, 110);
    line(ctx, 160, 170, 660, 170);
    line(ctx, 160, 230, 470, 230);
    line(ctx, 600, 545, 1050, 545);
    line(ctx, 600, 605, 880, 605);
    // 입력 중 표시
    for (const x of [175, 215, 255]) dot(ctx, x, 360, 11);
  },
  // 은행 건물: 박공지붕, 기둥, 계단
  bank(ctx) {
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(190, 235); ctx.lineTo(600, 50); ctx.lineTo(1010, 235); ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fill(); ctx.stroke();
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(290, 210); ctx.lineTo(600, 85); ctx.lineTo(910, 210); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(600, 165, 30, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 10;
    box(ctx, 180, 235, 840, 50, 0.2);
    for (let i = 0; i < 6; i++) {
      const x = 265 + i * 134;
      box(ctx, x - 36, 295, 72, 18, 0.3);
      ctx.lineWidth = 6;
      box(ctx, x - 24, 313, 48, 290, 0.08);
      ctx.lineWidth = 3;
      line(ctx, x - 8, 325, x - 8, 590);
      line(ctx, x + 8, 325, x + 8, 590);
      ctx.lineWidth = 10;
      box(ctx, x - 36, 603, 72, 16, 0.3);
    }
    box(ctx, 160, 625, 880, 24, 0.2);
    box(ctx, 130, 655, 940, 24, 0.2);
    box(ctx, 100, 685, 1000, 26, 0.2);
  },
};

function drawShape(name) {
  const c = makeCanvas(1200, 760);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  (SHAPES[name] || SHAPES.chat)(ctx);
  return c;
}

function bubble(ctx, x, y, w, h, r, tail) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  if (tail === 'left') { ctx.moveTo(x + 70, y + h); ctx.lineTo(x + 30, y + h + 60); ctx.lineTo(x + 150, y + h); }
  else { ctx.moveTo(x + w - 70, y + h); ctx.lineTo(x + w - 30, y + h + 60); ctx.lineTo(x + w - 150, y + h); }
  ctx.stroke();
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}

function dot(ctx, x, y, r) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
}

function box(ctx, x, y, w, h, fill) {
  ctx.fillStyle = `rgba(255,255,255,${fill})`;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
}

// ---------------------------------------------------------------
// 유틸

async function textCanvas(text) {
  const family = '"Cormorant Garamond", "Noto Serif KR", serif';
  try { await document.fonts.load(`500 200px ${family}`, text); } catch { /* 기본 글꼴 사용 */ }
  const fontSize = 220;
  const probe = makeCanvas(10, 10).getContext('2d');
  probe.font = `500 ${fontSize}px ${family}`;
  const tw = Math.ceil(probe.measureText(text).width);
  const w = Math.max(tw + 120, 420);
  const h = 340;
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.font = `500 ${fontSize}px ${family}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2 + 10);
  return c;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function weightedPicker(weight) {
  const cdf = new Float32Array(weight.length);
  let sum = 0;
  for (let i = 0; i < weight.length; i++) { sum += weight[i]; cdf[i] = sum; }
  return () => {
    const r = rand() * sum;
    let lo = 0, hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1; else hi = mid;
    }
    return lo;
  };
}

function blendInto(from, to, p) {
  for (let i = 0; i < from.length; i++) from[i] += (to[i] - from[i]) * p;
}

function gauss() {
  return Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
}

function dotTexture() {
  const c = makeCanvas(32, 32);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.6)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
