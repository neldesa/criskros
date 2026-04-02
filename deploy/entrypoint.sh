#!/bin/sh
set -e

# Generate the htpasswd file from environment variables on every container start
# This ensures password protection survives container restarts
if [ -n "$PREVIEW_USER" ] && [ -n "$PREVIEW_PASSWORD" ]; then
  printf "%s:%s\n" "$PREVIEW_USER" "$(openssl passwd -apr1 "$PREVIEW_PASSWORD")" > /etc/nginx/.htpasswd
  echo "Password protection enabled for user: $PREVIEW_USER"
fi

exec nginx -g "daemon off;"
