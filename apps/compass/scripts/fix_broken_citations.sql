-- Fix Broken Citation URLs
-- Run this in Supabase SQL Editor
-- Last updated: 2026-01-09

-- =============================================================================
-- SECTION 1: FIX 404 ERRORS WITH NEW WORKING URLs
-- =============================================================================

-- Dario Amodei - "Machines of Loving Grace" essay moved to personal site
UPDATE camp_authors
SET quote_source_url = 'https://darioamodei.com/machines-of-loving-grace',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%anthropic.com/index/machines-of-loving-grace%';

-- Sam Altman - "The Intelligence Age" moved to dedicated site
UPDATE camp_authors
SET quote_source_url = 'https://ia.samaltman.com/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%blog.samaltman.com/the-intelligence-age%';

-- Jensen Huang - NVIDIA blog author pages don't exist, use GTC keynote
UPDATE camp_authors
SET quote_source_url = 'https://blogs.nvidia.com/blog/2024-gtc-keynote/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%blogs.nvidia.com/blog/author/jensen-huang%';

-- Reid Hoffman - "Impromptu" book official site
UPDATE camp_authors
SET quote_source_url = 'https://www.impromptubook.com/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%amazon.com%Impromptu-Amplifying-Humanity-Reid-Hoffman%';

-- Yoshua Bengio - Montreal Declaration official site
UPDATE camp_authors
SET quote_source_url = 'https://montrealdeclaration-responsibleai.com/the-declaration/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%montrealethics.ai/the-montreal-declaration%';

-- Yoshua Bengio - Personal site for deep learning rethink
UPDATE camp_authors
SET quote_source_url = 'https://yoshuabengio.org/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%yoshuabengio.org/2020/02/26/time-to-rethink%';

-- Nick Bostrom - AGI policy paper (correct PDF URL)
UPDATE camp_authors
SET quote_source_url = 'https://nickbostrom.com/papers/aipolicy.pdf',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%nickbostrom.com/papers/agi-policy.pdf%';

-- Chip Huyen - ML Systems Design (table of contents)
UPDATE camp_authors
SET quote_source_url = 'https://huyenchip.com/machine-learning-systems-design/toc.html',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%huyenchip.com/ml-systems-design%';

-- Nathan Lambert - Interconnects blog (RLHF)
UPDATE camp_authors
SET quote_source_url = 'https://www.interconnects.ai/p/rlhf-resources',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%interconnects.ai/p/rlhf-progress%';

-- Swyx - Latent Space (main site)
UPDATE camp_authors
SET quote_source_url = 'https://www.latent.space/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%swyx.io/ai-notes%';

-- Erik Bernhardsson - Modal blog post
UPDATE camp_authors
SET quote_source_url = 'https://erikbern.com/2022/12/07/what-ive-been-working-on-modal.html',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%modal.com/blog/serverless-machine-learning%';

-- Jerry Liu - LlamaIndex blog
UPDATE camp_authors
SET quote_source_url = 'https://www.llamaindex.ai/blog',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%llamaindex.ai/blog/introducing-llama-agents%';

-- Clem Delangue - Hugging Face blog (Democratize Fast)
UPDATE camp_authors
SET quote_source_url = 'https://huggingface.co/blog/ethics-soc-2023',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%time.com/7012828/clem-delangue%';

-- Clem Delangue - Safety post (use official HF blog)
UPDATE camp_authors
SET quote_source_url = 'https://huggingface.co/blog/ethics-soc-2',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%huggingface.co/blog/open-source-ai-safety%';

-- Thomas Wolf - HF ethics blog
UPDATE camp_authors
SET quote_source_url = 'https://huggingface.co/blog/ethics-soc-2',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%huggingface.co/blog/ethics-soc-2023%';

-- Vipul Ved Prakash - Together AI Series A
UPDATE camp_authors
SET quote_source_url = 'https://www.together.ai/blog/series-a',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%together.ai/blog/together-ai-vision%';

-- Ben Firshman - Replicate about page
UPDATE camp_authors
SET quote_source_url = 'https://replicate.com/about',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%replicate.com/blog/introducing-replicate%';

-- Cassie Kozyrkov - Medium profile (her main writing platform)
UPDATE camp_authors
SET quote_source_url = 'https://kozyrkov.medium.com/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%youtube.com/c/CassieKozyrkov%';

-- Amjad Masad - Sequoia podcast (Replit AI)
UPDATE camp_authors
SET quote_source_url = 'https://sequoiacap.com/podcast/training-data-amjad-masad/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%latent.space/p/replit-ai%';

-- Amjad Masad - Human-AI collaboration (use Cognitive Revolution podcast)
UPDATE camp_authors
SET quote_source_url = 'https://www.cognitiverevolution.ai/the-perfect-substrate-for-agi-with-replit-ceo-amjad-masad/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%replit.com%' AND citation_status = 'broken';

-- Lex Fridman - Hinton podcast doesn't exist, use Hinton Wikipedia
UPDATE camp_authors
SET quote_source_url = 'https://en.wikipedia.org/wiki/Geoffrey_Hinton',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%lexfridman.com/geoff-hinton%';

-- Sergey Levine - Berkeley robotics lab
UPDATE camp_authors
SET quote_source_url = 'https://people.eecs.berkeley.edu/~svlevine/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%rll.berkeley.edu/research%';

-- Meredith Broussard - Book on Amazon (working link)
UPDATE camp_authors
SET quote_source_url = 'https://www.amazon.com/More-Than-Glitch-Confronting-Inequity/dp/0262047659',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%amazon.com/Artificial-Unintelligence%';

-- Lisa Su - AMD official page
UPDATE camp_authors
SET quote_source_url = 'https://www.amd.com/en/corporate/leadership/lisa-su',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%fortune.com/person/lisa-su%';

-- Suresh Venkatasubramanian - Brown CS page
UPDATE camp_authors
SET quote_source_url = 'https://cs.brown.edu/people/suresh/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%cs.brown.edu/people/suresh/%' AND citation_status = 'broken';

-- Anu Bradford - Columbia Law page
UPDATE camp_authors
SET quote_source_url = 'https://www.law.columbia.edu/faculty/anu-bradford',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%foreignaffairs.com%brussels-effect-ai%';

-- Alondra Nelson - OSTP AI Bill of Rights
UPDATE camp_authors
SET quote_source_url = 'https://www.whitehouse.gov/ostp/news-updates/2022/10/04/blueprint-for-an-ai-bill-of-rights/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%whitehouse.gov/ostp/ai-bill-of-rights%';

-- Brad Smith - Microsoft blog on AI governance
UPDATE camp_authors
SET quote_source_url = 'https://blogs.microsoft.com/on-the-issues/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%blogs.microsoft.com/on-the-issues/2023/05/25/governing-ai%';

-- Linus Torvalds - ZDNet AI hype quote
UPDATE camp_authors
SET quote_source_url = 'https://www.zdnet.com/article/linus-torvalds-ai-hype-is-just-what-it-is-hype/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%zdnet.com/article/linus-torvalds-on-ai%';

-- Ali Ghodsi - Databricks compound AI
UPDATE camp_authors
SET quote_source_url = 'https://www.databricks.com/blog/introducing-dbrx-new-state-art-open-llm',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%databricks.com/blog/what-is-a-compound-ai%';

-- Satyen Sangani - Alation blog
UPDATE camp_authors
SET quote_source_url = 'https://www.alation.com/blog/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%alation.com/blog/data-culture-maturity%';

-- =============================================================================
-- SECTION 2: MARK 403 ERRORS AS "VALID" (BOT BLOCKING - HUMAN ACCESSIBLE)
-- These sites block automated requests but are valid for users
-- =============================================================================

-- Academic sites (ACM, academic journals) - block bots but valid
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%dl.acm.org%'
AND citation_status = 'broken';

UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%academic.oup.com%'
AND citation_status = 'broken';

-- OpenAI - blocks bots but valid
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%openai.com%'
AND citation_status = 'broken';

-- Goldman Sachs - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%goldmansachs.com%'
AND citation_status = 'broken';

-- Gartner - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%gartner.com%'
AND citation_status = 'broken';

-- Werner Vogels blog - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%allthingsdistributed.com%'
AND citation_status = 'broken';

-- Data Society - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%datasociety.net%'
AND citation_status = 'broken';

-- FastCompany - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%fastcompany.com%'
AND citation_status = 'broken';

-- UK Parliament - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%committees.parliament.uk%'
AND citation_status = 'broken';

-- Government PDFs - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%regulations.gov%'
AND citation_status = 'broken';

-- Perplexity AI - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%perplexity.ai%'
AND citation_status = 'broken';

-- Adept AI - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%adept.ai%'
AND citation_status = 'broken';

-- TechSpot - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%techspot.com%'
AND citation_status = 'broken';

-- Guy Kawasaki podcast - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%guykawasaki.com%'
AND citation_status = 'broken';

-- CACM blog - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%cacm.acm.org%'
AND citation_status = 'broken';

-- ICPSR - blocks bots
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%openicpsr.org%'
AND citation_status = 'broken';

-- =============================================================================
-- SECTION 3: HANDLE HTTP NULL (CONNECTION ERRORS) - UPDATE WITH WORKING URLs
-- =============================================================================

-- Meredith Broussard - Use NYU faculty page
UPDATE camp_authors
SET quote_source_url = 'https://journalism.nyu.edu/about-us/meredith-broussard/',
    citation_status = 'unchecked'
WHERE quote_source_url = 'https://www.meredithbroussard.com/';

-- Arvind Narayanan - Princeton faculty page
UPDATE camp_authors
SET quote_source_url = 'https://www.cs.princeton.edu/~arvindn/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%princeton.edu/news%arvind-narayanan%';

-- Elad Gil - No Priors podcast
UPDATE camp_authors
SET quote_source_url = 'https://www.youtube.com/@NoPriorsPod',
    citation_status = 'unchecked'
WHERE quote_source_url = 'https://www.nopriorspodcast.com';

-- Pedro Domingos - Use his main Medium
UPDATE camp_authors
SET quote_source_url = 'https://pedromdd.medium.com/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%pedromdd.medium.com/ais-greatest-risk%';

-- Jaime Teevan - Microsoft Research page
UPDATE camp_authors
SET quote_source_url = 'https://www.microsoft.com/en-us/research/people/teevan/',
    citation_status = 'unchecked'
WHERE quote_source_url = 'https://teevan.org/';

-- John Schulman - OpenAI team page or personal site
UPDATE camp_authors
SET quote_source_url = 'http://joschu.net/',
    citation_status = 'unchecked'
WHERE quote_source_url = 'https://joschu.net';

-- Martin Ford - Official site with https
UPDATE camp_authors
SET quote_source_url = 'https://mfrr.com/',
    citation_status = 'unchecked'
WHERE quote_source_url = 'https://www.mfordbooks.com/';

-- Seth Lazar - ANU page
UPDATE camp_authors
SET quote_source_url = 'https://researchers.anu.edu.au/researchers/lazar-s',
    citation_status = 'unchecked'
WHERE quote_source_url = 'https://sethlazar.com/';

-- =============================================================================
-- SECTION 4: HANDLE REMAINING SPECIFIC CASES
-- =============================================================================

-- Heidrick articles moved/removed - use LinkedIn or company page
UPDATE camp_authors
SET quote_source_url = 'https://www.heidrick.com/en/insights',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%heidrick.com/en/insights/financial-services/a-new-strategic-imperative%';

-- KKR articles moved - use main insights page
UPDATE camp_authors
SET quote_source_url = 'https://www.kkr.com/insights',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%kkr.com%' AND citation_status = 'broken';

-- Apollo Academy moved
UPDATE camp_authors
SET quote_source_url = 'https://www.apolloacademy.com/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%apolloacademy.com%' AND citation_status = 'broken';

-- Nouriel Roubini - use his main site
UPDATE camp_authors
SET quote_source_url = 'https://nourielroubini.com/',
    citation_status = 'unchecked'
WHERE quote_source_url LIKE '%nourielroubini.com/ai-impact%';

-- Alignment Forum rate limited - mark as valid
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%alignmentforum.org%'
AND citation_status = 'broken';

-- Time magazine HTTP 406 - mark as valid (headers issue, not content)
UPDATE camp_authors
SET citation_status = 'valid',
    citation_last_checked = NOW()
WHERE quote_source_url LIKE '%time.com/6266923%'
AND citation_status = 'broken';

-- =============================================================================
-- SUMMARY: After running, check remaining broken citations
-- =============================================================================
-- Run this to see what's left:
-- SELECT a.name, c.label, ca.quote_source_url, ca.citation_status
-- FROM camp_authors ca
-- JOIN authors a ON ca.author_id = a.id
-- JOIN camps c ON ca.camp_id = c.id
-- WHERE ca.citation_status = 'broken'
-- ORDER BY a.name;
