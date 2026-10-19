/*
 * Contenido del CV en español e inglés.
 * Para actualizar el CV basta con editar este archivo: la página y el modo
 * terminal se generan a partir de aquí.
 */
window.CV = {
  links: {
    github: "https://github.com/enriquezaporta",
    linkedin: "https://www.linkedin.com/in/enrique-zaporta-sierra-79a3aa177/",
    source: "https://github.com/enriquezaporta/cv",
  },
  // El email se monta en el navegador para no dejarlo en claro a los robots.
  email: ["enriquezaporta", "gmail.com"],

  es: {
    meta: {
      title: "Enrique Zaporta Sierra · Desarrollador web y técnico de sistemas",
      description:
        "CV de Enrique Zaporta Sierra: desarrollador web full stack y técnico de sistemas IT en Alcañiz (Teruel).",
    },
    ui: {
      nav: {
        experience: "Experiencia",
        projects: "Proyectos",
        homelab: "Homelab",
        skills: "Habilidades",
        education: "Formación",
        contact: "Contacto",
      },
      skip: "Saltar al contenido",
      printCallout: "Versión interactiva de este CV",
      printCalloutText: "Proyectos con capturas, el homelab donde se ejecuta y un modo terminal con sorpresas. Escanea el código o entra en:",
      terminal: "Modo terminal",
      print: "Descargar PDF",
      langSwitch: "English",
      langSwitchLabel: "Ver en inglés",
      emailMe: "Escríbeme",
      present: "actualidad",
      repo: "Ver el código",
      youAreHere: "esta web",
      rackCaption:
        "El rack donde se ejecuta esta página. Pasa el ratón o toca cada unidad.",
      sourceNote: "El código de esta web es público",
      noscript:
        "Esta página necesita JavaScript para mostrar el CV. Puedes ver mi perfil en LinkedIn.",
      languages: "Idiomas",
      other: "Otros",
    },
    hero: {
      name: "Enrique Zaporta Sierra",
      role: "Desarrollador web full stack y técnico de sistemas IT",
      location: "Alcañiz, Teruel",
      summary:
        "Me muevo entre el código y la infraestructura: desarrollo aplicaciones web y también administro las redes, servidores y sistemas sobre los que funcionan. Aprendo rápido, me gusta entender los problemas hasta el fondo y trabajo bien en equipo.",
    },
    sections: {
      experience: "Experiencia",
      projects: "Proyectos",
      projectsIntro:
        "Aplicaciones que he diseñado, programado y desplegado yo mismo. Todas son PWA autoalojadas en mi homelab y su código está en GitHub.",
      homelab: "Este CV se sirve desde mi homelab",
      homelabIntro:
        "Un clúster de Proxmox en un rack de 10 pulgadas y 12U en casa. Es donde pruebo, despliego y mantengo mis proyectos con las mismas prácticas que aplico en el trabajo.",
      skills: "Habilidades",
      education: "Formación",
      contact: "Contacto",
      contactIntro:
        "Si quieres hablar de una oferta, un proyecto o cualquier cosa de lo que aparece aquí, escríbeme.",
    },
    experience: [
      {
        role: "Técnico de sistemas IT",
        company: "Insinec S.L., en Motorland Aragón",
        start: "2026-01",
        end: null,
        points: [
          "Administración y mantenimiento de la red corporativa: equipos MikroTik y Meraki, segmentación por VLAN y disponibilidad de las comunicaciones.",
          "Virtualización con VMware ESXi y vCenter, y gestión de servidores Linux y Windows.",
          "Administración de Microsoft 365 y Exchange Online.",
          "Monitorización de la infraestructura con LibreNMS, incluidos sensores y regletas gestionables.",
          "Soporte del sistema de videovigilancia Milestone XProtect.",
          "TV interna del circuito: configuración de encoders, cableado y señal SDI/HDMI, integración de los canales de promotores externos y supervisión de la señal durante los eventos.",
          "Desarrollo de aplicaciones web internas para automatizar y mejorar procesos.",
        ],
      },
      {
        role: "Desarrollador web full stack y técnico de soporte IT",
        company: "Siba Informática S.L.",
        start: "2024-04",
        end: "2025-12",
        points: [
          "Webs y tiendas online con WordPress y Divi, y con PrestaShop.",
          "Funcionalidades a medida en PHP y JavaScript, mejorando la eficiencia del backend.",
          "Maquetación de vistas con HTML, CSS y Bootstrap 5.",
          "Soluciones ERP sobre Dolibarr: funcionalidades personalizadas y módulos propios para cada cliente.",
          "Soporte técnico a empresas, presencial y remoto: diagnóstico y reparación de equipos.",
        ],
      },
      {
        role: "Técnico de soporte informático",
        company: "CEIP Concepción Gimeno Gil",
        start: "2018-04",
        end: "2018-06",
        points: [
          "Reparación de equipos informáticos e impresoras y puesta en marcha.",
          "Tareas de administración del centro.",
        ],
      },
    ],
    projects: [
      {
        id: "tackboard",
        name: "Tackboard",
        repo: "https://github.com/enriquezaporta/tackboard",
        img: "assets/img/tackboard.webp",
        alt: "Tablero Kanban de Tackboard en el escritorio",
        text:
          "Organizador de tareas con tableros Kanban, calendario y tableros compartidos con permisos. Funciona sin conexión, envía avisos push también en iPhone e incluye pomodoro, tareas recurrentes y enlace iCal.",
        stack: ["JavaScript", "Python", "SQLite", "PWA", "Web Push", "Docker"],
      },
      {
        id: "garage-gym",
        name: "Garage Gym",
        repo: "https://github.com/enriquezaporta/garage-gym",
        img: "assets/img/garage-gym.webp",
        alt: "Pantalla de entrenamiento de Garage Gym en el escritorio",
        text:
          "Registro de entrenamiento para el gimnasio de casa: series y cargas, biblioteca de más de 1.300 ejercicios con animaciones, temporizadores y seguimiento del peso. Imagen Docker multiarquitectura.",
        stack: ["JavaScript", "Python", "SQLite", "PWA", "Docker"],
      },
      {
        id: "calendario-pesca",
        name: "Calendario de Pesca",
        repo: "https://github.com/enriquezaporta/calendario-pesca",
        img: "assets/img/calendario-pesca.webp",
        alt: "Resumen de temporada de Calendario de Pesca en el escritorio",
        text:
          "Diario de pesca deportiva para concursos, campeonatos y entrenamientos de cualquier modalidad. Estadísticas de temporada, amigos con comparativa y chat, y privacidad por defecto.",
        stack: ["JavaScript", "Python", "SQLite", "PWA", "Docker"],
      },
      {
        id: "cesta-compra",
        name: "Compra",
        repo: "https://github.com/enriquezaporta/cesta-compra",
        img: "assets/img/cesta-compra.webp",
        alt: "Pantallas de la lista, añadir rápido y envío de Compra en el móvil",
        text:
          "Lista de la compra compartida para toda la casa que se pasa a la telecompra de Mercadona con un clic. Catálogo con fotos y precios que se actualiza cada noche, total estimado y una pantalla de añadir rápido que se abre con una pegatina NFC en la nevera.",
        stack: ["JavaScript", "Python", "SQLite", "PWA", "NFC", "Docker"],
      },
    ],
    homelab: [
      {
        title: "Clúster Proxmox VE de tres nodos",
        text: "Tres Lenovo ThinkCentre M710q con ZFS para poder replicar entre nodos. Cada servicio vive en su propio contenedor LXC.",
      },
      {
        title: "Red y DNS propios",
        text: "dnsmasq resuelve los nombres internos y Caddy hace de proxy inverso con un certificado comodín de Let's Encrypt validado por DNS.",
      },
      {
        title: "Publicación sin abrir puertos",
        text: "Esta web sale a internet por un túnel de Cloudflare. Su contenedor está aislado por el firewall de Proxmox y no puede hablar con el resto de la red.",
      },
      {
        title: "Acceso remoto y monitorización",
        text: "WireGuard para entrar desde fuera. Telegraf, InfluxDB y Grafana para las métricas, y una pantalla táctil en el rack con un panel propio.",
      },
      {
        title: "Despliegue desde GitHub",
        text: "El contenedor descarga cada pocos minutos la última versión del repositorio, así que publicar un cambio es hacer un push.",
      },
    ],
    skills: [
      {
        group: "Sistemas y redes",
        items: ["MikroTik", "Cisco Meraki", "VLAN", "WireGuard", "DNS", "Firewall", "LibreNMS"],
      },
      {
        group: "Virtualización y servidores",
        items: ["Proxmox VE", "VMware ESXi / vCenter", "LXC", "Docker", "Linux", "Windows Server"],
      },
      {
        group: "Microsoft y videovigilancia",
        items: ["Microsoft 365", "Exchange Online", "Milestone XProtect"],
      },
      {
        group: "Vídeo y TV interna",
        items: ["Encoders de vídeo", "Señal SDI y HDMI", "Distribución de canales", "Supervisión en eventos"],
      },
      {
        group: "Desarrollo web",
        items: ["JavaScript", "PHP", "Python", "HTML y CSS", "Bootstrap 5", "SQLite", "PWA"],
      },
      {
        group: "CMS y ERP",
        items: ["WordPress", "Divi", "PrestaShop", "Dolibarr"],
      },
      {
        group: "Herramientas",
        items: ["Git y GitHub", "Caddy", "nginx", "Cloudflare", "Grafana", "InfluxDB"],
      },
      {
        group: "Personales",
        items: ["Comunicación", "Gestión de equipos", "Resolución de problemas"],
      },
    ],
    languages: [
      { name: "Castellano", level: "nativo" },
      { name: "Inglés", level: "B2" },
    ],
    other: ["Carné de conducir", "Vehículo propio"],
    education: [
      {
        title: "Técnico superior en Desarrollo de Aplicaciones Web",
        school: "CPIFP Bajo Aragón",
        start: "2021-09",
        end: "2024-04",
      },
      {
        title: "Técnico en Sistemas Microinformáticos y Redes",
        school: "CPIFP Bajo Aragón",
        start: "2016-09",
        end: "2018-06",
      },
      {
        title: "Educación Secundaria Obligatoria",
        school: "IES Bajo Aragón",
        start: "2011-09",
        end: "2016-06",
      },
    ],
    rack: {
      patch: "Panel de parcheo",
      switch: "Switch gestionable de 8 puertos",
      screen: "Pantalla táctil de 2U con el panel de métricas",
      pve1: "pve1: gestión (DNS, proxy inverso, VPN, monitorización)",
      pve2: "pve2: aplicaciones",
      pve3: "pve3: aplicaciones y esta web",
      pdu: "Regletas de alimentación (2 PDU)",
    },
    terminal: {
      welcome:
        "Bienvenido a cv@enriquezaporta. Escribe 'help' para ver los comandos.",
      help: "Comandos disponibles:",
      notFound: "Comando no encontrado: {cmd}. Escribe 'help'.",
      bye: "Cerrando la terminal…",
      langChanged: "Idioma cambiado a español.",
      langUsage: "Uso: lang es | lang en",
      hire: "Permiso concedido. Escríbeme a {email} y lo hablamos.",
      cmds: {
        help: "muestra esta ayuda",
        whoami: "quién soy",
        experience: "experiencia laboral",
        projects: "proyectos publicados",
        homelab: "dónde se ejecuta esta web",
        skills: "habilidades",
        education: "formación",
        contact: "cómo contactar",
        lang: "cambia el idioma (es | en)",
        clear: "limpia la pantalla",
        exit: "vuelve a la versión visual",
      },
      hint: "Tab completa, ↑ ↓ recorren el historial, Esc cierra.",
    },
  },

  en: {
    meta: {
      title: "Enrique Zaporta Sierra · Web developer and IT systems technician",
      description:
        "CV of Enrique Zaporta Sierra: full stack web developer and IT systems technician based in Alcañiz, Spain.",
    },
    ui: {
      nav: {
        experience: "Experience",
        projects: "Projects",
        homelab: "Homelab",
        skills: "Skills",
        education: "Education",
        contact: "Contact",
      },
      skip: "Skip to content",
      printCallout: "Interactive version of this CV",
      printCalloutText: "Projects with screenshots, the homelab it runs on and a terminal mode with surprises. Scan the code or visit:",
      terminal: "Terminal mode",
      print: "Download PDF",
      langSwitch: "Español",
      langSwitchLabel: "Ver en español",
      emailMe: "Email me",
      present: "present",
      repo: "View the code",
      youAreHere: "this site",
      rackCaption:
        "The rack this page runs on. Hover or tap each unit.",
      sourceNote: "The code for this site is public",
      noscript:
        "This page needs JavaScript to show the CV. You can find my profile on LinkedIn.",
      languages: "Languages",
      other: "Other",
    },
    hero: {
      name: "Enrique Zaporta Sierra",
      role: "Full stack web developer and IT systems technician",
      location: "Alcañiz, Spain",
      summary:
        "I work across code and infrastructure: I build web applications and I also run the networks, servers and systems they live on. I learn fast, I like to understand problems all the way down, and I work well in a team.",
    },
    sections: {
      experience: "Experience",
      projects: "Projects",
      projectsIntro:
        "Applications I designed, built and deployed myself. They are all self-hosted PWAs running in my homelab, and their code is on GitHub.",
      homelab: "This CV is served from my homelab",
      homelabIntro:
        "A Proxmox cluster in a 12U, 10-inch rack at home. It is where I test, deploy and maintain my projects with the same practices I use at work.",
      skills: "Skills",
      education: "Education",
      contact: "Contact",
      contactIntro:
        "If you'd like to talk about a role, a project or anything on this page, drop me a line.",
    },
    experience: [
      {
        role: "IT systems technician",
        company: "Insinec S.L., at Motorland Aragón",
        start: "2026-01",
        end: null,
        points: [
          "Running and maintaining the corporate network: MikroTik and Meraki equipment, VLAN segmentation and network availability.",
          "Virtualization with VMware ESXi and vCenter, and Linux and Windows server administration.",
          "Microsoft 365 and Exchange Online administration.",
          "Infrastructure monitoring with LibreNMS, including sensors and managed PDUs.",
          "Support for the Milestone XProtect video surveillance system.",
          "In-house TV for the circuit: encoder setup, SDI/HDMI cabling and signal routing, integrating external promoters' channels and monitoring the signal during events.",
          "Building internal web applications to automate and improve processes.",
        ],
      },
      {
        role: "Full stack web developer and IT support technician",
        company: "Siba Informática S.L.",
        start: "2024-04",
        end: "2025-12",
        points: [
          "Websites and online stores with WordPress and Divi, and with PrestaShop.",
          "Custom features in PHP and JavaScript that made the backend more efficient.",
          "Front-end views with HTML, CSS and Bootstrap 5.",
          "ERP solutions on Dolibarr: custom features and bespoke modules for each client.",
          "On-site and remote technical support for businesses: diagnosing and repairing systems.",
        ],
      },
      {
        role: "IT support technician",
        company: "CEIP Concepción Gimeno Gil (primary school)",
        start: "2018-04",
        end: "2018-06",
        points: [
          "Repairing computers and printers and getting them back in service.",
          "General administration tasks.",
        ],
      },
    ],
    projects: [
      {
        id: "tackboard",
        name: "Tackboard",
        repo: "https://github.com/enriquezaporta/tackboard",
        img: "assets/img/tackboard.webp",
        alt: "Tackboard Kanban board on desktop",
        text:
          "Task organizer with Kanban boards, a calendar and shared boards with permissions. Works offline, sends push reminders (iPhone included) and adds pomodoro, recurring tasks and an iCal feed.",
        stack: ["JavaScript", "Python", "SQLite", "PWA", "Web Push", "Docker"],
      },
      {
        id: "garage-gym",
        name: "Garage Gym",
        repo: "https://github.com/enriquezaporta/garage-gym",
        img: "assets/img/garage-gym.webp",
        alt: "Garage Gym workout screen on desktop",
        text:
          "Workout log for a home gym: sets and loads, a library of over 1,300 animated exercises, timers and body-weight tracking. Ships as a multi-architecture Docker image.",
        stack: ["JavaScript", "Python", "SQLite", "PWA", "Docker"],
      },
      {
        id: "calendario-pesca",
        name: "Calendario de Pesca",
        repo: "https://github.com/enriquezaporta/calendario-pesca",
        img: "assets/img/calendario-pesca.webp",
        alt: "Calendario de Pesca season summary on desktop",
        text:
          "Sport fishing diary for competitions, championships and training in any discipline. Season statistics, friends with side-by-side comparison and chat, and private by default.",
        stack: ["JavaScript", "Python", "SQLite", "PWA", "Docker"],
      },
      {
        id: "cesta-compra",
        name: "Compra",
        repo: "https://github.com/enriquezaporta/cesta-compra",
        img: "assets/img/cesta-compra.webp",
        alt: "Compra list, quick add and send screens on mobile",
        text:
          "Shared household shopping list that is sent to Mercadona's online grocery service in one click. Nightly-updated catalog with photos and prices, estimated total, and a quick-add screen opened by tapping an NFC sticker on the fridge.",
        stack: ["JavaScript", "Python", "SQLite", "PWA", "NFC", "Docker"],
      },
    ],
    homelab: [
      {
        title: "Three-node Proxmox VE cluster",
        text: "Three Lenovo ThinkCentre M710q machines on ZFS so workloads can replicate between nodes. Each service runs in its own LXC container.",
      },
      {
        title: "Own network services",
        text: "dnsmasq resolves internal names and Caddy is the reverse proxy, with a wildcard Let's Encrypt certificate validated over DNS.",
      },
      {
        title: "Published without opening ports",
        text: "This site reaches the internet through a Cloudflare tunnel. Its container is isolated by the Proxmox firewall and cannot talk to the rest of the network.",
      },
      {
        title: "Remote access and monitoring",
        text: "WireGuard for access from outside. Telegraf, InfluxDB and Grafana for metrics, plus a touchscreen in the rack with a custom dashboard.",
      },
      {
        title: "Deployed from GitHub",
        text: "The container pulls the latest version of the repository every few minutes, so publishing a change is a git push.",
      },
    ],
    skills: [
      {
        group: "Systems and networking",
        items: ["MikroTik", "Cisco Meraki", "VLAN", "WireGuard", "DNS", "Firewall", "LibreNMS"],
      },
      {
        group: "Virtualization and servers",
        items: ["Proxmox VE", "VMware ESXi / vCenter", "LXC", "Docker", "Linux", "Windows Server"],
      },
      {
        group: "Microsoft and video surveillance",
        items: ["Microsoft 365", "Exchange Online", "Milestone XProtect"],
      },
      {
        group: "Video and in-house TV",
        items: ["Video encoders", "SDI and HDMI signal", "Channel distribution", "Live event monitoring"],
      },
      {
        group: "Web development",
        items: ["JavaScript", "PHP", "Python", "HTML and CSS", "Bootstrap 5", "SQLite", "PWA"],
      },
      {
        group: "CMS and ERP",
        items: ["WordPress", "Divi", "PrestaShop", "Dolibarr"],
      },
      {
        group: "Tools",
        items: ["Git and GitHub", "Caddy", "nginx", "Cloudflare", "Grafana", "InfluxDB"],
      },
      {
        group: "Soft skills",
        items: ["Communication", "Team management", "Problem solving"],
      },
    ],
    languages: [
      { name: "Spanish", level: "native" },
      { name: "English", level: "B2" },
    ],
    other: ["Driver's license", "Own vehicle"],
    education: [
      {
        title: "Higher Technician in Web Application Development",
        school: "CPIFP Bajo Aragón",
        start: "2021-09",
        end: "2024-04",
      },
      {
        title: "Technician in Microcomputer Systems and Networks",
        school: "CPIFP Bajo Aragón",
        start: "2016-09",
        end: "2018-06",
      },
      {
        title: "Compulsory Secondary Education (ESO)",
        school: "IES Bajo Aragón",
        start: "2011-09",
        end: "2016-06",
      },
    ],
    rack: {
      patch: "Patch panel",
      switch: "8-port managed switch",
      screen: "2U touchscreen with the metrics dashboard",
      pve1: "pve1: management (DNS, reverse proxy, VPN, monitoring)",
      pve2: "pve2: applications",
      pve3: "pve3: applications and this site",
      pdu: "Power distribution (2 PDUs)",
    },
    terminal: {
      welcome: "Welcome to cv@enriquezaporta. Type 'help' to see the commands.",
      help: "Available commands:",
      notFound: "Command not found: {cmd}. Type 'help'.",
      bye: "Closing the terminal…",
      langChanged: "Language switched to English.",
      langUsage: "Usage: lang es | lang en",
      hire: "Permission granted. Email me at {email} and let's talk.",
      cmds: {
        help: "show this help",
        whoami: "who I am",
        experience: "work experience",
        projects: "published projects",
        homelab: "where this site runs",
        skills: "skills",
        education: "education",
        contact: "how to reach me",
        lang: "switch language (es | en)",
        clear: "clear the screen",
        exit: "back to the visual version",
      },
      hint: "Tab completes, ↑ ↓ walk the history, Esc closes.",
    },
  },
};
