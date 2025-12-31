<template>
  <section aria-labelledby="market-title" class="space-y-6 max-w-4xl mx-auto">
    <!-- Information Board -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 id="market-title" class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ t('market.title') }}</h1>
      
      <!-- Date Display (Simple) -->
      <div class="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium text-slate-700">
        {{ new Date(q.start || Date.now()).toLocaleDateString(lang === 'gu' ? 'gu-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
      </div>
    </div>

    <!-- Search / Filter Card -->
    <div class="card bg-white shadow-md border-0 ring-1 ring-slate-200/50">
      <div class="card-body flex flex-col gap-5 p-5">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="space-y-1.5" ref="marketContainer">
            <label for="market" class="block text-sm font-semibold text-slate-700">{{ t('market.marketLabel') }}</label>
            <div class="relative">
              <input 
                id="market" 
                class="input !pl-10 py-3 text-base w-full" 
                v-model="q.market" 
                @input="handleMarketInput"
                @focus="showDropdown = true"
                @blur="setTimeout(() => showDropdown = false, 200)"
                @keydown.esc="showDropdown = false"
                placeholder="e.g. Rajkot, Gondal..." 
                autocomplete="off"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <!-- Dropdown -->
              <ul v-if="showDropdown && filteredMarkets.length > 0" class="absolute z-10 w-full bg-white border border-slate-200 shadow-lg rounded-md mt-1 max-h-60 overflow-auto">
                <li 
                  v-for="m in filteredMarkets" 
                  :key="m.id" 
                  class="px-4 py-2 hover:bg-slate-50 cursor-pointer text-slate-700 font-medium"
                  @mousedown.prevent="selectMarket(m)"
                >
                  {{ m.name }}
                </li>
              </ul>
            </div>
          </div>

          <div class="space-y-1.5" ref="cropContainer">
            <label for="commodity" class="block text-sm font-semibold text-slate-700">{{ t('market.commodityLabel') || 'Commodity' }}</label>
            <div class="relative">
              <input 
                id="commodity" 
                class="input !pl-10 py-3 text-base w-full" 
                v-model="q.commodity" 
                @input="handleCropInput"
                @focus="showCropDropdown = true"
                @blur="setTimeout(() => showCropDropdown = false, 200)"
                @keydown.esc="showCropDropdown = false"
                placeholder="e.g. Wheat, Onion..." 
                autocomplete="off"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <!-- Crop Dropdown -->
              <ul v-if="showCropDropdown && cropSuggestions.length > 0" class="absolute z-10 w-full bg-white border border-slate-200 shadow-lg rounded-md mt-1 max-h-60 overflow-auto">
                <li 
                  v-for="c in cropSuggestions" 
                  :key="c.id" 
                  class="px-4 py-2 hover:bg-slate-50 cursor-pointer text-slate-700 font-medium flex justify-between"
                  @mousedown.prevent="selectCrop(c)"
                >
                  <span>{{ c.name }}</span>
                  <span class="text-slate-400 text-sm ml-2">{{ c.local_name }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="space-y-1.5">
            <label for="date" class="block text-sm font-semibold text-slate-700">{{ t('market.dateLabel') }}</label>
            <div class="relative cursor-pointer" @click="openDatePicker">
              <!-- Visual Display Input (dd-mm-yyyy) -->
              <input 
                type="text" 
                class="input py-3 text-base w-full pointer-events-none" 
                :value="formattedDate" 
                placeholder="dd-mm-yyyy"
                readonly
              />
              <!-- Actual Date Input (Hidden but interactive) -->
              <input 
                ref="dateInput"
                id="date" 
                type="date" 
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                v-model="q.start" 
                @change="applyFilters"
              />
              <!-- Calendar Icon -->
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="flex items-stretch gap-3 pt-2">
          <button 
            class="btn btn-primary flex-1 sm:flex-none py-3 text-base" 
            @click="applyFilters" 
            :disabled="loading"
          >
            <span v-if="loading">Search...</span>
            <span v-else>{{ t('market.checkPrices') }}</span>
          </button>
          <button class="btn btn-outline py-3 px-4" @click="reset">{{ t('market.reset') }}</button>
        </div>
      </div>
    </div>

    <!-- Results: Mobile Cards (No Table) -->
    <div role="region" aria-label="Filtered price list">
      <!-- Loading State -->
      <div v-if="loading" class="py-12 text-center text-slate-500">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
        <p class="mt-2">Fetching latest rates...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filtered.length === 0" class="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <p class="text-slate-500 text-lg">{{ t('market.noResults') }}</p>
        <button class="mt-4 text-primary font-medium hover:underline" @click="reset">{{ t('market.reset') }}</button>
      </div>

      <!-- Cards Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="r in filtered" 
          :key="r.date + r.market + r.commodity" 
          class="card group bg-white hover:border-primary/50 transition-colors"
        >
          <div class="p-4 flex flex-col gap-3">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {{ r.commodity }}
                </h3>
                <div class="flex items-center gap-1.5 mt-1 text-slate-600">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-sm font-medium">{{ r.market }}</span>
                </div>
              </div>
            </div>

            <div class="h-px bg-slate-100"></div>

            <div class="flex items-center justify-between">
              <div>
                <p class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{{ t('market.min') }}</p>
                <p class="text-lg font-bold text-red-600">₹{{ r.minPrice.toLocaleString() }}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{{ t('market.max') }}</p>
                <p class="text-2xl font-extrabold text-green-600">₹{{ r.maxPrice.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'

const { translate, lang } = useI18n()
const t = translate
const { query: q, fetchPrices, filtered, loading } = usePrices()
const client = useSupabaseClient()
const route = useRoute()
const router = useRouter()

// Sync Route Query to State (Top-level for SSR)
if (route.query.market) q.value.market = route.query.market.toString()
if (route.query.commodity) q.value.commodity = route.query.commodity.toString()
if (route.query.start) q.value.start = route.query.start.toString()
if (route.query.end) q.value.end = route.query.end.toString()

// Dynamic SEO Meta Tags
const pageTitle = computed(() => {
  const parts = []
  if (q.value.commodity) parts.push(q.value.commodity)
  if (q.value.market) parts.push(`${q.value.market} Market`)
  
  if (parts.length > 0) {
    return `${parts.join(' in ')} Prices - Live Rates | Gujarat APMC`
  }
  return 'Gujarat Market Yard Prices - Live Agricultural Commodity Rates'
})

const pageDescription = computed(() => {
  if (q.value.commodity && q.value.market) {
    return `Check today's live ${q.value.commodity} prices in ${q.value.market} APMC. Specific details including minimum, maximum, and modal prices.`
  }
  if (q.value.market) {
    return `Live market rates at ${q.value.market} APMC. Track daily prices for all commodities arrived today.`
  }
  if (q.value.commodity) {
    return `Current market prices for ${q.value.commodity} across all Gujarat APMC market yards. Compare rates and trends.`
  }
  return 'Get real-time agricultural commodity prices from Gujarat market yards. Track daily rates for vegetables, fruits, grains, and other produce.'
})

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: computed(() => `${q.value.market || 'Gujarat'} APMC, ${q.value.commodity || 'commodity'} price, market yard rates, mandi bhav, agriculture prices`) },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:url', content: computed(() => `https://yourwebsite.com${route.fullPath}`) },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'canonical', href: computed(() => `https://yourwebsite.com${route.fullPath}`) }
  ]
})

// JSON-LD Structured Data
const schemaOrg = computed(() => {
  const items = [
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://yourwebsite.com' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Market Prices', 'item': 'https://yourwebsite.com/market' }
      ]
    }
  ]
  
  // If specific filters are active, we could detail them, but usually breadcrumbs suffice.
  // We can add a Dataset if we have results.
  if (filtered.value.length > 0) {
     items.push({
      '@type': 'Dataset',
      'name': pageTitle.value,
      'description': pageDescription.value,
      'license': 'https://creativecommons.org/publicdomain/zero/1.0/',
       'creator': {
         '@type': 'Organization',
         'name': 'Gujarat Market Yard Price Portal'
       }
    })
  }

  return items
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(schemaOrg.value))
    }
  ]
})


const marketYards = ref([])
const showDropdown = ref(false)
const marketContainer = ref(null)

// Crop Search Logic
const cropSuggestions = ref([])
const showCropDropdown = ref(false)
const cropContainer = ref(null)

const handleClickOutside = (event) => {
  if (marketContainer.value && !marketContainer.value.contains(event.target)) {
    showDropdown.value = false
  }
  if (cropContainer.value && !cropContainer.value.contains(event.target)) {
    showCropDropdown.value = false
  }
}

const handleCropInput = (e) => {
  const val = e.target.value
  if (!val || val.trim() === '') {
    cropSuggestions.value = []
    // If cleared, fetch all
    applyFilters()
    return
  }
  if (val.length < 2) {
    cropSuggestions.value = []
    return
  }
  fetchCropSuggestions(val)
}

const handleMarketInput = () => {
    // If user clears the market input, fetch all
    if (!q.value.market || q.value.market.trim() === '') {
        applyFilters()
    }
}

const fetchCropSuggestions = async (searchTerm) => {
    const { data, error } = await client
        .from('crops')
        .select('id, name, local_name')
        .or(`name.ilike.%${searchTerm}%,local_name.ilike.%${searchTerm}%`)
        .limit(10)
    
    if (data) {
        cropSuggestions.value = data
    }
}

const selectCrop = (crop) => {
    q.value.commodity = crop.name // Use English name for standard search
    showCropDropdown.value = false
    applyFilters()
}

const fetchMarketYards = async () => {
    const { data, error } = await client
        .from('market_yards')
        .select('id, name')
        .order('name')
    if (data) {
        marketYards.value = data
    }
}

const filteredMarkets = computed(() => {
    if (!q.value.market) return marketYards.value
    return marketYards.value.filter(m => 
        m.name.toLowerCase().includes(q.value.market.toLowerCase())
    )
})

const selectMarket = (market) => {
    q.value.market = market.name
    showDropdown.value = false
    applyFilters()
}

const formattedDate = computed(() => {
  if (!q.value.start) return ''
  const [y, m, d] = q.value.start.split('-')
  return `${d}-${m}-${y}`
})

const dateInput = ref(null)
const openDatePicker = () => {
    if (dateInput.value) {
        if (typeof dateInput.value.showPicker === 'function') {
            dateInput.value.showPicker()
        } else {
            dateInput.value.focus() 
            dateInput.value.click()
        }
    }
}

onMounted(() => {
  const today = new Date().toISOString().slice(0, 10)
  if (!q.value.start) q.value.start = today
  if (!q.value.end) q.value.end = today
  fetchPrices()
  fetchMarketYards()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const reset = () => {
  q.value.market = ''
  q.value.commodity = ''
  const today = new Date().toISOString().slice(0, 10)
  q.value.start = today
  q.value.end = today
  router.replace({ path: route.path, query: {} })
}

const applyFilters = () => {
  q.value.end = q.value.start
  const nextQuery = {}
  if (q.value.market && q.value.market.trim() !== '') nextQuery.market = q.value.market.trim()
  if (q.value.commodity && q.value.commodity.trim() !== '') nextQuery.commodity = q.value.commodity.trim()
  if (q.value.start) nextQuery.start = q.value.start
  router.push({ path: route.path, query: nextQuery })
}

// Watch navigation changes
watch(() => route.query, (newQuery) => {
  const m = newQuery.market ? newQuery.market.toString() : ''
  const c = newQuery.commodity ? newQuery.commodity.toString() : ''
  const s = newQuery.start ? newQuery.start.toString() : ''
  if (m !== q.value.market) q.value.market = m
  if (c !== q.value.commodity) q.value.commodity = c
  if (s && s !== q.value.start) {
    q.value.start = s
    q.value.end = s
  }
  fetchPrices()
})

</script>
