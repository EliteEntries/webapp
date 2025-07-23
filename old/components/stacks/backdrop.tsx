import { ReactElement } from "react"
import Loading from "./loading"

interface Props {
  loading?: boolean,
  full?: boolean,
  children: ReactElement | ReactElement[]
}

const Backdrop = ({loading, full, children}: Props) => {
  return (<span >
    <input type="checkbox" checked={loading} className={`modal-toggle`} readOnly />
    <div className={`modal z-[1000] p-0 m-0 bg-opacity-80`} style={{backgroundColor:full ? 'hsl(var(--nf, var(--n))':''}}>
      <div> {children} </div>
    </div>
  </span>)
}

export default Backdrop
