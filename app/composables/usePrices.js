import { computed } from 'vue'

export function usePrices() {
  const query = useState('prices.query', () => ({
    commodity: '',
    market: '',
    start: '',
    end: '',
    sort: 'date:desc',
  }))

  const rows = useState('prices.rows', () => [])
  const markets = useState('prices.markets', () => [])
  const commodities = useState('prices.commodities', () => [])
  const loading = useState('prices.loading', () => false)
  const error = useState('prices.error', () => null)

  const fetchPrices = async () => {
    loading.value = true
    error.value = null
    const client = useSupabaseClient()
    try {
      let supabaseQuery = client
        .from('crop_prices')
        .select(`
          id,
          price_date,
          min_price,
          max_price,
          modal_price,
          unit,
          arrival_qty,
          crops!inner (name, local_name),
          market_yards!inner (name)
        `)

      // Date filters
      if (query.value.start) {
        supabaseQuery = supabaseQuery.gte('price_date', `${query.value.start}T00:00:00`)
      }
      if (query.value.end) {
        supabaseQuery = supabaseQuery.lte('price_date', `${query.value.end}T23:59:59`)
      }

      // Market filter (search by name via join)
      if (query.value.market) {
        supabaseQuery = supabaseQuery.ilike('market_yards.name', `%${query.value.market}%`)
      }

      // Commodity filter
      if (query.value.commodity) {
        supabaseQuery = supabaseQuery.or(`name.ilike.%${query.value.commodity}%,local_name.ilike.%${query.value.commodity}%`, { foreignTable: 'crops' })
      }

      // Ordering
      // Note: Ordering by joined columns can be tricky. Default sort by date.
      supabaseQuery = supabaseQuery.order('price_date', { ascending: false })

      const { data, error: err } = await supabaseQuery

      if (err) throw err

      // Transform data
      rows.value = data.map(item => ({
        date: item.price_date ? item.price_date.slice(0, 10) : null,
        commodity: item.crops?.local_name || item.crops?.name || 'Unknown',
        market: item.market_yards?.name || 'Unknown',
        minPrice: Number(item.min_price) || 0,
        maxPrice: Number(item.max_price) || 0,
        avgPrice: Number(item.modal_price) || 0,
        unit: item.unit || '₹/20kg',
        arrival: item.arrival_qty
      }))

      // Extract unique lists for potentially other uses
      markets.value = [...new Set(rows.value.map(r => r.market))].sort()
      commodities.value = [...new Set(rows.value.map(r => r.commodity))].sort()

    } catch (e) {
      console.error(e)
      error.value = (e && e.message) || 'Failed to fetch prices'
    } finally {
      loading.value = false
    }
  }

  // Filter is performed server-side (via Supabase); expose rows as filtered for templates
  const filtered = computed(() => rows.value)

  const summary = computed(() => {
    const byCommodity = new Map()
    for (const r of rows.value) {
      const entry = byCommodity.get(r.commodity) || { count: 0, avgSum: 0 }
      entry.count += 1
      entry.avgSum += r.avgPrice
      byCommodity.set(r.commodity, entry)
    }
    const items = Array.from(byCommodity.entries()).map(([commodity, { count, avgSum }]) => ({
      commodity,
      count,
      avg: Math.round(avgSum / Math.max(count, 1)),
    }))
    return { total: rows.value.length, items }
  })

  return {
    query,
    rows,
    filtered,
    loading,
    error,
    fetchPrices,
    commodities: computed(() => commodities.value),
    markets: computed(() => markets.value),
    summary,
  }
}