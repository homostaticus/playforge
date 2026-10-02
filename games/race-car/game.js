// Race Car – dodge the traffic for as long as you can.
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

const INK = "#0a0a0a";
const PAPER = "#ffffff";
const GRASS = "#3f9b4f";
const GRASS_DARK = "#358543";
const ASPHALT = "#4a4f57";
const CURB_RED = "#d8423a";
const LANE_YELLOW = "#f3c43a";
const GLASS = "#9fd3f0";
const PLAYER_COLOR = "#e0557a";
const TRAFFIC_COLORS = ["#3a62d6", "#f3c43a", "#2fa386", "#f28c28", "#8b5cf6", "#18a9c9"];

const LANES = 3;
const ROAD_X = 90;
const ROAD_W = W - ROAD_X * 2;
const LANE_W = ROAD_W / LANES;
const CAR_W = 46;
const CAR_H = 80;
const STEER_SPEED = 380; // px per second
const START_SPEED = 300;
const BEST_KEY = "race-car-best";

const COUNTDOWN = 3; // seconds before the race starts

let state = "countdown"; // "countdown" | "playing" | "crashed"
let player, traffic, speed, distance, spawnIn, roadOffset, countdown;
let best = Number(localStorage.getItem(BEST_KEY)) || 0;
const keys = { left: false, right: false };

function reset() {
  player = { x: W / 2 - CAR_W / 2, y: H - CAR_H - 40 };
  traffic = [];
  speed = START_SPEED;
  distance = 0;
  spawnIn = 0.8;
  roadOffset = 0;
}

function start() {
  reset();
  countdown = COUNTDOWN;
  state = "countdown";
}

function spawnCar() {
  const lane = Math.floor(Math.random() * LANES);
  traffic.push({
    x: ROAD_X + lane * LANE_W + (LANE_W - CAR_W) / 2,
    y: -CAR_H,
    // Traffic drives the same way, just slower, so it drifts down the screen.
    pace: 0.45 + Math.random() * 0.25,
    color: TRAFFIC_COLORS[Math.floor(Math.random() * TRAFFIC_COLORS.length)],
  });
}

function hits(a, b) {
  const pad = 6; // forgive near misses
  return (
    a.x + pad < b.x + CAR_W - pad &&
    a.x + CAR_W - pad > b.x + pad &&
    a.y + pad < b.y + CAR_H - pad &&
    a.y + CAR_H - pad > b.y + pad
  );
}

function update(dt) {
  if (state === "countdown") {
    countdown -= dt;
    if (countdown <= 0) state = "playing";
    return;
  }
  if (state !== "playing") return;

  const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  player.x += dir * STEER_SPEED * dt;
  player.x = Math.max(ROAD_X + 4, Math.min(ROAD_X + ROAD_W - CAR_W - 4, player.x));

  speed += 6 * dt;
  distance += speed * dt;
  roadOffset = (roadOffset + speed * dt) % 80;

  spawnIn -= dt;
  if (spawnIn <= 0) {
    spawnCar();
    spawnIn = Math.max(0.45, 1.1 - distance / 40000) + Math.random() * 0.3;
  }

  for (const car of traffic) car.y += speed * car.pace * dt;
  traffic = traffic.filter((car) => car.y < H + CAR_H);

  if (traffic.some((car) => hits(player, car))) {
    state = "crashed";
    best = Math.max(best, score());
    localStorage.setItem(BEST_KEY, best);
  }
}

function score() {
  return Math.floor(distance / 10);
}

function drawRoad() {
  // Grass, striped so it scrolls with the road.
  for (let y = -80 + roadOffset; y < H; y += 80) {
    ctx.fillStyle = GRASS;
    ctx.fillRect(0, y, W, 40);
    ctx.fillStyle = GRASS_DARK;
    ctx.fillRect(0, y + 40, W, 40);
  }

  ctx.fillStyle = ASPHALT;
  ctx.fillRect(ROAD_X, 0, ROAD_W, H);

  // Red and white curbs on both edges.
  const CURB_W = 10;
  for (let y = -40 + (roadOffset % 40); y < H; y += 40) {
    ctx.fillStyle = CURB_RED;
    ctx.fillRect(ROAD_X - CURB_W, y, CURB_W, 20);
    ctx.fillRect(ROAD_X + ROAD_W, y, CURB_W, 20);
    ctx.fillStyle = PAPER;
    ctx.fillRect(ROAD_X - CURB_W, y + 20, CURB_W, 20);
    ctx.fillRect(ROAD_X + ROAD_W, y + 20, CURB_W, 20);
  }

  ctx.strokeStyle = LANE_YELLOW;
  ctx.lineWidth = 4;
  ctx.setLineDash([40, 40]);
  ctx.lineDashOffset = -roadOffset;
  ctx.beginPath();
  for (let i = 1; i < LANES; i++) {
    ctx.moveTo(ROAD_X + i * LANE_W, 0);
    ctx.lineTo(ROAD_X + i * LANE_W, H);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawCar(x, y, color) {
  ctx.fillStyle = INK;
  ctx.fillRect(x - 5, y + 10, 5, 18);
  ctx.fillRect(x + CAR_W, y + 10, 5, 18);
  ctx.fillRect(x - 5, y + CAR_H - 28, 5, 18);
  ctx.fillRect(x + CAR_W, y + CAR_H - 28, 5, 18);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, CAR_W, CAR_H, 10);
  ctx.fill();

  ctx.fillStyle = GLASS;
  ctx.fillRect(x + 7, y + 18, CAR_W - 14, 14);
  ctx.fillRect(x + 7, y + CAR_H - 26, CAR_W - 14, 10);
}

function drawHud() {
  ctx.fillStyle = "rgba(10, 10, 10, 0.55)";
  ctx.beginPath();
  ctx.roundRect(8, 8, 76, 52, 8);
  ctx.fill();
  ctx.textAlign = "left";
  ctx.fillStyle = PAPER;
  ctx.font = "600 16px 'JetBrains Mono', monospace";
  ctx.fillText(String(score()).padStart(5, "0"), 16, 30);
  ctx.fillStyle = LANE_YELLOW;
  ctx.font = "12px 'JetBrains Mono', monospace";
  ctx.fillText("BEST " + best, 16, 50);
}

function drawMessage(title, line, color) {
  ctx.fillStyle = "rgba(10, 10, 10, 0.7)";
  ctx.fillRect(0, H / 2 - 90, W, 160);
  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.font = "700 56px 'Chakra Petch', sans-serif";
  ctx.fillText(title, W / 2, H / 2 - 10);
  ctx.fillStyle = PAPER;
  ctx.font = "14px 'JetBrains Mono', monospace";
  ctx.fillText(line, W / 2, H / 2 + 30);
}

function draw() {
  drawRoad();
  for (const car of traffic) drawCar(car.x, car.y, car.color);
  drawCar(player.x, player.y, PLAYER_COLOR);
  drawHud();

  if (state === "countdown") drawMessage(String(Math.ceil(countdown)), "Get ready · steer with ← →", LANE_YELLOW);
  if (state === "crashed") drawMessage("Crashed!", `Score ${score()} · space or tap to retry`, CURB_RED);
}

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    if (state === "crashed") start();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
});

// Touch / mouse: tap to retry, hold the left or right half to steer.
canvas.addEventListener("pointerdown", (e) => {
  if (state === "crashed") return start();
  const rect = canvas.getBoundingClientRect();
  const left = e.clientX - rect.left < rect.width / 2;
  keys.left = left;
  keys.right = !left;
});

window.addEventListener("pointerup", () => {
  keys.left = false;
  keys.right = false;
});

// The race starts as soon as the page opens.
start();
// Wait for the web fonts so the title draws in the right typeface.
document.fonts.ready.then(() => requestAnimationFrame(frame));
