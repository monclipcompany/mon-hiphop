const $ = (selector, parent = document) => parent.querySelector(selector);

function normalizeImages(item, preferred = "image") {
  if (Array.isArray(item.images) && item.images.filter(Boolean).length) {
    return item.images.filter(Boolean);
  }
  if (item[preferred]) return [item[preferred]];
  return [PLACEHOLDER];
}

function imgHTML(src, alt = "", className = "", lazy = true) {
  const safe = src || PLACEHOLDER;
  return `<img class="${className}" src="${safe}" alt="${escapeHTML(alt)}" ${lazy ? 'loading="lazy"' : ''} onerror="this.onerror=null;this.src='${PLACEHOLDER}'">`;
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date + "T00:00:00");
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric"
  });
}

function openLightbox(images, start = 0, alt = "") {
  const root = $("#lightbox-root");
  if (!root) return;

  let index = start;
  const cleanImages = images.filter(Boolean);

  root.innerHTML = `
    <div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
      <button class="lightbox-close" aria-label="Close">×</button>
      <button class="lightbox-prev" aria-label="Previous image">‹</button>
      <div class="lightbox-stage">
        <img id="lightbox-image" src="" alt="">
        <div id="lightbox-counter" class="lightbox-counter"></div>
      </div>
      <button class="lightbox-next" aria-label="Next image">›</button>
    </div>
  `;

  const box = $(".lightbox", root);
  const image = $("#lightbox-image", box);
  const counter = $("#lightbox-counter", box);

  const render = () => {
    image.src = cleanImages[index] || PLACEHOLDER;
    image.alt = alt;
    image.onerror = () => { image.src = PLACEHOLDER; };
    counter.textContent = cleanImages.length > 1 ? `${index + 1} / ${cleanImages.length}` : "";
  };

  const close = () => {
    root.innerHTML = "";
    document.body.classList.remove("no-scroll");
    document.removeEventListener("keydown", onKey);
  };

  const next = () => {
    index = (index + 1) % cleanImages.length;
    render();
  };

  const prev = () => {
    index = (index - 1 + cleanImages.length) % cleanImages.length;
    render();
  };

  const onKey = (event) => {
    if (event.key === "Escape") close();
    if (event.key === "ArrowRight" && cleanImages.length > 1) next();
    if (event.key === "ArrowLeft" && cleanImages.length > 1) prev();
  };

  $(".lightbox-close", box).onclick = close;
  $(".lightbox-next", box).onclick = next;
  $(".lightbox-prev", box).onclick = prev;
  box.addEventListener("click", (event) => {
    if (event.target === box) close();
  });

  render();
  document.body.classList.add("no-scroll");
  document.addEventListener("keydown", onKey);
}

function galleryHTML(item, alt = "", preferred = "image") {
  const images = normalizeImages(item, preferred);
  return `
    <div class="gallery ${images.length === 1 ? "gallery-single" : ""}">
      ${images.map((src, i) => `
        <button class="gallery-item" data-gallery='${JSON.stringify(images).replaceAll("'", "&#039;")}' data-index="${i}" aria-label="Open image ${i + 1}">
          ${imgHTML(src, alt, "", true)}
        </button>
      `).join("")}
    </div>
  `;
}

function bindGalleries(parent = document) {
  parent.querySelectorAll(".gallery-item").forEach((button) => {
    button.addEventListener("click", () => {
      let images = [];
      try {
        images = JSON.parse(button.dataset.gallery);
      } catch {
        images = [button.querySelector("img")?.src || PLACEHOLDER];
      }
      openLightbox(images, Number(button.dataset.index || 0), button.querySelector("img")?.alt || "");
    });
  });
}

function newsCard(item) {
  const image = normalizeImages(item)[0];
  return `
    <article class="news-card">
      <a href="news.html?id=${item.id}" class="card-image">
        ${imgHTML(image, item.title)}
        <span class="tag">${escapeHTML(item.category)}</span>
      </a>
      <div class="card-body">
        <p class="meta">${formatDate(item.date)} · ${escapeHTML(item.artist)}</p>
        <h3><a href="news.html?id=${item.id}">${escapeHTML(item.title)}</a></h3>
        <p>${escapeHTML(item.excerpt)}</p>
        <a class="text-link" href="news.html?id=${item.id}">Read story →</a>
      </div>
    </article>
  `;
}

function artistCard(item) {
  return `
    <article class="artist-card">
      <a href="#artist-${item.id}" class="artist-cover" data-artist-gallery="${item.id}">
        ${imgHTML(item.cover || item.avatar || PLACEHOLDER, item.name)}
      </a>
      <div class="artist-avatar">${imgHTML(item.avatar || PLACEHOLDER, item.name)}</div>
      <div class="artist-body">
        <p class="meta">${escapeHTML(item.genre)}</p>
        <h3>${escapeHTML(item.name)}</h3>
        <p>${escapeHTML(item.bio)}</p>
      </div>
    </article>
  `;
}

function releaseCard(item) {
  return `
    <article class="release-card">
      <button class="release-cover" data-release-image="${escapeHTML(item.cover || PLACEHOLDER)}" aria-label="View cover">
        ${imgHTML(item.cover || PLACEHOLDER, item.title)}
      </button>
      <div class="release-body">
        <p class="meta">${escapeHTML(item.type)} · ${formatDate(item.date)}</p>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.artist)}</p>
        <div class="release-links">
          ${item.spotify && item.spotify !== "#" ? `<a href="${item.spotify}" target="_blank" rel="noopener">Spotify</a>` : ""}
          ${item.youtube && item.youtube !== "#" ? `<a href="${item.youtube}" target="_blank" rel="noopener">YouTube</a>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderHome() {
  const news = $("#home-news");
  if (news) news.innerHTML = NEWS.slice(0, 3).map(newsCard).join("");

  const artists = $("#home-artists");
  if (artists) artists.innerHTML = ARTISTS.slice(0, 3).map(artistCard).join("");

  const music = $("#home-music");
  if (music) music.innerHTML = RELEASES.slice(0, 3).map(releaseCard).join("");

  bindReleaseCovers();
}

function renderNewsList() {
  const list = $("#news-list");
  if (!list) return;

  const search = ($("#news-search")?.value || "").toLowerCase().trim();
  const category = $("#news-category")?.value || "ALL";

  const filtered = NEWS.filter(item => {
    const haystack = `${item.title} ${item.artist} ${item.category} ${item.excerpt}`.toLowerCase();
    return (!search || haystack.includes(search)) && (category === "ALL" || item.category === category);
  });

  list.innerHTML = filtered.length
    ? filtered.map(newsCard).join("")
    : `<div class="empty-state">No stories found.</div>`;
}

function renderNewsPage() {
  const categories = [...new Set(NEWS.map(n => n.category))];
  const select = $("#news-category");
  if (select) {
    select.innerHTML = `<option value="ALL">All categories</option>` +
      categories.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
    select.addEventListener("change", renderNewsList);
  }
  $("#news-search")?.addEventListener("input", renderNewsList);

  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));

  if (id) {
    const item = NEWS.find(n => n.id === id);
    if (item) {
      $("#news-list-view").hidden = true;
      const detail = $("#news-detail-view");
      detail.hidden = false;
      detail.innerHTML = `
        <a class="back-link" href="news.html">← Back to News</a>
        <div class="detail-head">
          <p class="eyebrow">${escapeHTML(item.category)}</p>
          <h1>${escapeHTML(item.title)}</h1>
          <p class="meta">${formatDate(item.date)} · ${escapeHTML(item.artist)}</p>
        </div>
        ${galleryHTML(item, item.title)}
        <div class="article-content">${item.content}</div>
      `;
      bindGalleries(detail);
      return;
    }
  }

  renderNewsList();
}

function renderArtists() {
  const list = $("#artist-list");
  if (!list) return;
  list.innerHTML = ARTISTS.map(artistCard).join("");

  list.querySelectorAll("[data-artist-gallery]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const artist = ARTISTS.find(a => a.id === Number(button.dataset.artistGallery));
      if (!artist) return;
      const images = [artist.cover, artist.avatar].filter(Boolean);
      openLightbox(images.length ? images : [PLACEHOLDER], 0, artist.name);
    });
  });
}

function renderMusic() {
  const list = $("#music-list");
  const filters = $("#music-filters");
  if (!list || !filters) return;

  const types = ["ALL", ...new Set(RELEASES.map(r => r.type))];
  filters.innerHTML = types.map(type =>
    `<button class="filter-button ${type === "ALL" ? "active" : ""}" data-type="${type}">${type}</button>`
  ).join("");

  const render = (type) => {
    list.innerHTML = RELEASES
      .filter(r => type === "ALL" || r.type === type)
      .map(releaseCard).join("");
    bindReleaseCovers();
  };

  filters.querySelectorAll(".filter-button").forEach(btn => {
    btn.addEventListener("click", () => {
      filters.querySelectorAll(".filter-button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.type);
    });
  });

  render("ALL");
}

function bindReleaseCovers() {
  document.querySelectorAll("[data-release-image]").forEach((button) => {
    button.onclick = () => openLightbox([button.dataset.releaseImage], button.dataset.releaseImage, "");
  });
}

function setupMenu() {
  const toggle = $(".menu-toggle");
  const nav = $(".nav");
  if (!toggle || !nav) return;
  
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("open");
  });
  
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
  
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove("open");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  $("#year") && ($("#year").textContent = new Date().getFullYear());
  setupMenu();
  renderHome();
  renderNewsPage();
  renderArtists();
  renderMusic();
});
