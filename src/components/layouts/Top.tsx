
'use client';
import React, { use, useEffect, useState } from 'react';
import { ethers, Wallet } from 'ethers';
import proofData from '../../assets/proof.json'
import { ABI } from '@/components/utils/ABI'

type Proof = {
    tokenID: number,
    password: number
}

const Top = () => {

    const [walletAddress, setWalletAddress] = useState("");
    const [password, setPassword] = useState("");
    const [isValidAddress, setIsValidAddress] = useState(false);
    const [data, setData] = useState<Proof[]>([])

    const handleMint = async () => {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL as string)
        const owner = new Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY as string, provider)

        console.log(process.env.NEXT_PUBLIC_RPC_URL, owner)
        console.log(provider)
        const contract = new ethers.BaseContract(
            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
            ABI,
            owner
        )
        console.log(contract)
        const proof = proofData["1"]
        console.log(proof)

        const tx = await contract.publicMint(proof, password, walletAddress);

        console.log(tx);
    }

    const isValidWalletAddress = (walletAddress: string) => {
        const addressPattern = /^0x[a-fA-F0-9]{40}$/;
        return addressPattern.test(walletAddress);
    }

    const handleWalletAddress = (walletAddress: string) => {
        if (isValidWalletAddress(walletAddress)) {
            setIsValidAddress(true)
            setWalletAddress(walletAddress)
        } else {
            setIsValidAddress(false)
            setWalletAddress("")
        }
    }

    return (
        <>
            <div
                className="flex flex-col justify-center items-center w-full"
            >

                <h1
                    className="text-gray-700 text-2xl font-bold mb-2"
                >
                    Namib
                </h1>

                <p
                    className="text-gray-700 text-sm font-bold mb-2"
                >
                    このNFTは、番目のNFTです。
                </p>


                <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                >
                    Wallet Address
                </label>
                <input
                    className="border border-gray-400 rounded-lg px-4 py-2 mt-2 mb-4"
                    type="text"
                    placeholder="Wallet Address"
                    onChange={(e) => handleWalletAddress(e.target.value)}
                />

                <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                >
                    Password
                </label>
                <input
                    className='border border-gray-400 rounded-lg px-4 py-2 mt-2 mb-4'
                    type="text"
                    placeholder="合言葉"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className={`font-bold py-2 px-4 rounded ${isValidAddress ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    disabled={!isValidAddress}
                    onClick={handleMint}
                >
                    Mint
                </button>
            </div>

        </>
    )
}

export default Top
