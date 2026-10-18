#!/usr/bin/env bash
# Instala el CV en el CT 131 (Debian 13) y deja configurada la actualización
# automática desde GitHub. Ejecutar como root después de clonar el repo:
#
#   apt install -y git
#   git clone --depth 1 https://github.com/enriquezaporta/cv.git /var/www/cv
#   bash /var/www/cv/deploy/install.sh
#
set -euo pipefail

DIR=/var/www/cv
SRC="$DIR/deploy"

if [ "$(id -u)" -ne 0 ]; then
  echo "Ejecuta este script como root." >&2
  exit 1
fi
if [ ! -d "$DIR/.git" ]; then
  echo "No encuentro el repo en $DIR. Clónalo primero (ver cabecera del script)." >&2
  exit 1
fi

echo "==> Paquetes"
apt-get update -qq
apt-get install -y -qq git nginx >/dev/null

echo "==> Usuario de sincronización (sin shell ni login)"
id cvsync >/dev/null 2>&1 || useradd --system --no-create-home --home-dir /nonexistent --shell /usr/sbin/nologin cvsync
chown -R cvsync:cvsync "$DIR"

echo "==> nginx"
install -m 644 "$SRC/nginx-cv.conf" /etc/nginx/sites-available/cv
ln -sf /etc/nginx/sites-available/cv /etc/nginx/sites-enabled/cv
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> Actualización automática"
install -m 644 "$SRC/cv-update.service" /etc/systemd/system/cv-update.service
install -m 644 "$SRC/cv-update.timer" /etc/systemd/system/cv-update.timer
systemctl daemon-reload
systemctl enable --now cv-update.timer
systemctl start cv-update.service

echo
echo "Listo."
echo "  Web local:        curl -sI http://localhost/"
echo "  Última sync:      journalctl -u cv-update.service -n 20 --no-pager"
echo "  Próxima sync:     systemctl list-timers cv-update.timer"
