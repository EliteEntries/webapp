import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Accounts from '../components/accounts'
import LoginCard from '../components/modals/login-card'
import Watchlist from '../components/watchlist'

interface Props {
  state: any,
  userData: any
}


const Home: NextPage<Props> = ({state, userData}: any )=> {
  return (
  <>
    {!state.user && <div className='fixed w-screen'>
      <div className="bg-base-200 p-2 h-14">
        <label htmlFor="login-modal" className="btn btn-ghost btn-circle float-right" >
          <i className="bi bi-person-circle bi-lg"/>
        </label>
        <label className="btn btn-ghost btn-circle float-left" >
          <Link href={''}><i className="bi bi-brightness-high bi-lg"></i></Link>
        </label>
      </div>
    </div>}
    <div className="flex min-h-screen bg-base-200 lg:overflow-hidden -lg:flex-col">
      <div className="p-2 flex-col w-full lg:flex-1 flex-none overflow-scroll lg:h-[calc(100vh-48px)]"> 
        {!state.user && <>
          <img src="favicon.ico" width="128" height="128" className='m-auto pt-16'/>
          <h1 className='text-xl p-8 lg:max-w-7xl m-auto text-center'>Welcome to Elite Entries. Deploy automated trading strategies and other algorithms in the cloud. <br/> <br/>
          This software is currently in active development and is experimental. Use at your own risk. Always exercise caution and perform due diligence when engaging in automated trading.</h1>
          <div className='w-full text-center'>
            <label htmlFor="login-modal" className="btn btn-primary" >
              <h1>Sign Up or Log In</h1>
            </label>
          </div>
          <h2 className='p-8 lg:max-w-7xl m-auto text-center text-blue-700'><a href='https://github.com/xiroex/eliteentries'>See the code.</a></h2>
        </>}
        {state.user && userData && <Watchlist {...{userData}} />}
      </div>
      {state.user && <><div className="p-2 flex-col w-full lg:flex-1 flex-none overflow-scroll lg:h-[calc(100vh-48px)]">
        {state.user && userData && <Accounts {...{userData}} />}
      </div>
      <div className='p-2 w-full lg:flex-1 '>
        {state.user && userData && <>
              <table className="table w-full">
                <caption>Performance</caption>
                <thead>
                    <th className="lg:px-8">Strategy</th>
                    <th className="text-right lg:px-8">Performance</th>
                </thead>
                <tbody>
                    {}
                </tbody>
              </table>
          </>}
      </div></>}
    </div>
  </>)
}

export default Home
