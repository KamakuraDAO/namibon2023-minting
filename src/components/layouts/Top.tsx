
'use client';
import React, { use, useEffect, useState } from 'react';
import { ethers, Wallet } from 'ethers';
import { ABI } from '@/components/utils/ABI'
import Confetti from '../amimation/Party';

// json
import proofData from '../../assets/public.json'
import holderData from '../../assets/holder.json'
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
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<any>()
    const [tx, setTx] = useState<any>()

    const [totalSupply, setTotalSupply] = useState<number>(0)

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
                setTotalSupply(0)
            }
        }
        fetchTotalSupply()
    }, [isSuccess])

    const handlePublicMint = async () => {
        try {
            setIsLoading(true)
            setErrorMsg(null)

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

            const tx = await contract.publicMint(proof, password, walletAddress);

            setIsLoading(false)
            setTx(tx)
            setIsSuccess(true)
        } catch (error) {
            setIsLoading(false)
            setIsSuccess(false)
            setErrorMsg(error)
        }
    }

    const handleHolderMint = async () => {
        try {
            setIsLoading(true)
            setErrorMsg(null)
            const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL as string)
            const owner = new Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY as string, provider)
            const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
                ABI,
                owner
            )

            const holderProof = JSON.parse(JSON.stringify(holderData))
            const index = findHolderAddressIndex({ address: walletAddress })
            const proof = holderProof[index]

            const tx = await contract.holderMint(
                proof,
                password,
                version,
                walletAddress
            );

            await tx.wait()
            setIsLoading(false)
            setTx(tx)
            setIsSuccess(true)
        } catch (error) {
            setIsLoading(false)
            setIsSuccess(false)
            setErrorMsg(error)
        }
    }

    const isValidWalletAddress = (walletAddress: string) => {
        return ethers.isAddress(walletAddress)
    }

    const isHolderAddress = (walletAddress: HolderAddressData) => {
        return holderAddressData.some((holderAddress) => holderAddress.address === walletAddress.address)
    }

    const findHolderAddressIndex = (walletAddress: HolderAddressData) => {
        const index = holderAddressData.findIndex((holderAddress) => holderAddress.address === walletAddress.address);
        return index;
    }

    const handleWalletAddress = (walletAddress: string) => {
        if (isValidWalletAddress(walletAddress)) {
            setIsValidAddress(true)
            setWalletAddress(ethers.getAddress(walletAddress))
        } else {
            setIsValidAddress(false)
            setWalletAddress("")
        }
    }

    return (
        <>
            <div
                className="bg-white w-full px-5 h-fit flex justify-center items-center py-2"
            >
                <Image
                    src="/images/namibon23_logo_yokonaga.jpg"
                    alt="namibon23 logo"
                    width={500}
                    height={200}
                    className='rounded-lg'
                    priority={true}
                />
            </div>
            <div
                className="flex flex-col items-center w-full px-5 h-full my-5"
            >

                <a
                    className="text-gray-700 text-2xl font-bold mb-2 my-5"
                    href='https://tofunft.com/collection/namibon-nft-2023/items' target="_blank" rel="noopener noreferrer"
                >
                    なみぼんNFT (ver.2023)
                </a>

                <h2
                    className="text-gray-700 text-md font-bold"
                >
                    発行数 {totalSupply} / 100
                </h2>

                <div
                    className="text-gray-700 text-sm my-5 p-5 rounded-lg bg-white w-full md:w-1/3"
                >
                    <p className='font-bold text-center'>なみぼんNFTをゲットしよう！</p>
                    <br />
                    <p>なみぼんNFTは「<a href="https://namibon.net/" className='underline text-blue-500 font-bold'>なみおと盆踊り祭</a>」に参加した人が発行できるお祭りNFTです！今年は参加証明のPOAPとは別に、写真コレクションを無料で配布致します！</p>

                    <br />

                    <p>通常版はウォレットアドレスを持っている方は誰でも発行できます。特別版が発行できるのは、去年のなみぼんNFTを持っている方のみです。</p>

                    <br />

                    <p>当日は「去年」の写真ですが、２週間後に写真家が撮った「今年」の写真に更新される予定です！お楽しみに！</p>

                    <br />
                    <div
                        className='flex justify-center items-center my-5'
                    >
                        <Image
                            src="/images/detail.png"
                            alt="Detail"
                            width={500}
                            height={500}
                            priority={true}
                        // className='rounded-lg shadow-md'
                        />
                    </div>
                    <p>今年も楽しみましょう！</p>

                    <br />
                    <p>by 鎌倉DAO一同（メンバーも募集中！）</p>

                </div>

                <label
                    className="text-gray-700 text-sm font-bold mt-5"
                >
                    Wallet Address
                </label>
                <input
                    className='my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    type="text"
                    placeholder="ウォレットアドレス"
                    onChange={(e) => handleWalletAddress(e.target.value)}
                />

                <label
                    className='text-gray-700 text-sm font-bold'
                >
                    Password
                </label>
                <input
                    className='my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
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
                                    src="/images/VerA.jpg"
                                    alt="Namibon ver.A"
                                    width={150}
                                    height={150}
                                    className='rounded-lg shadow-md'
                                    priority={true}

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
                                    src="/images/VerB.jpg"
                                    alt="Namibon ver.B"
                                    width={150}
                                    height={150}
                                    className={`rounded-lg shadow-md ${!isHolderAddress({ address: walletAddress }) ? 'opacity-40' : ''}`}
                                    priority={true}
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
                    className={`font-bold py-2 px-5 rounded my-5 ${isValidAddress && password !== "" ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    disabled={!isValidAddress || password === ""}
                    onClick={() => isHolderAddress({ address: walletAddress }) ? handleHolderMint() : handlePublicMint()}
                >
                    {isLoading ? 'Loading...' : isHolderAddress({ address: walletAddress }) ? 'Holder Mint' : 'Public Mint'}
                </button>

                {!isSuccess && errorMsg && (
                    <>
                        <h1
                            className='text-red-500 text-xl font-bold'
                        >
                            Error
                        </h1>
                        <div
                            className='break-all text-red-500 text-sm'
                        >
                            {errorMsg.message}
                        </div>
                    </>
                )}

                {isSuccess && tx && (
                    <>
                        <h1
                            className='text-green-500 text-xl font-bold'
                        >
                            Success
                        </h1>
                        <a
                            href={`https://blockscout.com/astar/tx/${tx.hash}`}
                        >
                            トランザクションはこちら
                        </a>
                    </>
                )}

                {isSuccess && <Confetti />}
            </div>

        </>
    )
}

export default Top
