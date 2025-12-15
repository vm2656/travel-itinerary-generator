import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// Parse multiple API keys from environment (comma-separated)
const API_KEYS = process.env.GOOGLE_SEARCH_API_KEY?.split(',').map(k => k.trim()).filter(k => k) || []
let currentKeyIndex = 0

// Simple in-memory rate limiter
let requestQueue: Array<() => Promise<any>> = []
let isProcessing = false
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 100 // 100ms between requests

async function processQueue() {
  if (isProcessing || requestQueue.length === 0) return

  isProcessing = true

  while (requestQueue.length > 0) {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
    }

    const request = requestQueue.shift()
    if (request) {
      await request()
      lastRequestTime = Date.now()
    }
  }

  isProcessing = false
}

function getNextApiKey(): string {
  if (API_KEYS.length === 0) {
    throw new Error('No API keys available')
  }
  const key = API_KEYS[currentKeyIndex]
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length
  return key
}

async function fetchWithRetry(url: string, baseParams: any, retries = 3): Promise<any> {
  const maxKeyAttempts = Math.min(API_KEYS.length, 3) // Try up to 3 different keys

  for (let keyAttempt = 0; keyAttempt < maxKeyAttempts; keyAttempt++) {
    const apiKey = getNextApiKey()
    const params = { ...baseParams, key: apiKey }

    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url, { params })
        return response
      } catch (error: any) {
        if (error.response?.status === 429) {
          if (i < retries - 1) {
            // Rate limited - wait with exponential backoff
            const waitTime = Math.pow(2, i) * 500 // 500ms, 1s, 2s
            console.log(`Rate limited on key ${keyAttempt + 1}, waiting ${waitTime}ms before retry ${i + 1}/${retries}`)
            await new Promise(resolve => setTimeout(resolve, waitTime))
          } else if (keyAttempt < maxKeyAttempts - 1) {
            // Exhausted retries for this key, try next key
            console.log(`Rate limited on key ${keyAttempt + 1}, trying next key...`)
            break
          } else {
            // Exhausted all keys
            throw error
          }
        } else {
          throw error
        }
      }
    }
  }
  throw new Error('Failed to fetch after trying all available keys')
}

export async function POST(request: NextRequest) {
  let query = ''
  try {
    const body = await request.json()
    query = body.query
    const count = body.count || 1

    if (API_KEYS.length === 0 || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
      return NextResponse.json(
        { error: 'Google Search API not configured. Please add GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID to .env file' },
        { status: 500 }
      )
    }

    console.log(`Using ${API_KEYS.length} API key(s) for image search`)

    // Fetch with retry logic and rate limiting
    const response = await new Promise<any>((resolve, reject) => {
      const task = async () => {
        try {
          const result = await fetchWithRetry('https://www.googleapis.com/customsearch/v1', {
            // API key will be added by fetchWithRetry function during rotation
            cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
            q: query,
            searchType: 'image',
            num: Math.min(count, 10), // Max 10 per request
            imgSize: 'large',
            imgType: 'photo', // Only actual photographs
            safe: 'active',
            fileType: 'jpg,png', // High quality formats
          })
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      requestQueue.push(task)
      processQueue()
    })

    const rawImages = response.data.items?.map((item: any) => item.link) || []

    // Filter out duplicates and ensure uniqueness
    const images = Array.from(new Set(rawImages))

    if (images.length === 0) {
      console.warn(`No images found for query: ${query}`)
      // Return placeholder
      return NextResponse.json({
        imageUrl: `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(query)}`,
        images: []
      })
    }

    return NextResponse.json({
      imageUrl: images[0],
      images: images
    })
  } catch (error: any) {
    console.error('Error fetching image:', error)

    // Return placeholder on error (query is already extracted at the top)
    return NextResponse.json({
      imageUrl: `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(query || 'Image')}`,
      images: [],
      error: error.message
    })
  }
}
