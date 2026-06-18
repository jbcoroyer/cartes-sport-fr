import type { SetProgress } from './progress'

const RECENT_HOURS = 48

export function isRecentlyUpdated(progress: SetProgress): boolean {
  if (!progress.lastAcquiredAt) return false
  const acquired = new Date(progress.lastAcquiredAt).getTime()
  const cutoff = Date.now() - RECENT_HOURS * 60 * 60 * 1000
  return acquired >= cutoff
}

export function getRecentlyUpdatedProductIds(
  progresses: SetProgress[],
): Set<string> {
  return new Set(
    progresses.filter(isRecentlyUpdated).map((p) => p.productId),
  )
}
