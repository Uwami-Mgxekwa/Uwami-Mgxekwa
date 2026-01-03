const fs = require('fs');
const https = require('https');

const NEWS_API_KEY = process.env.NEWS_API_KEY || '9d147cd7390443e281284123aa6160df';
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?category=technology&country=us&pageSize=5&apiKey=${NEWS_API_KEY}`;

function fetchNews() {
  return new Promise((resolve, reject) => {
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
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function formatNewsForMarkdown(articles) {
  if (!articles || articles.length === 0) {
    return '<p align="center">📰 No tech news available at the moment</p>';
  }

  let newsHTML = '<div align="center">\n\n';
  
  articles.slice(0, 5).forEach((article, index) => {
    // Skip articles without title or description
    if (!article.title || !article.description) return;
    
    const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const title = article.title.length > 80 ? 
      article.title.substring(0, 80) + '...' : article.title;
    const description = article.description ? 
      (article.description.length > 150 ? 
        article.description.substring(0, 150) + '...' : article.description) 
      : 'No description available';

    // Add image if available (using simple img tag)
    if (article.urlToImage) {
      newsHTML += `<img src="${article.urlToImage}" alt="${title}" width="500">\n\n`;
    }
    
    // Title as header
    newsHTML += `### 📰 [${title}](${article.url})\n\n`;
    
    // Description
    newsHTML += `${description}\n\n`;
    
    // Meta info
    newsHTML += `**📅 ${publishedDate}** | **📰 ${article.source.name}**\n\n`;
    
    // Add separator between articles (except for the last one)
    if (index < Math.min(articles.length, 5) - 1) {
      newsHTML += `---\n\n`;
    }
  });
  
  newsHTML += `\n\n*Last updated: ${new Date().toLocaleString()}* 🕒\n\n`;
  newsHTML += `*Powered by [NewsAPI](https://newsapi.org)* ⚡\n\n`;
  newsHTML += `</div>`;
  
  return newsHTML;
}

async function updateReadme() {
  try {
    console.log('Fetching tech news...');
    const newsData = await fetchNews();
    
    if (newsData.status !== 'ok') {
      throw new Error(`API Error: ${newsData.message}`);
    }
    
    const newsMarkdown = formatNewsForMarkdown(newsData.articles);
    
    // Read current README
    const readmeContent = fs.readFileSync('README.md', 'utf8');
    
    // Replace the tech news section
    const startMarker = '## 📰 Latest Tech News';
    const endMarker = '## 🌐 Connect With Me';
    
    const startIndex = readmeContent.indexOf(startMarker);
    const endIndex = readmeContent.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Could not find tech news section markers in README');
    }
    
    const beforeNews = readmeContent.substring(0, startIndex);
    const afterNews = readmeContent.substring(endIndex);
    
    const newReadmeContent = beforeNews + startMarker + '\n\n' + 
      '<div align="center">\n' +
      '  <img src="https://user-images.githubusercontent.com/74038190/212284136-03988914-d899-44b4-b1d9-4eeccf656e44.gif" width="700"><br><br>\n' +
      '</div>\n\n' +
      newsMarkdown + '\n\n---\n\n' + afterNews;
    
    // Write updated README
    fs.writeFileSync('README.md', newReadmeContent);
    console.log('README updated successfully with latest tech news!');
    
  } catch (error) {
    console.error('Error updating README:', error.message);
    process.exit(1);
  }
}

updateReadme();