<div align="center">
  <img src="./hero-banner.svg" alt="Hero Banner" width="100%"/>
</div>


<br/>

<div align="center">
  
  [![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&pause=1000&color=FFD700&center=true&vCenter=true&repeat=true&width=600&lines=Java+Developer;UI+Design+Enthusiast;Spring+Boot+Expert;Always+Learning)](https://git.io/typing-svg)
  
</div>

---


## 👨‍💻 About Me

I'm a passionate Java Developer with a love for UI Design. I enjoy building robust applications with clean, efficient code while creating beautiful and intuitive user interfaces. Currently expanding my skills into modern web frameworks!

---

## 🛠️ Tech Stack & Skills

<div align="center">

### Core Languages
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![C++](https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

### Mobile Development
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white)

### Desktop Development
![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=electron&logoColor=white)
![Java Swing](https://img.shields.io/badge/Java_Swing-ED8B00?style=for-the-badge&logo=java&logoColor=white)

### Java Frameworks & UI
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![JavaFX](https://img.shields.io/badge/JavaFX-007396?style=for-the-badge&logo=java&logoColor=white)

### Databases
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### Tools & Design
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ_IDEA-000000?style=for-the-badge&logo=intellij-idea&logoColor=white)
![NetBeans](https://img.shields.io/badge/NetBeans-1B6AC6?style=for-the-badge&logo=apache-netbeans-ide&logoColor=white)

</div>

---

## Ranking on committers.top

<div align="center">

[![committers.top badge](https://user-badge.committers.top/south_africa_public/Uwami-Mgxekwa.svg)](https://user-badge.committers.top/south_africa_public/Uwami-Mgxekwa)

[![committers.top badge](https://user-badge.committers.top/south_africa/Uwami-Mgxekwa.svg)](https://user-badge.committers.top/south_africa/Uwami-Mgxekwa)

[![committers.top badge](https://user-badge.committers.top/south_africa_private/Uwami-Mgxekwa.svg)](https://user-badge.committers.top/south_africa_private/Uwami-Mgxekwa)


</div>

---

## 📰 Latest Tech News

<div id="tech-news">
  <p align="center">🔄 Loading latest tech news...</p>
</div>

<script>
// Tech News API Configuration
const NEWS_API_KEY = '9d147cd7390443e281284123aa6160df';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Function to fetch latest tech news
async function fetchTechNews() {
  try {
    const params = new URLSearchParams({
      category: 'technology',
      country: 'us',
      pageSize: 5,
      apiKey: NEWS_API_KEY
    });
    
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(`${NEWS_API_URL}?${params}`)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    displayNews(data.articles);
  } catch (error) {
    console.error('Error fetching tech news:', error);
    document.getElementById('tech-news').innerHTML = `
      <p align="center">❌ Unable to load tech news at the moment</p>
      <p align="center"><small>Please check back later</small></p>
    `;
  }
}

// Function to display news articles
function displayNews(articles) {
  const newsContainer = document.getElementById('tech-news');
  
  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = '<p align="center">📰 No tech news available at the moment</p>';
    return;
  }
  
  let newsHTML = '<div align="center">';
  
  articles.slice(0, 5).forEach((article, index) => {
    const publishedDate = new Date(article.publishedAt).toLocaleDateString();
    const title = article.title.length > 80 ? article.title.substring(0, 80) + '...' : article.title;
    const description = article.description ? 
      (article.description.length > 120 ? article.description.substring(0, 120) + '...' : article.description) 
      : 'No description available';
    
    newsHTML += `
      <div style="margin: 15px 0; padding: 15px; border: 1px solid #FFD700; border-radius: 8px; background: rgba(255, 215, 0, 0.1);">
        <h4 style="color: #FFD700; margin: 0 0 8px 0;">
          <a href="${article.url}" target="_blank" style="color: #FFD700; text-decoration: none;">
            📰 ${title}
          </a>
        </h4>
        <p style="margin: 8px 0; color: #ffffff; font-size: 14px;">${description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <small style="color: #cccccc;">📅 ${publishedDate}</small>
          <small style="color: #cccccc;">📰 ${article.source.name}</small>
        </div>
      </div>
    `;
  });
  
  newsHTML += `
    <p style="margin-top: 20px;">
      <a href="https://newsapi.org" target="_blank" style="color: #FFD700; font-size: 12px;">
        Powered by NewsAPI
      </a>
    </p>
  </div>`;
  
  newsContainer.innerHTML = newsHTML;
}

// Load news when the page loads
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', fetchTechNews);
}
</script>

---

## 🌐 Connect With Me

<div align="center">
  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/uwami-mgxekwa-bb8235283)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Uwami-Mgxekwa)
[![Portfolio](https://img.shields.io/badge/Portfolio-FFD700?style=for-the-badge&logo=google-chrome&logoColor=black)](https://uwami-mgxekwa.github.io/uwami/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:uwamimcdonald@gmail.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/message/3SDVFUTLNLO6P1)

📱 **Phone:** +27 63 572 2080

</div>

---

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="400">
  
  ### 💡 "Code is like humor. When you have to explain it, it's bad." - Cory House
  
  ![Profile Views](https://komarev.com/ghpvc/?username=Uwami-Mgxekwa&color=FFD700&style=for-the-badge)
  
</div>

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16&height=100&section=footer&text=Thanks%20for%20visiting!&fontSize=30&fontColor=FFD700&animation=twinkling" width="100%"/>
</div>
