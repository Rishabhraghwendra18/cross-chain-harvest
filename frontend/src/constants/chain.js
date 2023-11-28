const walletConnectChain = {
    mainnet: {
      chainId: 1,
      name: "Ethereum",
      currency: "ETH",
      explorerUrl: "https://etherscan.io",
      rpcUrl: "https://cloudflare-eth.com",
    },
    mumbai: {
      chainId: 80001,
      name: "Polygon Mumbai Testnet",
      currency: "MATIC",
      explorerUrl: "https://polygonscan.com",
      rpcUrl: "https://polygon-mumbai-bor.publicnode.com",
    },
    avalancheFuji: {
      chainId: 43114,
      name: "Avalanche Fuji Testnet",
      currency: "AVAX",
      explorerUrl: "https://explorer.avax-test.network",
      rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    optimismGoerli: {
      chainId: 42311,
      name: "Optimism Goerli Testnet",
      currency: "ETH",
      explorerUrl: "https://optimism-explorer.vercel.app",
      rpcUrl: "https://optimism-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    },
    arbitrumGoerli: {
      chainId: 729,
      name: "Arbitrum Goerli Testnet",
      currency: "ETH",
      explorerUrl: "https://arbiscan.io/testnet",
      rpcUrl: "https://arb1-goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    },
  };
  export {walletConnectChain}