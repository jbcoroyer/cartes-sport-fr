'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
    <motion.div
      className="w-full max-w-sm space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h1 className="text-display-sm font-semibold tracking-tight">
          Connexion
        </h1>
        <p className="text-base text-muted mt-3">
          Gère ta collection
        </p>
      </div>

      <button
        onClick={signInWithGoogle}
        className="btn-gold w-full py-3.5 rounded-xl2 flex items-center justify-center gap-3"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuer avec Google
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-2xs text-muted/70">ou</span>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      {sent ? (
        <p className="text-sm text-owned text-center bg-surface border-b border-border rounded-xl2 p-4">
          Lien envoyé à <span className="text-ink font-medium">{email}</span>.
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
            className="btn-ghost w-full py-3.5 disabled:opacity-50"
          >
            {loading ? 'Envoi…' : 'Recevoir un lien de connexion'}
          </button>
        </form>
      )}

      {error && (
        <p className="text-sm text-missing text-center">{error}</p>
      )}

      <p className="text-center">
        <Link href="/catalogue" className="text-2xs text-muted/80 hover:text-muted transition-colors">
          Explorer sans compte →
        </Link>
      </p>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-canvas px-6 relative overflow-hidden">
      <div className="absolute inset-0  pointer-events-none" />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
