import { computed, onMounted } from 'vue'

// Simple nested key resolver: "a.b.c" -> obj[a][b][c]
function resolve(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

const messages = {
  en: {
    brand: {
      name: 'Khedut Bajar Bhav',
      tagline: 'Rajkot Market Yard & Gujarat APMC Live Bajar Bhav',
    },
    nav: { home: 'Home', market: 'Market', weather: 'Weather', about: 'About', contact: 'Contact' },
    index: {
      hero: {
        title: 'Rajkot Market Yard & Gujarat APMC Live Prices',
        subtitle: 'Get latest Rajkot Bajar Bhav, Gondal Yard rates, and Gujarat market yard prices daily.',
      },
      search: { placeholder: 'Search commodity (e.g., Cotton, Wheat)' },
      highlights: 'Highlights',
      quickLinks: 'Quick Links',
      latestUpdates: 'Latest Updates',
      aboutSection: {
        badge: 'About Portal',
        title: 'Gujarat Market Yard & Rajkot Bajar Bhav Portal',
        description: "Reliable platform for tracking Rajkot market yard prices and daily market rates across all major Gujarat APMCs. Get accurate Rajkot yard bhav, market trends, and insights directly on your mobile.",
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
      commodityLabel: 'Search Commodity',
      dateLabel: 'Select Date',
      min: 'Min Price',
      max: 'Max Price',
      avg: 'Avg Price',
      trend: 'Trend',
      checkPrices: 'Check Prices',
      reset: 'Reset',
      noResults: 'No prices found for this date/market.',
    },
    crop: {
      details: 'Crop Price Details',
      last5Days: 'Last 5 Days Prices',
      marketYard: 'Market Yard',
      date: 'Date',
      priceTrend: 'Price Trend',
      up: 'Price Up',
      down: 'Price Down',
      stable: 'Stable',
      highest: 'Highest Price',
      lowest: 'Lowest Price',
      highestToday: 'Highest Today',
      lowestToday: 'Lowest Today',
      historyTitle: '5-Day Price History',
      marketWise: 'Prices in Other Markets',
      pricePer20kg: 'Prices are per 20kg (1 Mann)',
      backToMarket: 'Back to Market',
      shareWhatsApp: 'Share on WhatsApp',
      shareText: '📊 Check out today\'s latest {crop} prices at {market}! \n\n💰 Today\'s highest price is {price}. \n\n👇 For more details, click here: ',
      aboutTitle: 'About {crop} Prices',
      aboutDesc: 'Prices for {crop} in {market} fluctuate daily based on arrival and demand. Tracking the 5-day price history helps farmers and traders make informed decisions about when to sell. The highest recorded price today for {crop} is {price} per 20kg.',
      disclaimer: 'Note: Prices are for reference and may vary by quality.'
    },
    weather: { 
      title: 'Agricultural Weather', 
      subtitle: 'Real-time weather updates for your crops',
      temp: 'Temperature',
      humidity: 'Humidity',
      wind: 'Wind Speed',
      rain: 'Rain Chance',
      rainLabel: 'Rain',
      today: 'Today',
      forecast: '7-Day Forecast',
      location: 'Location',
      loading: 'Loading weather data...',
      error: 'Failed to load weather data',
      advise: 'Farmer Advice',
      rainAdvise: 'High chance of rain today. Avoid fertilization or pesticide spray.',
      sunnyAdvise: 'Sunny day. Good for harvesting and drying crops.',
      cloudyAdvise: 'Cloudy weather. Keep track of pest attacks.',
      clearAdvise: 'Clear sky. Ideal for field work.',
      defaultAdvise: 'Check weather before planning field activities.',
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      night: 'Night',
      dew: 'Dew',
      fog: 'Fog',
      dewAdvise: 'Dew (Oss) expected. Late fertilization could be more effective.',
      fogAdvise: 'Dense fog (Dhummas) expected. Be careful while traveling to market yard.'
    },
    about: { 
      title: 'About Our Portal',
      subtitle: 'Empowering Gujarat\'s Farmers with Real-Time Market Intelligence',
      description: 'Khedut Bajar Bhav is a dedicated digital platform designed specifically for the hardworking farmers of Gujarat. Our mission is to bridge the gap between market yards and your farm, ensuring you never miss a price update.',
      vision: 'Our Vision',
      visionDesc: 'To be the most trusted digital companion for every farmer in Gujarat, helping them get the fair value for their hard work through transparency and technology.',
      featuresTitle: 'Why Farmers Trust Us',
      feature1Title: 'Live APMC Rates',
      feature1Desc: 'Direct and accurate price updates from all major Gujarat market yards including Rajkot, Gondal, and Ahmedabad.',
      feature2Title: 'Easy to Use',
      feature2Desc: 'Simple, fast, and available in both Gujarati and English, designed to work perfectly on any mobile device.',
      feature3Title: 'Market Insights',
      feature3Desc: 'Track price trends and historical data to decide the best time to sell your crops for maximum profit.',
      feature4Title: 'Weather Guidance',
      feature4Desc: 'Receive localized weather forecasts and agricultural advice to plan your field activities better.',
      ctaTitle: 'Connecting Farmers to Markets',
      ctaDesc: 'Join thousands of farmers across Gujarat who use Khedut Bajar Bhav daily to stay ahead.',
      ctaButton: 'View Live Prices 🚀'
    },
    contact: { 
      title: 'Contact Us',
      subtitle: 'Have questions or feedback? Send us a message and we will get back to you.',
      name: 'Your Name',
      email: 'Email Address',
      message: 'How can we help you?',
      send: 'Send Message',
      success: 'Thank you! Your message has been sent.',
      helpTitle: 'Need Help?',
      helpDesc: 'Are you a farmer looking for specific market data? Or a trader wanting to partner? Let us know!'
    },
    footer: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: 'All rights reserved.',
      latestPrices: 'Latest Prices',
      weather: 'Weather Forecast',
      support: 'Support',
      about: 'About Us',
      contact: 'Contact',
      markets: {
        'Rajkot': 'Rajkot',
        'Gondal': 'Gondal',
        'Ahmedabad': 'Ahmedabad',
        'Amreli': 'Amreli',
        'Surat': 'Surat',
        'Vadodara': 'Vadodara',
        'Junagadh': 'Junagadh',
        'Jamnagar': 'Jamnagar',
        'Bhavnagar': 'Bhavnagar',
        'Porbandar': 'Porbandar',
        'Gandhinagar': 'Gandhinagar',
        'Patan': 'Patan',
        'Mehsana': 'Mehsana',
        'Botad': 'Botad',
        'Morbi': 'Morbi',
        'Jasdan': 'Jasdan',
        'Jetpur': 'Jetpur',
        'Dhoraji': 'Dhoraji',
        'Upleta': 'Upleta',
        'Halvad': 'Halvad',
        'Wankaner': 'Wankaner'
      },
    },
  },
  gu: {
    brand: {
      name: 'ખેડૂત બજાર ભાવ',
      tagline: 'રાજકોટ માર્કેટ યાર્ડ અને ગુજરાત APMC લાઈવ બજાર ભાવ',
    },
    nav: { home: 'હોમ', market: 'બજાર', weather: 'હવામાન', about: 'વિશે', contact: 'સંપર્ક' },
    index: {
      hero: {
        title: 'રાજકોટ માર્કેટ યાર્ડ અને ગુજરાત બજાર ભાવ',
        subtitle: 'રાજકોટ બજાર ભાવ, ગોંડલ યાર્ડ ભાવ અને ગુજરાતના તમામ માર્કેટ યાર્ડના તાજા ભાવ મેળવો.',
      },
      search: { placeholder: 'માલ શોધો (જેમ કે કપાસ, ઘઉં)' },
      highlights: 'હાઇલાઇટ્સ',
      quickLinks: 'ઝડપી લિંક્સ',
      latestUpdates: 'નવીનતમ અપડેટ્સ',
      aboutSection: {
        badge: 'પોર્ટલ વિશે',
        title: 'ગુજરાત માર્કેટ યાર્ડ અને રાજકોટ બજાર ભાવ પોર્ટલ',
        description: 'રાજકોટ માર્કેટ યાર્ડના ભાવ અને ગુજરાતના તમામ મુખ્ય માર્કેટ યાર્ડ (APMC) ના બજારભાવ જાણવા માટેનું વિશ્વસનીય પ્લેટફોર્મ. રાજકોટ યાર્ડ ભાવ, બજારના ટ્રેન્ડ અને ચોક્કસ માહિતી સીધી તમારા મોબાઈલ પર.',
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
      commodityLabel: 'પાક શોધો',
      dateLabel: 'તારીખ પસંદ કરો',
      min: 'લઘુત્તમ ભાવ',
      max: 'મહત્તમ ભાવ',
      avg: 'સરેરાશ ભાવ',
      trend: 'વલણ',
      checkPrices: 'ભાવ જુઓ',
      reset: 'રીસેટ',
      noResults: 'આ તારીખ/બજાર માટે કોઈ ભાવ મળ્યા નથી.',
    },
    crop: {
      details: 'પાક ભાવની વિગત',
      last5Days: 'છેલ્લા ૫ દિવસના ભાવ',
      marketYard: 'માર્કેટ યાર્ડ',
      date: 'તારીખ',
      priceTrend: 'ભાવનું વલણ',
      up: 'ભાવ વધ્યા',
      down: 'ભાવ ઘટ્યા',
      stable: 'સ્થિર',
      highest: 'સૌથી વધુ ભાવ',
      lowest: 'સૌથી ઓછો ભાવ',
      highestToday: 'આજનો સૌથી વધુ',
      lowestToday: 'આજનો સૌથી ઓછો',
      historyTitle: '૫ દિવસનો ઇતિહાસ',
      marketWise: 'અન્ય બજારના ભાવ',
      pricePer20kg: 'બધા ભાવ ૨૦ કિલો (૧ મણ) ના છે',
      backToMarket: 'પાછા બજાર પર',
      shareWhatsApp: 'વોટ્સએપ પર શેર કરો',
      shareText: '📊 {market} માં {crop} ના આજના તાજા ભાવ જુઓ!\n\n💰 આજનો સૌથી વધુ ભાવ {price} છે.\n\n👇 વધુ માહિતી માટે અહીં ક્લિક કરો: ',
      aboutTitle: '{crop} ના ભાવ વિશે',
      aboutDesc: 'ગુજરાતના વિવિધ માર્કેટ યાર્ડ જેવા કે {market} માં {crop} ના ભાવમાં દરરોજ વધઘટ જોવા મળે છે. અમે અહીં પાંચ દિવસનો સચોટ ઈતિહાસ પ્રદાન કરીએ છીએ જેથી ખેડૂતો સાચો નિર્ણય લઈ શકે. આજના સૌથી વધુ ભાવ {price} છે.',
      disclaimer: 'નોંધ: ભાવ સંદર્ભ માટે છે અને ગુણવત્તા મુજબ બદલાઈ શકે છે.'
    },
    weather: { 
      title: 'ખેતીવાડી હવામાન', 
      subtitle: 'તમારા પાક માટે રીઅલ-ટાઇમ હવામાન અપડેટ્સ',
      temp: 'તાપમાન',
      humidity: 'ભેજ',
      wind: 'પવનની ગતિ',
      rain: 'વરસાદની શક્યતા',
      rainLabel: 'વરસાદ',
      today: 'આજે',
      forecast: '૭-દિવસની આગાહી',
      location: 'સ્થળ',
      loading: 'હવામાન માહિતી લોડ થઈ રહી છે...',
      error: 'હવામાન માહિતી મેળવવામાં નિષ્ફળ',
      advise: 'ખેડૂત સલાહ',
      rainAdvise: 'આજે વરસાદની સારી શક્યતા છે. ખાતર અથવા જંતુનાશક દવાનો છંટકાવ ટાળો.',
      sunnyAdvise: 'તડકો છે. પાકની લણણી અને સુકવણી માટે ઉત્તમ દિવસ.',
      cloudyAdvise: 'વાદળછાયું વાતાવરણ. જીવાત ઉપદ્રવ પર નજર રાખો.',
      clearAdvise: 'આકાશ ચોખ્ખું છે. ખેતરના કામ માટે આદર્શ.',
      defaultAdvise: 'ખેતરની પ્રવૃત્તિઓનું આયોજન કરતા પહેલા હવામાન તપાસો.',
      morning: 'સવાર',
      afternoon: 'બપોર',
      evening: 'સાંજ',
      night: 'રાત',
      dew: 'ઝાકળ (ઓસ)',
      fog: 'ધૂમ્મસ',
      dewAdvise: 'ઝાકળ (ઓસ) પડવાની શક્યતા છે. મોડેથી પિયત કે ખાતર આપવું વધુ અનુકૂળ રહેશે.',
      fogAdvise: 'ભારે ધૂમ્મસની શક્યતા છે. માર્કેટ યાર્ડ જતી વખતે વાહન સાચવીને ચલાવવું.'
    },
    about: { 
      title: 'અમારા પોર્ટલ વિશે',
      subtitle: 'ગુજરાતના ખેડૂતોને સચોટ બજાર માહિતી સાથે સશક્ત બનાવવા',
      description: 'ખેડૂત બજાર ભાવ એ ગુજરાતના મહેનતુ ખેડૂતો માટે ખાસ તૈયાર કરવામાં આવેલું ડિજિટલ પ્લેટફોર્મ છે. અમારો ઉદ્દેશ્ય માર્કેટ યાર્ડ અને તમારા ખેતર વચ્ચેના અંતરને ઓછું કરવાનો છે, જેથી તમે ક્યારેય ભાવની માહિતી ગુમાવો નહીં.',
      vision: 'અમારું વિઝન',
      visionDesc: 'ગુજરાતના દરેક ખેડૂત માટે સૌથી વિશ્વસનીય ડિજિટલ સાથી બનવું, અને પારદર્શિતા અને ટેકનોલોજી દ્વારા તેમને તેમની મહેનતનું યોગ્ય વળતર અપાવવું.',
      featuresTitle: 'ખેડૂતો કેમ અમારા પર વિશ્વાસ કરે છે',
      feature1Title: 'જીવંત APMC ભાવ',
      feature1Desc: 'રાજકોટ, ગોંડલ અને અમદાવાદ સહિત ગુજરાતના તમામ મુખ્ય માર્કેટ યાર્ડના સીધા અને સચોટ ભાવ.',
      feature2Title: 'સરળ ઉપયોગ',
      feature2Desc: 'ગુજરાતી અને અંગ્રેજી બંને ભાષામાં ઉપલબ્ધ, કોઈપણ મોબાઈલ પર સરળતાથી વાપરી શકાય તેવી ડિઝાઇન.',
      feature3Title: 'બજાર માર્ગદર્શન',
      feature3Desc: 'મહત્તમ નફો મેળવવા માટે તમારા પાકને વેચવાનો શ્રેષ્ઠ સમય નક્કી કરવા માટે ભાવના વલણો તપાસો.',
      feature4Title: 'હવામાન માર્ગદર્શન',
      feature4Desc: 'ખેતીના કામનું બહેતર આયોજન કરવા માટે સ્થાનિક હવામાન આગાહી અને કૃષિ સલાહ મેળવો.',
      ctaTitle: 'ખેડૂતોને બજારો સાથે જોડવું',
      ctaDesc: 'ગુજરાતના હજારો ખેડૂતો સાથે જોડાઓ જેઓ આગળ રહેવા માટે રોજેરોજ ખેડૂત બજાર ભાવનો ઉપયોગ કરે છે.',
      ctaButton: 'જીવંત ભાવ જુઓ 🚀'
    },
    contact: { 
      title: 'અમારો સંપર્ક કરો',
      subtitle: 'કોઈ પ્રશ્ન કે પ્રતિભાવ છે? અમને સંદેશ મોકલો અને અમે તમારો સંપર્ક કરીશું.',
      name: 'તમારું નામ',
      email: 'ઈમેઈલ એડ્રેસ',
      message: 'અમે તમને કેવી રીતે મદદ કરી શકીએ?',
      send: 'સંદેશ મોકલો',
      success: 'આભાર! તમારો સંદેશ મોકલાઈ ગયો છે.',
      helpTitle: 'મદદની જરૂર છે?',
      helpDesc: 'શું તમે કોઈ ખાસ બજારની માહિતી શોધી રહ્યા છો? અથવા અમને કોઈ સૂચન આપવા માંગો છો? અમને જણાવો!'
    },
    footer: {
      privacy: 'ગોપનીયતા નીતિ',
      terms: 'સેવાની શરતો',
      rights: 'સર્વાધિકાર સુરક્ષિત.',
      latestPrices: 'તાજા ભાવ',
      weather: 'હવામાન આગાહી',
      support: 'સહાય',
      about: 'અમારા વિશે',
      contact: 'સંપર્ક',
      markets: {
        'Rajkot': 'રાજકોટ',
        'Gondal': 'ગોંડલ',
        'Ahmedabad': 'અમદાવાદ',
        'Amreli': 'અમરેલી',
        'Surat': 'સુરત',
        'Vadodara': 'વડોદરા',
        'Junagadh': 'જૂનાગઢ',
        'Jamnagar': 'જામનગર',
        'Bhavnagar': 'ભાવનગર',
        'Porbandar': 'પોરબંદર',
        'Gandhinagar': 'ગાંધીનગર',
        'Patan': 'પાટણ',
        'Mehsana': 'મહેસાણા',
        'Botad': 'બોટાદ',
        'Morbi': 'મોરબી',
        'Jasdan': 'જસદણ',
        'Jetpur': 'જેતપુર',
        'Dhoraji': 'ધોરાજી',
        'Upleta': 'ઉપલેટા',
        'Halvad': 'હળવદ',
        'Wankaner': 'વાંકાનેર'
      },
    },
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

  const t = (key, params = {}) => {
    const table = messages[lang.value]
    let val = resolve(table, key)
    
    if (typeof val !== 'string') return key
    
    // Simple interpolation: replace {key} with params[key]
    Object.keys(params).forEach(p => {
      val = val.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p])
    })
    
    return val
  }

  const tMarket = (name) => {
    if (!name) return ''
    const key = `footer.markets.${name}`
    const val = t(key)
    return val === key ? name : val
  }

  const resolveMarketId = (input) => {
    if (!input) return input
    // Check if input matches a localized value in Gujarati dictionary (primary target for translation)
    const guMarkets = messages.gu.footer.markets
    for (const [key, val] of Object.entries(guMarkets)) {
      if (val === input || val.toLowerCase() === input.toLowerCase()) {
        return key
      }
    }
    // Return distinct input if no translation match found (assumed English)
    return input
  }

  const translate = t
  return { t, translate, tMarket, resolveMarketId, lang, setLang }
}