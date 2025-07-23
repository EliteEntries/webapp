import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { chart, chats, cpu, diagram3, wallet } from "./bottom-nav"
import dynamic from "next/dynamic"

const Logo = dynamic(() => import("./logo"), { ssr: false })

const Drawer = () => {
  const router = useRouter()
  const path = router.pathname.split('/')[1]
  return (
    <div className="drawer">
      <div className="drawer-side">
        <div className="w-full m-0 p-0 flex justify-center">
          <Logo />
        </div>
        <ul className="menu p-4 overflow-y-auto bg-base-100 text-base-content drawer-side">
          <li className={`${path == "strategies" && 'bordered'} m-1`}>
            <Link href="/strategies" className="drawer-item">{diagram3} Strategies</Link>
          </li>
          <li className={`${path == "trade" && 'bordered'} m-1`}>
            <Link href="/trade" className="drawer-item">{chart} Trade</Link>
          </li>
          <li className={`${path == "" && 'bordered'} m-1`}>
            <Link href="/"><Link href="/" className="drawer-item">{cpu} Dashboard</Link></Link>
          </li>
          <li className={`${path == "wallet" && 'bordered'} m-1`}>
            <Link href="/wallet" className="drawer-item">{wallet} Wallets</Link>
          </li>
          <li className={`${path == "chats" && 'bordered'} m-1`}>
            <Link href="/chats" className="drawer-item">{chats} Chats</Link>
          </li>
        </ul>
        <ul className="menu p-4 overflow-y-auto bg-base-100 text-base-content side-menu absolute bottom-12">
          <li><Link href="https://blog.eliteentri.es">Blog</Link></li>
          <li><Link href="https://discord.gg/CwvRBApcw2">Help<span className="text-xs">⧉</span></Link></li>
          <li><Link href={""}>About</Link></li>
          <li><Link href={""}>Contact Us<span className="text-xs">⧉</span></Link></li>
        </ul>
        
        <div className="flex flex-row-reverse w-40 bottom-8 absolute"><Link href={""}><i className="bi bi-brightness-high cursor-pointer"></i></Link></div>
      </div>
    </div>
  )
}

export default Drawer
