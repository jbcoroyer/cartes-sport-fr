const BUCKET = 'card-photos'

export function cardPhotoStoragePath(userId: string, cardId: string): string {
  return `${userId}/${cardId}.jpg`
}

export function getCardPhotoPublicUrl(
  supabaseUrl: string,
  userId: string,
  cardId: string,
): string {
  const path = cardPhotoStoragePath(userId, cardId)
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`
}

export async function resizeCardPhoto(file: File, maxEdge = 1400): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas non disponible')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Compression échouée'))),
      'image/jpeg',
      0.88,
    )
  })
}

export { BUCKET as CARD_PHOTOS_BUCKET }
