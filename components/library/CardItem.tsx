import Link from 'next/link'
import type { SetProgress } from '@/lib/collection/progress'
import {
  getPackTheme,
  packGradient,
  stripFilledCount,
} from '@/lib/collection/packTheme'
import styles from './CardItem.module.css'

interface Props {
  productId: string
  name: string
  season: string
  publisherName?: string | null
  progress: SetProgress
}

export default function CardItem({
  productId,
  name,
  season,
  publisherName,
  progress,
}: Props) {
  const theme = getPackTheme(name, season, publisherName)
  const owned = progress.baseOwned
  const total = progress.baseTotal
  const pct = progress.pctBase
  const filled = stripFilledCount(owned, pct)
  const silkClass = theme.silkLight ? styles.silkLight : styles.silk
  const background =
    total > 0
      ? packGradient(theme.c1, theme.c2)
      : `radial-gradient(140% 110% at 30% -5%, ${theme.c1} 0%, ${theme.c2} 72%, ${theme.c2} 100%)`

  return (
    <Link href={`/album/${productId}`} className={styles.card}>
      {theme.isNew && (
        <span className={styles.badge} aria-label="Nouvelle collection">
          Nouveau
        </span>
      )}

      <div className={styles.surface} style={{ background }}>
        <div className={styles.content}>
          <div
            className={`${styles.logo} ${
              theme.silkLight ? styles.logoLight : styles.logoDark
            } ${theme.logo === 'topps' ? styles.logoTopps : styles.logoPanini}`}
          >
            <img
              src={`/logos/${theme.logo}.png?v=6`}
              alt=""
              width={140}
              height={30}
              draggable={false}
            />
          </div>

          <div className={styles.mid}>
            <h2 className={`${styles.title} ${silkClass}`}>{name}</h2>
            <p className={`${styles.year} ${silkClass}`}>{season}</p>
          </div>

          <div className={styles.foot}>
            <div className={`${styles.counter} ${silkClass}`}>
              <span className={styles.owned}>{owned}</span>
              <span className={styles.slashTotal}>/ {total}</span>
              <span className={styles.cartesLabel}>cartes</span>
            </div>
            <div className={styles.strip} aria-hidden="true">
              {Array.from({ length: 20 }, (_, i) => (
                <span
                  key={i}
                  className={`${styles.stripSegment}${i < filled ? ` ${styles.on}` : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
