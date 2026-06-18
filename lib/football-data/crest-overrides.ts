import { normalizeTeamName } from './normalize'

const FOTMOB_CREST = (id: number) =>
  `https://images.fotmob.com/image_resources/logo/teamlogo/${id}.png`

/** [nom en base, id FotMob] — les clés sont normalisées automatiquement */
const TEAM_FOTMOB_PAIRS: [string, number][] = [
  // Angleterre
  ['Arsenal FC', 9825],
  ['Aston Villa FC', 10252],
  ['Chelsea FC', 8455],
  ['Crystal Palace FC', 9826],
  ['Liverpool FC', 8650],
  ['Manchester City FC', 8456],
  ['Manchester United FC', 10260],
  ['Newcastle United FC', 10261],
  ['Nottingham Forest FC', 10203],
  ['Tottenham Hotspur FC', 8586],
  ['West Ham United FC', 8654],

  // Espagne
  ['Athletic Club', 8315],
  ['Club Atlético de Madrid', 9906],
  ['FC Barcelona', 8634],
  ['Girona FC', 7732],
  ['Real Betis Balompié', 8603],
  ['Real Madrid CF', 8633],
  ['Villarreal CF', 10205],

  // Italie
  ['AC Milan', 8564],
  ['ACF Fiorentina', 8535],
  ['AS Roma', 8686],
  ['Atalanta BC', 8524],
  ['Como 1907', 10171],
  ['FC Internazionale Milano', 8636],
  ['Juventus FC', 9885],
  ['SS Lazio', 8543],
  ['SSC Napoli', 9875],
  ['Torino FC', 9804],

  // Allemagne
  ['Bayer 04 Leverkusen', 8178],
  ['Borussia Dortmund', 9789],
  ['Eintracht Frankfurt', 9810],
  ['FC Bayern München', 9823],
  ['RB Leipzig', 178475],

  // France — Ligue 1
  ['Angers SCO', 8121],
  ['AS Monaco FC', 9829],
  ['FC Lorient', 8689],
  ['FC Metz', 8550],
  ['FC Nantes', 9830],
  ['Le Havre AC', 9746],
  ['Lille OSC', 8639],
  ['OGC Nice', 9831],
  ['Olympique de Marseille', 8592],
  ['Olympique Lyonnais', 9748],
  ['Paris FC', 6379],
  ['Paris Saint-Germain FC', 9847],
  ['Racing Club de Lens', 8588],
  ['RC Strasbourg Alsace', 9848],
  ['Stade Brestois 29', 8521],
  ['Stade Rennais FC 1901', 9851],
  ['Toulouse FC', 9941],

  // France — Ligue 2 / relégués
  ['AS Saint-Étienne', 9853],
  ['Montpellier HSC', 10249],
  ['Stade de Reims', 9837],

  // Portugal & Pays-Bas
  ['AFC Ajax', 8593],
  ['Feyenoord Rotterdam', 10235],
  ['FC Porto', 9773],
  ['PSV', 8640],
  ['Sport Lisboa e Benfica', 9772],
  ['Sporting Clube de Portugal', 9768],

  // Belgique, Écosse, Tchéquie
  ['Club Brugge KV', 8342],
  ['KRC Genk', 9987],
  ['Rangers F.C.', 8548],
  ['SK Slavia Praha', 7787],
]

const MANUAL_CREST_PAIRS: [string, string][] = [
  ['Al-Ahli', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Alahlilogo.svg/120px-Alahlilogo.svg.png'],
  ['Al-Hilal', FOTMOB_CREST(2529)],
  [
    'FC Shakhtar Donetsk',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/%D0%A4%D0%9A_%D0%A8%D0%B0%D1%85%D1%82%D0%B0%D1%80_%D0%94%D0%BE%D0%BD%D0%B5%D1%86%D1%8C%D0%BA.svg/120px-%D0%A4%D0%9A_%D0%A8%D0%B0%D1%85%D1%82%D0%B0%D1%80_%D0%94%D0%BE%D0%BD%D0%B5%D1%86%D1%8C%D0%BA.svg.png',
  ],
]

function buildCrestOverrides(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [name, id] of TEAM_FOTMOB_PAIRS) {
    out[normalizeTeamName(name)] = FOTMOB_CREST(id)
  }
  for (const [name, url] of MANUAL_CREST_PAIRS) {
    out[normalizeTeamName(name)] = url
  }
  return out
}

export const TEAM_CREST_URL_OVERRIDES = buildCrestOverrides()

export function resolveTeamCrestUrl(
  teamName: string,
  cachedUrl: string | null | undefined,
): string | null {
  const override = TEAM_CREST_URL_OVERRIDES[normalizeTeamName(teamName)]
  return override ?? cachedUrl ?? null
}
