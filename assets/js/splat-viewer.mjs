// Gaussian splat viewer for one note page. It loads nothing until the reader asks for it.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";

// The walk file is in a levelled frame with Z up. three.js uses Y up.
const Z_UP_TO_Y_UP = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
const toThree = (p) => new THREE.Vector3(p[0], p[2], -p[1]);
const MB = (bytes) => (bytes / 1e6).toFixed(0);

function setup(root) {
  const stage = root.querySelector("[data-splat-stage]");
  const status = root.querySelector("[data-splat-status]");
  const loadButton = root.querySelector("[data-splat-load]");
  const controlsBar = root.querySelector("[data-splat-controls]");
  const buttons = {
    walk: root.querySelector("[data-splat-walk]"),
    reset: root.querySelector("[data-splat-reset]"),
    path: root.querySelector("[data-splat-path]"),
    raw: root.querySelector("[data-splat-raw]"),
  };
  let state = null;

  const say = (text) => {
    status.textContent = text;
  };

  async function start() {
    loadButton.disabled = true;
    say("Loading the viewer.");
    let walk;
    try {
      walk = await (await fetch(root.dataset.walk)).json();
    } catch {
      say("The walk file did not load. Reload the page to try again.");
      loadButton.disabled = false;
      return;
    }
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    if (!renderer.capabilities.isWebGL2) {
      say("This browser does not support WebGL 2, so the 3D view cannot open.");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x120f0d);
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute("aria-label", root.dataset.label);
    stage.replaceChildren(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(walk.bird.fov, 1, 0.01, 200);
    scene.add(new SparkRenderer({ renderer }));

    const level = new THREE.Matrix4().set(...walk.matrix.flat());
    const placement = Z_UP_TO_Y_UP.clone().multiply(level);
    const points = walk.path.map(toThree);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0xf2c14e }),
    );
    scene.add(line);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const home = () => {
      camera.position.copy(toThree(walk.bird.position));
      controls.target.copy(toThree(walk.bird.target));
      controls.update();
    };
    home();

    const fit = () => {
      const { width, height } = stage.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    new ResizeObserver(fit).observe(stage);
    fit();

    const curve = new THREE.CatmullRomCurve3(points);
    const walkSeconds = walk.path.length / walk.fps;
    let walking = null;

    renderer.setAnimationLoop((time) => {
      if (walking !== null) {
        // getPoint follows the camera positions in order, so the walk keeps the video's pace.
        // The eye stops short of the end, so the view keeps a target ahead of it.
        const t = Math.min((time - walking) / 1000 / walkSeconds, 1);
        camera.position.copy(curve.getPoint(t * 0.96));
        controls.target.copy(curve.getPoint(t * 0.96 + 0.04));
        if (t >= 1) {
          stopWalk("The walk is over. Drag to look around, or reset the view.");
        }
      }
      controls.update();
      renderer.render(scene, camera);
    });

    const stopWalk = (message) => {
      walking = null;
      controls.enabled = true;
      buttons.walk.textContent = "Walk the path";
      buttons.walk.setAttribute("aria-pressed", "false");
      if (message) say(message);
    };

    state = { scene, placement, meshes: {}, line, controls, home, stopWalk, startWalk: () => {
      walking = performance.now();
      controls.enabled = false;
      buttons.walk.textContent = "Stop the walk";
      buttons.walk.setAttribute("aria-pressed", "true");
      say(`Walking the path at the camera's pace: ${Math.round(walkSeconds)} seconds.`);
    }, isWalking: () => walking !== null };

    root.classList.add("is-live");
    await show("clean");
    loadButton.parentElement.hidden = true;
    controlsBar.hidden = false;
  }

  function load(kind) {
    const url = kind === "raw" ? root.dataset.srcRaw : root.dataset.src;
    const mesh = new SplatMesh({
      url,
      onProgress: (event) => {
        if (event.lengthComputable) {
          say(`Loading the splat: ${MB(event.loaded)} of ${MB(event.total)} MB.`);
        }
      },
    });
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(state.placement);
    state.scene.add(mesh);
    state.meshes[kind] = mesh;
    return mesh.initialized;
  }

  async function show(kind) {
    const other = kind === "raw" ? "clean" : "raw";
    if (!state.meshes[kind]) {
      buttons.raw.disabled = true;
      try {
        await load(kind);
      } catch {
        say("The splat did not load. Reload the page to try again.");
        buttons.raw.disabled = false;
        return;
      }
      buttons.raw.disabled = false;
    }
    state.meshes[kind].visible = true;
    if (state.meshes[other]) state.meshes[other].visible = false;
    const raw = kind === "raw";
    buttons.raw.setAttribute("aria-pressed", String(raw));
    say(raw
      ? "Showing every splat that Brush trained, with the floaters. Drag to turn the view."
      : "Drag to turn the view. Scroll or pinch to zoom. Right-drag or two-finger drag to pan.");
  }

  loadButton.addEventListener("click", start);
  buttons.walk.addEventListener("click", () => {
    if (state.isWalking()) state.stopWalk("Walk stopped. Drag to look around.");
    else state.startWalk();
  });
  buttons.reset.addEventListener("click", () => {
    if (state.isWalking()) state.stopWalk();
    state.home();
    say("Back to the bird's-eye view.");
  });
  buttons.path.addEventListener("click", () => {
    state.line.visible = !state.line.visible;
    buttons.path.setAttribute("aria-pressed", String(state.line.visible));
  });
  buttons.raw.addEventListener("click", () => {
    show(buttons.raw.getAttribute("aria-pressed") === "true" ? "clean" : "raw");
  });
}

document.querySelectorAll("[data-splat-viewer]").forEach(setup);
