/**
 * WeatherWise AI — Groq Integration (groq.js)
 * Uses LLaMA 3 (free) to generate natural human-like weather briefings
 */

const axios = require('axios');

async function getGroqInsight(weather, advice) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      return 'Configure your Groq API key in .env to enable AI-powered briefings!';
    }

    const city        = weather.name;
    const country     = weather.sys.country;
    const temp        = Math.round(weather.main.temp);
    const feelsLike   = Math.round(weather.main.feels_like);
    const condition   = weather.weather[0].description;
    const humidity    = weather.main.humidity;
    const windKmh     = Math.round(weather.wind.speed * 3.6);

    const prompt = `You are WeatherWise AI — a smart, warm, and concise daily weather assistant.

Current weather in ${city}, ${country}:
- Temperature: ${temp}°C (feels like ${feelsLike}°C)
- Condition: ${condition}
- Humidity: ${humidity}%  
- Wind: ${windKmh} km/h

Write a 3-sentence friendly daily briefing. Be conversational and helpful like a smart friend, not a robot. Highlight what makes today special and give one practical tip. No bullet points, no lists — just natural flowing text.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        max_tokens: 220,
        temperature: 0.75,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 12000,
      }
    );

    return response.data.choices[0].message.content.trim();

  } catch (err) {
    if (err.response?.status === 401) return 'Invalid Groq API key. Please check your .env file.';
    if (err.response?.status === 429) return 'Groq API rate limit reached. Please try again shortly.';
    console.error('Groq API Error:', err.message);
    return 'AI briefing is temporarily unavailable. Your smart weather advice cards are still fully powered!';
  }
}

module.exports = { getGroqInsight };
