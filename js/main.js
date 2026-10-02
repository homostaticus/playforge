/* ------------------------------------------------------------------
   PLAYFORGE – site data + behaviour
   Add a game to GAMES and it shows up in "The games".
   Add a stream to LOG and it shows up in the sketchbook.
------------------------------------------------------------------- */

// status:   "sketch" = in progress, "playable" = finished enough to play
// progress: 0–100, how finished the game is
// pigment:  the watercolor behind the card: "cobalt", "madder", "cadmium" or "viridian"
const GAMES = [
  {
    id: "No. 001",
    title: "Race Car",
    description: "Weave through traffic on a three-lane road. It speeds up the longer you last.",
    url: "games/race-car/index.html",
    status: "sketch",
    progress: 20,
    pigment: "madder",
    stack: "Canvas · JS",
  },
];

// Newest first. Each entry is one stream session.
const LOG = [
  {
    date: "2026-10-02",
    title: "First marks on the page.",
    detail: "Set up Playforge, the site that will host the games, and started the first one: Race Car.",
    ref: "Stream #1",
  },
];

// Flip this to true when you go live (or wire it to Kick later).
const IS_LIVE = false;

const grid = document.getElementById("game-grid");

function renderGames(filter) {
  const list = filter === "all" ? GAMES : GAMES.filter((g) => g.status === filter);

  if (list.length === 0 && filter !== "all") {
    const what = filter === "playable" ? "No playable games yet." : "No sketches right now.";
    grid.innerHTML = `<div class="card is-empty"><p>${what} Come back after the next stream.</p></div>`;
    return;
  }

  grid.innerHTML = list
    .map(
      (g) => `
      <a class="card" href="${g.url}" style="--progress:${g.progress}%; --pigment:var(--${g.pigment})">
        <span class="card-wash" aria-hidden="true"></span>
        <div class="card-top">
          <span class="mono">${g.id}</span>
          <span class="tag ${g.status}">${g.status === "playable" ? "Playable" : "Sketch"}</span>
        </div>
        <div>
          <h3 class="card-title display">${g.title}</h3>
          <p class="card-desc">${g.description}</p>
        </div>
        <div class="card-foot mono">
          <span>${g.stack}</span>
          <span class="go">${g.status === "playable" ? "Play →" : "Preview →"}</span>
        </div>
        <span class="card-progress" aria-hidden="true"></span>
      </a>`
    )
    .join("") + (filter === "all" ? nextCard() : "");
}

// A blank page at the end of the list for whatever gets built next.
function nextCard() {
  const n = String(GAMES.length + 1).padStart(3, "0");
  return `
      <a class="card is-next" href="#stream">
        <div class="card-top"><span class="mono">No. ${n}</span></div>
        <div>
          <h3 class="card-title display">Blank page</h3>
          <p class="card-desc">The next game hasn't been started. Chat decides what it is.</p>
        </div>
        <div class="card-foot mono"><span>Not started</span><span class="go">Have a say →</span></div>
      </a>`;
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function renderLog() {
  document.getElementById("log-list").innerHTML = LOG.map(
    (e) => `
    <li>
      <time class="mono" datetime="${e.date}">${formatDate(e.date)}</time>
      <p class="entry"><strong>${e.title}</strong> <span>${e.detail}</span></p>
      <span class="ref mono">${e.ref}</span>
    </li>`
  ).join("");
}

function renderStats() {
  document.getElementById("stat-games").textContent = GAMES.length;
  document.getElementById("stat-playable").textContent = GAMES.filter((g) => g.status === "playable").length;
  document.getElementById("stat-streams").textContent = LOG.length;
  // Update by hand after each stream: run `cat games/*/*.js | wc -l`
  document.getElementById("stat-loc").textContent = 228;
}

function renderLive() {
  if (!IS_LIVE) return;
  const status = document.getElementById("live-status");
  status.classList.add("is-live");
  status.querySelector(".status-text").textContent = "Live now";
  document.querySelector(".frame-text").innerHTML = "LIVE<br><span>building right now</span>";
}

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.is-active").classList.remove("is-active");
    btn.classList.add("is-active");
    renderGames(btn.dataset.filter);
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
renderGames("all");
renderLog();
renderStats();
renderLive();
