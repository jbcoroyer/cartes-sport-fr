import type { AuthError } from '@supabase/supabase-js'

export function formatAuthError(error: AuthError | null): string {
  if (!error) {
    return 'Une erreur est survenue. Réessaie.'
  }

  const msg = error.message?.trim()
  if (msg && msg !== '{}' && msg !== '[object Object]') {
    if (msg.includes('Database error saving new user')) {
      return 'Impossible de créer ton compte (profil utilisateur). Contacte le support si le problème persiste.'
    }
    if (msg.includes('redirect') || msg.includes('Redirect')) {
      return 'URL de redirection non autorisée dans Supabase. Ajoute http://localhost:3000/auth/callback aux Redirect URLs.'
    }
    if (msg.includes('rate limit') || msg.includes('Rate limit')) {
      return 'Trop de tentatives. Attends quelques minutes avant de réessayer.'
    }
    return msg
  }

  if (error.status === 500) {
    return 'Erreur serveur lors de la connexion. Réessaie dans quelques instants.'
  }

  return 'Connexion impossible. Vérifie ton email ou réessaie.'
}
