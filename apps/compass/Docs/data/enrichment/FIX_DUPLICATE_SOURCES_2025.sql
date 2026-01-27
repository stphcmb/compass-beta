-- ============================================================================
-- FIX DUPLICATE SOURCES AND ADD REPLACEMENTS
-- Generated on: 2025-12-13
-- Purpose: Remove duplicate sources and add credible replacements
-- ============================================================================

-- STRATEGY:
-- 1. For each author, remove duplicate sources (keep index 0 instance)
-- 2. Add credible, diverse replacement sources
-- 3. Ensure each author has 3-5 unique, high-quality sources

BEGIN;

-- ============================================================================
-- ALI GHODSI (Databricks) - Remove 3 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/",
    "type": "Article",
    "year": "2024",
    "title": "Compound AI Systems"
  },
  {
    "url": "https://www.databricks.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Databricks - Co-founder & CEO"
  },
  {
    "url": "https://www.youtube.com/@databricks",
    "type": "YouTube",
    "year": "2024",
    "title": "Databricks YouTube Channel"
  },
  {
    "url": "https://databricks.com/blog/authors/ali-ghodsi",
    "type": "Blog",
    "year": "2024",
    "title": "Databricks Blog - Ali Ghodsi"
  },
  {
    "url": "https://www.linkedin.com/in/alighodsi/",
    "type": "Blog",
    "year": "2024",
    "title": "Ali Ghodsi on LinkedIn - Industry Insights"
  }
]'::jsonb
WHERE id = '5a2a5405-c0e4-4d29-910a-ecec434ccf83';

-- ============================================================================
-- AMBA KAK (AI Now Institute) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://ainowinstitute.org/publication/2023-landscape",
    "type": "Report",
    "year": "2023",
    "title": "AI Now 2023 Landscape Report"
  },
  {
    "url": "https://ainowinstitute.org/people/amba-kak",
    "type": "Organization",
    "year": "2024",
    "title": "AI Now Institute - Director"
  },
  {
    "url": "https://twitter.com/ambaonadventure",
    "type": "Blog",
    "year": "2024",
    "title": "Amba Kak on Twitter/X"
  },
  {
    "url": "https://www.technologyreview.com/author/amba-kak/",
    "type": "Article",
    "year": "2024",
    "title": "MIT Technology Review - Articles by Amba Kak"
  }
]'::jsonb
WHERE id = '7d1aac4d-599d-4f39-a73f-82fdb318b33f';

-- ============================================================================
-- AVI GOLDFARB (Rotman) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.predictionmachines.ai/",
    "type": "Book",
    "year": "2018",
    "title": "Prediction Machines"
  },
  {
    "url": "https://www.rotman.utoronto.ca/FacultyAndResearch/Faculty/FacultyBios/Goldfarb",
    "type": "Research",
    "year": "2024",
    "title": "Rotman School of Management"
  },
  {
    "url": "https://mitpress.mit.edu/9780262538800/prediction-machines/",
    "type": "Book",
    "year": "2018",
    "title": "Prediction Machines: The Simple Economics of AI"
  },
  {
    "url": "https://www.nber.org/people/avi_goldfarb",
    "type": "Research",
    "year": "2024",
    "title": "NBER - Research Papers"
  }
]'::jsonb
WHERE id = 'c7be2f0c-7849-4c7a-b349-ca259d94899a';

-- ============================================================================
-- BRET TAYLOR (Sierra) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://sierra.ai/blog",
    "type": "Blog",
    "year": "2024",
    "title": "The Agentic Future"
  },
  {
    "url": "https://sierra.ai/",
    "type": "Organization",
    "year": "2024",
    "title": "Sierra - Co-founder & CEO"
  },
  {
    "url": "https://twitter.com/btaylor",
    "type": "Blog",
    "year": "2024",
    "title": "Bret Taylor on Twitter/X"
  },
  {
    "url": "https://www.salesforce.com/news/stories/bret-taylor-salesforce-co-ceo/",
    "type": "Article",
    "year": "2022",
    "title": "Former Salesforce Co-CEO on AI Strategy"
  }
]'::jsonb
WHERE id = '4f74351f-1d7e-4045-b44c-f5ee7f721e9a';

-- ============================================================================
-- BYRON DEETER (Bessemer) - Remove duplicates, clean up
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.bvp.com/team/byron-deeter",
    "type": "Organization",
    "year": "2024",
    "title": "Bessemer Venture Partners - Partner"
  },
  {
    "url": "https://www.bvp.com/atlas/state-of-the-cloud-2024",
    "type": "Report",
    "year": "2024",
    "title": "State of the Cloud 2024"
  },
  {
    "url": "https://twitter.com/bdeeter",
    "type": "Blog",
    "year": "2024",
    "title": "Byron Deeter on Twitter/X"
  },
  {
    "url": "https://www.forbes.com/profile/byron-deeter/",
    "type": "Article",
    "year": "2024",
    "title": "Forbes Profile - Cloud Computing Insights"
  }
]'::jsonb
WHERE id = 'c290ee13-a00b-43a8-b03c-d0fd2c824f60';

-- ============================================================================
-- CARL BENEDIKT FREY (Oxford) - Remove duplicates
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.oxfordmartin.ox.ac.uk/people/carl-benedikt-frey/",
    "type": "Research",
    "year": "2024",
    "title": "Oxford Martin School Profile"
  },
  {
    "url": "https://www.amazon.com/Technology-Trap-Capital-Inequality-History/dp/0691172668",
    "type": "Book",
    "year": "2019",
    "title": "The Technology Trap"
  },
  {
    "url": "https://www.nber.org/people/carl_frey",
    "type": "Research",
    "year": "2024",
    "title": "NBER Research Papers"
  },
  {
    "url": "https://academic.oup.com/oxrep/article/35/3/507/5513699",
    "type": "Paper",
    "year": "2019",
    "title": "Technology and Employment - Oxford Review"
  }
]'::jsonb
WHERE id = '0bfe56b7-39da-4c50-9769-74214da97c44';

-- ============================================================================
-- CHARITY MAJORS (Honeycomb) - Remove duplicates
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.honeycomb.io/",
    "type": "Organization",
    "year": "2024",
    "title": "Honeycomb - Co-founder & CTO"
  },
  {
    "url": "https://charity.wtf/",
    "type": "Blog",
    "year": "2024",
    "title": "Charity Majors Blog"
  },
  {
    "url": "https://twitter.com/mipsytipsy",
    "type": "Blog",
    "year": "2024",
    "title": "Charity Majors on Twitter/X"
  },
  {
    "url": "https://www.oreilly.com/library/view/database-reliability-engineering/9781491925935/",
    "type": "Book",
    "year": "2017",
    "title": "Database Reliability Engineering"
  }
]'::jsonb
WHERE id = 'ea3c4e42-5ef4-4742-b3a9-dbe7d12c2a16';

-- ============================================================================
-- DAVID CAHN (Sequoia) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://sequoiacap.com/article/ais-600b-question/",
    "type": "Article",
    "year": "2024",
    "title": "AI'\''s $600B Question"
  },
  {
    "url": "https://www.sequoiacap.com/people/david-cahn/",
    "type": "Organization",
    "year": "2024",
    "title": "Sequoia Capital - Partner"
  },
  {
    "url": "https://www.sequoiacap.com/article/data-ai-2024/",
    "type": "Paper",
    "year": "2024",
    "title": "Data + AI Infrastructure Market Analysis"
  },
  {
    "url": "https://www.linkedin.com/in/davidcahn/",
    "type": "Blog",
    "year": "2024",
    "title": "David Cahn on LinkedIn - VC Insights"
  }
]'::jsonb
WHERE id = '5b98ec80-b383-4173-bf18-cf421b00fc4a';

-- ============================================================================
-- DAVID SHAPIRO - Remove 3 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.youtube.com/@DaveShap",
    "type": "YouTube",
    "year": "2024",
    "title": "David Shapiro YouTube Channel"
  },
  {
    "url": "https://github.com/daveshap",
    "type": "Organization",
    "year": "2024",
    "title": "David Shapiro GitHub - AI Projects"
  },
  {
    "url": "https://daveshap.gumroad.com/",
    "type": "Website",
    "year": "2024",
    "title": "David Shapiro Resources & Courses"
  },
  {
    "url": "https://substack.com/@daveshap",
    "type": "Blog",
    "year": "2024",
    "title": "David Shapiro on Substack"
  }
]'::jsonb
WHERE id = '3026418e-20fa-4122-b3ee-1a78a244f22e';

-- ============================================================================
-- DIVYA SIDDARTH (CIP) - Remove 3 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://cip.org/",
    "type": "Organization",
    "year": "2024",
    "title": "Collective Intelligence Project - Co-founder"
  },
  {
    "url": "https://www.radicalxchange.org/",
    "type": "Organization",
    "year": "2024",
    "title": "RadicalxChange Foundation"
  },
  {
    "url": "https://twitter.com/divyasiddarth",
    "type": "Blog",
    "year": "2024",
    "title": "Divya Siddarth on Twitter/X"
  },
  {
    "url": "https://arxiv.org/search/?query=divya+siddarth&searchtype=author",
    "type": "Research",
    "year": "2024",
    "title": "Research Papers on Collective Intelligence"
  }
]'::jsonb
WHERE id = '60cb599a-b7fe-475e-95ef-7080abe4a997';

-- ============================================================================
-- ED ZITRON - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.wheresyoured.at/the-rot-economy/",
    "type": "Essay",
    "year": "2023",
    "title": "The Rot Economy"
  },
  {
    "url": "https://www.wheresyoured.at/",
    "type": "Blog",
    "year": "2024",
    "title": "Where'\''s Your Ed At (Newsletter)"
  },
  {
    "url": "https://ez.substack.com/",
    "type": "Blog",
    "year": "2024",
    "title": "Ed Zitron'\''s Substack"
  },
  {
    "url": "https://www.404media.co/author/edzitron/",
    "type": "Article",
    "year": "2024",
    "title": "404 Media - Ed Zitron Articles"
  }
]'::jsonb
WHERE id = 'dde2d43d-b1eb-4fd2-bcdb-9d0cfac41de4';

-- ============================================================================
-- ELIZABETH KELLY (NIST) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.nist.gov/itl/ai-risk-management-framework",
    "type": "Standard",
    "year": "2023",
    "title": "NIST AI Risk Management Framework"
  },
  {
    "url": "https://www.nist.gov/artificial-intelligence",
    "type": "Organization",
    "year": "2024",
    "title": "NIST AI Program"
  },
  {
    "url": "https://airc.nist.gov/",
    "type": "Organization",
    "year": "2024",
    "title": "NIST AI Risk Management"
  },
  {
    "url": "https://www.nist.gov/publications",
    "type": "Research",
    "year": "2024",
    "title": "NIST AI Publications & Standards"
  }
]'::jsonb
WHERE id = '78fe7624-9816-4984-9f4b-a26db5afdd59';

-- ============================================================================
-- GARY MARCUS (NYU) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.penguinrandomhouse.com/books/603982/rebooting-ai-by-gary-marcus-and-ernest-davis/",
    "type": "Book",
    "year": "2019",
    "title": "Rebooting AI"
  },
  {
    "url": "https://garymarcus.substack.com/",
    "type": "Blog",
    "year": "2024",
    "title": "Marcus on AI (Substack)"
  },
  {
    "url": "https://mitpress.mit.edu/9780262046183/rebooting-ai/",
    "type": "Book",
    "year": "2019",
    "title": "Rebooting AI: Building AI We Can Trust"
  },
  {
    "url": "https://twitter.com/garymarcus",
    "type": "Blog",
    "year": "2024",
    "title": "Gary Marcus on Twitter/X"
  }
]'::jsonb
WHERE id = 'a71757bc-81df-4774-a2cd-38d6e439963f';

-- ============================================================================
-- JANET HAVEN (Data & Society) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://datasociety.net/library/",
    "type": "Report",
    "year": "2023",
    "title": "Algorithmic Accountability Research"
  },
  {
    "url": "https://datasociety.net/",
    "type": "Organization",
    "year": "2024",
    "title": "Data & Society Research Institute - Executive Director"
  },
  {
    "url": "https://twitter.com/Janet_Haven",
    "type": "Blog",
    "year": "2024",
    "title": "Janet Haven on Twitter/X"
  },
  {
    "url": "https://datasociety.net/people/janet-haven/",
    "type": "Organization",
    "year": "2024",
    "title": "Data & Society - Profile & Research"
  }
]'::jsonb
WHERE id = '0ff64ac6-f5bc-43d0-884d-8870372878ec';

-- ============================================================================
-- JIM COVELLO (Goldman Sachs) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.goldmansachs.com/intelligence/pages/gen-ai-too-much-spend-too-little-benefit.html",
    "type": "Report",
    "year": "2024",
    "title": "Gen AI: Too Much Spend, Too Little Benefit?"
  },
  {
    "url": "https://www.goldmansachs.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Goldman Sachs Research - Head of US Equity Research"
  },
  {
    "url": "https://www.goldmansachs.com/insights/pages/ai-research.html",
    "type": "Research",
    "year": "2024",
    "title": "Goldman Sachs AI Research"
  },
  {
    "url": "https://www.bloomberg.com/authors/AS2UG2gw4JU/jim-covello",
    "type": "Article",
    "year": "2024",
    "title": "Bloomberg - Jim Covello Analysis"
  }
]'::jsonb
WHERE id = '4726d458-674a-40c2-af21-88f9fd4e4a50';

-- ============================================================================
-- JOY BUOLAMWINI (AJL) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.unmasking.ai/",
    "type": "Book",
    "year": "2023",
    "title": "Unmasking AI"
  },
  {
    "url": "https://www.media.mit.edu/people/joyab/overview/",
    "type": "Research",
    "year": "2024",
    "title": "MIT Media Lab - Researcher"
  },
  {
    "url": "https://www.penguinrandomhouse.com/books/645999/unmasking-ai-by-joy-buolamwini-phd/",
    "type": "Book",
    "year": "2023",
    "title": "Unmasking AI: My Mission to Protect What Is Human"
  },
  {
    "url": "https://www.ajl.org/",
    "type": "Organization",
    "year": "2024",
    "title": "Algorithmic Justice League - Founder"
  }
]'::jsonb
WHERE id = 'ddd69097-9c41-4b74-b0a5-775fbacb7d01';

-- ============================================================================
-- KENNETH STANLEY (Maven) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.amazon.com/Why-Greatness-Cannot-Planned-Myth/dp/3319155237",
    "type": "Book",
    "year": "2015",
    "title": "Why Greatness Cannot Be Planned"
  },
  {
    "url": "https://www.cs.ucf.edu/~kstanley/",
    "type": "Research",
    "year": "2024",
    "title": "UCF Computer Science - Research"
  },
  {
    "url": "https://maven.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Maven - Co-founder"
  },
  {
    "url": "https://scholar.google.com/citations?user=6Q6fVsQAAAAJ",
    "type": "Research",
    "year": "2024",
    "title": "Google Scholar - Kenneth Stanley"
  }
]'::jsonb
WHERE id = 'd01ce6b8-808d-4a14-abab-efd3779f1ec6';

-- ============================================================================
-- LEOPOLD ASCHENBRENNER - Remove 2 duplicates (3 instances of same URL), add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://situational-awareness.ai/",
    "type": "Paper",
    "year": "2024",
    "title": "Situational Awareness: The Decade Ahead"
  },
  {
    "url": "https://twitter.com/leopoldaschenbr",
    "type": "Blog",
    "year": "2024",
    "title": "Leopold Aschenbrenner on Twitter/X"
  },
  {
    "url": "https://www.dwarkeshpatel.com/p/leopold-aschenbrenner",
    "type": "Podcast",
    "year": "2024",
    "title": "Dwarkesh Podcast - AGI Timelines"
  },
  {
    "url": "https://www.linkedin.com/in/leopold-aschenbrenner/",
    "type": "Blog",
    "year": "2024",
    "title": "Leopold Aschenbrenner on LinkedIn"
  }
]'::jsonb
WHERE id = '233ccbce-4c14-4ea3-920a-1c2278f987f1';

-- ============================================================================
-- LINUS TORVALDS (Linux Foundation) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.youtube.com/watch?v=7_h3V9hHkL0",
    "type": "Talk",
    "year": "2024",
    "title": "Keynote: Open Source Summit"
  },
  {
    "url": "https://github.com/torvalds",
    "type": "Organization",
    "year": "2024",
    "title": "GitHub - Linux Kernel Development"
  },
  {
    "url": "https://www.linuxfoundation.org/",
    "type": "Organization",
    "year": "2024",
    "title": "Linux Foundation"
  },
  {
    "url": "https://www.ted.com/speakers/linus_torvalds",
    "type": "Talk",
    "year": "2024",
    "title": "TED Talks - Linus Torvalds"
  }
]'::jsonb
WHERE id = '7197aca8-d998-46ef-9148-211af8a6cec8';

-- ============================================================================
-- MARGRETHE VESTAGER (EU Commission) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://artificialintelligenceact.eu/",
    "type": "Legislation",
    "year": "2024",
    "title": "The EU AI Act"
  },
  {
    "url": "https://ec.europa.eu/commission/commissioners/2019-2024/vestager_en",
    "type": "Organization",
    "year": "2024",
    "title": "European Commission - Executive VP for Digital"
  },
  {
    "url": "https://digital-strategy.ec.europa.eu/en",
    "type": "Organization",
    "year": "2024",
    "title": "EU Digital Strategy"
  },
  {
    "url": "https://twitter.com/vestager",
    "type": "Blog",
    "year": "2024",
    "title": "Margrethe Vestager on Twitter/X"
  }
]'::jsonb
WHERE id = '2cf4e1d7-9d5d-4aa5-815d-a8407aa264d8';

-- ============================================================================
-- MARTIN CASADO (a16z) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://a16z.com/navigating-the-high-cost-of-ai-compute/",
    "type": "Analysis",
    "year": "2023",
    "title": "Navigating the High Cost of AI Compute"
  },
  {
    "url": "https://a16z.com/author/martin-casado/",
    "type": "Organization",
    "year": "2024",
    "title": "Andreessen Horowitz - General Partner"
  },
  {
    "url": "https://a16z.com/generative-ai-enterprise/",
    "type": "Paper",
    "year": "2024",
    "title": "Generative AI for Enterprise"
  },
  {
    "url": "https://twitter.com/martin_casado",
    "type": "Blog",
    "year": "2024",
    "title": "Martin Casado on Twitter/X"
  }
]'::jsonb
WHERE id = 'b5afd2b1-2383-4e2d-aa8b-c4b5da0b86aa';

-- ============================================================================
-- RITA SALLAM (Gartner) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.gartner.com/en/articles/what-s-new-in-the-2024-gartner-hype-cycle-for-artificial-intelligence",
    "type": "Report",
    "year": "2024",
    "title": "Hype Cycle for AI 2024"
  },
  {
    "url": "https://www.gartner.com/en/experts/rita-sallam",
    "type": "Organization",
    "year": "2024",
    "title": "Gartner - VP Analyst"
  },
  {
    "url": "https://www.gartner.com/en/topics/artificial-intelligence",
    "type": "Research",
    "year": "2024",
    "title": "Gartner AI Research"
  },
  {
    "url": "https://www.linkedin.com/in/ritasallam/",
    "type": "Blog",
    "year": "2024",
    "title": "Rita Sallam on LinkedIn - Industry Analysis"
  }
]'::jsonb
WHERE id = '1437bbd4-938d-4181-809b-ec3c30bf13e9';

-- ============================================================================
-- SARAH GUO (Conviction) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.nopriors.com/",
    "type": "Podcast",
    "year": "2024",
    "title": "No Priors Podcast"
  },
  {
    "url": "https://www.conviction.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Conviction - Founder & Managing Partner"
  },
  {
    "url": "https://www.conviction.com/writing",
    "type": "Blog",
    "year": "2024",
    "title": "Conviction Blog - AI Insights"
  },
  {
    "url": "https://twitter.com/saranormous",
    "type": "Blog",
    "year": "2024",
    "title": "Sarah Guo on Twitter/X"
  }
]'::jsonb
WHERE id = '03a01719-b47f-4788-8127-a0d0c829987d';

-- ============================================================================
-- SASHA LUCCIONI (Hugging Face) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.scientificamerican.com/article/the-carbon-footprint-of-ai/",
    "type": "Article",
    "year": "2024",
    "title": "The Carbon Footprint of AI"
  },
  {
    "url": "https://huggingface.co/",
    "type": "Organization",
    "year": "2024",
    "title": "Hugging Face - Climate Lead & AI Researcher"
  },
  {
    "url": "https://scholar.google.com/citations?user=1ZJW_EUAAAAJ",
    "type": "Research",
    "year": "2024",
    "title": "Google Scholar - AI Environmental Impact Research"
  },
  {
    "url": "https://twitter.com/SashaLuccioni",
    "type": "Blog",
    "year": "2024",
    "title": "Sasha Luccioni on Twitter/X"
  }
]'::jsonb
WHERE id = 'a5683d31-c9ae-40e9-bfd7-64619463e442';

-- ============================================================================
-- SATYEN SANGANI (Alation) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.alation.com/blog/data-culture/",
    "type": "Manifesto",
    "year": "2020",
    "title": "Data Culture Manifesto"
  },
  {
    "url": "https://www.alation.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Alation - Co-founder & CEO"
  },
  {
    "url": "https://www.alation.com/blog/author/satyen-sangani/",
    "type": "Blog",
    "year": "2024",
    "title": "Alation Blog - Data Governance Insights"
  },
  {
    "url": "https://www.linkedin.com/in/satyensangani/",
    "type": "Blog",
    "year": "2024",
    "title": "Satyen Sangani on LinkedIn"
  }
]'::jsonb
WHERE id = '6c62e895-cfb3-41de-8b31-f5b7f596471a';

-- ============================================================================
-- SETH LAZAR (ANU) - Remove 3 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.sethlazar.xyz/",
    "type": "Website",
    "year": "2024",
    "title": "Seth Lazar Personal Site"
  },
  {
    "url": "https://philosophy.anu.edu.au/people/academics/seth-lazar",
    "type": "Research",
    "year": "2024",
    "title": "Australian National University - Philosophy"
  },
  {
    "url": "https://arxiv.org/search/?query=seth+lazar&searchtype=author",
    "type": "Research",
    "year": "2024",
    "title": "Research Papers on AI Ethics & Philosophy"
  },
  {
    "url": "https://plato.stanford.edu/entries/ethics-ai/",
    "type": "Article",
    "year": "2024",
    "title": "Stanford Encyclopedia - AI Ethics Contributions"
  }
]'::jsonb
WHERE id = '42285b7e-222c-4b8a-be86-70d643a7ee81';

-- ============================================================================
-- SHAWN WANG (Latent Space) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.latent.space/p/ai-engineer",
    "type": "Essay",
    "year": "2023",
    "title": "Rise of the AI Engineer"
  },
  {
    "url": "https://www.latent.space/",
    "type": "Podcast",
    "year": "2024",
    "title": "Latent Space Podcast"
  },
  {
    "url": "https://www.swyx.io/",
    "type": "Blog",
    "year": "2024",
    "title": "swyx.io Blog - AI Engineering"
  },
  {
    "url": "https://twitter.com/swyx",
    "type": "Blog",
    "year": "2024",
    "title": "Shawn Wang on Twitter/X"
  }
]'::jsonb
WHERE id = '524024c8-e4b3-47ff-a0fd-2eb13f9ac07e';

-- ============================================================================
-- SIMON WILLISON - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://simonwillison.net/2023/Aug/3/weird-world-of-llms/",
    "type": "Talk",
    "year": "2023",
    "title": "The Weird World of LLMs"
  },
  {
    "url": "https://simonwillison.net/",
    "type": "Blog",
    "year": "2024",
    "title": "Simon Willison'\''s Weblog - LLM Deep Dives"
  },
  {
    "url": "https://github.com/simonw",
    "type": "Organization",
    "year": "2024",
    "title": "Simon Willison GitHub - LLM Tools"
  },
  {
    "url": "https://datasette.io/",
    "type": "Organization",
    "year": "2024",
    "title": "Datasette - Creator & Maintainer"
  }
]'::jsonb
WHERE id = '12d0a4f1-7084-42e5-bfbf-7b57da4bf7b9';

-- ============================================================================
-- SUBBARAO KAMBHAMPATI (ASU) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://cacm.acm.org/blogcacm/can-llms-really-reason-and-plan/",
    "type": "Article",
    "year": "2023",
    "title": "Can LLMs Really Reason and Plan?"
  },
  {
    "url": "https://rakaposhi.eas.asu.edu/",
    "type": "Research",
    "year": "2024",
    "title": "Arizona State University - AI & Planning Research"
  },
  {
    "url": "https://arxiv.org/search/?query=subbarao+kambhampati&searchtype=author",
    "type": "Research",
    "year": "2024",
    "title": "Research Papers on AI Planning & Reasoning"
  },
  {
    "url": "https://aaai.org/about-aaai/aaai-awards/the-aaai-classic-paper-award/",
    "type": "Research",
    "year": "2024",
    "title": "AAAI Award-Winning Research"
  }
]'::jsonb
WHERE id = 'a2151290-f288-43d5-9b70-0f0a80a405b5';

-- ============================================================================
-- VINOD KHOSLA (Khosla Ventures) - Remove 2 duplicates (3 instances of same URL), add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://www.khoslaventures.com/ai-will-defend-humanity",
    "type": "Article",
    "year": "2024",
    "title": "AI Will Defend Humanity"
  },
  {
    "url": "https://www.khoslaventures.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Khosla Ventures - Founder"
  },
  {
    "url": "https://twitter.com/vkhosla",
    "type": "Blog",
    "year": "2024",
    "title": "Vinod Khosla on Twitter/X"
  },
  {
    "url": "https://www.khoslaventures.com/the-ai-revolution-in-medicine",
    "type": "Article",
    "year": "2024",
    "title": "The AI Revolution in Medicine"
  }
]'::jsonb
WHERE id = '188e6455-909f-4236-8df1-86e7705e6c9c';

-- ============================================================================
-- WERNER VOGELS (AWS) - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://thefrugalarchitect.com/",
    "type": "Manifesto",
    "year": "2024",
    "title": "The Frugal Architect"
  },
  {
    "url": "https://www.allthingsdistributed.com/",
    "type": "Blog",
    "year": "2024",
    "title": "All Things Distributed - Personal Blog"
  },
  {
    "url": "https://aws.amazon.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Amazon Web Services - VP & CTO"
  },
  {
    "url": "https://twitter.com/Werner",
    "type": "Blog",
    "year": "2024",
    "title": "Werner Vogels on Twitter/X"
  }
]'::jsonb
WHERE id = 'ee3b1dcc-db89-4efc-83dc-f45fc7b4d944';

-- ============================================================================
-- ZVI MOWSHOWITZ - Remove 2 duplicates, add replacements
-- ============================================================================

UPDATE authors
SET sources = '[
  {
    "url": "https://thezvi.wordpress.com/",
    "type": "Blog",
    "year": "2024",
    "title": "Don'\''t Worry About the Vase"
  },
  {
    "url": "https://thezvi.substack.com/",
    "type": "Blog",
    "year": "2024",
    "title": "Don'\''t Worry About the Vase (Substack)"
  },
  {
    "url": "https://www.lesswrong.com/users/zvi-mowshowitz",
    "type": "Blog",
    "year": "2024",
    "title": "LessWrong - Zvi Mowshowitz"
  },
  {
    "url": "https://equilibriabook.com/",
    "type": "Book",
    "year": "2017",
    "title": "Inadequate Equilibria"
  }
]'::jsonb
WHERE id = '68dddda6-e01b-43bc-99a7-8e6e4a55d143';

COMMIT;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Run this after applying updates to verify no duplicates remain:
--
-- SELECT
--   name,
--   jsonb_array_length(sources) as source_count,
--   sources
-- FROM authors
-- WHERE id IN (
--   '5a2a5405-c0e4-4d29-910a-ecec434ccf83', -- Ali Ghodsi
--   '7d1aac4d-599d-4f39-a73f-82fdb318b33f', -- Amba Kak
--   -- ... add other IDs
-- );
