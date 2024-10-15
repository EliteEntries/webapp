import dynamic from "next/dynamic";
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

interface Props {
  state: any,
  web3: any
}
function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Logo = dynamic(() => import("./logo"), { ssr: false })

const TopNav = ({state, web3} : Props) => {
  const [scroll, setScroll] = useState(0)
  const router = useRouter()
  const path = router.pathname.split('/')[1]

  async function clickEvent(e: React.MouseEvent<HTMLElement>){
    if(state?.user) {
      e.preventDefault() 
      state.firebase.logOut((): void => {
          if (web3?.connector?.close)
            web3.connector.close()
          web3.deactivate()
      })
    }
  }

  useEffect(()=>{
    window.addEventListener("scroll", ()=>setScroll(window.scrollY));
    return () => {
      window.removeEventListener("scroll", ()=>setScroll(window.scrollY));
    };
  },[])

  return (
    <div className={`min-h-[3rem] w-full flex items-center p-1 nav fixed z-50 bg-base-${scroll ? '100' : '200'} lg:right-0 lg:bg-base-200 lg:w-[calc(100vw-210px)] ${state.user? '':'hidden'}`}>
      <div className="navbar-start">
        <div className={`dropdown lg:hidden ${!state.user ? 'hidden' : ''}`}>
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <img src="../favicon.ico" width='24' height='24'/>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-40">
            <li><Link href="https://blog.eliteentri.es">Blog</Link></li>
            <li><Link href="https://discord.gg/CwvRBApcw2">Help</Link></li>
            <li><Link href={""}>About</Link></li>
            <li><Link href="https://discord.gg/Q2VG8uvjXW">Contact Us↗</Link></li>
            <li className="flex-row-reverse"><Link href={""}><i className="bi bi-brightness-high"></i></Link></li>
          </ul>
        </div>
        <Link className="btn btn-ghost normal-case text-xl lg:hidden" href={""}>{capitalizeFirst(path || "Home")}</Link>
      </div>
      <div className="navbar-center">
        <Link className="btn btn-ghost normal-case text-xl -lg:hidden" href={""}>{capitalizeFirst(path || "Home")}</Link>
      </div>
      <div className="navbar-end">
        {!state.user && <label htmlFor="login-modal" className={`btn btn-ghost btn-circle`} >
          <i className="bi bi-person-circle bi-lg"/>
        </label>}
        {state.user && <>
          <button className={`btn btn-ghost btn-circle -md:hidden`}>
              <i className="bi bi-search bi-lg pb-1" />
          </button>
          <div className={`dropdown dropdown-end lg:dropdown-hover`}>
            <button className="btn btn-ghost btn-circle">
              <label className="indicator cursor-pointer" tabIndex={0}>
                <i className="bi bi-bell bi-lg pb-1" />
                <span className="badge badge-xs hidden badge-primary indicator-item mt-0.5"></span>
              </label>
            </button>
            <ul tabIndex={0} className={`menu menu-compact notifications dropdown-content mt-0.5 mr-3 p-2 shadow bg-base-100 rounded-box w-56`}>
              {state.notifications ? state.notifications.map((n: {data: string}, i: Number) => (
                <li className="flex" key={`ntfn-${i}`}><Link href={""}>
                  <i className="bi bi-box-arrow-left"/>
                  <span className="">{n.data}</span> 
                </Link></li>
              )) : <>
                <li className="flex items-center"><Link href={""}>
                  <span>No Notifications</span> 
                </Link></li>
              </>}
            </ul>
          </div>
          <div className={`dropdown lg:dropdown-hover dropdown-end ${state.user ? "" : "hidden"}`}>
            <label tabIndex={0} className="btn btn-ghost btn-circle" >
            {state.user?.photoURL ?
              <img alt={'user'} src={state.user?.photoURL} className="w-7 h-7 rounded-full"/> :
              <i className="bi bi-person-circle lg"/>}
            </label>
            <ul tabIndex={0} className={`menu menu-compact dropdown-content mt-0.5 p-2 shadow bg-base-100 rounded-box w-32`}>
              <li><Link href={""}>Account</Link></li>
              <li className="flex"><Link href={""}>Settings</Link></li>
              <li className="flex"><Link onClick={clickEvent} href={""}>
                <span className="flex-[50%]">Logout</span> 
                <i className="bi bi-box-arrow-left text-right pb-0.5 flex-[50%]"/>
              </Link></li>
            </ul>
          </div>
        </>}
      </div>
    </div>
  )
}

const menu = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 6h16M4 12h16M4 18h7" /></svg>

export default TopNav
