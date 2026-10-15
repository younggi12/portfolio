// 첫 화면 3D "YG" — Three.js (이 파일은 첫 화면에서만 따로 불러옴: 처음 여는 속도에 영향 없게)
// 이야기: "디자인을 코드로, 화면을 경험으로"
// - 처음엔 하늘색 반투명 덩어리(= 코드 · 시제품), 스크롤하면 검은 크롬 덩어리(= 화면)로 채워짐
// - 마우스를 따라 천천히 기울고, 스크롤하는 동안 반 바퀴 가까이 돎
// - 화면에 안 보이면 그리기를 멈춤 (배터리 · 성능)
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { YG_PATH } from "./ygPath";

const FOLLOW = 0.06;      // 마우스 · 스크롤을 따라가는 정도 (작을수록 묵직하게)
const TILT_X = 0.35;      // 마우스 위아래로 기우는 최대 각도(rad)
const TILT_Y = 0.6;       // 마우스 좌우로 도는 최대 각도(rad)
const SCROLL_TURN = 1.2;  // 첫 화면을 다 지나갈 때까지 도는 각도(rad)
const FILL_END = 0.7;     // 스크롤 진행 이 지점에서 면이 다 채워짐 (0~1)
const CAMERA_Z = 360;     // 카메라 거리 (작을수록 YG가 크게)

export const createHeroScene = (canvas, { reduced = false } = {}) => {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envMap; // 크롬 반사는 방 조명 환경에서

  const camera = new PerspectiveCamera(30, 1, 1, 2000);
  camera.position.set(0, 0, CAMERA_Z);

  // 글자 모양 → 두께 있는 덩어리 (모서리 깎기 = 빛이 맺히는 테두리)
  const shapes = new SVGLoader()
    .parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${YG_PATH}"/></svg>`)
    .paths.flatMap((path) => SVGLoader.createShapes(path));
  const geometry = new ExtrudeGeometry(shapes, {
    depth: 26,
    bevelEnabled: true,
    bevelThickness: 4,
    bevelSize: 2.6,
    bevelSegments: 6,
    curveSegments: 16,
  });
  geometry.computeBoundingBox();
  const center = new Box3().copy(geometry.boundingBox).getCenter(new Vector3());
  geometry.translate(-center.x, -center.y, -center.z);

  // 면(= 화면) — 검은 크롬, 처음엔 투명
  const material = new MeshPhysicalMaterial({
    color: new Color("#151515"),
    metalness: 1,
    roughness: 0.14,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    transparent: true,
    opacity: 0,
  });
  const mesh = new Mesh(geometry, material);

  // 처음 모습 — 하늘색($color-panel-soft) 반투명 덩어리, 채워질수록 사라짐
  const GHOST_OPACITY = 0.6; // 테두리 선이 없어 흰 바탕에서 묻히지 않게 조금 진하게
  const ghostMaterial = new MeshPhysicalMaterial({
    color: new Color("#BDDDFC"),
    metalness: 0,
    roughness: 0.2,
    clearcoat: 1,
    transparent: true,
    opacity: GHOST_OPACITY,
  });
  const ghost = new Mesh(geometry, ghostMaterial);

  const group = new Group();
  group.add(ghost, mesh);
  group.scale.y = -1; // SVG는 y가 아래로 + → 뒤집어 바로 세움
  scene.add(group);

  const rim = new DirectionalLight("#ffffff", 2.2);
  rim.position.set(-200, 260, -120);
  scene.add(rim);
  const key = new DirectionalLight("#dfe9f5", 1.2);
  key.position.set(260, 80, 300);
  scene.add(key);

  // 상태 — 목표값을 정하면 매 프레임 조금씩 따라감
  const state = { mx: 0, my: 0, scroll: 0, rx: 0.12, ry: -0.35, fill: 0 };
  let frame = 0;
  let visible = true;
  const start = performance.now();

  const applyFill = (fill) => {
    material.opacity = fill;
    mesh.visible = fill > 0.01;
    ghostMaterial.opacity = GHOST_OPACITY * (1 - fill);
    ghost.visible = fill < 0.99;
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 1 ? CAMERA_Z / (w / h) : CAMERA_Z; // 좁은 화면은 잘리지 않게 뒤로
    camera.updateProjectionMatrix();
    if (reduced) renderer.render(scene, camera);
  };

  const tick = (now) => {
    frame = 0;
    if (!visible) return;
    const t = (now - start) / 1000;
    const targetRx = 0.12 + state.my * TILT_X + Math.sin(t * 0.6) * 0.04;
    const targetRy = -0.35 + state.mx * TILT_Y + state.scroll * SCROLL_TURN + Math.sin(t * 0.4) * 0.06;
    state.rx += (targetRx - state.rx) * FOLLOW;
    state.ry += (targetRy - state.ry) * FOLLOW;
    state.fill += (Math.min(1, state.scroll / FILL_END) - state.fill) * 0.1;
    group.rotation.set(state.rx, state.ry, 0);
    applyFill(state.fill);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };

  const play = () => { if (!reduced && !frame && visible) frame = requestAnimationFrame(tick); };

  resize();
  if (reduced) {
    // 동작 줄이기: 다 채워진 한 장면
    group.rotation.set(0.12, -0.35, 0);
    applyFill(1);
    renderer.render(scene, camera);
  } else {
    play();
  }

  return {
    // 마우스 위치 (-1 ~ 1)
    pointer(x, y) { state.mx = x; state.my = y; },
    // 첫 화면 스크롤 진행 (0 ~ 1)
    scroll(p) { state.scroll = p; },
    setVisible(v) { visible = v; if (v) play(); },
    resize,
    dispose() {
      cancelAnimationFrame(frame);
      geometry.dispose();
      material.dispose();
      ghostMaterial.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
};
