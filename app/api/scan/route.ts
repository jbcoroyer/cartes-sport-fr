import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface VisionResponse {
  responses: Array<{
    labelAnnotations?: Array<{ description: string; score: number }>
    textAnnotations?: Array<{ description: string }>
    error?: { message: string }
  }>
}

export async function POST(request: NextRequest) {
  try {
    // Auth — seuls les utilisateurs connectés peuvent scanner
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupère l'image base64 depuis le body
    const { image } = await request.json() as { image: string }
    if (!image) {
      return NextResponse.json({ error: 'Image manquante' }, { status: 400 })
    }

    // Appel Google Vision API — extraction de texte (OCR)
    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: image },
            features: [
              { type: 'TEXT_DETECTION', maxResults: 10 },
              { type: 'LABEL_DETECTION', maxResults: 5 },
            ],
          }],
        }),
      }
    )

    const visionData = await visionRes.json() as VisionResponse
    const response = visionData.responses?.[0]

    if (response?.error) {
      console.error('Vision API error:', response.error)
      return NextResponse.json({ error: 'Erreur reconnaissance' }, { status: 500 })
    }

    // Extraction du texte brut
    const fullText = response?.textAnnotations?.[0]?.description ?? ''
    const lines = fullText.split('\n').map(l => l.trim()).filter(Boolean)

    // Recherche de la carte dans la BDD en matchant le nom de joueur
    // Stratégie : tenter les 5 premières lignes comme noms potentiels
    const candidates = lines.slice(0, 8)

    let matchedCard = null

    for (const candidate of candidates) {
      if (candidate.length < 3) continue

      const { data } = await supabase
        .from('cards')
        .select(`
          id, card_number, player_name, image_url, variant_type, print_run,
          products ( id, name, season ),
          rarities ( name, level, color_hex ),
          teams ( name, short_name ),
          price_snapshots ( last_price, trend )
        `)
        .ilike('player_name', `%${candidate}%`)
        .limit(3)

      if (data && data.length > 0) {
        matchedCard = data[0]
        break
      }
    }

    if (matchedCard) {
      return NextResponse.json({
        success: true,
        card: matchedCard,
        confidence: 'matched',
        rawText: lines.slice(0, 5),
      })
    }

    // Aucun match trouvé — on renvoie le texte brut pour la recherche manuelle
    return NextResponse.json({
      success: false,
      card: null,
      confidence: 'no_match',
      rawText: lines.slice(0, 5),
      suggestion: lines.find(l => l.length > 3) ?? null,
    })

  } catch (err) {
    console.error('Scan API error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
