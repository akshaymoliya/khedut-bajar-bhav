import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const q = getQuery(event)
  
  const start = q.start?.toString() // YYYY-MM-DD
  const end = q.end?.toString()     // YYYY-MM-DD
  const market = q.market?.toString()
  const commodity = q.commodity?.toString()
  const sort = q.sort?.toString() || 'date:desc'

  let query = client
    .from('crop_prices')
    .select(`
      id,
      price_date,
      min_price,
      max_price,
      modal_price,
      unit,
      arrival_qty,
      crops!inner (name),
      market_yards!inner (name)
    `)

  // Date filters
  if (start) {
    query = query.gte('price_date', `${start}T00:00:00`)
  }
  if (end) {
    query = query.lte('price_date', `${end}T23:59:59`)
  }

  // Market filter (search by name via join)
  if (market) {
    query = query.ilike('market_yards.name', `%${market}%`)
  }

  // Commodity filter
  if (commodity) {
    query = query.ilike('crops.name', `%${commodity}%`)
  }

  // Sorting
  const [sortKey, sortDir] = sort.split(':')
  // Map frontend sort keys to DB columns
  const sortMap = {
    date: 'price_date',
    minPrice: 'min_price',
    maxPrice: 'max_price',
    avgPrice: 'modal_price',
    commodity: 'crops(name)', 
    market: 'market_yards(name)'
  }
  
  const dbSortColumn = sortMap[sortKey] || 'price_date'
  
  // Note: Sorting by joined columns (foreign keys) might require different syntax or client-side sort if complex.
  // For basic columns:
  if (!dbSortColumn.includes('(')) {
      query = query.order(dbSortColumn, { ascending: sortDir === 'asc' })
  }

  const { data, error } = await query

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  // Transform data to match frontend expectations
  const rows = data.map(item => ({
    date: item.price_date ? item.price_date.slice(0, 10) : null,
    commodity: item.crops?.name || 'Unknown',
    market: item.market_yards?.name || 'Unknown',
    minPrice: Number(item.min_price) || 0,
    maxPrice: Number(item.max_price) || 0,
    avgPrice: Number(item.modal_price) || 0, // Mapping modal_price to avgPrice
    unit: item.unit || '₹/20kg',
    arrival: item.arrival_qty
  }))

  // Extract unique markets and commodities for filter lists (optional optimization: fetch separately)
  const markets = [...new Set(rows.map(r => r.market))].sort()
  const commodities = [...new Set(rows.map(r => r.commodity))].sort()

  // Handle client-side sorting for joined columns if needed, assuming small dataset per day
  if (dbSortColumn.includes('(')) {
      rows.sort((a, b) => {
          const va = sortKey === 'commodity' ? a.commodity : a.market
          const vb = sortKey === 'commodity' ? b.commodity : b.market
          if (va < vb) return sortDir === 'asc' ? -1 : 1
          if (va > vb) return sortDir === 'asc' ? 1 : -1
          return 0
      })
  }

  return {
    rows,
    count: rows.length,
    markets,
    commodities
  }
})