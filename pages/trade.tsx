import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Chart from '../components/chart'

const Trade: NextPage = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Chart />
    </div>
  )
}

export default Trade
