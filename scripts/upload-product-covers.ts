/**
 * Upload les couvertures produit vers Supabase Storage (bucket product-covers)
 * et met à jour products.cover_image_url.
 *
 * Lancer : npx tsx scripts/upload-product-covers.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
const getEnv = (key: string) =>
  env.split('\n').find((l) => l.startsWith(key))?.split('=').slice(1).join('=').trim() ?? ''

const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL')
const SERVICE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY')

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local')
  process.exit(1)
}

const BUCKET = 'product-covers'

/** Fichier local → id produit Supabase */
const COVERS: Record<string, string> = {
  'adrenalyn-xl-2025-26.png': '07841415-6025-4358-afb9-4d6ebf2dc64d',
  'topps-chrome-uefa-2025-26.png': '13b26429-3ca3-4771-8090-e1dea3d0ffc9',
  'adrenalyn-xl-2024-25.png': '8824ce5a-0231-4935-bb50-e1b632317e48',
  'topps-chrome-uefa-2024-25.png': '51e05d42-762f-4901-9dc9-bd16889ddc28',
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const assetsDir = resolve(process.cwd(), 'scripts/assets/product-covers')

function publicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}

async function main() {
  for (const [filename, productId] of Object.entries(COVERS)) {
    const filePath = resolve(assetsDir, filename)
    const body = readFileSync(filePath)

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, body, { contentType: 'image/png', upsert: true })

    if (uploadError) {
      console.error(`❌ Upload ${filename}:`, uploadError.message)
      process.exit(1)
    }

    const url = publicUrl(filename)
    const { error: updateError } = await supabase
      .from('products')
      .update({ cover_image_url: url })
      .eq('id', productId)

    if (updateError) {
      console.error(`❌ Mise à jour produit ${productId}:`, updateError.message)
      process.exit(1)
    }

    console.log(`✓ ${filename} → ${url}`)
  }

  console.log('\n✅ Couvertures produit uploadées et liées.')
}

main()
