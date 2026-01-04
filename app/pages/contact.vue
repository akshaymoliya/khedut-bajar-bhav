<template>
  <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h1 class="text-3xl sm:text-4xl font-black text-slate-900 mb-4">{{ t('contact.title') }}</h1>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">{{ t('contact.subtitle') }}</p>
    </div>

    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
        <form v-if="!submitted" @submit.prevent="submitForm" class="space-y-6">
          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700 uppercase tracking-wide">{{ t('contact.name') }}</label>
            <input 
              type="text" 
              v-model="form.name" 
              required
              class="input w-full py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all border-slate-200"
              placeholder="John Doe"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700 uppercase tracking-wide">{{ t('contact.email') }}</label>
            <input 
              type="email" 
              v-model="form.email" 
              required
              class="input w-full py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all border-slate-200"
              placeholder="john@example.com"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-bold text-slate-700 uppercase tracking-wide">{{ t('contact.message') }}</label>
            <textarea 
              v-model="form.message" 
              rows="5" 
              required
              class="input w-full py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all border-slate-200 min-h-[150px]"
              placeholder="..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            class="w-full btn btn-primary py-4 text-lg rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ t('contact.send') }}
            <span v-if="!loading">🚀</span>
          </button>
        </form>

        <!-- Success State -->
        <div v-else class="text-center py-12 space-y-6 animate-in fade-in zoom-in duration-500">
          <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
            ✓
          </div>
          <h2 class="text-2xl font-bold text-slate-900">{{ t('contact.success') }}</h2>
          <button @click="submitted = false" class="btn btn-outline px-8 rounded-xl">Send Another One</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { translate, lang } = useI18n()
const t = translate

const loading = ref(false)
const submitted = ref(false)

const form = ref({
  name: '',
  email: '',
  message: ''
})

const submitForm = async () => {
  loading.value = true
  
  try {
    const { data, error } = await useFetch('/api/contact', {
      method: 'POST',
      body: form.value
    })

    if (error.value) {
      throw new Error(error.value.message || 'Failed to send message')
    }

    submitted.value = true
    // Clear form
    form.value = {
      name: '',
      email: '',
      message: ''
    }
  } catch (err) {
    console.error('Contact error:', err)
    alert('Something went wrong. Please try again later.')
  } finally {
    loading.value = false
  }
}

const route = useRoute()

useHead({
  title: computed(() => `${t('contact.title')} - ${t('brand.name')}`),
  meta: [
    { name: 'description', content: computed(() => t('contact.subtitle')) },
    { name: 'keywords', content: computed(() => `contact khedut bajar bhav, farmer support Gujarat, feedback APMC portal, ${t('brand.name')} support`) },
    { property: 'og:title', content: computed(() => `${t('contact.title')} - ${t('brand.name')}`) },
    { property: 'og:description', content: computed(() => t('contact.subtitle')) },
    { property: 'og:url', content: computed(() => `https://www.khedutbajarbhav.online${route.fullPath}`) },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'canonical', href: computed(() => `https://www.khedutbajarbhav.online${route.fullPath}`) }
  ]
})
</script>

<style scoped>
.input {
  background-color: white;
  border: 1px solid var(--color-slate-200);
}
.input:focus {
  border-color: var(--color-primary);
  outline: none;
}
</style>