#!/bin/bash
set -e

# ── Criskros — Linode Fresh Server Setup ────────────────────────────────
# Run this script as root on a fresh Ubuntu 22.04 Linode:
#   bash setup.sh
# ────────────────────────────────────────────────────────────────────────

echo "==> Updating system packages..."
apt-get update -y && apt-get upgrade -y

echo "==> Installing Docker..."
apt-get install -y ca-certificates curl gnupg lsb-release git

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "==> Docker installed: $(docker --version)"
echo "==> Docker Compose installed: $(docker compose version)"

# ── Clone the project ────────────────────────────────────────────────────
echo ""
echo "==> Cloning repository..."
echo "    Enter your Git repository URL (e.g. https://github.com/you/criskros.git):"
read -r REPO_URL

git clone "$REPO_URL" /opt/criskros
cd /opt/criskros

# ── Create .env file ─────────────────────────────────────────────────────
echo ""
echo "==> Setting up environment variables..."
cp deploy/.env.example deploy/.env

echo ""
echo "    Generating secrets automatically..."
PG_PASS=$(openssl rand -base64 32 | tr -d '=+/' | head -c 32)
KEY1=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))" 2>/dev/null || openssl rand -base64 16)
KEY2=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))" 2>/dev/null || openssl rand -base64 16)
KEY3=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))" 2>/dev/null || openssl rand -base64 16)
KEY4=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64'))" 2>/dev/null || openssl rand -base64 16)
API_SALT=$(openssl rand -base64 32 | tr -d '=+/')
ADMIN_JWT=$(openssl rand -base64 32 | tr -d '=+/')
TRANSFER_SALT=$(openssl rand -base64 32 | tr -d '=+/')
JWT_SECRET=$(openssl rand -base64 32 | tr -d '=+/')

echo "    Enter your domain (e.g. www.criskros.com):"
read -r DOMAIN

sed -i "s|DOMAIN=www.criskros.com|DOMAIN=$DOMAIN|" deploy/.env
sed -i "s|CHANGE_ME_STRONG_PASSWORD|$PG_PASS|" deploy/.env
sed -i "s|STRAPI_APP_KEYS=key1==,key2==,key3==,key4==|STRAPI_APP_KEYS=$KEY1,$KEY2,$KEY3,$KEY4|" deploy/.env
sed -i "s|STRAPI_API_TOKEN_SALT=CHANGE_ME|STRAPI_API_TOKEN_SALT=$API_SALT|" deploy/.env
sed -i "s|STRAPI_ADMIN_JWT_SECRET=CHANGE_ME|STRAPI_ADMIN_JWT_SECRET=$ADMIN_JWT|" deploy/.env
sed -i "s|STRAPI_TRANSFER_TOKEN_SALT=CHANGE_ME|STRAPI_TRANSFER_TOKEN_SALT=$TRANSFER_SALT|" deploy/.env
sed -i "s|STRAPI_JWT_SECRET=CHANGE_ME|STRAPI_JWT_SECRET=$JWT_SECRET|" deploy/.env

echo ""
echo "==> Building and starting all services (this will take ~5-10 minutes)..."
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build

echo ""
echo "========================================================"
echo "  Criskros is now live!"
echo ""
echo "  Website:       http://$DOMAIN  (or http://$(curl -s ifconfig.me))"
echo "  Strapi Admin:  http://$DOMAIN/admin/"
echo ""
echo "  Next steps:"
echo "  1. Point your DNS A record for $DOMAIN to: $(curl -s ifconfig.me)"
echo "  2. Visit /admin/ to create your Strapi admin account"
echo "  3. (Optional) Add SSL with: apt install certbot"
echo "     certbot --nginx -d $DOMAIN"
echo "========================================================"
