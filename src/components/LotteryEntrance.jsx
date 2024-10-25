import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "@/constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "@web3uikit/core";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const dispatch = useNotification();
    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: noOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "noOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    const handleSuccess = async function (tx) {
        await tx.wait(1);
        handleNotification(tx);
        updateUi();
    };

    const handleNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        });
    };

    async function updateUi() {
        const entranceFeeOfContract = (await getEntranceFee()).toString();
        setEntranceFee(entranceFeeOfContract);
        const numPlayersCall = (await noOfPlayers()).toString();
        setNumPlayers(numPlayersCall);
        const recentWinnerCall = (await getRecentWinner());
        setRecentWinner(recentWinnerCall);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi();
        }
    }, [isWeb3Enabled]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-black">Lottery Entrance</h1>
                {!isWeb3Enabled ? (
                    <div className="text-center text-lg text-gray-700 mb-4">
                        Please connect your wallet to get started!
                    </div>
                ) : raffleAddress ? (
                    <>
                        <button
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full mb-4"
                            onClick={async () =>
                                await enterRaffle({
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(error),
                                })
                            }
                            disabled={isLoading || isFetching}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                "Enter Raffle"
                            )}
                        </button>

                        <div className="text-center text-lg mb-2 text-black">Entrance Fee: {ethers.formatUnits(entranceFee)} ETH</div>
                        <div className="text-center text-lg mb-2 text-black">Number of Players: {numPlayers}</div>
                        <div className="text-center text-lg mb-2 text-black">Recent Winner: {recentWinner}</div>
                    </>
                ) : (
                    <div className="text-center text-lg text-red-500 mb-4">
                        Unknown Network! Please connect to a supported Network.
                    </div>
                )}
            </div>
        </div>
    );
}
