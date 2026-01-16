import { defineEventHandler } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  
  // Fetch all unique crops to generate /crop/[name] routes
  const { data: crops } = await client
    .from('crops')
    .select('name')
  
  const cropRoutes = crops?.map(c => ({
    loc: `/crop/${encodeURIComponent(c.name)}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.8
  })) || []

  // Fetch all unique markets to generate /market?market=[name] routes
  const { data: markets } = await client
    .from('market_yards')
    .select('name')
  
  const marketRoutes = markets?.map(m => ({
    loc: `/market?market=${encodeURIComponent(m.name)}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.7
  })) || []

  return [
    ...cropRoutes,
    ...marketRoutes
  ]
})
