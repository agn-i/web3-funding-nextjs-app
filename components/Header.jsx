import { ConnectButton } from "@web3uikit/web3"

const Header = () => {
    return (
        <nav className="flex flex-row p-5 border-b-2 justify-between items-center">
            <h1 className="font-bold text-xl text-white">Fund Web3 Dapps</h1>
            <div>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}

export default Header
