#!/bin/sh
DBURL="$DATABASE_URL"
case "$DBURL" in
  *localhost*|*127.0.0.1*) ;;
  *)
    if ! echo "$DBURL" | grep -q "sslmode="; then
      if echo "$DBURL" | grep -q "?"; then
        DBURL="$DBURL&sslmode=require"
      else
        DBURL="$DBURL?sslmode=require"
      fi
    fi
    ;;
esac
export DATABASE_URL="$DBURL"

npx prisma db push --accept-data-loss
npx tsx prisma/seed.ts
npm run start
