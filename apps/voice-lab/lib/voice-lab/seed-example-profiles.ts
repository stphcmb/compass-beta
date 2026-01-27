/**
 * Voice Lab - Example Profile Seeds
 *
 * Ready-to-use voice profiles based on best-in-class B2B writing:
 * 1. Technical Clarity - Stripe/Linear style
 * 2. Friendly Expert - Notion/Mailchimp style
 * 3. Enterprise Persuader - Salesforce/Intercom style
 * 4. Thought Leader - Newsletter/CEO voice
 * 5. Case Study Writer - Gong/Slack customer stories
 *
 * COMING SOON:
 * - LinkedIn Creator (Chris Walker, Dave Gerhardt style)
 * - Data Storyteller (McKinsey, Gartner style)
 * - Product Launcher (Figma, Linear changelog style)
 */

import { createVoiceProfile, createVoiceSamples, updateProfileCounts, updateTrainingStatus } from './index'
import { extractInsightsFromSample } from './insight-extractor'
import { mergeInsights, getInsightCount } from './insight-store'

// ============================================================================
// Profile 1: Technical Clarity (Stripe/Linear style)
// ============================================================================

const TECHNICAL_CLARITY_SAMPLES = [
  {
    content: `Explore our guides and examples to integrate Stripe. Accept payments online. Build a payment form or use a prebuilt checkout page to accept online payments. Sell subscriptions. Create and manage subscriptions for recurring payments. Offer usage-based pricing. Meter and charge customers based on their usage. Set up in-person payments. Accept payments in person using Terminal. Send invoices. Create and send invoices for one-time or recurring payments. Set up a customer portal. Let customers manage their billing information. Automate revenue recognition. Account for revenue in accordance with ASC 606 and IFRS 15.`,
    category: 'documentation' as const,
    notes: 'Stripe docs - task-based, minimal prose',
  },
  {
    content: `Linear is a purpose-built tool for planning and building products. Streamline issues, projects, and product roadmaps. Linear is shaped by the practices and principles that distinguish world-class product teams from the rest: relentless focus, fast execution, and a commitment to the quality of craft. Designed to move fast. Crafted to perfection. Purpose-built for product development.`,
    category: 'marketing' as const,
    notes: 'Linear homepage - confident, opinionated',
  },
  {
    content: `There is a lost art of building true quality software. To bring back the right focus, here are the foundational ideas Linear is built on. Quality is a product of both team talent AND psychological safety during the creation process. Product direction with projects and initiatives. Useful goal-setting. Prioritizing enablers and blockers. Scoping projects appropriately. Generating momentum in teams. Writing issues instead of user stories. Managing design projects deliberately. Building alongside users. Continuous launching and public iteration.`,
    category: 'documentation' as const,
    notes: 'Linear Method - philosophical, principled',
  },
]

// ============================================================================
// Profile 2: Friendly Expert (Notion/Mailchimp style)
// ============================================================================

const FRIENDLY_EXPERT_SAMPLES = [
  {
    content: `One workspace. Zero busywork. Notion is where your teams and AI agents capture knowledge, find answers, and automate projects. Now a team of 7 feels like 70. You assign the tasks. Your Notion Agent does the work. One search for everything. Perfect notes, every time. Manage any project, big or small. More productivity. Fewer tools.`,
    category: 'marketing' as const,
    notes: 'Notion homepage - conversational, empowering',
  },
  {
    content: `All-in-one AI that takes notes, searches apps, and builds workflows, right where you work. Most AI tools stop at ideas. Notion AI gets work across the finish line. Handles your data with discretion. Trusted by enterprise. Your Notion Agent can build, edit, and take action. No more waiting for replies. Just ask Notion AI.`,
    category: 'marketing' as const,
    notes: 'Notion AI - approachable, practical',
  },
  {
    content: `Win customers with the #1 email marketing and automations platform. Grow your revenue with targeted and engaging emails that get more customers to open, click, and buy. See up to 4x more orders by creating automations with our Customer Journey Builder. Our >99% delivery rate is one of the highest in the industry. We'll take care of the technical stuff so your team can see a higher return on your strategy.`,
    category: 'marketing' as const,
    notes: 'Mailchimp - friendly authority, quantified',
  },
]

// ============================================================================
// Profile 3: Enterprise Persuader (Salesforce/Intercom style)
// ============================================================================

const ENTERPRISE_PERSUADER_SAMPLES = [
  {
    content: `Grow pipeline and close bigger deals, faster. AI agents engage leads, automate busywork, and drive operational efficiency. Sales Cloud's sales force automation software helps companies sell smarter, faster, and more efficiently by providing everything your sales teams need on one integrated platform.`,
    category: 'marketing' as const,
    notes: 'Salesforce - outcomes-driven',
  },
  {
    content: `AI and automation are built in and designed to easily scale as you grow. Organizations can deliver end-to-end revenue management across the entire customer lifecycle. Automate routine tasks so sales teams can focus on closing deals. Capture, track, and prioritize leads for higher conversion rates. Centralize data and automate workflows for faster deal closures.`,
    category: 'marketing' as const,
    notes: 'Salesforce - scalability focus',
  },
  {
    content: `Intercom is the AI customer service company. Fin is the leading AI Agent for customer service delivering the highest quality answers and handling the most complex queries. One seamless customer service suite that delivers faster response times, more efficient agents, and a single consolidated view of customer service.`,
    category: 'marketing' as const,
    notes: 'Intercom - leadership claims',
  },
]

// ============================================================================
// Profile 4: Thought Leader (Newsletter/CEO style)
// ============================================================================

const THOUGHT_LEADER_SAMPLES = [
  {
    content: `Gusto's Path to Product-Market Fit — How Listening to Customers Built a $9.6B Company. Cold-calling from a walk-in closet taught the founder how to recognize what PMF really feels like. You'll know you understand the customer problem enough when you can predict 75% of what a customer tells you. Canva's Path to Product-Market Fit — How a Two-Hour Founder Date Led To a $42B Design Platform. Going deep on finding early evangelists, the unconventional tactics that led to massive growth, and more.`,
    category: 'blog' as const,
    notes: 'First Round Review - tactical deep-dives',
  },
  {
    content: `National Service: Reveals decision-making framework: I've struggled my whole life with being right vs. being effective—positioning pragmatism over ideology. Combines personal narrative vulnerability with macro-trend analysis and contrarian takes. Establishes credibility through self-disclosure, then scales to systemic implications. The voice is accessible yet intellectually rigorous—designed for executive audiences who appreciate both data and directness.`,
    category: 'email' as const,
    notes: 'Prof G - vulnerability + macro trends',
  },
  {
    content: `How to Do Great Work. How to Start a Startup. Do Things that Don't Scale. Startup = Growth. The 18 Mistakes That Kill Startups. Life is Short. How to Think for Yourself. Putting Ideas into Words. Write Simply. The essays distill complex startup wisdom into clear, memorable principles. The voice is thoughtful, direct, and grounded in first-hand experience building and funding companies.`,
    category: 'blog' as const,
    notes: 'Paul Graham - clear principles',
  },
]

// ============================================================================
// Profile 5: Case Study Writer (Gong/Slack style)
// ============================================================================

const CASE_STUDY_SAMPLES = [
  {
    content: `A Google sales team got hours of its time back. Our partnership with Gong was that piece of magic we needed; it's been complementary to how we evaluate our performance. At every level of our org, we now have a standardized view of our sales data, and having that is a game-changer. — Mike Chen, Director of Product Strategy, Google. Alignment across RevOps and reps brings Frontify a 30% increase in lead conversion. DocuSign selects Gong Revenue AI Operating System to drive strategic growth.`,
    category: 'case-study' as const,
    notes: 'Gong - customer voice, specific metrics',
  },
  {
    content: `From Cliffside Stunts to Human Canons: How Beast Industries Gets Each Million-View Shot With Slack. Rivian Powers Cutting-Edge EV Innovation with Slack. Scaling Smarter: Anthropic Saves Millions and Moves Faster with Slack. How Box Uses Slack to Cut Meetings and Accelerate Deals. 338% return on investment. $2.1 million in productivity savings. 85% report improved communication. 47% feel more productive. Slate boosted forecast accuracy by 60% and doubled deal wins.`,
    category: 'case-study' as const,
    notes: 'Slack - action verbs, quantified impact',
  },
  {
    content: `Pigment identified 4M in at-risk pipeline, lifted win rates to highest levels since 2023. Personio achieved 99% forecast accuracy, freed 30% additional time for customer engagement. Piano reached 90% forecast precision. AppsFly reduced meeting prep time by 50%. TOYOTA L&F saved 5,618 hours annually. Case studies structure around three core elements: Challenge Context where companies face operational complexity, Implementation showing specific features address the problem, and Quantified Impact with measurable improvements in efficiency, speed, or revenue.`,
    category: 'case-study' as const,
    notes: 'B2B case study framework - challenge/solution/result',
  },
]

// ============================================================================
// Seed Function
// ============================================================================

interface SeedConfig {
  clerkUserId: string
}

export async function seedExampleProfiles(config: SeedConfig) {
  const { clerkUserId } = config

  console.log('Seeding voice profiles with insight extraction...')

  const profiles = [
    {
      name: 'Technical Clarity',
      description: 'Stripe/Linear style. Task-based, minimal prose, developer-focused. Best for docs and technical content.',
      samples: TECHNICAL_CLARITY_SAMPLES,
      labels: ['technical', 'documentation'],
    },
    {
      name: 'Friendly Expert',
      description: 'Notion/Mailchimp style. Conversational, benefit-focused. Best for product marketing and emails.',
      samples: FRIENDLY_EXPERT_SAMPLES,
      labels: ['marketing', 'email'],
    },
    {
      name: 'Enterprise Persuader',
      description: 'Salesforce/Intercom style. Outcomes-driven, trust-building. Best for enterprise sales and exec presentations.',
      samples: ENTERPRISE_PERSUADER_SAMPLES,
      labels: ['enterprise', 'sales'],
    },
    {
      name: 'Thought Leader',
      description: 'Newsletter style (First Round, Prof G, Paul Graham). Provocative hooks, data-driven. Best for CEO updates and investor letters.',
      samples: THOUGHT_LEADER_SAMPLES,
      labels: ['newsletter', 'CEO'],
    },
    {
      name: 'Case Study Writer',
      description: 'Gong/Slack style. Customer voice, specific metrics, challenge-solution-result structure. Best for customer stories and ROI narratives.',
      samples: CASE_STUDY_SAMPLES,
      labels: ['case-study', 'customer-stories'],
    },
  ]

  const results = []

  for (const profileData of profiles) {
    console.log(`\nCreating: ${profileData.name}`)

    const profile = await createVoiceProfile({
      clerk_user_id: clerkUserId,
      name: profileData.name,
      description: profileData.description,
      labels: profileData.labels,
    })

    if (!profile) {
      console.error(`Failed: ${profileData.name}`)
      continue
    }

    // Add samples
    const sampleInputs = profileData.samples.map((s) => ({
      voice_profile_id: profile.id,
      clerk_user_id: clerkUserId,
      content: s.content,
      source_type: 'manual' as const,
      category: s.category,
      notes: s.notes,
    }))

    const samples = await createVoiceSamples(sampleInputs)
    console.log(`  ${samples.length} samples added`)

    // Extract insights from each sample
    let totalInsights = 0
    for (const sample of samples) {
      try {
        const result = await extractInsightsFromSample(sample.content)
        if (result.insights.length > 0) {
          const { created, merged } = await mergeInsights(
            profile.id,
            clerkUserId,
            sample.id,
            result.insights
          )
          totalInsights += created + merged
        }
      } catch (err) {
        console.error(`  Insight extraction failed: ${err}`)
      }
    }
    console.log(`  ${totalInsights} insights extracted`)

    // Update counts
    const insightCount = await getInsightCount(profile.id)
    await updateProfileCounts(profile.id, samples.length, insightCount)
    await updateTrainingStatus(profile.id, insightCount > 0 ? 'ready' : 'needs_update')

    results.push({
      profile,
      samplesAdded: samples.length,
      insightsExtracted: totalInsights,
    })
  }

  console.log('\nDone!')
  return results
}

// Export for checking existence
export const EXAMPLE_PROFILE_NAMES = [
  'Technical Clarity',
  'Friendly Expert',
  'Enterprise Persuader',
  'Thought Leader',
  'Case Study Writer',
]
