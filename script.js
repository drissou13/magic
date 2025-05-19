let config;

async function loadConfig() {
  const response = await fetch('config.json');
  config = await response.json();
  applyTheme();
  updateGreeting();
  updateTime();
  setInterval(updateTime, 1000);
  fetchWeather();
  fetchNews();
}

function applyTheme() {
  document.body.style.setProperty('--bg-color', config.theme.backgroundColor);
  document.body.style.setProperty('--text-color', config.theme.textColor);
}

function updateGreeting() {
  document.getElementById('greeting').textContent = `Bonjour, ${config.username} !`;
}

function updateTime() {
  const now = new Date();
  document.getElementById('time').textContent = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('date').textContent = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

async function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${config.city}&units=metric&lang=fr&appid=${config.weatherApiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  const weatherText = `${data.weather[0].description}, ${Math.round(data.main.temp)}°C à ${data.name}`;
  document.getElementById('weather').textContent = weatherText;
}

async function fetchNews() {
  const rssUrl = encodeURIComponent(config.rssFeedUrl);
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
  const res = await fetch(url);
  const data = await res.json();
  const newsEl = document.getElementById('news');
  newsEl.innerHTML = '<h3>Actualités</h3>';
  data.items.slice(0, config.newsLimit).forEach(item => {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.innerHTML = `<strong>${item.title}</strong><br><span>${item.pubDate.split(' ')[0]}</span>`;
    newsEl.appendChild(div);
  });
}

loadConfig();