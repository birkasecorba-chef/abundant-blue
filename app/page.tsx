import dynamic from 'next/dynamic'
const AbundantBluePage = dynamic(() => import('@/components/AbundantBluePage'), { ssr: false })
export default function Home() { return <AbundantBluePage /> }
