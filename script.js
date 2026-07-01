const canvas = document.querySelector("#signal-field");
const context = canvas.getContext("2d");
const points = [];
let width = 0;
let height = 0;
let pointer = { x: 0, y: 0, active: false };

// Always start from top after refresh
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

window.addEventListener("load", () => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
});

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createPoints();
}

function createPoints() {
  points.length = 0;
  const count = Math.max(36, Math.floor((width * height) / 26000));

  for (let index = 0; index < count; index += 1) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.26,
      vy: (Math.random() - 0.5) * 0.26,
      r: Math.random() * 1.6 + 0.8,
    });
  }
}

function draw() {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(66, 242, 166, 0.68)";
  context.strokeStyle = "rgba(112, 184, 255, 0.14)";
  context.lineWidth = 1;

  points.forEach((point, index) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < -20) point.x = width + 20;
    if (point.x > width + 20) point.x = -20;
    if (point.y < -20) point.y = height + 20;
    if (point.y > height + 20) point.y = -20;

    if (pointer.active) {
      const dx = pointer.x - point.x;
      const dy = pointer.y - point.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 140) {
        point.x -= dx * 0.002;
        point.y -= dy * 0.002;
      }
    }

    context.beginPath();
    context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    context.fill();

    for (let next = index + 1; next < points.length; next += 1) {
      const other = points[next];
      const distance = Math.hypot(point.x - other.x, point.y - other.y);

      if (distance < 130) {
        context.globalAlpha = 1 - distance / 130;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    }
  });

  context.globalAlpha = 1;
  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY, active: true };
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resize();
draw();
