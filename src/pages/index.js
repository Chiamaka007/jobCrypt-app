import { Abi } from "@/utils/abi";
import { Icon } from "@iconify/react";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const networks = {
  "0xaa36a7": "Sepolia Testnet",
};

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  // const [provider, setProvider] = useState(null);
  // const [contract, setContract] = useState(null);
  // const [signer, setSigner] = useState(null);
  const [balance, setBalance] = useState(null);
  const [stakeBalance, setStakeBalance] = useState(null);
  const [applyBalance, setApplyBalance] = useState(null);

  const [depositValue, setDepositValue] = useState("0.000123");
  const [stakeValue, setStakeValue] = useState("0.000456");
  const [applyValue, setApplyValue] = useState("0.000789");
  const [network, setNetwork] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setIsConnected(true);
    } catch (error) {
      console.log(error);
    }

    if (window.ethereum) {
      try {
        // Try to switch to the Mumbai testnet
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // Check networks.js for hexadecimal network ids
        });
      } catch (error) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "sepolia Testnet",
                  rpcUrls: ["https://rpc.ankr.com/eth_sepolia"],
                  nativeCurrency: {
                    name: "Sepolia Eth",
                    symbol: "Eth",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert(
        "MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html"
      );
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    setCurrentAccount(accounts);
    // if (accounts) {
    //   const account = accounts;
    //   console.log("Found an authorized account:", account);
    //   setCurrentAccount(account);
    // } else {
    //   console.log("No authorized account found");
    // }

    const chainId = await ethereum.request({ method: "eth_chainId" });
    setNetwork(networks[chainId]);

    ethereum.on("chainChanged", handleChainChanged);

    // Reload the page when they change networks
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

  const handleDepositChange = (e) => {
    setDepositValue(e.target.value);
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = "0x6e3B05205Fe4C565F957734E6f7Fe005974AA8D5";
    const abi = Abi;
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const ethValue = ethers.utils.parseEther(depositValue);
    const deposit = await contract.ApproveJctUsdt({ value: ethValue });
    await deposit.wait();
    const balance = await provider.getBalance(contractAddress);
    setBalance(ethers.utils.formatEther(balance));
  };

  const handleStakeChange = (e) => {
    setStakeValue(e.target.value);
  };

  const handleStakeSubmit = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = "0x6e3B05205Fe4C565F957734E6f7Fe005974AA8D5";
    const abi = Abi;
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const ethValue = ethers.utils.parseEther(stakeValue);
    const stake = await contract.stake({ value: ethValue });
    await stake.wait();
    const stakeBalance = await provider.getBalance(contractAddress);
    console.log(stakeBalance);
    setStakeBalance(ethers.utils.formatEther(stakeBalance));
  };
  const handleApplyChange = (e) => {
    setApplyValue(e.target.value);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = "0x6e3B05205Fe4C565F957734E6f7Fe005974AA8D5";
    const abi = Abi;
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const ethValue = ethers.utils.parseEther(applyValue);
    const apply = await contract.applyForJob({ value: ethValue });
    await apply.wait();
    const applyBalance = await provider.getBalance(contractAddress);
    console.log(applyBalance);
    setApplyBalance(ethers.utils.formatEther(applyBalance));
  };
  return (
    <>
      <div className="text-xl mt-10 ">
        <div className="">
          <div className="flex items-center justify-end mb-2 gap-3 mr-[20rem]">
            <Icon icon="mingcute:youtube-line" />
            <Link href="https://www.youtube.com/watch?v=iW9EAOCsgJc&feature=youtu.be">
              How to use JobCrypt
            </Link>
          </div>
          <div className="flex items-center justify-end gap-3 mr-[14.5rem]">
            <Icon icon="mdi:information-slab-circle" />
            <p
              onClick={connectWallet}
              className="text-white  cursor-pointer font-semibold rounded-full bg-black bg-opacity-80"
            >
              {isConnected === true
                ? " Web3 connected"
                : "Click to Connect to Metamask"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center mx-20 just gap-20 mt-2">
        <div className="flex items-center justify-between w-3/5">
          <div className="">
            <Image src="/Images/jclogo.svg" width={50} height={100} />
            <p className="font-bold text-lg">Job Crypt</p>
          </div>
          <div className="flex items-center gap-20 text-xl">
            <Link href="https://twitter.com/JobCrypt">
              <Icon icon="ph:twitter-logo" width={20} />
            </Link>
            <Link href="https://discord.com/invite/JgBEEtaSmD">
              <Icon icon="ic:baseline-discord" width={20} />
            </Link>
            <Link href="https://www.tiktok.com/@jobcrypt">
              <Icon icon="ic:sharp-tiktok" width={20} />
            </Link>
            <Link href="https://www.youtube.com/channel/UCEX4iMGm6HXD9kP5MiEieAQ">
              <Icon icon="ri:youtube-fill" width={20} />
            </Link>
          </div>
        </div>
        <div className="w-2/5 border-[1px] rounded-md p-10">
          <p className="text-center">Select Dashboard</p>
          <p className="text-center mt-7 uppercase text-lg ">
            Need Crypto?{" "}
            <span className="text-red-500"> TEST NET USE FAUCET!!</span>
          </p>
          {isConnected == true ? (
            <div className="flex justify-between">
              {balance ? (
                <form onSubmit={handleStakeSubmit}>
                  <div className="mb-3">
                    <input
                      type="number"
                      className="form-control hidden"
                      disabled
                      placeholder="0"
                      onChange={handleStakeChange}
                      value={stakeValue}
                    />
                  </div>
                  <span className="flex justify-between ">
                    <button className=" ">Approve Now Stake</button>
                    <button
                      type="submit"
                      className="border-2 border-black rounded-full px-10"
                    >
                      Stake
                    </button>
                  </span>
                </form>
              ) : (
                <form onSubmit={handleDepositSubmit}>
                  <div className="mb-3">
                    <input
                      type="number"
                      className="form-control hidden"
                      disabled
                      placeholder="0"
                      onChange={handleDepositChange}
                      value={depositValue}
                    />
                  </div>
                  <span className="flex justify-between ">
                    <button
                      type="submit"
                      className=" rounded-full text-white bg-black p-1"
                    >
                      Approve 1 JctUsdt
                    </button>
                    <button className="btn btn-success">
                      Approve first to stake
                    </button>
                  </span>
                </form>
              )}
            </div>
          ) : (
            "unstake"
          )}
          <span className="flex justify-center divide-x-2 divide-black text-lg ">
            <Link href="/employer" className="pr-5">
              Employer
            </Link>
            <Link href="/job-seeker">Job Seeker</Link>
          </span>
        </div>
      </div>
      {isConnected == true ? (
        <>
          <div className="flex justify-center text-xl gap-1 mt-2 font-semibold">
            <Link
              href="https://sepolia-faucet.pk910.de"
              className="flex items-center"
            >
              <Icon icon="fa6-solid:faucet-drip" /> JC TEST USDC FAUCET{" "}
            </Link>
            <Link
              href="https://sepolia-faucet.pk910.de"
              className="text-green-500"
            >
              For posting
            </Link>
            <Link
              href="https://sepolia-faucet.pk910.de"
              className="flex items-center"
            >
              <Icon icon="fa6-solid:faucet-drip" />
              JC TEST USDC FAUCET{" "}
            </Link>
            <Link href="https://sepolia-faucet.pk910.de"> For Staking</Link>
            <Link
              href="https://sepolia-faucet.pk910.de"
              className="flex items-center"
            >
              {" "}
              <Icon icon="fa6-solid:faucet-drip" />
              GAS FAUCET{" "}
            </Link>
            <Link
              href="https://sepolia-faucet.pk910.de"
              className="text-yellow-500"
            >
              For gas
            </Link>
          </div>
          <div className="flex justify-center font-bold mt-10 ">
            <div>
              {stakeBalance ? (
                <button className="text-center">STAKED 1 JCTUSDT</button>
              ) : (
                <button>
                  NOT STAKED - To Apply for jobs, please Stake :: 1 JCTUSDT
                </button>
              )}
              <p>Connected Wallet:: {currentAccount} </p>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      <div className="  mt-40 ">
        <div className="border-[1px] rounded-md w-[500px] py-10 px-5 mx-60 flex justify-center">
          {isConnected ? (
            <div>
              <h1 className="font-bold text-lg text-center">
                Social media manager
              </h1>
              <p className="font-bold text-xl mt-5 text-center">Job Crypt</p>
              <p className="mt-10 text-sm">
                JobCrypt is the first fully decentralized Job board hosted on
                the blockchain and web3
              </p>
              <p className="mt-5 text-sm font-bold">
                Job Location : Geo-Remote | Work Type : Full-time | Payment Type
                : crypto | Location Type : Geo-Remote | Location Support : N/A
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="flex justify-center gap-2 items-start mt-2">
          <div className="border-[1px] rounded-md w-[500px] px-5 py-10 ">
            <h2 className="font-bold  text-2xl text-center"> About the Role</h2>
            {isConnected ? (
              <span>
                <p>
                  Looking for an Experienced socialedia manager with atleast two
                  years experience
                </p>
                <p className="font-bold mt-5">
                  First posted : Thu Apr 06 2023 11:49:36 GMT+0100 (West Africa
                  Standard Time)
                </p>
              </span>
            ) : (
              ""
            )}
          </div>
          <div>
            <div className="w-[350px] py-10 border-[1px] rounded-md ">
              <p className=" text-center font-bold">Key Skills</p>
              {isConnected ? (
                <span>
                  <p className="text-center"> Social media management skill</p>
                  {applyBalance ? (
                    <p className="font-bold text-green-500 text-center">
                      Apply Details: hr@jobcrypt.com
                    </p>
                  ) : (
                    <div className="flex justify-center">
                      <form onSubmit={handleApplySubmit}>
                        <div className="mb-3">
                          <input
                            type="number"
                            className="form-control hidden"
                            disabled
                            placeholder="0"
                            onChange={handleApplyChange}
                            value={applyValue}
                          />
                        </div>

                        <button
                          type="submit"
                          className="text-2xl text-blue-500"
                        >
                          Apply Here
                        </button>
                      </form>
                    </div>
                  )}
                </span>
              ) : (
                ""
              )}
              <div className="flex items-center text-center mt-10 justify-center  ">
                <Icon icon="mingcute:youtube-line" />
                <Link href="https://www.youtube.com/watch?v=iW9EAOCsgJc&feature=youtu.be">
                  How to Apply with JobCrypt
                </Link>
              </div>
            </div>
            <div className="w-[350px] py-10 border-[1px] rounded-md mt-2 ">
              <p className=" text-center font-bold">Job Categories</p>
              {applyBalance ? <p className="text-center">Social</p> : ""}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="bg-black text-lg py-2 px-4 bg-opacity-80 mt-5 text-white font-bold rounded-full">
            {" "}
            Back
          </button>
        </div>
      </div>
      <div className="my-40">
        <h2 className="font-bold text-4xl text-center">Ready to Start?</h2>
        <p className="text-2xl text-center mt-3">
          Get the latest jobs direct to your inbox
        </p>
        <div className="flex justify-center mt-10">
          <form action="">
            <div className="w-[600px]">
              <p className="text-sm pb-1">
                Email Address <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                placeholder="Enter your Email"
                className="w-full p-2  bg-[#EBEBEB] border-[#CBCDCF] border-[1px] rounded-sm"
              />
            </div>
            <div className="flex justify-center mt-7">
              <button className="bg-black py-2 px-40 rounded-full bg-opacity-90 text-center font-bold text-lg text-white">
                Join Alert List
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
