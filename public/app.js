/* ============================================================
   WeatherWise AI — Frontend (app.js)
   Handles: search, API fetch, rendering, chart, background
   ============================================================ */

'use strict';

// ── DOM References ────────────────────────────────────────────
const cityInput       = document.getElementById('cityInput');
const searchBtn       = document.getElementById('searchBtn');
const errorMsg        = document.getElementById('errorMsg');
const loadingState    = document.getElementById('loadingState');
const dashboard       = document.getElementById('dashboard');

// Weather hero
const cityName        = document.getElementById('cityName');
const countryBadge    = document.getElementById('countryBadge');
const weatherCond     = document.getElementById('weatherCondition');
const weatherIcon     = document.getElementById('weatherIcon');
const tempValue       = document.getElementById('tempValue');
const feelsLike       = document.getElementById('feelsLike');
const tempRange       = document.getElementById('tempRange');

// Stats
const statHumidity    = document.getElementById('statHumidity');
const statWind        = document.getElementById('statWind');
const statVisibility  = document.getElementById('statVisibility');
const statPressure    = document.getElementById('statPressure');
const statSunrise     = document.getElementById('statSunrise');
const statSunset      = document.getElementById('statSunset');

// AI + advice
const aiSummary       = document.getElementById('aiSummary');
const adviceOutfit    = document.getElementById('adviceOutfit');
const adviceHealth    = document.getElementById('adviceHealth');
const adviceActivity  = document.getElementById('adviceActivity');
const adviceCommute   = document.getElementById('adviceCommute');
const adviceHydration = document.getElementById('adviceHydration');
const adviceBestTime  = document.getElementById('adviceBestTime');

let tempChart = null; // Chart.js instance

// ── Event Listeners ───────────────────────────────────────────
searchBtn.addEventListener('click', handleSearch);

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});

// ── Main Search Handler ───────────────────────────────────────
async function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    showError('Please enter a city name.');
    return;
  }

  setUIState('loading');

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (!response.ok) {
      showError(data.error || 'Something went wrong. Please try again.');
      setUIState('idle');
      return;
    }

    renderDashboard(data);
    setUIState('success');

  } catch (err) {
    showError('Network error — please check your connection and try again.');
    setUIState('idle');
  }
}

// ── Render Full Dashboard ─────────────────────────────────────
function renderDashboard(data) {
  const { city, country, current, advice, aiSummary: summary, chartData } = data;

  // Hero
  cityName.textContent     = city;
  countryBadge.textContent = country;
  weatherCond.textContent  = capitalize(current.description);
  weatherIcon.src          = `https://openweathermap.org/img/wn/${current.icon}@2x.png`;
  weatherIcon.alt          = current.description;
  tempValue.textContent    = current.temp;
  feelsLike.textContent    = `Feels like ${current.feels_like}°C`;
  tempRange.textContent    = `↓ ${current.temp_min}°C  ↑ ${current.temp_max}°C`;

  // Stats
  statHumidity.textContent   = `${current.humidity}%`;
  statWind.textContent       = `${current.wind_speed} km/h`;
  statVisibility.textContent = `${current.visibility} km`;
  statPressure.textContent   = `${current.pressure} hPa`;
  statSunrise.textContent    = current.sunrise;
  statSunset.textContent     = current.sunset;

  // AI Summary
  aiSummary.textContent = summary;

  // Advice Cards
  adviceOutfit.textContent    = advice.outfit;
  adviceHealth.textContent    = advice.health;
  adviceActivity.textContent  = advice.activity;
  adviceCommute.textContent   = advice.commute;
  adviceHydration.textContent = advice.hydration;
  adviceBestTime.textContent  = advice.bestTime;

  // Chart
  renderChart(chartData);

  // Background
  updateBackground(current.condition, current.temp);
}

// ── Render Chart.js ───────────────────────────────────────────
function renderChart(chartData) {
  const labels    = chartData.map(d => d.time);
  const temps     = chartData.map(d => d.temp);
  const feelsData = chartData.map(d => d.feels);

  // Destroy previous chart instance to avoid memory leaks
  if (tempChart) tempChart.destroy();

  const ctx = document.getElementById('tempChart').getContext('2d');

  // Gradient fill for temperature line
  const gradientTemp = ctx.createLinearGradient(0, 0, 0, 260);
  gradientTemp.addColorStop(0, 'rgba(79, 195, 247, 0.4)');
  gradientTemp.addColorStop(1, 'rgba(79, 195, 247, 0.0)');

  const gradientFeels = ctx.createLinearGradient(0, 0, 0, 260);
  gradientFeels.addColorStop(0, 'rgba(255, 167, 38, 0.3)');
  gradientFeels.addColorStop(1, 'rgba(255, 167, 38, 0.0)');

  tempChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temps,
          borderColor: '#4fc3f7',
          backgroundColor: gradientTemp,
          borderWidth: 2.5,
          pointBackgroundColor: '#4fc3f7',
          pointBorderColor: '#070d1a',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Feels Like (°C)',
          data: feelsData,
          borderColor: '#ffa726',
          backgroundColor: gradientFeels,
          borderWidth: 2,
          borderDash: [6, 3],
          pointBackgroundColor: '#ffa726',
          pointBorderColor: '#070d1a',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: {
            color: '#94a9c4',
            font: { family: 'Nunito', size: 13, weight: '600' },
            usePointStyle: true,
            pointStyleWidth: 10,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(7, 13, 26, 0.9)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#e8f4fd',
          bodyColor: '#94a9c4',
          titleFont: { family: 'Exo 2', size: 13, weight: '700' },
          bodyFont:  { family: 'Nunito', size: 12 },
          padding: 12,
          callbacks: {
            label: ctx => `  ${ctx.dataset.label}: ${ctx.parsed.y}°C`,
          },
        },
      },
      scales: {
        x: {
          grid:  { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5a7a9a', font: { family: 'Nunito', size: 11 } },
        },
        y: {
          grid:  { color: 'rgba(255,255,255,0.06)' },
          ticks: {
            color: '#5a7a9a',
            font:  { family: 'Nunito', size: 11 },
            callback: val => `${val}°`,
          },
        },
      },
    },
  });
}

// ── Dynamic Background by Weather ────────────────────────────
const BG_MAP = {
  Clear:        'bg-clear',
  Rain:         'bg-rain',
  Drizzle:      'bg-rain',
  Thunderstorm: 'bg-thunder',
  Snow:         'bg-snow',
  Clouds:       'bg-clouds',
  Mist:         'bg-fog',
  Fog:          'bg-fog',
  Haze:         'bg-fog',
  Smoke:        'bg-fog',
  Dust:         'bg-fog',
};

function updateBackground(condition, temp) {
  document.body.className = ''; // clear all bg classes

  if (temp > 35) {
    document.body.classList.add('bg-hot');
    return;
  }

  const bgClass = BG_MAP[condition] || 'bg-default';
  document.body.classList.add(bgClass);
}

// ── UI State Manager ──────────────────────────────────────────
function setUIState(state) {
  errorMsg.classList.add('hidden');
  loadingState.classList.add('hidden');
  dashboard.classList.add('hidden');

  if (state === 'loading') {
    loadingState.classList.remove('hidden');
    searchBtn.disabled = true;
    searchBtn.style.opacity = '0.7';
  } else if (state === 'success') {
    dashboard.classList.remove('hidden');
    searchBtn.disabled = false;
    searchBtn.style.opacity = '1';
  } else {
    // idle
    searchBtn.disabled = false;
    searchBtn.style.opacity = '1';
  }
}

function showError(message) {
  errorMsg.textContent = '⚠️  ' + message;
  errorMsg.classList.remove('hidden');
}

// ── Helpers ───────────────────────────────────────────────────
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
