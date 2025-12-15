const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.argv[2];
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    // Try to list models
    const models = await genAI.listModels();
    console.log('Available models:');
    for await (const model of models) {
      console.log('- ', model.name, ':', model.displayName);
    }
  } catch (error) {
    console.error('Error listing models:', error.message);
    console.log('\n❌ Your API key is not properly configured!');
    console.log('\n📋 Follow these steps:');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Select your project (or create one)');
    console.log('3. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    console.log('4. Click "ENABLE"');
    console.log('5. Wait 1-2 minutes for it to activate');
    console.log('6. Try again!');
  }
}

run();
