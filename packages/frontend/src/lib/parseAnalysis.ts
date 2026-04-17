export interface AnalysisSection {
  title: string
  body: string
  passed?: boolean
}

const SECTION_RE = /(?:^|\n)\s*\d+\.\s*\*\*([^*]+?)\*\*\s*[:：]?\s*([\s\S]*?)(?=(?:\n\s*\d+\.\s*\*\*)|$)/g

function detectPassed(body: string): boolean | undefined {
  const hasPass = /✓|✅/.test(body)
  const hasFail = /✗|❌|✘/.test(body)
  if (hasPass && !hasFail) return true
  if (hasFail && !hasPass) return false
  return undefined
}

function cleanBody(body: string): string {
  return body
    .replace(/[✓✅✗❌✘]/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

export function parseAnalysis(text: string): AnalysisSection[] {
  if (!text) return []

  const sections: AnalysisSection[] = []
  for (const match of text.matchAll(SECTION_RE)) {
    const title = match[1].trim()
    const rawBody = match[2].trim()
    if (!title) continue
    sections.push({
      title,
      body: cleanBody(rawBody),
      passed: detectPassed(rawBody),
    })
  }

  if (sections.length === 0) {
    return [{ title: '분석', body: text.trim() }]
  }

  return sections
}
