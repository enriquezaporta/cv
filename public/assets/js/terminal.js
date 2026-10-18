/* Modo terminal: el mismo CV, navegable con comandos. */
(function () {
  "use strict";

  const CV = window.CV;
  const App = window.CVApp;
  const dlg = document.getElementById("terminal");
  const out = document.getElementById("term-out");
  const form = document.getElementById("term-form");
  const input = document.getElementById("term-input");
  const body = document.getElementById("term-body");

  const history = [];
  let hIndex = 0;
  let started = false;

  const t = () => CV[App.lang];

  // ---------- salida ----------
  function line(text = "", cls) {
    const p = document.createElement("div");
    p.className = "t-line" + (cls ? " " + cls : "");
    p.textContent = text;
    out.append(p);
    return p;
  }
  function link(label, href) {
    const p = document.createElement("div");
    p.className = "t-line";
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    if (!href.startsWith("mailto:")) a.rel = "noopener";
    a.target = href.startsWith("mailto:") ? "_self" : "_blank";
    p.append(a);
    out.append(p);
  }
  function heading(text) {
    line(text, "t-head");
  }
  function scrollEnd() {
    body.scrollTop = body.scrollHeight;
  }

  // ---------- comandos ----------
  const commands = {
    help() {
      heading(t().terminal.help);
      const cmds = t().terminal.cmds;
      const width = Math.max(...Object.keys(cmds).map((k) => k.length)) + 3;
      for (const [k, v] of Object.entries(cmds)) line("  " + k.padEnd(width) + v);
      line();
      line(t().terminal.hint, "t-dim");
    },
    whoami() {
      const h = t().hero;
      heading(h.name);
      line(h.role);
      line(h.location, "t-dim");
      line();
      line(h.summary);
    },
    experience() {
      for (const j of t().experience) {
        heading(j.role);
        line(`${j.company}  [${App.fmtRange(j.start, j.end)}]`, "t-dim");
        for (const p of j.points) line("  - " + p);
        line();
      }
    },
    projects() {
      for (const p of t().projects) {
        heading(p.name);
        line(p.text);
        line(p.stack.join(", "), "t-dim");
        link(p.repo.replace("https://", ""), p.repo);
        line();
      }
    },
    homelab() {
      heading(t().sections.homelab);
      line(t().sections.homelabIntro);
      line();
      for (const h of t().homelab) {
        line("* " + h.title, "t-accent");
        line("  " + h.text);
      }
    },
    skills() {
      for (const g of t().skills) {
        line(g.group, "t-accent");
        line("  " + g.items.join(", "));
      }
      line(t().ui.languages, "t-accent");
      line("  " + t().languages.map((l) => `${l.name} (${l.level})`).join(", "));
    },
    education() {
      for (const e of t().education) {
        heading(e.title);
        line(`${e.school}  [${App.fmtRange(e.start, e.end)}]`, "t-dim");
      }
    },
    contact() {
      link(App.email(), "mailto:" + App.email());
      link("linkedin.com/in/enrique-zaporta-sierra", CV.links.linkedin);
      link("github.com/enriquezaporta", CV.links.github);
    },
    lang(arg) {
      if (arg !== "es" && arg !== "en") return line(t().terminal.langUsage, "t-err");
      App.setLang(arg);
      line(t().terminal.langChanged);
    },
    clear() {
      out.replaceChildren();
    },
    exit() {
      line(t().terminal.bye, "t-dim");
      setTimeout(close, 250);
    },
  };

  // Comandos ocultos
  const hidden = {
    ls: () => line(Object.keys(commands).join("  ")),
    pwd: () => line("/home/kike"),
    date: () => line(new Date().toString()),
    echo: (...args) => line(args.join(" ")),
    uname: () => line("Linux cv 6.x pve3 x86_64 GNU/Linux"),
    neofetch() {
      [
        "  ┌──────────┐   kike@cv",
        "  │ ▪▪▪▪▪▪▪▪ │   OS: Debian 13 (LXC)",
        "  │ ▬▬▬▬▬▬▬▬ │   Host: Proxmox VE · pve3",
        "  │ ▫ pve1   │   Web: nginx + Cloudflare Tunnel",
        "  │ ▫ pve2   │   Shell: cv.js",
        "  │ ▪ pve3 ◂ │   Uptime: since 2026",
        "  └──────────┘",
      ].forEach((l) => line(l, "t-accent"));
    },
    sudo(...args) {
      if (args.join(" ") === "hire-me") {
        line(t().terminal.hire.replace("{email}", App.email()), "t-accent");
      } else {
        line("kike is not in the sudoers file. This incident will be reported.", "t-err");
      }
    },
  };

  function run(raw) {
    const text = raw.trim();
    const p = document.createElement("div");
    p.className = "t-line t-cmd";
    const pr = document.createElement("span");
    pr.className = "t-prompt";
    pr.textContent = "kike@cv:~$ ";
    p.append(pr, document.createTextNode(text));
    out.append(p);
    if (!text) return scrollEnd();

    history.push(text);
    hIndex = history.length;

    const [cmd, ...args] = text.split(/\s+/);
    const name = cmd.toLowerCase();
    const fn = commands[name] || hidden[name];
    if (fn) fn(...args);
    else line(t().terminal.notFound.replace("{cmd}", cmd), "t-err");
    scrollEnd();
  }

  function complete() {
    const v = input.value.trim().toLowerCase();
    if (!v) return;
    const match = Object.keys(commands).filter((c) => c.startsWith(v));
    if (match.length === 1) input.value = match[0] + " ";
    else if (match.length > 1) {
      line(match.join("  "), "t-dim");
      scrollEnd();
    }
  }

  // ---------- abrir / cerrar ----------
  function open() {
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add("term-open");
    if (!started) {
      started = true;
      line(t().terminal.welcome, "t-accent");
      line();
      run("whoami");
    }
    input.focus();
  }
  function close() {
    if (dlg.open) dlg.close();
  }

  dlg.addEventListener("close", () => {
    document.documentElement.classList.remove("term-open");
    document.getElementById("btn-terminal").focus();
  });
  document.getElementById("btn-terminal").addEventListener("click", open);
  document.getElementById("term-close").addEventListener("click", close);
  body.addEventListener("click", (e) => {
    if (e.target.tagName !== "A" && !window.getSelection().toString()) input.focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    run(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      if (hIndex > 0) input.value = history[--hIndex];
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (hIndex < history.length - 1) input.value = history[++hIndex];
      else {
        hIndex = history.length;
        input.value = "";
      }
      e.preventDefault();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      commands.clear();
    }
  });

  // Atajo: tecla ` fuera de campos de texto
  document.addEventListener("keydown", (e) => {
    if (e.key === "`" && !dlg.open && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault();
      open();
    }
  });

  // Abrir directamente con dev.enriquezaporta.es/#terminal
  if (location.hash === "#terminal") open();
})();
