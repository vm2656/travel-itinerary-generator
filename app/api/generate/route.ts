import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GenerateFormData, TripItinerary } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const formData: GenerateFormData = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Get a free key at https://aistudio.google.com/app/apikey' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    // Using models/gemini-2.5-flash - fastest free model (June 2025)
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' })

    const prompt = createPrompt(formData)

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse the JSON response from Gemini
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from response')
    }

    // Clean the JSON string to fix common AI-generated JSON issues
    let cleanedJson = jsonMatch[0]
      .replace(/,\s*([\]}])/g, '$1')  // Remove trailing commas
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // Quote unquoted keys
      .replace(/:\s*'([^']*)'/g, ': "$1"')  // Replace single quotes with double quotes for values
      .replace(/\n/g, ' ')  // Remove newlines within strings
      .replace(/\r/g, '')  // Remove carriage returns

    let itinerary: TripItinerary
    try {
      itinerary = JSON.parse(cleanedJson)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Cleaned JSON:', cleanedJson.substring(0, 500))
      throw new Error(`Failed to parse JSON: ${parseError}`)
    }

    return NextResponse.json(itinerary)
  } catch (error) {
    console.error('Error generating itinerary:', error)
    return NextResponse.json(
      { error: 'Failed to generate itinerary: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

function createPrompt(formData: GenerateFormData): string {
  const {
    destination,
    startDate,
    endDate,
    pace,
    interests,
    vegetarianOnly,
    budget,
    additionalPreferences,
  } = formData

  const start = new Date(startDate)
  const end = new Date(endDate)
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  return `You are a professional travel planner. Create a detailed ${duration}-day itinerary for ${destination} from ${startDate} to ${endDate}.

Requirements:
- Pace: ${pace} (${pace === 'relaxed' ? '2-3 activities per day' : pace === 'moderate' ? '4-5 activities per day' : '6+ activities per day'})
- Interests: ${interests.join(', ')}
- Budget: ${budget}
- Dietary: ${vegetarianOnly ? 'Vegetarian restaurants only' : 'All restaurant types'}
${additionalPreferences ? `- Additional preferences: ${additionalPreferences}` : ''}

For each day, include:
1. 3-6 activities with realistic timing (HH:MM format)
2. Detailed descriptions and practical tips
3. Location names for Google Maps
4. Duration and estimated costs in USD
5. 2-3 restaurant recommendations per day with cuisine type, price range ($, $$, $$$), and vegetarian-friendly status
6. Practical tips specific to each activity

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no backticks, no explanations.
- Use double quotes for all strings
- No trailing commas
- Escape all special characters in strings
- Use proper JSON syntax

Format:

{
  "title": "Trip title",
  "destination": "${destination}",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "duration": ${duration},
  "overview": "Brief trip overview",
  "totalEstimatedCost": "Total estimated cost",
  "practicalTips": ["tip1", "tip2", "tip3"],
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day theme/title",
      "estimatedCost": "$XXX",
      "activities": [
        {
          "time": "09:00",
          "title": "Activity name",
          "description": "Detailed description",
          "location": "Exact location name for Google Maps",
          "duration": "2 hours",
          "cost": "$XX",
          "tips": "Practical tips"
        }
      ],
      "restaurants": [
        {
          "name": "Restaurant name",
          "cuisine": "Cuisine type",
          "priceRange": "$$",
          "vegetarianFriendly": ${vegetarianOnly},
          "location": "Address or area",
          "description": "Brief description"
        }
      ]
    }
  ]
}

Make the itinerary engaging, realistic, and well-paced. Include insider tips and specific location names.`
}
