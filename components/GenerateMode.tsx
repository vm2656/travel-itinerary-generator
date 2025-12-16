'use client'

import { useState } from 'react'
import { ArrowLeft, Sparkles, Calendar, MapPin, DollarSign, Heart } from 'lucide-react'
import { GenerateFormData, TripItinerary } from '@/types'
import ItineraryDisplay from './ItineraryDisplay'
import LoadingProgress from './LoadingProgress'

interface GenerateModeProps {
  onBack: () => void
}

const INTERESTS = [
  'Culture & History',
  'Food & Dining',
  'Nature & Outdoors',
  'Shopping',
  'Nightlife',
  'Art & Museums',
  'Photography',
  'Adventure Sports',
  'Relaxation & Spa',
  'Local Experiences',
]

export default function GenerateMode({ onBack }: GenerateModeProps) {
  const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format

  const [formData, setFormData] = useState<GenerateFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    pace: 'moderate',
    interests: [],
    vegetarianOnly: false,
    budget: 'moderate',
    additionalPreferences: '',
  })
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate itinerary')
      }

      const generatedItinerary: TripItinerary = await response.json()

      // Save to localStorage
      localStorage.setItem('currentItinerary', JSON.stringify(generatedItinerary))
      localStorage.setItem('itineraryMode', 'generate')

      setItinerary(generatedItinerary)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingProgress stage="generating" destination={formData.destination} />
  }

  if (itinerary) {
    return <ItineraryDisplay itinerary={itinerary} onBack={onBack} />
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-full p-3 mr-4">
              <Sparkles className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generate with AI</h1>
              <p className="text-gray-600">Tell us your preferences and we&apos;ll create a personalized itinerary</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Destination
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., Paris, France"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  End Date
                </label>
                <input
                  type="date"
                  required
                  min={formData.startDate || today}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Pace */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Travel Pace</label>
              <div className="grid grid-cols-3 gap-3">
                {(['relaxed', 'moderate', 'packed'] as const).map((pace) => (
                  <button
                    key={pace}
                    type="button"
                    onClick={() => setFormData({ ...formData, pace })}
                    className={`py-3 px-4 rounded-lg font-semibold capitalize transition-colors ${
                      formData.pace === pace
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 mr-2" />
                Budget Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['budget', 'moderate', 'luxury'] as const).map((budget) => (
                  <button
                    key={budget}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget })}
                    className={`py-3 px-4 rounded-lg font-semibold capitalize transition-colors ${
                      formData.budget === budget
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Heart className="w-4 h-4 mr-2" />
                Interests (select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.interests.includes(interest)
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preferences */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.vegetarianOnly}
                  onChange={(e) => setFormData({ ...formData, vegetarianOnly: e.target.checked })}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="text-sm font-semibold text-gray-700">Show only vegetarian-friendly restaurants</span>
              </label>
            </div>

            {/* Additional Preferences */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Additional Preferences (Optional)
              </label>
              <textarea
                value={formData.additionalPreferences}
                onChange={(e) => setFormData({ ...formData, additionalPreferences: e.target.value })}
                placeholder="Any special requests, accessibility needs, or specific places you want to visit..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || formData.interests.length === 0}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Perfect Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Itinerary
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
