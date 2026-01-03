const fs = require('fs');
const https = require('https');

const NEWS_API_KEY = process.env.NEWS_API_KEY || '9d147cd7390443e281284123aa6160df';
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?category=technology&country=us&pageSize=6&apiKey=${NEWS_API_KEY}`;

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

  let newsHTML = '';
  
  // Filter articles with images and valid content
  const validArticles = articles.filter(article => 
    article.title && 
    article.description && 
    article.urlToImage &&
    !article.urlToImage.includes('removed.png')
  ).slice(0, 6);
  
  // Create rows of 3 cards each
  for (let i = 0; i < validArticles.length; i += 3) {
    const rowArticles = validArticles.slice(i, i + 3);
    
    newsHTML += '<table width="100%">\n<tr>\n';
    
    rowArticles.forEach((article) => {
      const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      const title = article.title.length > 80 ? 
        article.title.substring(0, 80) + '...' : article.title;
      const description = article.description.length > 100 ? 
        article.description.substring(0, 100) + '...' : article.description;

      newsHTML += '<td width="33%" valign="top">\n';
      newsHTML += '<div>\n';
      
      // Card container
      newsHTML += `<a href="${article.url}" target="_blank">\n`;
      newsHTML += `<img src="${article.urlToImage}" alt="${title}" width="100%" height="180" style="border-radius: 8px 8px 0 0; object-fit: cover;">\n`;
      newsHTML += `</a>\n`;
      
      // Content section with dark background
      newsHTML += '<div style="background-color: #0d1117; border-radius: 0 0 8px 8px; padding: 16px; min-height: 200px;">\n';
      
      // Source badge
      newsHTML += `<p style="margin: 0 0 8px 0;"><span style="background-color: #1f6feb; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">${article.source.name}</span></p>\n`;
      
      // Date
      newsHTML += `<p style="color: #7d8590; font-size: 12px; margin: 0 0 8px 0;">📅 ${publishedDate}</p>\n`;
      
      // Title
      newsHTML += `<h3 style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.4;">\n`;
      newsHTML += `<a href="${article.url}" target="_blank" style="color: #c9d1d9; text-decoration: none;">${title}</a>\n`;
      newsHTML += `</h3>\n`;
      
      // Description
      newsHTML += `<p style="color: #8b949e; font-size: 13px; line-height: 1.5; margin: 0 0 12px 0;">${description}</p>\n`;
      
      // Read more link
      newsHTML += `<p style="margin: 0;"><a href="${article.url}" target="_blank" style="color: #58a6ff; text-decoration: none; font-size: 13px;">Read Full Article →</a></p>\n`;
      
      newsHTML += '</div>\n'; // Close content div
      newsHTML += '</div>\n'; // Close card div
      newsHTML += '</td>\n';
    });
    
    // Fill empty cells if row has less than 3 articles
    const emptyCells = 3 - rowArticles.length;
    for (let j = 0; j < emptyCells; j++) {
      newsHTML += '<td width="33%"></td>\n';
    }
    
    newsHTML += '</tr>\n</table>\n\n';
    
    // Add spacing between rows
    if (i + 3 < validArticles.length) {
      newsHTML += '<br>\n\n';
    }
  }
  
  // Footer
  newsHTML += `<p align="center" style="color: #7d8590; margin-top: 20px; font-size: 12px;">🕒 Last updated: ${new Date().toLocaleString()}</p>\n`;
  
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
    const endMarker = '---\n\n## � Connect With Me';
    
    const startIndex = readmeContent.indexOf(startMarker);
    const endIndex = readmeContent.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Could not find tech news section markers in README');
    }
    
    const beforeNews = readmeContent.substring(0, startIndex);
    const afterNews = readmeContent.substring(endIndex);
    
    const newReadmeContent = beforeNews + startMarker + '\n\n' + newsMarkdown + '\n\n' + afterNews;
    
    // Write updated README
    fs.writeFileSync('README.md', newReadmeContent);
    console.log('✅ README updated successfully with latest tech news!');
    console.log(`📊 Added ${newsData.articles.length} articles`);
    
  } catch (error) {
    console.error('❌ Error updating README:', error.message);
    process.exit(1);
  }
}

updateReadme();