'use client'

export default function BackButton() {
  return (
    <button
      onClick={() => history.back()}
      className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center
                 bg-canvas/70 backdrop-blur-sm rounded-full border border-border"
      aria-label="Retour"
    >
      ‹
    </button>
  )
}
