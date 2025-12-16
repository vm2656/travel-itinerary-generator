'use client'

import { useEffect, useState } from 'react'
import { Plane, MapPin, Camera, Utensils, Sparkles } from 'lucide-react'

const loadingMessages = [
  { icon: Sparkles, text: "AI is crafting your perfect itinerary..." },
  { icon: MapPin, text: "Discovering hidden gems and must-see spots..." },
  { icon: Utensils, text: "Finding the best local restaurants..." },
  { icon: Camera, text: "Gathering beautiful photos..." },
  { icon: Plane, text: "Almost ready for takeoff..." },
]

interface LoadingProgressProps {
  stage: 'generating' | 'loading-images'
  progress?: number
  destination?: string
}

export default function LoadingProgress({ stage, progress = 0, destination }: LoadingProgressProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [dots, setDots] = useState('')
  const [travelFact, setTravelFact] = useState('')
  const [travelFacts, setTravelFacts] = useState<string[]>([])
  const [loadingFacts, setLoadingFacts] = useState(false)

  // Fetch AI-generated travel facts
  useEffect(() => {
    const fetchTravelFacts = async () => {
      if (!destination) return

      setLoadingFacts(true)
      try {
        const response = await fetch('/api/travel-facts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination }),
        })

        if (response.ok) {
          const data = await response.json()
          setTravelFacts(data.facts || [])
          setTravelFact(data.facts[0] || 'Preparing your travel itinerary...')
        } else {
          setTravelFacts(['Preparing your personalized travel experience...'])
          setTravelFact('Preparing your personalized travel experience...')
        }
      } catch (error) {
        console.error('Error fetching travel facts:', error)
        setTravelFacts(['Preparing your personalized travel experience...'])
        setTravelFact('Preparing your personalized travel experience...')
      } finally {
        setLoadingFacts(false)
      }
    }

    if (stage === 'generating' && destination && !loadingFacts && travelFacts.length === 0) {
      fetchTravelFacts()
    }
  }, [destination, stage, loadingFacts, travelFacts.length])

  useEffect(() => {
    if (stage === 'generating') {
      // Rotate loading messages
      const messageInterval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
      }, 3000)

      // Rotate travel facts every 10 seconds
      const factInterval = setInterval(() => {
        if (travelFacts.length > 0) {
          setTravelFact(travelFacts[Math.floor(Math.random() * travelFacts.length)])
        }
      }, 10000)

      return () => {
        clearInterval(messageInterval)
        clearInterval(factInterval)
      }
    }
  }, [stage, travelFacts])

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const CurrentIcon = loadingMessages[messageIndex].icon

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-6">
                <CurrentIcon className="w-12 h-12 text-white animate-bounce" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            {stage === 'generating' ? 'Creating Your Itinerary' : 'Loading Images'}
          </h2>
          <p className="text-center text-gray-600 mb-6 min-h-[24px]">
            {stage === 'generating'
              ? loadingMessages[messageIndex].text + dots
              : `Fetching beautiful photos${dots}`}
          </p>

          {/* Progress Bar */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{
                width: stage === 'generating'
                  ? `${Math.min(progress || 10, 90)}%`
                  : `${progress}%`
              }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>

          {stage === 'loading-images' && progress > 0 && (
            <p className="text-center text-sm text-gray-500">
              {Math.round(progress)}% complete
            </p>
          )}

          {/* Travel Facts */}
          {stage === 'generating' && travelFact && progress === 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-orange-50 rounded-lg border border-teal-200 animate-pulse">
              <p className="text-sm text-gray-700 text-center font-medium">
                ✨ {travelFact}
              </p>
            </div>
          )}

          {stage === 'loading-images' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700 text-center italic">
                Pro tip: Click on any image to view more photos! 📸
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
