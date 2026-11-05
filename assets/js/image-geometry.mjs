export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function fitScale(width, height, viewportWidth, viewportHeight, padding = 20) {
  return Math.max(.001, Math.min(
    (viewportWidth - padding * 2) / width,
    (viewportHeight - padding * 2) / height,
    1,
  ));
}

export function constrain(view) {
  const limitX = Math.max(0, (view.width * view.scale - view.viewportWidth) / 2);
  const limitY = Math.max(0, (view.height * view.scale - view.viewportHeight) / 2);
  return { ...view, x: clamp(view.x, -limitX, limitX), y: clamp(view.y, -limitY, limitY) };
}

export function zoomAt(view, scale, point = { x: 0, y: 0 }) {
  const next = clamp(scale, view.fit, 2);
  const ratio = next / view.scale;
  return constrain({
    ...view,
    scale: next,
    x: point.x - (point.x - view.x) * ratio,
    y: point.y - (point.y - view.y) * ratio,
  });
}

export function resizeView(view, viewportWidth, viewportHeight) {
  const fitted = Math.abs(view.scale - view.fit) < .0001;
  const fit = fitScale(view.width, view.height, viewportWidth, viewportHeight);
  return constrain({
    ...view, viewportWidth, viewportHeight, fit,
    scale: fitted ? fit : Math.max(fit, view.scale),
    x: fitted ? 0 : view.x,
    y: fitted ? 0 : view.y,
  });
}

export function pinchView(view, before, after) {
  const distance = points => Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
  const midpoint = points => ({ x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 });
  const from = midpoint(before);
  const to = midpoint(after);
  const zoomed = distance(before) ? zoomAt(view, view.scale * distance(after) / distance(before), from) : view;
  return constrain({ ...zoomed, x: zoomed.x + to.x - from.x, y: zoomed.y + to.y - from.y });
}

export function overviewRect(view) {
  const width = view.width * view.scale;
  const height = view.height * view.scale;
  return {
    x: clamp((width / 2 - view.x - view.viewportWidth / 2) / width, 0, 1),
    y: clamp((height / 2 - view.y - view.viewportHeight / 2) / height, 0, 1),
    width: Math.min(1, view.viewportWidth / width),
    height: Math.min(1, view.viewportHeight / height),
  };
}
