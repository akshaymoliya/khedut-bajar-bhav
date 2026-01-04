<template>
  <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl sm:text-5xl font-black text-slate-900 mb-6">{{ t('about.title') }}</h1>
      <p class="text-xl text-primary font-bold mb-8">{{ t('about.subtitle') }}</p>
      <div class="max-w-3xl mx-auto">
        <p class="text-lg text-slate-600 leading-relaxed">
          {{ t('about.description') }}
        </p>
      </div>
    </div>

    <!-- Vision Section -->
    <div class="bg-primary/5 rounded-3xl p-8 sm:p-12 mb-16 border border-primary/10 relative overflow-hidden">
      <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-black text-slate-900 mb-6">{{ t('about.vision') }}</h2>
          <p class="text-lg text-slate-700 leading-relaxed">
            {{ t('about.visionDesc') }}
          </p>
        </div>
        <div class="flex justify-center">
          <div class="w-48 h-48 bg-white rounded-full flex items-center justify-center text-7xl shadow-xl shadow-primary/10">
            🌱
          </div>
        </div>
      </div>
      <!-- Decoration -->
      <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Features Grid -->
    <div class="mb-16">
      <h2 class="text-3xl font-black text-center text-slate-900 mb-12">{{ t('about.featuresTitle') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Feature 1 -->
        <div class="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-transform">
          <div class="text-4xl mb-6">📈</div>
          <h3 class="text-xl font-bold text-slate-900 mb-4">{{ t('about.feature1Title') }}</h3>
          <p class="text-slate-600">{{ t('about.feature1Desc') }}</p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-transform">
          <div class="text-4xl mb-6">📱</div>
          <h3 class="text-xl font-bold text-slate-900 mb-4">{{ t('about.feature2Title') }}</h3>
          <p class="text-slate-600">{{ t('about.feature2Desc') }}</p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-transform">
          <div class="text-4xl mb-6">🤝</div>
          <h3 class="text-xl font-bold text-slate-900 mb-4">{{ t('about.feature3Title') }}</h3>
          <p class="text-slate-600">{{ t('about.feature3Desc') }}</p>
        </div>

        <!-- Feature 4 -->
        <div class="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-transform">
          <div class="text-4xl mb-6">🌤️</div>
          <h3 class="text-xl font-bold text-slate-900 mb-4">{{ t('about.feature4Title') }}</h3>
          <p class="text-slate-600">{{ t('about.feature4Desc') }}</p>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center bg-slate-900 rounded-3xl p-12 text-white">
      <h2 class="text-3xl font-bold mb-6">Connecting Farmers to Markets</h2>
      <p class="text-slate-400 mb-8 max-w-2xl mx-auto">
        Join thousands of farmers across Gujarat who use Khedut Bajar Bhav daily to stay ahead.
      </p>
      <NuxtLink to="/market" class="btn btn-primary px-8 py-3 rounded-xl text-lg inline-flex items-center gap-2">
        View Live Prices 🚀
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const { t } = useI18n()
const route = useRoute()

useHead({
  title: computed(() => `${t('about.title')} - ${t('brand.name')}`),
  meta: [
    { name: 'description', content: computed(() => t('about.description')) },
    { name: 'keywords', content: computed(() => `about Khedut Bajar Bhav, Gujarat agriculture portal, farmer mission, APMC price tracker info, ${t('brand.name')}`) },
    { property: 'og:title', content: computed(() => `${t('about.title')} - ${t('brand.name')}`) },
    { property: 'og:description', content: computed(() => t('about.description')) },
    { property: 'og:url', content: computed(() => `https://www.khedutbajarbhav.online${route.fullPath}`) },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'canonical', href: computed(() => `https://www.khedutbajarbhav.online${route.fullPath}`) }
  ]
})
</script>