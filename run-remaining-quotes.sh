#!/bin/bash
set -a
source .env.local
set +a
npx tsx scripts/fix-remaining-quotes.ts
