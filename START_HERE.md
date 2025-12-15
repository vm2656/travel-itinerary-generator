# 🚀 Quick Start - Travel Itinerary Generator

## What You Need (5 minutes setup)

### Required (for AI generation):
- ✅ **Google Gemini API Key** - 100% FREE!
  - Get at: https://aistudio.google.com/app/apikey
  - No credit card needed
  - 1,500 free requests per day

### Optional (for better images):
- ⭐ **Google Custom Search API** - Skip this for now!
  - App uses free Unsplash images if you don't have this
  - Works great without it

## Setup Steps

### 1. Install Dependencies

```bash
cd /tmp/travel-itinerary-app
npm install
```

### 2. Get FREE Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Gmail (no credit card!)
3. Click "Create API Key"
4. Copy your key (starts with "AIza...")

### 3. Configure Your App

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and add your Gemini key:
```env
GEMINI_API_KEY=AIza...paste_your_key_here
```

### 4. Run the App

```bash
npm run dev
```

Open http://localhost:3000

## What You Can Do Now

### Option 1: Generate with AI (Requires Gemini API key)
1. Click "Generate with AI"
2. Fill in:
   - Destination: "Paris, France"
   - Pick dates (any 3-5 day range)
   - Select interests
   - Click "Generate Itinerary"
3. Wait 20-30 seconds
4. Get amazing AI-generated itinerary! ✨

### Option 2: Import Excel (No API key needed!)
1. Click "Import from Excel"
2. Create a simple Excel file using the guide
3. Or use the sample data from `SAMPLE_EXCEL_DATA.txt`
4. Upload and see instant results!

## Cost: $0.00

Everything is FREE:
- ✅ Gemini API: FREE (1,500 requests/day)
- ✅ Unsplash images: FREE
- ✅ App hosting on Vercel: FREE
- ✅ Excel import: FREE

**Total monthly cost: $0** 🎉

## Files You Need to Know

- **START_HERE.md** ← You are here!
- **GEMINI_SETUP.md** - Detailed Gemini API setup
- **README.md** - Full documentation
- **QUICKSTART.md** - Alternative quick start
- **EXCEL_TEMPLATE_GUIDE.md** - How to create Excel files

## Troubleshooting

**"Module not found" error?**
```bash
rm -rf node_modules
npm install
```

**"API key not configured"?**
- Check `.env` file exists
- Make sure key is correct
- Restart server: `npm run dev`

**Want better images?**
- For now, enjoy the free Unsplash images
- They look great!
- Set up Google Custom Search later if you want

## Next Steps

1. ✅ Get Gemini API key (free)
2. ✅ Run `npm install`
3. ✅ Add key to `.env`
4. ✅ Run `npm run dev`
5. ✅ Generate your first itinerary!
6. 🎉 Deploy to Vercel (optional, also free!)

## Need Help?

See **GEMINI_SETUP.md** for detailed Gemini API setup instructions.

---

**Ready to plan your next adventure!** ✈️

**Time to first itinerary: 5 minutes**
**Cost: $0.00**
**Awesomeness: 100%**
