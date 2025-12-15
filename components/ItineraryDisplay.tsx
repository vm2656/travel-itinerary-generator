'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Download, ChevronDown, ChevronUp, Clock, MapPin, DollarSign, Utensils, Leaf, ExternalLink, Printer, Image as ImageIcon } from 'lucide-react'
import { TripItinerary, DayItinerary, Activity, Restaurant } from '@/types'
import { format } from 'date-fns'
import LoadingProgress from './LoadingProgress'
import ImageLightbox from './ImageLightbox'

interface ItineraryDisplayProps {
  itinerary: TripItinerary
  onBack: () => void
}

interface EnrichedActivity extends Activity {
  images?: string[]
  searchUrl?: string
}

interface EnrichedRestaurant extends Restaurant {
  images?: string[]
  searchUrl?: string
}

export default function ItineraryDisplay({ itinerary, onBack }: ItineraryDisplayProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]))
  const [loadingImages, setLoadingImages] = useState(true)
  const [imageProgress, setImageProgress] = useState(0)
  const [enrichedItinerary, setEnrichedItinerary] = useState<TripItinerary>(itinerary)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxTitle, setLightboxTitle] = useState('')
  const [showLightbox, setShowLightbox] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setLoadingImages(true)
    setImageProgress(0)

    // Calculate total number of items
    const totalItems = itinerary.days.reduce((sum, day) =>
      sum + day.activities.length + day.restaurants.length, 0
    )
    let completedItems = 0

    const updatedDays = []

    for (const day of itinerary.days) {
      const activitiesWithImages = []
      for (const activity of day.activities) {
        // More specific query with location details for better image variety
        const { imageUrl, images } = await fetchImage(`${activity.title} ${activity.location} ${itinerary.destination} attraction`, 3)
        const mapUrl = createGoogleMapsUrl(activity.location, itinerary.destination)
        const searchUrl = createGoogleSearchUrl(`${activity.title} ${activity.location} ${itinerary.destination}`)
        console.log(`Activity "${activity.title}" fetched ${images.length} images:`, images)
        activitiesWithImages.push({ ...activity, image: imageUrl, images, mapUrl, searchUrl })
        completedItems++
        setImageProgress((completedItems / totalItems) * 100)
      }

      const restaurantsWithImages = []
      for (const restaurant of day.restaurants) {
        // More specific query for restaurants with location
        const { imageUrl, images } = await fetchImage(`${restaurant.name} restaurant ${restaurant.location} ${itinerary.destination} ${restaurant.cuisine}`, 3)
        const mapUrl = createGoogleMapsUrl(restaurant.location, itinerary.destination)
        const searchUrl = createGoogleSearchUrl(`${restaurant.name} ${restaurant.location} ${itinerary.destination} restaurant`)
        restaurantsWithImages.push({ ...restaurant, image: imageUrl, images, mapUrl, searchUrl })
        completedItems++
        setImageProgress((completedItems / totalItems) * 100)
      }

      updatedDays.push({
        ...day,
        activities: activitiesWithImages,
        restaurants: restaurantsWithImages,
      })
    }

    setEnrichedItinerary({ ...itinerary, days: updatedDays })
    setLoadingImages(false)
  }

  const fetchImage = async (query: string, count: number = 5): Promise<{ imageUrl: string; images: string[] }> => {
    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, count }),
      })
      const data = await response.json()
      return {
        imageUrl: data.imageUrl || `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(query)}`,
        images: data.images || [data.imageUrl]
      }
    } catch (error) {
      console.error('Error fetching image:', error)
      const placeholder = `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(query)}`
      return { imageUrl: placeholder, images: [placeholder] }
    }
  }

  const openLightbox = (images: string[], title: string, startIndex: number = 0) => {
    console.log('openLightbox called with:', { images, title, imagesLength: images?.length })
    if (images && images.length > 0) {
      console.log('Opening lightbox with images:', images)
      setLightboxImages(images)
      setLightboxTitle(title)
      setShowLightbox(true)
    } else {
      console.log('No images to display in lightbox')
    }
  }

  const createGoogleMapsUrl = (location: string, destination: string): string => {
    const query = encodeURIComponent(`${location}, ${destination}`)
    return `https://www.google.com/maps/search/?api=1&query=${query}`
  }

  const createGoogleSearchUrl = (query: string): string => {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`
  }

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(day)) {
        newSet.delete(day)
      } else {
        newSet.add(day)
      }
      return newSet
    })
  }

  const exportToHTML = () => {
    const htmlContent = generateStandaloneHTML(enrichedItinerary)
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${itinerary.title.replace(/\s+/g, '-').toLowerCase()}-itinerary.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  // Show loading progress while fetching images
  if (loadingImages) {
    return <LoadingProgress stage="loading-images" progress={imageProgress} />
  }

  return (
    <>
      {/* Image Lightbox */}
      {showLightbox && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={0}
          title={lightboxTitle}
          onClose={() => setShowLightbox(false)}
        />
      )}

      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="no-print mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button
              onClick={exportToHTML}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              <Download className="w-4 h-4 mr-2" />
              Export HTML
            </button>
          </div>
        </div>

        {/* Trip Header */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 print-break-inside-avoid">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{enrichedItinerary.title}</h1>
            <div className="flex flex-wrap gap-4 text-lg">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {enrichedItinerary.destination}
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {enrichedItinerary.duration} days
              </div>
              <div className="flex items-center">
                {format(new Date(enrichedItinerary.startDate), 'MMM d')} - {format(new Date(enrichedItinerary.endDate), 'MMM d, yyyy')}
              </div>
            </div>
            {enrichedItinerary.totalEstimatedCost && (
              <div className="mt-4 text-xl font-semibold">
                Total Estimated Cost: {enrichedItinerary.totalEstimatedCost}
              </div>
            )}
          </div>

          {enrichedItinerary.overview && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{enrichedItinerary.overview}</p>
            </div>
          )}

          {enrichedItinerary.practicalTips && enrichedItinerary.practicalTips.length > 0 && (
            <div className="p-8 bg-blue-50 border-t border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Practical Tips</h2>
              <ul className="space-y-2">
                {enrichedItinerary.practicalTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Days */}
        {loadingImages && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading images for your itinerary...</p>
            </div>
          </div>
        )}

        {enrichedItinerary.days.map((day) => (
          <DayCard
            key={day.day}
            day={day}
            expanded={expandedDays.has(day.day)}
            onToggle={() => toggleDay(day.day)}
            onImageClick={openLightbox}
          />
        ))}
        </div>
      </div>
    </>
  )
}

interface DayCardProps {
  day: DayItinerary
  expanded: boolean
  onToggle: () => void
  onImageClick: (images: string[], title: string) => void
}

function DayCard({ day, expanded, onToggle, onImageClick }: DayCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden print-break-inside-avoid">
      {/* Day Header */}
      <button
        onClick={onToggle}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between hover:from-blue-600 hover:to-blue-700 transition-colors no-print"
      >
        <div className="flex items-center">
          <div className="bg-white text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4">
            {day.day}
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold">{day.title}</h2>
            <p className="text-blue-100">{format(new Date(day.date), 'EEEE, MMMM d, yyyy')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {day.estimatedCost && (
            <span className="bg-white/20 px-4 py-2 rounded-lg font-semibold">
              {day.estimatedCost}
            </span>
          )}
          {expanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </div>
      </button>

      {/* Print-only header */}
      <div className="print-only bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Day {day.day}: {day.title}</h2>
        <p className="text-blue-100">{format(new Date(day.date), 'EEEE, MMMM d, yyyy')}</p>
        {day.estimatedCost && <p className="mt-2 font-semibold">Estimated Cost: {day.estimatedCost}</p>}
      </div>

      {/* Day Content */}
      <div className={`${expanded ? 'block' : 'hidden'} print:block p-6`}>
        {/* Activities */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Activities
          </h3>
          <div className="space-y-4">
            {day.activities.map((activity, index) => (
              <ActivityCard
                key={index}
                activity={activity as EnrichedActivity}
                onImageClick={(images, title) => onImageClick(images, title)}
              />
            ))}
          </div>
        </div>

        {/* Restaurants */}
        {day.restaurants.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Utensils className="w-5 h-5 mr-2 text-blue-600" />
              Dining Recommendations
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {day.restaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={index}
                  restaurant={restaurant as EnrichedRestaurant}
                  onImageClick={(images, title) => onImageClick(images, title)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityCard({ activity, onImageClick }: {
  activity: EnrichedActivity
  onImageClick: (images: string[], title: string) => void
}) {
  return (
    <div className="activity-card">
      <div className="flex flex-col md:flex-row gap-4">
        {activity.image && (
          <div
            className="relative w-full md:w-48 h-48 group cursor-pointer"
            onClick={() => onImageClick(activity.images || [activity.image!], activity.title)}
          >
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon className="w-12 h-12 text-white drop-shadow-lg" />
                {activity.images && activity.images.length > 1 && (
                  <p className="text-white text-sm mt-2 text-center">
                    {activity.images.length} photos
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {activity.time}
                </span>
                {activity.duration && (
                  <span className="text-gray-600 text-sm">{activity.duration}</span>
                )}
              </div>
              <h4 className="text-lg font-bold text-gray-900">{activity.title}</h4>
            </div>
            {activity.cost && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                <DollarSign className="w-3 h-3 mr-1" />
                {activity.cost}
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-2">{activity.description}</p>

          {activity.location && (
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{activity.location}</span>
              {activity.mapUrl && (
                <a
                  href={activity.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 flex items-center no-print"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  <span className="text-xs">View on Map</span>
                </a>
              )}
            </div>
          )}

          {activity.tips && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-2">
              <p className="text-sm text-yellow-800">
                <strong>Tip:</strong> {activity.tips}
              </p>
            </div>
          )}

          {activity.searchUrl && (
            <a
              href={activity.searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm no-print"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Learn More Online
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function RestaurantCard({ restaurant, onImageClick }: {
  restaurant: EnrichedRestaurant
  onImageClick: (images: string[], title: string) => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {restaurant.image && (
        <div
          className="relative w-full h-32 group cursor-pointer mb-3"
          onClick={() => onImageClick(restaurant.images || [restaurant.image!], restaurant.name)}
        >
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageIcon className="w-8 h-8 text-white drop-shadow-lg" />
              {restaurant.images && restaurant.images.length > 1 && (
                <p className="text-white text-xs mt-1 text-center">
                  {restaurant.images.length} photos
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-bold text-gray-900">{restaurant.name}</h4>
        {restaurant.vegetarianFriendly && (
          <Leaf className="w-4 h-4 text-green-600 flex-shrink-0" aria-label="Vegetarian Friendly" />
        )}
      </div>

      <div className="flex items-center gap-2 mb-2 text-sm">
        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{restaurant.cuisine}</span>
        <span className="text-gray-600">{restaurant.priceRange}</span>
      </div>

      {restaurant.description && (
        <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <div className="flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {restaurant.location}
        </div>
        {restaurant.mapUrl && (
          <a
            href={restaurant.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center no-print"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Map
          </a>
        )}
      </div>

      {restaurant.searchUrl && (
        <a
          href={restaurant.searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm no-print"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Learn More Online
        </a>
      )}
    </div>
  )
}

function generateStandaloneHTML(itinerary: TripItinerary): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${itinerary.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(to bottom right, #eff6ff, #eef2ff); padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { background: linear-gradient(to right, #2563eb, #9333ea); color: white; padding: 3rem; border-radius: 1rem; margin-bottom: 2rem; }
    .header h1 { font-size: 2.5rem; margin-bottom: 1rem; }
    .header-info { display: flex; gap: 2rem; flex-wrap: wrap; font-size: 1.1rem; }
    .overview { background: white; padding: 2rem; border-radius: 1rem; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .tips { background: #dbeafe; padding: 2rem; border-radius: 1rem; margin-bottom: 2rem; }
    .tips ul { margin-left: 1.5rem; }
    .day { background: white; border-radius: 1rem; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); page-break-inside: avoid; }
    .day-header { background: linear-gradient(to right, #3b82f6, #2563eb); color: white; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem; }
    .day-header h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .activity { background: #f9fafb; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1rem; border: 1px solid #e5e7eb; }
    .activity-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem; }
    .activity-title { font-size: 1.2rem; font-weight: bold; }
    .time-badge { background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.9rem; font-weight: 600; display: inline-block; margin-bottom: 0.5rem; }
    .cost-badge { background: #dcfce7; color: #166534; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.9rem; font-weight: 600; }
    .activity img { width: 100%; max-width: 400px; height: 250px; object-fit: cover; border-radius: 0.5rem; margin: 1rem 0; }
    .location { color: #6b7280; font-size: 0.9rem; margin: 0.5rem 0; }
    .tips-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 0.75rem; margin-top: 0.5rem; }
    .restaurants { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
    .restaurant { background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; }
    .restaurant img { width: 100%; height: 150px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 0.5rem; }
    .restaurant h4 { font-size: 1.1rem; margin-bottom: 0.5rem; }
    .cuisine-badge { background: #f3e8ff; color: #6b21a8; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.85rem; display: inline-block; margin-right: 0.5rem; }
    .section-title { font-size: 1.3rem; font-weight: bold; margin: 1.5rem 0 1rem 0; color: #1f2937; }
    @media print {
      body { background: white; }
      .day { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${itinerary.title}</h1>
      <div class="header-info">
        <div>📍 ${itinerary.destination}</div>
        <div>🗓️ ${itinerary.duration} days</div>
        <div>📅 ${format(new Date(itinerary.startDate), 'MMM d')} - ${format(new Date(itinerary.endDate), 'MMM d, yyyy')}</div>
        ${itinerary.totalEstimatedCost ? `<div>💰 ${itinerary.totalEstimatedCost}</div>` : ''}
      </div>
    </div>

    ${itinerary.overview ? `
    <div class="overview">
      <h2 class="section-title">Overview</h2>
      <p>${itinerary.overview}</p>
    </div>
    ` : ''}

    ${itinerary.practicalTips && itinerary.practicalTips.length > 0 ? `
    <div class="tips">
      <h2 class="section-title">Practical Tips</h2>
      <ul>
        ${itinerary.practicalTips.map(tip => `<li>${tip}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    ${itinerary.days.map(day => `
    <div class="day">
      <div class="day-header">
        <h2>Day ${day.day}: ${day.title}</h2>
        <div>${format(new Date(day.date), 'EEEE, MMMM d, yyyy')}</div>
        ${day.estimatedCost ? `<div>Estimated Cost: ${day.estimatedCost}</div>` : ''}
      </div>

      <h3 class="section-title">⏰ Activities</h3>
      ${day.activities.map(activity => `
      <div class="activity">
        <span class="time-badge">${activity.time}</span>
        <div class="activity-header">
          <div class="activity-title">${activity.title}</div>
          ${activity.cost ? `<span class="cost-badge">${activity.cost}</span>` : ''}
        </div>
        ${activity.image ? `<img src="${activity.image}" alt="${activity.title}">` : ''}
        <p>${activity.description}</p>
        ${activity.location ? `<div class="location">📍 ${activity.location}</div>` : ''}
        ${activity.duration ? `<div class="location">⏱️ ${activity.duration}</div>` : ''}
        ${activity.tips ? `<div class="tips-box"><strong>Tip:</strong> ${activity.tips}</div>` : ''}
      </div>
      `).join('')}

      ${day.restaurants.length > 0 ? `
      <h3 class="section-title">🍽️ Dining Recommendations</h3>
      <div class="restaurants">
        ${day.restaurants.map(restaurant => `
        <div class="restaurant">
          ${restaurant.image ? `<img src="${restaurant.image}" alt="${restaurant.name}">` : ''}
          <h4>${restaurant.name} ${restaurant.vegetarianFriendly ? '🌱' : ''}</h4>
          <div>
            <span class="cuisine-badge">${restaurant.cuisine}</span>
            <span>${restaurant.priceRange}</span>
          </div>
          ${restaurant.description ? `<p style="margin-top: 0.5rem; font-size: 0.9rem;">${restaurant.description}</p>` : ''}
          <div class="location">${restaurant.location}</div>
        </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
    `).join('')}
  </div>
</body>
</html>`
}
