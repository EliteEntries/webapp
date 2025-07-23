export default function Accounts({userData} : any) {
    return <table className="table w-full">
        <caption>Accounts</caption>
        <thead>
            <th className="lg:px-8">Account</th>
            <th className="text-right lg:px-8">Total Value</th>
        </thead>
        <tbody>
            {Object.keys(userData.api).map( (account: string) => {
                return <tr key={`${account}`}>
                    <td className="lg:px-8">{account}</td>
                    <td className="text-right lg:px-8">$0.00</td>
                </tr>
            })}
        </tbody>
    </table>
}