/**
 * WeatherWise AI — Rule Engine (advisor.js)
 * Converts raw weather data into human-like smart advice
 */

function generateAdvice(weather) {
  const temp        = weather.main.temp;
  const humidity    = weather.main.humidity;
  const windKmh     = weather.wind.speed * 3.6;          // m/s → km/h
  const condition   = weather.weather[0].main.toLowerCase();
  const description = weather.weather[0].description.toLowerCase();
  const visibility  = (weather.visibility || 10000) / 1000; // m → km

  // ── Condition Flags ──────────────────────────────────────────
  const isRain      = ['rain', 'drizzle', 'thunderstorm'].some(c => condition.includes(c));
  const isSnow      = condition.includes('snow');
  const isSunny     = condition === 'clear';
  const isFoggy     = ['fog', 'mist', 'haze', 'smoke'].some(c => condition.includes(c));
  const isHeavy     = description.includes('heavy') || description.includes('extreme');
  const isStorm     = condition.includes('thunderstorm');

  // ── 1. OUTFIT ────────────────────────────────────────────────
  let outfit;
  if      (temp <= 0)        outfit = '🧥 Bundle up — heavy winter coat, thermal layers, gloves, and warm waterproof boots are a must.';
  else if (temp <= 8)        outfit = '🧥 Wear a thick insulated coat with a warm sweater underneath. Scarf and gloves are a smart choice.';
  else if (temp <= 14)       outfit = '🧶 A warm jacket or hoodie will do. Layering is smart — the morning chill can be deceiving.';
  else if (temp <= 22)       outfit = '👕 Light, comfortable clothes — jeans and a t-shirt or a light long-sleeve are perfect.';
  else if (temp <= 30)       outfit = '🩳 Go light! Shorts and a breathable t-shirt are ideal for today\'s warmth.';
  else                       outfit = '🌡️ Scorching heat — wear minimal, light-colored, breathable clothing. Sun protection is critical.';

  if (isRain && !isHeavy)    outfit += ' ☂️ Light rain expected — keep an umbrella handy.';
  if (isHeavy || isStorm)    outfit += ' ⛈️ Heavy rain ahead — waterproof jacket is essential, not optional.';
  if (isSnow)                outfit += ' 👢 Waterproof, insulated boots will keep you comfortable.';

  // ── 2. HEALTH ────────────────────────────────────────────────
  let health;
  if      (humidity > 85)    health = '💧 Very high humidity — avoid strenuous outdoor activity. Drink extra water and take frequent breaks.';
  else if (humidity > 70)    health = '💧 Humidity is elevated — stay well-hydrated and listen to your body if you\'re being active.';
  else if (humidity < 25)    health = '🏜️ Very dry air — moisturize your skin, use lip balm, and drink more water than usual.';
  else if (humidity < 40)    health = '🌬️ Slightly dry — keep a water bottle with you throughout the day.';
  else                       health = '✅ Comfortable humidity levels — ideal conditions for both indoor and outdoor activities.';

  if (temp > 36)             health += ' ⚠️ Heat alert! Risk of heatstroke — find shade, avoid peak sun hours, and hydrate aggressively.';
  if (temp < -5)             health += ' ❄️ Frostbite risk — limit skin exposure outside. Cover face and extremities.';
  if (isFoggy)               health += ' 😮‍💨 Air quality may be reduced — those with asthma or respiratory issues should limit outdoor time.';
  if (isStorm)               health += ' ⚡ Lightning risk — stay away from tall trees, open fields, and metal structures.';

  // ── 3. ACTIVITY ──────────────────────────────────────────────
  let activity;
  if      (isStorm || isHeavy)          activity = '⛈️ Dangerous conditions — stay indoors. Perfect day for gym, studying, or a creative project.';
  else if (isRain)                      activity = '🌧️ Light rain — skip the run today. Indoor workouts or yoga are great alternatives.';
  else if (isSnow)                      activity = '❄️ Snow outside — great for sledding or a winter walk, but avoid icy paths. Indoor options are safer.';
  else if (windKmh > 55)                activity = '💨 Strong winds — avoid cycling, hiking, or water sports. Wind gusts can be dangerous.';
  else if (temp > 37)                   activity = '🌡️ Too hot for intense exercise outdoors. Hit the gym or work out early morning / late evening.';
  else if (temp < -8)                   activity = '🥶 Dangerously cold for outdoor exercise. Indoor workout strongly recommended.';
  else if (isSunny && temp >= 14 && temp <= 27) activity = '🏃 Perfect conditions! Great day for a run, bike ride, hike, or outdoor sports. Get out there!';
  else if (isFoggy)                     activity = '🌫️ Low visibility — light walks are fine, but avoid cycling or running on busy roads.';
  else                                  activity = '🌤️ Decent conditions — moderate outdoor activity is fine. Dress for the temperature.';

  // ── 4. COMMUTE ───────────────────────────────────────────────
  let commute;
  if      (isStorm || isHeavy)    commute = '⛈️ Dangerous roads — delay travel if possible. If you must drive, go slow and keep maximum distance.';
  else if (isRain)                commute = '🚗 Wet roads — allow 15–20 extra minutes. Reduce speed and increase following distance.';
  else if (isSnow)                commute = '🚧 Snow or ice possible — check road conditions before leaving. Drive slowly, avoid sudden braking.';
  else if (isFoggy || visibility < 1) commute = '🌫️ Low visibility — use fog lights, not high beams. Reduce speed significantly.';
  else if (windKmh > 60)          commute = '💨 High wind advisory — be extra cautious on bridges, overpasses, and open highways.';
  else if (isSunny)               commute = '☀️ Clear roads ahead — smooth commute expected. Watch for sun glare at sunrise/sunset.';
  else                            commute = '🟢 Normal driving conditions. Have a safe trip!';

  // ── 5. HYDRATION ─────────────────────────────────────────────
  let hydration;
  if      (temp > 33 || humidity > 80)  hydration = '💧 High heat or humidity — drink 3.5–4 liters today. Carry water everywhere you go.';
  else if (temp > 25 || humidity > 65)  hydration = '💧 Warm conditions — aim for 2.5–3 liters of water spread throughout the day.';
  else if (temp < 5)                    hydration = '❄️ Cold weather reduces thirst sensation, but you still need 2 liters. Don\'t skip water!';
  else                                  hydration = '💧 Normal day — 2 liters of water is your target. Start with a big glass right when you wake up.';

  // ── 6. BEST TIME TO GO OUT ───────────────────────────────────
  let bestTime;
  if      (isStorm)              bestTime = '🚫 Avoid going out entirely if possible. Wait for the storm to pass before any travel.';
  else if (isRain)               bestTime = '🕑 Monitor the forecast and head out during rain breaks. Afternoons can sometimes clear up.';
  else if (temp > 32)            bestTime = '🕕 Best window: Early morning (6–9 AM) or evening (6–8 PM). Avoid midday heat.';
  else if (isFoggy)              bestTime = '🕙 Wait until mid-morning (9–10 AM) for fog to lift before heading out.';
  else if (isSunny && temp <= 28) bestTime = '☀️ Anytime is great, but golden hours (morning & late afternoon) are the most enjoyable.';
  else                            bestTime = '🕙 Both morning and afternoon are fine today. Plan around your schedule.';

  return { outfit, health, activity, commute, hydration, bestTime };
}

module.exports = { generateAdvice };
