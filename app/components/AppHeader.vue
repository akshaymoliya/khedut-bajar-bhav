<template>
  <header class="app-header">
    <div class="container flex items-center justify-between py-3">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-3"
        aria-label="Khedut Bajar Bhav home"
      >
        <img src="/favicon.ico" alt="Logo" class="h-8 w-8 rounded" />
        <div>
          <p class="text-lg font-bold text-slate-900 leading-tight">{{ t('brand.name') }}</p>
          <p class="text-[10px] sm:text-xs text-slate-600 truncate max-w-[180px] sm:max-w-none">{{ t('brand.tagline') }}</p>
        </div>
      </NuxtLink>

      <!-- Navigation links (visible on laptop and above) -->
      <nav class="nav hidden lg:flex items-center gap-6" aria-label="Main">
        <NuxtLink exact-active-class="active" to="/">{{ t('nav.home') }}</NuxtLink>
        <NuxtLink exact-active-class="active" to="/market">{{ t('nav.market') }}</NuxtLink>
        <NuxtLink exact-active-class="active" to="/weather">{{ t('nav.weather') }}</NuxtLink>
        <NuxtLink exact-active-class="active" to="/about">{{ t('nav.about') }}</NuxtLink>
        <NuxtLink exact-active-class="active" to="/contact">{{ t('nav.contact') }}</NuxtLink>
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-2">
        <!-- Language Selector -->
        <!-- Language Selector (Toggle) -->
        <div class="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
          <button
            @click="setLang('gu')"
            class="px-3 py-1.5 text-sm font-bold rounded-md transition-all duration-200"
            :class="lang === 'gu' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
            aria-label="Switch to Gujarati"
          >
            ગુજરાતી
          </button>
          <button
            @click="setLang('en')"
            class="px-3 py-1.5 text-sm font-bold rounded-md transition-all duration-200"
            :class="lang === 'en' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
            aria-label="Switch to English"
          >
            Eng
          </button>
        </div>

        <!-- Mobile Menu Button (visible only below laptop breakpoint) -->
        <button
          class="btn btn-outline touch-target menu-toggle"
          @click="toggleMobile"
          :aria-expanded="mobileOpen.toString()"
          aria-controls="mobile-menu"
          aria-label="Open menu"
        >
          <!-- Hamburger icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
            <path
              fill-rule="evenodd"
              d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75zm.75 4.5a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu (hidden at laptop breakpoint and above) -->
    <Transition name="fade">
      <div
        v-if="mobileOpen"
        id="mobile-menu"
        class="mobile-menu menu-overlay bg-white/95 backdrop-blur border-t border-slate-200"
        @keydown.esc="mobileOpen = false"
      >
        <div class="container py-4 flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3" aria-label="Home">
            <img src="/favicon.ico" alt="Logo" class="h-8 w-8 rounded" loading="lazy" />
            <p class="text-lg font-bold text-slate-900">{{ t('brand.name') }}</p>
          </NuxtLink>

          <!-- Close button -->
          <button class="btn btn-outline" @click="mobileOpen = false" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
              <path
                fill-rule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 9.94l5.47-5.47a.75.75 0 0 1 1.06 1.06L13.06 11l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 12.06l-5.47 5.47a.75.75 0 1 1-1.06-1.06L10.94 11 5.47 5.53a.75.75 0 0 1 0-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <nav class="flex flex-col gap-2 px-4 pb-4">
          <NuxtLink @click="closeMobile" to="/" class="btn btn-outline text-lg justify-start">{{ t('nav.home') }}</NuxtLink>
          <NuxtLink @click="closeMobile" to="/market" class="btn btn-outline text-lg justify-start">{{ t('nav.market') }}</NuxtLink>
          <NuxtLink @click="closeMobile" to="/weather" class="btn btn-outline text-lg justify-start">{{ t('nav.weather') }}</NuxtLink>
          <NuxtLink @click="closeMobile" to="/about" class="btn btn-outline text-lg justify-start">{{ t('nav.about') }}</NuxtLink>
          <NuxtLink @click="closeMobile" to="/contact" class="btn btn-outline text-lg justify-start">{{ t('nav.contact') }}</NuxtLink>

          <div class="mt-2">
            <!-- Mobile Language Toggle -->
            <div class="grid grid-cols-2 gap-2 mt-2">
              <button
                @click="setLang('gu')"
                class="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 transition-all font-bold"
                :class="lang === 'gu' ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-50 text-slate-600'"
              >
                <span>🇮🇳</span>
                ગુજરાતી
              </button>
              <button
                @click="setLang('en')"
                class="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 transition-all font-bold"
                :class="lang === 'en' ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-50 text-slate-600'"
              >
                <span>ABC</span>
                English
              </button>
            </div>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const { translate, lang, setLang } = useI18n()
const t = translate
const mobileOpen = ref(false)
const toggleMobile = () => { mobileOpen.value = !mobileOpen.value }
const closeMobile = () => { mobileOpen.value = false }
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
