/**
 * scripts/generate-placeholders.ts
 * ------------------------------------------------------------
 * Génère une image placeholder (SVG → PNG) par carte et l'uploade
 * dans Supabase Storage, puis met à jour cards.image_url.
 *
 * But : visualiser le rendu réel de l'app (grille, fiche, collection)
 * sans dépendre d'images sous droits. 100% généré, rien à nettoyer.
 *
 * Lancer :
 *   npx tsx scripts/generate-placeholders.ts
 *
 * Pré-requis :
 *   npm i -D tsx
 *   npm i sharp           (déjà dans package.json)
 *   .env.local rempli (URL + SERVICE_ROLE_KEY)
 *   bucket "card-images" créé (003_storage_bucket.sql)
 * ------------------------------------------------------------
 */

import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Charge .env.local manuellement (pas de next runtime ici)
const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
const getEnv = (key: string) =>
  env.split('\n').find((l) => l.startsWith(key))?.split('=').slice(1).join('=').trim() ?? ''

const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL')
const SERVICE_KEY  = getEnv('SUPABASE_SERVICE_ROLE_KEY')

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Couleur de fond selon la rareté (reprend la charte de tailwind.config.ts)
const RARITY_BG: Record<string, [string, string]> = {
  'Base':                 ['#1A1A28', '#12121C'],
  'Écusson':              ['#252535', '#1A1A28'],
  'Crack':                ['#3B1F5E', '#1A1A28'],
  'Megacrack':            ['#5E1F47', '#1A1A28'],
  'Invincible':           ['#5E4A1F', '#1A1A28'],
  'Momentum':             ['#1F4A5E', '#1A1A28'],
  'Totem':                ['#2A2A5E', '#1A1A28'],
  'Diamant':              ['#5E4E1F', '#12121C'],
  'Édition Limitée':      ['#5E4A1F', '#12121C'],
  'Gold Refractor':       ['#5E4A1F', '#12121C'],
  'Orange Refractor':     ['#5E3A1F', '#12121C'],
  'Red Refractor':        ['#5E1F1F', '#12121C'],
  'Superfractor':         ['#3A3A3A', '#12121C'],
  'Chrome Autograph':     ['#3B1F5E', '#12121C'],
  'Champion Clubs':       ['#5E4A1F', '#12121C'],
  'Helix':                ['#3A2A5E', '#12121C'],
}
const DEFAULT_BG: [string, string] = ['#1A1A28', '#12121C']

// Échappe le texte pour le SVG
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function buildSVG(opts: {
  player: string
  team: string
  number: string
  rarity: string
}) {
  const [c1, c2] = RARITY_BG[opts.rarity] ?? DEFAULT_BG
  const gold = '#C9A84C'

  // Tronque les noms trop longs
  const player = opts.player.length > 22 ? opts.player.slice(0, 21) + '…' : opts.player
  const team   = opts.team.length > 26 ? opts.team.slice(0, 25) + '…' : opts.team

  return `
<svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(201,168,76,0)"/>
      <stop offset="50%" stop-color="rgba(201,168,76,0.12)"/>
      <stop offset="100%" stop-color="rgba(201,168,76,0)"/>
    </linearGradient>
  </defs>

  <rect width="600" height="800" rx="24" fill="url(#bg)"/>
  <rect width="600" height="800" rx="24" fill="url(#shine)"/>
  <rect x="12" y="12" width="576" height="776" rx="18" fill="none"
        stroke="${gold}" stroke-opacity="0.25" stroke-width="2"/>

  <!-- Numéro de carte -->
  <text x="40" y="70" font-family="Arial, sans-serif" font-size="32"
        font-weight="700" fill="${gold}" fill-opacity="0.7">#${esc(opts.number)}</text>

  <!-- Silhouette joueur (cercle stylisé) -->
  <circle cx="300" cy="340" r="130" fill="${gold}" fill-opacity="0.06"/>
  <circle cx="300" cy="300" r="55" fill="${gold}" fill-opacity="0.15"/>
  <path d="M 200 460 Q 300 360 400 460 L 400 480 L 200 480 Z"
        fill="${gold}" fill-opacity="0.15"/>

  <!-- Rareté -->
  <text x="300" y="560" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="22" font-weight="600" letter-spacing="3"
        fill="${gold}" fill-opacity="0.8">${esc(opts.rarity.toUpperCase())}</text>

  <!-- Nom joueur -->
  <text x="300" y="650" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="42" font-weight="700" fill="#FFFFFF">${esc(player)}</text>

  <!-- Club -->
  <text x="300" y="700" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="26" font-weight="400" fill="#FFFFFF" fill-opacity="0.5">${esc(team)}</text>

  <!-- Mention placeholder -->
  <text x="300" y="760" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="16" fill="#FFFFFF" fill-opacity="0.2">visuel de démonstration</text>
</svg>`.trim()
}

async function main() {
  console.log('🎨 Génération des placeholders…\n')

  // Récupère toutes les cartes sans image (par lots)
  const { data: cards, error } = await supabase
    .from('cards')
    .select(`
      id, card_number, player_name,
      teams ( name, short_name ),
      rarities ( name )
    `)
    .is('image_url', null)

  if (error) {
    console.error('❌ Erreur lecture cards:', error.message)
    process.exit(1)
  }
  if (!cards || cards.length === 0) {
    console.log('✅ Aucune carte sans image. Rien à faire.')
    return
  }

  console.log(`${cards.length} cartes à traiter.\n`)

  let done = 0
  let failed = 0

  for (const card of cards) {
    try {
      const team = (card.teams as { name: string; short_name: string | null } | null)
      const rarity = (card.rarities as { name: string } | null)?.name ?? 'Base'

      const svg = buildSVG({
        player: card.player_name,
        team: team?.name ?? '',
        number: card.card_number,
        rarity,
      })

      // SVG → PNG via sharp
      const png = await sharp(Buffer.from(svg)).png().toBuffer()

      const path = `${card.id}.png`
      const { error: upErr } = await supabase
        .storage
        .from('card-images')
        .upload(path, png, { upsert: true, contentType: 'image/png' })

      if (upErr) throw upErr

      const { data: { publicUrl } } = supabase
        .storage
        .from('card-images')
        .getPublicUrl(path)

      const { error: updErr } = await supabase
        .from('cards')
        .update({ image_url: publicUrl })
        .eq('id', card.id)

      if (updErr) throw updErr

      done++
      if (done % 50 === 0) console.log(`  … ${done}/${cards.length}`)
    } catch (e) {
      failed++
      console.error(`  ⚠️  ${card.player_name}:`, (e as Error).message)
    }
  }

  console.log(`\n✅ Terminé : ${done} générées, ${failed} échecs.`)
  console.log('   Recharge /catalogue pour voir le rendu.\n')
  console.log('ℹ️  Pour tout effacer plus tard :')
  console.log('   update cards set image_url = null;')
  console.log('   puis vide le bucket card-images dans Supabase Storage.')
}

main()
