<template>
  <section aria-labelledby="hero-title" class="space-y-8 mt-4 sm:mt-8 max-w-5xl mx-auto">
    <!-- Simplified Hero -->
    <div class="hero text-center py-10 sm:py-16">
      <div class="flex flex-col gap-6 items-center max-w-2xl mx-auto">
        <h1 id="hero-title" class="hero-title">
          {{ translate('index.hero.title') }}
        </h1>
        <p class="hero-subtitle text-lg sm:text-xl">{{ translate('index.hero.subtitle') }}</p>
        
        <!-- Large Search Bar -->
        <div class="w-full max-w-lg relative mt-2">
          <label class="sr-only" for="commoditySearch">{{ translate('market.search') }}</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              id="commoditySearch" 
              class="input !pl-14 pr-20 sm:pr-32 py-4 text-lg shadow-sm border-slate-300 focus:ring-4 focus:ring-primary/20 rounded-full" 
              :placeholder="translate('index.search.placeholder')" 
              v-model="q.commodity" 
              @keyup.enter="gotoMarket"
            />
            <button 
              class="absolute right-2 top-2 bottom-2 bg-primary text-white px-3 sm:px-6 rounded-full font-bold hover:bg-primary/90 transition-all"
              @click="gotoMarket"
            >
              {{ translate('nav.market') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Access Links (Chips) -->
    <section aria-labelledby="quicklinks-title" class="px-4 text-center">
      <h2 id="quicklinks-title" class="sr-only">
        {{ translate('index.quickLinks') }}
      </h2>
      <p class="text-sm text-slate-500 mb-3 font-medium uppercase tracking-wide">Popular Commodities</p>
      <div class="flex flex-wrap justify-center gap-3">
        <NuxtLink 
          v-for="c in commodities" 
          :key="c" 
          :to="{ path: '/market', query: { commodity: c } }" 
          class="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-sm font-semibold shadow-sm" 
          :aria-label="`View ${c} market prices`"
        >
          {{ c }}
        </NuxtLink>
      </div>
    </section>

    <!-- Highlights Grid -->
    <section aria-labelledby="highlights-title" class="space-y-4 px-4 sm:px-0">
      <div class="flex items-center justify-between">
        <h2 id="highlights-title" class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <svg class="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {{ translate('index.highlights') }}
        </h2>
        <NuxtLink to="/market" class="text-primary font-semibold hover:underline">View All &rarr;</NuxtLink>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PriceCard 
          v-for="h in highlights" 
          :key="h.key" 
          :commodity="h.commodity" 
          :market="h.market" 
          :avg="h.avg" 
          :min="h.min" 
          :max="h.max" 
          :trend="h.trend" 
        />
      </div>
    </section>

    <!-- Browse by Category -->
    <section aria-labelledby="category-title" class="px-4 sm:px-0">
      <h2 id="category-title" class="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span class="text-2xl">📦</span> {{ translate('index.categories.title') || 'Browse by Category' }}
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <NuxtLink 
          v-for="cat in categories" 
          :key="cat.key"
          :to="{ path: '/market', query: { commodity: cat.name } }"
          class="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 hover:bg-primary/5 transition-all group"
        >
          <span class="text-4xl mb-2 group-hover:scale-110 transition-transform">{{ cat.icon }}</span>
          <span class="font-semibold text-slate-700 group-hover:text-primary text-center text-sm sm:text-base">{{ cat.label }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- How it Works Section -->
    <section aria-labelledby="how-title" class="px-4 sm:px-0 py-8">
      <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 sm:p-10">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <h2 id="how-title" class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
             {{ translate('index.howItWorks.title') }}
          </h2>
          <div class="h-1 w-20 bg-indigo-500 mx-auto rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
           <!-- Step 1 -->
           <div class="flex flex-col items-center text-center">
             <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-2xl border border-indigo-100">
               📍
             </div>
             <h3 class="font-bold text-lg text-slate-800 mb-2">{{ translate('index.howItWorks.steps.0.title') }}</h3>
             <p class="text-slate-600 text-sm">{{ translate('index.howItWorks.steps.0.desc') }}</p>
           </div>
           
           <!-- Step 2 -->
           <div class="flex flex-col items-center text-center relative">
             <div class="hidden md:block absolute top-8 -left-1/2 w-full h-0.5 bg-indigo-200 -z-10"></div>
             <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-2xl border border-indigo-100 relative z-10">
               📈
             </div>
             <h3 class="font-bold text-lg text-slate-800 mb-2">{{ translate('index.howItWorks.steps.1.title') }}</h3>
             <p class="text-slate-600 text-sm">{{ translate('index.howItWorks.steps.1.desc') }}</p>
           </div>
           
           <!-- Step 3 -->
           <div class="flex flex-col items-center text-center relative">
             <div class="hidden md:block absolute top-8 -left-1/2 w-full h-0.5 bg-indigo-200 -z-10"></div>
             <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-2xl border border-indigo-100 relative z-10">
               🤝
             </div>
             <h3 class="font-bold text-lg text-slate-800 mb-2">{{ translate('index.howItWorks.steps.2.title') }}</h3>
             <p class="text-slate-600 text-sm">{{ translate('index.howItWorks.steps.2.desc') }}</p>
           </div>
        </div>
      </div>
    </section>


    <!-- Additional Info Section -->
    <!-- Improved About Section -->
    <section aria-labelledby="about-title" class="px-4 py-8 sm:px-0">
      <div class="card overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <div class="card-body p-6 sm:p-10">
          <div class="flex flex-col md:flex-row gap-8 items-center">
            <div class="flex-1 space-y-4">
              <span class="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full tracking-wide uppercase">
                {{ translate('index.aboutSection.badge') }}
              </span>
              <h2 id="about-title" class="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {{ translate('index.aboutSection.title') }}
              </h2>
              <p class="text-slate-600 text-lg leading-relaxed">
                {{ translate('index.aboutSection.description') }}
              </p>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-primary/10 rounded-lg text-primary">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-800">{{ translate('index.aboutSection.features.accurate.title') }}</h3>
                    <p class="text-sm text-slate-500">{{ translate('index.aboutSection.features.accurate.desc') }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="p-2 bg-primary/10 rounded-lg text-primary">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-800">{{ translate('index.aboutSection.features.history.title') }}</h3>
                    <p class="text-sm text-slate-500">{{ translate('index.aboutSection.features.history.desc') }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="w-full md:w-1/3 flex justify-center">
              <div class="relative w-48 h-48 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                 <span class="text-6xl">🌾</span> <!-- Fallback icon/image -->
                 <div class="absolute -bottom-4 bg-white px-4 py-2 rounded-lg shadow-md border border-slate-100">
                    <span class="font-bold text-primary">{{ translate('index.aboutSection.kisanBadge') }}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue'

// SEO Meta Tags
useHead({
  title: 'Khedut Bajar Bhav - ખેડૂત બજાર ભાવ | Live Gujarat APMC Market Yard Prices',
  meta: [
    {
      name: 'description',
      content: 'ખેડૂત બજાર ભાવ - Get real-time agricultural commodity prices from Gujarat market yards. Track daily rates for Cotton, Groundnut, Wheat, Onion and other produce across all APMC markets in Gujarat.'
    },
    {
      name: 'keywords',
      content: 'ખેડૂત બજાર ભાવ, Khedut Bajar Bhav, Gujarat APMC rates, market yard prices, daily mandi bhav, Cotton price Gujarat, Groundnut price today, Wheat rates, Gondal APMC, Rajkot Market Yard, Ahmedabad APMC'
    },
    {
      name: 'author',
      content: 'Gujarat Market Yard Price Portal'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    // Open Graph / Facebook
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:title',
      content: 'Khedut Bajar Bhav - ખેડૂત બજાર ભાવ | Live Gujarat APMC Prices'
    },
    {
      property: 'og:description',
      content: 'Track real-time agricultural commodity prices (ખેડૂત બજાર ભાવ) from Gujarat market yards. Daily rates for Cotton, Groundnut, and more.'
    },
    {
      property: 'og:locale',
      content: 'en_IN'
    },
    // Twitter
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Gujarat Market Yard Prices - Live Agricultural Commodity Rates'
    },
    {
      name: 'twitter:description',
      content: 'Track real-time agricultural commodity prices from Gujarat market yards.'
    },
    // Geo Tags
    {
      name: 'geo.region',
      content: 'IN-GJ'
    },
    {
      name: 'geo.placename',
      content: 'Gujarat'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://www.khedutbajarbhav.online/'
    }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

// JSON-LD Structured Data (without external module)
const schemaOrg = [
  {
    '@type': 'WebSite',
    name: 'Khedut Bajar Bhav',
    description: 'Agricultural commodity prices from Gujarat market yards (ખેડૂત બજાર ભાવ)',
    url: 'https://www.khedutbajarbhav.online',
    inLanguage: 'gu-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.khedutbajarbhav.online/market?commodity={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  },
  {
    '@type': 'Organization',
    name: 'Khedut Bajar Bhav',
    url: 'https://www.khedutbajarbhav.online',
    logo: 'https://www.khedutbajarbhav.online/logo.png',
    description: 'Providing real-time agricultural market prices from Gujarat APMCs',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Gujarat',
      addressCountry: 'IN'
    }
  }
]

useHead({
  script: [
    {
      type: 'application/ld+json',
      // unhead uses `children` to set inline JSON safely
      children: JSON.stringify(schemaOrg)
    }
  ]
})

const { translate } = useI18n()
const t = translate
const router = useRouter()
const { query: q, fetchPrices, summary, commodities, rows } = usePrices()

const categories = [
  { name: 'Onion', label: 'Vegetables', icon: '🥬', key: 'vegetable' },
  { name: 'Mango', label: 'Fruits', icon: '🍎', key: 'fruit' },
  { name: 'Wheat', label: 'Grains', icon: '🌾', key: 'grains' },
  { name: 'Groundnut', label: 'Oilseeds', icon: '🌻', key: 'oilseeds' },
  { name: 'Jeera', label: 'Spices', icon: '🌶️', key: 'spices' },
  { name: 'Cotton', label: 'Cotton', icon: '🧵', key: 'cotton' },
]

const gotoMarket = () => {
  if (q.value.commodity?.trim()) {
    router.push({ path: '/market', query: { commodity: q.value.commodity } })
  } else {
    router.push({ path: '/market' })
  }
}

const highlights = computed(() => {
  // Top 3 commodities by avg across latest day
  const today = rows.value[0]?.date
  if (!today) return []
  
  const latestDayRows = rows.value.filter((r) => r.date === today)
  const groups = new Map()
  
  for (const r of latestDayRows) {
    const key = r.commodity
    const trend = rows.value
      .filter((x) => x.commodity === r.commodity && x.market === r.market)
      .slice(0, 10)
      .map((x) => x.avgPrice)
      .reverse()
    
    const item = groups.get(key)
    if (!item || r.avgPrice > item.avg) {
      groups.set(key, { 
        market: r.market, 
        avg: r.avgPrice, 
        min: r.minPrice, 
        max: r.maxPrice, 
        trend, 
        key: r.market + r.commodity, 
        commodity: r.commodity 
      })
    }
  }
  
  return Array.from(groups.values())
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 3)
})

const latest = computed(() => rows.value.slice(0, 8))

onMounted(fetchPrices)
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>