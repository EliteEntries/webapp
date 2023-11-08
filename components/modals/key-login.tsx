import { FormEvent, useState } from "react"
import { Logging } from "./email-login"
import webcrypto from "../../utilities/webcrypto"

interface Props {
    state: any
}

interface Logging {
    token: string,
    id: string,
    message: JSX.Element,
}


export const KeyLogin = ({state}: Props) => {

    const [logging, setLogging] = useState<Logging | false>(false)

    async function submit(e: FormEvent) {
        e.preventDefault()
        const webCrypto = new webcrypto(crypto)
        const key = (e.target as any).key.value

        //GET ADDRESS FROM KEY
        //CHECK FIREBASE FOR PASS BASED ON ADDRESS, OTHERWISE
        const pass = await webCrypto.genKey()
        console.log(pass)

        //ENCYRPT KEY & STORE
        const encrypted = await webCrypto.encrypt(pass, key)

        //STORE PASS ON FIREBASE


        //TEST, DECRYPT WHEN RELOGGING 
        const decrypted = await webCrypto.decrypt(pass, encrypted)
        alert(decrypted)
    }
    function change() {
        const login = (document.getElementById('login-modal') as any);
        login.checked = !login.checked
    }

    return <>
        <input type="checkbox" id="key-modal" className="modal-toggle" onChange={change}/>
        <label htmlFor="key-modal" className="modal cursor-pointer p-0 m-0">
        <label className="modal-box relative flex justify-center p-10 m-0 w-[40rem] shadow-none mb-20 -md:w-[96vw] -sm:mt-14">
            <form id="key" onSubmit={(submit)}>
                <div className="form-control w-full max-w-xs">
                    <label className="label my-5">
                        <span className="label-text">enter your private key below. it will be encrypted by a randomly generated key from on our servers and stored in your browser storage.</span>
                    </label>
                    <input type="text" placeholder="0xf4a2b93959...." className="input input-bordered w-full max-w-xs" name="key"/>
                </div> 
                <button className="btn float-right my-5 btn-sm" type="submit" form="key">Enter</button>
            </form>
        </label>
        </label>
        {logging && <Logging {...logging} db={state.firebase.db} />}
    </>
}