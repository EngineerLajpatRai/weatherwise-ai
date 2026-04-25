/**
 * WeatherWise AI — Weather Route (weather.js)
 * Handles /api/weather?city=CityName
 */

const express = require('express');
const axios   = require('axios');
const router  = express.Router();

const { generateAdvice }  = require('../logic/advisor');
const { getGroqInsight }  = require('../logic/groq');

// ── Input Sanitizer ──────────────────────────────────────────────
function sanitizeCity(city) {
  // Allow letters, spaces, hyphens, commas (for "City, Country" format)
  return String(city)
    .replace(/[^a-zA-Z\u00C0-\u024F\s\-,.']/g, '')
    .trim()
    .substring(0, 60);
}

// ── GET /api/weather ─────────────────────────────────────────────
router.get('/weather', async (req, res) => {
  try {
    const rawCity = req.query.city;

    if (!rawCity || !rawCity.trim()) {
      return res.status(400).json({ error: 'Please provide a city name.' });
    }

    const city = sanitizeCity(rawCity);

    if (city.length < 2) {
      return res.status(400).json({ error: 'City name must be at least 2 characters.' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
      return res.status(500).json({ error: 'OpenWeatherMap API key not configured in .env file.' });
    }

    const params = `q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    // ── Parallel API calls for speed ──────────────────────────
    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?${params}`, { timeout: 8000 }),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?${params}`, { timeout: 8000 }),
    ]);

    const weather  = weatherRes.data;
    const forecast = forecastRes.data;

    // ── Rule-based advice ──────────────────────────────────────
    const advice = generateAdvice(weather);

    // ── Groq AI summary (non-blocking — won't crash if it fails) ──
    const aiSummary = await getGroqInsight(weather, advice);

    // ── 24-hour chart data (8 points × 3h = 24h) ──────────────
    const chartData = forecast.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      temp:   Math.round(item.main.temp),
      feels:  Math.round(item.main.feels_like),
    }));

    // ── Response payload ───────────────────────────────────────
    res.json({
      city:    weather.name,
      country: weather.sys.country,
      current: {
        temp:        Math.round(weather.main.temp),
        feels_like:  Math.round(weather.main.feels_like),
        temp_min:    Math.round(weather.main.temp_min),
        temp_max:    Math.round(weather.main.temp_max),
        humidity:    weather.main.humidity,
        wind_speed:  Math.round(weather.wind.speed * 3.6),  // km/h
        wind_dir:    weather.wind.deg || 0,
        condition:   weather.weather[0].main,
        description: weather.weather[0].description,
        icon:        weather.weather[0].icon,
        visibility:  Math.round((weather.visibility || 10000) / 1000),
        pressure:    weather.main.pressure,
       sunrise: new Date((weather.sys.sunrise + weather.timezone) * 1000).toUTCString().slice(17, 22).replace(/(\d+):(\d+)/, (_, h, m) => { const hr = +h % 12 || 12; return `${hr}:${m} ${+h < 12 ? 'AM' : 'PM'}`; }),
sunset:  new Date((weather.sys.sunset  + weather.timezone) * 1000).toUTCString().slice(17, 22).replace(/(\d+):(\d+)/, (_, h, m) => { const hr = +h % 12 || 12; return `${hr}:${m} ${+h < 12 ? 'AM' : 'PM'}`; }),
      },
      advice,
      aiSummary,
      chartData,
    });

  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'City not found. Please check the spelling and try again.' });
    }
    if (err.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid OpenWeatherMap API key. Check your .env file.' });
    }
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Weather API timed out. Please try again.' });
    }
    console.error('Server Error:', err.message);
    res.status(500).json({ error: 'Something went wrong on our end. Please try again in a moment.' });
  }
});

module.exports = router;
