<template>
  <section aria-labelledby="contact-title" class="space-y-6">
    <h1 id="contact-title" class="text-2xl font-bold text-slate-900">{{ t('contact.title') }}</h1>
    <div class="card">
      <div class="card-body grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 class="font-semibold">Support</h2>
          <p class="text-slate-600">Email: support@gujarat-prices.example</p>
          <p class="text-slate-600">Phone: +91-79-0000-0000</p>
        </div>
        <div>
          <h2 class="font-semibold">Feedback</h2>
          <p class="text-slate-600">Share feature requests and issues via our feedback form.</p>
          <a class="btn btn-outline mt-2" href="#" aria-label="Open feedback form">Open Form</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { translate } = useI18n()
const t = translate
</script>