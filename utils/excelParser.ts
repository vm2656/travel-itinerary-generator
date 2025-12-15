import * as XLSX from 'xlsx'
import { TripItinerary, DayItinerary, Activity, Restaurant } from '@/types'

export function parseExcelToItinerary(file: File): Promise<TripItinerary> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })

        // Assuming first sheet contains the itinerary
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

        // Parse the Excel data into our itinerary structure
        const itinerary = parseSheetData(jsonData)
        resolve(itinerary)
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + (error as Error).message))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsBinaryString(file)
  })
}

function parseSheetData(data: any[][]): TripItinerary {
  // Expected format:
  // Row 1: Trip Title
  // Row 2: Destination
  // Row 3: Start Date | End Date
  // Row 4: (blank)
  // Row 5+: Day details in sections

  const title = data[0]?.[0] || 'My Trip'
  const destination = data[1]?.[0] || 'Unknown Destination'
  const startDate = data[2]?.[0] || new Date().toISOString().split('T')[0]
  const endDate = data[2]?.[1] || new Date().toISOString().split('T')[0]

  // Calculate duration
  const start = new Date(startDate)
  const end = new Date(endDate)
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const days: DayItinerary[] = []
  let currentDay: DayItinerary | null = null
  let currentSection: 'activities' | 'restaurants' | null = null

  // Parse day-by-day data
  for (let i = 4; i < data.length; i++) {
    const row = data[i]

    if (!row || row.length === 0 || !row[0]) continue

    const firstCell = String(row[0]).trim()

    // Check if this is a new day header
    if (firstCell.toLowerCase().startsWith('day ')) {
      if (currentDay) {
        days.push(currentDay)
      }

      const dayNumber = parseInt(firstCell.match(/\d+/)?.[0] || '1')
      const date = new Date(start)
      date.setDate(date.getDate() + dayNumber - 1)

      currentDay = {
        day: dayNumber,
        date: date.toISOString().split('T')[0],
        title: row[1] || `Day ${dayNumber}`,
        activities: [],
        restaurants: [],
        estimatedCost: row[2] || undefined,
      }
      currentSection = null
    }
    // Check for section headers
    else if (firstCell.toLowerCase() === 'activities' || firstCell.toLowerCase() === 'activity') {
      currentSection = 'activities'
    }
    else if (firstCell.toLowerCase() === 'restaurants' || firstCell.toLowerCase() === 'dining') {
      currentSection = 'restaurants'
    }
    // Parse activity or restaurant data
    else if (currentDay && currentSection) {
      if (currentSection === 'activities') {
        const activity: Activity = {
          time: row[0] || '',
          title: row[1] || '',
          description: row[2] || '',
          location: row[3] || '',
          duration: row[4] || undefined,
          cost: row[5] || undefined,
          tips: row[6] || undefined,
        }
        if (activity.title) {
          currentDay.activities.push(activity)
        }
      } else if (currentSection === 'restaurants') {
        const restaurant: Restaurant = {
          name: row[0] || '',
          cuisine: row[1] || '',
          priceRange: row[2] || '',
          vegetarianFriendly: String(row[3]).toLowerCase() === 'yes' || String(row[3]).toLowerCase() === 'true',
          location: row[4] || '',
          description: row[5] || undefined,
        }
        if (restaurant.name) {
          currentDay.restaurants.push(restaurant)
        }
      }
    }
  }

  // Push the last day
  if (currentDay) {
    days.push(currentDay)
  }

  return {
    title,
    destination,
    startDate,
    endDate,
    duration,
    days,
  }
}

export function createSampleExcelStructure(): string {
  return `Sample Excel Structure:

Row 1: [Trip Title] | e.g., "Amazing Tokyo Adventure"
Row 2: [Destination] | e.g., "Tokyo, Japan"
Row 3: [Start Date] | [End Date] | e.g., "2024-03-15" | "2024-03-20"
Row 4: (blank)
Row 5: Day 1 | [Day Title] | [Estimated Cost]
Row 6: Activities
Row 7: [Time] | [Title] | [Description] | [Location] | [Duration] | [Cost] | [Tips]
Row 8: [Time] | [Title] | [Description] | [Location] | [Duration] | [Cost] | [Tips]
...
Row X: Restaurants
Row X+1: [Name] | [Cuisine] | [Price Range] | [Veg-Friendly (Yes/No)] | [Location] | [Description]
...
Row Y: Day 2 | [Day Title] | [Estimated Cost]
...

Example:
Amazing Tokyo Adventure
Tokyo, Japan
2024-03-15 | 2024-03-20

Day 1 | Arrival & Shibuya Exploration | $150
Activities
09:00 | Arrival at Narita | Land and clear customs | Narita Airport | 2 hours | Free | Exchange some yen at airport
12:00 | Hotel Check-in | Settle into hotel in Shibuya | Shibuya | 1 hour | $200 | Store luggage if room not ready
15:00 | Shibuya Crossing | Experience the world's busiest crossing | Shibuya Crossing | 1 hour | Free | Best views from Starbucks 2nd floor
17:00 | Meiji Shrine | Visit peaceful shrine in the city | Meiji Shrine | 2 hours | Free | Closes at sunset
Restaurants
Ichiran Ramen | Ramen | $ | Yes | Shibuya | Famous tonkotsu ramen chain with veg options
Gonpachi | Izakaya | $$ | Yes | Shibuya | Kill Bill restaurant with vegetarian menu
`
}
