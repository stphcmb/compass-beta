import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Read the SQL file
const sqlFile = fs.readFileSync('./scripts/add_authors_batch_2026_01.sql', 'utf8');

// Split into individual statements (simple split, may need adjustment)
// For complex SQL with transactions, we'll execute statement by statement

async function runSQL() {
  console.log('Starting author additions...\n');

  // First, let's add authors one by one using the Supabase client
  const newAuthors = [
    {
      name: 'Simon Johnson',
      primary_affiliation: 'MIT Sloan School of Management, Professor',
      header_affiliation: 'MIT',
      notes: "2024 Nobel Prize winner in Economics (with Acemoglu and Robinson). Co-director of MIT's Shaping the Future of Work Initiative. His research shows technology can be pro-worker or pro-automation depending on policy choices.",
      credibility_tier: 'Pioneer',
      author_type: 'Academic',
      sources: [
        {"url": "https://shapingwork.mit.edu/", "type": "Research", "year": "2024", "title": "MIT Shaping the Future of Work Initiative"},
        {"url": "https://www.nobelprize.org/prizes/economic-sciences/2024/johnson/facts/", "type": "Organization", "year": "2024", "title": "Nobel Prize in Economics 2024"},
        {"url": "https://www.amazon.com/Power-Progress-Thousand-Year-Technology-Prosperity/dp/1541702530", "type": "Book", "year": "2023", "title": "Power and Progress: Our Thousand-Year Struggle Over Technology and Prosperity"}
      ],
      key_quote: "AI could either empower people with a lot of education, make them more highly skilled, enable them to do more tasks and get more pay. Or it could be another massive wave of automation that pushes the remnants of the middle down to the bottom. We have not generated enough new good jobs, jobs where you actually get paid good money and you can live well, and we have got to do better on that.",
      quote_source_url: 'https://news.mit.edu/news-clip/marketplace-39'
    },
    {
      name: 'Michael Osborne',
      primary_affiliation: 'University of Oxford, Professor of Machine Learning',
      header_affiliation: 'Oxford',
      notes: "Co-author of the landmark 2013 study \"The Future of Employment\" estimating 47% of US jobs at risk of automation. Co-director of Oxford's Programme on Technology and Employment. His 2024 reappraisal shows AI will transform jobs rather than eliminate them.",
      credibility_tier: 'Field Leader',
      author_type: 'Academic',
      sources: [
        {"url": "https://www.oxfordmartin.ox.ac.uk/people/michael-osborne/", "type": "Organization", "year": "2024", "title": "Oxford Martin School Profile"},
        {"url": "https://robots.ox.ac.uk/~mosb/public/pdf/3329/Frey%20and%20Osborne%20-%202024%20-%20Generative%20AI%20and%20the%20future%20of%20work%20a%20reappraisa.pdf", "type": "Paper", "year": "2024", "title": "Generative AI and the Future of Work: A Reappraisal"},
        {"url": "https://www.mindfoundry.ai/", "type": "Organization", "year": "2024", "title": "Mind Foundry (Co-founder)"}
      ],
      key_quote: "AI will continue to surprise us, and many jobs may be automated. However, in the absence of major breakthroughs, we also expect the bottlenecks we outline in our 2013 paper to continue to constrain our automation possibilities for the foreseeable future. Remote jobs are more likely to be automated, while AI will increase the value of in-person communication skills.",
      quote_source_url: 'https://www.oii.ox.ac.uk/news-events/generative-ai-has-potential-to-disrupt-labour-markets-but-is-not-likely-to-cause-widespread-automation-and-job-displacement-say-oxford-ai-experts/'
    },
    {
      name: 'Daniel Susskind',
      primary_affiliation: "King's College London, Research Professor; Oxford University, Senior Research Associate",
      header_affiliation: 'Oxford/KCL',
      notes: "Economist and author exploring AI's impact on work. His book \"Growth: A Reckoning\" was chosen by President Obama as a Favourite Book of 2024 and was runner-up for FT Business Book of the Year.",
      credibility_tier: 'Field Leader',
      author_type: 'Academic',
      sources: [
        {"url": "https://www.danielsusskind.com/", "type": "Website", "year": "2024", "title": "Daniel Susskind Official Site"},
        {"url": "https://www.amazon.com/World-Without-Work-Technology-Automation/dp/0241321093", "type": "Book", "year": "2020", "title": "A World Without Work"},
        {"url": "https://www.amazon.com/Growth-Reckoning-Daniel-Susskind/dp/0241557658", "type": "Book", "year": "2024", "title": "Growth: A Reckoning"}
      ],
      key_quote: "Machines no longer need to think like us in order to outperform us. As a result, more and more tasks that used to be far beyond the capability of computers - from diagnosing illnesses to drafting legal contracts - are coming within their reach. The substituting force is gathering strength and will at some point overwhelm the complementing force.",
      quote_source_url: 'https://www.danielsusskind.com/'
    },
    {
      name: 'Katja Grace',
      primary_affiliation: 'AI Impacts, Lead Researcher',
      header_affiliation: 'AI Impacts',
      notes: "Researcher focused on AI forecasting and existential risk. Her 2024 survey of 2,700+ AI researchers is the largest of its kind. Named to TIME's 100 Most Influential People in AI 2024.",
      credibility_tier: 'Domain Expert',
      author_type: 'Researcher',
      sources: [
        {"url": "https://aiimpacts.org/", "type": "Organization", "year": "2024", "title": "AI Impacts"},
        {"url": "https://arxiv.org/abs/1705.08807", "type": "Paper", "year": "2017", "title": "When Will AI Exceed Human Performance?"},
        {"url": "https://time.com/7012879/katja-grace/", "type": "Website", "year": "2024", "title": "TIME 100 Most Influential in AI"}
      ],
      key_quote: "Policy decisions are implicitly bets about the future, and on a topic like this one, the stakes might be our lives or livelihoods. So even if the topic is hard to predict well, isn't it better to predict it as well as we can than to play with our eyes closed? I would be very surprised if it was somehow impossible to have AI that was substantially better than any given human at any given task.",
      quote_source_url: 'https://80000hours.org/podcast/episodes/katja-grace-forecasting-technology/'
    },
    {
      name: 'Molly Kinder',
      primary_affiliation: 'Brookings Institution, David M. Rubenstein Fellow',
      header_affiliation: 'Brookings',
      notes: "Researcher at Brookings focusing on workforce policy, labor markets, and the impact of technology on workers. Her research examines how AI affects frontline workers and what policies can help workers adapt.",
      credibility_tier: 'Domain Expert',
      author_type: 'Policy Expert',
      sources: [
        {"url": "https://www.brookings.edu/people/molly-kinder/", "type": "Organization", "year": "2024", "title": "Brookings Profile"},
        {"url": "https://www.brookings.edu/articles/how-ai-will-transform-work/", "type": "Research", "year": "2024", "title": "How AI Will Transform Work"},
        {"url": "https://www.brookings.edu/articles/ai-and-the-future-of-work-in-america/", "type": "Research", "year": "2024", "title": "AI and the Future of Work in America"}
      ],
      key_quote: "The workers most exposed to AI disruption are often the least prepared for it. We need policies that help workers adapt - not just through retraining programs, but through portable benefits, stronger safety nets, and workplace voice in how AI gets deployed.",
      quote_source_url: 'https://www.brookings.edu/articles/how-ai-will-transform-work/'
    },
    {
      name: 'Anu Madgavkar',
      primary_affiliation: 'McKinsey Global Institute, Partner',
      header_affiliation: 'McKinsey',
      notes: "Partner at McKinsey Global Institute leading research on AI, automation, and the future of work. Her research finds AI could automate 57% of work hours but success requires human-AI partnership and organizational redesign.",
      credibility_tier: 'Domain Expert',
      author_type: 'Researcher',
      sources: [
        {"url": "https://www.mckinsey.com/our-people/anu-madgavkar", "type": "Organization", "year": "2024", "title": "McKinsey Profile"},
        {"url": "https://www.mckinsey.com/mgi/our-research/agents-robots-and-us-skill-partnerships-in-the-age-of-ai", "type": "Research", "year": "2025", "title": "Agents, Robots, and Us"},
        {"url": "https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america", "type": "Research", "year": "2023", "title": "Generative AI and the Future of Work in America"}
      ],
      key_quote: "Integrating AI will not be a simple technology rollout but a reimagining of work itself. Redesigning processes, roles, skills, culture, and metrics so people, agents, and robots create more value together. Even as AI automates many tasks, companies that invest in human skills will gain a competitive edge.",
      quote_source_url: 'https://www.mckinsey.com/mgi/our-research/agents-robots-and-us-skill-partnerships-in-the-age-of-ai'
    },
    {
      name: 'Lareina Yee',
      primary_affiliation: 'McKinsey & Company, Senior Partner; McKinsey Global Institute, Director of Technology Research',
      header_affiliation: 'McKinsey',
      notes: "Director of technology research at McKinsey Global Institute and former Chief Diversity Officer. Leads research on AI adoption, workforce transformation, and women in the workplace.",
      credibility_tier: 'Domain Expert',
      author_type: 'Executive',
      sources: [
        {"url": "https://www.mckinsey.com/our-people/lareina-yee", "type": "Organization", "year": "2024", "title": "McKinsey Profile"},
        {"url": "https://www.mckinsey.com/featured-insights/diversity-and-inclusion/women-in-the-workplace", "type": "Research", "year": "2024", "title": "Women in the Workplace 2024"},
        {"url": "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-top-trends-in-tech", "type": "Research", "year": "2024", "title": "McKinsey Technology Trends 2024"}
      ],
      key_quote: "Women will experience even more dramatic shifts in job opportunities and expectations than men, as AI and automation are set to disrupt the fields where they have greater representation. Roles in nursing, education, marketing, communications, sales, and customer service face significant transformation. We need to encourage more girls to choose careers in STEM.",
      quote_source_url: 'https://katiecouric.com/lifestyle/workplace/career-growth-ai-automation-karlie-kloss-lareina-yee/'
    },
    {
      name: 'Richard Socher',
      primary_affiliation: 'You.com, CEO & Co-founder; AIX Ventures, Managing Director',
      header_affiliation: 'You.com',
      notes: "Former Chief Scientist at Salesforce. Pioneer in NLP research with over 215,000 citations. Fourth most-cited researcher in NLP. Building AI-powered search that prioritizes accuracy over hype.",
      credibility_tier: 'Field Leader',
      author_type: 'Industry Leader',
      sources: [
        {"url": "https://you.com/", "type": "Website", "year": "2024", "title": "You.com"},
        {"url": "https://www.socher.org/", "type": "Website", "year": "2024", "title": "Richard Socher Personal Site"},
        {"url": "https://aix.vc/", "type": "Organization", "year": "2024", "title": "AIX Ventures"}
      ],
      key_quote: "Many companies that started around ChatGPT said 'Oh, it's all in the LLM.' But really, the LLM is this summarization reasoning layer, and you need to have a search engine that feeds it information. We have actually built an accurate search engine, too, and that's half the battle. For folks whose careers depend on accurate answers, they usually come to You.com.",
      quote_source_url: 'https://www.fastcompany.com/91230536/you-com-founder-richard-sochers-plan-to-win-the-ai-search-wars'
    },
    {
      name: 'Nathan Benaich',
      primary_affiliation: 'Air Street Capital, Founder & General Partner',
      header_affiliation: 'Air Street Capital',
      notes: "Publisher of the annual State of AI Report, the most widely read analysis of AI developments since 2018. Investor in AI-first companies including Mapillary (acquired by Meta), Graphcore, and Tractable.",
      credibility_tier: 'Field Leader',
      author_type: 'Investor',
      sources: [
        {"url": "https://www.stateof.ai/", "type": "Research", "year": "2025", "title": "State of AI Report"},
        {"url": "https://airstreet.com/", "type": "Organization", "year": "2024", "title": "Air Street Capital"},
        {"url": "https://nathanbenaich.substack.com/", "type": "Blog", "year": "2024", "title": "State of AI Newsletter"}
      ],
      key_quote: "We're now beginning to see a split among AI-first start-ups. The biggest model builders are now seeing real revenues to match their soaring valuations, while some buzzier start-ups' multi-billion dollar valuations can seem more vibes-driven. If you'd just bought NVDA stock instead of its challengers, you'd be up 12x vs. 2x.",
      quote_source_url: 'https://www.stateof.ai/'
    },
    {
      name: 'Toby Ord',
      primary_affiliation: 'University of Oxford, Senior Researcher in AI Governance; Future of Humanity Institute',
      header_affiliation: 'Oxford',
      notes: "Philosopher focused on existential risk. Founder of Giving What We Can and key figure in effective altruism. Author of \"The Precipice.\" Estimates AI poses a 1 in 10 existential risk this century - higher than all other sources combined.",
      credibility_tier: 'Field Leader',
      author_type: 'Academic',
      sources: [
        {"url": "https://www.tobyord.com/", "type": "Website", "year": "2024", "title": "Toby Ord Personal Site"},
        {"url": "https://www.amazon.com/Precipice-Existential-Risk-Future-Humanity/dp/0316484911", "type": "Book", "year": "2020", "title": "The Precipice"},
        {"url": "https://www.fhi.ox.ac.uk/", "type": "Organization", "year": "2024", "title": "Future of Humanity Institute"}
      ],
      key_quote: "We live during the most important era of human history. In the twentieth century, we developed the means to destroy ourselves - without developing the moral framework to ensure we won't. We are experiencing an unsustainable level of risk - either we destroy ourselves or we build institutions to manage it. We spend less on securing our long-term potential than we do on ice cream.",
      quote_source_url: 'https://www.nti.org/risky-business/nti-seminar-philosopher-toby-ord-existential-risk-and-future-humanity/'
    },
    {
      name: 'Pascale Fung',
      primary_affiliation: 'Meta, Senior Director of AI Research; Hong Kong University of Science & Technology, Chair Professor',
      header_affiliation: 'Meta/HKUST',
      notes: "Fellow of IEEE, ACL, AAAI, and ISCA. Founding Director of HKUST Centre for AI Research. Expert on World Economic Forum's Global Future Council since 2016. Named Forbes Asia 2024 leader.",
      credibility_tier: 'Field Leader',
      author_type: 'Academic',
      sources: [
        {"url": "https://pascale.home.ece.ust.hk/", "type": "Website", "year": "2024", "title": "Pascale Fung Lab"},
        {"url": "https://ai.meta.com/", "type": "Organization", "year": "2024", "title": "Meta AI Research"},
        {"url": "https://www.weforum.org/agenda/authors/pascale-fung/", "type": "Website", "year": "2024", "title": "WEF Contributor Profile"}
      ],
      key_quote: "We are building algorithms to control algorithms because they are human-built. These language models did not drop to us from some alien being. We built them. We can control them. We need to ask ourselves more about WHY we are creating AI technology not just HOW. We should not lose sight of the greater purpose of technology to serve humankind.",
      quote_source_url: 'https://www.carnegiecouncil.org/media/series/aiei/20220329-code-empathy-pascale-fung'
    },
    {
      name: 'Chelsea Finn',
      primary_affiliation: 'Stanford University, Assistant Professor; Physical Intelligence, Co-founder',
      header_affiliation: 'Stanford/Pi',
      notes: "Pioneer in robot learning and meta-learning. Co-founder of Physical Intelligence, building foundation models for robotics. Her IRIS lab studies intelligence through robotic interaction at scale.",
      credibility_tier: 'Field Leader',
      author_type: 'Academic',
      sources: [
        {"url": "https://ai.stanford.edu/~cbfinn/", "type": "Website", "year": "2024", "title": "Chelsea Finn Lab"},
        {"url": "https://physicalintelligence.company/", "type": "Organization", "year": "2024", "title": "Physical Intelligence"},
        {"url": "https://scholar.google.com/citations?user=vfPE6hgAAAAJ", "type": "Research", "year": "2024", "title": "Google Scholar Profile"}
      ],
      key_quote: "In research you're really trying to solve problems that no one has solved before, so you have to persevere and when things aren't working then you come up with new ideas and move on, keep on trying. Our mission at Physical Intelligence is to develop a model that can allow a robot to be able to perform any task in whatever environment it is in.",
      quote_source_url: 'https://www.sednacg.com/post/influential-women-in-ai-what-is-chelsea-finn-known-for'
    },
    {
      name: 'Sergey Levine',
      primary_affiliation: 'UC Berkeley, Associate Professor; Physical Intelligence, Co-founder',
      header_affiliation: 'Berkeley/Pi',
      notes: "Leading researcher in deep reinforcement learning with over 217,000 citations. Co-founder of Physical Intelligence. His algorithms enable robots to learn complex behaviors from experience.",
      credibility_tier: 'Field Leader',
      author_type: 'Academic',
      sources: [
        {"url": "https://people.eecs.berkeley.edu/~svlevine/", "type": "Website", "year": "2024", "title": "Sergey Levine Lab"},
        {"url": "https://physicalintelligence.company/", "type": "Organization", "year": "2024", "title": "Physical Intelligence"},
        {"url": "https://rail.eecs.berkeley.edu/deeprlcourse/", "type": "Research", "year": "2024", "title": "Deep RL Course"}
      ],
      key_quote: "In science, it is a really good idea to sometimes see how extreme a design can still work because you learn a lot from doing that. Our goal is to develop foundation models and learning algorithms to power the robots of today and the physically-actuated devices of the future.",
      quote_source_url: 'https://imbue.com/podcast/2023-03-01-podcast-episode-28-sergey-levine/'
    },
    {
      name: 'James Manyika',
      primary_affiliation: 'Google, Senior Vice President of Research, Technology and Society; DeepMind, Fellow',
      header_affiliation: 'Google',
      notes: "Former McKinsey Global Institute director. Co-chair of UN High-Level Advisory Body on AI. Rhodes Scholar with D.Phil in AI and Robotics from Oxford. Named to TIME's 100 Most Influential People in AI.",
      credibility_tier: 'Pioneer',
      author_type: 'Executive',
      sources: [
        {"url": "https://blog.google/inside-google/google-executives/james-manyika/", "type": "Website", "year": "2024", "title": "Google Profile"},
        {"url": "https://www.un.org/en/ai-advisory-body", "type": "Organization", "year": "2024", "title": "UN AI Advisory Body"},
        {"url": "https://blog.google/technology/ai/a-new-era-of-discovery/", "type": "Blog", "year": "2024", "title": "A New Era of Discovery"}
      ],
      key_quote: "Right now, everyone from my old colleagues at McKinsey to Goldman Sachs are putting out these extraordinary economic potential numbers - in the trillions - but the productivity gains from AI are not guaranteed. They're going to take a lot of work. We could have a version of the Solow paradox - where we see this technology everywhere, but it's done nothing to transform the economy in that real fundamental way.",
      quote_source_url: 'https://tech.slashdot.org/story/24/09/02/1633202/googles-james-manyika-the-productivity-gains-from-ai-are-not-guaranteed'
    },
    {
      name: 'Daryl Plummer',
      primary_affiliation: 'Gartner, Distinguished VP Analyst, Chief of Research & Gartner Fellow',
      header_affiliation: 'Gartner',
      notes: "Chief of Research at Gartner leading strategic technology predictions. Known for forward-looking analysis of how AI will transform enterprise IT and business strategy.",
      credibility_tier: 'Domain Expert',
      author_type: 'Industry Leader',
      sources: [
        {"url": "https://www.gartner.com/en/experts/daryl-plummer", "type": "Organization", "year": "2024", "title": "Gartner Profile"},
        {"url": "https://www.gartner.com/en/articles/gartner-s-top-strategic-predictions-for-2024-and-beyond", "type": "Research", "year": "2024", "title": "Top Strategic Predictions 2024"},
        {"url": "https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond", "type": "Research", "year": "2024", "title": "Top Predictions 2025"}
      ],
      key_quote: "It is clear that no matter where we go, we cannot avoid the impact of AI. AI is evolving as human use of AI evolves. Through 2026, 20% of organizations will use AI to flatten their organizational structure, eliminating more than half of current middle management positions.",
      quote_source_url: 'https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond'
    },
    {
      name: 'Shaun Maguire',
      primary_affiliation: 'Sequoia Capital, Partner',
      header_affiliation: 'Sequoia',
      notes: "Partner at Sequoia focused on AI and defense tech investments. Led investments in Stripe, Opendoor, and Lambda School at GV. Co-founded cybersecurity company Expanse (acquired by Palo Alto Networks for $800M+).",
      credibility_tier: 'Domain Expert',
      author_type: 'Investor',
      sources: [
        {"url": "https://sequoiacap.com/people/shaun-maguire/", "type": "Organization", "year": "2024", "title": "Sequoia Profile"},
        {"url": "https://www.linkedin.com/in/shaun-maguire-c/", "type": "Website", "year": "2024", "title": "LinkedIn Profile"},
        {"url": "https://www.crunchbase.com/person/shaun-maguire", "type": "Website", "year": "2024", "title": "Crunchbase Profile"}
      ],
      key_quote: "If you look at the people that have led the biggest breakthroughs in AI from an algorithms perspective, quite a few are Israelis that live in America, like Ilya Sutskever and Noam Shazeer. The future of information warfare is AI. I like high-IQ founders. But even more important to me is someone that's just irrationally motivated.",
      quote_source_url: 'https://www.calcalistech.com/ctechnews/article/skwsxeacxg'
    },
    {
      name: 'Shawn Wang',
      primary_affiliation: 'Latent Space, Founder; Smol AI, Founder',
      header_affiliation: 'Latent Space',
      notes: "Coined the term \"AI Engineer\" to describe the new role bridging software engineering and AI. His Latent Space podcast is the largest AI engineering podcast, with listeners including Andreessen and Nadella.",
      credibility_tier: 'Domain Expert',
      author_type: 'Public Intellectual',
      sources: [
        {"url": "https://www.swyx.io/", "type": "Website", "year": "2024", "title": "swyx Personal Site"},
        {"url": "https://www.latent.space/", "type": "Website", "year": "2024", "title": "Latent Space"},
        {"url": "https://smol.ai/", "type": "Organization", "year": "2024", "title": "Smol AI"}
      ],
      key_quote: "Even if you don't have a Ph.D., even if you don't have years of experience in machine learning, if you know how to wrangle an API, you should actually start taking a serious look because this is giving you new capabilities. AI engineering feels closer to software engineering than to ML engineering - it's much more about building a product first.",
      quote_source_url: 'https://redmonk.com/blog/2025/07/23/shawn-swyx-wang-ai-engineer/'
    },
    {
      name: 'Daniel Kahneman',
      primary_affiliation: 'Princeton University, Professor Emeritus (1934-2024)',
      header_affiliation: 'Princeton',
      notes: "2002 Nobel Prize winner in Economics. Pioneer of behavioral economics and author of \"Thinking, Fast and Slow.\" His work on cognitive biases profoundly influenced AI development and human-AI decision making research.",
      credibility_tier: 'Pioneer',
      author_type: 'Academic',
      sources: [
        {"url": "https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555", "type": "Book", "year": "2011", "title": "Thinking, Fast and Slow"},
        {"url": "https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/facts/", "type": "Organization", "year": "2002", "title": "Nobel Prize"},
        {"url": "https://www.amazon.com/Noise-Human-Judgment-Daniel-Kahneman/dp/0316451401", "type": "Book", "year": "2021", "title": "Noise: A Flaw in Human Judgment"}
      ],
      key_quote: "Algorithms are noise-free. People are not. When you put some data in front of an algorithm, you will always get the same response at the other end. The main characteristic of people is that they're very noisy. You show them the same stimulus twice, they don't give you the same response twice. It's very difficult to imagine that with sufficient data there will remain things that only humans can do.",
      quote_source_url: 'https://www.aei.org/economics/nobel-laureate-daniel-kahneman-on-a-i-its-very-difficult-to-imagine-that-with-sufficient-data-there-will-remain-things-that-only-humans-can-do/'
    }
  ];

  let addedCount = 0;
  let skippedCount = 0;

  for (const author of newAuthors) {
    // Check if author exists
    const { data: existing } = await supabase
      .from('authors')
      .select('id')
      .eq('name', author.name)
      .single();

    if (existing) {
      console.log(`⏭️  Skipping ${author.name} (already exists)`);
      skippedCount++;
      continue;
    }

    // Insert author
    const { data, error } = await supabase
      .from('authors')
      .insert(author)
      .select()
      .single();

    if (error) {
      console.error(`❌ Error adding ${author.name}:`, error.message);
    } else {
      console.log(`✅ Added ${author.name}`);
      addedCount++;
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Added: ${addedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Total: ${newAuthors.length}`);
}

runSQL().catch(console.error);
