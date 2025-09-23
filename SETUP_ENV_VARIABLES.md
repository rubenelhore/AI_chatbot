# Setting Up Environment Variables for Cloud Functions

The Cloud Functions require API keys for Pinecone and Google Gemini to work properly. You have two options:

## Option 1: Using Firebase Functions Environment Configuration (Recommended for production)

Set the environment variables using Firebase CLI:

```bash
firebase functions:config:set \
  pinecone.api_key="YOUR_PINECONE_API_KEY" \
  pinecone.index_name="document-chatbot" \
  gemini.api_key="YOUR_GEMINI_API_KEY"
```

Then update the Cloud Function code to read from config:

```javascript
const PINECONE_API_KEY = functions.config().pinecone?.api_key || process.env.PINECONE_API_KEY || '';
const PINECONE_INDEX_NAME = functions.config().pinecone?.index_name || process.env.PINECONE_INDEX_NAME || 'document-chatbot';
const GEMINI_API_KEY = functions.config().gemini?.api_key || process.env.GEMINI_API_KEY || '';
```

## Option 2: Using .env file (For local development and deployment)

1. Create a `.env` file in the `functions/` directory:

```bash
cd functions
cp .env.example .env
```

2. Edit the `.env` file and add your API keys:

```
PINECONE_API_KEY=your_actual_pinecone_api_key
PINECONE_INDEX_NAME=document-chatbot
GEMINI_API_KEY=your_actual_gemini_api_key
```

3. Make sure the functions are loading the .env file. Add this to the top of `functions/src/index.ts`:

```typescript
import * as dotenv from 'dotenv';
dotenv.config();
```

4. Install dotenv package:

```bash
cd functions
npm install dotenv
```

## Getting the API Keys

### Pinecone API Key:
1. Go to https://www.pinecone.io/
2. Sign up or log in
3. Go to API Keys section in your dashboard
4. Create a new API key or copy an existing one
5. Also create an index named "document-chatbot" with dimension 768

### Google Gemini API Key:
1. Go to https://makersuite.google.com/app/apikey or https://aistudio.google.com/
2. Sign in with your Google account
3. Click "Get API key" or "Create API key"
4. Copy the generated API key

## Deploy the functions after setting environment variables:

```bash
firebase deploy --only functions
```

## Verify the configuration:

```bash
firebase functions:config:get
```

This should show your configuration (keys will be visible).