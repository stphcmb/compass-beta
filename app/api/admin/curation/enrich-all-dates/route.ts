import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { enrichSourceDates } from '@/lib/curation/agents'

export const maxDuration = 300 // 5 minutes for batch processing

/**
 * POST /api/admin/curation/enrich-all-dates
 *
 * Enriches source dates for ALL authors in the database.
 * Processes in batches to avoid timeouts.
 */
export async function POST() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  }

  try {
    // Fetch all authors with sources
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('id, name, sources')

    if (authorsError) throw authorsError

    if (!authors || authors.length === 0) {
      return NextResponse.json({
        totalAuthors: 0,
        processedAuthors: 0,
        enrichedSources: 0,
        results: []
      })
    }

    // Filter to authors with sources
    const authorsWithSources = authors.filter(a => a.sources && Array.isArray(a.sources) && a.sources.length > 0)

    console.log(`Processing ${authorsWithSources.length} authors with sources...`)

    // Process all authors (in parallel for speed, but limit concurrency)
    const BATCH_SIZE = 5 // Process 5 authors at a time
    const results: any[] = []

    for (let i = 0; i < authorsWithSources.length; i += BATCH_SIZE) {
      const batch = authorsWithSources.slice(i, i + BATCH_SIZE)

      const batchPromises = batch.map(async (author) => {
        try {
          const sources = author.sources || []

          if (sources.length === 0) {
            return {
              authorId: author.id,
              authorName: author.name,
              success: true,
              enrichedCount: 0,
              totalSources: 0
            }
          }

          console.log(`[${author.name}] Processing ${sources.length} sources`)
          console.log(`  Sample source:`, JSON.stringify(sources[0], null, 2))

          // Run enrichment agent
          const enrichedDates = await enrichSourceDates(sources, author.name)

          console.log(`[${author.name}] Received ${enrichedDates.length} enriched dates`)
          if (enrichedDates.length > 0) {
            console.log(`  Sample enriched:`, JSON.stringify(enrichedDates[0], null, 2))

            // Check confidence distribution
            const confidenceCounts = {high: 0, medium: 0, low: 0, noDate: 0}
            enrichedDates.forEach(e => {
              if (!e.enrichedDate) confidenceCounts.noDate++
              else if (e.confidence === 'high') confidenceCounts.high++
              else if (e.confidence === 'medium') confidenceCounts.medium++
              else if (e.confidence === 'low') confidenceCounts.low++
            })
            console.log(`  Confidence distribution:`, confidenceCounts)
          } else {
            console.log(`  ⚠️  WARNING: No enriched dates returned from AI!`)
          }

          // Update sources with enriched dates
          let enrichedCount = 0
          const updatedSources = sources.map((source: any) => {
            // Try exact match first, then fuzzy match (normalized)
            let enriched = enrichedDates.find(e => e.originalTitle === source.title)

            // If no exact match, try normalized match (trim whitespace, case-insensitive)
            if (!enriched) {
              const normalizedSourceTitle = source.title.trim().toLowerCase()
              enriched = enrichedDates.find(e =>
                e.originalTitle.trim().toLowerCase() === normalizedSourceTitle
              )
            }

            if (enriched) {
              console.log(`  Matched: "${source.title.substring(0, 50)}" -> ${enriched.enrichedDate} (${enriched.confidence})`)
              if (!enriched.enrichedDate) {
                console.log(`    Skipped: No enrichedDate`)
              } else if (enriched.confidence === 'low') {
                console.log(`    Skipped: Low confidence`)
              }
            } else {
              console.log(`  No match for: "${source.title.substring(0, 50)}"`)
            }

            if (enriched && enriched.enrichedDate && enriched.confidence !== 'low') {
              enrichedCount++

              // Parse enriched date
              let published_date = null
              let year = null

              if (enriched.enrichedDate) {
                // Handle different date formats
                if (enriched.enrichedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                  // YYYY-MM-DD
                  published_date = enriched.enrichedDate
                  year = enriched.enrichedDate.substring(0, 4)
                } else if (enriched.enrichedDate.match(/^\d{4}-\d{2}$/)) {
                  // YYYY-MM
                  published_date = `${enriched.enrichedDate}-01`
                  year = enriched.enrichedDate.substring(0, 4)
                } else if (enriched.enrichedDate.match(/^\d{4}$/)) {
                  // YYYY
                  year = enriched.enrichedDate
                  published_date = `${enriched.enrichedDate}-01-01`
                }
              }

              return {
                ...source,
                published_date: published_date || source.published_date || source.date,
                year: year || source.year,
                date_enriched: true,
                date_enrichment_source: enriched.source,
                date_enrichment_confidence: enriched.confidence
              }
            }

            return source
          })

          // Update author in database
          if (enrichedCount > 0) {
            const { error: updateError } = await supabase
              .from('authors')
              .update({ sources: updatedSources })
              .eq('id', author.id)

            if (updateError) {
              console.error(`Error updating author ${author.name}:`, updateError)
              return {
                authorId: author.id,
                authorName: author.name,
                success: false,
                enrichedCount: 0,
                error: updateError.message
              }
            }
          }

          return {
            authorId: author.id,
            authorName: author.name,
            success: true,
            enrichedCount,
            totalSources: sources.length
          }
        } catch (error) {
          console.error(`Error processing author ${author.name}:`, error)
          return {
            authorId: author.id,
            authorName: author.name,
            success: false,
            enrichedCount: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(authorsWithSources.length / BATCH_SIZE)}`)
    }

    console.log('\n=== ENRICHMENT SUMMARY ===')
    console.log(`Total authors processed: ${results.length}`)
    console.log(`Successful: ${results.filter(r => r.success).length}`)
    console.log(`Failed: ${results.filter(r => !r.success).length}`)
    console.log(`Total sources enriched: ${results.reduce((sum, r) => sum + (r.enrichedCount || 0), 0)}`)
    console.log('=========================\n')

    // Calculate summary stats
    const summary = {
      totalAuthors: authorsWithSources.length,
      processedAuthors: results.filter(r => r.success).length,
      failedAuthors: results.filter(r => !r.success).length,
      enrichedSources: results.reduce((sum, r) => sum + (r.enrichedCount || 0), 0),
      topEnriched: results
        .filter(r => r.success && r.enrichedCount > 0)
        .sort((a, b) => b.enrichedCount - a.enrichedCount)
        .slice(0, 10)
        .map(r => ({
          name: r.authorName,
          enrichedCount: r.enrichedCount,
          totalSources: r.totalSources
        }))
    }

    return NextResponse.json({
      ...summary,
      results
    })
  } catch (error) {
    console.error('Error in enrich-all-dates API:', error)
    return NextResponse.json(
      { error: 'Failed to enrich all dates' },
      { status: 500 }
    )
  }
}
