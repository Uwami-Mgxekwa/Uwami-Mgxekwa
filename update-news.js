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
  
  // Create responsive grid container
  newsHTML += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; padding: 20px;">\n\n';
  
  articles.slice(0, 6).forEach((article, index) => {
    // Skip articles without title or description
    if (!article.title || !article.description) return;
    
    const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const title = article.title.length > 60 ? 
      article.title.substring(0, 60) + '...' : article.title;
    const description = article.description ? 
      (article.description.length > 100 ? 
        article.description.substring(0, 100) + '...' : article.description) 
      : 'No description available';

    // Create card
    newsHTML += '<div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.3s ease; border: 1px solid #333;">\n\n';
    
    // Image container
    if (article.urlToImage) {
      newsHTML += `<div style="position: relative; height: 200px; overflow: hidden;">\n`;
      newsHTML += `<img src="${article.urlToImage}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;">\n`;
      newsHTML += `<div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #FFD700; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold;">${article.source.name}</div>\n`;
      newsHTML += `</div>\n\n`;
    }
    
    // Content container
    newsHTML += '<div style="padding: 20px;">\n\n';
    
    // Date
    newsHTML += `<div style="color: #FFD700; font-size: 12px; margin-bottom: 10px; display: flex; align-items: center;">\n`;
    newsHTML += `<span style="margin-right: 5px;">📅</span> ${publishedDate}\n`;
    newsHTML += `</div>\n\n`;
    
    // Title
    newsHTML += `<h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px; line-height: 1.3;">\n`;
    newsHTML += `<a href="${article.url}" target="_blank" style="color: #ffffff; text-decoration: none;">${title}</a>\n`;
    newsHTML += `</h3>\n\n`;
    
    // Description
    newsHTML += `<p style="color: #cccccc; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">${description}</p>\n\n`;
    
    // Read more link
    newsHTML += `<a href="${article.url}" target="_blank" style="color: #FFD700; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-flex; align-items: center;">\n`;
    newsHTML += `Read Full Article <span style="margin-left: 5px;">→</span>\n`;
    newsHTML += `</a>\n\n`;
    
    newsHTML += '</div>\n\n'; // Close content container
    newsHTML += '</div>\n\n'; // Close card
  });
  
  newsHTML += '</div>\n\n'; // Close grid container
  
  // Footer info
  newsHTML += `<div style="margin-top: 30px; padding: 20px; background: rgba(255,215,0,0.1); border-radius: 10px; border: 1px solid #FFD700;">\n`;
  newsHTML += `<p style="color: #FFD700; margin: 0; font-size: 14px;">🕒 Last updated: ${new Date().toLocaleString()}</p>\n`;
  newsHTML += `<p style="color: #FFD700; margin: 5px 0 0 0; font-size: 12px;">⚡ Powered by <a href="https://newsapi.org" target="_blank" style="color: #FFD700;">NewsAPI</a></p>\n`;
  newsHTML += `</div>\n\n`;
  
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