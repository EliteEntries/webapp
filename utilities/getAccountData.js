
const ccxt = require('ccxt')

export default async function getAccountData(accounts, userData) {
  let balances = {}, positions = {}, orders = {}
  for await (const acc of accounts) {
    const exchange = acc[1]
    const account = acc[0]
    if (exchange != 'alpaca') {
      const ex = new ccxt[exchange.toLowerCase()]({
       // proxy: 'https://app.georgeanthony.net:8080/',
        apiKey:userData.api[account].key,
        secret:userData.api[account].secret
      })
      if (exchange == 'ftx') ex.headers = account !== 'main' ? {'FTX-SUBACCOUNT': userData.api[account].subaccount} : {}
      if (exchange == 'coinbasepro' || exchange == 'kucoin') ex.password = userData.api[account].password
      if (exchange == 'kucoin') ex.proxy = 'https://app.georgeanthony.net:8080/'
      if (exchange == 'ftx') ex.proxy = 'https://app.georgeanthony.net:8080/'
      
      const balance = await ex.fetchBalance().catch(e=>console.log(e))
      for (let asset in balance) {
          if (asset.toUpperCase() == asset) {
              balance[asset].usdValue = 0
              if (balance[asset].total.toFixed(6) > 0 || balance[asset].total.toFixed(6) < 0)  {
                  if (asset != 'USD' && asset != 'USDC' && (exchange != 'kucoin' || (exchange == 'kucoin' && (asset != 'USDT' && asset != 'UST')))) {
                      let ticker = await ex.fetchTicker(`${asset}/${exchange == 'kucoin' ? 'USDT' : 'USD'}`)
                      if (ticker.last) balance[asset].usdValue = ticker.last * balance[asset].total
                  } else {
                      balance[asset].usdValue = balance[asset].total
                  }
              }
          }
      }
      balances[account] = balance

      if (exchange == 'ftx') {
        let posArray = []
        let Positions = await ex.fetchPositions(undefined,{ showAvgPrice : true })
        Positions.forEach(pos => {
          if (pos.info.future == 'ETH-PERP') console.log(pos)
          if (Number(pos.info.size) != 0) {
            posArray.push({
              future: pos.info.future,
              recentPnL: Number(pos.info.recentPnl),
              size : Number(pos.info.size),
              netSize : Number(pos.info.netSize),
              estimatedLiquidationPrice : Number(pos.info.estimatedLiquidationPrice),
              recentAverageOpenPrice : Number(pos.info.recentAverageOpenPrice),
              recentBreakEvenPrice: Number(pos.info.recentBreakEvenPrice),
              notional: Number(pos.notional)
            })
            //future, recentPnL, size, netSize, estimatedLiquidationPrice, recentAverageOpenPrice 
          }
        })
        positions[account] = posArray
      } else positions[account] = []

      orders[account] = await ex.fetchOpenOrders()
    }
  }
  return {positions:positions, balances:balances, orders:orders}
}

export async function getOrders(accounts, userData, type) {
  let orders
  for await (const acc of accounts) {
    const exchange = acc[1]
    const account = acc[0]
    if (exchange != 'alpaca') {
      const ex = new ccxt[exchange.toLowerCase()]({
        proxy: 'https://app.georgeanthony.net:8080/',
        apiKey:userData.api[account].key,
        secret:userData.api[account].secret
      })
      switch (type) {
        case 'open': {
          orders[account] = await ex.fetchOpenOrders()
          break
        }
        case 'closed': {
          orders[account] = await ex.fetchClosedOrders()
          break
        }
        default : {
          orders[account] = await ex.fetchOrders()
          break
        }
      }
    }
  }
  return {orders:orders}
}