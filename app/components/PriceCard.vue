<template>
  <NuxtLink 
    :to="{ path: '/market', query: { commodity: commodity, market: market } }"
    class="card bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow block text-slate-900 no-underline" 
    role="group" 
    :aria-label="`View ${commodity} prices in ${market}`"
  >
    <div class="p-4 flex flex-col gap-3">
      <!-- Header: Commodity & Market -->
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-xl font-bold text-slate-900">{{ commodity }}</h3>
          <p class="text-sm text-slate-600 font-medium">{{ market }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold">{{ t('market.avg') }}</p>
          <p class="text-2xl font-extrabold text-primary">₹{{ avg.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-px bg-slate-100 my-1"></div>

      <!-- Footer: Min/Max & Trend -->
      <div class="flex items-center justify-between">
        <div class="flex gap-4">
          <div>
            <p class="text-xs text-slate-500 mb-0.5">{{ t('market.min') }}</p>
            <p class="text-base font-bold text-red-600">₹{{ min.toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-0.5">{{ t('market.max') }}</p>
            <p class="text-base font-bold text-green-600">₹{{ max.toLocaleString() }}</p>
          </div>
        </div>
        <div class="w-24 h-10">
          <TrendSparkline :points="trend" :label="`${commodity} trend`" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const { translate } = useI18n()
const t = translate

defineProps({
  commodity: { type: String, required: true },
  market: { type: String, required: true },
  avg: { type: Number, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  trend: { type: Array, required: true },
})
</script>