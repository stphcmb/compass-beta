-- ============================================================================
-- AUTHOR SOURCES ENRICHMENT
-- Add missing publications for authors with < 3 sources
-- ============================================================================
-- Priority: Major Voices and Seminal Thinkers first
-- Date: 2025-12-10
-- ============================================================================

BEGIN;

-- ============================================================================
-- SEMINAL THINKERS (High Priority)
-- ============================================================================

-- Alondra Nelson (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://www.whitehouse.gov/ostp/",
    "type": "Organization",
    "year": "2024",
    "title": "Former Deputy Director for Science & Society, White House OSTP"
  },
  {
    "url": "https://www.ias.edu/scholars/alondra-nelson",
    "type": "Research",
    "year": "2024",
    "title": "Institute for Advanced Study"
  },
  {
    "url": "https://en.wikipedia.org/wiki/The_Social_Life_of_DNA",
    "type": "Book",
    "year": "2016",
    "title": "The Social Life of DNA: Race, Reparations, and Reconciliation"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Alondra Nelson';

-- Arvind Narayanan (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://www.cs.princeton.edu/~arvindn/",
    "type": "Research",
    "year": "2024",
    "title": "Princeton Computer Science"
  },
  {
    "url": "https://press.princeton.edu/books/hardcover/9780262035668/ai-snake-oil",
    "type": "Book",
    "year": "2024",
    "title": "AI Snake Oil: What Artificial Intelligence Can Do, What It Can''t"
  },
  {
    "url": "https://aisnakeoil.substack.com/",
    "type": "Blog",
    "year": "2024",
    "title": "AI Snake Oil Substack"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Arvind Narayanan';

-- Benedict Evans (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://www.ben-evans.com/",
    "type": "Website",
    "year": "2024",
    "title": "Benedict Evans"
  },
  {
    "url": "https://www.ben-evans.com/newsletter",
    "type": "Blog",
    "year": "2024",
    "title": "Benedict Evans Newsletter"
  },
  {
    "url": "https://twitter.com/benedictevans",
    "type": "Blog",
    "year": "2024",
    "title": "Benedict Evans on Twitter/X"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Benedict Evans';

-- Brad Smith (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://blogs.microsoft.com/on-the-issues/author/brad-smith/",
    "type": "Blog",
    "year": "2024",
    "title": "Brad Smith on Microsoft On the Issues"
  },
  {
    "url": "https://news.microsoft.com/source/authors/brad-smith/",
    "type": "Organization",
    "year": "2024",
    "title": "Microsoft News - Brad Smith"
  },
  {
    "url": "https://www.penguinrandomhouse.com/books/600774/tools-and-weapons-by-brad-smith-and-carol-ann-browne/",
    "type": "Book",
    "year": "2019",
    "title": "Tools and Weapons: The Promise and the Peril of the Digital Age"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Brad Smith';

-- Carl Benedikt Frey (1 source → 3)
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://www.oxfordmartin.ox.ac.uk/people/carl-benedikt-frey/",
    "type": "Research",
    "year": "2024",
    "title": "Oxford Martin School"
  },
  {
    "url": "https://press.princeton.edu/books/hardcover/9780691179681/the-technology-trap",
    "type": "Book",
    "year": "2019",
    "title": "The Technology Trap: Capital, Labor, and Power in the Age of Automation"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Carl Benedikt Frey';

-- Dan Hendrycks (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://www.safe.ai/",
    "type": "Organization",
    "year": "2024",
    "title": "Center for AI Safety"
  },
  {
    "url": "https://www.safe.ai/work/statement-on-ai-risk",
    "type": "Paper",
    "year": "2023",
    "title": "Statement on AI Risk - Signed by AI leaders"
  },
  {
    "url": "https://arxiv.org/search/?query=dan+hendrycks&searchtype=author",
    "type": "Research",
    "year": "2024",
    "title": "Research Papers on arXiv"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Dan Hendrycks';

-- François Chollet (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://fchollet.com/",
    "type": "Website",
    "year": "2024",
    "title": "François Chollet Personal Site"
  },
  {
    "url": "https://www.manning.com/books/deep-learning-with-python-second-edition",
    "type": "Book",
    "year": "2021",
    "title": "Deep Learning with Python (2nd Edition)"
  },
  {
    "url": "https://github.com/keras-team/keras",
    "type": "Organization",
    "year": "2024",
    "title": "Keras - Creator"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'François Chollet';

-- Joshua Gans (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://www.joshuagans.com/",
    "type": "Website",
    "year": "2024",
    "title": "Joshua Gans Personal Site"
  },
  {
    "url": "https://mitpress.mit.edu/9780262538800/prediction-machines/",
    "type": "Book",
    "year": "2018",
    "title": "Prediction Machines: The Simple Economics of AI"
  },
  {
    "url": "https://mitpress.mit.edu/9780262047609/power-and-prediction/",
    "type": "Book",
    "year": "2022",
    "title": "Power and Prediction: The Disruptive Economics of Artificial Intelligence"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Joshua Gans';

-- Joy Buolamwini (1 source → 3)
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://www.media.mit.edu/people/joyab/overview/",
    "type": "Research",
    "year": "2024",
    "title": "MIT Media Lab"
  },
  {
    "url": "https://www.penguinrandomhouse.com/books/645999/unmasking-ai-by-joy-buolamwini-phd/",
    "type": "Book",
    "year": "2023",
    "title": "Unmasking AI: My Mission to Protect What Is Human in a World of Machines"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Joy Buolamwini';

-- Kenneth Stanley (1 source → 3)
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://www.cs.ucf.edu/~kstanley/",
    "type": "Research",
    "year": "2024",
    "title": "UCF Computer Science"
  },
  {
    "url": "https://www.penguinrandomhouse.com/books/313332/why-greatness-cannot-be-planned-by-kenneth-o-stanley-and-joel-lehman/",
    "type": "Book",
    "year": "2015",
    "title": "Why Greatness Cannot Be Planned"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Kenneth Stanley';

-- Linus Torvalds (1 source → 3)
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://github.com/torvalds",
    "type": "Organization",
    "year": "2024",
    "title": "GitHub - Linux Kernel"
  },
  {
    "url": "https://www.linuxfoundation.org/",
    "type": "Organization",
    "year": "2024",
    "title": "Linux Foundation"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Linus Torvalds';

-- Margrethe Vestager (1 source → 3)
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://ec.europa.eu/commission/commissioners/2019-2024/vestager_en",
    "type": "Organization",
    "year": "2024",
    "title": "European Commission - Executive VP"
  },
  {
    "url": "https://digital-strategy.ec.europa.eu/en",
    "type": "Organization",
    "year": "2024",
    "title": "EU Digital Strategy"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Margrethe Vestager';

-- Nouriel Roubini (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://www.stern.nyu.edu/faculty/bio/nouriel-roubini",
    "type": "Research",
    "year": "2024",
    "title": "NYU Stern School of Business"
  },
  {
    "url": "https://www.penguinrandomhouse.com/books/673919/megathreats-by-nouriel-roubini/",
    "type": "Book",
    "year": "2022",
    "title": "MegaThreats: Ten Dangerous Trends That Imperil Our Future"
  },
  {
    "url": "https://twitter.com/Nouriel",
    "type": "Blog",
    "year": "2024",
    "title": "Nouriel Roubini on Twitter/X"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Nouriel Roubini';

-- Paul Christiano (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://alignment.org/",
    "type": "Organization",
    "year": "2024",
    "title": "Alignment Research Center"
  },
  {
    "url": "https://www.lesswrong.com/users/paulfchristiano",
    "type": "Blog",
    "year": "2024",
    "title": "LessWrong - Paul Christiano"
  },
  {
    "url": "https://ai-alignment.com/",
    "type": "Website",
    "year": "2024",
    "title": "AI Alignment Forum"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Paul Christiano';

-- Pedro Domingos (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://homes.cs.washington.edu/~pedrod/",
    "type": "Research",
    "year": "2024",
    "title": "University of Washington Computer Science"
  },
  {
    "url": "https://www.basicbooks.com/titles/pedro-domingos/the-master-algorithm/9780465094271/",
    "type": "Book",
    "year": "2015",
    "title": "The Master Algorithm"
  },
  {
    "url": "https://twitter.com/pmddomingos",
    "type": "Blog",
    "year": "2024",
    "title": "Pedro Domingos on Twitter/X"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Pedro Domingos';

-- Rodney Brooks (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://rodneybrooks.com/",
    "type": "Website",
    "year": "2024",
    "title": "Rodney Brooks Personal Site"
  },
  {
    "url": "https://www.irobot.com/",
    "type": "Organization",
    "year": "2024",
    "title": "iRobot - Co-founder"
  },
  {
    "url": "https://mitpress.mit.edu/9780262534147/intelligence-without-representation/",
    "type": "Paper",
    "year": "1991",
    "title": "Intelligence Without Representation (Seminal Paper)"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Rodney Brooks';

-- Subbarao Kambhampati (1 source → 3)
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://rakaposhi.eas.asu.edu/",
    "type": "Research",
    "year": "2024",
    "title": "Arizona State University"
  },
  {
    "url": "https://arxiv.org/search/?query=subbarao+kambhampati&searchtype=author",
    "type": "Research",
    "year": "2024",
    "title": "Research Papers on arXiv"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Subbarao Kambhampati';

-- Ted Chiang (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://en.wikipedia.org/wiki/Ted_Chiang",
    "type": "Website",
    "year": "2024",
    "title": "Ted Chiang Bibliography"
  },
  {
    "url": "https://www.penguinrandomhouse.com/books/708803/exhalation-by-ted-chiang/",
    "type": "Book",
    "year": "2019",
    "title": "Exhalation: Stories"
  },
  {
    "url": "https://www.newyorker.com/contributors/ted-chiang",
    "type": "Blog",
    "year": "2024",
    "title": "The New Yorker - Ted Chiang"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Ted Chiang';

-- Vinod Khosla (1 source → 3)
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://www.khoslaventures.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Khosla Ventures"
  },
  {
    "url": "https://twitter.com/vkhosla",
    "type": "Blog",
    "year": "2024",
    "title": "Vinod Khosla on Twitter/X"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Vinod Khosla';

-- Werner Vogels (1 source → 3)
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://www.allthingsdistributed.com/",
    "type": "Blog",
    "year": "2024",
    "title": "All Things Distributed (Personal Blog)"
  },
  {
    "url": "https://aws.amazon.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Amazon Web Services - CTO"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Werner Vogels';

-- Zvi Mowshowitz (1 source → 3)
UPDATE authors
SET sources = sources || '[
  {
    "url": "https://thezvi.substack.com/",
    "type": "Blog",
    "year": "2024",
    "title": "Don''t Worry About the Vase (Substack)"
  },
  {
    "url": "https://www.lesswrong.com/users/zvi-mowshowitz",
    "type": "Blog",
    "year": "2024",
    "title": "LessWrong - Zvi"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Zvi Mowshowitz';

-- ============================================================================
-- MAJOR VOICES (High Priority)
-- ============================================================================

-- Amba Kak (1 source → 3)
UPDATE authors
SET sources = sources || '[
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
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Amba Kak';

-- Anu Bradford (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://www.law.columbia.edu/faculty/anu-bradford",
    "type": "Research",
    "year": "2024",
    "title": "Columbia Law School"
  },
  {
    "url": "https://global.oup.com/academic/product/the-brussels-effect-9780190088583",
    "type": "Book",
    "year": "2020",
    "title": "The Brussels Effect: How the European Union Rules the World"
  },
  {
    "url": "https://global.oup.com/academic/product/digital-empires-9780197649268",
    "type": "Book",
    "year": "2023",
    "title": "Digital Empires: The Global Battle to Regulate Technology"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Anu Bradford';

-- Chip Huyen (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://huyenchip.com/",
    "type": "Website",
    "year": "2024",
    "title": "Chip Huyen Personal Site"
  },
  {
    "url": "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",
    "type": "Book",
    "year": "2022",
    "title": "Designing Machine Learning Systems"
  },
  {
    "url": "https://claypot.ai/",
    "type": "Organization",
    "year": "2024",
    "title": "Claypot AI - Founder"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Chip Huyen';

-- Connor Leahy (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://conjecture.dev/",
    "type": "Organization",
    "year": "2024",
    "title": "Conjecture - Co-founder & CEO"
  },
  {
    "url": "https://twitter.com/NPCollapse",
    "type": "Blog",
    "year": "2024",
    "title": "Connor Leahy on Twitter/X"
  },
  {
    "url": "https://www.lesswrong.com/users/connor_leahy",
    "type": "Blog",
    "year": "2024",
    "title": "LessWrong - Connor Leahy"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Connor Leahy';

-- Gary Marcus (1 source → 3)
UPDATE authors
SET sources = sources || '[
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
    "title": "Rebooting AI: Building Artificial Intelligence We Can Trust"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Gary Marcus';

-- Gergely Orosz (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://blog.pragmaticengineer.com/",
    "type": "Blog",
    "year": "2024",
    "title": "The Pragmatic Engineer"
  },
  {
    "url": "https://newsletter.pragmaticengineer.com/",
    "type": "Blog",
    "year": "2024",
    "title": "The Pragmatic Engineer Newsletter"
  },
  {
    "url": "https://twitter.com/GergelyOrosz",
    "type": "Blog",
    "year": "2024",
    "title": "Gergely Orosz on Twitter/X"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Gergely Orosz';

-- Harrison Chase (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://www.langchain.com/",
    "type": "Organization",
    "year": "2024",
    "title": "LangChain - Co-founder & CEO"
  },
  {
    "url": "https://github.com/langchain-ai/langchain",
    "type": "Organization",
    "year": "2024",
    "title": "LangChain GitHub"
  },
  {
    "url": "https://twitter.com/hwchase17",
    "type": "Blog",
    "year": "2024",
    "title": "Harrison Chase on Twitter/X"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Harrison Chase';

-- Jack Clark (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://www.anthropic.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Anthropic - Co-founder"
  },
  {
    "url": "https://jack-clark.net/",
    "type": "Blog",
    "year": "2024",
    "title": "Import AI Newsletter"
  },
  {
    "url": "https://twitter.com/jackclarkSF",
    "type": "Blog",
    "year": "2024",
    "title": "Jack Clark on Twitter/X"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Jack Clark';

-- Marietje Schaake (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://hai.stanford.edu/people/marietje-schaake",
    "type": "Research",
    "year": "2024",
    "title": "Stanford HAI - International Policy Director"
  },
  {
    "url": "https://www.cambridge.org/core/books/tech-coup/2348266FCA4843088E6CD1C51B942FBC",
    "type": "Book",
    "year": "2024",
    "title": "The Tech Coup: How to Save Democracy from Silicon Valley"
  },
  {
    "url": "https://twitter.com/MarietjeSchaake",
    "type": "Blog",
    "year": "2024",
    "title": "Marietje Schaake on Twitter/X"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Marietje Schaake';

-- Meredith Whittaker (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://signal.org/",
    "type": "Organization",
    "year": "2024",
    "title": "Signal - President"
  },
  {
    "url": "https://ainowinstitute.org/",
    "type": "Organization",
    "year": "2024",
    "title": "AI Now Institute - Co-founder"
  },
  {
    "url": "https://twitter.com/mer__edith",
    "type": "Blog",
    "year": "2024",
    "title": "Meredith Whittaker on Twitter/X"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Meredith Whittaker';

-- Palmer Luckey (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://www.anduril.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Anduril Industries - Founder"
  },
  {
    "url": "https://en.wikipedia.org/wiki/Palmer_Luckey",
    "type": "Website",
    "year": "2024",
    "title": "Palmer Luckey Biography"
  },
  {
    "url": "https://twitter.com/PalmerLuckey",
    "type": "Blog",
    "year": "2024",
    "title": "Palmer Luckey on Twitter/X"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Palmer Luckey';

-- Thomas Kurian (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://cloud.google.com/",
    "type": "Organization",
    "year": "2024",
    "title": "Google Cloud - CEO"
  },
  {
    "url": "https://cloud.google.com/blog/topics/inside-google-cloud/ceo-thomas-kurian",
    "type": "Blog",
    "year": "2024",
    "title": "Google Cloud Blog - Thomas Kurian"
  },
  {
    "url": "https://www.linkedin.com/in/thomas-kurian-469b1b2/",
    "type": "Website",
    "year": "2024",
    "title": "Thomas Kurian LinkedIn"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Thomas Kurian';

-- Vera Jourova (0 sources → 3)
UPDATE authors
SET sources = '[
  {
    "url": "https://ec.europa.eu/commission/commissioners/2019-2024/jourova_en",
    "type": "Organization",
    "year": "2024",
    "title": "European Commission - VP for Values & Transparency"
  },
  {
    "url": "https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package",
    "type": "Organization",
    "year": "2024",
    "title": "EU Digital Services Act"
  },
  {
    "url": "https://twitter.com/VeraJourova",
    "type": "Blog",
    "year": "2024",
    "title": "Věra Jourová on Twitter/X"
  }
]'::jsonb,
updated_at = now()
WHERE name = 'Vera Jourova';

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT
  name,
  header_affiliation,
  credibility_tier,
  jsonb_array_length(sources) as source_count
FROM authors
WHERE name IN (
  'Alondra Nelson', 'Arvind Narayanan', 'Benedict Evans', 'Brad Smith',
  'Carl Benedikt Frey', 'Dan Hendrycks', 'François Chollet', 'Joshua Gans',
  'Joy Buolamwini', 'Kenneth Stanley', 'Linus Torvalds', 'Margrethe Vestager',
  'Nouriel Roubini', 'Paul Christiano', 'Pedro Domingos', 'Rodney Brooks',
  'Subbarao Kambhampati', 'Ted Chiang', 'Vinod Khosla', 'Werner Vogels',
  'Zvi Mowshowitz', 'Amba Kak', 'Anu Bradford', 'Chip Huyen',
  'Connor Leahy', 'Gary Marcus', 'Gergely Orosz', 'Harrison Chase',
  'Jack Clark', 'Marietje Schaake', 'Meredith Whittaker', 'Palmer Luckey',
  'Thomas Kurian', 'Vera Jourova'
)
ORDER BY credibility_tier, name;
