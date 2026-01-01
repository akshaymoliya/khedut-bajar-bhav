// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase', '@nuxtjs/sitemap'],
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    head: {
      title: 'Khedut Bajar Bhav - ખેડૂત બજાર ભાવ',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Daily agricultural market prices for farmers across Gujarat. Track APMC market yard prices, commodity rates, and make informed selling decisions.' },
        { name: 'keywords', content: 'Gujarat APMC, market prices, agricultural prices, farmer prices, khedut bajar bhav, ખેડૂત બજાર ભાવ' },
        { property: 'og:title', content: 'Khedut Bajar Bhav - ખેડૂત બજાર ભાવ' },
        { property: 'og:description', content: 'Daily agricultural market prices for farmers across Gujarat' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },
  supabase: {
    redirect: false
  },
  site: {
    url: 'https://www.khedutbajarbhav.online',
    name: 'Khedut Bajar Bhav',
  },
  sitemap: {
    strictNuxtContentAds: true,
  },
})