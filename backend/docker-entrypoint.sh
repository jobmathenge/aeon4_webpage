#!/bin/sh
set -e

npx prisma migrate deploy

DB_FILE=$(echo "$DATABASE_URL" | sed 's/^file://')
COUNT=0
if [ -f "$DB_FILE" ]; then
  COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM Stat;" 2>/dev/null || echo 0)
fi

if [ "$COUNT" = "0" ]; then
  echo "Empty database detected — seeding content..."
  npx prisma db seed
fi

exec node dist/src/main.js
