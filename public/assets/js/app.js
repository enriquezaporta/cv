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
    const readout = $("#rack-caption");
    const units = document.querySelectorAll(".rack .u");
    const idle = () => {
      readout.textContent = CV[state.lang].ui.rackCaption;
      units.forEach((u) => u.classList.remove("is-active"));
    };
    const show = (u) => {
      units.forEach((x) => x.classList.toggle("is-active", x === u));
      readout.textContent = CV[state.lang].rack[u.dataset.unit] || "";
    };
    units.forEach((u) => {
      u.addEventListener("mouseenter", () => show(u));
      u.addEventListener("focus", () => show(u));
      u.addEventListener("click", () => show(u));
      u.addEventListener("mouseleave", idle);
      u.addEventListener("blur", idle);
    });
    units.forEach((u) => u.setAttribute("aria-label", CV[state.lang].rack[u.dataset.unit] || ""));
    idle();
    return () => {
      units.forEach((u) => u.setAttribute("aria-label", CV[state.lang].rack[u.dataset.unit] || ""));
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
})();
