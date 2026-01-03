const fs = require('fs');
const https = require('https');

const NEWS_API_KEY = process.env.NEWS_API_KEY || '9d147cd7390443e281284123aa6160df';
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?category=technology&country=us&pageSize=5&apiKey=${NEWS_API_KEY}`;

function fetchNews() {
  return new Promise((resolve, reject) => {
    https.get(NEWS_API_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

function formatNewsForMarkdown(articles) {
  if (!articles || articles.length === 0) {
    return '<p align="center">📰 No tech news available at the moment</p>';
  }

  let newsHTML = '<div align="center">\n\n';
  
  articles.slice(0, 5).forEach((article, index) => {
    const publishedDate = new Date(article.publishedAt).toLocaleDateString();
    const title = article.title.length > 80 ? 
      article.title.substring(0, 80) + '...' : article.title;
    const description = article.description ? 
      (article.description.length > 120 ? 
        article.description.substring(0, 120) + '...' : article.description) 
      : 'No description available';

    newsHTML += `### 📰 [${title}](${article.url})\n`;
    newsHTML += `${description}\n\n`;
    newsHTML += `**📅 ${publishedDate}** | **📰 ${article.source.name}**\n\n`;
    newsHTML += '---\n\n';
  });
  
  newsHTML += `*Last updated: ${new Date().toLocaleString()}*\n\n`;
  newsHTML += '*Powered by [NewsAPI](https://newsapi.org)*\n\n';
  newsHTML += '</div>';
  
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
    const endMarker = '---\n\n## 🌐 Connect With Me';
    
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
      newsMarkdown + '\n\n' + afterNews;
    
    // Write updated README
    fs.writeFileSync('README.md', newReadmeContent);
    console.log('README updated successfully with latest tech news!');
    
  } catch (error) {
    console.error('Error updating README:', error.message);
    process.exit(1);
  }
}

updateReadme();