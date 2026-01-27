<template>
  <div class="weather-page space-y-8 max-w-5xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        {{ t('weather.title') }}
      </h1>
      <p class="text-slate-600 text-lg">
        {{ t('weather.subtitle') }}
      </p>
    </div>

    <!-- Main Weather Card -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
      <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-4 text-slate-500 font-medium">{{ t('weather.loading') }}</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
      <span class="text-4xl mb-4 block">⚠️</span>
      <h2 class="text-xl font-bold text-red-900">{{ t('weather.error') }}</h2>
      <button @click="fetchWeather" class="mt-4 btn btn-primary px-6 py-2 rounded-full">
        Retry
      </button>
    </div>

    <div v-else class="space-y-8">
      <!-- Current/Selected Weather Detail -->
      <div id="weather-top" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Highlight -->
        <div class="lg:col-span-2 bg-gradient-to-br from-green-600 to-green-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div class="relative z-10 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8">
            <div class="space-y-4 text-center sm:text-left">
              <div class="flex items-center justify-center sm:justify-start gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full w-fit mx-auto sm:mx-0">
                <span class="text-sm font-bold uppercase tracking-wider flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {{ currentLocationName }} • {{ formatDate(weatherData.daily.time[selectedDayIndex]) }}
                </span>
              </div>
              <div class="flex items-center gap-4 py-2">
                <span class="text-7xl sm:text-8xl font-black">
                  {{ selectedDayIndex === 0 ? Math.round(weatherData.current.temperature_2m) : Math.round(weatherData.daily.temperature_2m_max[selectedDayIndex]) }}°C
                </span>
                <span class="text-6xl sm:text-7xl">
                  {{ selectedDayIndex === 0 ? getWeatherIcon(weatherData.current.weather_code) : getWeatherIcon(weatherData.daily.weather_code[selectedDayIndex]) }}
                </span>
              </div>
              <p class="text-xl font-medium opacity-90 capitalize">
                {{ selectedDayIndex === 0 ? getWeatherLabel(weatherData.current.weather_code) : getWeatherLabel(weatherData.daily.weather_code[selectedDayIndex]) }}
              </p>

              <!-- Morning to Night Highlights -->
              <div class="grid grid-cols-4 gap-2 pt-4 border-t border-white/20">
                <div class="text-center">
                  <p class="text-[10px] opacity-70 uppercase font-bold">{{ t('weather.morning') }}</p>
                  <p class="text-sm sm:text-lg font-bold">{{ getHourlyTemp(6) }}°</p>
                </div>
                <div class="text-center">
                  <p class="text-[10px] opacity-70 uppercase font-bold">{{ t('weather.afternoon') }}</p>
                  <p class="text-sm sm:text-lg font-bold">{{ getHourlyTemp(13) }}°</p>
                </div>
                <div class="text-center">
                  <p class="text-[10px] opacity-70 uppercase font-bold">{{ t('weather.evening') }}</p>
                  <p class="text-sm sm:text-lg font-bold">{{ getHourlyTemp(18) }}°</p>
                </div>
                <div class="text-center">
                  <p class="text-[10px] opacity-70 uppercase font-bold">{{ t('weather.night') }}</p>
                  <p class="text-sm sm:text-lg font-bold">{{ getHourlyTemp(22) }}°</p>
                </div>
              </div>
            </div>

            <!-- Farmer Advice Section -->
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/20 w-full sm:max-w-[280px]">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">💡</span>
                <h3 class="font-bold text-lg leading-tight">{{ t('weather.advise') }}</h3>
              </div>
              <div class="space-y-3">
                <p class="text-sm leading-relaxed opacity-90">
                  {{ selectedDayIndex === 0 ? getFarmerAdvice(weatherData.current.weather_code) : getFarmerAdvice(weatherData.daily.weather_code[selectedDayIndex]) }}
                </p>
                <!-- Dew/Fog Alerts -->
                <div v-if="hasFogOrDew" class="pt-3 border-t border-white/10 flex items-start gap-2">
                   <span class="text-lg">{{ hasFog ? '🌫️' : '💧' }}</span>
                   <p class="text-[11px] font-bold leading-tight">
                     {{ hasFog ? t('weather.fogAdvise') : t('weather.dewAdvise') }}
                   </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Background Decoration -->
          <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <!-- Selected Specs -->
        <div class="bg-white rounded-3xl p-4 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-center gap-6 sm:gap-8">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm">💧</div>
            <div>
              <p class="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-wide">{{ t('weather.humidity') }}</p>
              <p class="text-xl sm:text-2xl font-black text-slate-900">
                {{ selectedDayIndex === 0 ? weatherData.current.relative_humidity_2m : '--' }}%
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 text-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm">💨</div>
            <div>
              <p class="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-wide">{{ t('weather.wind') }}</p>
              <p class="text-xl sm:text-2xl font-black text-slate-900">
                {{ selectedDayIndex === 0 ? weatherData.current.wind_speed_10m : '--' }} <span class="text-xs sm:text-sm font-medium">km/h</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm">💧</div>
            <div class="flex-1">
              <p class="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-wide">{{ t('weather.dew') }} (Oss)</p>
              <p class="text-xl sm:text-2xl font-black text-slate-900">
                {{ getHourlyDew(6) }}°C
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 7-Day Forecast -->
      <section class="space-y-6">
        <h2 class="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span class="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-lg">📅</span>
          {{ t('weather.forecast') }}
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3 sm:gap-4">
          <button 
            v-for="(day, index) in weatherData.daily.time" 
            :key="day" 
            @click="selectDay(index)"
            class="bg-white border text-center p-3 sm:p-5 rounded-2xl shadow-sm transition-all group relative overflow-hidden active:scale-95 flex flex-col justify-between"
            :class="selectedDayIndex === index ? 'ring-2 ring-primary border-transparent' : 'border-slate-100 hover:border-primary/30 min-h-[160px] sm:min-h-[180px]'"
          >
            <div>
              <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3" :class="selectedDayIndex === index ? 'text-primary' : 'text-slate-400'">
                {{ formatDate(day) }}
              </p>
              <div class="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                {{ getWeatherIcon(weatherData.daily.weather_code[index]) }}
              </div>
              <div class="space-y-0.5">
                <p class="text-lg sm:text-xl font-black text-slate-900">
                  {{ Math.round(weatherData.daily.temperature_2m_max[index]) }}°
                </p>
                <p class="text-[10px] sm:text-xs font-medium text-slate-400">
                  {{ Math.round(weatherData.daily.temperature_2m_min[index]) }}°
                </p>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-50 flex flex-col items-center justify-center gap-0.5 sm:gap-1">
              <span class="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">{{ t('weather.rainLabel') }}</span>
              <span class="text-xs sm:text-sm font-black text-primary">{{ weatherData.daily.precipitation_probability_max[index] }}%</span>
            </div>
            
            <div v-if="selectedDayIndex === index" class="absolute top-0 right-0 bg-primary text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
              ✓
            </div>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const { translate, lang } = useI18n()
const t = translate

const loading = ref(true)
const error = ref(null)
const weatherData = ref(null)
const currentLocationName = ref('Rajkot, Gujarat')
const selectedDayIndex = ref(0) // Default to today

// Default to Rajkot if geolocation fails
const defaultCoords = { lat: 22.3, lon: 70.8 }

const selectDay = (index) => {
  selectedDayIndex.value = index
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const fetchWeather = async () => {
  loading.value = true
  error.value = null
  
  try {
    let lat = defaultCoords.lat
    let lon = defaultCoords.lon

    // Try to get user location
    if (process.client && navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        })
        lat = position.coords.latitude
        lon = position.coords.longitude
        currentLocationName.value = 'Your Location'
      } catch (e) {
        console.warn('Geolocation failed, using default coords')
      }
    }

    // Added hourly data for timeline and winter weather (dew point)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,dew_point_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch weather')
    
    weatherData.value = await response.json()
  } catch (e) {
    console.error(e)
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const getHourlyTemp = (hour) => {
  if (!weatherData.value?.hourly) return '--'
  const index = (selectedDayIndex.value * 24) + hour
  return Math.round(weatherData.value.hourly.temperature_2m[index])
}

const getHourlyDew = (hour) => {
  if (!weatherData.value?.hourly) return '--'
  const index = (selectedDayIndex.value * 24) + hour
  return Math.round(weatherData.value.hourly.dew_point_2m[index])
}

const hasFog = computed(() => {
  if (!weatherData.value?.hourly) return false
  const dayStart = selectedDayIndex.value * 24
  const dayCodes = weatherData.value.hourly.weather_code.slice(dayStart, dayStart + 24)
  return dayCodes.some(code => code >= 45 && code <= 48)
})

const hasFogOrDew = computed(() => {
  if (!weatherData.value?.hourly) return false
  const morningDew = getHourlyDew(6)
  const morningTemp = getHourlyTemp(6)
  // Simple check: if dew point is close to temp, there will be "oss" (dew)
  const isDewy = (morningTemp - morningDew) < 3
  return hasFog.value || isDewy
})

const getWeatherIcon = (code) => {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return '☀️' // Clear sky
  if (code >= 1 && code <= 3) return '⛅' // Partly cloudy
  if (code >= 45 && code <= 48) return '🌫️' // Fog
  if (code >= 51 && code <= 67) return '🌦️' // Drizzle/Rain
  if (code >= 71 && code <= 77) return '❄️' // Snow
  if (code >= 80 && code <= 82) return '🌧️' // Rain showers
  if (code >= 95) return '⛈️' // Thunderstorm
  return '☀️'
}

const getWeatherLabel = (code) => {
  if (code === 0) return lang.value === 'gu' ? 'સાફ આકાશ' : 'Clear Sky'
  if (code >= 1 && code <= 3) return lang.value === 'gu' ? 'થોડા વાદળછાયું' : 'Partly Cloudy'
  if (code >= 45 && code <= 48) return lang.value === 'gu' ? 'ધૂમ્મસ' : 'Foggy'
  if (code >= 51 && code <= 67) return lang.value === 'gu' ? 'વરસાદ' : 'Rainy'
  if (code >= 80 && code <= 82) return lang.value === 'gu' ? 'ભારે વરસાદ' : 'Heavy Rain'
  if (code >= 95) return lang.value === 'gu' ? 'ગાજવીજ સાથે વરસાદ' : 'Thunderstorm'
  return lang.value === 'gu' ? 'સાફ આકાશ' : 'Sunny'
}

const getFarmerAdvice = (code) => {
  if (code >= 51 && code <= 99) return t('weather.rainAdvise')
  if (code === 0) return t('weather.sunnyAdvise')
  if (code >= 1 && code <= 3) return t('weather.cloudyAdvise')
  if (code >= 45 && code <= 48) return t('weather.clearAdvise')
  return t('weather.defaultAdvise')
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(lang.value === 'gu' ? 'gu-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

onMounted(() => {
  fetchWeather()
})

const route = useRoute()

// Dynamic SEO Meta Tags
const pageTitle = computed(() => {
  const loc = currentLocationName.value !== 'Rajkot, Gujarat' ? currentLocationName.value : (lang.value === 'gu' ? 'રાજકોટ, ગુજરાત' : 'Rajkot, Gujarat')
  const rajkotSuffix = loc.toLowerCase().includes('rajkot') ? ' | Rajkot Weather for Farmers' : ''
  return `${t('weather.title')} - ${loc}${rajkotSuffix} | ${t('brand.name')}`
})

const pageDescription = computed(() => {
  const loc = currentLocationName.value !== 'Rajkot, Gujarat' ? currentLocationName.value : (lang.value === 'gu' ? 'રાજકોટ' : 'Rajkot')
  if (lang.value === 'gu') {
    return `${loc} હવામાન અને ખેતીવાડી સમાચાર: આજનું તાપમાન, વરસાદની આગાહી અને ખેડૂતો માટે ખાસ સલાહ. રાજકોટ બજાર ભાવ અને હવામાનની માહિતી.`
  }
  return `Agricultural weather for ${loc}: Today's temperature, rain forecast, and special farmer advice. Plan your farming activities with Rajkot weather and Bajar Bhav.`
})

// JSON-LD Structured Data
const schemaOrg = computed(() => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchAction',
    'name': pageTitle.value,
    'description': pageDescription.value,
    'url': `https://www.khedutbajarbhav.online${route.fullPath}`,
    'publisher': {
      '@type': 'Organization',
      'name': t('brand.name')
    }
  }
})

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { 
      name: 'keywords', 
      content: computed(() => {
        const base = `${currentLocationName.value}, agricultural weather, khedut weather, farming forecast Gujarat, ${t('brand.name')}, monsoon report, crop safety advice`
        if (currentLocationName.value.toLowerCase().includes('rajkot')) {
          return `${base}, Rajkot Bajar Bhav, Rajkot Weather today, Rajkot market yard weather, રાજકોટ હવામાન`
        }
        return base
      }) 
    },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:url', content: computed(() => `https://www.khedutbajarbhav.online${route.fullPath}`) },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'canonical', href: computed(() => `https://www.khedutbajarbhav.online${route.fullPath}`) }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(schemaOrg.value))
    }
  ]
})
</script>

<style scoped>
.btn-primary {
  background-color: var(--primary);
  color: white;
  font-weight: 700;
  transition: all 0.2s;
}
.btn-primary:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
</style>
