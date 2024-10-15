import dynamic from "next/dynamic"

const Logo = dynamic(() => import("../navigation/logo"), { ssr: false })

export default function Splash() {
    return (
        <div className='w-screen h-screen flex justify-center items-center fixed -z-10'>
            <Logo />
        </div>
    )
};