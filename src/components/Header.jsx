import { ConnectButton } from "@web3uikit/web3"

export default function Header(){
    return(
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-bold text-3xl">Decentralized Lottery</h1>

            <div className="py-2 px-2 ml-auto">
            <ConnectButton moralisAuth={false}/>
            </div>
        </div>
    )
}