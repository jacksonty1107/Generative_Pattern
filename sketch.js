const cellWidth = 82;
const cellHeight = 72;
const arcRadii = [18, 27, 36];
const influenceRadius = 190;

let pointer = { x: -1000, y: -1000 };
let palette;
let arcs = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
  noFill();
  palette = [
    color("#4f8dff"),
    color("#a36bff")
  ];
  randomizeArcs();
}

function draw() {
  drawBackground();

  for (const arc of arcs) {
    for (let layer = 0; layer < arcRadii.length; layer += 1) {
      const radius = arcRadii[layer];
      const alpha = 185 - layer * 34;
      stroke(red(arc.color), green(arc.color), blue(arc.color), alpha);
      strokeWeight(layer === 0 ? 1.45 : 1.15);
      drawArc(arc.x, arc.y, radius);
    }
  }
}

function randomizeArcs() {
  arcs = [];
  const columns = Math.ceil(width / cellWidth) + 2;
  const rows = Math.ceil(height / cellHeight) + 2;
  const startX = -cellWidth + random(cellWidth);
  const startY = -cellHeight + random(cellHeight);

  for (let row = 0; row < rows; row += 1) {
    const offset = row % 2 === 0 ? 0 : cellWidth / 2;
    for (let column = 0; column < columns; column += 1) {
      const x = startX + column * cellWidth + offset + random(-22, 22);
      const y = startY + row * cellHeight + random(-18, 18);
      const blend = (x / width + (y / height) * 0.35 + 1) % 1;
      arcs.push({
        x,
        y,
        color: lerpColor(palette[0], palette[1], blend)
      });
    }
  }
}

function drawArc(centerX, centerY, radius) {
  beginShape();
  for (let step = 0; step <= 28; step += 1) {
    const angle = Math.PI + (Math.PI * step) / 28;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    const distance = dist(x, y, pointer.x, pointer.y);
    const falloff = Math.max(0, 1 - distance / influenceRadius);
    const smoothFalloff = falloff * falloff * (3 - 2 * falloff);
    const direction = y < pointer.y ? -1 : 1;
    const displacement = direction * smoothFalloff * 34;

    vertex(x, y + displacement);
  }
  endShape();
}

function drawBackground() {
  const context = drawingContext;
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#080b18");
  gradient.addColorStop(0.52, "#0b0d20");
  gradient.addColorStop(1, "#100b20");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function mouseMoved() {
  pointer.x = mouseX;
  pointer.y = mouseY;
}

function touchMoved() {
  pointer.x = touchX;
  pointer.y = touchY;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  randomizeArcs();
}
