<template>
  <div class="min-h-dvh flex flex-col">
    <NuxtRouteAnnouncer />
    <AppHeader />
    <main class="flex-1 container pt-24 py-6">
      <NuxtPage />
    </main>
    <footer class="border-t border-slate-200 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.05)] mt-12">
      <div class="container py-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2 space-y-4">
            <h3 class="font-bold text-slate-900 text-lg">{{ t('brand.name') }}</h3>
            <p class="text-slate-500 max-w-sm">{{ t('index.hero.subtitle') }}</p>
          </div>
          <div class="space-y-4">
            <h4 class="font-bold text-slate-900 uppercase text-xs tracking-widest">{{ t('nav.market') }}</h4>
            <ul class="space-y-2 text-slate-600">
              <li><NuxtLink to="/market" class="hover:text-primary transition-colors">{{ t('footer.latestPrices') }}</NuxtLink></li>
              <li><NuxtLink to="/weather" class="hover:text-primary transition-colors">{{ t('footer.weather') }}</NuxtLink></li>
            </ul>
          </div>
          <div class="space-y-4">
            <h4 class="font-bold text-slate-900 uppercase text-xs tracking-widest">{{ t('footer.support') }}</h4>
            <ul class="space-y-2 text-slate-600">
              <li><NuxtLink to="/about" class="hover:text-primary transition-colors">{{ t('footer.about') }}</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-primary transition-colors">{{ t('footer.contact') }}</NuxtLink></li>
            </ul>
          </div>
        </div>
        <div class="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© {{ new Date().getFullYear() }} {{ t('brand.name') }}. {{ t('footer.rights') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';

const { translate: t } = useI18n()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>
