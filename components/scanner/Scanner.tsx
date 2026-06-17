'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { CardWithDetails } from '@/lib/types/database'

type ScanState = 'idle' | 'scanning' | 'success' | 'no_match' | 'error'

interface ScanResult {
  card: CardWithDetails | null
  confidence: string
  rawText: string[]
  suggestion?: string | null
}

interface Props {
  userId: string
}

export default function Scanner({ userId }: Props) {
  const router = useRouter()
  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [state,  setState]  = useState<ScanState>('idle')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [cameraActive, setCameraActive] = useState(false)

  // Démarre la caméra
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // caméra arrière sur mobile
          width:  { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraActive(true)
      }
    } catch {
      setState('error')
    }
  }, [])

  // Arrête la caméra
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraActive(false)
  }, [])

  // Capture une frame et l'envoie à l'API
  const captureAndScan = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return
    setState('scanning')

    // Capture sur canvas
    const video  = videoRef.current
    const canvas = canvasRef.current
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)

    // Compresse en base64 (qualité 0.85)
    const base64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1]

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      })

      const data = await res.json() as ScanResult & { error?: string }

      if (!res.ok) {
        setState('error')
        return
      }

      setResult(data)
      setState(data.card ? 'success' : 'no_match')
      stopCamera()
    } catch {
      setState('error')
    }
  }, [stopCamera])

  const reset = useCallback(() => {
    setState('idle')
    setResult(null)
    setCameraActive(false)
  }, [])

  return (
    <div className="flex-1 flex flex-col">
      {/* Viewfinder / Résultat */}
      <div className="relative flex-1 bg-canvas flex items-center justify-center overflow-hidden">

        {/* Caméra active */}
        {cameraActive && (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />
            {/* Viseur */}
            <div className="relative z-10 w-64 h-80 border-2 border-gold rounded-card shadow-glow">
              {/* Coins */}
              {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-6 h-6 border-gold
                  ${i < 2 ? 'border-t-2' : 'border-b-2'}
                  ${i % 2 === 0 ? 'border-l-2' : 'border-r-2'}
                `} />
              ))}
              {/* Ligne de scan animée */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gold/60 animate-scan-line" />
            </div>
            <p className="absolute bottom-6 left-0 right-0 text-center text-xs text-white/50">
              Centre la carte dans le cadre
            </p>
          </>
        )}

        {/* État idle */}
        {state === 'idle' && !cameraActive && (
          <div className="flex flex-col items-center gap-3 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center text-3xl">
              📷
            </div>
            <p className="text-sm text-white/60">
              Scanne une carte pour l'identifier instantanément
            </p>
          </div>
        )}

        {/* Scanning */}
        {state === 'scanning' && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-white/60">Identification en cours…</p>
          </div>
        )}

        {/* Succès */}
        {state === 'success' && result?.card && (
          <div className="absolute inset-0 bg-canvas/95 flex flex-col items-center justify-center px-6">
            <div className="w-10 h-10 rounded-full bg-owned/20 border border-owned/50 flex items-center justify-center mb-4">
              <span className="text-owned text-lg">✓</span>
            </div>
            <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Carte identifiée</p>
            <h2 className="text-xl font-semibold text-center mb-1">
              {result.card.player_name}
            </h2>
            <p className="text-sm text-white/50 mb-6">
              #{result.card.card_number}
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => router.push(`/catalogue/${result.card!.id}`)}
                className="btn-gold w-full text-center py-3 rounded-xl"
              >
                Voir la fiche carte
              </button>
              <button
                onClick={reset}
                className="text-sm text-white/40 hover:text-white/60 transition-colors py-2"
              >
                Scanner une autre carte
              </button>
            </div>
          </div>
        )}

        {/* Aucun résultat */}
        {state === 'no_match' && (
          <div className="absolute inset-0 bg-canvas/95 flex flex-col items-center justify-center px-6">
            <div className="w-10 h-10 rounded-full bg-missing/20 border border-missing/50 flex items-center justify-center mb-4">
              <span className="text-missing text-lg">?</span>
            </div>
            <p className="text-sm text-white/60 text-center mb-2">
              Carte non reconnue
            </p>
            {result?.suggestion && (
              <p className="text-xs text-white/30 mb-6">
                Texte détecté : «{result.suggestion}»
              </p>
            )}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => router.push(`/catalogue?q=${encodeURIComponent(result?.suggestion ?? '')}`)}
                className="btn-gold w-full text-center py-3 rounded-xl"
              >
                Rechercher manuellement
              </button>
              <button
                onClick={reset}
                className="text-sm text-white/40 hover:text-white/60 py-2"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Erreur */}
        {state === 'error' && (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm text-white/60">
              Impossible d'accéder à la caméra ou erreur de reconnaissance.
            </p>
            <button onClick={reset} className="text-sm text-gold hover:text-gold-light">
              Réessayer
            </button>
          </div>
        )}
      </div>

      {/* Canvas caché pour la capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Boutons d'action */}
      <div className="px-6 py-5 border-t border-border flex flex-col gap-3">
        {!cameraActive && state === 'idle' && (
          <button
            onClick={startCamera}
            className="btn-gold w-full py-4 rounded-xl text-base font-semibold"
          >
            Ouvrir la caméra
          </button>
        )}

        {cameraActive && (
          <>
            <button
              onClick={captureAndScan}
              className="btn-gold w-full py-4 rounded-xl text-base font-semibold"
            >
              📸 Identifier la carte
            </button>
            <button
              onClick={() => { stopCamera(); setState('idle') }}
              className="text-sm text-white/40 hover:text-white/60 py-2"
            >
              Annuler
            </button>
          </>
        )}
      </div>
    </div>
  )
}
