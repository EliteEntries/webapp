import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const DynamicChart = dynamic(() => import('../components/chart'), { ssr: false })

const Trade: NextPage = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <DynamicChart />
    </div>
  )
}

export default Trade
