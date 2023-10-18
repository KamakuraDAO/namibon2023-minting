
'use client';
import React, { use, useEffect, useState } from 'react';
import { ethers, Wallet } from 'ethers';
import { ABI } from '@/components/utils/ABI'

// json
import proofData from '../../assets/public.json'
import holderAddressData from '../../assets/holder-address.json'

import Image from 'next/image';

interface HolderAddressData {
    address: string
}

const Top = () => {

    const [walletAddress, setWalletAddress] = useState("");
    const [password, setPassword] = useState<string>("");
    const [isValidAddress, setIsValidAddress] = useState<boolean>(false);
    const [version, setVersion] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<any>()

    const [totalSupply, setTotalSupply] = useState<number>(0)

    console.log('isValidAddress:', isValidAddress);
    console.log('password:', password);
    console.log('Condition Result:', !isValidAddress || password === "");
    
    useEffect(() => {
        const fetchTotalSupply = async () => {
            try {
                const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL as string)
                const contract = new ethers.Contract(
                    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
                    ABI,
                    provider
                )

                const supply = await contract.totalSupply()

                setTotalSupply(ethers.toNumber(supply))
            } catch (error) {
                console.log(error)
            }
        }
        fetchTotalSupply()
    }, [])

    const handlePublicMint = async () => {
        try {
            setIsLoading(true)
            const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL as string)
            const owner = new Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY as string, provider)
            const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
                ABI,
                owner
            )

            const supply = await contract.totalSupply()

            const proofjson = JSON.parse(JSON.stringify(proofData))
            const proof = proofjson[ethers.toNumber(supply)]

            console.log(proof)

            const tx = await contract.publicMint(proof, password, walletAddress);

            await tx.wait()
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            setErrorMsg(error)
        }
    }

    const handleHolderMint = async () => {
        try {
            setIsLoading(true)
            const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL as string)
            const owner = new Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY as string, provider)
            const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
                ABI,
                owner
            )

            const supply = await contract.totalSupply()

            const proofjson = JSON.parse(JSON.stringify(proofData))
            const proof = proofjson[ethers.toNumber(supply)]

            console.log(proof)

            const tx = await contract.holderMint(
                proof, 
                password, 
                version,
                walletAddress
            );

            await tx.wait()
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            setErrorMsg(error)
        }
    }

    const isValidWalletAddress = (walletAddress: string) => {
        return ethers.isAddress(walletAddress)
    }

    const isHolderAddress = (walletAddress: HolderAddressData) => {
        return holderAddressData.some((holderAddress) => holderAddress.address === walletAddress.address)
    }

    const handleWalletAddress = (walletAddress: string) => {
        if (isValidWalletAddress(walletAddress)) {
            setIsValidAddress(true)
            console.log(walletAddress)
            console.log(ethers.getAddress(walletAddress))
            setWalletAddress(ethers.getAddress(walletAddress))
        } else {
            setIsValidAddress(false)
            setWalletAddress("")
        }
    }

    return (
        <>
            <div
                className="flex flex-col justify-center items-center w-full h-screen px-5"
            >
                <Image
                    src="/images/namibon23_logo_yokonaga.jpg"
                    alt="namibon23 logo"
                    width={500}
                    height={200}
                    className='rounded-lg'
                />
                <h1
                    className="text-gray-700 text-xl font-bold mb-2 my-5"
                >
                    なみぼんNFT (ver.2023)
                </h1>

                <h2
                    className="text-gray-700 text-md font-bold"
                >
                    発行数 {totalSupply} / 100
                </h2>

                <div
                    className="text-gray-700 text-sm my-5 w-90 p-3 rounded-lg bg-white"
                >
                    <p className='font-bold text-center'>ようこそ！</p>
                    <br />
                    <p>今年もお祭りNFT発行します！今回は去年大好評だった稲村ケ崎から見える絶景の写真コレクションとなっています。</p>
                    
                    <p>通常版はウォレットアドレスを持っている方は誰でも発行できます。特別版が発行できるのは、去年のなみぼんNFTを持っている方のみです。</p>

                    <br />
                    <p>今年も楽しみましょう！</p>

                    <p>by 鎌倉DAO一同（メンバーも募集中）</p>
                </div>


                <input
                    className="border border-gray-400 rounded-lg px-4 py-2 mt-2 mb-4 hover:border-gray-500 focus:border-gray-500 focus:outline-none"
                    type="text"
                    placeholder="ウォレットアドレス"
                    onChange={(e) => handleWalletAddress(e.target.value)}
                />

                <input
                    className="border border-gray-400 rounded-lg px-4 py-2 mt-2 mb-4 hover:border-gray-500 focus:border-gray-500 focus:outline-none"
                    type="text"
                    placeholder="あいことば"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div
                    className='flex justify-center items-center w-full space-x-10'
                >

                    <div>
                        <p
                            className='text-center my-3'
                        >
                            通常版
                        </p>
                        <div
                            className={`relative`}
                        >
                            <button
                                onClick={() => setVersion(0)}
                            >
                                <Image
                                    src="/images/V0.png"
                                    alt="Picture of the author"
                                    width={150}
                                    height={150}
                                    className='rounded-lg shadow-md'
                                />
                            {version === 0 && (
                                <Image
                                    src="/icons/badge.svg"
                                    alt="Picture of the author"
                                    width={25}
                                    height={25}
                                    className={`absolute -top-3 -right-3`}
                                />
                            )}

                            </button>
                        </div>

                    </div>

                    <div>
                        <p
                            className='text-center my-3'
                        >
                            特別版
                        </p>

                        <div
                        >
                        <button    
                            className='relative'               
                            onClick={() => setVersion(1)}
                            disabled={!isHolderAddress({ address: walletAddress })}
                        >
                            <Image
                                src="/images/V1.png"
                                alt="Picture of the author"
                                width={150}
                                height={150}
                                className={`rounded-lg shadow-md ${!isHolderAddress({ address: walletAddress }) ? 'opacity-40' : ''}`}
                            />

                            {/* badge */}
                            {version === 1 && isHolderAddress({ address: walletAddress }) && (
                                <Image
                                    src="/icons/badge.svg"
                                    alt="Picture of the author"
                                    width={25}
                                    height={25}
                                    className={`absolute -top-3 -right-3`}
                                />
                            )}
                        </button>
                        
                        </div>

                    </div>
                </div>

                <button
                    className={`font-bold py-2 px-5 rounded my-5 ${isValidAddress && password !== ""? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    disabled={!isValidAddress || password === ""}
                    onClick={() => isHolderAddress({ address: walletAddress }) ? handleHolderMint() : handlePublicMint()}
                >
                    {isLoading ? 'Loading...' : isHolderAddress({ address: walletAddress }) ? 'Holder Mint' : 'Public Mint'}
                </button>

                {errorMsg && (
                    <p
                        className="text-red-500 text-sm m-4"
                    >
                        {errorMsg.message}
                    </p>
                )}
            </div>

        </>
    )
}

export default Top
