'use client'

import { useState, useEffect } from 'react'
import { Upload, Sparkles, MapPin, Calendar } from 'lucide-react'
import ImportMode from '@/components/ImportMode'
import GenerateMode from '@/components/GenerateMode'
import ItineraryDisplay from '@/components/ItineraryDisplay'
import { TripItinerary } from '@/types'

type Mode = 'home' | 'import' | 'generate'

export default function Home() {
  const [mode, setMode] = useState<Mode>('home')
  const [savedItinerary, setSavedItinerary] = useState<TripItinerary | null>(null)

  useEffect(() => {
    // Check for saved itinerary on mount
    const saved = localStorage.getItem('currentItinerary')
    if (saved) {
      try {
        setSavedItinerary(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved itinerary')
        localStorage.removeItem('currentItinerary')
      }
    }
  }, [])

  const handleBack = () => {
    setMode('home')
    setSavedItinerary(null)
    localStorage.removeItem('currentItinerary')
    localStorage.removeItem('itineraryMode')
  }

  if (savedItinerary) {
    return <ItineraryDisplay itinerary={savedItinerary} onBack={handleBack} />
  }

  if (mode === 'import') {
    return <ImportMode onBack={handleBack} />
  }

  if (mode === 'generate') {
    return <GenerateMode onBack={handleBack} />
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Travel Itinerary Generator
          </h1>
          <p className="text-xl text-gray-600">
            Create beautiful, detailed travel itineraries in seconds
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Import Mode Card */}
          <button
            onClick={() => setMode('import')}
            className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
          >
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Import from Excel
            </h2>
            <p className="text-gray-600 mb-4">
              Upload your Excel file with trip details and we'll transform it into a beautiful, shareable itinerary
            </p>
            <div className="flex items-center text-blue-600 font-semibold">
              Get Started
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Generate Mode Card */}
          <button
            onClick={() => setMode('generate')}
            className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
          >
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Generate with AI
            </h2>
            <p className="text-gray-600 mb-4">
              Tell us your destination and preferences, and AI will create a personalized itinerary with photos and recommendations
            </p>
            <div className="flex items-center text-purple-600 font-semibold">
              Get Started
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white/50 backdrop-blur-sm rounded-xl p-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Day-by-Day Plans</h3>
              <p className="text-sm text-gray-600">Organized activities with timing</p>
            </div>
            <div>
              <MapPin className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Location Photos</h3>
              <p className="text-sm text-gray-600">High-quality images for each spot</p>
            </div>
            <div>
              <Upload className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Export Options</h3>
              <p className="text-sm text-gray-600">Save as HTML or deploy online</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
