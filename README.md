# Travel Itinerary Generator

A beautiful, AI-powered web application for creating and sharing travel itineraries. Import from Excel or generate custom itineraries using Google Gemini AI (100% FREE!) with automatic photo integration.

![Travel Itinerary Generator](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)

## Features

### Two Creation Modes

1. **Import Mode**
   - Upload Excel files (.xlsx, .xls) with your trip details
   - Automatic parsing and beautiful formatting
   - Supports day-by-day activities and restaurant recommendations

2. **Generate Mode**
   - AI-powered itinerary generation using Google Gemini API (FREE!)
   - Customize by destination, dates, pace, budget, and interests
   - Vegetarian-friendly restaurant filtering
   - Personalized recommendations based on your preferences

### Rich Itinerary Display

- 📅 **Day-by-day breakdown** with collapsible sections
- 🖼️ **High-quality photos** automatically fetched for each location
- 🗺️ **Google Maps integration** for easy navigation
- 🍽️ **Restaurant recommendations** with cuisine types and price ranges
- 💰 **Cost estimates** for budgeting
- 💡 **Practical tips** for each activity
- 🌱 **Vegetarian-friendly** indicators
- 📱 **Mobile-responsive** design
- 🖨️ **Print-friendly** CSS

### Export Options

- **Standalone HTML**: Download a self-contained HTML file
- **Print**: Print-optimized layout
- **Vercel Deployment**: One-click deployment ready

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (FREE - 1,500 requests/day)
- **Image Search**: Google Custom Search API (optional - uses Unsplash fallback)
- **Excel Parsing**: xlsx library
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Google Gemini API key (for Generate mode) - 100% FREE!
- Google Custom Search API key and Search Engine ID (optional - for photos)

### Installation

1. **Clone or download the repository**

```bash
cd travel-itinerary-app
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Google Gemini API Key (FREE!)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Custom Search API Configuration (OPTIONAL)
GOOGLE_SEARCH_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

### Getting API Keys

#### Google Gemini API (FREE!)

**Important**: Use Google Cloud Console (not AI Studio) for proper API access.

1. **Enable Generative Language API**
   - Go to: [https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com)
   - Make sure you have a project selected (or create a new one)
   - Click "**ENABLE**"
   - Wait 30-60 seconds for activation

2. **Create API Key**
   - Go to: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
   - Click "**+ CREATE CREDENTIALS**"
   - Select "**API key**"
   - Copy the key immediately (starts with `AIza...`)

3. **Restrict API Key** (IMPORTANT for security!)
   - After creating the key, click "**RESTRICT KEY**" (or edit the key)
   - Under "API restrictions":
     - Select "**Restrict key**"
     - Check only "**Generative Language API**"
   - Under "Application restrictions" (optional):
     - Select "HTTP referrers" for web apps
     - Or select "IP addresses" and add your server IP
   - Click "**Save**"

4. **Add to .env file**
   ```
   GEMINI_API_KEY=AIza...your_key_here
   ```

**Free Tier**:
- Gemini 1.5 Flash: 15 RPM, 1,500 requests/day (FREE)
- Gemini 1.5 Pro: 2 RPM, 50 requests/day (FREE)
- Perfect for personal use - no credit card required!

#### Google Custom Search API

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Custom Search API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Custom Search API"
   - Click "Enable"

3. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key immediately

4. **Restrict API Key** (IMPORTANT for security!)
   - Click "**RESTRICT KEY**" on the newly created key
   - Under "API restrictions":
     - Select "**Restrict key**"
     - Check only "**Custom Search API**"
   - Click "**Save**"
   - Copy the API key to your `.env` file as `GOOGLE_SEARCH_API_KEY`

5. **Create Custom Search Engine**
   - Visit [Programmable Search Engine](https://programmablesearchengine.google.com/)
   - Click "Add" to create a new search engine
   - In "Sites to search", enter `www.google.com`
   - In Settings:
     - Enable "Image Search"
     - Enable "Search the entire web"
   - Copy the "Search engine ID" to your `.env` file as `GOOGLE_SEARCH_ENGINE_ID`

**Note**: If you don't configure Google Search API, the app will use Unsplash placeholder images instead.

#### Using Multiple API Keys (Advanced)

To avoid hitting rate limits on the Google Custom Search API (100 requests/day for free tier), you can provide multiple API keys. The app will automatically rotate through them.

**Setup**:
1. Create multiple API keys following the same steps above
2. In your `.env` file, separate the keys with commas:

```env
GOOGLE_SEARCH_API_KEY=key1,key2,key3
```

**How it works**:
- The app automatically rotates through keys using round-robin
- If a key hits rate limits (429 error), it tries the next key
- With 3 keys, you effectively get 300 requests/day instead of 100
- Works seamlessly without any code changes

### Running the Application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Using Import Mode

1. Click "Import from Excel" on the home page
2. Prepare your Excel file following the structure guide (see below)
3. Upload the file
4. Click "Generate Itinerary"
5. View your beautiful itinerary with photos and maps
6. Export as HTML or print

#### Excel File Structure

Your Excel file should follow this format:

```
Row 1: [Trip Title]
Row 2: [Destination]
Row 3: [Start Date] | [End Date]
Row 4: (blank)
Row 5: Day 1 | [Day Title] | [Estimated Cost]
Row 6: Activities
Row 7: [Time] | [Title] | [Description] | [Location] | [Duration] | [Cost] | [Tips]
Row 8: [Time] | [Title] | [Description] | [Location] | [Duration] | [Cost] | [Tips]
...
Row X: Restaurants
Row X+1: [Name] | [Cuisine] | [Price Range] | [Veg-Friendly] | [Location] | [Description]
...
```

**Example**:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Amazing Tokyo Adventure | | | | | | |
| Tokyo, Japan | | | | | | |
| 2024-03-15 | 2024-03-20 | | | | | |
| | | | | | | |
| Day 1 | Arrival & Shibuya | $150 | | | | |
| Activities | | | | | | |
| 09:00 | Arrival at Narita | Land and clear customs | Narita Airport | 2 hours | Free | Exchange yen at airport |
| 15:00 | Shibuya Crossing | World's busiest crossing | Shibuya Crossing | 1 hour | Free | Best view from Starbucks |
| Restaurants | | | | | | |
| Ichiran Ramen | Ramen | $ | Yes | Shibuya | Famous tonkotsu ramen |
| Gonpachi | Izakaya | $$ | Yes | Shibuya | Kill Bill restaurant |

See `sample-trip-template.xlsx` for a complete example.

### Using Generate Mode

1. Click "Generate with AI" on the home page
2. Fill in the form:
   - **Destination**: Where you want to go
   - **Dates**: Start and end dates
   - **Travel Pace**: Relaxed (2-3 activities/day), Moderate (4-5), or Packed (6+)
   - **Budget**: Budget, Moderate, or Luxury
   - **Interests**: Select multiple interests
   - **Dietary**: Toggle vegetarian-only restaurants if needed
   - **Additional Preferences**: Any special requests
3. Click "Generate Itinerary"
4. Wait for AI to create your personalized itinerary (30-60 seconds)
5. Review, export, or print

## Project Structure

```
travel-itinerary-app/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts          # Claude API integration
│   │   └── images/
│   │       └── route.ts          # Google Image Search API
│   ├── globals.css               # Global styles and print CSS
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ImportMode.tsx            # Excel import interface
│   ├── GenerateMode.tsx          # AI generation form
│   └── ItineraryDisplay.tsx      # Main itinerary display
├── types/
│   └── index.ts                  # TypeScript type definitions
├── utils/
│   └── excelParser.ts            # Excel parsing logic
├── public/
├── .env.example                  # Environment variable template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub** (if not already)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy to Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

- Click the button above or go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables in Vercel dashboard:
  - `GEMINI_API_KEY`
  - `GOOGLE_SEARCH_API_KEY`
  - `GOOGLE_SEARCH_ENGINE_ID`
- Click "Deploy"

3. **Your app is live!** 🎉

### Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable:
   - Name: `ANTHROPIC_API_KEY`, Value: your key
   - Name: `GOOGLE_SEARCH_API_KEY`, Value: your key
   - Name: `GOOGLE_SEARCH_ENGINE_ID`, Value: your ID
4. Redeploy if necessary

## Features in Detail

### Itinerary Display

- **Collapsible Days**: Click to expand/collapse each day
- **Activity Cards**: Rich cards with images, timing, locations, costs, and tips
- **Restaurant Cards**: Cuisine type, price range, vegetarian indicators
- **Google Maps Links**: One-click navigation to locations
- **Responsive Images**: Automatically fetched and optimized

### Export to HTML

The exported HTML file is:
- **Self-contained**: All styles inline, no external dependencies
- **Portable**: Works offline, can be shared via email
- **Print-ready**: Optimized for printing
- **Beautiful**: Maintains the design from the web version

### Print Functionality

The app includes print-optimized CSS:
- Hides navigation and action buttons
- Shows all days (ignores collapse state)
- Optimizes page breaks
- Maintains readability in black & white

## Customization

### Styling

Edit `app/globals.css` and `tailwind.config.ts` to customize:
- Color scheme (primary colors)
- Fonts
- Spacing
- Print styles

### AI Prompts

Modify `app/api/generate/route.ts` to adjust:
- Claude model selection
- Prompt engineering
- Response format
- Activity count per day

### Excel Format

Adjust `utils/excelParser.ts` to support:
- Different column orders
- Additional fields
- Multiple sheets
- Custom metadata

## Troubleshooting

### "Gemini API key not configured"

- Ensure `.env` file exists and contains `GEMINI_API_KEY`
- Restart dev server after adding environment variables
- Check for typos in the key

### Images not loading

- Verify Google Custom Search API is enabled
- Check `GOOGLE_SEARCH_API_KEY` and `GOOGLE_SEARCH_ENGINE_ID` are correct
- The app will fall back to Unsplash if Google API is not configured

### Excel parsing errors

- Ensure your Excel file follows the expected structure
- Check date formats (YYYY-MM-DD recommended)
- Verify "Day X" headers are present
- See sample template for reference

### Build errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## API Usage and Costs

### Google Gemini API (100% FREE!)

- **Free tier**: 15 requests/minute, 1,500 requests/day
- **Cost per itinerary**: $0.00 (FREE!)
- **Typical usage**: 1-50 itineraries per day easily fits in free tier
- **No credit card required**
- **Perfect for**: Personal use, development, small production apps

### Google Custom Search API (Optional)

- **Free quota**: 100 queries/day
- **Paid**: $5 per 1,000 queries after free tier
- **Each itinerary**: ~5-30 image queries
- **Alternative**: App uses free Unsplash images as fallback

### Total Monthly Cost

- **Without Google Image Search**: $0.00 (100% FREE)
- **With Google Image Search**: $0-5/month depending on usage

**Tip**: Start with just Gemini API. The app works great with free Unsplash images!

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For questions or issues:
- Check the Troubleshooting section
- Review the Usage Guide
- Open an issue on GitHub

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Google Gemini](https://ai.google.dev/) (FREE!)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Happy Travels!** ✈️🌍
