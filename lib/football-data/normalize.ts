/** Normalise un nom de club pour la correspondance fuzzy */
export function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(f\.?c\.?|c\.?f\.?|s\.?c\.?|a\.?f\.?c\.?|bsc|club|football|de|balompie|balompié)\b/gi, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Correspondances manuelles pour les noms Topps/Panini vs Football-Data */
export const TEAM_EXTERNAL_ID_OVERRIDES: Record<string, number> = {
  'paris saint germain': 524,
  'real madrid': 86,
  'atletico de madrid': 78,
  'fc barcelona': 81,
  'fc bayern munchen': 5,
  'manchester city': 65,
  'liverpool': 64,
  'arsenal': 57,
  'chelsea': 61,
  'tottenham hotspur': 73,
  'newcastle united': 67,
  'aston villa': 58,
  'nottingham forest': 351,
  'borussia dortmund': 4,
  'bayer 04 leverkusen': 3,
  'eintracht frankfurt': 19,
  'juventus': 109,
  'inter milano': 108,
  'fc internazionale milano': 108,
  'ac milan': 98,
  'ssc napoli': 113,
  'as roma': 100,
  'atalanta bc': 102,
  'acf fiorentina': 99,
  'sl benfica': 190,
  'benfica': 190,
  'fc porto': 503,
  'sporting clube de portugal': 498,
  'sporting cp': 498,
  'celtic': 354,
  'rangers': 357,
  'ajax': 678,
  'afc ajax': 678,
  'psv eindhoven': 674,
  'feyenoord': 675,
  'monaco': 548,
  'as monaco': 548,
  'olympique lyonnais': 523,
  'olympique de marseille': 516,
  'lille': 521,
  'rc lens': 546,
  'rc strasbourg alsace': 576,
  'stade rennais': 529,
  'stade brestois': 512,
  'angers sco': 532,
  'aj auxerre': 1045,
  'krc genk': 1108,
  'montpellier hsc': 518,
  'montpellier': 518,
  'fc nantes': 543,
  'as saint etienne': 527,
  'saint etienne': 527,
  'stade de reims': 547,
  'reims': 547,
  'fc metz': 545,
  'crystal palace': 384,
  'crystal palace fc': 384,
  'fc shakhtar donetsk': 610,
  'shakhtar donetsk': 610,
  'rangers f c': 357,
  'athletic club': 77,
  'real betis': 90,
  'athletic bilbao': 77,
}
