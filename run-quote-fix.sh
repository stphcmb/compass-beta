#!/bin/bash
# Load environment variables from .env.local
set -a
source .env.local
set +a
npx tsx scripts/fix-quote-sources.ts 2>&1 | tee quote-fix-full-run.log
