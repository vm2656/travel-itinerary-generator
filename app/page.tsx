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
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-orange-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <MapPin className="relative w-12 h-12 sm:w-16 sm:h-16 text-teal-600" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent mb-3 sm:mb-4">
            Travel Itinerary Generator
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Create beautiful, detailed travel itineraries in seconds with AI-powered planning
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Import Mode Card */}
          <button
            onClick={() => setMode('import')}
            className="group relative bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-100 to-teal-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Import from Excel
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Upload your Excel file with trip details and we&apos;ll transform it into a beautiful, shareable itinerary
              </p>
              <div className="flex items-center text-teal-600 font-semibold text-sm sm:text-base">
                Get Started
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Generate Mode Card */}
          <button
            onClick={() => setMode('generate')}
            className="group relative bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Generate with AI
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Tell us your destination and preferences, and AI will create a personalized itinerary with photos and recommendations
              </p>
              <div className="flex items-center text-orange-600 font-semibold text-sm sm:text-base">
                Get Started
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Features */}
        <div className="bg-gradient-to-r from-teal-50 to-orange-50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-inner">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="bg-white/60 rounded-xl p-4 hover:bg-white/80 transition-colors">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Day-by-Day Plans</h3>
              <p className="text-xs sm:text-sm text-gray-600">Organized activities with timing</p>
            </div>
            <div className="bg-white/60 rounded-xl p-4 hover:bg-white/80 transition-colors">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Location Photos</h3>
              <p className="text-xs sm:text-sm text-gray-600">High-quality images for each spot</p>
            </div>
            <div className="bg-white/60 rounded-xl p-4 hover:bg-white/80 transition-colors">
              <div className="bg-gradient-to-br from-teal-500 to-orange-600 w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Export Options</h3>
              <p className="text-xs sm:text-sm text-gray-600">Save as HTML or deploy online</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
