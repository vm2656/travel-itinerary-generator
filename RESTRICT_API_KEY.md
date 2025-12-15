# How to Restrict Your Existing API Key

If you already created an API key and forgot to restrict it, follow these steps to secure it.

## Why Restrict Your API Key?

Unrestricted API keys can be used for ANY Google API if someone gets access to them. By restricting:
- ✅ Limits key to only specific APIs
- ✅ Prevents abuse if key is exposed
- ✅ Reduces potential costs (for paid APIs)
- ✅ Security best practice

## Steps to Restrict Existing Key

### For Gemini API Key

1. **Go to API Credentials**
   - Visit: https://console.cloud.google.com/apis/credentials

2. **Find Your Key**
   - Look in the "API Keys" section
   - Find the key you created (shows creation date)

3. **Edit the Key**
   - Click on the key name to open it
   - Or click the three dots (⋮) and select "Edit"

4. **Set API Restrictions**
   - Scroll to "API restrictions"
   - Select "**Restrict key**"
   - In the dropdown, check **only**:
     - ✅ **Generative Language API**
   - Uncheck everything else

5. **Optional: Set Application Restrictions**
   - Scroll to "Application restrictions"
   - For local development:
     - Select "**None**" (testing only)
   - For production:
     - Select "**HTTP referrers (web sites)**"
     - Add your domain: `https://yourdomain.com/*`
   - For server-side only:
     - Select "**IP addresses**"
     - Add your server IP

6. **Save Changes**
   - Click "**Save**" at the bottom
   - Wait a few seconds for changes to propagate

### For Google Custom Search API Key

Same steps as above, but in step 4, select:
- ✅ **Custom Search API**

## Verify Restrictions

After restricting, test your app:
1. Restart your dev server
2. Try generating an itinerary
3. If it works, your restrictions are correct!

## If You Restricted the Wrong API

If your app stops working after restricting:
1. Go back to the API key settings
2. Make sure you selected the correct API:
   - **Generative Language API** for Gemini
   - **Custom Search API** for images
3. Save and try again

## Creating a New Restricted Key

Alternatively, create a fresh key with restrictions:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "**+ CREATE CREDENTIALS**" > "**API key**"
3. Immediately click "**RESTRICT KEY**"
4. Follow steps 4-6 above
5. Update your `.env` file with the new key
6. Delete the old unrestricted key (click ⋮ > Delete)

## Best Practices

✅ **DO**:
- Always restrict API keys immediately after creation
- Use separate keys for different environments (dev/prod)
- Rotate keys periodically (every 90 days)
- Delete unused keys

❌ **DON'T**:
- Commit API keys to Git
- Share keys in public forums
- Use production keys for testing
- Leave keys unrestricted

## Need Help?

If you're unsure which API to select:
- **Gemini AI generation**: Generative Language API
- **Image search**: Custom Search API
- **Both**: Create two separate restricted keys

---

**Your key is now secure!** 🔒
