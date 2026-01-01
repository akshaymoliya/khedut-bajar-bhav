<template>
  <div class="min-h-dvh flex flex-col">
    <NuxtRouteAnnouncer />
    <AppHeader />
    <main class="flex-1 container pt-24 py-6">
      <NuxtPage />
    </main>
    <footer class="border-t border-slate-200 bg-white/70">
      <div class="container py-6 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          © {{ new Date().getFullYear() }} Gujarat Market Price Tracker
        </p>
        <p class="flex items-center gap-2">
          <span class="badge">WCAG AA</span>
          <span class="badge">Nuxt 4</span>
          <span class="badge">Tailwind 4</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>
