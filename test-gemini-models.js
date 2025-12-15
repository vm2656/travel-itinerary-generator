const { GoogleGenerativeAI } = require('@google/generative-ai');

// Read API key from command line argument
const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Usage: node test-gemini-models.js YOUR_API_KEY');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('Fetching available models...\n');

    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'models/gemini-pro',
      'models/gemini-1.5-pro'
    ];

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        console.log(`✅ ${modelName} - WORKS!`);
      } catch (error) {
        console.log(`❌ ${modelName} - ${error.message.split('\n')[0]}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
