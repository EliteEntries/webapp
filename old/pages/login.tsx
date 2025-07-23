import { httpsCallable } from 'firebase/functions'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Backdrop from '../components/stacks/backdrop'
import Loading from '../components/stacks/loading'

interface Props {
  state: any
}


const Login: NextPage<Props> = ({state}) => {
  const router = useRouter()
  const [closing, setClosing] = useState<number|false>(false)
  const current = useRef<number|false>(false)
  current.current = closing
  const loginSession = httpsCallable(state.firebase.functions, 'loginSession')

  useEffect(()=>{
    if (router.isReady) {
      const { token } = router.query
      if (token) {
        loginSession({
          token: (token as string).replace('/','')
        }).then( result => {
          setClosing(3)
          const interval = setInterval(()=>{
            setClosing((current.current as number)-1) 
            if (current.current === 1) clearInterval(interval)
          }, 1000)
          setTimeout(()=>{
            window.opener = null
            window.open("", "_self")
            window.close()
          }, 5000)
        }).catch(e =>{
          alert('Error')
          router.push("/")
        })
      } else {
        router.push("/")
      }
    }
  },[router.isReady])
  
  return (<Backdrop loading full>
    <label className="modal-box relative flex flex-col gap-5 justify-center items-center p-10 m-0 w-[40rem] shadow-none mb-20 -md:w-[96vw] -sm:mt-14">
      <div><img src="/favicon.ico" width="56" height="56"></img></div>

      {!closing && <>
        <div>Securely Logging you in</div>
        <div><Loading /></div>
      </>}

      {closing && closing > 0 && <>
        <div>Success!</div>
        <div>{`Window closing In ${closing} seconds...`}</div>
      </>}

    </label>
  </Backdrop>)
}

export default Login
