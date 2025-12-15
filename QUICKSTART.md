# Quick Start Guide

Get your Travel Itinerary Generator running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd travel-itinerary-app
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Add your API keys to `.env`:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
GOOGLE_SEARCH_API_KEY=AIzaSyxxxxx
GOOGLE_SEARCH_ENGINE_ID=xxxxx
```

**Don't have API keys yet?** The app will still work with limited functionality:
- Import mode will work fully (Excel upload)
- Generate mode requires Anthropic API key
- Images will use Unsplash placeholders without Google API

## Step 3: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 4: Try It Out!

### Option A: Test with Import Mode

1. Create a simple Excel file following this structure:

| Column A | Column B | Column C |
|----------|----------|----------|
| Weekend in Paris | | |
| Paris, France | | |
| 2024-06-01 | 2024-06-03 | |
| | | |
| Day 1 | Arrival | $100 |
| Activities | | |
| 14:00 | Eiffel Tower | Visit iconic tower | Eiffel Tower | 2 hours | $30 | Book online |

2. Save as `test-trip.xlsx`
3. Upload in the app
4. See your beautiful itinerary!

### Option B: Test with Generate Mode

1. Click "Generate with AI"
2. Fill in:
   - Destination: "Paris, France"
   - Dates: Pick any 3-day range
   - Select a few interests
   - Click Generate
3. Wait 30-60 seconds
4. Enjoy your AI-generated itinerary!

## Step 5: Export Your Itinerary

- Click "Export HTML" to download a standalone file
- Click "Print" for a print-friendly version
- Share with friends or keep for your trip!

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [EXCEL_TEMPLATE_GUIDE.md](EXCEL_TEMPLATE_GUIDE.md) for Excel file structure
- Deploy to Vercel for free hosting

## Troubleshooting

**"Module not found" errors?**
```bash
rm -rf node_modules
npm install
```

**Environment variables not working?**
- Restart the dev server after changing `.env`
- Check for typos in variable names

**Excel parsing fails?**
- Make sure your file follows the structure guide
- Check date format: YYYY-MM-DD
- Verify "Day X" headers exist

## Getting API Keys (Quick Links)

1. **Anthropic Claude**: [console.anthropic.com](https://console.anthropic.com/)
2. **Google Cloud**: [console.cloud.google.com](https://console.cloud.google.com/)
3. **Programmable Search**: [programmablesearchengine.google.com](https://programmablesearchengine.google.com/)

See full setup instructions in [README.md](README.md).

## Production Deployment

Deploy to Vercel in 2 minutes:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Redeploy if needed
```

Or use the GitHub integration:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Done!

---

**Need help?** Check the [README.md](README.md) or open an issue on GitHub.

**Ready to travel!** ✈️
