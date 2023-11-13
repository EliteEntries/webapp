import { AbstractConnector } from '@web3-react/abstract-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { signInWithCustomToken, signInWithRedirect } from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'
import { useEffect, useState } from 'react'
import { apple, google, metamask, microsoft, solana, walletconnect, yahoo } from '../../utilities/icons'
import Link from 'next/link'
import { useWeb3React } from '@web3-react/core'

interface signInButton {
  for?: string
  name: string,
  icon?: JSX.Element,
  disabled?: boolean,
  action?: Function,
}

interface Props {
  state: any,
  isLoading: {message:string, submessage?:string} | false,
  setLoading: Function
}

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
})

const LoginCard = ({state, isLoading, setLoading}: Props) => {
  const [more, setMore] = useState(false)
  const { isActive, account, provider, connector } = useWeb3React()
  const walletAuth = httpsCallable(state.firebase.functions, 'walletAuth')

  async function signIn(provider: string = "google") {
    await signInWithRedirect(state.firebase.auth, state.firebase.provider(provider)).catch(e => console.log(e));
  }

  async function activateWallet(provider: AbstractConnector) {
    try {
      await connector.activate(provider)
    } catch (e) {
      console.log(e)
    }
  }

  const buttons: signInButton[] = [
    {name:"WalletConnect", icon: walletconnect, action: () => activateWallet(state.walletconnect), disabled:true},
    {name:`Web3`, icon: metamask, action: () => activateWallet(injected)},
    {name:"Google", icon: google, action: signIn },
    {name:"Facebook", icon: <i className="bi bi-facebook mr-2 mb-2 text-2xl text-[#4267B2]"/>, action: ()=>signIn('facebook')},
    {name:"Sign in with Email", icon: <i className="bi bi-envelope mr-2 mb-2 text-2xl" />, for:'email-modal'},
  ]
  const moreButtons: signInButton[] = [
    {name:"Apple", icon: apple, disabled: true},
    {name:"Microsoft", icon: microsoft, disabled: true},
    {name:"Twitter", icon: <i className="bi bi-twitter mr-2 mb-2 text-2xl text-[#1DA1F2]"/>, action: ()=>signIn('twitter')},
    {name:"Import Key", for:'key-modal'},
  ]
  const evenMoreButtons: signInButton[] = [
    {name:`Solana`, icon: solana, disabled: true},
    {name:"Yahoo", icon: yahoo, disabled: true},
    {name:"GitHub", icon: <i className="bi bi-github mr-2 mb-2 text-2xl text-black"/>, disabled: true},
    {name:"Phone SMS", icon: <i className="bi bi-phone mr-2 mb-2 text-2xl"/>, disabled: true},
  ]
  
  useEffect(() => {
    if (isActive && !state.user) {
      const sign = async () => {
        await new Promise(r => setTimeout(r, 2000));//give it a second to see if it reopens the app automatically
        setLoading({message:"Authenticate by signing the message in your wallet."})
        const timeout = setTimeout(()=>{
          setLoading({
            message:"Authenticate by signing the message in your wallet.",
            submessage:"You may have to go back to your wallet app"
          },5000)
        })
        const msg = 'Verify this message to sign in.'
        const sig = await provider?.getSigner().signMessage(msg).catch((e: any) => alert(`WOMP ${e.message}`))
        if (sig) {
          clearTimeout(timeout)
          setLoading({message:"Securely logging you in."})
          const { data } = await walletAuth({
            message:msg,
            sig:sig,
          })
          console.log(data)
          const { success, token, message } = data as {success: boolean, token?: string, message?:string}
          if (success && token) {
            await signInWithCustomToken(state.firebase.auth, token as string)
            setLoading(false)
          } else {
            alert("Invalid signature. Please try logging in again.")
            setLoading(false)
            if((connector as any)?.close)
              (connector as any).close()
            if((connector as any)?.deactivate)
            (connector as any).deactivate()
          }
        }
        else {
          alert('No signature provided. Please try again.')
        }
      }
      sign()
    } else if (state.user && !isActive) {
      alert('Wallet Not Connected')
    }
  }, [isActive])

  function mapButtons(b: signInButton[], main: boolean) {
    return b.map((button) => ( 
      <div key={button.name} className={`${main? 'text-center' : ''} m-2`}>
        <label className={`btn ${main? 'w-56' : 'w-40'} ${button.disabled ? 'btn-disabled' : ''}`} 
        onClick={()=>{button.action ? button.action() : {}}} htmlFor={button.for || ''}>
          {button.icon}{button.name}
        </label>
      </div>
    ))
  }
  return (
    <div className={`card card-compact flex-shrink-0 md:w-full shadow-2xl bg-base-100 rounded-md -md:w-full overflow-y-auto`}>
      <div className='card-title'>
        <div className="text-left lg:text-left pt-4 pl-4">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-center mt-4 font-normal">Import your private key, or use your existing wallet via WalletConnect or Metamask/Web3. Alternatively, log in or sign up using email, social accounts, or sms!</p>
        </div>
      </div>
      <div className="card-body">
        <form id="login" onSubmit={(e)=>{e.preventDefault();}}>
          {mapButtons(buttons, true)}
          {!more && <label className='font-light' onClick={(e)=>{e.preventDefault(); setMore(true)}}>More ↓</label>}
          {more && <span>
            <div className='divider m-0.5'/>
            <span className='flex justify-center'>
              <span>
                {mapButtons(moreButtons, false)}
              </span>
              <span>
                {mapButtons(evenMoreButtons, false)}
              </span>
            </span>
          </span>}
          {more && <label className='font-light sm:hidden' onClick={(e)=>{e.preventDefault(); setMore(false)}}>Less ↑</label>}
          <label className="font-light float-right">
            <Link href="#" className="link link-hover">Need help?</Link>
          </label>
          
        </form>
      </div>
    </div>
  )
}

export default LoginCard
