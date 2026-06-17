'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatAuthError } from '@/lib/auth/errors'

function LoginForm() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/catalogue'

  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('error') === 'auth') {
      setError('Connexion échouée. Réessaie.')
    }
  }, [searchParams])

  const callbackUrl = (next: string) =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

  const signInWithGoogle = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl(redirectTo) },
    })
    if (error) setError(formatAuthError(error))
  }

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl(redirectTo) },
    })

    setLoading(false)
    if (error) {
      setError(formatAuthError(error))
    } else {
      setSent(true)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">
          Cartes Sport <span className="text-gold">FR</span>
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Connecte-toi pour gérer ta collection
        </p>
      </div>

      <button
        onClick={signInWithGoogle}
        className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2"
      >
        Continuer avec Google
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-white/30">ou</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {sent ? (
        <p className="text-sm text-owned text-center">
          Lien de connexion envoyé à <span className="text-white">{email}</span>.
          Vérifie ta boîte mail.
        </p>
      ) : (
        <form onSubmit={signInWithEmail} className="space-y-3">
          <input
            type="email"
            required
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="search-input"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl border border-border text-sm text-white/70
                       hover:border-gold/50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Envoi…' : 'Recevoir un lien de connexion'}
          </button>
        </form>
      )}

      {error && (
        <p className="text-sm text-missing text-center">{error}</p>
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-canvas px-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
