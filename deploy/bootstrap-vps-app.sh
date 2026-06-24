#!/usr/bin/env bash
set -euo pipefail

# Bootstrap and deploy the learn.analogueshifts.com full-stack Next.js app
# (own Postgres DB, NextAuth, Prisma migrations, cron-driven reminders) on a
# VPS that may already be running other apps (PM2 + Nginx, separate ports/DBs).
#
# Run as root or with sudo:
#   sudo bash deploy/bootstrap-vps-app.sh \
#     --app-name learn-analogueshifts \
#     --domain learn.analogueshifts.com \
#     --repo git@github.com:analogueshifts/learn.analogueshifts.com.git
#
# First run scaffolds $APP_DIR/.env.production with placeholders and stops so
# you can fill in real secrets (OAuth, Stripe/Paystack/Flutterwave, Resend,
# Brevo, CRON_SECRET). Re-run the same command afterwards to actually deploy.

APP_NAME=""
DOMAIN=""
REPO_URL=""
APP_DIR=""
BRANCH="master"
PORT="3000"
EMAIL=""
DB_NAME=""
DB_USER=""

print_help() {
  cat <<'EOF'
Usage:
  bootstrap-vps-app.sh --app-name <name> --domain <domain> --repo <git-url> [options]

Required:
  --app-name     PM2 app name + default DB name/user (example: learn-analogueshifts)
  --domain       Domain (example: learn.analogueshifts.com)
  --repo         GitHub repo URL (SSH or HTTPS)

Optional:
  --app-dir      App directory (default: /var/www/<domain>)
  --branch       Git branch (default: master)
  --port         Node app port behind Nginx, must not collide with other apps (default: 3000)
  --email        Email for certbot registration (recommended)
  --db-name      Postgres database name (default: <app-name> with - replaced by _)
  --db-user      Postgres role name (default: same as --db-name)
  --help         Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app-name) APP_NAME="$2"; shift 2 ;;
    --domain) DOMAIN="$2"; shift 2 ;;
    --repo) REPO_URL="$2"; shift 2 ;;
    --app-dir) APP_DIR="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    --port) PORT="$2"; shift 2 ;;
    --email) EMAIL="$2"; shift 2 ;;
    --db-name) DB_NAME="$2"; shift 2 ;;
    --db-user) DB_USER="$2"; shift 2 ;;
    --help) print_help; exit 0 ;;
    *) echo "Unknown argument: $1"; print_help; exit 1 ;;
  esac
done

if [[ -z "$APP_NAME" || -z "$DOMAIN" || -z "$REPO_URL" ]]; then
  echo "Error: --app-name, --domain, and --repo are required."
  print_help
  exit 1
fi

[[ -z "$APP_DIR" ]] && APP_DIR="/var/www/$DOMAIN"
[[ -z "$DB_NAME" ]] && DB_NAME="$(echo "$APP_NAME" | tr '-' '_')"
[[ -z "$DB_USER" ]] && DB_USER="$DB_NAME"

echo "[1/10] Installing system dependencies (first run only)"
if ! command -v node >/dev/null 2>&1; then
  apt update
  apt install -y curl git
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi
command -v nginx >/dev/null 2>&1 || apt install -y nginx
command -v certbot >/dev/null 2>&1 || apt install -y certbot python3-certbot-nginx
command -v pm2 >/dev/null 2>&1 || npm install -g pm2
command -v psql >/dev/null 2>&1 || apt install -y postgresql postgresql-contrib

echo "[2/10] Provisioning dedicated Postgres database"
DB_SECRET_FILE="/root/.${DB_NAME}_db_password"
if [[ -f "$DB_SECRET_FILE" ]]; then
  DB_PASSWORD="$(cat "$DB_SECRET_FILE")"
else
  DB_PASSWORD="$(openssl rand -hex 24)"
  echo "$DB_PASSWORD" > "$DB_SECRET_FILE"
  chmod 600 "$DB_SECRET_FILE"
fi

ROLE_EXISTS="$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")"
if [[ "$ROLE_EXISTS" != "1" ]]; then
  sudo -u postgres psql -c "CREATE ROLE \"$DB_USER\" LOGIN PASSWORD '$DB_PASSWORD';"
else
  sudo -u postgres psql -c "ALTER ROLE \"$DB_USER\" WITH PASSWORD '$DB_PASSWORD';"
fi

DB_EXISTS="$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")"
if [[ "$DB_EXISTS" != "1" ]]; then
  sudo -u postgres psql -c "CREATE DATABASE \"$DB_NAME\" OWNER \"$DB_USER\";"
fi
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

echo "[3/10] Preparing app directory"
mkdir -p "$APP_DIR"
if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "[4/10] Pulling latest source"
git -C "$APP_DIR" fetch origin
if git -C "$APP_DIR" show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git -C "$APP_DIR" checkout "$BRANCH"
else
  git -C "$APP_DIR" checkout -b "$BRANCH" "origin/$BRANCH"
fi
git -C "$APP_DIR" pull --ff-only origin "$BRANCH" || {
  echo "Fast-forward pull failed. Resolve local changes in $APP_DIR, then rerun."
  exit 1
}

cd "$APP_DIR"

ENV_FILE="$APP_DIR/.env.production"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "[5/10] Scaffolding $ENV_FILE -- fill in the placeholders, then rerun this script"
  cat > "$ENV_FILE" <<EOF
DATABASE_URL=$DATABASE_URL
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=https://$DOMAIN
PORT=$PORT
NODE_ENV=production

# --- fill these in before relying on the corresponding features ---
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_HASH=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

RESEND_API_KEY=
NEXT_PUBLIC_BREVO_KEY=

# Shared secret this app's own cron endpoints check for in "Authorization: Bearer <value>"
CRON_SECRET=$(openssl rand -hex 32)
EOF
  chmod 600 "$ENV_FILE"
  echo
  echo "Stopped: edit $ENV_FILE with real secrets, then rerun this exact command to continue."
  exit 0
fi

echo "[6/10] Installing Node dependencies"
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

echo "[7/10] Running Prisma migrations"
set -a
source "$ENV_FILE"
set +a
npx prisma generate
npx prisma migrate deploy

echo "[8/10] Building Next.js app"
npm run build

echo "[9/10] Starting app with PM2"
export PORT="$PORT"
export PM2_APP_NAME="$APP_NAME"
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs --update-env
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

echo "[10/10] Configuring Nginx + HTTPS"
cat > "/etc/nginx/sites-available/$DOMAIN" <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
ln -sfn "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t
systemctl reload nginx

if [[ -n "$EMAIL" ]]; then
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect
else
  certbot --nginx -d "$DOMAIN"
fi

echo
echo "Wiring cron-driven reminder endpoints (see vercel.json schedules)"
bash "$(dirname "$0")/setup-cron.sh" --domain "$DOMAIN" --env-file "$ENV_FILE"

echo
echo "Deployment complete"
echo "App: $APP_NAME"
echo "URL: https://$DOMAIN"
echo "DB: $DB_NAME (password in $DB_SECRET_FILE)"
echo "Check logs: pm2 logs $APP_NAME"
