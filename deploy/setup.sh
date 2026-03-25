#!/bin/bash
set -e

# ── Criskros — Linode Multi-Instance Setup Script ───────────────────────
# Supports running multiple projects on the same server.
# Each project gets its own isolated Docker stack; Traefik handles routing.
#
# Run as root on a fresh Ubuntu 22.04 Linode:
#   bash setup.sh
# ────────────────────────────────────────────────────────────────────────

# ── Step 1: Install Docker ───────────────────────────────────────────────
if ! command -v docker &> /dev/null; then
  echo "==> Installing Docker..."
  apt-get update -y && apt-get install -y ca-certificates curl gnupg git

  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  echo "==> Docker installed: $(docker --version)"
else
  echo "==> Docker already installed: $(docker --version)"
fi

# ── Step 2: Start shared Traefik proxy (once per server) ─────────────────
PROXY_DIR="/opt/proxy"

if docker network inspect proxy &> /dev/null; then
  echo "==> Shared proxy network already exists — skipping Traefik setup."
else
  echo ""
  echo "==> Setting up shared Traefik reverse proxy (runs once per server)..."
  echo "    Enter your email for SSL certificate notifications:"
  read -r ACME_EMAIL

  mkdir -p "$PROXY_DIR"
  cat > "$PROXY_DIR/docker-compose.yml" << 'PROXY_COMPOSE'
services:
  traefik:
    image: traefik:v3
    restart: always
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email=${ACME_EMAIL}"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt
    networks:
      - proxy
networks:
  proxy:
    name: proxy
volumes:
  letsencrypt:
PROXY_COMPOSE

  echo "ACME_EMAIL=$ACME_EMAIL" > "$PROXY_DIR/.env"
  docker compose -f "$PROXY_DIR/docker-compose.yml" --env-file "$PROXY_DIR/.env" up -d
  echo "==> Traefik proxy is running."
fi

# ── Step 3: Clone this project ───────────────────────────────────────────
echo ""
echo "==> Cloning the Criskros repository..."
echo "    Enter your Git repository URL (e.g. https://github.com/you/criskros.git):"
read -r REPO_URL

echo "    Enter the folder name for this instance (e.g. criskros or criskros-staging):"
read -r PROJECT_FOLDER

INSTALL_DIR="/opt/$PROJECT_FOLDER"
git clone "$REPO_URL" "$INSTALL_DIR"
cd "$INSTALL_DIR"

# ── Step 4: Generate .env with secrets ───────────────────────────────────
echo ""
echo "==> Configuring environment..."
echo "    Enter the domain for this instance (e.g. www.criskros.com):"
read -r DOMAIN

echo "    Enter a project name (lowercase, no spaces — used to namespace containers, e.g. criskros):"
read -r PROJECT_NAME

PG_PASS=$(openssl rand -base64 32 | tr -d '=+/' | head -c 32)
K1=$(openssl rand -base64 16); K2=$(openssl rand -base64 16)
K3=$(openssl rand -base64 16); K4=$(openssl rand -base64 16)
API_SALT=$(openssl rand -base64 32 | tr -d '=+/')
ADMIN_JWT=$(openssl rand -base64 32 | tr -d '=+/')
TRANSFER=$(openssl rand -base64 32 | tr -d '=+/')
JWT=$(openssl rand -base64 32 | tr -d '=+/')

cat > deploy/.env << ENV
COMPOSE_PROJECT_NAME=$PROJECT_NAME
DOMAIN=$DOMAIN

POSTGRES_DB=$PROJECT_NAME
POSTGRES_USER=$PROJECT_NAME
POSTGRES_PASSWORD=$PG_PASS

STRAPI_APP_KEYS=$K1,$K2,$K3,$K4
STRAPI_API_TOKEN_SALT=$API_SALT
STRAPI_ADMIN_JWT_SECRET=$ADMIN_JWT
STRAPI_TRANSFER_TOKEN_SALT=$TRANSFER
STRAPI_JWT_SECRET=$JWT
ENV

echo "==> .env created with auto-generated secrets."

# ── Step 5: Build and start ───────────────────────────────────────────────
echo ""
echo "==> Building and starting $PROJECT_NAME (this takes ~5-10 minutes)..."
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build

echo ""
echo "========================================================"
echo "  $PROJECT_NAME is now live!"
echo ""
echo "  Website:       https://$DOMAIN"
echo "  Strapi Admin:  https://$DOMAIN/admin/"
echo "  Server IP:     $(curl -s ifconfig.me)"
echo ""
echo "  DNS: Add an A record for $DOMAIN → $(curl -s ifconfig.me)"
echo ""
echo "  To add another project later, just run this script again."
echo "  Traefik will already be running — it will be skipped."
echo "========================================================"
