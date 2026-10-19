/* Modo terminal: el CV como un pequeño sistema de archivos, con comandos
   de administrador de mentira y unos cuantos easter eggs. */
(function () {
  "use strict";

  const CV = window.CV;
  const App = window.CVApp;
  const dlg = document.getElementById("terminal");
  const out = document.getElementById("term-out");
  const form = document.getElementById("term-form");
  const input = document.getElementById("term-input");
  const body = document.getElementById("term-body");
  const promptEl = document.querySelector(".term-prompt");
  const titleEl = document.querySelector(".term-title");

  const t = () => CV[App.lang];
  const es = () => App.lang === "es";
  const T = (a, b) => (es() ? a : b);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ------------------------------------------------------------ almacenamiento
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* sin almacenamiento */ } },
  };

  // ------------------------------------------------------------ logros
  const EGGS = [
    ["rmrf", "Borrón y cuenta nueva", "Clean slate"],
    ["dnsbak", "Arqueología de DNS", "DNS archaeology"],
    ["caddy", "Eternal grace period", "Eternal grace period"],
    ["vim", "Escapaste de vim", "Escaped vim"],
    ["sudo", "Chivatazo", "Snitched on"],
    ["hire", "sudo hire-me", "sudo hire-me"],
    ["fish", "Primera captura", "First catch"],
    ["lap", "Vuelta rápida", "Fastest lap"],
    ["gym", "Día de pierna", "Leg day"],
    ["teapot", "Soy una tetera", "I'm a teapot"],
    ["matrix", "Pastilla roja", "Red pill"],
    ["konami", "Modo fiesta", "Party mode"],
    ["secret", "Lo encontraste", "You found it"],
  ];
  const HINTS = {
    rmrf: ["Hay un comando que nadie debería ejecutar en un servidor.", "There's a command nobody should ever run on a server.",
           "Prueba a borrarlo todo: rm -rf /", "Try deleting everything: rm -rf /"],
    dnsbak: ["Los logs de /var/log cuentan una tragedia doméstica.", "The logs in /var/log tell a household tragedy.",
             "Lee la copia de seguridad que tumbó el DNS, en /etc/dnsmasq.d/", "Read the backup that killed the DNS, in /etc/dnsmasq.d/"],
    caddy: ["Al proxy le cuesta mucho recargar. Compruébalo tú mismo.", "The proxy has a hard time reloading. See for yourself.",
            "systemctl reload caddy, y cuando te aburras, Ctrl+C", "systemctl reload caddy, and when you get bored, Ctrl+C"],
    vim: ["Entrar en cierto editor es fácil. Salir, no tanto.", "Getting into a certain editor is easy. Getting out, not so much.",
          "Escribe vim y busca la salida (pista: q!)", "Type vim and find the way out (hint: q!)"],
    sudo: ["Pedir permisos de administrador sin tenerlos tiene consecuencias.", "Asking for admin rights you don't have has consequences.",
           "Usa sudo con cualquier comando tres veces seguidas", "Use sudo with any command three times in a row"],
    hire: ["Mira bien el archivo de contacto.", "Read the contact file carefully.",
           "sudo hire-me", "sudo hire-me"],
    fish: ["El autor pesca a feeder los fines de semana.", "The author goes feeder fishing at weekends.",
           "Escribe pescar (o feeder)", "Type fish (or feeder)"],
    lap: ["Trabaja en un circuito. ¿Te das una vuelta?", "He works at a race track. Fancy a lap?",
          "Escribe el nombre del circuito: motorland", "Type the name of the track: motorland"],
    gym: ["Hay un gimnasio en el garaje. Y hoy toca lo que toca.", "There's a gym in the garage. And today is what it is.",
          "Escribe gym", "Type gym"],
    teapot: ["Este servidor no sirve bebidas calientes. Pruébalo.", "This server doesn't serve hot drinks. Try it.",
             "Pídele un café: coffee", "Ask it for a coffee: coffee"],
    matrix: ["¿Pastilla roja o azul?", "Red pill or blue pill?",
             "Escribe matrix", "Type matrix"],
    konami: ["Un código de los videojuegos de los 80 funciona en la página principal.", "An 80s video game code works on the main page.",
             "Cierra la terminal y teclea ↑ ↑ ↓ ↓ ← → ← → B A", "Close the terminal and type ↑ ↑ ↓ ↓ ← → ← → B A"],
    secret: ["Hay archivos que ls no enseña por defecto.", "Some files don't show up with a plain ls.",
             "ls -a, abre la nota de .secreto/ y descífrala con base64 -d", "ls -a, open the note in .secreto/ and decode it with base64 -d"],
  };
  let found = new Set(store.get("cv-eggs", []));
  function mark(id, silent) {
    if (found.has(id)) return false;
    found.add(id);
    store.set("cv-eggs", [...found]);
    const egg = EGGS.find((e) => e[0] === id);
    const name = egg ? T(egg[1], egg[2]) : id;
    const msg = `★ ${T("Logro desbloqueado", "Achievement unlocked")}: ${name} (${found.size}/${EGGS.length})`;
    if (!silent && dlg.open) line(msg, "t-egg");
    return msg;
  }
  window.CVEggs = { mark, get count() { return found.size; }, total: EGGS.length };

  // ------------------------------------------------------------ salida
  function line(text = "", cls) {
    const p = document.createElement("div");
    p.className = "t-line" + (cls ? " " + cls : "");
    p.textContent = text;
    out.append(p);
    scrollEnd();
    return p;
  }
  function lines(arr, cls) { arr.forEach((l) => line(l, cls)); }
  function link(label, href, cls) {
    const p = document.createElement("div");
    p.className = "t-line" + (cls ? " " + cls : "");
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    if (href.startsWith("mailto:")) a.target = "_self";
    else { a.target = "_blank"; a.rel = "noopener"; }
    p.append(a);
    out.append(p);
    scrollEnd();
  }
  const heading = (s) => line(s, "t-head");
  function scrollEnd() { body.scrollTop = body.scrollHeight; }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ------------------------------------------------------------ sistema de archivos
  const HOME = "/home/kike";
  const JOB_SLUGS = ["insinec-motorland.md", "siba-informatica.md", "ceip-concepcion-gimeno.md"];
  const EDU_SLUGS = ["daw.txt", "smr.txt", "eso.txt"];
  const SECRET = "U2VjcmV0byBlbmNvbnRyYWRvLiBTaSBtZSBlc2NyaWJlcyBhIGVucmlxdWV6YXBvcnRhQGdtYWlsLmNvbSBjb24gbGEgcGFsYWJyYSAiZmVlZGVyIiBlbiBlbCBhc3VudG8sIHNhYnLDqSBxdWUgaGFzIGxsZWdhZG8gaGFzdGEgYXF1w60u";
  const dir = (children) => ({ type: "dir", children });
  const file = (content, extra) => Object.assign({ type: "file", content }, extra || {});

  const RACK_ROWS = [
    "U1   ▪▪▪▪▪▪▪▪   patch panel",
    "U2   ●●●●○○●●   switch 8×1 GbE",
    "U3   ┌──────┐",
    "U4   │pve·ok│   kiosk 1280×400",
    "U5   ░░░░░░░░",
    "U6   ▬▬▬▬ ●     pve1",
    "U7   ▬▬▬▬ ●     pve2",
    "U8   ▬▬▬▬ ◉     pve3",
    "U9   ░░░░░░░░",
    "U10  ░░░░░░░░",
    "U11  ▢▢▢▢▢ ●    PDU",
    "U12  ▢▢▢▢▢ ●    PDU",
  ];
  const RACK_W = 34;
  const RACK = [
    "┌" + "─".repeat(RACK_W + 2) + "┐",
    ...RACK_ROWS.map((r) => "│ " + r.padEnd(RACK_W) + " │"),
    "└" + "─".repeat(RACK_W + 2) + "┘",
  ];

  function buildFS() {
    const L = t();
    const home = {};
    home[T("sobre-mi.txt", "about.txt")] = file(() => [L.hero.name, L.hero.role, L.hero.location, "", L.hero.summary]);
    home[T("contacto.txt", "contact.txt")] = file(() => [
      `email:    ${App.email()}`, "linkedin: linkedin.com/in/enrique-zaporta-sierra", "github:   github.com/enriquezaporta",
      "", T("Tip: prueba 'sudo hire-me'.", "Tip: try 'sudo hire-me'."),
    ]);

    const exp = {};
    L.experience.forEach((j, i) => {
      exp[JOB_SLUGS[i] || `job-${i}.md`] = file(() => [`# ${j.role}`, `${j.company} · ${App.fmtRange(j.start, j.end)}`, "", ...j.points.map((p) => "- " + p)]);
    });
    home[T("experiencia", "experience")] = dir(exp);

    const proj = {};
    L.projects.forEach((p) => {
      proj[p.id] = dir({
        "README.md": file(() => [`# ${p.name}`, "", p.text, "", p.repo], { url: p.repo }),
        "stack.txt": file(() => p.stack.map((s) => "· " + s)),
      });
    });
    home[T("proyectos", "projects")] = dir(proj);

    const edu = {};
    L.education.forEach((e, i) => {
      edu[EDU_SLUGS[i] || `edu-${i}.txt`] = file(() => [e.title, `${e.school} · ${App.fmtRange(e.start, e.end)}`]);
    });
    home[T("formacion", "education")] = dir(edu);

    const ct = (name, ip, what) => file(() => [`hostname: ${name}`, `ip:       ${ip}`, `${T("función", "role")}:  ${what}`]);
    home.homelab = dir({
      "rack.txt": file(() => [...RACK.slice(0, 8), RACK[8] + " ◀ " + T("estás aquí", "you are here"), ...RACK.slice(9), "", T("DeskPi RackMate T2 · 10 pulgadas · 12U", "DeskPi RackMate T2 · 10-inch · 12U")]),
      "red.txt": file(() => [
        T("# Red de ejemplo (las IPs reales no se publican)", "# Sample network (real IPs are not published)"),
        "10.0.0.1     router",
        "10.0.0.20    pve1   (" + T("gestión", "management") + ")",
        "10.0.0.21    pve2",
        "10.0.0.22    pve3",
        "",
        T("Entrada desde internet: túnel de Cloudflare + WireGuard. Cero puertos web abiertos.", "Inbound: Cloudflare tunnel + WireGuard. Zero web ports open."),
      ]),
      pve1: dir({
        "dns.conf": ct("dns", "10.0.0.32", "dnsmasq · *.lab"),
        "proxy.conf": ct("proxy", "10.0.0.33", "Caddy · Let's Encrypt *.lab"),
        "vpn.conf": ct("vpn", "10.0.0.50", "WireGuard"),
        "monitor.conf": ct("monitor", "10.0.0.31", "InfluxDB + Grafana"),
      }),
      pve2: dir({
        "gym.conf": ct("gym", "10.0.0.40", "Garage Gym"),
        "pesca.conf": ct("pesca", "10.0.0.41", "Calendario de Pesca"),
        "compra.conf": ct("compra", "10.0.0.43", "Compra"),
      }),
      pve3: dir({
        "tackboard.conf": ct("tackboard", "10.0.0.42", "Tackboard"),
        "cv.conf": ct("cv", "10.0.0.44", T("esta web (aislada por firewall)", "this site (firewalled off)")),
      }),
    });
    home[".secreto"] = dir({
      "nota.txt": file(() => [
        T("Si has llegado hasta aquí, eres de los míos.", "If you made it this far, you're one of us."),
        T("Descifra esto:", "Decode this:"),
        "",
        SECRET,
        "",
        T("(pista: base64 -d <texto>)", "(hint: base64 -d <text>)"),
      ]),
    });
    home[".bash_history"] = file(() => HISTORY.concat(history));

    return dir({
      home: dir({ kike: dir(home) }),
      etc: dir({
        hostname: file(() => ["cv"]),
        motd: file(() => [
          "  ____ _   __",
          " / ___| | / /   cv · Debian 13 (LXC) · pve3",
          "| |   | |/ /    " + T("Si lees esto, ya vas por buen camino.", "If you're reading this, you're on the right track."),
          "| |___|   <",
          " \\____|_|\\_\\",
        ]),
        "dnsmasq.d": dir({
          "homelab.conf": file(() => ["listen-address=127.0.0.1,10.0.0.32", "local=/lab.enriquezaporta.es/", "domain=lab.enriquezaporta.es"]),
          "homelab.conf.bak": file(() => {
            mark("dnsbak");
            return [
              "# ─────────────────────────────────────────",
              T("#  Aquí murió el DNS de toda la casa.", "#  Here lies the whole house's DNS."),
              "#  19/10/2026 · DEP · RIP",
              T("#  Causa: una copia de seguridad en la carpeta equivocada.", "#  Cause: a backup in the wrong folder."),
              T("#  Lección: dnsmasq lee TODO lo que hay en /etc/dnsmasq.d/", "#  Lesson: dnsmasq reads EVERYTHING in /etc/dnsmasq.d/"),
              "# ─────────────────────────────────────────",
            ];
          }),
        }),
        shadow: file(() => [T("Ni de broma.", "Nice try.")]),
      }),
      var: dir({
        log: dir({
          "homelab.log": file(() => [
            "oct 18 18:35 pve3 pct[131]: Detected container architecture: arm64",
            T("oct 18 18:36 kike: ...¿arm64?", "oct 18 18:36 kike: ...arm64?"),
            "oct 18 18:58 pve3 pct[131]: status: running",
            "oct 19 14:57 proxy caddy: servers shutting down with eternal grace period",
            T("oct 19 14:58 kike: ¿por qué no responde la terminal?", "oct 19 14:58 kike: why is the terminal frozen?"),
            "oct 19 15:02 dns systemd: dnsmasq.service: Failed with result 'exit-code'",
            T("oct 19 15:02 casa: no hay internet", "oct 19 15:02 house: no internet"),
            "oct 19 15:03 dns systemd: Started dnsmasq.service",
            T("oct 19 15:03 casa: vuelve a haber internet", "oct 19 15:03 house: internet is back"),
            T("oct 19 15:04 kike: el culpable sigue en /etc/dnsmasq.d/homelab.conf.bak. Que no se toque.", "oct 19 15:04 kike: the culprit is still at /etc/dnsmasq.d/homelab.conf.bak. Do not touch."),
          ]),
        }),
      }),
      proc: dir({
        cpuinfo: file(() => [
          "model name : Lenovo ThinkCentre M710q (x3)",
          T("cache size : la de café, siempre insuficiente", "cache size : coffee-based, never enough"),
          "flags      : feeder gym homelab self-hosted",
          T("bogomips   : depende de si he desayunado", "bogomips   : depends on breakfast"),
        ]),
        uptime: file(() => [T("Desde 2026, sin reinicios desde el último corte de luz.", "Since 2026, no reboots since the last power cut.")]),
      }),
      tmp: dir({}),
      root: { type: "dir", locked: true, children: {} },
    });
  }

  let FS = null;
  let cwd = HOME;
  const fs = () => FS || (FS = buildFS());
  document.addEventListener("cv:lang", () => { FS = null; cwd = HOME; updatePrompt(); });

  function resolve(path) {
    if (!path || path === "~") return HOME;
    let p = path.replace(/^~(?=\/|$)/, HOME);
    if (!p.startsWith("/")) p = (cwd === "/" ? "" : cwd) + "/" + p;
    const parts = [];
    for (const s of p.split("/")) {
      if (!s || s === ".") continue;
      if (s === "..") parts.pop();
      else parts.push(s);
    }
    return "/" + parts.join("/");
  }
  function getNode(abs) {
    let node = fs();
    if (abs === "/") return node;
    for (const s of abs.slice(1).split("/")) {
      if (!node || node.type !== "dir" || node.locked) return node && node.locked ? { locked: true } : null;
      node = node.children[s];
    }
    return node || null;
  }
  const display = (abs) => (abs === HOME ? "~" : abs.startsWith(HOME + "/") ? "~" + abs.slice(HOME.length) : abs);
  const contentOf = (f) => (typeof f.content === "function" ? f.content() : f.content);

  // ------------------------------------------------------------ prompt
  let sshHost = null;
  function promptText() {
    return sshHost ? `root@${sshHost}:~#` : `kike@cv:${display(cwd)}$`;
  }
  function updatePrompt() {
    promptEl.textContent = vim ? ":" : promptText();
    titleEl.textContent = vim ? "vim" : sshHost ? `root@${sshHost}: ~` : `kike@cv: ${display(cwd)}`;
  }

  // ------------------------------------------------------------ tareas largas (Ctrl+C)
  let busy = null;
  function startBusy(stop) { busy = { stop }; input.placeholder = T("Ctrl+C para parar", "Ctrl+C to stop"); }
  function endBusy() { busy = null; input.placeholder = ""; input.focus(); }
  function interrupt() {
    if (busy) { const b = busy; endBusy(); b.stop(true); }
    else { echoCmd(input.value + "^C"); input.value = ""; }
  }

  // ------------------------------------------------------------ vim
  let vim = false;
  function enterVim() {
    vim = true;
    out.replaceChildren();
    for (let i = 0; i < 12; i++) line("~", "t-dim");
    line(`"${T("sin-nombre", "untitled")}" [${T("Nuevo", "New")}]`, "t-dim");
    line(T("Estás en vim. Suerte.", "You're in vim. Good luck."), "t-dim");
    updatePrompt();
  }
  function vimInput(v) {
    const c = v.trim();
    if (c === "q!" || c === ":q!" || c === "wq" || c === ":wq" || c === "x" || c === ":x") {
      vim = false;
      out.replaceChildren();
      line(T("Has salido de vim. Mucha gente no lo consigue.", "You exited vim. Many never do."), "t-accent");
      mark("vim");
      updatePrompt();
      return;
    }
    if (c === "q" || c === ":q") return line("E37: No write since last change (add ! to override)", "t-err");
    line(T("Sigues en vim. Pista: los dos puntos ya los pongo yo; escribe q!", "Still in vim. Hint: I add the colon; type q!"), "t-dim");
  }

  // ------------------------------------------------------------ comandos del CV
  function cvHelp() {
    heading(t().terminal.help);
    const cmds = t().terminal.cmds;
    const w = 14;
    for (const [k, v] of Object.entries(cmds)) line("  " + k.padEnd(w) + v);
    line();
    heading(T("Sistema:", "System:"));
    const sys = [
      ["ls, cd, pwd", T("moverte por los archivos (ls -a enseña los ocultos)", "move around (ls -a shows hidden files)")],
      ["cat, tree", T("leer archivos y ver la estructura", "read files and see the tree")],
      ["open <ruta>", T("abrir un proyecto en GitHub", "open a project on GitHub")],
      ["ssh pve1", T("entrar en un nodo del clúster", "log into a cluster node")],
      ["ping, htop, uptime", T("lo de siempre", "the usual")],
      ["history, man", T("historial y ayuda", "history and manuals")],
      ["logros", T("easter eggs encontrados (logros reset para empezar de cero)", "easter eggs found (achievements reset to start over)")],
      ["pista", T("una pista para el siguiente easter egg", "a clue for the next easter egg")],
    ];
    for (const [k, v] of sys) line("  " + k.padEnd(w + 6) + v);
    line();
    line(T(`Hay ${EGGS.length} easter eggs escondidos y llevas ${found.size}. Empieza por logros o por history.`, `There are ${EGGS.length} hidden easter eggs and you've found ${found.size}. Start with achievements or history.`), "t-dim");
    line(t().terminal.hint, "t-dim");
  }

  const cv = {
    help: cvHelp,
    whoami() {
      const h = t().hero;
      heading(h.name); line(h.role); line(h.location, "t-dim"); line(); line(h.summary);
      line(); line(T("Prueba: ls · cd proyectos · cat sobre-mi.txt", "Try: ls · cd projects · cat about.txt"), "t-dim");
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
        heading(p.name); line(p.text); line(p.stack.join(", "), "t-dim");
        link(p.repo.replace("https://", ""), p.repo); line();
      }
      line(T(`Más detalle: cd ${"proyectos"} · ls · cat tackboard/README.md`, "More: cd projects · ls · cat tackboard/README.md"), "t-dim");
    },
    homelab() {
      heading(t().sections.homelab); line(t().sections.homelabIntro); line();
      for (const h of t().homelab) { line("* " + h.title, "t-accent"); line("  " + h.text); }
      line(); line(T("Míralo por dentro: cat homelab/rack.txt", "Look inside: cat homelab/rack.txt"), "t-dim");
    },
    skills() {
      for (const g of t().skills) { line(g.group, "t-accent"); line("  " + g.items.join(", ")); }
      line(t().ui.languages, "t-accent");
      line("  " + t().languages.map((l) => `${l.name} (${l.level})`).join(", "));
    },
    education() {
      for (const e of t().education) { heading(e.title); line(`${e.school}  [${App.fmtRange(e.start, e.end)}]`, "t-dim"); }
    },
    contact() {
      link(App.email(), "mailto:" + App.email());
      link("linkedin.com/in/enrique-zaporta-sierra", CV.links.linkedin);
      link("github.com/enriquezaporta", CV.links.github);
    },
    lang([arg]) {
      if (arg !== "es" && arg !== "en") return line(t().terminal.langUsage, "t-err");
      App.setLang(arg);
      line(t().terminal.langChanged);
    },
    clear() { out.replaceChildren(); },
    exit() {
      if (sshHost) { line(`logout\nConnection to ${sshHost} closed.`, "t-dim"); sshHost = null; updatePrompt(); return; }
      line(t().terminal.bye, "t-dim");
      setTimeout(close, 250);
    },
  };

  // ------------------------------------------------------------ comandos de sistema
  function lsCmd(args) {
    const flags = args.filter((a) => a.startsWith("-")).join("");
    const all = flags.includes("a"), long = flags.includes("l");
    const target = args.find((a) => !a.startsWith("-"));
    const abs = resolve(target || cwd);
    const node = getNode(abs);
    if (!node) return line(`ls: ${T("no se puede acceder a", "cannot access")} '${target}': ${T("No existe el archivo o el directorio", "No such file or directory")}`, "t-err");
    if (node.locked) return line(`ls: ${T("no se puede abrir el directorio", "cannot open directory")} '${target}': ${T("Permiso denegado", "Permission denied")}`, "t-err");
    if (node.type === "file") return line(target);
    let names = Object.keys(node.children).sort();
    if (!all) names = names.filter((n) => !n.startsWith("."));
    else names = [".", "..", ...names];
    if (!names.length) return;
    if (long) {
      for (const n of names) {
        const c = node.children[n];
        const isDir = !c || c.type === "dir";
        const size = isDir ? 4096 : contentOf(c).join("\n").length;
        line(`${isDir ? "drwxr-xr-x" : "-rw-r--r--"} kike kike ${String(size).padStart(5)} oct 19 16:07 ${n}${isDir && c ? "/" : ""}`, isDir ? "t-dir" : "");
      }
      return;
    }
    const p = document.createElement("div");
    p.className = "t-line t-ls";
    for (const n of names) {
      const c = node.children[n];
      const s = document.createElement("span");
      s.textContent = n + (c && c.type === "dir" ? "/" : "");
      if (!c || c.type === "dir") s.className = "t-dir";
      p.append(s);
    }
    out.append(p);
    scrollEnd();
  }

  function cdCmd(args) {
    const target = args[0];
    if (target === "-") return;
    const abs = resolve(target || "~");
    const node = getNode(abs);
    if (!node) return line(`cd: ${target}: ${T("No existe el archivo o el directorio", "No such file or directory")}`, "t-err");
    if (node.locked) return line(`cd: ${target}: ${T("Permiso denegado. Buen intento.", "Permission denied. Nice try.")}`, "t-err");
    if (node.type !== "dir") return line(`cd: ${target}: ${T("No es un directorio", "Not a directory")}`, "t-err");
    cwd = abs;
    updatePrompt();
  }

  function catCmd(args) {
    if (!args.length) return line(T("cat: falta un archivo. Prueba: cat sobre-mi.txt", "cat: missing file. Try: cat about.txt"), "t-err");
    for (const a of args) {
      const node = getNode(resolve(a));
      if (!node) { line(`cat: ${a}: ${T("No existe el archivo o el directorio", "No such file or directory")}`, "t-err"); continue; }
      if (node.locked) { line(`cat: ${a}: ${T("Permiso denegado", "Permission denied")}`, "t-err"); continue; }
      if (node.type === "dir") { line(`cat: ${a}: ${T("Es un directorio", "Is a directory")}`, "t-err"); continue; }
      const content = contentOf(node);
      content.forEach((l) => (/^https?:\/\//.test(l) ? link(l.replace("https://", ""), l) : line(l, l.startsWith("#") ? "t-accent" : "")));
      if (node.url && !content.includes(node.url)) link(node.url.replace("https://", ""), node.url);
    }
  }

  function treeCmd(args) {
    const abs = resolve(args[0] || cwd);
    const node = getNode(abs);
    if (!node || node.type !== "dir" || node.locked) return line(`tree: ${args[0] || "."}: ${T("no es un directorio accesible", "not an accessible directory")}`, "t-err");
    line(display(abs), "t-dir");
    let dirs = 0, files = 0;
    (function walk(n, prefix) {
      const names = Object.keys(n.children).filter((x) => !x.startsWith(".")).sort();
      names.forEach((name, i) => {
        const c = n.children[name];
        const last = i === names.length - 1;
        line(prefix + (last ? "└── " : "├── ") + name, c.type === "dir" ? "t-dir" : "");
        if (c.type === "dir" && !c.locked) { dirs++; walk(c, prefix + (last ? "    " : "│   ")); } else files++;
      });
    })(node, "");
    line(); line(`${dirs} ${T("directorios", "directories")}, ${files} ${T("archivos", "files")}`, "t-dim");
  }

  function openCmd(args) {
    const a = args[0];
    if (!a) return line(T("Uso: open <proyecto>  (p. ej. open tackboard)", "Usage: open <project>  (e.g. open tackboard)"), "t-err");
    const byId = t().projects.find((p) => p.id === a.replace(/\/$/, "").split("/").pop());
    let url = byId && byId.repo;
    if (!url) {
      const node = getNode(resolve(a));
      if (node && node.type === "dir" && node.children["README.md"]) url = node.children["README.md"].url;
      if (node && node.url) url = node.url;
    }
    if (!url) return line(`open: ${a}: ${T("no sé qué abrir", "nothing to open")}`, "t-err");
    window.open(url, "_blank", "noopener");
    link(T("Abriendo ", "Opening ") + url.replace("https://", ""), url, "t-dim");
  }

  const HISTORY = [
    "apt update && apt full-upgrade -y",
    "pct create 131 ... debian-13-standard_13.6-1_arm64.tar.zst   # ups",
    "journalctl -u caddy -f   # " + "¿por qué no responde la terminal?",
    "systemctl reload caddy   # y aquí se quedó colgado",
    "cp homelab.conf /etc/dnsmasq.d/homelab.conf.bak   # mala idea",
    "systemctl restart dnsmasq",
    "nslookup google.com   # timed out",
    "git push   # repository not found",
    "vim notas.txt   # todavía estoy intentando salir",
    "coffee   # el servidor se negó",
    "sudo hire-me",
  ];
  const history = [];
  let hIndex = 0;

  function pingCmd(args) {
    const host = args.find((a) => !a.startsWith("-"));
    if (!host) return line(T("ping: falta el destino", "ping: missing host"), "t-err");
    const self = /enriquezaporta\.es$|^localhost$|^127\./.test(host);
    line(`PING ${host} 56(84) bytes of data.`);
    let i = 0, timer;
    const base = self ? 0.05 : /^(1\.1\.1\.1|9\.9\.9\.9|8\.8\.8\.8)$/.test(host) ? 11 : 18;
    const tick = () => {
      i++;
      const ms = (base + Math.random() * (self ? 0.08 : 6)).toFixed(self ? 3 : 1);
      line(`64 bytes from ${host}: icmp_seq=${i} ttl=${self ? 64 : 57} time=${ms} ms`);
      if (i >= 4) finish();
    };
    const finish = (cut) => {
      clearInterval(timer);
      line(); line(`--- ${host} ping statistics ---`); line(`${i} packets transmitted, ${i} received, 0% packet loss`);
      if (self) line(T("(Normal que vaya rápido: es este mismo servidor.)", "(Fast, because it's this very server.)"), "t-dim");
      if (!cut) endBusy();
    };
    startBusy(finish);
    tick();
    timer = setInterval(tick, 700);
  }

  function htopCmd() {
    const p = line("", "t-pre");
    const procs = () => [
      ["1", "root", "systemd", 0.1],
      ["211", "www-data", "nginx: worker", Math.random() * 3],
      ["233", "cloudflared", "cloudflared tunnel run", Math.random() * 5],
      ["302", "cvsync", "git fetch origin main", Math.random() * 2],
      ["404", "kike", T("buscando-trabajo", "looking-for-a-job"), 40 + Math.random() * 20],
      ["666", "kike", T("cerebro --sobreingeniería", "brain --overengineer"), 85 + Math.random() * 14],
      ["1337", "kike", T("café.service", "coffee.service"), Math.random() * 100],
    ];
    const draw = () => {
      const rows = procs();
      const cpu = Math.round(rows.reduce((a, r) => a + r[3], 0) / 3);
      const bar = (n) => "[" + "|".repeat(Math.min(30, Math.round(n * 0.3))).padEnd(30) + `${Math.min(100, n)}%]`;
      p.textContent = [
        `  CPU ${bar(Math.min(100, cpu))}   ${T("Tareas", "Tasks")}: 7  Load: 0.42`,
        `  Mem [${"|".repeat(9).padEnd(30)} 92M/512M]  Uptime: 13 ${T("días", "days")}`,
        "",
        "  PID   USER         CPU%  COMMAND",
        ...rows.map((r) => `  ${r[0].padEnd(5)} ${r[1].padEnd(12)} ${r[3].toFixed(1).padStart(5)}  ${r[2]}`),
        "",
        "  " + T("q o Ctrl+C para salir", "q or Ctrl+C to quit"),
      ].join("\n");
      scrollEnd();
    };
    draw();
    const timer = setInterval(draw, 1000);
    startBusy(() => clearInterval(timer));
  }

  function sshCmd(args) {
    const host = (args[0] || "").replace(/^root@/, "");
    if (!["pve1", "pve2", "pve3"].includes(host)) return line(`ssh: Could not resolve hostname ${host || "''"}: ${T("prueba con pve1, pve2 o pve3", "try pve1, pve2 or pve3")}`, "t-err");
    if (sshHost) return line(T("Ya estás dentro de un nodo. Sal con exit.", "You're already on a node. Leave with exit."), "t-err");
    sshHost = host;
    lines(["Linux " + host + " 6.14-pve x86_64", "", T("Bienvenido a Proxmox VE 9.2. Prueba 'pct list'.", "Welcome to Proxmox VE 9.2. Try 'pct list'.")], "t-dim");
    updatePrompt();
  }

  const PCT = {
    pve1: [["100", "monitor"], ["110", "dns"], ["111", "proxy"], ["112", "vpn"], ["113", "docs"]],
    pve2: [["120", "gym"], ["121", "pesca"], ["122", "compra"]],
    pve3: [["130", "tackboard"], ["131", "cv"]],
  };
  const nodeCmds = {
    pct(args) {
      if (args[0] !== "list") return line(T("Uso: pct list", "Usage: pct list"), "t-err");
      line("VMID       Status     Lock         Name");
      for (const [id, name] of PCT[sshHost]) line(`${id.padEnd(10)} running                 ${name}`);
    },
    pvecm(args) {
      if (args[0] !== "status") return line(T("Uso: pvecm status", "Usage: pvecm status"), "t-err");
      lines(["Cluster information", "-------------------", "Name:             homelab", "Nodes:            3", "Quorate:          Yes"]);
    },
    ls() { line(T("Aquí no hay nada que ver: todo vive en los CTs. Prueba 'pct list'.", "Nothing to see here: everything lives in the CTs. Try 'pct list'.")); },
  };

  function systemctlCmd(args) {
    const [verb, unit = ""] = args;
    const u = unit.replace(/\.service$/, "");
    if (verb === "reload" && u === "caddy") {
      const p = line("", "t-dim");
      const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
      let i = 0;
      const timer = setInterval(() => { p.textContent = `${frames[i++ % frames.length]} ${T("Recargando caddy… esperando a que se cierren las conexiones (eternal grace period)", "Reloading caddy… waiting for connections to close (eternal grace period)")}`; }, 120);
      startBusy(() => {
        clearInterval(timer);
        p.textContent = "^C";
        line(T("Consejo: pon 'grace_period 10s' en el Caddyfile. Lo digo por experiencia.", "Tip: add 'grace_period 10s' to the Caddyfile. Speaking from experience."), "t-accent");
        mark("caddy");
      });
      return;
    }
    if (verb === "restart" && u === "dnsmasq") return line(T("dnsmasq arrancado. Esta vez la copia de seguridad está en /root, donde debe.", "dnsmasq started. This time the backup lives in /root, where it belongs."), "t-accent");
    if (verb === "status" && u) {
      lines([`● ${u}.service`, "     Loaded: loaded", "     Active: " + "active (running)" + T(" desde hace un rato", " for a while")]);
      return;
    }
    line(T("Uso: systemctl status|reload|restart <servicio>", "Usage: systemctl status|reload|restart <unit>"), "t-err");
  }

  async function rmCmd(args, viaSudo) {
    const joined = args.join(" ");
    if (/-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r/.test(joined) && /(^|\s)\/(\*)?(\s|$)/.test(joined)) {
      let cancelled = false;
      startBusy(() => { cancelled = true; });
      const targets = ["/bin", "/boot", "/etc", "/home/kike/proyectos", "/home/kike/experiencia", "/usr", "/var", "/home/kike/.secreto"];
      for (const d of targets) {
        if (cancelled) { line("^C", "t-dim"); line(T("Vale, lo dejamos aquí.", "Fine, we'll stop there."), "t-dim"); return; }
        line(`rm: ${T("borrando", "removing")} '${d}'…`, "t-err");
        await sleep(reduced ? 30 : 260);
      }
      const bar = line("", "t-err");
      for (let i = 0; i <= 20; i++) {
        if (cancelled) return;
        bar.textContent = `[${"#".repeat(i).padEnd(20, ".")}] ${i * 5}%`;
        await sleep(reduced ? 10 : 70);
      }
      line();
      line(T("Es broma. Tengo copias de seguridad… creo.", "Just kidding. I have backups… I think."), "t-accent");
      endBusy();
      mark("rmrf");
      return;
    }
    line(T("rm: operación no permitida: este CV es de solo lectura.", "rm: operation not permitted: this CV is read-only."), "t-err");
  }

  let sudoFails = 0;
  function sudoCmd(args) {
    const sub = args.join(" ");
    if (sub === "hire-me") {
      line(t().terminal.hire.replace("{email}", App.email()), "t-accent");
      link(App.email(), "mailto:" + App.email());
      const msg = mark("hire");
      if (found.size === EGGS.length) line(T('Y como ya tienes todos los logros, pon "feeder" en el asunto.', 'And since you have every achievement, put "feeder" in the subject.'), "t-egg");
      return msg;
    }
    if (args[0] === "rm") return rmCmd(args.slice(1), true);
    sudoFails++;
    if (sudoFails === 1) return line("[sudo] password for kike: ********\n" + T("kike no está en el archivo sudoers.", "kike is not in the sudoers file."), "t-err");
    if (sudoFails === 2) return line(T("Sigue sin estar en sudoers. Insistir no ayuda.", "Still not in sudoers. Insisting won't help."), "t-err");
    line(T("Este incidente será reportado… a tu madre.", "This incident will be reported… to your mother."), "t-err");
    mark("sudo");
  }

  function pescarCmd() {
    const fish = [
      [T("una carpa", "a carp"), 1.2, 6.5], [T("un barbo", "a barbel"), 0.4, 3.2], [T("un carpín", "a crucian carp"), 0.15, 0.8],
      [T("una breca", "a bream"), 0.3, 2.4], [T("un alburno", "a bleak"), 0.02, 0.06], [T("un siluro", "a wels catfish"), 4, 28],
      [T("una bota vieja", "an old boot"), 0.8, 0.8],
    ];
    line(T("Cebando el feeder… lanzando a 40 metros…", "Loading the feeder… casting to 40 meters…"), "t-dim");
    const p = line("", "t-dim");
    let i = 0;
    const timer = setInterval(() => { p.textContent = "~".repeat(++i % 12) + "🎣"; scrollEnd(); }, 140);
    const done = (cut) => {
      clearInterval(timer);
      if (cut) { p.textContent = T("Has recogido sin picada.", "You reeled in. No bite."); return; }
      endBusy();
      const [name, min, max] = fish[Math.floor(Math.random() * fish.length)];
      const kg = +(min + Math.random() * (max - min)).toFixed(2);
      const rec = store.get("cv-fish-record", 0);
      const fmt = (n) => n.toLocaleString(App.lang === "es" ? "es-ES" : "en-GB", { maximumFractionDigits: 2 });
      p.textContent = "><(((º>";
      line(`${T("¡Picada! Has sacado", "Bite! You landed")} ${name} ${T("de", "of")} ${fmt(kg)} kg.`, "t-accent");
      if (name.includes("bota") || name.includes("boot")) line(T("Cuenta como captura. Más o menos.", "It counts. Sort of."), "t-dim");
      else if (kg > rec) { store.set("cv-fish-record", kg); line(T("¡Nuevo récord personal!", "New personal best!"), "t-egg"); }
      else line(`${T("Tu récord", "Your record")}: ${fmt(rec)} kg`, "t-dim");
      mark("fish");
    };
    startBusy(done);
    setTimeout(() => busy && busy.stop === done && (busy = null, done(false)), reduced ? 300 : 2200);
  }

  async function motorlandCmd() {
    const len = 44;
    const track = line("", "t-pre");
    let cancelled = false;
    startBusy(() => { cancelled = true; });
    line(T("Track day en MotorLand Aragón · 5.077 m", "Track day at MotorLand Aragón · 5,077 m"), "t-dim");
    const sectors = [Math.floor(len / 3), Math.floor((2 * len) / 3)];
    for (let x = 0; x <= len; x++) {
      if (cancelled) { line(T("Bandera roja. Vuelta anulada.", "Red flag. Lap cancelled."), "t-err"); return; }
      const road = "═".repeat(x) + "▄█▀█▄" + "═".repeat(len - x);
      track.textContent = `🏁${road}🏁\n   ${sectors.map((s) => (x >= s ? "▲" : "·")).join("              ")}`;
      await sleep(reduced ? 5 : 45);
    }
    const ms = 118000 + Math.floor(Math.random() * 14000);
    const lap = `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;
    const best = store.get("cv-lap", null);
    line(`${T("Vuelta", "Lap")}: ${lap}`, "t-accent");
    if (best == null || ms < best) { store.set("cv-lap", ms); line(T("¡Vuelta rápida personal!", "Personal fastest lap!"), "t-egg"); }
    endBusy();
    mark("lap");
  }

  function matrixCmd() {
    if (reduced) { line(T("Despierta, Neo… (animación desactivada por tu configuración)", "Wake up, Neo… (animation off by your settings)"), "t-accent"); return mark("matrix"); }
    const c = document.createElement("canvas");
    c.className = "t-matrix";
    dlg.append(c);
    const ctx = c.getContext("2d");
    const resize = () => { c.width = dlg.clientWidth; c.height = dlg.clientHeight; };
    resize();
    const size = 16, cols = Math.ceil(c.width / size);
    const drops = Array.from({ length: cols }, () => Math.random() * -40);
    const chars = "アイウエオカキクケコサシスセソ0123456789ABCDEF<>/{}$#";
    const timer = setInterval(() => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#3dff7a";
      ctx.font = `${size}px monospace`;
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y * size);
        drops[i] = y * size > c.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    }, 50);
    const stop = () => {
      clearInterval(timer); c.remove();
      line(T("Has elegido la pastilla roja.", "You took the red pill."), "t-accent");
      mark("matrix");
      document.removeEventListener("keydown", onKey, true);
    };
    const onKey = (e) => { e.preventDefault(); e.stopPropagation(); if (busy) { endBusy(); stop(); } };
    c.addEventListener("click", () => { if (busy) { endBusy(); stop(); } });
    document.addEventListener("keydown", onKey, true);
    startBusy(stop);
  }

  let confirmReset = false;
  function resetEggs(all) {
    found = new Set();
    store.set("cv-eggs", []);
    if (all) { store.set("cv-fish-record", 0); store.set("cv-lap", null); }
    sudoFails = 0;
    document.documentElement.classList.remove("party");
    line(all ? T("Logros y récords borrados. A empezar de cero.", "Achievements and records cleared. Fresh start.")
             : T("Logros borrados (0/13). Los récords de pesca y de vuelta se conservan; para borrarlos también: logros reset --todo", "Achievements cleared (0/13). Fishing and lap records kept; to clear them too: achievements reset --all"), "t-accent");
  }
  function logrosCmd(args = []) {
    if (args[0] === "reset") {
      confirmReset = args.includes("--todo") || args.includes("--all") ? "all" : "eggs";
      return line(T(`¿Seguro que quieres borrar ${confirmReset === "all" ? "los logros y los récords" : "los logros"}? Escribe s para confirmar.`, `Sure you want to clear ${confirmReset === "all" ? "achievements and records" : "your achievements"}? Type y to confirm.`), "t-err");
    }
    heading(`${T("Logros", "Achievements")}: ${found.size}/${EGGS.length}`);
    for (const [id, nes, nen] of EGGS) {
      if (found.has(id)) line(`  ★ ${T(nes, nen)}`, "t-accent");
      else line(`  ☆ ${T(HINTS[id][0], HINTS[id][1])}`, "t-dim");
    }
    if (found.size < EGGS.length) { line(); line(T("¿Atascado? Escribe pista para una ayuda más directa.", "Stuck? Type hint for a more direct clue."), "t-dim"); }
    else line(T('Los tienes todos. Escríbeme con "feeder" en el asunto y cuéntame cuánto has tardado.', 'You\'ve got them all. Email me with "feeder" in the subject and tell me how long it took.'), "t-egg");
  }

  let hintTurn = 0;
  function pistaCmd() {
    const pending = EGGS.filter(([id]) => !found.has(id));
    if (!pending.length) return line(T("No te quedan logros por descubrir. Ya solo falta que me escribas.", "No achievements left. All that's left is to email me."), "t-egg");
    const [id, nes, nen] = pending[hintTurn++ % pending.length];
    line(`☆ ${T(nes, nen)}: ${T(HINTS[id][2], HINTS[id][3])}`, "t-accent");
    if (pending.length > 1) line(T(`Te quedan ${pending.length}. Vuelve a escribir pista para otra.`, `${pending.length} left. Type hint again for another.`), "t-dim");
  }

  function base64Cmd(args) {
    const s = args.filter((a) => a !== "-d" && a !== "--decode").join("");
    if (!s) return line(T("Uso: base64 -d <texto>", "Usage: base64 -d <text>"), "t-err");
    try {
      const bin = atob(s);
      const txt = new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0)));
      line(txt, "t-accent");
      if (s === SECRET) mark("secret");
    } catch (_) { line("base64: invalid input", "t-err"); }
  }

  const MAN = {
    ls: T("ls [-a] [-l] [ruta] — lista archivos. -a enseña lo que no quiero que veas.", "ls [-a] [-l] [path] — list files. -a shows what I'd rather you didn't see."),
    cd: T("cd <ruta> — cambia de directorio. ~ es tu casa (bueno, la mía).", "cd <path> — change directory. ~ is home (mine, really)."),
    cat: T("cat <archivo> — muestra un archivo. No es un gato.", "cat <file> — print a file. Not a cat."),
    ssh: T("ssh <pve1|pve2|pve3> — entra en un nodo. Sin contraseña: aquí confiamos en ti.", "ssh <pve1|pve2|pve3> — log into a node. No password: we trust you."),
    vim: T("vim — editor de texto. Entrar es fácil.", "vim — text editor. Getting in is easy."),
    sudo: T("sudo <comando> — ejecutar como root. No lo eres.", "sudo <command> — run as root. You're not."),
    man: T("man <comando> — esto que estás leyendo. Sí, existe 'man man'.", "man <command> — what you're reading. Yes, 'man man' exists."),
    open: T("open <proyecto> — abre el repo en GitHub.", "open <project> — open the repo on GitHub."),
  };

  // ------------------------------------------------------------ tabla de comandos
  const sys = {
    ls: lsCmd, ll: (a) => lsCmd(["-la", ...a]), dir: lsCmd,
    cd: cdCmd,
    pwd: () => line(sshHost ? "/root" : cwd),
    cat: catCmd, less: catCmd, more: catCmd,
    tree: treeCmd,
    open: openCmd,
    history: () => HISTORY.concat(history.slice(0, -1)).forEach((h, i) => line(`${String(i + 1).padStart(4)}  ${h}`)),
    man: (a) => line(MAN[a[0]] || (a[0] ? T(`No hay entrada de manual para ${a[0]}. Prueba a usarlo sin más.`, `No manual entry for ${a[0]}. Just try it.`) : T("¿Qué página de manual quieres?", "What manual page do you want?")), MAN[a[0]] ? "" : "t-dim"),
    echo: (a) => line(a.join(" ")),
    date: () => line(new Date().toString()),
    uname: (a) => line(a.includes("-a") ? "Linux cv 6.14-pve #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux" : "Linux"),
    hostname: () => line(sshHost || "cv"),
    uptime: () => line(` ${new Date().toTimeString().slice(0, 8)} up 13 days,  1 user,  load average: 0.04, 0.03, 0.00`),
    ping: pingCmd,
    htop: htopCmd, top: htopCmd,
    ssh: sshCmd,
    systemctl: systemctlCmd,
    rm: (a) => rmCmd(a, false),
    sudo: sudoCmd,
    vim: enterVim, vi: enterVim,
    nano: () => { line(T("Aquí somos de vim. Te llevo.", "We use vim here. Taking you there."), "t-dim"); setTimeout(enterVim, 600); },
    emacs: () => line(T("Buen sistema operativo, le falta un buen editor.", "Great operating system, lacking a decent editor."), "t-dim"),
    pescar: pescarCmd, fish: pescarCmd, feeder: pescarCmd,
    motorland: motorlandCmd,
    gym: () => { lines(["   O", "  /|\\  ‹=====›", "  / \\"], "t-accent"); line(T("Hoy toca pierna. No hay excusas.", "It's leg day. No excuses."), "t-accent"); mark("gym"); },
    coffee: () => { lines(["HTTP/1.1 418 I'm a teapot", "", "        _", "     __( )__", "   _|_______|_", "   \\         /=)", "    \\_______/"], "t-accent"); line(T("Pide café a otro servidor.", "Ask another server for coffee."), "t-dim"); mark("teapot"); },
    cafe: (a) => sys.coffee(a),
    matrix: matrixCmd,
    logros: logrosCmd, achievements: logrosCmd,
    pista: pistaCmd, pistas: pistaCmd, hint: pistaCmd, hints: pistaCmd,
    "café": (a) => sys.coffee(a), te: (a) => sys.coffee(a), "té": (a) => sys.coffee(a), tea: (a) => sys.coffee(a),
    pesca: pescarCmd,
    base64: base64Cmd, decode: (a) => base64Cmd(["-d", ...a]),
    neofetch() {
      lines([
        "  ┌──────────┐   kike@cv",
        "  │ ▪▪▪▪▪▪▪▪ │   OS: Debian 13 (LXC)",
        "  │ ▬▬▬▬▬▬▬▬ │   Host: Proxmox VE · pve3",
        "  │ ▫ pve1   │   Rack: 10\" · 12U",
        "  │ ▫ pve2   │   Web: nginx + Cloudflare Tunnel",
        "  │ ▪ pve3 ◂ │   Shell: cv.js",
        `  └──────────┘   Easter eggs: ${found.size}/${EGGS.length}`,
      ], "t-accent");
    },
    whoami: cv.whoami,
    "hire-me": () => line(T("Casi. Prueba con sudo delante.", "Almost. Try it with sudo."), "t-dim"),
  };

  // ------------------------------------------------------------ ejecución
  function echoCmd(text) {
    const p = document.createElement("div");
    p.className = "t-line t-cmd";
    const pr = document.createElement("span");
    pr.className = "t-prompt";
    pr.textContent = promptText() + " ";
    p.append(pr, document.createTextNode(text));
    out.append(p);
    scrollEnd();
  }

  function run(raw) {
    if (vim) { line(":" + raw, "t-dim"); return vimInput(raw); }
    const text = raw.trim();
    echoCmd(text);
    if (!text) return;
    history.push(text);
    hIndex = history.length;

    const [cmd, ...args] = text.split(/\s+/);
    const name = cmd.toLowerCase();
    if (confirmReset) {
      const mode = confirmReset;
      confirmReset = false;
      if (["s", "si", "sí", "y", "yes"].includes(name)) return resetEggs(mode === "all");
      return line(T("Cancelado. Tus logros siguen ahí.", "Cancelled. Your achievements are safe."), "t-dim");
    }
    if (name === "q" && busy) return interrupt();
    if (sshHost && nodeCmds[name]) return nodeCmds[name](args);
    const fn = cv[name] || sys[name];
    if (fn) return fn(args);
    if (/^\.\/|\.sh$/.test(cmd)) return line(`bash: ${cmd}: ${T("Permiso denegado", "Permission denied")}`, "t-err");
    line(t().terminal.notFound.replace("{cmd}", cmd), "t-err");
  }

  // ------------------------------------------------------------ autocompletado
  function complete() {
    const v = input.value;
    const parts = v.split(/\s+/);
    if (parts.length <= 1) {
      const pool = [...Object.keys(cv), "ls", "cd", "cat", "tree", "open", "ssh", "ping", "htop", "history", "man", "logros", "pista", "pwd", ...(sshHost ? ["pct", "pvecm"] : [])];
      const m = [...new Set(pool)].filter((c) => c.startsWith(v.toLowerCase()));
      if (m.length === 1) input.value = m[0] + " ";
      else if (m.length > 1) line(m.join("  "), "t-dim");
      return;
    }
    const last = parts[parts.length - 1];
    const slash = last.lastIndexOf("/");
    const base = slash >= 0 ? last.slice(0, slash + 1) : "";
    const frag = slash >= 0 ? last.slice(slash + 1) : last;
    const node = getNode(resolve(base || "."));
    if (!node || node.type !== "dir" || node.locked) return;
    const m = Object.keys(node.children).filter((n) => n.startsWith(frag) && (frag.startsWith(".") || !n.startsWith(".")));
    if (m.length === 1) {
      const c = node.children[m[0]];
      parts[parts.length - 1] = base + m[0] + (c.type === "dir" ? "/" : " ");
      input.value = parts.join(" ");
    } else if (m.length > 1) line(m.join("  "), "t-dim");
  }

  // ------------------------------------------------------------ abrir / cerrar
  let started = false;
  function open() {
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add("term-open");
    if (!started) {
      started = true;
      updatePrompt();
      line(t().terminal.welcome, "t-accent");
      line(T(`Hay ${EGGS.length} easter eggs escondidos. Escribe logros para ver las pistas.`, `There are ${EGGS.length} hidden easter eggs. Type achievements to see the clues.`), "t-egg");
      line();
      run("whoami");
    }
    input.focus();
  }
  function close() {
    if (busy) { const b = busy; endBusy(); b.stop(true); }
    if (dlg.open) dlg.close();
  }

  dlg.addEventListener("close", () => {
    document.documentElement.classList.remove("term-open");
    document.getElementById("btn-terminal").focus();
  });
  dlg.addEventListener("cancel", (e) => { if (vim || busy) { e.preventDefault(); if (busy) interrupt(); else line(T("Esc no te saca de vim. Escribe q!", "Esc won't get you out of vim. Type q!"), "t-dim"); } });
  document.getElementById("btn-terminal").addEventListener("click", open);
  document.getElementById("term-close").addEventListener("click", close);
  body.addEventListener("click", (e) => {
    if (e.target.tagName !== "A" && !window.getSelection().toString()) input.focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    if (busy) { if (v.trim() === "q") interrupt(); return; }
    run(v);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "c" && e.ctrlKey) { e.preventDefault(); return interrupt(); }
    if (e.key === "l" && e.ctrlKey) { e.preventDefault(); return out.replaceChildren(); }
    if (busy) return;
    if (e.key === "Tab") { e.preventDefault(); complete(); }
    else if (e.key === "ArrowUp") { if (hIndex > 0) input.value = history[--hIndex]; e.preventDefault(); }
    else if (e.key === "ArrowDown") {
      if (hIndex < history.length - 1) input.value = history[++hIndex];
      else { hIndex = history.length; input.value = ""; }
      e.preventDefault();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "`" && !dlg.open && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault();
      open();
    }
  });

  if (location.hash === "#terminal") open();
})();
