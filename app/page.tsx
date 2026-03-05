import dynamic from 'next/dynamic'

// Disable SSR for the animated page (GSAP requires browser APIs)
const AbundantBluePage = dynamic(
  () => import('@/components/AbundantBluePage'),
  { ssr: false }
)

export default function Home() {
  return <AbundantBluePage />
}
