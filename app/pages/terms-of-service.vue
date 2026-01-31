<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="prose prose-slate lg:prose-lg max-w-none">
      <h1 class="text-3xl font-black text-slate-900 mb-8">{{ t('footer.terms') }}</h1>
      
      <p>Last updated: {{ new Date().toLocaleDateString() }}</p>
      
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">1. Agreement to Terms</h2>
          <p class="text-slate-600">
            By accessing our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">2. Use License</h2>
          <p class="text-slate-600">
            Permission is granted to temporarily download one copy of the materials (information or software) on Khedut Bajar Bhav for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">3. Disclaimer</h2>
          <p class="text-slate-600">
            The materials on Khedut Bajar Bhav are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p class="text-slate-600 mt-2">
            Further, while we strive for accuracy, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the market price data on our website.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-3">4. Limitations</h2>
          <p class="text-slate-600">
            In no event shall Khedut Bajar Bhav or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
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
  title: computed(() => `${t('footer.terms')} - ${t('brand.name')}`),
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>
