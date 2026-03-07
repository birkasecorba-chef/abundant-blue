// Quick script to check if images load correctly
// Run: node scripts/remove-bg.mjs
import { readFileSync, statSync } from 'fs'
const imgs = [
  'public/paragonsports-84684-abundant-blue-flat-4000px.jpg',
  'public/paragonsports-84684-abundant-blue-model-4000px.jpg',
  'public/paragonsports-84684-abundant-blue-back.jpg',
  'public/paragonsports-84684-abundant-blue-2-2000px.jpg',
]
for (const img of imgs) {
  try {
    const s = statSync(img)
    console.log(`✅ ${img}: ${(s.size/1024).toFixed(0)}KB`)
  } catch {
    console.log(`❌ ${img}: MISSING`)
  }
}
