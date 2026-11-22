#!/usr/bin/env bash
# Hardening básico de uma Ubuntu 22.04/24.04 nova para alojar o Hard Rock Gym.
# Cobre OWASP A05 (Security Misconfiguration) na camada de SO.
#
# USO:  curl -fsSL .../harden-ubuntu.sh | sudo bash
#  OU:  sudo bash harden-ubuntu.sh
#
# O script é idempotente — pode correr várias vezes.

set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Correr como root (sudo bash harden-ubuntu.sh)"
  exit 1
fi

log() { printf "\n\033[1;36m[harden]\033[0m %s\n" "$*"; }

log "1/7 — Atualizar sistema e instalar pacotes"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y \
    unattended-upgrades apt-listchanges \
    fail2ban ufw \
    docker.io docker-compose-plugin \
    git curl ca-certificates \
    chrony

log "2/7 — Atualizações automáticas de segurança"
cat >/etc/apt/apt.conf.d/50unattended-upgrades <<'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
EOF
cat >/etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
systemctl enable --now unattended-upgrades

log "3/7 — Firewall UFW (porta 22 SSH, 80 HTTP, 443 HTTPS)"
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP (Let\''s Encrypt + redirect)'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable
ufw status verbose

log "4/7 — Fail2ban (SSH brute-force protection)"
cat >/etc/fail2ban/jail.d/custom.conf <<'EOF'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 3
backend  = systemd

[sshd]
enabled = true
EOF
systemctl enable --now fail2ban
fail2ban-client reload

log "5/7 — Hardening SSH (só chaves, sem root login)"
SSH_CFG=/etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' "$SSH_CFG"
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' "$SSH_CFG"
sed -i 's/^#*X11Forwarding.*/X11Forwarding no/' "$SSH_CFG"
sed -i 's/^#*PermitEmptyPasswords.*/PermitEmptyPasswords no/' "$SSH_CFG"
# ChallengeResponseAuthentication no (impede 2FA ser contornada por password)
if ! grep -q '^ChallengeResponseAuthentication' "$SSH_CFG"; then
    echo 'ChallengeResponseAuthentication no' >> "$SSH_CFG"
else
    sed -i 's/^#*ChallengeResponseAuthentication.*/ChallengeResponseAuthentication no/' "$SSH_CFG"
fi
sshd -t && systemctl restart ssh

log "6/7 — Docker: utilizador ubuntu no grupo docker"
usermod -aG docker ubuntu || true

log "7/7 — Swap (se não existir e RAM < 8 GB)"
if [[ ! -f /swapfile ]]; then
    RAM_MB=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
    if [[ "$RAM_MB" -lt 8192 ]]; then
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        grep -q '/swapfile' /etc/fstab || echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
        log "Swap 2 GB criado."
    else
        log "RAM $RAM_MB MB — swap não necessário."
    fi
fi

log "DONE. Verificação rápida:"
ufw status | sed 's/^/  /'
systemctl is-active fail2ban | sed 's/^/  fail2ban: /'
docker --version | sed 's/^/  /'
docker compose version | sed 's/^/  /'

cat <<'TIP'

─────────────────────────────────────────────────────────
Próximos passos:
  1. Logout + login SSH (para o grupo docker ficar activo)
  2. git clone https://github.com/Bauirxx/HardRock-.git fitgym
  3. cd fitgym/backend-spring && cp .env.example .env && nano .env
  4. docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
─────────────────────────────────────────────────────────
TIP
