import { Pinecone } from '@pinecone-database/pinecone';

async function setupPineconeIndex() {
  // Initialize Pinecone client with your API key
  const pc = new Pinecone({
    apiKey: 'pcsk_2sPDdc_Ca2RfBNAp3wWf6c3uYP2A9y5sBui7F3MfZQ5KYCeyk8CjhfZTq3D7nbqqRyE2sU'
  });

  const indexName = 'document-chatbot';

  try {
    // Check if index already exists
    const indexes = await pc.listIndexes();
    const indexExists = indexes.indexes?.some(index => index.name === indexName);

    if (indexExists) {
      console.log(`Index "${indexName}" already exists.`);
      const index = pc.index(indexName);
      const stats = await index.describeIndexStats();
      console.log('Index stats:', stats);
      return;
    }

    // Create index for Google's embedding-001 model
    // Google's embedding-001 model produces 768-dimensional vectors
    console.log(`Creating index "${indexName}"...`);

    await pc.createIndex({
      name: indexName,
      dimension: 768, // Google embedding-001 dimension
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      },
      waitUntilReady: true
    });

    console.log(`Index "${indexName}" created successfully!`);

    // Verify the index is ready
    const index = pc.index(indexName);
    const stats = await index.describeIndexStats();
    console.log('Index stats:', stats);

  } catch (error) {
    console.error('Error setting up Pinecone index:', error);
    process.exit(1);
  }
}

// Run the setup
setupPineconeIndex()
  .then(() => {
    console.log('Pinecone setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });