import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

import { Web3ReactProvider } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { getRedirectResult } from 'firebase/auth'
import { getToken } from 'firebase/messaging'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { isIOS } from 'react-device-detect'
import { useAuthState } from 'react-firebase-hooks/auth'
import Web3 from 'web3'
import App from '../components/app'
import Splash from '../components/stacks/splash'
import Firebase from '../utilities/firebase'


const firebase = new Firebase();

const RPC_URLS = {
  1: 'https://mainnet.infura.io/v3/d6d9076b6b934eb3923fba94daeba448',
  4: 'https://rinkeby.infura.io/v3/d6d9076b6b934eb3923fba94daeba448'
}

const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true,
})




function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading, error] = useAuthState(firebase.auth)
  const [splash, setSplash] = useState(true)
  const state = { user, loading, error, firebase, walletconnect, }
  const router = useRouter();

  useEffect(()=>{
    if (!loading) {
      setSplash(false)
      if (!user) {
        if (router.pathname !== '/' && router.pathname.split('/')[1] !== 'login') router.push('/')
      }
    }
  },[user, loading])

  useEffect(()=>{
    if (!user && !loading) {
      if (router.pathname !== '/' && router.pathname.split('/')[1] !== 'login') router.push('/')
    } else { 
      if (!user) getRedirectResult(firebase.auth).catch((e: Error)=>{
        console.log(e)
      });
      if (!isIOS) requestPermission()
    }
  },[])

  
  function requestPermission() {
    if (Notification) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log(permission)
        }
      }).catch(e => console.log(`ERROR - ${e}`))
      getToken(firebase.initFCM(),{ vapidKey: `BJ19Pk0wSI-hs526EVr9NZMJG4ik5-A1po6P9pqugccMUzh-bI70jPABxlRVFHx3-VVKtb7UyvD3ZsqbiJnVQzc` }).then(token => {
        if(token){ console.log(token) }
        else alert(`no token`)
      })
    }
  }

  function getLibrary(provider: any) {
    const library = new Web3(provider);
    return library;
  };


  return <>
      <Web3ReactProvider getLibrary={getLibrary}>
      <Head>
        <title>Elite Entries</title>
        <meta name="description" content="NextJS Application with Firebase and DaisyUI/Tailwind" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"/>
      </Head>
      {splash && <Splash />}
      <App {...{state, pageProps, Component}}/>
    
    </Web3ReactProvider>
  </>
}

export default MyApp
