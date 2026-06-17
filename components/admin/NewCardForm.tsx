'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

interface Product { id: string; name: string; season: string }
interface Team { id: string; name: string }
interface Rarity { id: string; name: string; product_id: string }

interface Props {
  products: Product[]
  teams: Team[]
  rarities: Rarity[]
}

const VARIANT_TYPES = [
  { value: 'base',      label: 'Base' },
  { value: 'parallel',  label: 'Parallèle' },
  { value: 'numbered',  label: 'Numérotée (/X)' },
  { value: 'autograph', label: 'Autographe' },
]

export default function NewCardForm({ products, teams, rarities }: Props) {
  const router = useRouter()

  const [productId, setProductId]   = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [teamName, setTeamName]     = useState('')
  const [rarityName, setRarityName] = useState('')
  const [position, setPosition]     = useState('')
  const [variantType, setVariantType] = useState('numbered')
  const [printRun, setPrintRun]     = useState('')
  const [isAutograph, setIsAutograph] = useState(false)
  const [isRookie, setIsRookie]     = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const existingRarities = useMemo(
    () => rarities.filter((r) => r.product_id === productId).map((r) => r.name),
    [rarities, productId]
  )

  const reset = () => {
    setCardNumber('')
    setPlayerName('')
    setTeamName('')
    setRarityName('')
    setPosition('')
    setPrintRun('')
    setIsAutograph(false)
    setIsRookie(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)

    try {
      const res = await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          card_number: cardNumber,
          player_name: playerName,
          team_name: teamName,
          rarity_name: rarityName,
          position: position || undefined,
          variant_type: variantType,
          print_run: printRun ? parseInt(printRun, 10) : null,
          is_autograph: isAutograph,
          is_rookie: isRookie,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setResult({ type: 'error', message: data.error ?? 'Erreur inconnue' })
      } else {
        setResult({ type: 'success', message: `Carte créée — #${cardNumber} ${playerName}` })
        reset()
        router.refresh()
      }
    } catch {
      setResult({ type: 'error', message: 'Erreur réseau' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-xs text-white/40 mb-1.5">Produit / Saison</label>
        <select
          required
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="search-input"
        >
          <option value="">Sélectionner…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5">Numéro de carte</label>
        <input
          required
          type="text"
          placeholder="ex: 136 ou CA-MS"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="search-input"
        />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5">Nom du joueur</label>
        <input
          required
          type="text"
          placeholder="ex: Mohamed Salah"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="search-input"
        />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5">Club</label>
        <input
          required
          type="text"
          list="teams-list"
          placeholder="ex: Liverpool FC"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="search-input"
        />
        <datalist id="teams-list">
          {teams.map((t) => <option key={t.id} value={t.name} />)}
        </datalist>
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5">
          Rareté / Variante
          {existingRarities.length > 0 && (
            <span className="text-white/25 ml-1">
              ({existingRarities.length} déjà utilisées pour ce produit)
            </span>
          )}
        </label>
        <input
          required
          type="text"
          list="rarities-list"
          placeholder="ex: Gold Refractor, Violet Refractor…"
          value={rarityName}
          onChange={(e) => setRarityName(e.target.value)}
          className="search-input"
        />
        <datalist id="rarities-list">
          {existingRarities.map((name) => <option key={name} value={name} />)}
        </datalist>
        {rarityName && !existingRarities.includes(rarityName) && (
          <p className="text-[11px] text-gold mt-1.5">
            ＋ Nouvelle rareté — sera créée automatiquement pour ce produit
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Type</label>
          <select
            value={variantType}
            onChange={(e) => setVariantType(e.target.value)}
            className="search-input"
          >
            {VARIANT_TYPES.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Tirage (/X)</label>
          <input
            type="number"
            placeholder="ex: 250"
            value={printRun}
            onChange={(e) => setPrintRun(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5">Position (optionnel)</label>
        <input
          type="text"
          placeholder="ex: attaquant"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={isAutograph}
            onChange={(e) => setIsAutograph(e.target.checked)}
            className="accent-gold"
          />
          Autographe
        </label>
        <label className="flex items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={isRookie}
            onChange={(e) => setIsRookie(e.target.checked)}
            className="accent-gold"
          />
          Rookie
        </label>
      </div>

      {result && (
        <p className={`text-sm ${result.type === 'success' ? 'text-owned' : 'text-missing'}`}>
          {result.type === 'success' ? '✓ ' : '⚠ '}{result.message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !productId}
        className="btn-gold w-full py-3 rounded-xl disabled:opacity-40"
      >
        {submitting ? 'Création…' : 'Ajouter la carte'}
      </button>
    </form>
  )
}
