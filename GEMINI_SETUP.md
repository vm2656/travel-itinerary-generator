# Get Your FREE Gemini API Key

Google Gemini is 100% FREE for personal use with a generous quota!

## Quick Setup (3 minutes)

### Step 1: Enable Generative Language API

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

2. **Enable the API**
   - Make sure you have a project selected (create one if needed)
   - Click "**ENABLE**"
   - Wait 30-60 seconds

### Step 2: Create API Key

1. **Go to Credentials Page**
   - Visit: https://console.cloud.google.com/apis/credentials

2. **Create the Key**
   - Click "**+ CREATE CREDENTIALS**"
   - Select "**API key**"
   - Copy the API key immediately (starts with "AIza...")

### Step 3: Restrict API Key (IMPORTANT!)

1. **Secure Your Key**
   - Click "**RESTRICT KEY**" on the newly created key
   - Under "API restrictions":
     - Select "**Restrict key**"
     - Check only "**Generative Language API**"
   - Click "**Save**"

This prevents your key from being used for other Google APIs if it's ever exposed.

### Step 4: Add to Your App

1. **Open your project**:
   ```bash
   cd /tmp/travel-itinerary-app
   ```

2. **Create .env file**:
   ```bash
   cp .env.example .env
   ```

3. **Edit .env and add your key**:
   ```env
   GEMINI_API_KEY=AIza...your_actual_key_here
   ```

4. **That's it!** 🎉

## Run the App

```bash
# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

Open http://localhost:3000 and try the "Generate with AI" mode!

## Gemini Free Tier Limits

- ✅ **15 requests per minute**
- ✅ **1,500 requests per day**
- ✅ **100% FREE forever** (no credit card needed)
- ✅ **No usage limits for moderate use**

For a travel itinerary app, this is MORE than enough!

## What You Get

With Gemini API, you can:
- Generate unlimited itineraries (within free quota)
- Create detailed day-by-day plans
- Get restaurant recommendations
- Receive practical travel tips
- All completely FREE!

## Comparison

| Feature | Gemini (Google) | Claude (Anthropic) | GPT-4 (OpenAI) |
|---------|-----------------|-------------------|----------------|
| Free Tier | ✅ YES (1500/day) | ❌ NO | ⚠️ Limited ($5 credit) |
| Cost | FREE | ~$0.10/itinerary | ~$0.05/itinerary |
| Speed | Fast | Fast | Medium |
| Quality | Excellent | Excellent | Excellent |

**Winner for this app**: Gemini (100% free!)

## Troubleshooting

### "API key not configured" error
- Make sure `.env` file exists in project root
- Check that the key starts with `AIza`
- Restart the dev server after adding the key

### "Quota exceeded" error
- You've hit the free tier limit (1500/day)
- Wait until tomorrow (resets at midnight PT)
- Or upgrade to paid tier (but free tier is usually enough)

### Key not working
- Make sure you copied the entire key
- Check for extra spaces or quotes
- Try regenerating the key in AI Studio

## Need Help?

Visit the Google AI documentation:
- AI Studio: https://aistudio.google.com/
- API Docs: https://ai.google.dev/docs
- Pricing: https://ai.google.dev/pricing

## Next Steps

1. ✅ Get your free Gemini API key
2. ✅ Add it to `.env` file
3. ✅ Run `npm install`
4. ✅ Run `npm run dev`
5. ✅ Try generating an itinerary!
6. ✅ Enjoy unlimited free AI-powered trip planning!

---

**No credit card. No payment. 100% FREE.** 🎉
