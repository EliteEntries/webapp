export default function Watchlist({userData} : any) {
    return <table className="table w-full">
        <caption>Watchlist</caption>
        <thead>
            <th className="lg:px-8">Asset</th>
            <th className="text-right lg:px-8">Price</th>
        </thead>
        <tbody>
            {userData.watchlist.map( (u: number) => {
                return <tr key={`watchlist-${u}`}>
                    <td className="lg:px-8">{u}</td>
                    <td className="text-right lg:px-8">$0.00</td>
                </tr>
            })}
        </tbody>
    </table>
}