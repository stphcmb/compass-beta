'use client'

interface WhiteSpaceOpportunitiesProps {
  query: string
}

export default function WhiteSpaceOpportunities({ query }: WhiteSpaceOpportunitiesProps) {
  // Placeholder - will be replaced with actual logic
  const opportunities: string[] = []

  if (opportunities.length === 0) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">White Space Opportunities</h2>
      <ul className="list-disc list-inside space-y-2">
        {opportunities.map((opp, index) => (
          <li key={index} className="text-gray-700">{opp}</li>
        ))}
      </ul>
    </div>
  )
}

