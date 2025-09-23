const https = require('https');

const data = JSON.stringify({
  data: {
    documentId: 'test-doc',
    filePath: 'test-path',
    fileName: 'test.pdf'
  }
});

const options = {
  hostname: 'us-central1-ai-chatbot-c0bed.cloudfunctions.net',
  port: 443,
  path: '/processDocument',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', d => {
    responseData += d;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
