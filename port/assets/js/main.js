/* =========================================================
   การทำงานของหน้าเว็บ
   1. สร้างการ์ดผลงานจาก WORKS (assets/js/works-data.js)
   2. เปิด / ปิดเครื่องเล่นวิดีโอ
   3. เมนูมือถือ
   4. Header ตอนเลื่อนหน้า + ไฮไลต์เมนู + แถบความคืบหน้า
   5. Animation ตอนเลื่อนเข้า
   6. ลูกเล่นตามเมาส์: เอียงการ์ด, แสงfollow, parallax รูปโปรไฟล์
   7. ปุ่มคัดลอกอีเมล / ปุ่มกลับขึ้นด้านบน / ตัวเลขสถิติ
   ========================================================= */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- 1. สร้างการ์ดผลงาน ---------- */
  const PLAY_ICON = `
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M9 7.5v9l7.5-4.5L9 7.5Z" fill="currentColor"/>
    </svg>`;

  function youtubeThumb(id, type) {
    // คลิปสั้นใช้ oar2.jpg (แนวตั้ง) ส่วนคลิปยาวใช้ maxresdefault.jpg
    return type === "short"
      ? `https://i.ytimg.com/vi/${id}/oar2.jpg`
      : `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  }

  function createWorkCard(work, type) {
    const card = document.createElement("article");
    card.className = "work-card" + (type === "short" ? " work-card--short" : "");
    card.setAttribute("data-reveal", "");

    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "work-thumb";
    thumb.dataset.videoId = work.id;
    thumb.dataset.videoTitle = work.fullTitle || work.title;
    if (work.start) thumb.dataset.start = work.start;
    thumb.setAttribute("aria-label", `เล่นวิดีโอ ${work.title} (${work.badge})`);

    const img = document.createElement("img");
    img.className = "work-img";
    img.src = youtubeThumb(work.id, type);
    img.alt = `ภาพปกผลงาน ${work.title}`;
    img.loading = "lazy";
    img.width = type === "short" ? 270 : 480;
    img.height = type === "short" ? 480 : 360;

    // ค่อย ๆ ปรากฏเมื่อภาพโหลดเสร็จ
    img.addEventListener("load", () => img.classList.add("is-loaded"));

    // ถ้าภาพความละเอียดสูงไม่มี ให้ถอยไปใช้ hqdefault แทน
    img.addEventListener("error", function handleImageError() {
      if (img.dataset.fallbackUsed) {
        img.style.opacity = "0";
        return;
      }
      img.dataset.fallbackUsed = "true";
      img.src = `https://i.ytimg.com/vi/${work.id}/hqdefault.jpg`;
    });

    if (img.complete && img.naturalWidth > 0) img.classList.add("is-loaded");

    const overlay = document.createElement("span");
    overlay.className = "work-overlay";
    overlay.innerHTML = `<span class="play-btn">${PLAY_ICON}</span>`;

    const badge = document.createElement("span");
    badge.className = "work-badge";
    badge.textContent = work.badge;

    thumb.append(img, overlay, badge);

    const info = document.createElement("div");
    info.className = "work-info";

    const title = document.createElement("h4");
    title.textContent = work.title;
    if (work.fullTitle) title.title = work.fullTitle;

    const note = document.createElement("p");
    note.className = "work-meta";
    note.textContent = work.note;

    info.append(title, note);
    card.append(thumb, info);
    return card;
  }

  function renderWorks() {
    const lists = {
      long: document.getElementById("long-form-list"),
      short: document.getElementById("short-form-list"),
    };

    if (typeof WORKS === "undefined") return;

    Object.keys(lists).forEach((type) => {
      const container = lists[type];
      if (!container) return;

      WORKS[type].forEach((work) => {
        container.appendChild(createWorkCard(work, type));
      });
    });
  }

  renderWorks();

  /* ---------- 2. เครื่องเล่นวิดีโอ (Lightbox) ---------- */
  const lightbox = document.getElementById("lightbox");
  const frame = document.getElementById("lightbox-frame");
  const lightboxTitle = document.getElementById("lightbox-title");
  const closeBtn = document.getElementById("lightbox-close");
  let lastFocused = null;

  function openVideo(id, start, title) {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      modestbranding: "1",
    });
    if (start) params.set("start", start);

    lightboxTitle.textContent = title || "ผลงาน";
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
    lastFocused = document.activeElement;

    lightbox.showModal();
    document.body.classList.add("lightbox-open");
  }

  function closeVideo() {
    lightbox.close();
  }

  document.addEventListener("click", (event) => {
    const thumb = event.target.closest(".work-thumb");
    if (!thumb) return;

    openVideo(
      thumb.dataset.videoId,
      thumb.dataset.start,
      thumb.dataset.videoTitle
    );
  });

  closeBtn.addEventListener("click", closeVideo);

  // คลิกพื้นหลังสีดำเพื่อปิด
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeVideo();
  });

  // เมื่อปิดแล้ว ให้หยุดวิดีโอและคืน focus
  lightbox.addEventListener("close", () => {
    frame.src = "about:blank";
    document.body.classList.remove("lightbox-open");
    if (lastFocused) lastFocused.focus();
  });

  /* ---------- 3. เมนูมือถือ ---------- */
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  function closeMenu() {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "เปิดเมนู");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "ปิดเมนู" : "เปิดเมนู");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest(".nav-link")) closeMenu();
  });

  // คลิกนอกเมนูเพื่อปิด
  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) return;
    if (event.target.closest("#nav") || event.target.closest("#menu-toggle")) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });

  /* ---------- 4. Header + ไฮไลต์เมนู + แถบความคืบหน้า ---------- */
  const header = document.getElementById("site-header");
  const progressBar = document.getElementById("scroll-progress-bar");
  const toTop = document.getElementById("to-top");
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  let ticking = false;

  function updateOnScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);

    // แถบความคืบหน้า + ปุ่มกลับขึ้นด้านบน
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;
    toTop.classList.toggle("is-visible", window.scrollY > 600);

    const position = window.scrollY + header.offsetHeight + 100;
    let currentId = "";

    sections.forEach((section) => {
      if (section.offsetTop <= position) currentId = section.id;
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateOnScroll();

  toTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });

  /* ---------- 5. Animation ตอนเลื่อนเข้า ---------- */
  const revealItems = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ---------- 6. ลูกเล่นตามเมาส์ + ตัวเลขสถิติ ---------- */
  // เอียงการ์ดผลงานเล็กน้อยตามตำแหน่งเมาส์
  function initCardTilt() {
    if (!canHover || reduceMotion) return;

    document.querySelectorAll(".work-thumb").forEach((thumb) => {
      thumb.addEventListener("pointerenter", () => {
        thumb.classList.add("is-tilting");
      });

      thumb.addEventListener("pointermove", (event) => {
        const rect = thumb.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        thumb.style.transform =
          `perspective(760px) rotateX(${(-y * 4).toFixed(2)}deg) ` +
          `rotateY(${(x * 4).toFixed(2)}deg)`;
      });

      thumb.addEventListener("pointerleave", () => {
        thumb.classList.remove("is-tilting");
        thumb.style.transform = "";
      });
    });
  }

  // แสงเรือง ๆ เคลื่อนตามเมาส์บนการ์ดบริการ
  function initServiceSpotlight() {
    if (!canHover) return;

    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    });
  }

  // รูปโปรไฟล์ขยับตามเมาส์แบบเบา ๆ
  function initHeroParallax() {
    const visual = document.querySelector(".hero-visual");
    const portrait = document.querySelector(".portrait-frame");
    if (!visual || !portrait || !canHover || reduceMotion) return;

    visual.addEventListener("pointermove", (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      portrait.style.transition = "none";
      portrait.style.transform =
        `translate3d(${(x * 10).toFixed(1)}px, ${(y * 10).toFixed(1)}px, 0)`;
    });

    visual.addEventListener("pointerleave", () => {
      portrait.style.transition = "";
      portrait.style.transform = "";
    });
  }

  // นับเลขสถิติจาก 0 ขึ้นไปหาค่าจริง
  function runCounters() {
    if (reduceMotion) return;

    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const duration = 1000;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) window.requestAnimationFrame(tick);
      }

      window.requestAnimationFrame(tick);
    });
  }

  initCardTilt();
  initServiceSpotlight();
  initHeroParallax();

  if (document.readyState === "complete") {
    window.setTimeout(runCounters, 500);
  } else {
    window.addEventListener("load", () => window.setTimeout(runCounters, 500));
  }

  /* ---------- 7. ปุ่มคัดลอกอีเมล ---------- */
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.dataset.copy;
      const original = button.textContent;

      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        // fallback สำหรับเบราว์เซอร์เก่าหรือหน้าที่ไม่ใช่ https
        const input = document.createElement("textarea");
        input.value = text;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }

      button.textContent = "คัดลอกแล้ว";
      button.classList.add("is-copied");

      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove("is-copied");
      }, 2000);
    });
  });

  /* ---------- 8. ปีปัจจุบันใน Footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
