import { useState } from 'react'
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";


export default function Chart({state} : any) {


    return <div className="-lg:h-[400px] lg:h-[600px] p-[1px] pt-2"><div>
        <AdvancedRealTimeChart 
            theme={'dark'}
            autosize
            hide_side_toolbar 
            symbol={`${state?.exchange ? state?.exchange == 'coinbasepro' ? 'Coinbase' : state?.exchange : 'Coinbase'}:${state?.market.replace('/','').replace('-','') || 'BTCUSD'}`} 
        />
    </div></div>
}