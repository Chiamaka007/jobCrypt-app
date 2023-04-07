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
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [balance, setBalance] = useState(null);

  const [stakingAmount, setStakingAmount] = useState(0);
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

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contractAddress = "0xAB8b5C5c17d84836cba8A86A083052Ff7d569fAC";
      const abi = Abi;
      const contract = new ethers.Contract(contractAddress, abi, signer);
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      setIsConnected(true);

      const balance = await contract.balanceOf(signer.getAddress());
      setBalance(balance);
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

  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      {/* Call the connectWallet function we just wrote when the button is clicked */}
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );
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

  const stakeFunds = async () => {
    if (!provider || !contract || stakingAmount <= 0) {
      return;
    }

    const signer = provider.getSigner();
    const balance = await signer.getBalance();
    if (balance.lt(stakingAmount)) {
      console.error("Insufficient balance");
      setStakingAmount("0.00123");
      return;
    }

    try {
      const transaction = await contract.stake({ value: stakingAmount });
      await transaction.wait();
      console.log("Staked successfully");
    } catch (err) {
      console.error(err);
    }
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
              <p
                className="bg-black rounded-full text-white"
                onClick={stakeFunds}
              >
                Approve 1 JCTUSDT
              </p>
              <p>Approve first to stake</p>
            </div>
          ) : (
            ""
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
            <Link href="https://sepolia-faucet.pk910.de">
              JC TEST USDC FAUCET{" "}
            </Link>
            <Link href="https://sepolia-faucet.pk910.de">For posting</Link>
            <Link href="https://sepolia-faucet.pk910.de">
              JC TEST USDC FAUCET{" "}
            </Link>
            <Link href="https://sepolia-faucet.pk910.de">For posting</Link>
            <Link href="https://sepolia-faucet.pk910.de">GAS FAUCET </Link>
            <Link href="https://sepolia-faucet.pk910.de">For gas</Link>
          </div>
          <div className="flex justify-center font-bold mt-10 ">
            <div>
              <button>
                NOT STAKED - To Apply for jobs, please Stake :: 1 JCTUSDT
              </button>
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
              <p className="mt-5 text-sm">
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
                  <h2 className="text-xl font-bold text-blue-500 text-center">
                    {" "}
                    Apply Here
                  </h2>
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
