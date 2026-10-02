// Playforge – game code goes here. Built live on stream.
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function draw() {
  ctx.fillStyle = "#04050a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#53fc18";
  ctx.font = "700 72px 'Chakra Petch', sans-serif";
  ctx.fillText("PLAYFORGE", 40, 110);

  ctx.fillStyle = "#8f96b3";
  ctx.font = "16px 'JetBrains Mono', monospace";
  ctx.fillText("Stream #1 · nothing here yet. Watch it get built.", 40, 150);
}

// Wait for the web fonts so the title draws in the right typeface.
document.fonts.ready.then(draw);
