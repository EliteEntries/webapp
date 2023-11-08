import { User } from "firebase/auth"
import { AppProps } from "next/app"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import EmailPopup from "./email-login"
import { KeyLogin } from "./key-login"
import LoginCard from "./login-card"

interface Props {
  state: any,
  isLoading: {message:string, submessage?:string} | false,
  setLoading: Function
}

const LoginPopup = (props: Props) => {
  const router = useRouter()
  const path = router.pathname.split('/')[1]
  return (
    <>
    <input type="checkbox" id="login-modal" className="modal-toggle"/>
    <label htmlFor="login-modal" className="modal cursor-pointer p-0 m-0">
      <label className="modal-box relative flex justify-center rounded-md p-0 m-0 w-[40rem] shadow-none mb-20 -md:w-[96vw] -sm:mt-14" htmlFor="">
        <LoginCard {...props}/>
      </label>
    </label>
    <EmailPopup {...props}/>
    <KeyLogin {...props}/>
    </>
  )
}

export default LoginPopup
