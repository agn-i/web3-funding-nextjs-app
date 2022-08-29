import { useEffect } from "react"
import { useMoralis } from "react-moralis"

const ManualHeader = () => {
    const { enableWeb3, isWeb3Enabled, isWeb3EnableLoading, account, Moralis, deactivateWeb3 } = useMoralis()
    useEffect(() => {
        if (!isWeb3Enabled && typeof window !== "undefined" && window.localStorage.getItem("connected")) {
            enableWeb3()
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null Account found")
            }
        })
    }, [])

    return (
        <nav className="p-5 border-b-2">
            <ul>
                <li className="flex flex-row">
                    {account ? (
                        <div>
                            Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                        </div>
                    ) : (
                        <button
                            onClick={async () => {
                                await enableWeb3()
                                if (typeof window !== "undefined") {
                                    window.localStorage.setItem("connected", "injected")
                                }
                            }}
                            disabled={isWeb3EnableLoading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        >
                            Connect
                        </button>
                    )}
                </li>
            </ul>
        </nav>
    )
}

export default ManualHeader
