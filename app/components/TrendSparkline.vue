<template>
  <svg :width="width" :height="height" viewBox="0 0 100 30" role="img" :aria-label="label">
    <path :d="path" fill="none" stroke="stroke" stroke-width="1.5" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  points: { type: Array, required: true },
  width: { type: Number, default: 120 },
  height: { type: Number, default: 36 },
  label: { type: String, default: 'Price trend' },
  stroke: { type: String, default: 'currentColor' },
})

const path = computed(() => {
  const n = props.points.length
  if (!n) return ''
  const max = Math.max(...props.points)
  const min = Math.min(...props.points)
  const range = Math.max(max - min, 1)
  const stepX = 100 / Math.max(n - 1, 1)
  const coords = props.points.map((p, i) => {
    const x = i * stepX
    const y = 30 - ((p - min) / range) * 28 - 1
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`
  })
  return coords.join(' ')
})
</script>