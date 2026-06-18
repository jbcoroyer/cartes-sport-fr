import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { rename, unlink } from 'fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logosDir = path.join(__dirname, '..', 'public', 'logos')
const assetsDir =
  'C:/Users/jbc/.cursor/projects/c-Users-jbc-cartes-sport-fr/assets'

const SOURCES = {
  panini:
    'c__Users_jbc_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_panini-logo-png_seeklogo-322629-fc2122eb-3c33-495a-b517-e40b56b9a8f4.png',
  topps:
    'c__Users_jbc_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Topps_Logo.svg-1966f1ad-6e6a-47a7-bcf2-142339996e88.png',
}

const CANVAS_W = 200
const CANVAS_H = 48

function isToppsBackground(r, g, b) {
  return r < 50 && g < 50 && b < 50
}

function isPaniniBackground(r, g, b) {
  return r > 175 && g > 125 && b < 100 && r > b + 60 && g > b + 30
}

function keyToAlpha(pixels, mode) {
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    const remove =
      mode === 'topps'
        ? isToppsBackground(r, g, b)
        : isPaniniBackground(r, g, b)
    if (remove || pixels[i + 3] < 128) {
      pixels[i + 3] = 0
    }
  }
}

function toWhiteLogo(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] > 40) {
      pixels[i] = 255
      pixels[i + 1] = 255
      pixels[i + 2] = 255
    }
  }
}

async function writeCanvas(inputBuffer, outputPath) {
  const outTmp = path.join(logosDir, `${path.basename(outputPath, '.png')}-processed.png`)
  await sharp({
    create: {
      width: CANVAS_W,
      height: CANVAS_H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: inputBuffer, gravity: 'center' }])
    .png()
    .toFile(outTmp)

  await unlink(outputPath).catch(() => {})
  await rename(outTmp, outputPath)
}

async function processLogo(name, mode) {
  const sourcePath = path.join(assetsDir, SOURCES[name])
  const outputPath = path.join(logosDir, `${name}.png`)

  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = Buffer.from(data)
  keyToAlpha(pixels, mode)

  const resized = await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim()
    .resize(CANVAS_W, CANVAS_H, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  await writeCanvas(resized, outputPath)

  if (name === 'topps') {
    const { data: lightData, info: lightInfo } = await sharp(resized)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const lightPixels = Buffer.from(lightData)
    toWhiteLogo(lightPixels)
    const lightBuffer = await sharp(lightPixels, {
      raw: { width: lightInfo.width, height: lightInfo.height, channels: 4 },
    })
      .png()
      .toBuffer()
    await writeCanvas(lightBuffer, path.join(logosDir, 'topps-light.png'))
  }

  console.log(`✓ ${name}.png`)
}

await processLogo('topps', 'topps')
await processLogo('panini', 'panini')
console.log('✓ topps-light.png')
