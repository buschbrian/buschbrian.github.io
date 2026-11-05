import test from "node:test";
import assert from "node:assert/strict";
import { constrain, fitScale, overviewRect, pinchView, resizeView, zoomAt } from "../assets/js/image-geometry.mjs";

const view = {
  width: 2160, height: 2700, viewportWidth: 800, viewportHeight: 700,
  fit: fitScale(2160, 2700, 800, 700), scale: 1, x: 0, y: 0,
};
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < .00001, `${actual} != ${expected}`);

test("portrait and landscape images fit without upscaling or cropping", () => {
  for (const [width, height] of [[2160, 2700], [2700, 2160], [80, 60]]) {
    for (const [vw, vh] of [[320, 620], [1440, 780]]) {
      const fit = fitScale(width, height, vw, vh);
      assert.ok(width * fit <= vw - 40);
      assert.ok(height * fit <= vh - 40);
      assert.ok(fit <= 1);
    }
  }
});

test("zoom keeps the image point under the pointer stationary", () => {
  const point = { x: 140, y: -90 };
  const before = { ...view, scale: .5, x: 30, y: -20 };
  const after = zoomAt(before, 1.2, point);
  closeTo((point.x - before.x) / before.scale, (point.x - after.x) / after.scale);
  closeTo((point.y - before.y) / before.scale, (point.y - after.y) / after.scale);
});

test("zoom stops at fit and at two source pixels per CSS pixel", () => {
  closeTo(zoomAt(view, .00001).scale, view.fit);
  assert.equal(zoomAt(view, 100).scale, 2);
});

test("panning cannot lose the image beyond any edge", () => {
  const panned = constrain({ ...view, x: 99999, y: -99999 });
  assert.equal(panned.x, (2160 - 800) / 2);
  assert.equal(panned.y, -(2700 - 700) / 2);
  const fitted = constrain({ ...view, scale: view.fit, x: 99999, y: -99999 });
  closeTo(fitted.x, 0);
  closeTo(fitted.y, 0);
});

test("resizing keeps a fitted image fitted and a detailed view at its scale", () => {
  const fitted = resizeView({ ...view, scale: view.fit }, 320, 600);
  closeTo(fitted.scale, fitted.fit);
  const detailed = resizeView({ ...view, scale: 1, x: 100, y: 120 }, 320, 600);
  assert.equal(detailed.scale, 1);
  assert.equal(detailed.x, 100);
  assert.equal(detailed.y, 120);
});

test("overview represents the visible area at the center and all four corners", () => {
  for (const x of [-99999, 0, 99999]) {
    for (const y of [-99999, 0, 99999]) {
      const bounded = constrain({ ...view, x, y });
      const rect = overviewRect(bounded);
      assert.ok(rect.x >= 0 && rect.x + rect.width <= 1.00001);
      assert.ok(rect.y >= 0 && rect.y + rect.height <= 1.00001);
      closeTo(rect.width, 800 / 2160);
      closeTo(rect.height, 700 / 2700);
    }
  }
});

test("a full pinch cycle can return to fit without accumulating drift", () => {
  let state = { ...view, scale: view.fit };
  for (let i = 0; i < 100; i++) {
    state = zoomAt(state, state.scale * 1.04, { x: 50, y: 70 });
  }
  state = zoomAt(state, state.fit);
  closeTo(state.scale, state.fit);
  closeTo(state.x, 0);
  closeTo(state.y, 0);
});

test("two-finger movement combines pinch scale and midpoint translation", () => {
  const before = [{ x: -50, y: 0 }, { x: 50, y: 0 }];
  const after = [{ x: -60, y: 20 }, { x: 140, y: 20 }];
  const pinched = pinchView({ ...view, scale: .5 }, before, after);
  closeTo(pinched.scale, 1);
  closeTo(pinched.x, 40);
  closeTo(pinched.y, 20);
});

test("coincident fingers cannot produce an infinite scale", () => {
  const pinched = pinchView(view, [{ x: 0, y: 0 }, { x: 0, y: 0 }], [{ x: -20, y: 0 }, { x: 20, y: 0 }]);
  assert.ok(Number.isFinite(pinched.scale));
  assert.ok(Number.isFinite(pinched.x));
});
