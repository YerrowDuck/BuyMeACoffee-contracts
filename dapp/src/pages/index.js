import abi from '../../utils/BuyMeATea.json';
import { ethers } from 'ethers';
import Head from 'next/head';
// import Image from 'next/image';
import { Inter } from 'next/font/google';
import React, { useEffect, useState } from "react";
import styles from '@/styles/Home.module.css';
import { ChakraProvider, Box, Text, Input, Textarea, Button, VStack, Center, Divider, useToast, IconButton, Avatar, Flex, Image } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpFromBracket, faChevronRight } from '@fortawesome/free-solid-svg-icons'



const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  // Contract Address & ABI
  const contractsAddress = "0x419BB15597e86090b3467474AAd9016211530F72";
  const contractABI = abi.abi;

  // Component State
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const dummyMemos = [
    {
      name: '佐藤太郎',
      message: '素晴らしい記事をありがとうございました、感謝の印にお茶を送ります！',
      timestamp: "Mon Jun 19 2023 15:54:57 GMT+0900",
      avatar: 'https://dummyimage.com/100x100/2aebfa/fff'
    },
    {
      name: '鈴木花子',
      message: 'あなたのイラストにいつも元気をもらっています。お茶をおごりますね。',
      timestamp: "Mon Jun 19 2023 15:54:57 GMT+0900",
      avatar: 'https://dummyimage.com/100x100/3bdeda/fff'
    },
    {
      name: '高橋一郎',
      message: 'あなたのコードが大変参考になりました、感謝の印にお茶を送ります。',
      timestamp: "Mon Jun 19 2023 15:54:57 GMT+0900",
      avatar: 'https://dummyimage.com/100x100/6ccdd7/fff'
    },
  ];


  const [memos, setMemos] = useState(dummyMemos);

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  const toast = useToast();

  // Wallet connection logic
  const isWalletConnected = async () =>  {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({method: 'eth_accounts'});
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0]
        console.log("wallet is connected!" + account);
        setCurrentAccount(account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error", error);
      toast({
        title: "エラー",
        description: "MetaMaskがインストールされていません。",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if(!ethereum) {
        console.log("Please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      toast({
        title: "エラー",
        description: "MetaMaskがインストールされていません。",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  // Function for Buying Tea
  const buyTea = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeATea = new ethers.Contract(contractsAddress, contractABI, signer);

        console.log("buying tea...");
        const teaTxn = await buyMeATea.buyTea(
          name ? name : "Anonymous",
          message ? message : "Enjoy your tea!",
          { value: ethers.utils.parseEther("0.001") }
        );

        toast({
          title: "ブロックチェーン上にデータを送信中。少々お待ちください。",
          // description: "ブロックチェーン上にデータを送信中。少々お待ちください。",
          status: "info",
          duration: 5000,
          isClosable: true,
        });

        await teaTxn.wait();

        toast({
          title: "無事にクリエイターへお茶代が送られました.ありがとううう！",
          // description: `Transaction hash: ${teaTxn.hash}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        console.log("mined", teaTxn.hash);
        console.log("tea purchased successfully");

        //Clear the form fields
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeATea = new ethers.Contract(contractsAddress, contractABI, signer);

        console.log("fetching memos from the blockchain...");
        const memos = await buyMeATea.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeATea;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeATea = new ethers.Contract(contractsAddress, contractABI, signer);

      buyMeATea.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeATea) {
        buyMeATea.off("NewMemo", onNewMemo);
      }
    };
  }, []);

  // メッセージをシェアするための関数
  const shareMessage = (message) => {
    const shareText = `I just sent a tea with this message: "${message}" on Tea Money! Check it out!`;
    if (navigator.share) {
      navigator.share({
        title: 'Tea Money',
        text: shareText,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      prompt("Copy this text and share it on your social networks!", shareText);
    }
  }

  return (
    <ChakraProvider>
      <Head>
        <title>Tea Money</title>
        <meta name="description" content="Let your friends know you appreciate them with a cup of tea." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="main" className={styles.main} textAlign="center" p={4}>
        <Flex alignItems='center'>
          <Box w='60px' h='60px'>
            <Image src='/Logo.png' alt='Dan Abramov' />
          </Box>
          <Text as="h1" className={styles.title} fontSize="5xl" fontWeight="bold" mb={6}>
            Tea Money
          </Text>
        </Flex>

        {/* ここでランディングページを追加する */}
        {!currentAccount && (
          <Text fontSize="lg" color="gray.600" pb={2}>
            ウォレットを接続して、感謝のメッセージと一緒にお茶を送りましょう！
          </Text>
        )}

        {currentAccount ? (
          <VStack spacing={4}>
            <Input
              placeholder="Name"
              value={name}
              onChange={onNameChange}
              variant="filled"
            />

            <Textarea
              placeholder="Send Me a Message"
              value={message}
              onChange={onMessageChange}
              rows={3}
              variant="filled"
            />

            <Button colorScheme="teal" onClick={buyTea}>
              Send 1 Tea for 0.001 ETH
            </Button>
          </VStack>
        ) : (
          <Button colorScheme="teal" size="lg" fontWeight="bold" onClick={connectWallet}>
            <Flex align="center">
              <Text pr={2}>Connect your wallet</Text>
              <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '13px' }} />
            </Flex>
          </Button>
        )}

        {currentAccount && (
          <Box as="section" p={9}>
            <Text as="h1" fontSize="2xl" fontWeight="bold" mb={4}>
              受け取ったメモ
            </Text>
            {memos.map((memo, idx) => (
              <Box key={idx} bg="gray.100" borderRadius="md" p={4} mb={4} boxShadow="md">
                <Flex align="center" mb={2}>
                  <Avatar src={memo.avatar} mr={2}/>
                  <Text fontSize="lg" fontWeight="bold" color="teal.500">
                    {memo.name}
                  </Text>
                </Flex>
                <Box bg="gray.200" borderRadius="md" p={2} mt={2}>
                  <Text fontSize="md" color="gray.600">
                    メッセージ: {memo.message}
                  </Text>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    時刻: {memo.timestamp.toString()}
                  </Text>
                </Box>
                <Button mt={2} colorScheme="blue" onClick={() => shareMessage(memo.message)}>
                  <FontAwesomeIcon icon={faArrowUpFromBracket} />
                  このメッセージをシェア
                </Button>
              </Box>
            ))}
          </Box>
        )}

      </Box>

      <Box as="footer" textAlign="center" p={4} bg="gray.200">
        <Text fontSize="sm" color="gray.600">
          Created by @0xkumi
        </Text>
      </Box>
    </ChakraProvider>
  )
}