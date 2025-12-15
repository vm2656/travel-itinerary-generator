'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, FileSpreadsheet, AlertCircle } from 'lucide-react'
import { parseExcelToItinerary, createSampleExcelStructure } from '@/utils/excelParser'
import { TripItinerary } from '@/types'
import ItineraryDisplay from './ItineraryDisplay'

interface ImportModeProps {
  onBack: () => void
}

export default function ImportMode({ onBack }: ImportModeProps) {
  const [file, setFile] = useState<File | null>(null)
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showStructure, setShowStructure] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const parsedItinerary = await parseExcelToItinerary(file)

      // Save to localStorage
      localStorage.setItem('currentItinerary', JSON.stringify(parsedItinerary))
      localStorage.setItem('itineraryMode', 'import')

      setItinerary(parsedItinerary)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (itinerary) {
    return <ItineraryDisplay itinerary={itinerary} onBack={onBack} />
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <FileSpreadsheet className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Import from Excel</h1>
              <p className="text-gray-600">Upload your trip details and create a beautiful itinerary</p>
            </div>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {file ? file.name : 'Choose an Excel file'}
            </h3>
            <p className="text-gray-600 mb-6">
              Supported formats: .xlsx, .xls
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Select File
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Error parsing file</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {file && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Generate Itinerary'}
            </button>
          )}

          {/* Excel Structure Guide */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => setShowStructure(!showStructure)}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              {showStructure ? '− Hide' : '+ View'} Excel Structure Guide
            </button>

            {showStructure && (
              <div className="mt-4 bg-gray-50 rounded-lg p-6">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                  {createSampleExcelStructure()}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
