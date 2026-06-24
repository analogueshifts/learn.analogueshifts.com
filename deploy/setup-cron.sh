#!/usr/bin/env bash
set -euo pipefail

# Installs system crontab entries that replace Vercel Cron (see ../vercel.json)
# for this app, since the VPS has no Vercel Cron. Idempotent: re-running
# replaces the previously installed block rather than duplicating it.
#
# Usage:
#   sudo bash deploy/setup-cron.sh --domain learn.analogueshifts.com --env-file /var/www/learn.analogueshifts.com/.env.production

DOMAIN=""
ENV_FILE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain) DOMAIN="$2"; shift 2 ;;
    --env-file) ENV_FILE="$2"; shift 2 ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

if [[ -z "$DOMAIN" || -z "$ENV_FILE" ]]; then
  echo "Usage: setup-cron.sh --domain <domain> --env-file <path to .env.production>"
  exit 1
fi

CRON_SECRET="$(grep -E '^CRON_SECRET=' "$ENV_FILE" | cut -d= -f2-)"
if [[ -z "$CRON_SECRET" ]]; then
  echo "Error: CRON_SECRET not set in $ENV_FILE"
  exit 1
fi

BASE_URL="https://$DOMAIN"
MARKER_START="# >>> ${DOMAIN}-cron >>>"
MARKER_END="# <<< ${DOMAIN}-cron <<<"

NEW_BLOCK="$MARKER_START
0 * * * * curl -fsS -X GET -H \"Authorization: Bearer ${CRON_SECRET}\" ${BASE_URL}/api/cron/live-session-reminders >/var/log/${DOMAIN}-cron.log 2>&1
0 6 * * * curl -fsS -X GET -H \"Authorization: Bearer ${CRON_SECRET}\" ${BASE_URL}/api/cron/inactive-students >>/var/log/${DOMAIN}-cron.log 2>&1
0 6 * * 1 curl -fsS -X GET -H \"Authorization: Bearer ${CRON_SECRET}\" ${BASE_URL}/api/cron/payout-reminders >>/var/log/${DOMAIN}-cron.log 2>&1
$MARKER_END"

EXISTING="$(crontab -l 2>/dev/null || true)"
FILTERED="$(echo "$EXISTING" | awk -v start="$MARKER_START" -v end="$MARKER_END" '
  $0 == start { skip=1 }
  !skip { print }
  $0 == end { skip=0 }
')"

printf '%s\n%s\n' "$FILTERED" "$NEW_BLOCK" | crontab -

echo "Cron entries installed for $DOMAIN:"
crontab -l | sed -n "/$MARKER_START/,/$MARKER_END/p"
