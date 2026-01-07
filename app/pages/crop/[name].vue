<template>
  <section class="max-w-4xl mx-auto space-y-8">
    <!-- Header/Navigation -->
    <div class="flex items-center gap-3 sm:gap-4 px-1">
      <NuxtLink :to="{ path: '/market', query: { market: selectedMarket } }" class="btn btn-ghost !p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Go back to market prices">
        <svg class="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{{ displayTitle }}</h1>
        <p class="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider opacity-80">{{ t('crop.details') }}</p>
      </div>
      <button 
        @click="shareOnWhatsApp"
        class="ml-auto btn bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-4 sm:px-6 py-2 sm:py-2.5 flex items-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-all text-xs sm:text-sm font-bold"
      >
        <svg class="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884 0 2.225.569 3.808 1.565 5.405l-.992 3.62 3.916-.924zm11.367-7.46c-.059-.098-.214-.154-.448-.271-.234-.117-1.384-.682-1.599-.762-.214-.078-.371-.117-.527.117-.156.234-.604.762-.741.917-.135.156-.273.174-.506.058-.234-.117-.984-.363-1.876-1.158-.694-.621-1.163-1.388-1.3-1.623-.135-.234-.014-.361.103-.477.104-.105.234-.271.35-.409.117-.135.156-.234.234-.388.078-.156.039-.292-.019-.409-.059-.117-.527-1.268-.722-1.735-.19-.456-.381-.393-.527-.4h-.45c-.156 0-.409.058-.624.292-.214.234-.819.8-.819 1.948 0 1.148.838 2.259.956 2.416.117.156 1.647 2.516 3.991 3.527.558.241 1.076.399 1.455.517.585.186 1.117.16 1.538.097.471-.071 1.384-.565 1.579-1.111.196-.547.196-1.015.137-1.111z" />
        </svg>
        <span class="hidden sm:inline">{{ t('crop.shareWhatsApp') }}</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-20 text-center">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
      <p class="mt-4 text-slate-600 font-medium">Fetching historical rates...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 p-8 text-center border-red-100">
      <p class="text-red-700 font-medium">{{ error }}</p>
      <button @click="fetchData" class="mt-4 btn btn-primary">Try Again</button>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
        <!-- Main Price Card -->
        <div class="card bg-white border-0 ring-1 ring-slate-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ t('crop.highestToday') }}</p>
            <p class="text-4xl sm:text-5xl font-black text-green-600 mt-2">₹{{ maxPriceOverall.toLocaleString() }}</p>
          </div>
          <p class="text-xs text-slate-400 mt-4 font-medium">{{ t('crop.pricePer20kg') }}</p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:col-span-1">
          <div class="card bg-white border-0 ring-1 ring-slate-200 shadow-sm p-4 flex flex-col justify-center">
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ t('crop.lowestToday') }}</p>
            <p class="text-2xl font-black text-red-500 mt-1">₹{{ minPriceOverall.toLocaleString() }}</p>
          </div>
          
          <div :class="['card border-0 ring-1 shadow-sm p-4 flex flex-col justify-center transition-colors', trendBgColor]">
            <p class="text-[10px] font-bold uppercase tracking-wider opacity-70">{{ t('crop.priceTrend') }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xl font-black">{{ trendLabel }}</span>
              <span v-if="trendLabel === t('crop.up')">📈</span>
              <span v-else-if="trendLabel === t('crop.down')">📉</span>
            </div>
          </div>
        </div>

        <!-- Selected Market Info -->
        <div class="card bg-white border-0 ring-1 ring-slate-200 shadow-sm p-5 sm:p-6 flex flex-col justify-center sm:col-span-1">
          <p class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ t('crop.marketYard') }}</p>
          <p class="text-2xl font-black mt-2 leading-tight text-slate-900">{{ selectedMarket }}</p>
          <div class="mt-4 flex items-center gap-2 bg-primary/10 w-fit px-3 py-1 rounded-full text-[10px] font-bold text-primary">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            LIVE UPDATES
          </div>
        </div>

        <!-- NEW: Market Arrival Alert Placeholder -->
        <div class="card bg-gradient-to-br from-primary to-primary/80 p-5 sm:p-6 border-0 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden flex flex-col justify-center">
          <div class="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
            <svg class="h-24 w-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          </div>
          <div class="relative z-10">
            <p class="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-widest mb-1">Coming Soon</p>
            <h3 class="text-xl font-black text-white leading-tight">Price Alerts</h3>
            <p class="text-xs font-medium text-white/90 mt-1">Get notified when prices hit your target!</p>
          </div>
        </div>
      </div>

      <!-- Graph Section -->
      <div class="card bg-white p-5 sm:p-8 shadow-md border-0 ring-1 ring-slate-200/50 relative group rounded-3xl">
        <div class="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none rounded-3xl"></div>
        <div class="relative z-10">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 class="text-xl font-black text-slate-900">{{ t('crop.priceTrend') }}</h2>
              <p class="text-sm text-slate-500 font-medium">{{ selectedMarket }} - {{ displayTitle }}</p>
            </div>
            <div class="flex gap-3">
              <div class="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <span class="w-2.5 h-2.5 rounded-full bg-primary/20 border border-primary/30"></span>
                {{ oldestDate }}
              </div>
              <div class="text-slate-300">→</div>
              <div class="flex items-center gap-1.5 text-xs font-bold text-primary">
                <span class="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--color-primary),0.5)]"></span>
                {{ latestDate }}
              </div>
            </div>
          </div>

          <div class="h-56 sm:h-72 w-full mt-4 flex items-end">
            <TrendSparkline 
              v-if="trendPoints.length > 0" 
              :data="trendPoints" 
              class="w-full h-full text-primary drop-shadow-[0_8px_24px_rgba(var(--color-primary),0.2)]"
              stroke="currentColor"
            />
            <div v-else class="h-full w-full flex items-center justify-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              {{ t('market.noResults') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Price History Section (Mobile Optimized) -->
      <div class="space-y-4 px-1">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-black text-slate-900">{{ t('crop.historyTitle') }}</h2>
          <span class="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">{{ selectedMarket }}</span>
        </div>
        
        <!-- Mobile: Vertical List -->
        <div class="sm:hidden space-y-3">
          <div v-for="date in uniqueDates" :key="date" class="card bg-white p-4 border-0 ring-1 ring-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-transform">
            <div class="flex items-center gap-4">
              <div class="bg-slate-50 rounded-xl p-2 text-center min-w-[50px]">
                <p class="text-[10px] font-black text-slate-400 uppercase leading-none">{{ formatDate(date).split(' ')[1] }}</p>
                <p class="text-lg font-black text-slate-900 leading-none mt-1">{{ formatDate(date).split(' ')[0] }}</p>
              </div>
              <div v-if="getData(selectedMarket, date)" class="flex flex-col">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ t('market.avg') }}</span>
                <span class="text-lg font-black text-slate-900">₹{{ Math.round((getData(selectedMarket, date).min_price + getData(selectedMarket, date).max_price) / 2) }}</span>
              </div>
            </div>
            
            <div v-if="getData(selectedMarket, date)" class="flex gap-4">
              <div class="text-right">
                <p class="text-[9px] font-bold text-green-600 uppercase tracking-tighter">{{ t('market.max') }}</p>
                <p class="font-black text-green-600">₹{{ getData(selectedMarket, date).max_price }}</p>
              </div>
              <div class="text-right">
                <p class="text-[9px] font-bold text-red-500 uppercase tracking-tighter">{{ t('market.min') }}</p>
                <p class="font-black text-red-500">₹{{ getData(selectedMarket, date).min_price }}</p>
              </div>
            </div>
            <div v-else class="text-slate-300 font-bold">
              {{ t('market.noResults') }}
            </div>
          </div>
        </div>

        <!-- Desktop: Table -->
        <div class="hidden sm:block overflow-hidden border border-slate-200 rounded-3xl bg-white shadow-sm">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">{{ t('crop.date') }}</th>
                <th class="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">{{ t('market.min') }}</th>
                <th class="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">{{ t('market.max') }}</th>
                <th class="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">{{ t('market.avg') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="date in uniqueDates" :key="date" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-5 whitespace-nowrap">
                  <span class="text-sm font-black text-slate-900">{{ formatDate(date) }}</span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-center">
                  <span v-if="getData(selectedMarket, date)" class="text-base font-bold text-red-500">₹{{ getData(selectedMarket, date).min_price }}</span>
                  <span v-else class="text-slate-300">—</span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-center">
                  <span v-if="getData(selectedMarket, date)" class="text-base font-bold text-green-600">₹{{ getData(selectedMarket, date).max_price }}</span>
                  <span v-else class="text-slate-300">—</span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-center">
                  <span v-if="getData(selectedMarket, date)" class="bg-slate-100 px-4 py-1.5 rounded-full text-sm font-black text-slate-700">
                    ₹{{ Math.round((getData(selectedMarket, date).min_price + getData(selectedMarket, date).max_price) / 2) }}
                  </span>
                  <span v-else class="text-slate-300">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Other Markets Section -->
      <div v-if="otherMarkets.length > 0" class="space-y-4 px-1 pb-10">
        <h2 class="text-xl font-black text-slate-900">{{ t('crop.marketWise') }}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <NuxtLink 
            v-for="m in otherMarkets" 
            :key="m.market"
            :to="{ path: `/crop/${rawData[0]?.crops?.name || commodityName}`, query: { market: m.market } }"
            class="card bg-white p-4 border-0 ring-1 ring-slate-200 hover:ring-primary/50 hover:shadow-md transition-all group"
          >
            <p class="text-[10px] font-bold text-slate-400 uppercase truncate mb-2">{{ m.market }}</p>
            <div class="flex items-baseline gap-1">
              <span class="text-lg font-black text-slate-900">₹{{ m.max }}</span>
              <span class="text-[10px] font-bold text-green-600">Max</span>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-500">{{ formatDate(m.date) }}</span>
              <span class="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { t, lang } = useI18n()
const route = useRoute()
const client = useSupabaseClient()

const commodityName = route.params.name
const selectedMarket = route.query.market

const displayTitle = computed(() => {
  if (rawData.value.length > 0) {
    const crop = rawData.value[0].crops
    return lang.value === 'gu' ? (crop.local_name || crop.name) : crop.name
  }
  return commodityName
})

const shareOnWhatsApp = () => {
  // Use local_name (Gujarati) if available for a more natural message
  const cropDisplay = (rawData.value[0]?.crops?.local_name) 
    ? rawData.value[0].crops.local_name 
    : (rawData.value[0]?.crops?.name || commodityName)
    
  const marketDisplay = selectedMarket || 'Gujarat'

  const text = t('crop.shareText')
    .replace('{crop}', `${cropDisplay}`)
    .replace('{market}', `${marketDisplay}`)
    .replace('{price}', `₹${maxPriceOverall.value.toLocaleString()}`)
  
  // Construct a clean URL for the shared message
  const url = `https://www.khedutbajarbhav.online/crop/${commodityName}?market=${encodeURIComponent(selectedMarket || '')}`
  
  // Combine with double newlines for the "farmer-friendly" spacing requested
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n' + url)}`
  window.open(whatsappUrl, '_blank')
}

const rawData = ref([])
const loading = ref(true)
const error = ref(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    // Get last 45 days of data to ensure we get 5 business days (account for weekends/holidays/off-season)
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - 45) 
    const dateLimit = daysAgo.toISOString().split('T')[0]

    // We use ilike without wildcards for an exact-ish but case-insensitive match
    const { data, error: err } = await client
      .from('crop_prices')
      .select(`
        price_date,
        min_price,
        max_price,
        modal_price,
        market_yards!inner (name),
        crops!inner (name, local_name)
      `)
      .gte('price_date', dateLimit)
      .or(`name.ilike.${commodityName},local_name.ilike.${commodityName}`, { foreignTable: 'crops' })
      .order('price_date', { ascending: false })

    if (err) throw err
    rawData.value = data || []
  } catch (e) {
    console.error(e)
    error.value = 'Failed to load crop details. Please try again later.'
  } finally {
    loading.value = false
  }
}

const uniqueDates = computed(() => {
  // If a market is selected, find the last 5 days it HAD data
  // otherwise find the last 5 days ANY market had data
  let source = rawData.value
  if (selectedMarket) {
    const marketData = rawData.value.filter(r => r.market_yards.name === selectedMarket)
    if (marketData.length > 0) source = marketData
  }
  
  const dates = [...new Set(source.map(r => r.price_date.slice(0, 10)))]
  return dates.sort((a, b) => new Date(b) - new Date(a)).slice(0, 5) // Latest 5 days
})

const getData = (market, date) => {
  return rawData.value.find(r => r.market_yards.name === market && r.price_date.slice(0, 10) === date)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(lang.value === 'gu' ? 'gu-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short'
  })
}

const trendPoints = computed(() => {
  if (rawData.value.length === 0) return []
  
  // Group by date
  const dateMap = new Map()
  rawData.value.forEach(r => {
    const d = r.price_date.slice(0, 10)
    if (!dateMap.has(d)) dateMap.set(d, [])
    dateMap.get(d).push(r)
  })

  // Ensure we use the same 5 days as the table, but chronological (Left to Right)
  const sortedDates = [...uniqueDates.value].sort()
  
  return sortedDates.map(d => {
    const dailyRows = dateMap.get(d)
    
    // Strictly find the selected market's data
    const target = dailyRows.find(r => r.market_yards.name === selectedMarket)
    
    // If we have data for this market on this day, use it. 
    // Otherwise, if NO market is selected, use the first available one as fallback.
    const pointData = target || (!selectedMarket ? dailyRows[0] : null)
    
    if (!pointData) return null
    
    return {
      value: (pointData.min_price + pointData.max_price) / 2,
      min: pointData.min_price,
      max: pointData.max_price,
      date: formatDate(d),
      market: pointData.market_yards?.name || ''
    }
  }).filter(p => p !== null)
})

const trendLabel = computed(() => {
  if (trendPoints.value.length < 2) return t('crop.stable')
  const last = trendPoints.value[trendPoints.value.length - 1].value
  const prev = trendPoints.value[trendPoints.value.length - 2].value
  if (last > prev) return t('crop.up')
  if (last < prev) return t('crop.down')
  return t('crop.stable')
})

const trendBgColor = computed(() => {
  if (trendPoints.value.length < 2) return 'bg-slate-50 text-slate-400 ring-slate-100'
  const last = trendPoints.value[trendPoints.value.length - 1].value
  const prev = trendPoints.value[trendPoints.value.length - 2].value
  if (last > prev) return 'bg-green-50 text-green-700 ring-green-100'
  if (last < prev) return 'bg-red-50 text-red-700 ring-red-100'
  return 'bg-slate-50 text-slate-400 ring-slate-100'
})

const otherMarkets = computed(() => {
  if (rawData.value.length === 0) return []
  
  const latestDateStr = uniqueDates.value[0]
  if (!latestDateStr) return []

  // Get data for other markets on the latest date
  return rawData.value
    .filter(r => r.price_date.slice(0, 10) === latestDateStr && r.market_yards.name !== selectedMarket)
    .map(r => ({
      market: r.market_yards.name,
      max: r.max_price,
      date: r.price_date.slice(0, 10)
    }))
    .sort((a, b) => b.max - a.max)
    .slice(0, 8)
})

const oldestDate = computed(() => {
  if (uniqueDates.value.length === 0) return ''
  return formatDate(uniqueDates.value[uniqueDates.value.length - 1])
})

const latestDate = computed(() => {
  if (uniqueDates.value.length === 0) return ''
  return formatDate(uniqueDates.value[0])
})

const maxPriceOverall = computed(() => {
  if (rawData.value.length === 0) return 0
  const latestDt = uniqueDates.value[0]
  if (!latestDt) return 0
  
  const latestData = rawData.value.filter(r => r.price_date.slice(0, 10) === latestDt)
  const marketSpecific = latestData.find(r => r.market_yards.name === selectedMarket)
  
  if (selectedMarket && marketSpecific) return marketSpecific.max_price
  return Math.max(...latestData.map(r => r.max_price))
})

const minPriceOverall = computed(() => {
  if (rawData.value.length === 0) return 0
  const latestDt = uniqueDates.value[0]
  if (!latestDt) return 0
  
  const latestData = rawData.value.filter(r => r.price_date.slice(0, 10) === latestDt)
  const marketSpecific = latestData.find(r => r.market_yards.name === selectedMarket)
  
  if (selectedMarket && marketSpecific) return marketSpecific.min_price
  return Math.min(...latestData.filter(r => r.min_price > 0).map(r => r.min_price))
})

onMounted(() => {
  fetchData()
})

// Dynamic SEO
const pageTitle = computed(() => {
  const brand = t('brand.name')
  if (lang.value === 'gu') {
    return `${commodityName} બજાર ભાવ - છેલ્લો ૫ દિવસનો ઈતિહાસ | ${brand}`
  }
  return `${commodityName} Price Detail - Last 5 Days Rate History | ${brand}`
})

const pageDesc = computed(() => {
  const priceText = maxPriceOverall.value > 0 ? `₹${maxPriceOverall.value.toLocaleString()}` : ''
  if (lang.value === 'gu') {
    return `ગુજરાતના માર્કેટ યાર્ડના ${commodityName} ના તાજા બજાર ભાવ. આજનો સૌથી વધુ ભાવ: ${priceText}. ખેડૂતો માટે છેલ્લા ૫ દિવસના ભાવ અને વધઘટની માહિતી.`
  }
  return `Latest ${commodityName} market rates in Gujarat APMC. Today's highest price: ${priceText}. View 5-day historical price trends and daily mandi bhav updates.`
})

const pageKeywords = computed(() => {
  const base = `${commodityName} price, ${commodityName} market rate, gujarat apmc, mandi bhav, today crop price`
  const gu = `${commodityName} બજાર ભાવ, માર્કેટ યાર્ડ ભાવ, આજના બજાર ભાવ, ખેડૂત સમાચાર`
  return lang.value === 'gu' ? `${gu}, ${base}` : `${base}, ${gu}`
})

// JSON-LD Structured Data
const schemaOrg = computed(() => [
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.khedutbajarbhav.online/' },
      { '@type': 'ListItem', position: 2, name: 'Market', item: 'https://www.khedutbajarbhav.online/market' },
      { '@type': 'ListItem', position: 3, name: commodityName }
    ]
  },
  {
    '@type': 'Dataset',
    name: `${commodityName} Market Price History`,
    description: pageDesc.value,
    url: `https://www.khedutbajarbhav.online${route.fullPath}`,
    keywords: pageKeywords.value,
    creator: {
      '@type': 'Organization',
      name: 'Khedut Bajar Bhav'
    },
    variableMeasured: 'Market Price',
    temporalCoverage: `${oldestDate.value}/${latestDate.value}`
  }
])

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDesc },
    { name: 'keywords', content: pageKeywords },
    // Open Graph
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDesc },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: computed(() => `https://www.khedutbajarbhav.online${route.fullPath}`) },
    { property: 'og:image', content: 'https://www.khedutbajarbhav.online/logo.png' }, // Fallback OG image
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDesc },
    { name: 'twitter:image', content: 'https://www.khedutbajarbhav.online/logo.png' },
    // Geo Tags
    { name: 'geo.region', content: 'IN-GJ' },
    { name: 'geo.placename', content: 'Gujarat' }
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

// Optional: Dynamic OG Image if the module is installed
try {
  defineOgImageComponent('NuxtSeo', {
    title: commodityName,
    description: pageDesc,
    theme: '#22c55e',
    colorMode: 'light',
    siteName: 'Khedut Bajar Bhav',
    siteLogo: '/logo.png',
  })
} catch (e) {
  // Module might not be present, fallback to standard tags in useHead
}
</script>

<style scoped>
.sticky {
  position: sticky;
  left: 0;
  z-index: 10;
}
</style>
