import { computed, onMounted } from 'vue'

// Simple nested key resolver: "a.b.c" -> obj[a][b][c]
function resolve(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

const messages = {
  en: {
    brand: {
      name: 'Khedut Bajar Bhav',
      tagline: 'Daily agricultural market prices for farmers',
    },
    nav: { home: 'Home', market: 'Market', about: 'About', contact: 'Contact' },
    index: {
      hero: {
        title: 'Track Gujarat Agricultural Market Prices',
        subtitle: 'Fast, bilingual, and accessible market insights for everyone',
      },
      search: { placeholder: 'Search commodity (e.g., Cotton, Wheat)' },
      highlights: 'Highlights',
      quickLinks: 'Quick Links',
      latestUpdates: 'Latest Updates',
      aboutSection: {
        badge: 'About Portal',
        title: 'Gujarat Market Yard Price Portal',
        description: "Reliable platform for tracking daily market prices across all major Gujarat APMCs. Get accurate rates, market trends, and insights directly on your mobile for farmers and traders.",
        features: {
          accurate: { title: 'Accurate Prices', desc: 'Daily fresh and correct rates' },
          history: { title: 'Historical Data', desc: 'Track trends and price fluctuations' }
        },
        kisanBadge: 'Farmer Protector'
      },
      howItWorks: {
        title: 'How it Works',
        steps: [
          { title: 'Select Market', desc: 'Choose your local APMC market yard from the list.' },
          { title: 'View Live Prices', desc: 'Get real-time minimum and maximum prices for commodities.' },
          { title: 'Make Decisions', desc: 'Compare rates and decide the best time to sell.' }
        ]
      },
    },
    market: {
      title: 'Market Prices',
      search: 'Search',
      filters: { commodity: 'Commodity', market: 'Market', start: 'Start Date', end: 'End Date' },
      marketLabel: 'Find Market Yard',
      dateLabel: 'Select Date',
      min: 'Min Price',
      max: 'Max Price',
      avg: 'Avg Price',
      trend: 'Trend',
      checkPrices: 'Check Prices',
      reset: 'Reset',
      noResults: 'No prices found for this date/market.',
    },
    about: { title: 'About' },
    contact: { title: 'Contact' },
  },
  gu: {
    brand: {
      name: 'ખેડૂત બજાર ભાવ',
      tagline: 'ખેડૂતો માટે દૈનિક કૃષિ બજાર ભાવ',
    },
    nav: { home: 'હોમ', market: 'બજાર', about: 'વિશે', contact: 'સંપર્ક' },
    index: {
      hero: {
        title: 'ગુજરાતના કૃષિ બજારના ભાવ ટ્રેક કરો',
        subtitle: 'ઝડપી, દ્વિભાષી અને સરળ ઉપલબ્ધ બજાર માહિતી',
      },
      search: { placeholder: 'માલ શોધો (જેમ કે કપાસ, ઘઉં)' },
      highlights: 'હાઇલાઇટ્સ',
      quickLinks: 'ઝડપી લિંક્સ',
      latestUpdates: 'નવીનતમ અપડેટ્સ',
      aboutSection: {
        badge: 'પોર્ટલ વિશે',
        title: 'ગુજરાત માર્કેટ યાર્ડ ભાવ પોર્ટલ',
        description: 'ગુજરાતના તમામ મુખ્ય માર્કેટ યાર્ડ (APMC) ના બજારભાવ જાણવા માટેનું વિશ્વસનીય પ્લેટફોર્મ. ખેડૂતો અને વેપારીઓ માટે રોજિંદા ભાવ, બજારના ટ્રેન્ડ અને ચોક્કસ માહિતી સીધી તમારા મોબાઈલ પર.',
        features: {
          accurate: { title: 'સચોટ બજારભાવ', desc: 'રોજેરોજના તાજા અને સાચા ભાવ' },
          history: { title: 'ઐતિહાસિક ડેટા', desc: 'ટ્રેન્ડ અને ભાવ વધઘટ જાણો' }
        },
        kisanBadge: 'કિસાન હિત રક્ષક'
      },
      howItWorks: {
        title: 'કેવી રીતે કામ કરે છે',
        steps: [
          { title: 'બજાર પસંદ કરો', desc: 'તમારા સ્થાનિક APMC માર્કેટ યાર્ડની પસંદગી કરો.' },
          { title: 'જીવંત ભાવ જુઓ', desc: 'વસ્તુઓના લઘુત્તમ અને મહત્તમ ભાવ તાત્કાલિક જુઓ.' },
          { title: 'નિર્ણય લો', desc: 'ભાવની તુલના કરો અને વેચવાનો શ્રેષ્ઠ સમય નક્કી કરો.' }
        ]
      },
    },
    market: {
      title: 'બજાર ભાવ',
      search: 'શોધો',
      filters: { commodity: 'વસ્તુ', market: 'બજાર', start: 'શરૂઆતની તારીખ', end: 'અંતિમ તારીખ' },
      marketLabel: 'માર્કેટ યાર્ડ શોધો',
      dateLabel: 'તારીખ પસંદ કરો',
      min: 'લઘુત્તમ ભાવ',
      max: 'મહત્તમ ભાવ',
      avg: 'સરેરાશ ભાવ',
      trend: 'વલણ',
      checkPrices: 'ભાવ જુઓ',
      reset: 'રીસેટ',
      noResults: 'આ તારીખ/બજાર માટે કોઈ ભાવ મળ્યા નથી.',
    },
    about: { title: 'વિશે' },
    contact: { title: 'સંપર્ક' },
  },
}

export function useI18n() {
  const langCookie = useCookie('lang', { sameSite: 'lax' })

  // SSR-safe default: prefer cookie only (no localStorage reads on server)
  const initial = langCookie.value ?? 'gu'

  const lang = useState('lang', () => initial)

  const setLang = (value) => {
    lang.value = value
    langCookie.value = value
    if (process.client) {
      try { localStorage.setItem('lang', value) } catch {}
    }
  }

  // On client, sync from existing localStorage (if present) once
  onMounted(() => {
    try {
      const stored = localStorage.getItem('lang')
      if (stored === 'gu' || stored === 'en') {
        setLang(stored)
      }
    } catch {}
  })

  const t = (key) => {
    const table = messages[lang.value]
    const val = resolve(table, key)
    return (typeof val === 'string' ? val : undefined) ?? key
  }

  const translate = t
  return { t, translate, lang, setLang }
}