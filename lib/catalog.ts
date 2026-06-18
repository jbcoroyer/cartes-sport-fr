import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

const PRODUCT_SELECT = `
  id, name, season, release_date, total_base, total_master, binder_slots_per_page, is_active,
  series_types ( name, publishers ( name ) )
`

function anonClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export const getCatalogProducts = unstable_cache(
  async () => {
    const { data } = await anonClient()
      .from('products')
      .select(PRODUCT_SELECT)
      .order('season', { ascending: false })
      .order('name', { ascending: true })
    return data ?? []
  },
  ['catalog-products'],
  { revalidate: 3600, tags: ['catalog-products'] },
)

export function getCatalogProduct(productId: string) {
  return unstable_cache(
    async () => {
      const { data } = await anonClient()
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('id', productId)
        .single()
      return data
    },
    ['catalog-product', productId],
    { revalidate: 3600, tags: ['catalog-products'] },
  )()
}

export function getCatalogProductName(productId: string) {
  return unstable_cache(
    async () => {
      const { data } = await anonClient()
        .from('products')
        .select('name')
        .eq('id', productId)
        .single()
      return data?.name ?? null
    },
    ['catalog-product-name', productId],
    { revalidate: 3600, tags: ['catalog-products'] },
  )()
}
