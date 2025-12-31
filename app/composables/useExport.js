export function useExport() {
  const toCSV = (rows) => {
    const header = ['Date', 'Commodity', 'Market', 'Min Price', 'Max Price', 'Avg Price', 'Unit']
    const lines = [header.join(',')]
    for (const r of rows) {
      lines.push([r.date, r.commodity, r.market, r.minPrice, r.maxPrice, r.avgPrice, r.unit].join(','))
    }
    return lines.join('\n')
  }

  const downloadCSV = (rows, filename = 'gujarat-prices.csv') => {
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return { toCSV, downloadCSV }
}