import type { ResearchAssistantAnalyzeResponse } from '@/lib/research-assistant'

/**
 * Generate print-friendly HTML for PDF export of analysis results
 */
export function generatePrintHTML(result: ResearchAssistantAnalyzeResponse): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Research Assistant Analysis - ${date}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e5e7eb;
        }
        .header h1 {
          font-size: 28px;
          margin: 0 0 8px 0;
          color: #111827;
        }
        .header .date {
          color: #6b7280;
          font-size: 14px;
        }
        .section {
          margin-bottom: 32px;
          page-break-inside: avoid;
        }
        .section h2 {
          font-size: 18px;
          color: #111827;
          margin: 0 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .section h3 {
          font-size: 16px;
          color: #374151;
          margin: 0 0 12px 0;
        }
        .summary-text {
          font-size: 15px;
          color: #374151;
        }
        .suggestions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .suggestion-box {
          padding: 16px;
          border-radius: 8px;
        }
        .suggestion-box.present {
          background: #f0fdf4;
          border: 1px solid #86efac;
        }
        .suggestion-box.missing {
          background: #fffbeb;
          border: 1px solid #fcd34d;
        }
        .suggestion-box h3 {
          margin: 0 0 12px 0;
        }
        .suggestion-box.present h3 { color: #16a34a; }
        .suggestion-box.missing h3 { color: #d97706; }
        .suggestion-box ul {
          margin: 0;
          padding-left: 20px;
        }
        .suggestion-box li {
          margin-bottom: 8px;
          font-size: 14px;
        }
        .camp {
          margin-bottom: 24px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
          page-break-inside: avoid;
        }
        .camp h3 {
          margin: 0 0 8px 0;
          font-size: 17px;
        }
        .camp-desc {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 16px;
        }
        .author {
          padding: 16px;
          margin-bottom: 12px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: white;
        }
        .author.agrees { border-left: 4px solid #10b981; }
        .author.disagrees { border-left: 4px solid #ef4444; }
        .author.partial { border-left: 4px solid #f59e0b; }
        .author-name {
          font-weight: 600;
          font-size: 15px;
          margin-bottom: 4px;
        }
        .author-stance {
          display: inline-block;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .author.agrees .author-stance { background: #d1fae5; color: #059669; }
        .author.disagrees .author-stance { background: #fee2e2; color: #dc2626; }
        .author.partial .author-stance { background: #fef3c7; color: #d97706; }
        .author-position {
          font-size: 14px;
          margin-bottom: 8px;
        }
        .author-connection {
          font-size: 14px;
          padding: 12px;
          background: #f3f4f6;
          border-radius: 6px;
          margin-bottom: 8px;
        }
        .author-quote {
          font-size: 14px;
          font-style: italic;
          color: #4b5563;
          padding: 12px;
          background: #f9fafb;
          border-left: 3px solid #9ca3af;
          margin: 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
        }
        @media print {
          body { padding: 20px; }
          .camp, .author { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Research Assistant Analysis</h1>
        <div class="date">${date}</div>
      </div>

      <div class="section">
        <h2>Summary</h2>
        <p class="summary-text">${result.summary}</p>
      </div>

      <div class="section">
        <h2>Editorial Suggestions</h2>
        <div class="suggestions-grid">
          <div class="suggestion-box present">
            <h3>What You're Using</h3>
            <ul>
              ${result.editorialSuggestions.presentPerspectives.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
          <div class="suggestion-box missing">
            <h3>What You're Missing</h3>
            <ul>
              ${result.editorialSuggestions.missingPerspectives.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      ${result.matchedCamps.length > 0 ? `
      <div class="section">
        <h2>Relevant Thought Leaders</h2>
        ${result.matchedCamps.map(camp => `
          <div class="camp">
            <h3>${camp.campLabel}</h3>
            <p class="camp-desc">${camp.explanation}</p>
            ${camp.topAuthors.map(author => `
              <div class="author ${author.stance}">
                <div class="author-name">${author.name}</div>
                <span class="author-stance">${
                  author.stance === 'agrees' ? 'Agrees' :
                  author.stance === 'disagrees' ? 'Disagrees' : 'Partial'
                }</span>
                <p class="author-position"><strong>Position:</strong> ${author.position}</p>
                ${author.draftConnection ? `<div class="author-connection"><strong>Connection:</strong> ${author.draftConnection}</div>` : ''}
                ${author.quote ? `<blockquote class="author-quote">"${author.quote}"</blockquote>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="footer">
        Generated by Compass Research Assistant - ${date}
      </div>
    </body>
    </html>
  `
}
