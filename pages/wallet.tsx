import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import LoginCard from '../components/modals/login-card'
import LoginPopup from '../components/modals/login-popup'

const Analytics: NextPage = ({userData} : any) => {
  return (
    <div className="min-h-screen bg-base-200 justify-center overflow-hidden flex">
      <div className="p-2 flex-col w-full lg:flex-1 overflow-scroll lg:h-[calc(100vh-48px)] -lg:h-[calc(100vh-112px)]"> 
        <table className="table w-full">
          <thead>  
            <tr>
              <th>Name</th>
              <th>Market</th>
            </tr>
          </thead>
          <tbody>
            {userData && 'Wallets'}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Analytics
