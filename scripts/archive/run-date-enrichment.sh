#!/bin/bash
set -a
source .env.local
set +a
npx tsx scripts/enrich-dates-parallel.ts 2>&1 | tee date-enrichment-progress.log
