<template>
  <div class="w-full h-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useI18n } from '#imports'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  datasets: {
    type: Array,
    required: true
  }
})

const { t } = useI18n()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map(ds => ({
    ...ds,
    tension: 0.4, // Smooth curves
    pointRadius: 4,
    pointHoverRadius: 6,
    borderWidth: 3,
  }))
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false 
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#0f172a',
      bodyColor: '#334155',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 12,
      displayColors: true,
      callbacks: {
        label: (context) => ` ₹${context.parsed.y} / 20kg`
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8',
        font: {
          family: 'ui-sans-serif, system-ui, sans-serif',
          size: 11
        }
      }
    },
    y: {
      grid: {
        color: '#f1f5f9',
        borderDash: [4, 4],
        drawBorder: false
      },
      ticks: {
        color: '#64748b',
        font: {
          family: 'ui-sans-serif, system-ui, sans-serif',
          size: 11
        },
        callback: (value) => '₹' + value
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
}))
</script>
