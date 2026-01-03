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
          © {{ new Date().getFullYear() }} {{ t('brand.name') }}
        </p>
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
