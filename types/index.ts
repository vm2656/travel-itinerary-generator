export interface Activity {
  time: string
  title: string
  description: string
  location: string
  duration?: string
  cost?: string
  tips?: string
  image?: string
  mapUrl?: string
}

export interface Restaurant {
  name: string
  cuisine: string
  priceRange: string
  vegetarianFriendly: boolean
  location: string
  description?: string
  image?: string
  mapUrl?: string
}

export interface DayItinerary {
  day: number
  date: string
  title: string
  activities: Activity[]
  restaurants: Restaurant[]
  notes?: string
  estimatedCost?: string
}

export interface TripItinerary {
  title: string
  destination: string
  startDate: string
  endDate: string
  duration: number
  days: DayItinerary[]
  overview?: string
  totalEstimatedCost?: string
  practicalTips?: string[]
  dietaryInfo?: {
    vegetarian: boolean
    vegan: boolean
    otherRestrictions?: string[]
  }
}

export interface GenerateFormData {
  destination: string
  startDate: string
  endDate: string
  pace: 'relaxed' | 'moderate' | 'packed'
  interests: string[]
  vegetarianOnly: boolean
  budget: 'budget' | 'moderate' | 'luxury'
  additionalPreferences?: string
}
