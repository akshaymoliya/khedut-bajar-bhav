<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="prose prose-slate lg:prose-lg max-w-none">
      <h1 class="text-3xl font-black text-slate-900 mb-8">{{ t('footer.privacy') }}</h1>
      
      <p>Last updated: {{ new Date().toLocaleDateString() }}</p>
      
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
          <p class="text-slate-600">
            We collect minimal information to provide you with the best experience. This includes:
          </p>
          <ul class="list-disc pl-5 text-slate-600 mt-2 space-y-1">
            <li>Usage data (pages visited, time spent) to improve our portal.</li>
            <li>Language preferences (via cookies) to show content in Gujarati or English.</li>
            <li>Any information you voluntarily provide via our contact form.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
          <p class="text-slate-600">
            We use the information to:
          </p>
          <ul class="list-disc pl-5 text-slate-600 mt-2 space-y-1">
            <li>Provide and maintain the Service.</li>
            <li>Notify you about changes to our Service.</li>
            <li>Allow you to participate in interactive features when you choose to do so.</li>
            <li>Provide customer support.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">3. Cookies</h2>
          <p class="text-slate-600">
            We use cookies to store your language preference so you don't have to select it every time you visit.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">4. Contact Us</h2>
          <p class="text-slate-600">
            If you have any questions about this Privacy Policy, please contact us via our Contact page.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

// SEO
useHead({
  title: computed(() => `${t('footer.privacy')} - ${t('brand.name')}`),
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>
