export default defineNuxtPlugin(() => {
  if (process.client) {
    const id = 'G-3WS9LNKVSD'
    
    // Add Google Analytics Script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', id)
    
    // Make gtag available globally
    window.gtag = gtag
  }
})
