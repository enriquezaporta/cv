# enriquezaporta.es

Mi CV interactivo, servido desde mi propio homelab: <https://enriquezaporta.es>

- **Versión visual** con un rack interactivo del homelab donde se ejecuta la página.
- **Modo terminal** con comandos (`help`, `whoami`, `experience`, `projects`…). También se abre con la tecla `` ` `` o en `enriquezaporta.es/#terminal`.
- **Español e inglés**, según el idioma del navegador o con `?lang=es` / `?lang=en`.
- **PDF**: el botón *Descargar PDF* usa una hoja de estilos de impresión pensada para A4.

HTML, CSS y JavaScript sin frameworks ni paso de compilación. Sin peticiones a terceros: las fuentes y las imágenes se sirven desde el propio servidor.

## Estructura

```
public/                 lo que sirve nginx
  index.html
  assets/js/content.js  todo el texto del CV (ES y EN)
  assets/js/app.js      render, idioma y rack
  assets/js/terminal.js modo terminal
  assets/css/style.css
  assets/fonts/         Archivo y JetBrains Mono (licencia OFL)
  assets/img/           capturas de los proyectos
deploy/                 instalación en el contenedor
```

Para cambiar el contenido basta con editar `public/assets/js/content.js`.

## Probarlo en local

```bash
cd public
python3 -m http.server 8080
```

y abre <http://localhost:8080>.

## Cómo se publica

```
GitHub ──(git fetch cada 5 min)──> CT Debian en Proxmox ──> nginx :80 ──> cloudflared ──> Cloudflare ──> internet
```

- El contenedor no tiene puertos abiertos: la web sale por un túnel de Cloudflare.
- El firewall de Proxmox aísla el contenedor del resto de la red local.
- Un timer de systemd (`deploy/cv-update.timer`) trae los cambios de `main` con un usuario sin privilegios. Publicar es hacer `git push`.

Instalación en un contenedor Debian nuevo:

```bash
apt install -y git
git clone --depth 1 https://github.com/enriquezaporta/cv.git /var/www/cv
bash /var/www/cv/deploy/install.sh
```

## Licencia

Código bajo licencia MIT. El contenido del CV es personal. Las fuentes mantienen su licencia SIL Open Font License (ver `public/assets/fonts/`).
