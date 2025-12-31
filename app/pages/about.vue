<template>
  <section aria-labelledby="about-title" class="space-y-6">
    <h1 id="about-title" class="text-2xl font-bold text-slate-900">{{ t('about.title') }}</h1>
    <div class="space-y-3 text-slate-700">
      <p>
        This platform tracks agricultural market prices across Gujarat, providing an accessible and fast interface for farmers, traders, and analysts. It features responsive design, bilingual UI (Gujarati and English), and data visualizations to understand price trends.
      </p>
      <p>
        Built with Nuxt 4 and Tailwind CSS 4, it leverages modern auto-imports, TypeScript, optimized builds, and WCAG-compliant UI components.
      </p>
    </div>
  </section>
</template>

<script setup>
const { translate } = useI18n()
const t = translate
</script>