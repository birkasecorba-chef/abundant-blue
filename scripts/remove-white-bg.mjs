import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'

const images = [
  { src: 'public/paragonsports-84684-abundant-blue-flat-4000px.jpg', out: 'public/jacket-flat.png' },
  { src: 'public/paragonsports-84684-abundant-blue-model-4000px.jpg', out: 'public/jacket-model.png' },
  { src: 'public/paragonsports-84684-abundant-blue-back.jpg', out: 'public/jacket-back.png' },
  { src: 'public/paragonsports-84684-abundant-blue-2-2000px.jpg', out: 'public/jacket-alt.png' },
]

for (const { src, out } of images) {
  console.log(`Processing ${src}...`)
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const buf = Buffer.from(data)

  // Make white/near-white pixels transparent
  // threshold: pixels with R>230 && G>230 && B>230 become transparent
  // Use a soft edge: gradually fade alpha for near-white pixels
  for (let i = 0; i < buf.length; i += channels) {
    const r = buf[i], g = buf[i+1], b = buf[i+2]
    const brightness = (r + g + b) / 3

    if (r > 240 && g > 240 && b > 240) {
      // Pure white → fully transparent
      buf[i+3] = 0
    } else if (r > 220 && g > 220 && b > 220) {
      // Near-white → semi-transparent (soft edge)
      const whiteness = Math.min(255, ((r - 220) + (g - 220) + (b - 220)) / 3 * (255/20))
      buf[i+3] = Math.max(0, 255 - whiteness)
    }
    // else: keep original alpha (255 = fully opaque)
  }

  await sharp(buf, { raw: { width, height, channels } })
    .png({ quality: 85 })
    .toFile(out)

  const stat = (await import('fs')).statSync(out)
  console.log(`  → ${out}: ${(stat.size/1024).toFixed(0)}KB`)
}

console.log('Done!')
