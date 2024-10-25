"use client"
// import ManualHeader from "../components/ManualHeader"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import LotteryEntrance from "@/components/LotteryEntrance"
import Head from "next/head"
import { NotificationProvider } from "@web3uikit/core"
import "../styles/page.css"

export default function Home() {
    return (
        <div className="">
            <Head>
                <title>Smart Contract Lottery</title>
            </Head>
            <MoralisProvider appId="" initializeOnMount={false}>
                <NotificationProvider>
                    {<Header />}
                    {<LotteryEntrance />}
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}
