/* Render del CV a partir de content.js, cambio de idioma y rack interactivo. */
(function () {
  "use strict";

  const CV = window.CV;
  const $ = (sel, root = document) => root.querySelector(sel);

  // ---------- idioma ----------
  function storedLang() {
    try {
      return localStorage.getItem("cv-lang");
    } catch (_) {
      return null;
    }
  }
  function storeLang(lang) {
    try {
      localStorage.setItem("cv-lang", lang);
    } catch (_) {
      /* sin almacenamiento: no pasa nada */
    }
  }
  function initialLang() {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl === "es" || fromUrl === "en") return fromUrl;
    const saved = storedLang();
    if (saved === "es" || saved === "en") return saved;
    return (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en";
  }

  const state = { lang: initialLang() };

  // ---------- utilidades ----------
  const get = (obj, path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    }
    for (const c of [].concat(children)) {
      if (c == null) continue;
      node.append(c instanceof Node ? c : document.createTextNode(c));
    }
    return node;
  }

  function fmtMonth(ym, lang) {
    const [y, m] = ym.split("-").map(Number);
    const d = new Date(Date.UTC(y, m - 1, 1));
    const s = new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-GB", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(d);
    return s.replace(".", "");
  }
  function fmtRange(start, end, t, lang) {
    const a = fmtMonth(start, lang);
    const b = end ? fmtMonth(end, lang) : t.ui.present;
    return { text: `${a} – ${b}`, start, end };
  }

  function email() {
    return CV.email.join("@");
  }

  // ---------- render ----------
  function renderTimeline(list, items, t, lang, kind) {
    list.replaceChildren(
      ...items.map((it) => {
        const range = fmtRange(it.start, it.end, t, lang);
        const time = el("p", { class: "tl-date" }, [
          el("time", { datetime: it.start, text: range.text }),
        ]);
        const body = el("div", { class: "tl-body" });
        if (kind === "job") {
          body.append(
            el("h3", { class: "tl-title", text: it.role }),
            el("p", { class: "tl-org", text: it.company }),
            el("ul", { class: "tl-points" }, it.points.map((p) => el("li", { text: p })))
          );
        } else {
          body.append(
            el("h3", { class: "tl-title", text: it.title }),
            el("p", { class: "tl-org", text: it.school })
          );
        }
        return el("li", { class: "tl-item" + (it.end ? "" : " is-current") }, [time, body]);
      })
    );
  }

  function renderProjects(t) {
    $("#list-projects").replaceChildren(
      ...t.projects.map((p) =>
        el("article", { class: "project", id: "project-" + p.id }, [
          el("div", { class: "project-text" }, [
            el("h3", { class: "project-name", text: p.name }),
            el("p", { class: "project-desc", text: p.text }),
            el("p", { class: "project-stack", text: p.stack.join(", ") }),
            el("a", { class: "project-link", href: p.repo, rel: "noopener" }, [
              t.ui.repo,
              el("span", { class: "print-url", text: " " + p.repo.replace("https://", "") }),
            ]),
          ]),
          el("a", { class: "project-shot", href: p.repo, rel: "noopener", tabindex: "-1", "aria-hidden": "true" }, [
            el("img", { src: p.img, alt: "", loading: "lazy", width: "1200", height: "750" }),
          ]),
        ])
      )
    );
  }

  function renderHomelab(t) {
    $("#list-homelab").replaceChildren(
      ...t.homelab.flatMap((h) => [
        el("dt", { text: h.title }),
        el("dd", { text: h.text }),
      ])
    );
  }

  function renderSkills(t) {
    const groups = t.skills.map((g) =>
      el("div", { class: "skill-group" }, [
        el("dt", { text: g.group }),
        el("dd", { text: g.items.join(", ") }),
      ])
    );
    groups.push(
      el("div", { class: "skill-group" }, [
        el("dt", { text: t.ui.languages }),
        el("dd", { text: t.languages.map((l) => `${l.name} (${l.level})`).join(", ") }),
      ]),
      el("div", { class: "skill-group" }, [
        el("dt", { text: t.ui.other }),
        el("dd", { text: t.other.join(", ") }),
      ])
    );
    $("#list-skills").replaceChildren(...groups);
  }

  function renderStatic(t) {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const v = get(t, node.dataset.i18n);
      if (typeof v === "string") node.textContent = v;
    });
    document.title = t.meta.title;
    $('meta[name="description"]').setAttribute("content", t.meta.description);

    $("#hero-name").textContent = t.hero.name;
    $("#hero-role").textContent = t.hero.role;
    $("#hero-location").textContent = t.hero.location;
    $("#hero-summary").textContent = t.hero.summary;

    const langBtn = $("#btn-lang");
    langBtn.textContent = t.ui.langSwitch;
    langBtn.setAttribute("lang", state.lang === "es" ? "en" : "es");
    langBtn.setAttribute("aria-label", t.ui.langSwitchLabel);

    $("#here-text").textContent = t.ui.youAreHere;
    $("#term-close").setAttribute("aria-label", state.lang === "es" ? "Cerrar" : "Close");
    $(".nav").setAttribute("aria-label", state.lang === "es" ? "Secciones" : "Sections");
  }

  function renderLinks() {
    const mail = "mailto:" + email();
    $("#btn-email").href = mail;
    const ce = $("#contact-email");
    ce.href = mail;
    ce.textContent = email();
    for (const id of ["link-linkedin", "contact-linkedin"]) $("#" + id).href = CV.links.linkedin;
    for (const id of ["link-github", "contact-github"]) $("#" + id).href = CV.links.github;
    $("#contact-linkedin").textContent = "linkedin.com/in/enrique-zaporta-sierra";
    $("#contact-github").textContent = "github.com/enriquezaporta";
    $("#print-contact").textContent = [
      email(),
      "linkedin.com/in/enrique-zaporta-sierra",
      "github.com/enriquezaporta",
      "dev.enriquezaporta.es",
    ].join("   |   ");
    $("#link-source").href = CV.links.source;
    $("#footer-year").textContent = "© " + new Date().getFullYear();
  }

  // ---------- rack ----------
  function setupRack() {
    const SVGNS = "http://www.w3.org/2000/svg";
    const svg = $(".rack");
    const readout = $("#rack-caption");
    const units = [...document.querySelectorAll(".rack .u")];
    const drawer = $("#rack-drawer");
    const packet = $("#rack-packet");
    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const R = () => CV[state.lang].rack;
    let pinned = null;
    let openNode = null;

    const CTS = {
      pve1: [["100", "monitor"], ["110", "dns"], ["111", "proxy"], ["112", "vpn"], ["113", "docs"]],
      pve2: [["120", "gym"], ["121", "pesca"], ["122", "compra"]],
      pve3: [["130", "tackboard"], ["131", "cv"]],
    };
    const el = (tag, attrs) => {
      const n = document.createElementNS(SVGNS, tag);
      for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
      return n;
    };
    const unitY = (u) => +u.querySelector("rect").getAttribute("y");
    const pulse = (node, cls, ms) => {
      node.classList.remove(cls);
      void node.getBoundingClientRect();
      node.classList.add(cls);
      setTimeout(() => node.classList.remove(cls), ms);
    };

    // ---- lectura de texto ----
    const idle = () => {
      if (pinned) return;
      readout.textContent = CV[state.lang].ui.rackCaption;
      units.forEach((u) => u.classList.remove("is-active"));
    };
    const show = (u) => {
      units.forEach((x) => x.classList.toggle("is-active", x === u));
      readout.textContent = R()[u.dataset.unit] || "";
    };

    // ---- cajón de los nodos ----
    function closeDrawer() {
      if (!openNode) return;
      openNode.classList.remove("is-open");
      drawer.classList.remove("is-open");
      openNode = null;
      setTimeout(() => { if (!openNode) drawer.replaceChildren(); }, 300);
    }
    function openDrawer(u) {
      if (openNode === u) return closeDrawer();
      closeDrawer();
      const name = u.dataset.unit;
      const cts = CTS[name];
      const y = unitY(u) + 36;
      const h = 22 + cts.length * 17 + 6;
      drawer.replaceChildren();
      drawer.append(el("rect", { class: "tray", x: 46, y, width: 168, height: h, rx: 3 }));
      const title = el("text", { class: "tray-title", x: 56, y: y + 15 });
      title.textContent = `${name} · ${cts.length} CT`;
      drawer.append(title);
      cts.forEach(([id, ct], i) => {
        const ry = y + 22 + i * 17;
        drawer.append(el("rect", { class: "tray-row", x: 54, y: ry, width: 152, height: 14, rx: 2 }));
        const led = el("circle", { class: "tray-led", cx: 62, cy: ry + 7, r: 2.2 });
        led.style.animationDelay = `${(i * 0.37) % 1.3}s`;
        drawer.append(led);
        const t = el("text", { class: "tray-text", x: 70, y: ry + 10.5 });
        t.textContent = `CT ${id}  ${ct}`;
        drawer.append(t);
        if (ct === "cv") {
          const here = el("text", { class: "tray-here", x: 200, y: ry + 10.5, "text-anchor": "end" });
          here.textContent = "◀ " + R().here;
          drawer.append(here);
        }
      });
      drawer.style.setProperty("--tray-origin", `${y}px`);
      void drawer.getBoundingClientRect();
      drawer.classList.add("is-open");
      u.classList.add("is-open");
      openNode = u;
    }

    // ---- switch: ráfaga de tráfico y un paquete hacia un nodo ----
    let packetAnim = null;
    function sendPacket() {
      const leds = u_("switch").querySelectorAll(".led");
      leds.forEach((l, i) => { l.style.animationDelay = `${i * 0.05}s`; });
      pulse(u_("switch"), "burst", 1400);
      if (reduced()) return;
      const targets = ["pve1", "pve2", "pve3"].map(u_);
      const target = targets[Math.floor(Math.random() * targets.length)];
      const y0 = 86, y1 = unitY(target) + 18;
      const x = 206;
      const t0 = performance.now(), dur = 900;
      cancelAnimationFrame(packetAnim);
      packet.classList.add("is-flying");
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        packet.setAttribute("cx", x);
        packet.setAttribute("cy", y0 + (y1 - y0) * e);
        if (k < 1) packetAnim = requestAnimationFrame(step);
        else {
          packet.classList.remove("is-flying");
          pulse(target, "hit", 700);
        }
      };
      packetAnim = requestAnimationFrame(step);
    }

    // ---- pantalla: nuevas métricas ----
    const spark = $(".rack .spark");
    const screenText = $(".rack .screen-text");
    let sparkAnim = null;
    function refreshScreen() {
      const from = spark.getAttribute("points").trim().split(/\s+/).map((p) => p.split(",").map(Number));
      let v = 150;
      const to = from.map(([x]) => { v = Math.max(126, Math.min(168, v + (Math.random() * 18 - 9))); return [x, Math.round(v)]; });
      const cpu = Math.round(4 + Math.random() * 30), temp = Math.round(38 + Math.random() * 14);
      screenText.textContent = `cpu ${cpu}% · ${temp}°C`;
      pulse(u_("screen"), "flash", 500);
      if (reduced()) return spark.setAttribute("points", to.map((p) => p.join(",")).join(" "));
      const t0 = performance.now(), dur = 600;
      cancelAnimationFrame(sparkAnim);
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        spark.setAttribute("points", from.map(([x, y], i) => `${x},${(y + (to[i][1] - y) * k).toFixed(1)}`).join(" "));
        if (k < 1) sparkAnim = requestAnimationFrame(step);
      };
      sparkAnim = requestAnimationFrame(step);
      clearTimeout(refreshScreen.t);
      refreshScreen.t = setTimeout(() => { screenText.textContent = "pve · ok"; }, 4000);
    }

    // ---- panel de parcheo: los puertos se conectan uno a uno ----
    function patchPorts() {
      const ports = u_("patch").querySelectorAll(".ports rect");
      ports.forEach((p, i) => { p.style.animationDelay = `${i * 0.08}s`; });
      pulse(u_("patch"), "linking", 1600);
    }

    // ---- PDU: arranque en secuencia de todo el rack ----
    function powerOn(u) {
      const sockets = u.querySelectorAll(".sockets rect");
      sockets.forEach((s, i) => { s.style.animationDelay = `${i * 0.1}s`; });
      pulse(u, "powering", 1200);
      const leds = [...svg.querySelectorAll(".led")].sort((a, b) => +a.getAttribute("cy") - +b.getAttribute("cy"));
      leds.forEach((l, i) => { l.style.setProperty("--boot-delay", `${0.5 + i * 0.06}s`); });
      pulse(svg, "booting", 2200);
    }

    function u_(name) { return units.find((u) => u.dataset.unit === name); }

    function activate(u) {
      pinned = u;
      show(u);
      const name = u.dataset.unit;
      if (name.startsWith("pve")) openDrawer(u);
      else {
        closeDrawer();
        if (name === "switch") sendPacket();
        else if (name === "screen") refreshScreen();
        else if (name === "patch") patchPorts();
        else if (name === "pdu") powerOn(u);
        else if (name === "blank") pulse(u, "wiggle", 500);
      }
    }

    units.forEach((u) => {
      u.addEventListener("mouseenter", () => { if (!pinned) show(u); });
      u.addEventListener("mouseleave", idle);
      u.addEventListener("click", (e) => { e.stopPropagation(); activate(u); });
      u.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(u); }
      });
      u.addEventListener("focus", () => { if (!pinned) show(u); });
      u.addEventListener("blur", idle);
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".rack")) { pinned = null; closeDrawer(); idle(); }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && (pinned || openNode)) { pinned = null; closeDrawer(); idle(); }
    });

    const labels = () => units.forEach((u) => u.setAttribute("aria-label", R()[u.dataset.unit] || ""));
    labels();
    idle();
    return () => {
      labels();
      pinned = null;
      closeDrawer();
      idle();
    };
  }

  // ---------- ciclo ----------
  let refreshRack = null;

  function render() {
    const t = CV[state.lang];
    document.documentElement.lang = state.lang;
    renderStatic(t);
    renderTimeline($("#list-experience"), t.experience, t, state.lang, "job");
    renderTimeline($("#list-education"), t.education, t, state.lang, "edu");
    renderProjects(t);
    renderHomelab(t);
    renderSkills(t);
    if (refreshRack) refreshRack();
    document.dispatchEvent(new CustomEvent("cv:lang", { detail: state.lang }));
  }

  function setLang(lang) {
    if (lang !== "es" && lang !== "en") return;
    state.lang = lang;
    storeLang(lang);
    render();
  }

  // API mínima para la terminal
  window.CVApp = {
    get lang() {
      return state.lang;
    },
    setLang,
    email,
    fmtRange: (s, e) => fmtRange(s, e, CV[state.lang], state.lang).text,
  };

  renderLinks();
  refreshRack = setupRack();
  render();

  $("#btn-lang").addEventListener("click", () => setLang(state.lang === "es" ? "en" : "es"));
  $("#btn-print").addEventListener("click", () => window.print());

  // ---------- código Konami: modo fiesta en el rack ----------
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kpos = 0;
  function toast(text) {
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = text;
    document.body.append(el);
    setTimeout(() => el.classList.add("is-out"), 3200);
    setTimeout(() => el.remove(), 3800);
  }
  document.addEventListener("keydown", (e) => {
    if (document.documentElement.classList.contains("term-open")) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kpos = k === KONAMI[kpos] ? kpos + 1 : k === KONAMI[0] ? 1 : 0;
    if (kpos < KONAMI.length) return;
    kpos = 0;
    const on = document.documentElement.classList.toggle("party");
    const msg = window.CVEggs && window.CVEggs.mark("konami", true);
    toast(msg || (on ? (state.lang === "es" ? "Modo fiesta activado" : "Party mode on") : (state.lang === "es" ? "Modo fiesta desactivado" : "Party mode off")));
  });
})();
