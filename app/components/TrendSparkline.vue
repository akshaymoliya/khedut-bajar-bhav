<template>
  <div class="relative w-full h-full group/graph" ref="container">
    <svg 
      class="w-full h-full overflow-visible" 
      :viewBox="`0 0 ${viewWidth} ${viewHeight}`" 
      preserveAspectRatio="none"
      @mousemove="handleMouseMove"
      @mouseleave="activePoint = null"
      @touchstart="handleTouch"
    >
      <defs>
        <linearGradient :id="`gradient-${id}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="stroke" stop-opacity="0.3" />
          <stop offset="100%" :stop-color="stroke" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Area Fill -->
      <path 
        v-if="areaPath" 
        :d="areaPath" 
        :fill="`url(#gradient-${id})`" 
        class="transition-all duration-700 ease-in-out"
      />

      <!-- Main Path -->
      <path 
        :d="linePath" 
        fill="none" 
        :stroke="stroke" 
        stroke-width="3" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="transition-all duration-700 ease-in-out pointer-events-none"
      />

      <!-- Interaction Layer -->
      <rect 
        :width="viewWidth" 
        :height="viewHeight" 
        fill="transparent" 
        @mousemove="handleMouseMove"
        @mouseleave="activePoint = null"
        @touchstart="handleTouch"
        class="cursor-crosshair"
      />

      <!-- Interaction Line -->
      <line 
        v-if="activePoint" 
        :x1="activePoint.x" 
        :x2="activePoint.x" 
        y1="0" 
        :y2="viewHeight" 
        stroke="currentColor" 
        stroke-width="1" 
        stroke-dasharray="4"
        class="text-slate-300 pointer-events-none"
      />

      <!-- Data Points -->
      <circle 
        v-for="(p, i) in coords" 
        :key="i"
        :cx="p.x" 
        :cy="p.y" 
        :r="activePoint?.index === i ? 6 : 4" 
        :fill="activePoint?.index === i ? stroke : 'white'"
        :stroke="stroke"
        stroke-width="2"
        class="transition-all duration-200 pointer-events-none"
      />
    </svg>

    <!-- Tooltip -->
    <div 
      v-if="activePoint && activePoint.data.date" 
      class="absolute z-50 pointer-events-none bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-xl transition-all duration-150"
      :style="tooltipStyle"
    >
      <div class="whitespace-nowrap space-y-1">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ activePoint.data.date }}</p>
        <div class="flex items-center justify-between gap-6">
          <span class="text-xs font-bold text-slate-600">{{ t('crop.highest') }}</span>
          <span class="text-sm font-black text-green-600">₹{{ activePoint.data.max.toLocaleString() }}</span>
        </div>
        <div class="flex items-center justify-between gap-6">
          <span class="text-xs font-bold text-slate-600">{{ t('crop.lowest') }}</span>
          <span class="text-sm font-black text-red-600">₹{{ activePoint.data.min.toLocaleString() }}</span>
        </div>
        <div v-if="activePoint.data.market" class="pt-1 mt-1 border-t border-slate-100 italic text-[10px] text-slate-500">
          {{ activePoint.data.market }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { t } = useI18n()
const props = defineProps({
  data: { type: Array, required: false, default: () => [] }, 
  points: { type: Array, required: false, default: null }, // for backward compatibility
  stroke: { type: String, default: '#10b981' },
})

const id = Math.random().toString(36).substr(2, 9)
const container = ref(null)
const viewWidth = 1000
const viewHeight = 250
const padding = 40

const activePoint = ref(null)

const tooltipStyle = computed(() => {
  if (!activePoint.value) return {}
  
  const xPercent = (activePoint.value.x / viewWidth) * 100
  let translateX = '-50%'
  
  // Adjust horizontal position if near edges to prevent clipping
  if (xPercent < 20) translateX = '0%'
  else if (xPercent > 80) translateX = '-100%'
  
  return {
    left: `${xPercent}%`,
    top: `${(activePoint.value.y / viewHeight) * 100 - 12}px`,
    transform: `translate(${translateX}, -100%)`
  }
})

const normalizedData = computed(() => {
  const source = props.points || props.data || []
  return source.map((d, i) => {
    if (typeof d === 'number') {
      return { value: d, min: d, max: d, date: '', market: '' }
    }
    return {
      value: d.value ?? 0,
      min: d.min ?? d.value ?? 0,
      max: d.max ?? d.value ?? 0,
      date: d.date ?? '',
      market: d.market ?? ''
    }
  })
})

const coords = computed(() => {
  if (!normalizedData.value.length) return []
  
  const values = normalizedData.value.map(d => d.value)
  const maxVal = Math.max(...values, 1)
  const minVal = Math.min(...values, 0)
  const range = Math.max(maxVal - minVal, 1)

  return normalizedData.value.map((d, i) => {
    const x = padding + (i * (viewWidth - padding * 2)) / Math.max(normalizedData.value.length - 1, 1)
    const y = (viewHeight - padding) - ((d.value - minVal) / range) * (viewHeight - padding * 2)
    return { x, y, data: d, index: i }
  })
})

const linePath = computed(() => {
  if (coords.value.length < 2) return ''
  
  return coords.value.reduce((path, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`
    
    // Smooth curves using cubic bezier
    const prev = coords.value[i - 1]
    const cp1x = prev.x + (p.x - prev.x) / 2
    const cp2x = prev.x + (p.x - prev.x) / 2
    return `${path} C ${cp1x},${prev.y} ${cp2x},${p.y} ${p.x},${p.y}`
  }, '')
})

const areaPath = computed(() => {
  if (!linePath.value) return ''
  return `${linePath.value} V ${viewHeight} H ${padding} Z`
})

const handleMouseMove = (e) => {
  if (!container.value) return
  const rect = container.value.getBoundingClientRect()
  const xPercentage = (e.clientX - rect.left) / rect.width
  const graphX = xPercentage * viewWidth
  
  // Find closest point
  const closest = coords.value.reduce((prev, curr) => {
    return Math.abs(curr.x - graphX) < Math.abs(prev.x - graphX) ? curr : prev
  })
  
  activePoint.value = closest
}

const handleTouch = (e) => {
  if (e.touches && e.touches[0]) {
    handleMouseMove(e.touches[0])
  }
}
</script>

<style scoped>
.sparkline-container {
  touch-action: pan-y;
}
</style>