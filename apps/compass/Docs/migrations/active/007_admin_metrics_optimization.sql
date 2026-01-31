-- =====================================================
-- PURPOSE: Optimize admin dashboard metrics with database-level aggregation
-- REASON: Current API routes fetch ALL records and process in JavaScript.
--         This migration moves heavy computation to the database where it belongs.
-- BACKWARD COMPATIBLE: Yes (new views and functions, no schema changes)
-- OWNER: Compass
-- NOTE: Sources are stored in authors.sources JSONB column only
-- APPLIED: 2026-01-31
-- =====================================================

-- =====================================================
-- HELPER FUNCTION: Safely parse date from various formats
-- =====================================================

CREATE OR REPLACE FUNCTION safe_parse_source_date(elem jsonb)
RETURNS date AS $$
DECLARE
  date_val text;
  result date;
BEGIN
  -- Try published_date first
  date_val := elem->>'published_date';
  IF date_val IS NOT NULL AND date_val ~ '^\d{4}-\d{2}-\d{2}' THEN
    RETURN date_val::date;
  END IF;

  -- Try date field
  date_val := elem->>'date';
  IF date_val IS NOT NULL AND date_val ~ '^\d{4}-\d{2}-\d{2}' THEN
    RETURN date_val::date;
  END IF;

  -- Try publishedDate field
  date_val := elem->>'publishedDate';
  IF date_val IS NOT NULL AND date_val ~ '^\d{4}-\d{2}-\d{2}' THEN
    RETURN date_val::date;
  END IF;

  -- Try year field (convert to Jan 1)
  date_val := elem->>'year';
  IF date_val IS NOT NULL AND date_val ~ '^\d{4}$' THEN
    RETURN (date_val || '-01-01')::date;
  END IF;

  -- Try year-only in published_date
  date_val := elem->>'published_date';
  IF date_val IS NOT NULL AND date_val ~ '^\d{4}$' THEN
    RETURN (date_val || '-01-01')::date;
  END IF;

  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- =====================================================
-- HELPER VIEW: Compute source freshness metrics per author
-- =====================================================

CREATE OR REPLACE VIEW vw_author_source_stats AS
WITH author_source_data AS (
  SELECT
    a.id as author_id,
    COALESCE(jsonb_array_length(a.sources), 0) as source_count,
    -- Extract max date from JSONB array
    (
      SELECT MAX(safe_parse_source_date(elem))
      FROM jsonb_array_elements(COALESCE(a.sources, '[]'::jsonb)) elem
    ) as most_recent_date,
    -- Count sources with specific dates
    (
      SELECT COUNT(*)::int
      FROM jsonb_array_elements(COALESCE(a.sources, '[]'::jsonb)) elem
      WHERE safe_parse_source_date(elem) IS NOT NULL
        AND (elem->>'published_date') IS NOT NULL
        AND (elem->>'published_date') ~ '^\d{4}-\d{2}-\d{2}$'
        AND (elem->>'published_date') !~ '^\d{4}-01-01$'
    ) as specific_date_count,
    -- Count sources with year-only dates
    (
      SELECT COUNT(*)::int
      FROM jsonb_array_elements(COALESCE(a.sources, '[]'::jsonb)) elem
      WHERE ((elem->>'published_date') IS NOT NULL AND ((elem->>'published_date') ~ '^\d{4}$' OR (elem->>'published_date') ~ '^\d{4}-01-01$'))
         OR ((elem->>'year') IS NOT NULL)
    ) as year_only_count,
    -- Count sources with no date
    (
      SELECT COUNT(*)::int
      FROM jsonb_array_elements(COALESCE(a.sources, '[]'::jsonb)) elem
      WHERE safe_parse_source_date(elem) IS NULL
    ) as no_date_count,
    -- Count generic sources
    (
      SELECT COUNT(*)::int
      FROM jsonb_array_elements(COALESCE(a.sources, '[]'::jsonb)) elem
      WHERE LOWER(COALESCE(elem->>'title', '')) LIKE '%channel%'
         OR LOWER(COALESCE(elem->>'title', '')) LIKE '%homepage%'
         OR LOWER(COALESCE(elem->>'title', '')) LIKE '%website%'
         OR LOWER(COALESCE(elem->>'title', '')) LIKE '%profile%'
         OR COALESCE(elem->>'url', '') LIKE '%youtube.com/@%'
         OR COALESCE(elem->>'url', '') LIKE '%youtube.com/channel/%'
    ) as generic_count
  FROM authors a
)
SELECT
  author_id,
  source_count as total_sources,
  most_recent_date,
  0 as sources_from_table,
  source_count as sources_from_jsonb,
  specific_date_count,
  year_only_count,
  no_date_count,
  generic_count,
  CASE
    WHEN most_recent_date IS NULL THEN NULL
    ELSE (CURRENT_DATE - most_recent_date)::int
  END as days_since_update
FROM author_source_data;


-- =====================================================
-- MATERIALIZED VIEW: Pre-computed admin dashboard summary metrics
-- =====================================================

CREATE MATERIALIZED VIEW mv_admin_summary_metrics AS
WITH author_stats AS (
  SELECT
    a.id,
    a.name,
    COALESCE(s.total_sources, 0) as total_sources,
    s.most_recent_date,
    s.days_since_update,
    COALESCE(s.sources_from_table, 0) as sources_from_table,
    COALESCE(s.sources_from_jsonb, 0) as sources_from_jsonb,
    COALESCE(s.specific_date_count, 0) as specific_date_count,
    COALESCE(s.year_only_count, 0) as year_only_count,
    COALESCE(s.no_date_count, 0) as no_date_count,
    COALESCE(s.generic_count, 0) as generic_count
  FROM authors a
  LEFT JOIN vw_author_source_stats s ON a.id = s.author_id
)
SELECT
  COUNT(*)::bigint as total_authors,
  COUNT(*) FILTER (WHERE total_sources > 0)::bigint as authors_with_sources,
  COUNT(*) FILTER (WHERE total_sources = 0)::bigint as authors_without_sources,
  COALESCE(SUM(total_sources), 0)::bigint as total_sources,
  COALESCE(SUM(sources_from_table), 0)::bigint as sources_from_table,
  COALESCE(SUM(sources_from_jsonb), 0)::bigint as sources_from_jsonb,
  COUNT(*) FILTER (WHERE days_since_update IS NOT NULL AND days_since_update < 90)::bigint as current_count,
  COUNT(*) FILTER (WHERE days_since_update IS NOT NULL AND days_since_update BETWEEN 90 AND 180)::bigint as moderate_count,
  COUNT(*) FILTER (WHERE days_since_update IS NOT NULL AND days_since_update > 180)::bigint as stale_count,
  COUNT(*) FILTER (WHERE days_since_update IS NULL)::bigint as no_date_count,
  COALESCE(SUM(specific_date_count), 0)::bigint as specific_date_sources,
  COALESCE(SUM(year_only_count), 0)::bigint as year_only_sources,
  COALESCE(SUM(generic_count), 0)::bigint as generic_sources,
  MIN(most_recent_date) as oldest_source_date,
  MAX(most_recent_date) as newest_source_date,
  CASE WHEN MAX(most_recent_date) IS NOT NULL THEN (CURRENT_DATE - MAX(most_recent_date))::int ELSE NULL END as days_since_newest,
  AVG(days_since_update) FILTER (WHERE days_since_update IS NOT NULL)::int as avg_days_since_update,
  NOW() as computed_at
FROM author_stats;

CREATE UNIQUE INDEX idx_mv_admin_summary_unique ON mv_admin_summary_metrics (computed_at);


-- =====================================================
-- FUNCTION: Get stalest authors
-- =====================================================

CREATE OR REPLACE FUNCTION get_stalest_authors(p_limit INT DEFAULT 15)
RETURNS TABLE (id UUID, name TEXT, affiliation TEXT, source_count INT, most_recent_date DATE, days_since_update INT) AS $$
  SELECT a.id, a.name, COALESCE(a.header_affiliation, a.primary_affiliation),
    COALESCE(s.total_sources, 0)::int, s.most_recent_date, s.days_since_update::int
  FROM authors a
  LEFT JOIN vw_author_source_stats s ON a.id = s.author_id
  ORDER BY s.most_recent_date NULLS FIRST, s.most_recent_date ASC
  LIMIT p_limit;
$$ LANGUAGE SQL STABLE;


-- =====================================================
-- FUNCTION: Get stalest camps
-- =====================================================

CREATE OR REPLACE FUNCTION get_stalest_camps(p_limit INT DEFAULT 10)
RETURNS TABLE (id UUID, name TEXT, domain_id INT, author_count INT, source_count INT, most_recent_date DATE, days_since_update INT) AS $$
  WITH camp_metrics AS (
    SELECT c.id, c.label as name, c.domain_id,
      COUNT(DISTINCT ca.author_id)::int as author_count,
      COALESCE(SUM(s.total_sources), 0)::int as source_count,
      MAX(s.most_recent_date) as most_recent_date
    FROM camps c
    LEFT JOIN camp_authors ca ON c.id = ca.camp_id
    LEFT JOIN vw_author_source_stats s ON ca.author_id = s.author_id
    GROUP BY c.id, c.label, c.domain_id
  )
  SELECT cm.id, cm.name, cm.domain_id, cm.author_count, cm.source_count, cm.most_recent_date,
    CASE WHEN cm.most_recent_date IS NULL THEN NULL ELSE (CURRENT_DATE - cm.most_recent_date)::int END
  FROM camp_metrics cm
  ORDER BY cm.most_recent_date NULLS FIRST, cm.most_recent_date ASC
  LIMIT p_limit;
$$ LANGUAGE SQL STABLE;


-- =====================================================
-- FUNCTION: Get domain breakdown
-- =====================================================

CREATE OR REPLACE FUNCTION get_domain_breakdown()
RETURNS TABLE (domain TEXT, camp_count INT, author_count INT, source_count INT, avg_days_since_update INT) AS $$
  WITH domain_map AS (
    SELECT 1 as domain_id, 'AI Technical Capabilities' as domain_name
    UNION ALL SELECT 2, 'AI & Society'
    UNION ALL SELECT 3, 'Enterprise AI Adoption'
    UNION ALL SELECT 4, 'AI Governance & Oversight'
    UNION ALL SELECT 5, 'Future of Work'
  ),
  camp_stats AS (
    SELECT c.domain_id, c.id as camp_id, ca.author_id, s.total_sources, s.days_since_update
    FROM camps c
    LEFT JOIN camp_authors ca ON c.id = ca.camp_id
    LEFT JOIN vw_author_source_stats s ON ca.author_id = s.author_id
  )
  SELECT dm.domain_name, COUNT(DISTINCT cs.camp_id)::int, COUNT(DISTINCT cs.author_id)::int,
    COALESCE(SUM(cs.total_sources), 0)::int,
    AVG(cs.days_since_update) FILTER (WHERE cs.days_since_update IS NOT NULL)::int
  FROM domain_map dm
  LEFT JOIN camp_stats cs ON dm.domain_id = cs.domain_id
  GROUP BY dm.domain_id, dm.domain_name
  HAVING COUNT(DISTINCT cs.camp_id) > 0
  ORDER BY AVG(cs.days_since_update) DESC NULLS LAST;
$$ LANGUAGE SQL STABLE;


-- =====================================================
-- FUNCTION: Get topic coverage
-- =====================================================

CREATE OR REPLACE FUNCTION get_topic_coverage()
RETURNS TABLE (id UUID, topic TEXT, domain_id INT, author_count INT, source_count INT, most_recent_date DATE, days_since_most_recent INT, avg_days_since_update INT) AS $$
  SELECT c.id, c.label, c.domain_id, COUNT(DISTINCT ca.author_id)::int,
    COALESCE(SUM(s.total_sources), 0)::int, MAX(s.most_recent_date),
    CASE WHEN MAX(s.most_recent_date) IS NULL THEN NULL ELSE (CURRENT_DATE - MAX(s.most_recent_date))::int END,
    AVG(s.days_since_update) FILTER (WHERE s.days_since_update IS NOT NULL)::int
  FROM camps c
  LEFT JOIN camp_authors ca ON c.id = ca.camp_id
  LEFT JOIN vw_author_source_stats s ON ca.author_id = s.author_id
  GROUP BY c.id, c.label, c.domain_id;
$$ LANGUAGE SQL STABLE;


-- =====================================================
-- FUNCTION: Get curation queue
-- =====================================================

CREATE OR REPLACE FUNCTION get_curation_queue(p_limit INT DEFAULT 50)
RETURNS TABLE (id UUID, name TEXT, affiliation TEXT, source_count INT, most_recent_date DATE, days_since_update INT, has_position_summary BOOLEAN, camps TEXT[], priority_score INT, urgency TEXT) AS $$
  WITH author_camps AS (
    SELECT ca.author_id, ARRAY_AGG(c.label) as camp_names,
      BOOL_OR(ca.why_it_matters IS NOT NULL AND TRIM(ca.why_it_matters) != '') as has_position_summary
    FROM camp_authors ca JOIN camps c ON ca.camp_id = c.id
    GROUP BY ca.author_id
  ),
  author_metrics AS (
    SELECT a.id, a.name, COALESCE(a.header_affiliation, a.primary_affiliation) as affiliation,
      COALESCE(s.total_sources, 0)::int as source_count, s.most_recent_date, s.days_since_update::int as days_since_update,
      COALESCE(ac.has_position_summary, false) as has_position_summary,
      COALESCE(ac.camp_names, ARRAY[]::text[]) as camps,
      CASE WHEN COALESCE(s.total_sources, 0) = 0 THEN 100 ELSE 0 END +
      CASE WHEN s.days_since_update > 730 THEN 80 WHEN s.days_since_update > 365 THEN 50 WHEN s.days_since_update > 180 THEN 30 ELSE 0 END +
      CASE WHEN NOT COALESCE(ac.has_position_summary, false) THEN 40 ELSE 0 END +
      CASE WHEN COALESCE(array_length(ac.camp_names, 1), 0) >= 3 THEN 10 ELSE 0 END as priority_score
    FROM authors a
    LEFT JOIN vw_author_source_stats s ON a.id = s.author_id
    LEFT JOIN author_camps ac ON a.id = ac.author_id
  )
  SELECT am.id, am.name, am.affiliation, am.source_count, am.most_recent_date, am.days_since_update,
    am.has_position_summary, am.camps, am.priority_score,
    CASE WHEN am.priority_score >= 100 THEN 'critical' WHEN am.priority_score >= 60 THEN 'high' WHEN am.priority_score >= 30 THEN 'medium' ELSE 'low' END
  FROM author_metrics am ORDER BY am.priority_score DESC LIMIT p_limit;
$$ LANGUAGE SQL STABLE;


-- =====================================================
-- FUNCTION: Get curation summary
-- =====================================================

CREATE OR REPLACE FUNCTION get_curation_summary()
RETURNS TABLE (total INT, critical INT, high INT, medium INT, low INT, without_sources INT, without_position_summary INT) AS $$
  WITH author_camps AS (
    SELECT ca.author_id, BOOL_OR(ca.why_it_matters IS NOT NULL AND TRIM(ca.why_it_matters) != '') as has_position_summary
    FROM camp_authors ca GROUP BY ca.author_id
  ),
  author_metrics AS (
    SELECT a.id, COALESCE(s.total_sources, 0) as source_count, s.days_since_update,
      COALESCE(ac.has_position_summary, false) as has_position_summary,
      CASE WHEN COALESCE(s.total_sources, 0) = 0 THEN 100 ELSE 0 END +
      CASE WHEN s.days_since_update > 730 THEN 80 WHEN s.days_since_update > 365 THEN 50 WHEN s.days_since_update > 180 THEN 30 ELSE 0 END +
      CASE WHEN NOT COALESCE(ac.has_position_summary, false) THEN 40 ELSE 0 END as priority_score
    FROM authors a
    LEFT JOIN vw_author_source_stats s ON a.id = s.author_id
    LEFT JOIN author_camps ac ON a.id = ac.author_id
  )
  SELECT COUNT(*)::int, COUNT(*) FILTER (WHERE priority_score >= 100)::int,
    COUNT(*) FILTER (WHERE priority_score >= 60 AND priority_score < 100)::int,
    COUNT(*) FILTER (WHERE priority_score >= 30 AND priority_score < 60)::int,
    COUNT(*) FILTER (WHERE priority_score < 30)::int,
    COUNT(*) FILTER (WHERE source_count = 0)::int,
    COUNT(*) FILTER (WHERE NOT has_position_summary)::int
  FROM author_metrics;
$$ LANGUAGE SQL STABLE;


-- =====================================================
-- FUNCTION: Refresh admin metrics
-- =====================================================

CREATE OR REPLACE FUNCTION refresh_admin_metrics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_admin_summary_metrics;
END;
$$ LANGUAGE plpgsql;


-- Initial refresh
REFRESH MATERIALIZED VIEW mv_admin_summary_metrics;


-- =====================================================
-- VERIFICATION QUERIES (run after migration)
-- =====================================================

-- Verify materialized view
-- SELECT * FROM mv_admin_summary_metrics;

-- Test stalest authors function
-- SELECT * FROM get_stalest_authors(5);

-- Test stalest camps function
-- SELECT * FROM get_stalest_camps(5);

-- Test domain breakdown
-- SELECT * FROM get_domain_breakdown();

-- Test topic coverage
-- SELECT * FROM get_topic_coverage();

-- Test curation queue
-- SELECT * FROM get_curation_queue(10);

-- Test curation summary
-- SELECT * FROM get_curation_summary();
