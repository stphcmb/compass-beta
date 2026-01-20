#!/bin/bash
set -a
source .env.local
set +a
npx tsx scripts/apply-date-enrichment.ts
