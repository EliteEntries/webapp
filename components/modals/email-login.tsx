import { signInWithCustomToken } from "firebase/auth"
import { doc } from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import { useRouter } from "next/router"
import { FormEvent, useEffect, useState } from "react"
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Backdrop from "../stacks/backdrop"
import Loading from "../stacks/loading"
import LoginCard from "./login-card"

interface Props {
  state: any,
}

interface Logging {
  token: string,
  id: string,
  message: JSX.Element,
}


const EmailPopup = ({state,}: Props) => {
  const [logging, setLogging] = useState<Logging | false>(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const path = router.pathname.split('/')[1]
  const loginEmail = httpsCallable(state?.firebase.functions, 'loginEmail')
  const loginConfirm = httpsCallable(state?.firebase.functions, 'loginConfirm')
  
  async function signIn() {
    console.log('sign in')
    loginConfirm({ token: (logging as any).token, uid: (logging as any).id}).then( (result: any) => {
      if (result.data.success) {
        signInWithCustomToken(state.firebase.auth, result.data.token).then(()=>{
          setLogging(false);
          (document.getElementById('login-modal') as any).checked = false;
        })
      } else {
        alert(result.data.message)
      }
    })
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const email = (e.target as any).email.value
    let em = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!em.test(email)) return alert('Please enter valid email.')
    setLoading(true)
    const verify: any = await loginEmail({...{email}})
    if (verify.data.success) {
      if (verify.data.created) {
        setLogging({token: verify.data.token, id: verify.data.id, message:<p>No account found for email. Account creation link sent. <br/> Return to this page once verified.</p>})
      } else {
        setLogging({token: verify.data.token, id: verify.data.id, message:<p>We&apos;ve sent a login link to your email. <br/> Return to this page once verified.</p>})
      }
      (document.getElementById('email-modal') as any).checked = false;
      (document.getElementById('login-modal') as any).checked = false;
      setLoading(false)
    }
  }

  
  function change() {
    const login = (document.getElementById('login-modal') as any);
    login.checked = !login.checked
  }

  return (<>
    <input type="checkbox" id="email-modal" className="modal-toggle" onChange={change}/>
    <label htmlFor="email-modal" className="modal cursor-pointer p-0 m-0">
      <label className="modal-box relative flex justify-center p-10 m-0 w-[40rem] shadow-none mb-20 -md:w-[96vw] -sm:mt-14">
        <form id="email" onSubmit={(submit)}>
          <div className="form-control w-full max-w-xs">
            <label className="label my-5">
                <span className="label-text">enter your email below</span>
            </label>
            <input type="email" placeholder="user@domain.com" className="input input-bordered w-full max-w-xs" name="email"/>
          </div> 
          <button className="btn float-right my-5 btn-sm" type="submit" form="email">Enter</button>
        </form>
      </label>
    </label>
    {logging && <Logging {...logging} {...{signIn}} db={state.firebase.db} />}
    {loading && <Backdrop loading><Loading/></Backdrop>}
  </>)
}

export const Logging = ({message, token, id, db, signIn}: any) => {

  const [session, sessionLoading, sessionError, sessionSnapshot] = useDocumentData(
    doc(db,`sessions/${token}`)
  )
  useEffect(()=>{
    console.log('session', token)
    console.log(session, token)
    if (session?.active) signIn()
  }, [session])

  return <>
    <Backdrop loading full>
      <label className="modal-box relative flex flex-col gap-5 justify-center items-center p-10 m-0 w-[40rem] shadow-none mb-20 -md:w-[96vw] -sm:mt-14">
        <div>{message}</div>
        <progress className="progress progress-primary w-56" />
      </label>
    </Backdrop>
  </>
}

export default EmailPopup