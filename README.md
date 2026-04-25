# ⛅ WeatherWise AI — Smart Daily Life Advisor

> An AI-powered weather web app that gives you personalized daily advice — what to wear, when to go out, how to commute, and more. Built with Node.js, OpenWeatherMap, and Groq AI (LLaMA 3).

---

## 🚀 Features
- 🌍 Real-time weather for any city worldwide
- 🤖 AI-generated natural language daily briefing (via Groq + LLaMA 3)
- 👔 Smart advice: outfit, health, activity, commute, hydration, best time
- 📊 24-hour temperature forecast chart
- 🎨 Dynamic background that changes with weather conditions
- 🔒 Secure: rate limiting, helmet headers, input sanitization

---

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Weather API | OpenWeatherMap (free) |
| AI Layer | Groq API — LLaMA 3 (free) |
| Frontend | HTML + CSS + Vanilla JS |
| Charts | Chart.js |
| Security | Helmet + express-rate-limit |

---

## ⚙️ Setup Instructions

### Step 1 — Clone / Download the project
```bash
cd weatherwise-ai
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Get your FREE API keys

**OpenWeatherMap (Weather Data)**
1. Go to → https://openweathermap.org/api
2. Sign up for a free account
3. Go to "API Keys" tab → copy your key
4. ⚠️ New keys take ~2 hours to activate

**Groq API (AI Briefings — Free)**
1. Go to → https://console.groq.com
2. Sign up → click "Create API Key"
3. Copy the key

### Step 4 — Configure environment
```bash
# Rename .env.example to .env
cp .env.example .env
```
Open `.env` and fill in your keys:
```
OPENWEATHER_API_KEY=paste_your_key_here
GROQ_API_KEY=paste_your_key_here
PORT=3000
```

### Step 5 — Run the app
```bash
npm start
```
Open your browser → **http://localhost:3000**

For development with auto-restart:
```bash
npm run dev
```

---

## 📁 Project Structure
```
weatherwise-ai/
├── server.js           ← Express app entry point
├── .env                ← Your API keys (never commit this!)
├── .env.example        ← Template for .env
├── package.json
├── routes/
│   └── weather.js      ← /api/weather endpoint
├── logic/
│   ├── advisor.js      ← Rule engine (the AI brain)
│   └── groq.js         ← Groq AI integration
└── public/
    ├── index.html      ← Frontend UI
    ├── style.css       ← Styles + animations
    └── app.js          ← Frontend logic + Chart.js
```

---

## 🔒 Security Features
- `helmet` — sets secure HTTP headers
- `express-rate-limit` — 30 requests per 15 min per IP
- Input sanitization — strips special characters from city input
- API keys stored in `.env` — never exposed to frontend
- `.gitignore` — `.env` excluded from version control

---

## 🌐 Deploy for Free (Optional)

**Option A: Render.com**
1. Push to GitHub
2. Go to render.com → New Web Service → Connect repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables in dashboard

**Option B: Railway.app**
1. Push to GitHub
2. Go to railway.app → New Project → Deploy from GitHub
3. Add environment variables in dashboard

---

## ⚠️ Common Issues

| Problem | Solution |
|---|---|
| "City not found" | Check spelling. Try "London" not "london,uk" |
| "API key invalid" | Check .env file — no spaces around `=` |
| Weather key not working | New OWM keys take up to 2 hours to activate |
| Groq not responding | Check API key or try again (free tier has rate limits) |
| Port already in use | Change PORT in .env to 3001 or any free port |

---

## 👨‍💻 Author
Lajpat Rai  
Computer Systems Engineering Student  
Focused on AI + Embedded Systems + Full-Stack Development

## 🔮 Future Improvements
- 7-day forecast support
- Location auto-detection
- Severe weather alerts
- PWA mobile support
- Voice assistant briefings

---

*Built as a full-stack AI-style project. Perfect for learning API integration, backend development, and smart logic systems.*
