'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Check, HelpCircle, AlertTriangle, Loader2 } from 'lucide-react'
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

  void userId

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
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

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraActive(false)
  }, [])

  const captureAndScan = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return
    setState('scanning')

    const video  = videoRef.current
    const canvas = canvasRef.current
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)

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
      <div className="relative flex-1 bg-canvas flex items-center justify-center overflow-hidden min-h-[400px]">

        {cameraActive && (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />
            <div className="absolute inset-0 bg-canvas/30" />
            <div className="relative z-10 w-64 h-80 border border-gold/40 rounded-xl3 shadow-glow">
              {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-8 h-8 border-gold
                  ${i < 2 ? 'border-t-2' : 'border-b-2'}
                  ${i % 2 === 0 ? 'border-l-2' : 'border-r-2'}
                `} />
              ))}
              <div className="absolute inset-x-4 top-0 h-0.5 bg-gold/70 animate-scan-line shadow-glow-sm" />
            </div>
            <p className="absolute bottom-8 left-0 right-0 text-center text-xs text-muted">
              Centre la carte dans le cadre
            </p>
          </>
        )}

        {state === 'idle' && !cameraActive && (
          <div className="flex flex-col items-center gap-4 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-surface border-b border-border flex items-center justify-center">
              <Camera size={32} className="text-gold/60" />
            </div>
            <p className="text-sm text-muted max-w-xs">
              Scanne une carte pour l&apos;identifier instantanément dans le catalogue
            </p>
          </div>
        )}

        {state === 'scanning' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="text-gold animate-spin" />
            <p className="text-sm text-muted">Identification en cours…</p>
          </div>
        )}

        {state === 'success' && result?.card && (
          <div className="absolute inset-0 bg-canvas/95 backdrop-blur-sm flex flex-col items-center justify-center px-6">
            <div className="w-14 h-14 rounded-full bg-owned/15 border border-owned/40 flex items-center justify-center mb-5">
              <Check size={28} className="text-owned" />
            </div>
            <p className="text-2xs text-muted mb-2 uppercase tracking-wider">Carte identifiée</p>
            <h2 className="text-2xl font-bold text-center mb-1">
              {result.card.player_name}
            </h2>
            <p className="text-sm text-muted mb-8">
              #{result.card.card_number}
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => router.push(`/catalogue/${result.card!.id}`)}
                className="btn-gold w-full text-center py-3.5 rounded-xl2"
              >
                Voir la fiche carte
              </button>
              <button
                onClick={reset}
                className="text-sm text-muted hover:text-muted transition-colors py-2"
              >
                Scanner une autre carte
              </button>
            </div>
          </div>
        )}

        {state === 'no_match' && (
          <div className="absolute inset-0 bg-canvas/95 backdrop-blur-sm flex flex-col items-center justify-center px-6">
            <div className="w-14 h-14 rounded-full bg-missing/15 border border-missing/40 flex items-center justify-center mb-5">
              <HelpCircle size={28} className="text-missing" />
            </div>
            <p className="text-sm text-ink/55 text-center mb-2">
              Carte non reconnue
            </p>
            {result?.suggestion && (
              <p className="text-xs text-muted/80 mb-6">
                Texte détecté : «{result.suggestion}»
              </p>
            )}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => router.push(`/catalogue?q=${encodeURIComponent(result?.suggestion ?? '')}`)}
                className="btn-gold w-full text-center py-3.5 rounded-xl2"
              >
                Rechercher manuellement
              </button>
              <button
                onClick={reset}
                className="text-sm text-muted hover:text-muted py-2"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            <AlertTriangle size={32} className="text-missing/70" />
            <p className="text-sm text-muted">
              Impossible d&apos;accéder à la caméra ou erreur de reconnaissance.
            </p>
            <button onClick={reset} className="text-sm text-gold hover:text-gold-light">
              Réessayer
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="px-5 py-5 border-t border-border/60 flex flex-col gap-3">
        {!cameraActive && state === 'idle' && (
          <button
            onClick={startCamera}
            className="btn-gold w-full py-4 rounded-xl2 text-base font-semibold flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            Ouvrir la caméra
          </button>
        )}

        {cameraActive && (
          <>
            <button
              onClick={captureAndScan}
              className="btn-gold w-full py-4 rounded-xl2 text-base font-semibold"
            >
              Identifier la carte
            </button>
            <button
              onClick={() => { stopCamera(); setState('idle') }}
              className="text-sm text-muted hover:text-muted py-2"
            >
              Annuler
            </button>
          </>
        )}
      </div>
    </div>
  )
}
