import { useWeb3React } from "@web3-react/core";
import { Component, useEffect, useState } from "react";
import Backdrop from "./stacks/backdrop";
import BottomNav from "./navigation/bottom-nav";
import Drawer from "./navigation/drawer";
import Footer from "./footer";
import Loading from "./stacks/loading";
import LoginPopup from "./modals/login-popup";
import TopNav from "./navigation/top-nav";
import { useCollection, useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { collection, doc } from "firebase/firestore";
import getAccountData from "../utilities/getAccountData"

export default function App({state, pageProps, Component}: {state:any, pageProps: any, Component: any}) {
    
    const { library, error: web3Error, deactivate, connector, account } = useWeb3React();
    const { loading, user } = state;
    const [ isLoading, setLoading] = useState<{message:string, submessage?:string} | false>(false);
    const [userData, setUserData] = useState<any>(false)
    const [algorithms, setAlgorithms] = useState<any>(false)
    const [subaccount, setSubAccount] = useState<any>(false)
    const [markets, setMarkets] = useState<string[]>([])
    const web3 = { library, connector, deactivate }
    let loadingData: boolean = false

    useEffect(()=>{
        (document.getElementById('login-modal') as any).checked = false;
    }, [user])

    useEffect(()=>{
        (async function() {
            if(userData.api && !userData.balances && !state.subaccount) {
                setSubAccount(Object.keys(userData.api)[0])
                return
            }
            if (userData.api && (!userData.balances || !userData.balances[state.subaccount]) && !loadingData) {
                loadingData = true
                const accounts = []
                if (state.total) { Object.keys(userData.api).forEach( ex => {
                    const name = ex
                    const exch = userData.api[ex]
                    accounts.push([name,exch.connection])
                })} else accounts.push([state.subaccount, userData.api[state.subaccount].connection])
                const {balances, positions, orders} = await getAccountData(accounts, userData)
                
                setUserData({...userData, balances:balances, positions:positions, orders:orders})
                loadingData = false
            }
        })()
      },[userData, subaccount])

    return (<span>
        
        {loading && <Backdrop full><Loading/></Backdrop>}
        {user && <>
        <UserData {...{state, setUserData}} />
        <Algorithms {...{state, setAlgorithms, setMarkets}} />
        <TopNav {...{state, web3}}/>
        <div className="hidden lg:inline-block fixed"><Drawer /></div>
        <BottomNav {...{state}} />
        </>}

        {!loading && <div className={`lg:inline-block lg:w-[calc(100vw${user ? '-210px':''})] lg:float-right ${user ? 'pt-12':'lg:w-full'}`}>
            <Component {...pageProps} {...{state, userData, setLoading, algorithms, markets}}/>
            <Footer />
        </div>}

        <LoginPopup {...{state, isLoading, setLoading}}/>
        {isLoading && <Backdrop full loading>
            <label className="modal-box relative flex flex-col gap-5 justify-center items-center p-10 m-0 w-[40rem] h-max shadow-none mb-20 -md:w-[96vw] -sm:mt-14">
                <div>{isLoading.message}</div>
                <progress className="progress progress-primary w-56" />
                <div>{isLoading.submessage}</div>
            </label>
        </Backdrop>}
    
    </span>)
}

function UserData({state, setUserData} : any) {
    const [userDat, userDataloading, userDataError, userDataSnapshot] = useDocumentData(
        doc(state.firebase.db,`/users/${state.user.uid}`)
    )
    const [strategies, strategiesErrors] = useCollectionData(
        collection(state.firebase.db,`/users/${state.user.uid}/strategies`)
    )
    useEffect(()=>{
        if (userDat && strategies) {
        let accounts: any = {}
        Object.keys(userDat.api).forEach((ex) => {
            Object.keys(userDat.api[ex]).filter(it => {return it != '_keys'}).forEach((account)=>{
            accounts[account] = {...userDat.api[ex][account], connection: ex, key:userDat.api[ex][account].key || userDat.api[ex]._keys._key, secret:userDat.api[ex][account].secret || userDat.api[ex]._keys._secret}
            })
        })
        let strats: any = {}
        strategies.forEach( strat => {
            strats[strat.name] = strat
        })
        setUserData({strategies: strats, api: accounts, watchlist:userDat.watchlist, id:state.user.uid})
        } else console.log('NONE')
    }, [userDat, strategies])
    
    useEffect(()=>{
        if (userDataError) {
            console.log(userDataError)
        }
    }, [userDataError])
    return null
}

function Algorithms({state, setAlgorithms, setMarkets} : any) {
    const [algos, algorithmsLoading, algorithmsError, algorithmsSnapshot] = useCollectionData(
        collection(state.firebase.db,`algorithms`)
    )
    const [markets, marketsLoading] = useCollection(
        collection(state.firebase.db,`markets`)
    )
    
    useEffect(()=>{
        if (algos && markets) {
            let data: any = {}, m: any = {}
            algos.forEach( algo => {
                data[algo.name] = algo
            })
            markets.docs.forEach( async market => {
                const data = market.data()
                m[market.id] = Object.keys(data).sort()
            })
            setAlgorithms(data)
            setMarkets(m)
        }
    }, [algos, markets])
    
    useEffect(()=>{
        if (algorithmsError) {
            console.log(algorithmsError)
        }
    }, [algorithmsError])
    
    return null
    
}