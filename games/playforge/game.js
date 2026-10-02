// Playforge – game code goes here. Built live on stream.
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function draw() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0a0a0a";
  ctx.font = "600 72px Fraunces, Georgia, serif";
  ctx.fillText("Playforge", 40, 110);

  ctx.fillStyle = "#4b4b4b";
  ctx.font = "16px 'JetBrains Mono', monospace";
  ctx.fillText("Stream #1 · nothing here yet. Watch it get built.", 40, 150);
}

// Wait for the web fonts so the title draws in the right typeface.
document.fonts.ready.then(draw);
