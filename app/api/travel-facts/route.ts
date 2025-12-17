import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// In-memory cache for travel facts
const factsCache = new Map<string, { facts: string[], timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Retry helper for API calls
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error: any) {
    const is503 = error?.message?.includes('503') || error?.message?.includes('overloaded')
    if (retries > 0 && is503) {
      console.log(`API overloaded, retrying in ${delay}ms... (${retries} retries left)`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return retryWithBackoff(fn, retries - 1, delay * 2)
    }
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { destination } = await request.json()

    if (!destination) {
      return NextResponse.json({ error: 'Destination is required' }, { status: 400 })
    }

    // Check cache first
    const cacheKey = destination.toLowerCase().trim()
    const cached = factsCache.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`✅ Using cached facts for ${destination}`)
      return NextResponse.json({ facts: cached.facts })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    // No grounding for travel facts - Gemini's knowledge is sufficient and returns cleaner JSON
    const model = genAI.getGenerativeModel({
      model: 'models/gemini-2.5-flash'
    })

    const prompt = `Generate 3 interesting, specific, and surprising travel facts about ${destination}.

Make them engaging and informative. Include a mix of:
- Unique cultural aspects or local customs
- Historical facts or hidden gems
- Local cuisine highlights or must-try experiences

CRITICAL: Return ONLY a valid JSON array. Each fact should be 1-2 sentences maximum.
- Use double quotes for strings
- Escape any quotes within the text using backslash (\")
- No markdown, no code blocks, no explanations
- Start with [ and end with ]

Example format:
["Fact 1 here", "Fact 2 with \\"quoted\\" text here", "Fact 3 here"]`

    // Retry with exponential backoff for 503 errors
    const result = await retryWithBackoff(
      () => model.generateContent(prompt),
      3,
      2000
    )
    const responseText = result.response.text()

    console.log('Raw Gemini response:', responseText.substring(0, 500))

    // Try multiple parsing strategies
    let facts: string[] = []

    // Strategy 1: Try to parse as clean JSON
    try {
      // Remove markdown code blocks
      let cleanedText = responseText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim()

      // Remove grounding citations [1], [2], etc.
      cleanedText = cleanedText.replace(/\[\d+\]/g, '')

      // Try to find JSON array
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        let jsonString = jsonMatch[0]
          // Fix common JSON issues
          .replace(/,\s*([}\]])/g, '$1')  // Remove trailing commas
          .replace(/\n/g, ' ')            // Remove newlines within strings
          .replace(/\r/g, '')             // Remove carriage returns
          .replace(/\t/g, ' ')            // Replace tabs with spaces

        facts = JSON.parse(jsonString)
        console.log(`✅ Successfully parsed ${facts.length} facts`)
      }
    } catch (e) {
      console.warn('Strategy 1 failed:', e)
    }

    // Strategy 2: Manual extraction if JSON parsing fails
    if (!facts || facts.length === 0) {
      console.log('Trying manual extraction...')

      // Look for lines that look like facts (start with quotes or bullets)
      const lines = responseText.split('\n')
      facts = lines
        .map(line => line.trim())
        .filter(line => {
          // Keep lines that start with quotes, bullets, or numbers
          return line.match(/^["•\-\d]/) || line.length > 20
        })
        .map(line => {
          // Clean up the line
          return line
            .replace(/^["•\-\d\.\)]+\s*/, '') // Remove leading markers
            .replace(/["]+$/, '')              // Remove trailing quotes
            .replace(/\[\d+\]/g, '')          // Remove citations
            .trim()
        })
        .filter(line => line.length > 10 && line.length < 500)
        .slice(0, 3)  // Take first 3

      if (facts.length > 0) {
        console.log(`✅ Manually extracted ${facts.length} facts`)
      }
    }

    // No fallback - return empty array if parsing fails
    if (!facts || facts.length === 0) {
      console.warn('All parsing strategies failed, returning empty array')
      return NextResponse.json({ facts: [] })
    }

    // Cache successful results
    factsCache.set(cacheKey, { facts, timestamp: Date.now() })
    console.log(`💾 Cached facts for ${destination}`)

    return NextResponse.json({ facts })
  } catch (error) {
    console.error('Error generating travel facts:', error)
    return NextResponse.json(
      { error: 'Failed to generate travel facts' },
      { status: 500 }
    )
  }
}
