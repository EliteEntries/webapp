import { doc, updateDoc } from 'firebase/firestore'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Select from 'react-dropdown-select';


interface Props {
  state: any,
  userData: any,
  setLoading: Function,
  algorithms: any[],
  markets: string[]
}


const Strategies: NextPage<Props> = ({state, userData, setLoading, algorithms, markets}) => {

  const [active, setActive] = useState<string | false>(false)
  const [toggle, setToggle] = useState<string | false>(false)
  const [edit, setEdit] = useState<any>(false)
  const [sortActive, setSortActive] = useState<number>(1)
  const [sortName, setSortName] = useState<number>(0)

  async function activate(strategy: any) {
    setToggle(false)
    setLoading({ message: `${strategy.active ? "Deactivating":"Activating"} - ${strategy.name}` })
    await updateDoc(doc(state.firebase.db, `users/${state.user.uid}/strategies/${strategy.id}`), {
      active:!strategy.active
    })
    setLoading(false)
    //alert('goood')
  }

  useEffect(()=>{
    //if (window.matchMedia("(min-width: 1023px)").matches && userData)
      //setActive(Object.keys(userData.strategies)[0])
  },[userData])

  async function confirmEdit(strategy: any) {
    setLoading({ message: `Loading` })
    await updateDoc(doc(state.firebase.db, `users/${state.user.uid}/strategies/${strategy.id}`), {
      params:edit
    })
    setEdit(false)
    setLoading(false)

  }

  const randomprofit = Math.floor(Math.random() * (2000 - -2000 + 1) + -2000)
  const strategies = userData ? sortByName(sortByActive(Object.keys(userData.strategies), userData.strategies, sortActive), userData.strategies, sortName) : []

  return (
    <div className="min-h-screen bg-base-200 justify-center overflow-hidden flex">
      <div className="p-2 flex-col w-full lg:flex-1 overflow-scroll lg:h-[calc(100vh-48px)]"> 
        <table className="table w-full">
          <thead>  
            <tr>
              <th className='cursor-pointer lg:px-8' onClick={()=>{setSortName(sortName+1); setSortActive(0); setEdit(false)}}>Name {`${sortName%3==0?'':sortName%3==1?`↓`:`↑`}`}</th>
              <th className='float-right cursor-pointer lg:px-8' onClick={()=>{setSortActive(sortActive+1); setSortName(0); setEdit(false)}}>Active {`${sortActive%3==0?'':sortActive%3==1?`↓`:`↑`}`}</th>
            </tr>
          </thead>
          <tbody>
            {userData && strategies.map( (u:any) => (
              <tr key={userData.strategies[u].id} className={`cursor-pointer hover ${active == u && 'active'}`} onClick={()=>{setActive(u); setEdit(false)}}>
                <td className='lg:px-8'>{userData.strategies[u].name}</td>
                <td className='lg:px-8'><input type="checkbox" className='toggle toggle-primary float-right' readOnly checked={userData.strategies[u].active} 
                onClick={(e)=>{ e.stopPropagation(); setToggle(u)}}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {active && <>
        <input type="checkbox" id="my-modal" className="modal-toggle" readOnly checked={!!active}/>
        <div className="modal overflow-x-hidden" onClick={()=>setActive(false)}>
          <div className="modal-box flex flex-col items-center overflow-x-hidden" onClick={(e)=>e.stopPropagation()}>
            <h3 className="font-bold text-lg">{active}</h3>

            {!true && <StrategyCard {...{randomprofit}} />}

            <div className='w-full overflow-x-hidden'><form name='parameters'><Parameters {...{userData, active, edit, algorithms, markets, setEdit}} /></form></div>


            <div className="block mt-6 w-full">
              <div className="btn float-left" onClick={()=>{edit ? setEdit(false) : setEdit(userData.strategies[active].params)}}>{edit?"Cancel":"Edit"}</div>
              <div className="btn float-right" onClick={()=>{edit ? confirmEdit(userData.strategies[active]) : setActive(false) }}>{edit ? 'Confirm':'Close'}</div>
            </div>
          </div>
        </div>
      </>}
      {toggle && <>
        <input type="checkbox" id="my-modal" className="modal-toggle" readOnly checked={!!toggle}/>
        <div className="modal" onClick={()=>setToggle(false)}>
          <div className="modal-box flex flex-col items-center justify-center overflow-hidden" onClick={(e)=>e.stopPropagation()}>
            <h3 className="font-bold text-lg">{active}</h3>
            <div className='text-center w-full flex flex-wrap justify-center'>
              {`${userData.strategies[toggle].active ? 'Deactivate' : 'Activate'} ${toggle}?`}
            </div>
            <div className="block mt-6 w-full">
              <div className="btn float-left" onClick={()=>setToggle(false)}>Cancel</div>
              <div className="btn float-right" onClick={()=>activate(userData.strategies[toggle])}>Confirm</div>
            </div>
          </div>
        </div>
      </>}
    </div>
  )
}

export default Strategies

function Parameters({userData, active, edit, algorithms, markets, setEdit}: any) {
   
  return <div className='w-full flex xl:flex-1 flex-col'>
        {Object.keys(userData.strategies[active].params).sort().map( param => (
          <div key={param} className="cursor-pointer hover flex w-full my-1">
            <div className='float-left flex-1'>{param}</div>
            <div className='float-right text-right flex-1'>{edit? checkEditType(userData, active, param, algorithms, markets, edit, setEdit):checkType(userData.strategies[active].params[param])}</div>
          </div>
        ))}
  </div>
}


function StrategyCard({randomprofit}: {randomprofit:number}){
  return <div className="stats stats-vertical -lg:w-full -lg:mx-40 xl:flex-1">
  <div className="stat flex">
    <div className='flex-1'>
      <div className="stat-title">Markets</div>
      <div className="stat-value">12</div>
      <div className="stat-desc">Deployed for 4D 22H</div>
    </div>
    <div className='flex-1 text-right'>
      <div className="stat-title">Accounts</div>
      <div className="stat-value">5</div>
      <div className="stat-desc">$36,000 Total Volume</div>
    </div>
  </div>
  
  <div className="stat flex">
    <div className='text-left flex-1'>
      <div className="stat-title">Recent</div>
      <div className="stat-desc">↗︎ 400 BTC </div>
      <div className="stat-desc">↗︎ 400 ETH</div>
      <div className="stat-desc">↘︎ 400 ETH</div>
    </div>
    <div className='text-right flex-1'>
      <div className="stat-title">24H Trades</div>
      <div className="stat-value">4,200</div>
      <div className="stat-desc">↗︎ 400 (22%) day over day</div>
    </div>
  </div>
  
  <div className="stat flex">
    <div>
      <div className="stat-title flex-1">24H Performance</div>
      <div className={`stat-value ${randomprofit > 0 ? 'text-green-500' : 'text-red-500'}`}>${randomprofit}</div>
      <div className="stat-desc">↘︎ $90 (14%) day over day</div>
    </div>
    <div className='text-right flex-1'>
      <div className="stat-title">Postions</div>
      <div className="stat-desc">↗︎ (+22%) 400 BTC </div>
      <div className="stat-desc">↗︎ (+22%) 400 ETH</div>
      <div className="stat-desc">↘︎ (-22%) 400 SOL</div>
    </div>
  </div>
  
</div>
}



/************************************************************************************ */

function sortByActive(arr:string[], strategies:any, sortActive: number) {
  return arr.sort((a,b) => {
    if (sortActive%3 == 1) {
      if (strategies[a].active && !strategies[b].active)
        return -1
      else if (!strategies[a].active && strategies[b].active)
        return 1
      else return 0
    } 
    else if (sortActive%3 == 2) {
      if (strategies[a].active && !strategies[b].active)
        return 1
      else if (!strategies[a].active && strategies[b].active)
        return -1
      else return 0
    } 
    else return 0
  })
}

function sortByName(arr:string[], strategies:any, sortActive:number) {
  if (sortActive%3 == 1) return arr.sort()
  if (sortActive%3 == 2) return arr.sort().reverse()
  else return (arr)
} 

function checkType(param: any) {
  if (Array.isArray(param)) {
    if (param.length == 1) return param[0]
    else if (param.length == 0) return "None"
    else return `${param[0]} + ${param.length - 1}`
  } else if (param.length > 20) return param.substring(0,20) + '...'
  else return param.toString()
}

function checkEditType(userData: any, active: string, param: any, algorithms: any, markets: any, edit: any, setEdit: Function) {
  
  const strategy = userData.strategies[active]
  const name = strategy.algorithm
  const type = algorithms[name].parameters[param].type
  switch (type) {
    case 'number':
    case 'string': {
      return <input type={type=='string' ? 'text' : 'number'} name={param} className="input input-bordered input-primary input-sm w-full max-w-[8rem] text-right" defaultValue={edit[param]} />
    }
    case 'boolean': {
      return <input type='checkbox' name={param} className='toggle toggle-primary toggle-sm' defaultChecked={edit[param]} />
    }
    case 'select': {
      const multi = !!algorithms[name].parameters[param].multiple
      const props = {...{markets}, userData: { data:userData.api } }
      const value = { exchange:edit['exchange'] }
      const active = strategy
      const options = (eval(algorithms[name].parameters[param].options) || []).map( (o:string) => (o.replaceAll('/USD:USD','-PERP')))
      return multi ? <Select multi={multi} className="w-[8rem] !border-[hsl(var(--p))] !rounded-lg h-4 float-right"
        options={options.map((o:string) => ({value:o, label:o}))} 
        values={(!Array.isArray(edit[param]) ? [edit[param]]:edit[param]).map((o:string) => ({value:o, label:o}))}
        searchable
        contentRenderer={({props, state, methods})=>(<div className='flex max-w-[8rem] overflow-auto'><>
          <span className='w-full'>{state.values.length > 0 ? state.values.length > 1 ?  `${(state.values[0] as any).label} + ${state.values.length-1}` : (state.values[0]as any).label : 'None'} <input type="text" className={`input input-ghost input-sm focus:bg-opacity-0 focus:outline-none p-0 w-6`} onChange={methods.setSearch} placeholder=""/></span>
        </></div>)} 
        onChange={(values)=>{setEdit({...(edit as any), [param]: 
          values.length ? values.map((v:any )=>(v.label)) : 
          values[0]})}} 
        addPlaceholder={multi? "+" : ""}/> : 
        <select className="w-[8rem] !border-[hsl(var(--p))] !rounded-lg select-sm !h-5 float-right select"
          value={edit[param]} 
          onChange={(e)=>{ setEdit({ ...(edit as any), [param] : e.target.value }); alert(e.target.value) } }>
            {options.map((o: string) => (<option key={o} value={o}>
              {o}
            </option>))}
        </select>
    }
  }
  console.log(type, name)

}