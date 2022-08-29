import { contractAddresses, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "@web3uikit/core"
import { ethers } from "ethers"
import { useEffect, useState } from "react"

const Contribute = () => {
    const { isWeb3Enabled, chainId: chainIdHex, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const fundingContractAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [amount, setAmount] = useState("0")
    const [amountRaised, setAmountRaised] = useState("0")
    const [owner, setOwner] = useState()

    const dispatch = useNotification()

    const {
        runContractFunction: fund,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi,
        contractAddress: fundingContractAddress,
        functionName: "fund",
        msgValue: ethers.utils.parseEther(amount || "0"),
        params: {},
    })

    const { runContractFunction: getBalance } = useWeb3Contract({
        abi,
        contractAddress: fundingContractAddress,
        functionName: "getBalance",
        params: {},
    })

    const { runContractFunction: getOwner } = useWeb3Contract({
        abi,
        contractAddress: fundingContractAddress,
        functionName: "getOwner",
        params: {},
    })

    const { runContractFunction: withdraw } = useWeb3Contract({
        abi,
        contractAddress: fundingContractAddress,
        functionName: "withdraw",
        params: {},
    })

    const updateUI = async () => {
        const contractBalanceFromCall = (await getBalance())?.toString()
        const getOwnerFromCall = await getOwner()
        setAmountRaised(contractBalanceFromCall)
        setOwner(getOwnerFromCall)
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "bottomR",
        })
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        await handleNewNotification(tx)
        await updateUI()
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWeb3Enabled])

    return (
        <div className="flex flex-col space-y-5">
            <form className="text-white flex flex-col min-h-full space-y-10">
                <label className="block font-medium text-3xl text-center underline decoration-2">Enter amount </label>
                <input
                    type="number"
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-50 border border-gray-300 rounded-lg text-2xl text-black p-2"
                />
                <button
                    type="submit"
                    onClick={async () =>
                        await fund({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }
                    disabled={isFetching || isLoading}
                    className="px-8 py-3 rounded-full bg-rose-400 hover:bg-rose-600"
                >
                    Contribute
                </button>
            </form>
            {amountRaised != "0" && (
                <div>
                    <h4 className="text-white text-lg text-center">
                        Ether raised : {ethers.utils.formatEther(amountRaised)} ETH
                    </h4>
                </div>
            )}
            {amountRaised != "0" && owner?.toLowerCase() == account.toLowerCase() && (
                <div className="text-center text-white">
                    <button
                        className="px-4 py-2 rounded-full bg-rose-400 hover:bg-rose-600"
                        onClick={async () => {
                            await withdraw({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Withdraw
                    </button>
                </div>
            )}
        </div>
    )
}

export default Contribute
