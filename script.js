// =========================================================
// MASTA XUL PORTAL — script.js
// (asal + blog preview + produk shop auto-rotate)
// =========================================================

// ----- 1. LOADING SCREEN -----
const loaderOverlay = document.getElementById("loader-overlay");
const loadingPercent = document.getElementById("loading-percent");
const progressBar = document.getElementById("progress-bar");

let progress = 0;

if (loaderOverlay) {
  setTimeout(() => {
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 6) + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loaderOverlay.style.opacity = "0";
          loaderOverlay.style.visibility = "hidden";
          kemaskiniKedudukanAlien();
        }, 500);
      }
      if (loadingPercent) loadingPercent.innerText = progress + "%";
      if (progressBar) progressBar.style.width = progress + "%";
    }, 45);
  }, 1800);
}

// ----- 2. CANVAS GALAKSI & KILAT -----
const canvas = document.getElementById("galaxyCanvas");
const preferReduced =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !preferReduced) {
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const STAR_COUNT = Math.min(
    180,
    Math.floor((window.innerWidth * window.innerHeight) / 14000) + 80
  );

  const stars = [];
  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.2 + 0.3;
      this.alpha = Math.random() * 0.8 + 0.2;
      this.color = ["#38bdf8", "#818cf8", "#ffffff", "#c084fc"][
        Math.floor(Math.random() * 4)
      ];
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
  }

  class Lightning {
    constructor(startX, startY, endX, endY) {
      this.segments = [];
      this.life = 1.0;
      let x = startX;
      let y = startY;
      this.segments.push({ x, y });
      const steps = 25;
      const dx = (endX - startX) / steps;
      const dy = (endY - startY) / steps;
      for (let i = 0; i < steps; i++) {
        x += dx + (Math.random() - 0.5) * 35;
        y += dy + (Math.random() - 0.5) * 20;
        this.segments.push({ x, y });
      }
      this.segments.push({ x: endX, y: endY });
    }
    update() {
      this.life -= 0.08;
    }
    draw() {
      if (this.life <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.segments[0].x, this.segments[0].y);
      for (let i = 1; i < this.segments.length; i++) {
        ctx.lineTo(this.segments[i].x, this.segments[i].y);
      }
      ctx.strokeStyle = "rgba(186, 230, 253," + this.life + ")";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 25;
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 255, 255," + this.life + ")";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  let currentLightning = null;
  let lightningTimer = null;

  function triggerLightning() {
    const startX = width * 0.5 + (Math.random() - 0.5) * 200;
    const endX = width * 0.5 + (Math.random() - 0.5) * 300;
    currentLightning = new Lightning(startX, 0, endX, height);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 1;
    stars.forEach((s) => s.draw());
    if (currentLightning) {
      currentLightning.draw();
      currentLightning.update();
      if (currentLightning.life <= 0) currentLightning = null;
    }
    requestAnimationFrame(animate);
  }

  function onResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
    kemaskiniKedudukanAlien();
  }

  window.addEventListener("resize", onResize);
  initStars();
  animate();

  lightningTimer = setInterval(() => {
    if (document.hidden) return;
    if (Math.random() < 0.55) triggerLightning();
  }, 2000);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && lightningTimer) {
      clearInterval(lightningTimer);
      lightningTimer = null;
    } else if (!document.hidden && !lightningTimer) {
      lightningTimer = setInterval(() => {
        if (Math.random() < 0.55) triggerLightning();
      }, 2000);
    }
  });
}

// ----- 3. ALIEN POINTER + NAV -----
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll("section");
const alienPointer = document.getElementById("alienPointer");
const alienSpeech = document.getElementById("alienSpeech");
const navLinksList = document.getElementById("navLinksList");

function kemaskiniKedudukanAlien() {
  const activeLink = document.querySelector(".nav-item.active");
  if (!activeLink || !alienPointer || !navLinksList) return;

  const parentRect = navLinksList.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();
  const offsetLeft =
    linkRect.left - parentRect.left + linkRect.width / 2 - alienPointer.offsetWidth / 2;

  alienPointer.style.transform = "translateX(" + offsetLeft + "px)";
  if (alienSpeech) {
    alienSpeech.textContent = (activeLink.textContent || "").trim() || "Menu";
  }
}

if ("IntersectionObserver" in window && sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navItems.forEach((item) => {
          item.classList.remove("active");
          if (item.getAttribute("data-section") === id) {
            item.classList.add("active");
          }
        });
        kemaskiniKedudukanAlien();
      });
    },
    { root: null, rootMargin: "-30% 0px -40% 0px", threshold: 0 }
  );
  sections.forEach((sec) => sectionObserver.observe(sec));
} else {
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.25) {
        current = section.id;
      }
    });
    if (!current) return;
    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("data-section") === current) item.classList.add("active");
    });
    kemaskiniKedudukanAlien();
  });
}

navItems.forEach((item) => {
  item.addEventListener("click", function () {
    // Jangan set active untuk pautan luar (Shop / Blog)
    if (this.getAttribute("data-section")) {
      navItems.forEach((link) => link.classList.remove("active"));
      this.classList.add("active");
      kemaskiniKedudukanAlien();
    }
  });
});

window.addEventListener("load", kemaskiniKedudukanAlien);

// ----- 4. BORANG + CAPTCHA -----
const API_URL =
  "https://script.google.com/macros/s/AKfycbxsWSCyKSOiEx-Syg1dGuNT21U0Qqv_4GPBiFhJgvU-t014SXvbOwKAWL4TZiQk8NJE/exec";

const formHubungi = document.getElementById("formHubungi");
const btnHantar = document.getElementById("btnHantar");
const msgContainer = document.getElementById("msg");
const captchaSoalan = document.getElementById("captchaSoalan");
const captchaJawapan = document.getElementById("captchaJawapan");
const btnRefreshCaptcha = document.getElementById("btnRefreshCaptcha");

let captchaA = 0;
let captchaB = 0;

function buatCaptcha() {
  captchaA = Math.floor(Math.random() * 8) + 2;
  captchaB = Math.floor(Math.random() * 8) + 2;
  if (captchaSoalan) captchaSoalan.textContent = captchaA + " + " + captchaB + " = ?";
  if (captchaJawapan) captchaJawapan.value = "";
}

if (btnRefreshCaptcha) btnRefreshCaptcha.addEventListener("click", buatCaptcha);
buatCaptcha();

if (formHubungi) {
  formHubungi.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msgContainer) {
      msgContainer.className = "msg";
      msgContainer.textContent = "";
    }

    const hp = document.getElementById("website");
    if (hp && hp.value.trim() !== "") {
      if (msgContainer) {
        msgContainer.className = "msg ok";
        msgContainer.textContent = "Mesej berjaya dihantar. Terima kasih!";
      }
      formHubungi.reset();
      buatCaptcha();
      return;
    }

    const jawapanUser = parseInt(captchaJawapan ? captchaJawapan.value : "", 10);
    if (jawapanUser !== captchaA + captchaB) {
      if (msgContainer) {
        msgContainer.className = "msg err";
        msgContainer.textContent = "Jawapan CAPTCHA salah. Sila cuba lagi.";
      }
      buatCaptcha();
      return;
    }

    if (btnHantar) {
      btnHantar.disabled = true;
      btnHantar.textContent = "Menghantar...";
    }

    const payload = {
      nama: (document.getElementById("nama") || {}).value?.trim() || "",
      emel: (document.getElementById("emel") || {}).value?.trim() || "",
      telefon: (document.getElementById("telefon") || {}).value?.trim() || "",
      mesej: (document.getElementById("mesej") || {}).value?.trim() || "",
      website: hp ? hp.value : "",
      captchaOk: true
    };

    try {
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      if (msgContainer) {
        msgContainer.className = "msg ok";
        msgContainer.textContent = "Mesej berjaya dihantar!";
      }
      formHubungi.reset();
      buatCaptcha();
    } catch (err) {
      if (msgContainer) {
        msgContainer.className = "msg err";
        msgContainer.textContent =
          "Gagal berhubung dengan pelayan. Sila cuba lagi atau e-mel terus.";
      }
      buatCaptcha();
    }

    if (btnHantar) {
      btnHantar.disabled = false;
      btnHantar.textContent = "Hantar Mesej";
    }
  });
}

// ----- 5. CAROUSEL 3D — SERET DENGAN MOUSE / JARI -----
(function () {
  const container = document.querySelector(".carousel-container");
  const spinner = document.querySelector(".carousel-spinner");
  if (!container || !spinner) return;

  const KELAJUAN_AUTO = 360 / 28;
  const SENSITIVITI = 0.25;

  let sudut = 0;
  let kawalanJS = false;
  let sedangSeret = false;
  let hovering = false;
  let mulaX = 0;
  let sudutMula = 0;
  let sudutSebelum = 0;
  let halaju = 0;
  let jumlahGerakan = 0;
  let halangKlik = false;
  let frameSebelum = null;

  function dapatkanSudutCSS() {
    const t = getComputedStyle(spinner).transform;
    if (!t || t === "none") return 0;
    const m3 = t.match(/matrix3d\(([^)]+)\)/);
    if (m3) {
      const v = m3[1].split(",").map(Number);
      return (Math.atan2(-v[2], v[0]) * 180) / Math.PI;
    }
    const m2 = t.match(/matrix\(([^)]+)\)/);
    if (m2) {
      const v = m2[1].split(",").map(Number);
      return (Math.atan2(v[1], v[0]) * 180) / Math.PI;
    }
    return 0;
  }

  function terapkan() {
    spinner.style.transform = "rotateY(" + sudut + "deg)";
  }

  function ambilAlihKawalan() {
    if (kawalanJS) return;
    kawalanJS = true;
    sudut = dapatkanSudutCSS();
    spinner.style.animation = "none";
    terapkan();
  }

  function tickCarousel(now) {
    if (kawalanJS) {
      if (frameSebelum === null) frameSebelum = now;
      const dt = (now - frameSebelum) / 1000;
      const bingkai = dt * 60;
      frameSebelum = now;

      if (sedangSeret) {
        halaju = halaju * 0.7 + (sudut - sudutSebelum) * 0.3;
        sudutSebelum = sudut;
      } else if (Math.abs(halaju) > 0.3) {
        sudut += halaju * bingkai;
        halaju *= Math.pow(0.93, bingkai);
        terapkan();
      } else if (!hovering && !preferReduced) {
        sudut += KELAJUAN_AUTO * dt;
        terapkan();
      }
    }
    requestAnimationFrame(tickCarousel);
  }
  requestAnimationFrame(tickCarousel);

  spinner.addEventListener("pointerdown", function (e) {
    if (e.button !== undefined && e.button !== 0) return;
    ambilAlihKawalan();
    sedangSeret = true;
    hovering = false;
    mulaX = e.clientX;
    jumlahGerakan = 0;
    sudutMula = sudut;
    sudutSebelum = sudut;
    halaju = 0;
    frameSebelum = null;
    container.classList.add("dragging");
  });

  window.addEventListener("pointermove", function (e) {
    if (!sedangSeret) return;
    const dx = e.clientX - mulaX;
    jumlahGerakan = Math.max(jumlahGerakan, Math.abs(dx));
    sudut = sudutMula - dx * SENSITIVITI;
    terapkan();
  });

  function tamatSeretan() {
    if (!sedangSeret) return;
    sedangSeret = false;
    container.classList.remove("dragging");
    if (jumlahGerakan > 8) {
      halangKlik = true;
      setTimeout(function () {
        halangKlik = false;
      }, 120);
    }
  }

  window.addEventListener("pointerup", tamatSeretan);
  window.addEventListener("pointercancel", tamatSeretan);

  container.addEventListener(
    "click",
    function (e) {
      if (halangKlik) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  container.addEventListener("pointerenter", function () {
    if (!sedangSeret) hovering = true;
  });
  container.addEventListener("pointerleave", function () {
    hovering = false;
  });
})();

// ----- 6. TAHUN FOOTER -----
const tahunEl = document.getElementById("tahun");
if (tahunEl) tahunEl.textContent = new Date().getFullYear();

// =========================================================
// 7. BLOG PREVIEW + PRODUK SHOP (auto rotate)
// =========================================================
const BLOG_API =
  "https://script.google.com/macros/s/AKfycbyx_ovUg3Nuw6N49nve0zdToASgP3F-cTQClP0cIshCrvdWWcLox5IXtk55FfnVmRAG/exec";
const SHOP_API = "/api/produk";

function escHome(s) {
  return String(s ?? "").replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function shuffleHome(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function formatHargaHome(h) {
  const n = parseFloat(String(h).replace(/[^\d.]/g, ""));
  return isNaN(n) ? "0.00" : n.toFixed(2);
}

function isDirectImageHome(url) {
  if (!url) return false;
  if (/ibb\.co\/album\//i.test(url)) return false;
  if (/i\.ibb\.co\//i.test(url)) return true;
  return /\.(jpe?g|png|gif|webp)(\?|$)/i.test(url);
}

function coverOfPostHome(p) {
  if (isDirectImageHome(p.cover)) return p.cover;
  const imgs = Array.isArray(p.images) ? p.images : [];
  for (let i = 0; i < imgs.length; i++) {
    if (isDirectImageHome(imgs[i])) return imgs[i];
  }
  return "";
}

async function loadHomeBlog() {
  const grid = document.getElementById("homeBlogGrid");
  if (!grid) return;
  try {
    const r = await fetch(BLOG_API + "?action=list&_=" + Date.now());
    const d = await r.json();
    if (!d.ok || !Array.isArray(d.posts) || !d.posts.length) {
      grid.innerHTML =
        '<div class="home-loading">Belum ada artikel. <a href="/blog/" style="color:#38bdf8">Ke Blog</a></div>';
      return;
    }
    const picks = shuffleHome(d.posts).slice(0, 3);
    grid.innerHTML = picks
      .map(function (p) {
        const href = "/blog/" + encodeURIComponent(p.slug);
        const cover = coverOfPostHome(p);
        const img = cover
          ? '<img src="' + escHome(cover) + '" alt="" loading="lazy">'
          : '<div style="height:140px;background:rgba(15,23,42,.9);display:flex;align-items:center;justify-content:center;color:#64748b;font-size:.85rem">Artikel</div>';
        const kat = p.kategori || "Umum";
        return (
          '<a class="home-blog-card" href="' +
          href +
          '">' +
          img +
          '<div class="body">' +
          '<span class="kat">' +
          escHome(kat) +
          "</span>" +
          "<h3>" +
          escHome(p.title) +
          "</h3>" +
          '<p class="excerpt">' +
          escHome(p.excerpt || "") +
          "</p>" +
          "</div></a>"
        );
      })
      .join("");
  } catch (e) {
    grid.innerHTML =
      '<div class="home-loading">Gagal muat artikel. <a href="/blog/" style="color:#38bdf8">Ke Blog</a></div>';
  }
}

let allProdukHome = [];
let produkRotateTimerHome = null;

function renderHomeProduk(list) {
  const grid = document.getElementById("homeProdukGrid");
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML =
      '<div class="home-loading">Tiada produk. <a href="/shop/" style="color:#38bdf8">Ke Shop</a></div>';
    return;
  }
  grid.classList.add("is-swapping");
  setTimeout(function () {
    grid.innerHTML = list
      .map(function (p) {
        const id = p.id;
        const href =
          id != null
            ? "/shop/produk.html?id=" + encodeURIComponent(id)
            : "/shop/";
        const img = p.gambar || "";
        const badge = p.badge
          ? '<span class="badge">' + escHome(p.badge) + "</span>"
          : "";
        return (
          '<a class="home-produk-card" href="' +
          href +
          '">' +
          '<img src="' +
          escHome(img) +
          '" alt="" loading="lazy" onerror="this.style.opacity=.3">' +
          '<div class="body">' +
          badge +
          "<h3>" +
          escHome(p.nama || "Produk") +
          "</h3>" +
          '<div class="harga">RM ' +
          formatHargaHome(p.harga) +
          "</div>" +
          "</div></a>"
        );
      })
      .join("");
    grid.classList.remove("is-swapping");
  }, 280);
}

function rotateHomeProduk() {
  if (!allProdukHome.length) return;
  renderHomeProduk(shuffleHome(allProdukHome).slice(0, 4));
}

async function loadHomeProduk() {
  const grid = document.getElementById("homeProdukGrid");
  if (!grid) return;
  try {
    const r = await fetch(SHOP_API + "?_=" + Date.now());
    let data = await r.json();
    if (!Array.isArray(data)) data = data.produk || data.products || [];
    allProdukHome = data.filter(function (p) {
      return p && p.nama;
    });
    if (!allProdukHome.length) {
      grid.innerHTML =
        '<div class="home-loading">Tiada produk. <a href="/shop/" style="color:#38bdf8">Ke Shop</a></div>';
      return;
    }
    rotateHomeProduk();
    if (produkRotateTimerHome) clearInterval(produkRotateTimerHome);
    produkRotateTimerHome = setInterval(rotateHomeProduk, 8000);
  } catch (e) {
    grid.innerHTML =
      '<div class="home-loading">Gagal muat produk. <a href="/shop/" style="color:#38bdf8">Ke Shop</a></div>';
  }
}

// Jalankan bila DOM sedia (seksyen homeBlogGrid / homeProdukGrid wujud)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    loadHomeBlog();
    loadHomeProduk();
  });
} else {
  loadHomeBlog();
  loadHomeProduk();
}
