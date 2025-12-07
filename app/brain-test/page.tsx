'use client'

import { useState } from 'react'

export default function BrainTestPage() {
  const [text, setText] = useState(
    'Artificial intelligence is rapidly transforming how businesses operate. Companies are racing to adopt AI technologies to gain competitive advantages, improve efficiency, and unlock new revenue streams.'
  )
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/brain/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Test failed')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Mini Brain Test</h1>
          <p className="text-gray-600 mb-6">
            Test keyword extraction and database queries without Gemini API
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your text:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter text to analyze..."
            />
            <p className="text-sm text-gray-500 mt-1">
              {text.length} characters
            </p>
          </div>

          <button
            onClick={handleTest}
            disabled={loading || !text}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Testing...' : 'Test Mini Brain'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-1">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              ✅ {result.message}
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Keywords Extracted</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Words ({result.debug.keywords.words.length} shown):</strong>
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.debug.keywords.words.map((word: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  <strong>Phrases ({result.debug.keywords.phrases.length} shown):</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.debug.keywords.phrases.map((phrase: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 mt-3">
                  Total terms extracted: <strong>{result.debug.keywords.totalTerms}</strong>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                Matching Camps ({result.debug.candidateCamps.count})
              </h3>
              <div className="space-y-4">
                {result.debug.candidateCamps.camps.map((camp: any, idx: number) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{camp.name}</h4>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {camp.domain}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {camp.authorCount} author{camp.authorCount !== 1 ? 's' : ''} total
                      {camp.topAuthors.length < camp.authorCount && (
                        <span className="text-gray-500"> (showing top {camp.topAuthors.length})</span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {camp.topAuthors.map((author: string, authorIdx: number) => (
                        <span
                          key={authorIdx}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                        >
                          {author}
                        </span>
                      ))}
                      {camp.topAuthors.length < camp.authorCount && (
                        <span className="text-xs text-gray-500 px-2 py-1 italic">
                          + {camp.authorCount - camp.topAuthors.length} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> {result.note}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
