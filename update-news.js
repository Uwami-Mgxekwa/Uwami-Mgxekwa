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
  
  // Filter articles with images and valid content, limit to 4
  const validArticles = articles.filter(article => 
    article.title && 
    article.description && 
    article.urlToImage
  ).slice(0, 4);
  
  validArticles.forEach((article, index) => {
    const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const title = article.title.length > 70 ? 
      article.title.substring(0, 70) + '...' : article.title;
    const description = article.description.length > 120 ? 
      article.description.substring(0, 120) + '...' : article.description;

    // Simple card structure that GitHub can handle
    newsHTML += `<table width="100%" style="margin-bottom: 30px; border: 2px solid #FFD700; border-radius: 10px;">\n`;
    newsHTML += `<tr>\n`;
    newsHTML += `<td align="center" style="padding: 0;">\n`;
    
    // Image
    newsHTML += `<img src="${article.urlToImage}" alt="${title}" width="100%" height="200" style="display: block;">\n`;
    
    newsHTML += `</td>\n`;
    newsHTML += `</tr>\n`;
    newsHTML += `<tr>\n`;
    newsHTML += `<td style="padding: 20px; background-color: #1a1a1a;">\n`;
    
    // Content
    newsHTML += `<h3 style="color: #FFD700; margin: 0 0 10px 0;">\n`;
    newsHTML += `<a href="${article.url}" target="_blank" style="color: #FFD700; text-decoration: none;">📰 ${title}</a>\n`;
    newsHTML += `</h3>\n`;
    
    newsHTML += `<p style="color: #ffffff; margin: 10px 0; font-size: 14px;">${description}</p>\n`;
    
    newsHTML += `<div style="margin-top: 15px;">\n`;
    newsHTML += `<small style="color: #FFD700;">📅 ${publishedDate}</small>\n`;
    newsHTML += `<small style="color: #FFD700; margin-left: 20px;">📰 ${article.source.name}</small>\n`;
    newsHTML += `</div>\n`;
    
    newsHTML += `</td>\n`;
    newsHTML += `</tr>\n`;
    newsHTML += `</table>\n\n`;
  });
  
  // Footer
  newsHTML += `<p style="color: #FFD700; margin-top: 20px;">🕒 Last updated: ${new Date().toLocaleString()}</p>\n`;
  newsHTML += `<p style="color: #FFD700; font-size: 12px;">⚡ Powered by <a href="https://newsapi.org" target="_blank" style="color: #FFD700;">NewsAPI</a></p>\n\n`;
  
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