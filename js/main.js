/* ------------------------------------------------------------------
   PLAYFORGE – site data + behaviour
   Add a game to GAMES and it shows up in the library.
   Add a stream to LOG and it shows up in the patch notes.
------------------------------------------------------------------- */

// status:   "dev" = still being built, "playable" = finished enough to play
// progress: 0–100, how finished the game is
// accent:   the game's neon colour; lights up its card and cover
// cover:    16:10 cover art. Leave it out and a tile is generated from the title.
// featured: true puts the game in the big slot at the top (defaults to the first game)
const GAMES = [
  {
    id: "#001",
    title: "Race Car",
    description: "Weave through traffic on a three-lane road. It speeds up the longer you last.",
    url: "https://homostaticus.github.io/race-car/",
    cover: "games/race-car/cover.svg",
    genre: "Arcade",
    status: "dev",
    progress: 20,
    accent: "#ff3d81",
    stack: "Canvas · JS",
    featured: true,
  },
];

// Newest first. Each entry is one stream session.
const LOG = [
  {
    date: "2026-10-02",
    title: "Player one, ready.",
    detail: "Set up Playforge, the site that will host the games, and started the first one: Race Car.",
    ref: "Stream #1",
  },
];

// Flip this to true when you go live (or wire it to Kick later).
const IS_LIVE = false;

const STATUS = { playable: "Playable", dev: "In dev" };

const grid = document.getElementById("game-grid");

function cover(g) {
  const art = g.cover
    ? `<img src="${g.cover}" alt="" loading="lazy">`
    : `<span class="cover-fallback" aria-hidden="true">${g.title[0]}</span>`;
  return `<div class="cover">${art}</div>`;
}

function playLabel(g) {
  return g.status === "playable" ? "▶ Play now" : "▶ Play the preview";
}

function renderFeatured() {
  const g = GAMES.find((g) => g.featured) || GAMES[0];
  if (!g) return;
  document.getElementById("featured").innerHTML = `
      <a class="featured" href="${g.url}" style="--accent:${g.accent}">
        ${cover(g)}
        <span class="featured-flag">Featured</span>
        <span class="badge ${g.status}">${STATUS[g.status]}</span>
        <div class="featured-info">
          <div>
            <h2 class="featured-title display">${g.title}</h2>
            <p class="featured-meta">${g.id} · ${g.genre} · ${g.progress}% built</p>
          </div>
          <span class="btn btn-primary">${playLabel(g)}</span>
        </div>
      </a>`;
}

function renderGames(filter) {
  const list = filter === "all" ? GAMES : GAMES.filter((g) => g.status === filter);

  if (list.length === 0 && filter !== "all") {
    const what = filter === "playable" ? "No playable games yet." : "Nothing in development right now.";
    grid.innerHTML = `<div class="game is-empty"><p>${what} Come back after the next stream.</p></div>`;
    return;
  }

  grid.innerHTML = list
    .map(
      (g) => `
      <a class="game" href="${g.url}" style="--progress:${g.progress}%; --accent:${g.accent}">
        ${cover(g)}
        <span class="badge ${g.status}">${STATUS[g.status]}</span>
        <span class="game-play" aria-hidden="true"><span>${playLabel(g)}</span></span>
        <div class="game-body">
          <div class="game-meta"><span>${g.id}</span><span>${g.genre}</span></div>
          <h3 class="game-title display">${g.title}</h3>
          <p class="game-desc">${g.description}</p>
          <div>
            <div class="game-bar" aria-hidden="true"><span></span></div>
            <div class="game-foot" style="margin-top:10px"><span>${g.stack}</span><span>${g.progress}% built</span></div>
          </div>
        </div>
      </a>`
    )
    .join("") + (filter === "all" ? nextCard() : "");
}

// An empty slot at the end of the library for whatever gets built next.
function nextCard() {
  const n = String(GAMES.length + 1).padStart(3, "0");
  return `
      <a class="game is-locked" href="#stream">
        <div class="cover"><span class="cover-fallback" aria-hidden="true">?</span></div>
        <div class="game-body">
          <div class="game-meta"><span>#${n}</span><span>Not started</span></div>
          <h3 class="game-title display">Empty slot</h3>
          <p class="game-desc">The next game hasn't been started. Chat decides what it is.</p>
          <div class="game-foot"><span>Locked</span><span>Have a say →</span></div>
        </div>
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
      <time datetime="${e.date}">${formatDate(e.date)}</time>
      <p class="entry"><strong>${e.title}</strong> <span>${e.detail}</span></p>
      <span class="ref">${e.ref}</span>
    </li>`
  ).join("");
}

function renderStats() {
  document.getElementById("stat-games").textContent = GAMES.length;
  document.getElementById("stat-playable").textContent = GAMES.filter((g) => g.status === "playable").length;
  document.getElementById("stat-streams").textContent = LOG.length;
  // Update by hand after each stream: run `cat games/*/*.js | wc -l`
  document.getElementById("stat-loc").textContent = 237;
}

function renderLive() {
  if (!IS_LIVE) return;
  const status = document.getElementById("live-status");
  status.classList.add("is-live");
  status.querySelector(".status-text").textContent = "Live now";
  document.querySelector(".screen").classList.add("is-live");
  document.querySelector(".screen-text").innerHTML = "LIVE<br><span>building right now</span>";
}

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.is-active").classList.remove("is-active");
    btn.classList.add("is-active");
    renderGames(btn.dataset.filter);
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
renderFeatured();
renderGames("all");
renderLog();
renderStats();
renderLive();
