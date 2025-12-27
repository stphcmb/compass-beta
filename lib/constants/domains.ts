// Shared domain configuration for consistent styling across the app
// Used by: Explore, Authors, History, DomainOverview, DiscourseMap, and any page showing domain-related content

export interface DomainConfig {
  name: string
  shortName: string
  icon: string
  bgLight: string      // Light background for cards, chips
  bgSolid: string      // Solid color for badges, indicators
  text: string         // Text color when on light bg
  border: string       // Border color for interactive elements
  // Rich context for DomainOverview tooltips
  coreQuestion: string
  keyTension: string
  description: string
  youWillFind: string
}

export const DOMAINS: DomainConfig[] = [
  {
    name: 'AI Technical Capabilities',
    shortName: 'Technical',
    icon: '🔬',
    bgLight: '#dbeafe',
    bgSolid: '#3b82f6',
    text: '#1d4ed8',
    border: '#93c5fd',
    coreQuestion: 'How should AI systems be built?',
    keyTension: 'Scaling vs. New Approaches',
    description: 'The foundational debate about AI\'s trajectory. Some experts believe current architectures just need more data and compute to reach transformative intelligence. Others argue we\'re hitting fundamental limits and need entirely new approaches.',
    youWillFind: 'Research scientists, ML engineers, and technical leaders debating whether scaling laws will continue or if breakthroughs require new paradigms.'
  },
  {
    name: 'AI & Society',
    shortName: 'Society',
    icon: '🌍',
    bgLight: '#f3e8ff',
    bgSolid: '#8b5cf6',
    text: '#7c3aed',
    border: '#c4b5fd',
    coreQuestion: 'How should AI be deployed?',
    keyTension: 'Safety First vs. Democratize Fast',
    description: 'The tension between caution and access. Safety advocates worry about existential risks and want to slow deployment until we understand AI better. Democratizers argue that broad access empowers people and that delay concentrates power.',
    youWillFind: 'Ethicists, public intellectuals, and policy thinkers wrestling with how AI should reshape daily life and human potential.'
  },
  {
    name: 'Enterprise AI Adoption',
    shortName: 'Enterprise',
    icon: '🏢',
    bgLight: '#d1fae5',
    bgSolid: '#10b981',
    text: '#059669',
    border: '#6ee7b7',
    coreQuestion: 'How should orgs integrate AI?',
    keyTension: 'Business-led vs. Tech-led',
    description: 'The practical challenge of making AI work in organizations. Should transformation start with business problems and ROI? Or should you build robust technical infrastructure first and let capabilities drive strategy?',
    youWillFind: 'CTOs, consultants, and transformation leaders sharing what actually works when deploying AI at scale.'
  },
  {
    name: 'AI Governance & Oversight',
    shortName: 'Governance',
    icon: '⚖️',
    bgLight: '#fee2e2',
    bgSolid: '#ef4444',
    text: '#dc2626',
    border: '#fca5a5',
    coreQuestion: 'How should AI be regulated?',
    keyTension: 'Regulate vs. Innovate',
    description: 'The policy battleground. Interventionists want guardrails before capabilities advance further. Innovation advocates worry premature rules will stifle progress and hand leadership to less cautious nations.',
    youWillFind: 'Policymakers, legal scholars, and tech leaders debating who should control AI and what rules should apply.'
  },
  {
    name: 'Future of Work',
    shortName: 'Work',
    icon: '💼',
    bgLight: '#fef3c7',
    bgSolid: '#f59e0b',
    text: '#d97706',
    border: '#fcd34d',
    coreQuestion: 'How will AI change jobs?',
    keyTension: 'Displacement vs. Collaboration',
    description: 'The question that affects everyone. Will AI automate jobs away, requiring massive policy responses? Or will humans and AI collaborate, with machines amplifying what people do rather than replacing them?',
    youWillFind: 'Economists, HR leaders, and futurists examining how AI will transform employment, skills, and the workplace.'
  }
]

// Helper function to get domain config by name
export function getDomainConfig(domainName: string | null | undefined): DomainConfig {
  const domain = DOMAINS.find(d => d.name === domainName)
  return domain || {
    name: 'Other',
    shortName: 'Other',
    icon: '📄',
    bgLight: '#f3f4f6',
    bgSolid: '#6b7280',
    text: '#4b5563',
    border: '#d1d5db',
    coreQuestion: 'Miscellaneous topics',
    keyTension: 'Various perspectives',
    description: 'Topics that don\'t fit neatly into the main domains.',
    youWillFind: 'Diverse perspectives on emerging AI topics.'
  }
}

// Helper function to get domain color for DiscourseMap compatibility
export function getDomainColor(domainName: string): { bgLight: string; bgSolid: string; textDark: string } {
  const config = getDomainConfig(domainName)
  return {
    bgLight: config.bgLight,
    bgSolid: config.bgSolid,
    textDark: config.text
  }
}
