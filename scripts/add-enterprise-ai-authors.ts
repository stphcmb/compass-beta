// Add Enterprise AI Thought Leaders - C-Suite Executives and Business Practitioners
// Focus: Real-world enterprise AI transformation, case studies, do's and don'ts
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
})

// Camp UUIDs for Enterprise AI Adoption domain
const CAMPS = {
  // Domain 3: Enterprise AI Adoption
  TECH_LEADS: '7e9a2196-71e7-423a-889c-6902bc678eac',      // Technology Leads
  CO_EVOLUTION: 'f19021ab-a8db-4363-adec-c2228dad6298',    // Co-Evolution
  BUSINESS_WHISPERERS: 'fe9464df-b778-44c9-9593-7fb3294fa6c3', // Business Whisperers
  TECH_BUILDERS: 'a076a4ce-f14c-47b5-ad01-c8c60135a494',   // Tech Builders
  // Domain 5: Future of Work
  DISPLACEMENT_REALIST: '76f0d8c5-c9a8-4a26-ae7e-18f787000e18',
  HUMAN_AI_COLLAB: 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371',
  // Domain 4: AI Governance
  INNOVATION_FIRST: '331b2b02-7f8d-4751-b583-16255a6feb50',
  ADAPTIVE_GOV: 'ee10cf4f-025a-47fc-be20-33d6756ec5cd',
  // Domain 1: AI Technical Capabilities
  SCALING: 'c5dcb027-cd27-4c91-adb4-aca780d15199',
}

const enterpriseAIAuthors = [
  {
    name: 'Tobi Lütke',
    header_affiliation: 'Shopify',
    primary_affiliation: 'Shopify, CEO & Founder',
    author_type: 'Industry Leader',
    credibility_tier: 'Pioneer',
    notes: 'Pioneering AI-first company culture. In April 2025, issued landmark memo requiring employees to prove AI cannot do a job before requesting headcount. Making AI usage part of performance reviews.',
    sources: [
      { url: 'https://www.cnbc.com/2025/04/07/shopify-ceo-prove-ai-cant-do-jobs-before-asking-for-more-headcount.html', type: 'News', year: '2025', title: 'Shopify AI Hiring Policy' },
      { url: 'https://techcrunch.com/2025/04/07/shopify-ceo-tells-teams-to-consider-using-ai-before-growing-headcount/', type: 'News', year: '2025', title: 'Shopify AI Memo TechCrunch' },
    ],
    key_quote: 'Reflexive AI usage is now a baseline expectation at Shopify. Before asking for more headcount and resources, teams must demonstrate why they cannot get what they want done using AI.',
    quote_source_url: 'https://www.cnbc.com/2025/04/07/shopify-ceo-prove-ai-cant-do-jobs-before-asking-for-more-headcount.html',
    camps: [
      { camp_id: CAMPS.TECH_LEADS, relevance: 'strong', key_quote: 'What would this area look like if autonomous AI agents were already part of the team?', quote_source_url: 'https://www.cnbc.com/2025/04/07/shopify-ceo-prove-ai-cant-do-jobs-before-asking-for-more-headcount.html', why_it_matters: 'Lütke\'s AI-first hiring policy is the most aggressive enterprise AI mandate from a major tech CEO, requiring proof AI cannot do a job before hiring.' },
      { camp_id: CAMPS.DISPLACEMENT_REALIST, relevance: 'partial', key_quote: 'AI can turn 10X employees into 100X teams. Frankly, I don\'t think it\'s feasible to opt out of learning the skill of applying AI in your craft.', quote_source_url: 'https://techcrunch.com/2025/04/07/shopify-ceo-tells-teams-to-consider-using-ai-before-growing-headcount/', why_it_matters: 'Acknowledges AI will fundamentally change workforce composition while demanding employees adapt or face uncertain futures.' },
    ]
  },
  {
    name: 'Jamie Dimon',
    header_affiliation: 'JPMorgan Chase',
    primary_affiliation: 'JPMorgan Chase, Chairman & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Pioneer',
    notes: 'Leading AI transformation at world\'s largest bank. Invests $12B annually in tech including AI. Employs 2,000+ AI/ML experts. Compares AI impact to printing press, electricity, and internet.',
    sources: [
      { url: 'https://www.cnbc.com/2024/04/08/jamie-dimon-says-ai-may-be-as-impactful-on-humanity-as-printing-press-electricity-and-computers.html', type: 'News', year: '2024', title: 'Dimon AI Impact Statement' },
      { url: 'https://fortune.com/2025/12/07/jamie-dimon-jpmorgan-ai-job-cuts-shorter-week-less-work-worker-assistance/', type: 'News', year: '2025', title: 'Dimon AI Future of Work' },
    ],
    key_quote: 'We are completely convinced the consequences will be extraordinary and possibly as transformational as some of the major technological inventions of the past several hundred years. Think the printing press, the steam engine, electricity, computing and the Internet.',
    quote_source_url: 'https://www.cnbc.com/2024/04/08/jamie-dimon-says-ai-may-be-as-impactful-on-humanity-as-printing-press-electricity-and-computers.html',
    camps: [
      { camp_id: CAMPS.CO_EVOLUTION, relevance: 'strong', key_quote: 'Over time, we anticipate that our use of AI has the potential to augment virtually every job, as well as impact our workforce composition.', quote_source_url: 'https://www.cnbc.com/2024/04/08/jamie-dimon-says-ai-may-be-as-impactful-on-humanity-as-printing-press-electricity-and-computers.html', why_it_matters: 'As CEO of the world\'s largest bank, Dimon\'s view that AI augments rather than replaces jobs shapes enterprise AI adoption in financial services.' },
      { camp_id: CAMPS.HUMAN_AI_COLLAB, relevance: 'strong', key_quote: 'Maybe one day we\'ll be working less hard but having wonderful lives. Government and companies should look at how we phase it in a way that we don\'t damage a lot of people.', quote_source_url: 'https://fortune.com/2025/12/07/jamie-dimon-jpmorgan-ai-job-cuts-shorter-week-less-work-worker-assistance/', why_it_matters: 'Advocates for responsible AI transition that enhances quality of life while protecting workers.' },
    ]
  },
  {
    name: 'Satya Nadella',
    header_affiliation: 'Microsoft',
    primary_affiliation: 'Microsoft, Chairman & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Pioneer',
    notes: 'Architect of Microsoft\'s $80B+ annual AI infrastructure investment. Led OpenAI partnership. Declared the "agent era" has arrived. Pushing company-wide AI urgency.',
    sources: [
      { url: 'https://www.madrona.com/satya-nadella-microsfot-ai-strategy-leadership-culture-computing/', type: 'Interview', year: '2025', title: 'Nadella AI Strategy Interview' },
      { url: 'https://www.digit.in/features/general/satya-nadella-in-2025-5-huge-quotes-by-microsoft-ceo-on-ai-and-future.html', type: 'News', year: '2025', title: 'Nadella 2025 AI Quotes' },
    ],
    key_quote: 'More than any transformation before it, this generation of AI is radically changing every layer of the tech stack, and we are changing with it. Success is not about longevity. It\'s about relevance.',
    quote_source_url: 'https://www.digit.in/features/general/satya-nadella-in-2025-5-huge-quotes-by-microsoft-ceo-on-ai-and-future.html',
    camps: [
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'strong', key_quote: 'The age of agentic AI is here. You can assign tasks to agents and have them execute them, or work side-by-side with AI to complete jobs and projects.', quote_source_url: 'https://www.digit.in/features/general/satya-nadella-in-2025-5-huge-quotes-by-microsoft-ceo-on-ai-and-future.html', why_it_matters: 'Microsoft\'s $80B infrastructure bet and agent-first strategy is reshaping how enterprises think about AI deployment.' },
      { camp_id: CAMPS.TECH_LEADS, relevance: 'strong', key_quote: 'Our growth mindset is essential to our ability to continue leading this AI era. We must be learn-it-alls, willing to experiment, guided by evaluations and committed to continuous improvement.', quote_source_url: 'https://www.madrona.com/satya-nadella-microsfot-ai-strategy-leadership-culture-computing/', why_it_matters: 'Nadella is pushing aggressive AI adoption internally, warning executives that complacency is existential.' },
    ]
  },
  {
    name: 'Marc Benioff',
    header_affiliation: 'Salesforce',
    primary_affiliation: 'Salesforce, Chairman & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Pioneer',
    notes: 'Pioneering enterprise AI agents with Agentforce. Claims AI agents now handle 30-50% of work within Salesforce. Says he will be the last CEO who only manages humans.',
    sources: [
      { url: 'https://www.cnbc.com/2025/10/14/salesforce-ceo-agentforce.html', type: 'News', year: '2025', title: 'Benioff Agentforce CNBC' },
      { url: 'https://www.salesforce.com/news/press-releases/2024/09/12/agentforce-announcement/', type: 'Press Release', year: '2024', title: 'Agentforce Announcement' },
    ],
    key_quote: 'From this point forward, we will be managing not only human workers but also digital workers. When we\'re talking about agents, we\'re talking about digital labor. Now\'s the time that enterprise and AI are coming together to transform, to become new agentic enterprises.',
    quote_source_url: 'https://www.cnbc.com/2025/10/14/salesforce-ceo-agentforce.html',
    camps: [
      { camp_id: CAMPS.TECH_LEADS, relevance: 'strong', key_quote: 'Agentforce represents the Third Wave of AI—advancing beyond copilots to a new era of highly accurate, low-hallucination intelligent agents that actively drive customer success.', quote_source_url: 'https://www.salesforce.com/news/press-releases/2024/09/12/agentforce-announcement/', why_it_matters: 'Benioff\'s "digital labor" framing and rapid Agentforce deployment sets the template for enterprise AI agent adoption.' },
      { camp_id: CAMPS.CO_EVOLUTION, relevance: 'partial', key_quote: 'AI is not destiny. We must choose wisely. We must design intentionally. And we must keep humans at the centre of this revolution.', quote_source_url: 'https://www.cnbc.com/2025/10/14/salesforce-ceo-agentforce.html', why_it_matters: 'Despite aggressive agent deployment, emphasizes human-centered design in enterprise AI transformation.' },
    ]
  },
  {
    name: 'Jensen Huang',
    header_affiliation: 'NVIDIA',
    primary_affiliation: 'NVIDIA, Founder & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Pioneer',
    notes: 'Architect of AI infrastructure revolution. Built NVIDIA into the most valuable company. Envisions AI factories and digital humans as enterprise workforce.',
    sources: [
      { url: 'https://blogs.nvidia.com/blog/computex-2025-jensen-huang/', type: 'Blog', year: '2025', title: 'Computex 2025 Keynote' },
      { url: 'https://fortune.com/2025/10/20/jensen-huang-nvidia-ai-future-workforce-digital-humans-hiring-onboarding-orientation/', type: 'News', year: '2025', title: 'Huang Digital Humans Vision' },
    ],
    key_quote: 'Future workforces in enterprise will be a combination of humans and digital humans. I wouldn\'t be surprised if you license some and you hire some, depending on the quality and depending on the deep expertise.',
    quote_source_url: 'https://fortune.com/2025/10/20/jensen-huang-nvidia-ai-future-workforce-digital-humans-hiring-onboarding-orientation/',
    camps: [
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'strong', key_quote: 'AI is now infrastructure, and this infrastructure, just like the internet, just like electricity, needs factories. These AI data centers are, in fact, AI factories.', quote_source_url: 'https://blogs.nvidia.com/blog/computex-2025-jensen-huang/', why_it_matters: 'Huang\'s "AI factory" paradigm is reshaping how enterprises think about AI infrastructure investment.' },
      { camp_id: CAMPS.DISPLACEMENT_REALIST, relevance: 'partial', key_quote: 'If the world runs out of ideas, then productivity gains translates to job loss. Everybody\'s jobs will be affected. Some jobs will be lost. Many jobs will be created.', quote_source_url: 'https://www.cnn.com/2025/07/11/business/nvidia-jensen-huang-ai-job-loss', why_it_matters: 'Provides nuanced view that job displacement depends on continued innovation, not just AI capability.' },
    ]
  },
  {
    name: 'Arvind Krishna',
    header_affiliation: 'IBM',
    primary_affiliation: 'IBM, Chairman & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Established',
    notes: 'Leading IBM\'s enterprise AI transformation with watsonx platform. Declared "the era of AI experimentation is over" at Think 2025. $6B in generative AI bookings.',
    sources: [
      { url: 'https://www.techrepublic.com/article/news-ibm-think-2025-ai-oracle-partnership/', type: 'News', year: '2025', title: 'IBM Think 2025' },
      { url: 'https://www.constellationr.com/blog-news/insights/ibm-ceo-krishna-now-roi-stage-enterprise-ai', type: 'Analysis', year: '2025', title: 'Krishna ROI Stage' },
    ],
    key_quote: 'The era of AI experimentation is over. Today\'s competitive advantage comes from purpose-built AI integration that drives measurable business outcomes. Ninety-nine percent of all enterprise data has been untouched by AI.',
    quote_source_url: 'https://www.techrepublic.com/article/news-ibm-think-2025-ai-oracle-partnership/',
    camps: [
      { camp_id: CAMPS.BUSINESS_WHISPERERS, relevance: 'strong', key_quote: 'AI has moved from experimentation to unlocking business value. People are now focused on use cases and scaling their businesses with AI.', quote_source_url: 'https://www.constellationr.com/blog-news/insights/ibm-ceo-krishna-now-roi-stage-enterprise-ai', why_it_matters: 'Krishna\'s emphasis on business outcomes over technology experimentation reflects enterprise AI maturity.' },
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'partial', key_quote: 'A billion new applications will be built over the next four years. Agents will form at least a third, if not more, of these applications.', quote_source_url: 'https://www.techrepublic.com/article/news-ibm-think-2025-ai-oracle-partnership/', why_it_matters: 'Positions watsonx as enterprise agent platform with practical 5-minute agent building capability.' },
    ]
  },
  {
    name: 'Andy Jassy',
    header_affiliation: 'Amazon',
    primary_affiliation: 'Amazon, President & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Pioneer',
    notes: 'Leading Amazon\'s AI transformation. AWS AI business growing triple-digit YoY. Committed $100B+ in 2025 capex, majority for AI. Former AWS CEO.',
    sources: [
      { url: 'https://www.aboutamazon.com/news/innovation-at-amazon/amazon-ceo-andy-jassy-ai', type: 'Blog', year: '2025', title: 'Jassy AI Vision' },
      { url: 'https://siliconangle.com/2024/12/05/exclusive-amazon-ceo-andy-jassy-reveals-aws-strategy-building-enterprise-ai-platform/', type: 'Interview', year: '2024', title: 'Jassy AWS AI Strategy' },
    ],
    key_quote: 'This is the biggest change since the cloud and possibly the internet. I think every single customer experience we know of is going to be reinvented with AI. There will be billions of agents, across every company and in every imaginable field.',
    quote_source_url: 'https://www.aboutamazon.com/news/innovation-at-amazon/amazon-ceo-andy-jassy-ai',
    camps: [
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'strong', key_quote: 'You have to build the right set of primitives with SageMaker and Bedrock. You have to have your infrastructure modernized for AI. As fast as cloud has been growing, 85-90% is still on-premises, which is insane.', quote_source_url: 'https://siliconangle.com/2024/12/05/exclusive-amazon-ceo-andy-jassy-reveals-aws-strategy-building-enterprise-ai-platform/', why_it_matters: 'Jassy\'s infrastructure-first approach emphasizes building AI primitives that enterprises can assemble.' },
      { camp_id: CAMPS.HUMAN_AI_COLLAB, relevance: 'partial', key_quote: 'AI will make all our teammates\' jobs more enjoyable, freeing them up from having to do the rote functions that could not previously be automated.', quote_source_url: 'https://www.aboutamazon.com/news/innovation-at-amazon/amazon-ceo-andy-jassy-ai', why_it_matters: 'Frames AI as job enhancement rather than replacement, focusing on eliminating tedious work.' },
    ]
  },
  {
    name: 'Sundar Pichai',
    header_affiliation: 'Alphabet/Google',
    primary_affiliation: 'Alphabet & Google, CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Pioneer',
    notes: 'Leading Google\'s AI transformation with Gemini. 25%+ of Google\'s code now written by AI. Gemini App has 650M+ monthly users. Signed $1B+ cloud deals in Q3 2025.',
    sources: [
      { url: 'https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/google-cloud-next-2025-sundar-pichai-keynote/', type: 'Keynote', year: '2025', title: 'Cloud Next 2025 Keynote' },
      { url: 'https://www.cnbc.com/2024/12/27/google-ceo-pichai-tells-employees-the-stakes-are-high-for-2025.html', type: 'News', year: '2024', title: 'Pichai 2025 Stakes' },
    ],
    key_quote: 'We are firmly in the generative AI era. I think 2025 will be critical. It\'s really important we internalize the urgency of this moment, and need to move faster as a company.',
    quote_source_url: 'https://www.cnbc.com/2024/12/27/google-ceo-pichai-tells-employees-the-stakes-are-high-for-2025.html',
    camps: [
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'strong', key_quote: 'Today all 15 of our half-billion user products—including seven with 2 billion users—are using Gemini models. AI deployed at this scale requires world-class inference.', quote_source_url: 'https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/google-cloud-next-2025-sundar-pichai-keynote/', why_it_matters: 'Demonstrates AI at unprecedented scale—15 products with 500M+ users each running on Gemini.' },
      { camp_id: CAMPS.TECH_LEADS, relevance: 'partial', key_quote: 'Building big, new business is a top priority. We\'ve signed more deals over $1 billion in Q3 than in the previous two years combined.', quote_source_url: 'https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/google-cloud-next-2025-sundar-pichai-keynote/', why_it_matters: 'Enterprise AI adoption accelerating rapidly with billion-dollar deals becoming standard.' },
    ]
  },
  {
    name: 'David Solomon',
    header_affiliation: 'Goldman Sachs',
    primary_affiliation: 'Goldman Sachs, Chairman & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Established',
    notes: 'Leading AI transformation at Goldman Sachs. Revealed AI can draft 95% of an IPO prospectus in minutes vs. 2 weeks with 6-person team. 37% of clients using AI in production.',
    sources: [
      { url: 'https://fortune.com/2025/01/17/goldman-sachs-ceo-david-solomon-ai-tasks-ipo-prospectus-s1-filing-sec/', type: 'News', year: '2025', title: 'Solomon IPO AI' },
      { url: 'https://fortune.com/2025/10/31/goldman-sachs-ceo-ai-opportunity-enormous-there-will-be-winners-and-losers/', type: 'News', year: '2025', title: 'Solomon AI Opportunity' },
    ],
    key_quote: '95% of an S1 filing can be completed by AI in just a few minutes. It used to take a six-person team two weeks. The last 5% now matters because the rest is now a commodity.',
    quote_source_url: 'https://fortune.com/2025/01/17/goldman-sachs-ceo-david-solomon-ai-tasks-ipo-prospectus-s1-filing-sec/',
    camps: [
      { camp_id: CAMPS.TECH_LEADS, relevance: 'strong', key_quote: 'When you put these tools in the hands of smart people, it increases their productivity. You\'re going to see changes in the way analysts, associates and investment bankers work.', quote_source_url: 'https://fortune.com/2025/01/17/goldman-sachs-ceo-david-solomon-ai-tasks-ipo-prospectus-s1-filing-sec/', why_it_matters: 'Concrete case study of 95%+ efficiency gains in complex knowledge work at a leading investment bank.' },
      { camp_id: CAMPS.BUSINESS_WHISPERERS, relevance: 'partial', key_quote: 'The opportunity set with AI is enormous. There will be winners and losers, and it\'s hard to pick them now. A lot of the capital being deployed will not produce adequate returns.', quote_source_url: 'https://fortune.com/2025/10/31/goldman-sachs-ceo-ai-opportunity-enormous-there-will-be-winners-and-losers/', why_it_matters: 'Provides pragmatic investment banker perspective on AI winners/losers and ROI uncertainty.' },
    ]
  },
  {
    name: 'Brian Moynihan',
    header_affiliation: 'Bank of America',
    primary_affiliation: 'Bank of America, Chairman & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Established',
    notes: 'Leads $13B annual tech investment at BofA. Nearly all 210,000 employees use Erica AI assistant. 17,000 programmers using AI coding tools. Advocates "augmented intelligence" approach.',
    sources: [
      { url: 'https://fortune.com/2025/11/07/bank-of-america-ceo-ai-deployed-across-entire-workforce-to-drive-growth-productivity/', type: 'News', year: '2025', title: 'Moynihan AI Deployment' },
      { url: 'https://www.pymnts.com/artificial-intelligence-2/2025/bank-of-america-ceo-says-ai-is-transforming-how-banks-work', type: 'News', year: '2025', title: 'Moynihan AI Transformation' },
    ],
    key_quote: 'These aren\'t theoretical applications that prove the concept you\'re reading about in the press. These are tendered tools applied to real-life activities that already help us personalize client experiences, streamline capabilities, and identify new opportunities.',
    quote_source_url: 'https://fortune.com/2025/11/07/bank-of-america-ceo-ai-deployed-across-entire-workforce-to-drive-growth-productivity/',
    camps: [
      { camp_id: CAMPS.HUMAN_AI_COLLAB, relevance: 'strong', key_quote: 'We\'ll be applying more and more of augmented intelligence—a person using AI to be more effective. I don\'t really want to say to people, I can see this taking our overall headcount down.', quote_source_url: 'https://fortune.com/2025/11/07/bank-of-america-ceo-ai-deployed-across-entire-workforce-to-drive-growth-productivity/', why_it_matters: 'Moynihan\'s "augmented intelligence" framing prioritizes human enhancement over replacement at massive scale.' },
      { camp_id: CAMPS.CO_EVOLUTION, relevance: 'strong', key_quote: 'Fifteen years ago we had 100,000 people in Consumer Business; today we have 53,000. Deposits went from $400B to $900B. All that is enabled by application of technology at scale.', quote_source_url: 'https://diginomica.com/we-have-debate-future-bank-america-ceo-brian-moynihan-organizations-bid-scale-ai-size-matters', why_it_matters: 'Demonstrates how AI enables doing more with fewer people while growing business—a practical co-evolution model.' },
    ]
  },
  {
    name: 'Jane Fraser',
    header_affiliation: 'Citigroup',
    primary_affiliation: 'Citigroup, CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Established',
    notes: 'Leading Citi\'s AI transformation with $2.4B quarterly tech investment. AI tools perform coding work that took 1.5 weeks in minutes. 740,000 automated code reviews weekly.',
    sources: [
      { url: 'https://www.ciodive.com/news/citigroup-data-compliance-modernization-generative-ai/745683/', type: 'News', year: '2025', title: 'Citi AI Productivity' },
      { url: 'https://fosterfletcher.com/spotlight-on-citis-ai-journey-navigating-complexity-under-ceo-jane-fraser/', type: 'Analysis', year: '2025', title: 'Citi AI Journey' },
    ],
    key_quote: 'We\'ve seen AI technology perform coding work that used to take top developers a week and a half to do in just minutes. I\'m not sure any bank finishes its modernization—we are integrating AI directly into our business operations.',
    quote_source_url: 'https://www.ciodive.com/news/citigroup-data-compliance-modernization-generative-ai/745683/',
    camps: [
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'strong', key_quote: 'Agentic AI, Citi\'s in-house autonomous development framework, is now in production. Two proprietary generative AI tools saw a 5x sequential increase in usage.', quote_source_url: 'https://www.ciodive.com/news/citigroup-data-compliance-modernization-generative-ai/745683/', why_it_matters: 'Building proprietary AI infrastructure rather than relying solely on vendors—a key enterprise AI strategy.' },
      { camp_id: CAMPS.CO_EVOLUTION, relevance: 'partial', key_quote: 'The transformation reverses historic underinvestment in Citi\'s infrastructure. It\'s a strategic overhaul that goes well beyond compliance to simplify and strengthen Citi.', quote_source_url: 'https://fosterfletcher.com/spotlight-on-citis-ai-journey-navigating-complexity-under-ceo-jane-fraser/', why_it_matters: 'Shows how AI transformation can address both technical debt and organizational modernization simultaneously.' },
    ]
  },
  {
    name: 'Thomas Kurian',
    header_affiliation: 'Google Cloud',
    primary_affiliation: 'Google Cloud, CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Established',
    notes: 'Leading Google Cloud\'s enterprise AI strategy. Vertex AI customers up 5x YoY. Emphasizes platform over model selection. Identifies why enterprise AI projects fail.',
    sources: [
      { url: 'https://stratechery.com/2024/an-interview-with-google-cloud-ceo-thomas-kurian-about-googles-enterprise-ai-strategy/', type: 'Interview', year: '2024', title: 'Kurian Stratechery Interview' },
      { url: 'https://www.bigtechnology.com/p/google-cloud-ceo-thomas-kurian-on-ecd', type: 'Interview', year: '2024', title: 'Kurian Big Technology' },
    ],
    key_quote: 'As enterprises move AI from proof-of-concepts into production, they want not to choose a model, but they want a platform. AI will amplify humans, not replace them.',
    quote_source_url: 'https://www.bigtechnology.com/p/google-cloud-ceo-thomas-kurian-on-ecd',
    camps: [
      { camp_id: CAMPS.BUSINESS_WHISPERERS, relevance: 'strong', key_quote: 'Three primary reasons enterprise AI projects fail: poor architectural design, dirty data, and a lack of testing regarding security and model compromise.', quote_source_url: 'https://www.bigtechnology.com/p/google-cloud-ceo-thomas-kurian-on-ecd', why_it_matters: 'Provides actionable failure modes for enterprise AI projects from the perspective of serving thousands of enterprise customers.' },
      { camp_id: CAMPS.HUMAN_AI_COLLAB, relevance: 'partial', key_quote: 'AI will amplify humans, not replace them. CEOs\' top focus for 2025 is speed and agility—the powerful pairing that AI enables.', quote_source_url: 'https://cloudwars.com/innovation-leadership/ceos-top-focus-for-2025-is-speed-and-agility-says-google-clouds-thomas-kurian/', why_it_matters: 'Frames AI as amplification tool rather than replacement, emphasizing organizational agility.' },
    ]
  },
  {
    name: 'Matt Garman',
    header_affiliation: 'AWS',
    primary_affiliation: 'Amazon Web Services, CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Established',
    notes: 'Became AWS CEO in June 2024. Declared "agents are the new cloud" and "the campus is the new computer." Predicts 80-90% of enterprise AI value from agents.',
    sources: [
      { url: 'https://siliconangle.com/2025/12/02/exclusive-aws-ceo-matt-garman-declares-new-era-agents-new-cloud/', type: 'Interview', year: '2025', title: 'Garman Agents New Cloud' },
      { url: 'https://www.itpro.com/technology/artificial-intelligence/aws-ceo-matt-garman-says-ai-agents-are-going-to-have-as-much-impact-on-your-business-as-the-internet-or-cloud', type: 'News', year: '2025', title: 'Garman AI Agents Impact' },
    ],
    key_quote: 'The next 80% to 90% of enterprise AI value will come from agents. These aren\'t chatbots or copilots—they are autonomous, long-running, massively scalable digital workers that operate for hours or days.',
    quote_source_url: 'https://siliconangle.com/2025/12/02/exclusive-aws-ceo-matt-garman-declares-new-era-agents-new-cloud/',
    camps: [
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'strong', key_quote: 'Every single customer experience, every single company, frankly every single industry, is now in the process of being reinvented. The campus is the new computer.', quote_source_url: 'https://siliconangle.com/2025/12/02/exclusive-aws-ceo-matt-garman-declares-new-era-agents-new-cloud/', why_it_matters: 'Reframes enterprise infrastructure around agents and campus-scale computing rather than traditional cloud.' },
      { camp_id: CAMPS.HUMAN_AI_COLLAB, relevance: 'partial', key_quote: 'Replacing junior developers with AI is the dumbest thing I\'ve ever heard. They\'re the least expensive and most leaned into AI tools. How\'s that going to work when you have no one who has learned anything?', quote_source_url: 'https://www.webpronews.com/aws-ceo-ai-shifts-focus-from-hiring-developers-to-idea-generation/', why_it_matters: 'Pushes back against naive AI replacement narratives with pragmatic workforce development view.' },
    ]
  },
  {
    name: 'Julie Sweet',
    header_affiliation: 'Accenture',
    primary_affiliation: 'Accenture, Chair & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Established',
    notes: 'Leading 770,000-employee consulting firm through AI transformation. $3B in gen AI bookings FY2024. Emphasizes CEOs must deeply understand AI to capture value.',
    sources: [
      { url: 'https://time.com/collection/davos-2024-ideas-of-the-year/6551982/accenture-ceo-julie-sweet-ai/', type: 'Article', year: '2024', title: 'Sweet Davos AI' },
      { url: 'https://fortune.com/2025/08/31/accenture-ceo-julie-sweet-ai-advice-success/', type: 'News', year: '2025', title: 'Sweet AI Advice' },
    ],
    key_quote: 'AI is a technology where the CEO and senior business leaders really need to understand the technology in order to get the value out of it. It really is the marriage of business and technology that gets the value.',
    quote_source_url: 'https://time.com/collection/davos-2024-ideas-of-the-year/6551982/accenture-ceo-julie-sweet-ai/',
    camps: [
      { camp_id: CAMPS.BUSINESS_WHISPERERS, relevance: 'strong', key_quote: 'There\'s no playbook for generative AI. We all have to give each other a little grace, as this is certainly a great adventure. Leaders must make their own version of deep learning a priority.', quote_source_url: 'https://time.com/collection/davos-2024-ideas-of-the-year/6551982/accenture-ceo-julie-sweet-ai/', why_it_matters: 'Sweet\'s emphasis on CEO AI literacy reflects the shift from IT project to C-suite strategic priority.' },
      { camp_id: CAMPS.CO_EVOLUTION, relevance: 'strong', key_quote: 'We have a culture of progress over perfection. When you have that culture, you provide the safety to move quickly, to be able to make mistakes, and that is a deep part of our DNA.', quote_source_url: 'https://fortune.com/2025/11/13/accenture-ceo-julie-sweet-leadership-reinventor-skill-ai/', why_it_matters: 'Advocates for organizational culture that enables rapid AI experimentation and learning.' },
    ]
  },
  {
    name: 'Christian Klein',
    header_affiliation: 'SAP',
    primary_affiliation: 'SAP, CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Established',
    notes: 'Leading SAP\'s transformation into cloud and AI company. Goal to be "#1 enterprise application and business AI company." 30,000+ customers using SAP Business AI.',
    sources: [
      { url: 'https://stratechery.com/2025/an-interview-with-sap-ceo-christian-klein-about-enterprise-ai/', type: 'Interview', year: '2025', title: 'Klein Stratechery Interview' },
      { url: 'https://www.cio.com/article/2138837/sap-ceo-christian-klein-everything-we-do-contains-ai.html', type: 'Interview', year: '2025', title: 'Klein Everything AI' },
    ],
    key_quote: 'Today, there is no C-level discussion without AI. You can work with SAP software via human language—you feel the productivity which is now embedded in the solutions. The ambition is to make every Joule user 30% more efficient by end of 2025.',
    quote_source_url: 'https://www.cio.com/article/2138837/sap-ceo-christian-klein-everything-we-do-contains-ai.html',
    camps: [
      { camp_id: CAMPS.BUSINESS_WHISPERERS, relevance: 'strong', key_quote: 'Business AI will indeed revolutionize how companies run. We make sure you can quote more intelligent, sell more, price more effectively, and run all fulfillment processes more productive.', quote_source_url: 'https://cloudwars.com/ai/sap-ceo-klein-business-ai-will-make-intelligent-enterprise-a-reality-in-2024/', why_it_matters: 'SAP\'s position at the heart of enterprise operations gives Klein unique insight into practical business AI applications.' },
      { camp_id: CAMPS.CO_EVOLUTION, relevance: 'partial', key_quote: 'Three key elements: embedding AI into your business, upskilling your people, and taking a holistic approach. Over 20,000 SAP developers use AI-powered tools with average efficiency gains above 20%.', quote_source_url: 'https://www.sap.com/integrated-reports/2024/en/letter-from-the-ceo.html', why_it_matters: 'Demonstrates concrete internal AI adoption metrics that enterprise customers can use as benchmarks.' },
    ]
  },
  {
    name: 'Larry Fink',
    header_affiliation: 'BlackRock',
    primary_affiliation: 'BlackRock, Chairman & CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Pioneer',
    notes: 'CEO of world\'s largest asset manager ($10T+ AUM). Leads BlackRock AI Infrastructure Partnership investing $30B+ in AI data centers. Started AI lab at Stanford in 2018.',
    sources: [
      { url: 'https://www.blackrock.com/corporate/investor-relations/larry-fink-annual-chairmans-letter', type: 'Letter', year: '2025', title: 'Fink 2025 Letter' },
      { url: 'https://www.cnbc.com/video/2025/10/14/blackrock-ceo-larry-fink-we-as-country-need-massive-investments-in-ai.html', type: 'Video', year: '2025', title: 'Fink AI Investment' },
    ],
    key_quote: 'AI will totally transform the business world, the corporate world. If we continue to drive more productivity, it also means rising wages—people do more, and the whole organization is doing more with less people.',
    quote_source_url: 'https://www.bloomberg.com/news/articles/2024-04-12/blackrock-ceo-larry-fink-says-ai-will-boost-productivity-worker-pay',
    camps: [
      { camp_id: CAMPS.TECH_LEADS, relevance: 'strong', key_quote: 'We as a country need massive investments in AI. The capex needed for AI infrastructure is only going to grow. You have six or seven large companies spending $350 billion this year on AI infrastructure.', quote_source_url: 'https://www.cnbc.com/video/2025/10/14/blackrock-ceo-larry-fink-we-as-country-need-massive-investments-in-ai.html', why_it_matters: 'Fink\'s view on AI infrastructure as national priority and investment opportunity shapes capital allocation across markets.' },
      { camp_id: CAMPS.INNOVATION_FIRST, relevance: 'partial', key_quote: 'AI is a strategic necessity for the United States to maintain its global leadership. AI investment is not merely an investment bubble, but critical infrastructure.', quote_source_url: 'https://fortune.com/2025/10/15/blackrocks-40-billion-deal-highlights-the-unstoppable-ai-data-center-gold-rush-as-ceo-larry-fink-pushes-back-on-ai-bubble-fears/', why_it_matters: 'Positions AI as geopolitical priority, not just business opportunity, influencing policy and investment.' },
    ]
  },
  {
    name: 'Tim Cook',
    header_affiliation: 'Apple',
    primary_affiliation: 'Apple, CEO',
    author_type: 'Industry Leader',
    credibility_tier: 'Pioneer',
    notes: 'Leading Apple Intelligence initiative. Compares AI to click wheel and touch interface as breakthrough moment. Investing significantly in AI while emphasizing privacy-first approach.',
    sources: [
      { url: 'https://fortune.com/2024/10/21/tim-cook-defends-apple-coming-late-to-ai-with-four-words/', type: 'News', year: '2024', title: 'Cook AI Defense' },
      { url: 'https://www.bloomberg.com/news/articles/2025-08-01/apple-ceo-tells-staff-ai-is-ours-to-grab-in-hourlong-pep-talk', type: 'News', year: '2025', title: 'Cook AI Pep Talk' },
    ],
    key_quote: 'We see AI as one of the most profound technologies of our lifetime. Apple must do this. Apple will do this. This is ours to grab. We\'ve rarely been first. There was a smartphone before the iPhone; there were tablets before the iPad.',
    quote_source_url: 'https://www.bloomberg.com/news/articles/2025-08-01/apple-ceo-tells-staff-ai-is-ours-to-grab-in-hourlong-pep-talk',
    camps: [
      { camp_id: CAMPS.ADAPTIVE_GOV, relevance: 'strong', key_quote: 'Right now the technology is good enough where we can deliver it to people and change their lives. There\'s so much extraordinary benefit for humanity. Are there some things you have to have guardrails on? Of course.', quote_source_url: 'https://www.wired.com/story/tim-cook-interview-apple-intelligence/', why_it_matters: 'Apple\'s privacy-first AI approach offers alternative model to cloud-first strategies of competitors.' },
      { camp_id: CAMPS.CO_EVOLUTION, relevance: 'partial', key_quote: 'The AI revolution is as big or bigger as the internet, smartphones, cloud computing and apps. We\'re embedding it across our devices and platforms and across the company.', quote_source_url: 'https://www.bloomberg.com/news/articles/2025-08-01/apple-ceo-tells-staff-ai-is-ours-to-grab-in-hourlong-pep-talk', why_it_matters: 'Demonstrates how even late entrants can shape enterprise AI by emphasizing integration and user experience.' },
    ]
  },
  {
    name: 'Mustafa Suleyman',
    header_affiliation: 'Microsoft AI',
    primary_affiliation: 'Microsoft AI, CEO; DeepMind Co-founder',
    author_type: 'Industry Leader',
    credibility_tier: 'Pioneer',
    notes: 'Co-founded DeepMind. Joined Microsoft as AI CEO in 2024. Leading new Superintelligence Team focused on "Humanist Superintelligence." Emphasizes safety with capability.',
    sources: [
      { url: 'https://fortune.com/2025/11/06/microsoft-launches-new-ai-humanist-superinteligence-team-mustafa-suleyman-openai/', type: 'News', year: '2025', title: 'Suleyman Humanist Superintelligence' },
      { url: 'https://www.bloomberg.com/features/2025-mustafa-suleyman-weekend-interview/', type: 'Interview', year: '2025', title: 'Suleyman Bloomberg Interview' },
    ],
    key_quote: 'Humanist superintelligence is advanced AI designed to remain controllable, aligned, and firmly in service to humanity. We reject narratives about a race to AGI, and instead see it as part of a wider and deeply human endeavor.',
    quote_source_url: 'https://fortune.com/2025/11/06/microsoft-launches-new-ai-humanist-superinteligence-team-mustafa-suleyman-openai/',
    camps: [
      { camp_id: CAMPS.ADAPTIVE_GOV, relevance: 'strong', key_quote: 'We won\'t continue to develop a system that has the potential to run away from us. We reject binaries of boom and doom; we\'re in this for the long haul to deliver tangible, specific, safe benefits.', quote_source_url: 'https://fortune.com/2025/11/06/microsoft-launches-new-ai-humanist-superinteligence-team-mustafa-suleyman-openai/', why_it_matters: 'Suleyman\'s "humanist superintelligence" framework offers pragmatic middle ground between acceleration and pause.' },
      { camp_id: CAMPS.TECH_BUILDERS, relevance: 'partial', key_quote: 'Staying competitive in frontier AI will require hundreds of billions of dollars over the next five to 10 years. Microsoft needs to be self-sufficient in AI.', quote_source_url: 'https://www.bloomberg.com/features/2025-mustafa-suleyman-weekend-interview/', why_it_matters: 'Articulates massive infrastructure requirements for enterprise-scale AI development.' },
    ]
  },
  {
    name: 'Andrew Ng',
    header_affiliation: 'AI Fund',
    primary_affiliation: 'AI Fund, Managing General Partner; Stanford; Landing AI Founder',
    author_type: 'Academic',
    credibility_tier: 'Pioneer',
    notes: 'Co-founded Google Brain, led Baidu AI. Pioneer of MOOCs with 8M+ learners. Founded Landing AI for manufacturing. Emphasizes data-centric AI and agentic workflows.',
    sources: [
      { url: 'https://www.cxotalk.com/episode/andrew-ng-explains-enterprise-ai-strategy', type: 'Interview', year: '2024', title: 'Ng Enterprise AI Strategy' },
      { url: 'https://news.futunn.com/en/post/66782571/andrew-ng-s-year-end-summary-2025-may-be-remembered', type: 'Article', year: '2025', title: 'Ng 2025 Year-End Summary' },
    ],
    key_quote: 'The next wave for AI will be to transform all other industries—manufacturing, agriculture, transportation, logistics, travel, and healthcare. A lot of companies underestimate the change management aspects of rolling out this very disruptive technology.',
    quote_source_url: 'https://www.cxotalk.com/episode/andrew-ng-explains-enterprise-ai-strategy',
    camps: [
      { camp_id: CAMPS.CO_EVOLUTION, relevance: 'strong', key_quote: 'Govern applications, not technology. Automate tasks, not jobs. In order for AI to become widespread, there\'s work needed to adapt this to different industries and figure out how to scope and manage projects.', quote_source_url: 'https://www.cxotalk.com/episode/andrew-ng-explains-enterprise-ai-strategy', why_it_matters: 'Ng\'s "automate tasks, not jobs" principle shapes responsible enterprise AI adoption strategy.' },
      { camp_id: CAMPS.BUSINESS_WHISPERERS, relevance: 'strong', key_quote: 'If there\'s one thing in AI that you should pay attention to, it\'s Agentic AI. Manufacturing problems often have dozens or hundreds of data points—LandingLens is designed to work even on these small data problems.', quote_source_url: 'https://venturebeat.com/ai/andrew-ng-and-landing-ai-seek-to-democratize-ai-for-all-company-sizes-drive-wider-industry-adoption', why_it_matters: 'Addresses practical challenge of enterprise AI with limited data, common outside tech sector.' },
    ]
  },
  {
    name: 'Erik Brynjolfsson',
    header_affiliation: 'Stanford',
    primary_affiliation: 'Stanford Digital Economy Lab, Director; MIT',
    author_type: 'Academic',
    credibility_tier: 'Field Leader',
    notes: 'Leading researcher on AI\'s economic impact. Documented "productivity J-curve" explaining lag between AI adoption and economic gains. Co-author of "The Second Machine Age."',
    sources: [
      { url: 'https://www.microsoft.com/en-us/worklab/podcast/stanford-professor-erik-brynjolfsson-on-how-ai-will-transform-productivity', type: 'Podcast', year: '2025', title: 'Brynjolfsson Productivity' },
      { url: 'https://www.hbs.edu/managing-the-future-of-work/podcast/Pages/podcast-details.aspx?episode=9166436185', type: 'Podcast', year: '2025', title: 'Brynjolfsson HBS Podcast' },
    ],
    key_quote: 'AI won\'t replace managers, but managers who use AI will replace those who don\'t. If we play our cards right, the next decade could be some of the best 10 years ever in human history.',
    quote_source_url: 'https://sternstrategy.com/speakers/erik-brynjolfsson/',
    camps: [
      { camp_id: CAMPS.CO_EVOLUTION, relevance: 'strong', key_quote: 'Early studies found productivity gains of 15-50% for customer service agents, software engineers, and managers, but these micro-level benefits have not yet translated to economy-wide productivity growth.', quote_source_url: 'https://mitsloan.mit.edu/ideas-made-to-matter/a-calm-ai-productivity-storm', why_it_matters: 'The "productivity J-curve" explains why enterprise AI ROI takes time and requires organizational change.' },
      { camp_id: CAMPS.HUMAN_AI_COLLAB, relevance: 'strong', key_quote: 'The future of work should be one of reorganization, not replacement. Machine learning technology without management and organizational change will be ineffective.', quote_source_url: 'https://ide.mit.edu/insights/fixing-the-ai-skills-shortage-an-interview-with-erik-brynjolfsson/', why_it_matters: 'Academic validation that AI transformation requires complementary organizational transformation.' },
    ]
  },
  {
    name: 'Clara Durodié',
    header_affiliation: 'Cognitive Finance',
    primary_affiliation: 'Cognitive Finance Group, CEO; Author',
    author_type: 'Industry Leader',
    credibility_tier: 'Domain Expert',
    notes: 'Author of "Decoding AI in Financial Services" guidebook for boards and C-suite. Chair of Non-Executive Directors AI adoption committee (UK). Member of IEEE AI Ethics Initiative.',
    sources: [
      { url: 'https://www.clara-durodie.com/about', type: 'Website', year: '2025', title: 'Durodié About' },
      { url: 'https://delano.lu/article/clara-durodie-ai-regulations-h', type: 'Interview', year: '2024', title: 'Durodié AI Regulations' },
    ],
    key_quote: 'Contrary to popular belief, AI is not about increasing productivity and cost-cutting. The primary objective of artificial intelligence is business growth. When AI hallucinates, the regulators are not pleased. And they shouldn\'t be.',
    quote_source_url: 'https://delano.lu/article/clara-durodie-ai-regulations-h',
    camps: [
      { camp_id: CAMPS.BUSINESS_WHISPERERS, relevance: 'strong', key_quote: 'AI is an amplifier. It has the force to magnify what it finds in the data—and this alone brings significant risks. The ability to understand and explain AI decisions becomes very important.', quote_source_url: 'https://delano.lu/article/clara-durodie-ai-regulations-h', why_it_matters: 'Provides board-level perspective on AI governance, risk, and the "AI FOMO" driving hasty adoption.' },
      { camp_id: CAMPS.ADAPTIVE_GOV, relevance: 'strong', key_quote: 'AI regulations have been pouring down, and that\'s a good thing. Fear of missing out on AI benefits is a danger—the pressure on boards often resembles hysteria rather than innovation.', quote_source_url: 'https://delano.lu/article/clara-durodie-ai-regulations-h', why_it_matters: 'Unique voice advocating for thoughtful, regulated AI adoption in financial services boardrooms.' },
    ]
  },
]

async function addAuthors() {
  console.log('\n🏢 Adding Enterprise AI Thought Leaders...\n')
  console.log('='.repeat(60))

  let added = 0
  let skipped = 0
  let failed = 0

  for (const author of enterpriseAIAuthors) {
    // Check if author exists
    const { data: existing } = await supabase
      .from('authors')
      .select('id')
      .eq('name', author.name)
      .single()

    if (existing) {
      console.log(`⏭️  ${author.name} already exists`)
      skipped++
      continue
    }

    // Add author
    const { data: newAuthor, error: authorError } = await supabase
      .from('authors')
      .insert({
        name: author.name,
        header_affiliation: author.header_affiliation,
        primary_affiliation: author.primary_affiliation,
        author_type: author.author_type,
        credibility_tier: author.credibility_tier,
        notes: author.notes,
        sources: author.sources,
        key_quote: author.key_quote,
        quote_source_url: author.quote_source_url,
      })
      .select('id')
      .single()

    if (authorError) {
      console.error(`❌ Failed to add ${author.name}:`, authorError.message)
      failed++
      continue
    }

    // Add camp relationships
    let campCount = 0
    for (const camp of author.camps) {
      const { error: campError } = await supabase
        .from('camp_authors')
        .insert({
          author_id: newAuthor.id,
          camp_id: camp.camp_id,
          relevance: camp.relevance,
          key_quote: camp.key_quote,
          quote_source_url: camp.quote_source_url,
          why_it_matters: camp.why_it_matters,
        })

      if (campError && !campError.message.includes('duplicate')) {
        console.error(`  ⚠️  Failed to add camp for ${author.name}:`, campError.message)
      } else {
        campCount++
      }
    }

    console.log(`✅ Added ${author.name} (${author.header_affiliation}) - ${campCount} camp(s)`)
    added++
  }

  console.log('\n' + '='.repeat(60))
  console.log(`📊 Summary: ${added} added, ${skipped} skipped, ${failed} failed`)
  console.log(`📈 Total enterprise AI authors processed: ${enterpriseAIAuthors.length}`)
}

async function main() {
  console.log('🚀 ENTERPRISE AI THOUGHT LEADERS')
  console.log('Focus: C-Suite executives, business practitioners, real-world case studies')
  console.log('='.repeat(60))

  await addAuthors()

  console.log('\n✅ Setup complete!')
}

main().catch(console.error)
