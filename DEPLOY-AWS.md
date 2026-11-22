# Deploy em AWS EC2 — Hard Rock Gym (`lariussport.duckdns.org`)

Guia passo-a-passo para colocar os **8 microserviços Spring + Postgres + RabbitMQ +
frontend React** a correr 24/7 numa instância **AWS EC2 Ubuntu**, com HTTPS automático
via **Caddy + Let's Encrypt** e subdomínio grátis **DuckDNS**.

Inclui **hardening OWASP Top 10** aplicado ao código e à infraestrutura.

> Substitui o guia anterior `DEPLOY.md` (Oracle Cloud). A estrutura é parecida, mas
> comandos AWS/UFW/Security-Groups são diferentes.

---

## Pré-requisitos

- Conta AWS com instância **EC2** criada (≥ 4 GB RAM — t3.large/medium recomendado)
- Ubuntu 22.04 ou 24.04
- Par de chaves SSH (`.pem`) descarregado
- Já consegues entrar na instância:
  ```bash
  ssh -i chave.pem ubuntu@<IP_PUBLICO>
  ```

---

## Parte 1 — Subdomínio DuckDNS (2 min)

1. Vai a <https://www.duckdns.org> e entra (Google/GitHub).
2. Em *domains*, cria **`lariussport`** → ficas com `lariussport.duckdns.org`.
3. Guarda o **token** no topo da página.
4. No campo *current ip* mete o **IP público da tua EC2** → **update ip**.

> **Dica:** se tiveres um **Elastic IP** associado à EC2, o IP não muda ao parar/reiniciar.
> Sem Elastic IP (grátis quando associado) o IP muda a cada stop → tens de reatualizar
> o DuckDNS. Associa Elastic IP → EC2 → Instances → Actions → Networking → Associate
> Elastic IP.

---

## Parte 2 — Security Group (firewall AWS)

A AWS tem duas camadas de firewall: **Security Group** (AWS) e **UFW** (Ubuntu).
Começas por abrir só o estritamente necessário no Security Group.

**EC2 Console → Instances → tua instância → Security → Security Groups → ID → Edit inbound rules:**

| Type | Protocol | Port | Source | Purpose |
|---|---|---|---|---|
| SSH | TCP | 22 | **O teu IP /32** (não `0.0.0.0/0`) | Acesso remoto só do teu PC |
| HTTP | TCP | 80 | `0.0.0.0/0` | Let's Encrypt validation + redirect |
| HTTPS | TCP | 443 | `0.0.0.0/0` | Site público |

> **Importante OWASP A05:** NÃO abras 5433 (Postgres), 15672 (RabbitMQ), 8080 (gateway)
> ou 8761 (Eureka) ao mundo. Ficam acessíveis só dentro da VPC.

Descobre o teu IP público em <https://whatismyip.com> e usa-o no campo Source para SSH.

---

## Parte 3 — Hardening do SO Ubuntu

Entra na VM:
```bash
ssh -i chave.pem ubuntu@<IP_PUBLICO>
```

Corre o script `deploy/harden-ubuntu.sh` (criado neste commit) **ou** manualmente:

```bash
# Atualizações automáticas de segurança
sudo apt update && sudo apt upgrade -y
sudo apt install -y unattended-upgrades fail2ban ufw docker.io docker-compose-plugin git
sudo dpkg-reconfigure -plow unattended-upgrades    # <ENTER> para confirmar

# Firewall Ubuntu — bloqueia tudo exceto SSH/HTTP/HTTPS
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status

# Fail2ban — bane IPs que falham SSH 3× em 10min
sudo systemctl enable --now fail2ban
sudo fail2ban-client status

# SSH só por chave (nunca password)
sudo sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Docker sem sudo
sudo usermod -aG docker ubuntu
newgrp docker
docker --version && docker compose version
```

---

## Parte 4 — Clonar o projeto

```bash
git clone https://github.com/Bauirxx/HardRock-.git fitgym
cd fitgym/backend-spring
```

> O repo é público. **Ver Parte 7** para rotação de credenciais expostas no histórico.

---

## Parte 5 — Configurar `.env` (⚠️ CRÍTICO)

Copia o exemplo e **substitui todos os valores**:

```bash
cd ~/fitgym/backend-spring
cp .env.example .env
nano .env
```

Valores **obrigatórios** a substituir (OWASP A02 — Cryptographic Failures):

```env
# Domínio público
SITE_ADDRESS=lariussport.duckdns.org
FRONTEND_URL=https://lariussport.duckdns.org
APP_CORS_ALLOWED_ORIGINS=https://lariussport.duckdns.org

# PostgreSQL — password forte (não deixar "postgres")
POSTGRES_USER=gym_admin
POSTGRES_PASSWORD=$(openssl rand -base64 32)   # copia o output para o .env

# RabbitMQ — password forte
RABBITMQ_USER=gym_mq
RABBITMQ_PASSWORD=$(openssl rand -base64 32)

# JWT — secret aleatório 64+ bytes
JWT_SECRET=$(openssl rand -base64 64)

# Gmail App Password — gerar NOVA em https://myaccount.google.com/apppasswords
MAIL_USERNAME=o-teu-email@gmail.com
MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx           # <- nunca partilhar

# PaySuite — NOVO token (o anterior foi exposto no git público)
PAYSUITE_TOKEN=xxxx|xxxxxxxxxxxxxxxxxxxxxxxx
PAYSUITE_WEBHOOK_SECRET=$(openssl rand -hex 32)
PAYSUITE_CALLBACK_URL=https://lariussport.duckdns.org/api/v1/checkout/webhook
PAYSUITE_RETURN_URL=https://lariussport.duckdns.org/pagamento/retorno
PAYSUITE_WEBHOOK_REQUIRED=true                # força validação HMAC em produção
```

Gerar todos os secrets de uma vez:
```bash
cat <<EOF
POSTGRES_PASSWORD=$(openssl rand -base64 32)
RABBITMQ_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)
PAYSUITE_WEBHOOK_SECRET=$(openssl rand -hex 32)
EOF
```

---

## Parte 6 — Build e arranque

```bash
cd ~/fitgym/backend-spring
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

- **Primeira vez demora 15-30 min** (compila os 8 serviços Java).
- Acompanha: `docker compose ps` (esperar todos *healthy*).
- As bases de dados são criadas automaticamente a partir de `init-databases.sql`.

Depois:
```bash
docker compose ps
docker compose logs -f gym-web          # Caddy — vês emissão do cert HTTPS
docker compose logs -f gym-api-gateway
```

O Caddy obtém certificado HTTPS automaticamente no primeiro arranque (~1 min).

---

## Parte 7 — ⚠️ Rotação de credenciais expostas

O repo é **público** e o histórico tem credenciais reais. Antes do deploy em produção:

1. **Gmail App Password** `ydtegvwkyikpshia` (jaimecebola001@gmail.com):
   - Vai a <https://myaccount.google.com/apppasswords> → **revoga** essa App Password
   - Gera uma nova para usar no `.env`

2. **PaySuite Token** `2205|OVu8c4K...`:
   - Entra no painel PaySuite → **revoga** o token
   - Gera um novo

3. Nunca commitares o `.env` — já está no `.gitignore` depois desta sessão, mas o
   histórico antigo ainda tem os valores. Para limpar o histórico (destrutivo):
   ```bash
   # No teu PC, NÃO na EC2:
   pip install git-filter-repo
   git filter-repo --invert-paths --path backend-spring/.env --path backend-django/.env --path .env
   git push origin --force --all
   ```
   > Aviso: `--force` reescreve o histórico para todos os colaboradores. Avisa quem clonou.

---

## Parte 8 — Testes pós-deploy (verificação OWASP)

```bash
# 1. Site acessível em HTTPS
curl -I https://lariussport.duckdns.org
# → HTTP/2 200, headers Strict-Transport-Security, X-Frame-Options, CSP

# 2. HTTP redireciona para HTTPS
curl -I http://lariussport.duckdns.org
# → 308 Permanent Redirect, Location: https://...

# 3. Portas internas BLOQUEADAS do exterior (OWASP A05)
curl -m 5 http://<IP_PUBLICO>:5433   # Postgres   → timeout / connection refused ✓
curl -m 5 http://<IP_PUBLICO>:15672  # RabbitMQ   → timeout / connection refused ✓
curl -m 5 http://<IP_PUBLICO>:8080   # Gateway    → timeout / connection refused ✓

# 4. Actuator sensível protegido
curl -s https://lariussport.duckdns.org/actuator/env     # → 401 ou 403 ✓
curl -s https://lariussport.duckdns.org/actuator/health  # → 200 ✓

# 5. Rate limit no login (OWASP A07)
for i in $(seq 1 15); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST https://lariussport.duckdns.org/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"fake@x.com","password":"wrong"}'
done
# → primeiros ~10 retornam 401, restantes retornam 429 (Too Many Requests) ✓

# 6. CORS — só o domínio real é aceite
curl -H "Origin: https://evil.com" -I https://lariussport.duckdns.org/api/v1/servicos
# → sem Access-Control-Allow-Origin ✓

# 7. Mozilla Observatory — scan completo
# Browser: https://observatory.mozilla.org/analyze/lariussport.duckdns.org
# Expect: grade A ou A+

# 8. SecurityHeaders.com
# Browser: https://securityheaders.com/?q=lariussport.duckdns.org
# Expect: A+
```

---

## Parte 9 — Pós-login admin

Primeiro login:
- URL: <https://lariussport.duckdns.org>
- Email: `admin@gym.com`
- Password seed: `Admin@2026`

**AÇÃO IMEDIATA:** entra em *Admin → Definições* e **muda a password**.

---

## Manutenção

```bash
# Ver estado
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Logs
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f --tail 100

# Atualizar após mudanças de código
cd ~/fitgym
git pull
cd backend-spring
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Parar tudo
docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# Backup Postgres
docker exec gym-postgres pg_dumpall -U $POSTGRES_USER > backup-$(date +%F).sql

# Ver bans fail2ban
sudo fail2ban-client status sshd
```

---

## Notas AWS específicas

- **Elastic IP:** evita que o IP mude (grátis enquanto associado a uma instância ativa).
  Sem ele, cada *stop/start* muda o IP e perdes o acesso DuckDNS.
- **Cost alerts:** cria um Budget em AWS Billing para te avisar se passar de 5 USD/mês.
  Tráfego de saída HTTP excessivo pode gerar custos — monitoriza.
- **Snapshots EBS:** cria um snapshot semanal da raiz da EC2 (console → EBS → Volumes →
  Create snapshot). Baratíssimo (~1 USD/mês) e salva-te se algo correr mal.
- **Swap:** se tiveres <8 GB RAM, cria 2 GB de swap:
  ```bash
  sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
  sudo mkswap /swapfile && sudo swapon /swapfile
  echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
  ```

---

## Resumo OWASP Top 10 — o que ficou coberto

| OWASP | Risco | Mitigação aplicada |
|---|---|---|
| **A01** Broken Access Control | CORS wildcard com credenciais | Whitelist por `APP_CORS_ALLOWED_ORIGINS` (SecurityConfig + gateway) |
| **A02** Cryptographic Failures | JWT secret fraco, passwords fracas | Secrets aleatórios 64+ bytes, BCrypt strength 12 |
| **A03** Injection | Inputs sem limites | `@Valid`, `@Size`, `@Email`, `@Pattern` nos DTOs públicos |
| **A04** Insecure Design | — | Separação por roles (`@PreAuthorize`), multi-tenant |
| **A05** Security Misconfiguration | Portas internas expostas, Actuator aberto | `!reset ports` em prod, Actuator só `/health`+`/info`, security headers Caddy |
| **A06** Vulnerable Components | Deps desatualizadas | Rever `mvn versions:display-dependency-updates` periodicamente |
| **A07** Identification & Auth Failures | Brute-force login | `LoginRateLimitFilter` (10 tentativas / 60s por IP+endpoint) |
| **A08** Software/Data Integrity | Webhook sem signature | `PAYSUITE_WEBHOOK_REQUIRED=true` força HMAC SHA256 |
| **A09** Logging & Monitoring | — | Logs em `docker compose logs`, fail2ban para SSH |
| **A10** SSRF | — | Payment client valida host do PaySuite |

---

## Problemas comuns

**Cert Let's Encrypt falha:** o domínio DuckDNS tem de estar a apontar para o IP da EC2
**antes** do Caddy arrancar. Verifica `dig lariussport.duckdns.org` dá o IP certo.

**Out of memory ao compilar:** Adiciona swap (ver Notas AWS).

**Login web dá 429 por engano:** tu mesmo fizeste rate-limit. Espera 1 min ou reinicia
`gym-auth-service`.

**CSP bloqueia imagem/script externo:** edita `deploy/Caddyfile` e adiciona o domínio
à directiva correspondente (`img-src`, `script-src`...).
