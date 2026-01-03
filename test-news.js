// Test script to verify news API functionality
const https = require('https');

const NEWS_API_KEY = '9d147cd7390443e281284123aa6160df';
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?category=technology&country=us&pageSize=3&apiKey=${NEWS_API_KEY}`;

console.log('Testing NewsAPI connection...');
console.log('API URL:', NEWS_API_URL.replace(NEWS_API_KEY, 'YOUR_API_KEY'));

const url = new URL(NEWS_API_URL);

const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname + url.search,
  method: 'GET',
  headers: {
    'User-Agent': 'GitHub-README-Tech-News/1.0 (https://github.com/Uwami-Mgxekwa)',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const newsData = JSON.parse(data);
      
      if (newsData.status === 'ok') {
        console.log('✅ API connection successful!');
        console.log(`📰 Found ${newsData.articles.length} articles`);
        
        if (newsData.articles.length > 0) {
          console.log('\n📋 Sample article:');
          const article = newsData.articles[0];
          console.log(`Title: ${article.title}`);
          console.log(`Source: ${article.source.name}`);
          console.log(`Published: ${article.publishedAt}`);
        }
      } else {
        console.log('❌ API Error:', newsData.message);
      }
    } catch (error) {
      console.log('❌ JSON Parse Error:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request Error:', error.message);
});

req.end();