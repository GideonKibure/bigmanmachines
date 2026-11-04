import { num } from './format'

// Keep this in step with save_quotation in supabase/migrations/001_schema.sql.
// If every line has a description, quantity, and price, the customer total is the sum of the lines
// and the margin is recalculated. Otherwise the total is costs plus the typed margin.
export function priceQuote({ material, labour, transport, other, margin, items }) {
  const costs = num(material) + num(labour) + num(transport) + num(other)
  const described = (items || []).filter((item) => item.description?.trim())
  const priced = described.filter((item) => num(item.quantity) > 0 && num(item.unit_price) > 0)
  if (described.length > 0 && priced.length === described.length) {
    const selling = priced.reduce((sum, item) => sum + num(item.quantity) * num(item.unit_price), 0)
    const nextMargin = costs === 0 ? 0 : ((selling - costs) / costs) * 100
    return { costs, selling, margin: nextMargin, fromItems: true }
  }
  const selling = costs * (1 + num(margin) / 100)
  return { costs, selling, margin: num(margin), fromItems: false }
}
