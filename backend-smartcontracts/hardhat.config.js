require("@nomicfoundation/hardhat-toolbox");
// require('hardhat-deploy');
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_MUMBAI_API_KEY = process.env.ALCHEMY_MUMBAI_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const MUMBAI_POLYSCAN_API = process.env.MUMBAI_POLYSCAN_API;
const QUICK_NODE_FUJI_API_KEY=process.env.QUICK_NODE_FUJI_API_KEY;
const SNOW_TRACE_API_KEY=process.env.SNOW_TRACE_API_KEY;

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: ALCHEMY_API_KEY,
      accounts: [PRIVATE_KEY],
    },
    mumbai: {
      url: ALCHEMY_MUMBAI_API_KEY,
      accounts: [PRIVATE_KEY],
    },
    snowtrace:{
      // url:QUICK_NODE_FUJI_API_KEY,
      url:'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [PRIVATE_KEY],
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    // apiKey: SNOW_TRACE_API_KEY,
    apiKey: {
      polygonMumbai:MUMBAI_POLYSCAN_API,
      snowtrace: "snowtrace",
      sepolia:ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "snowtrace",
        chainId: 43113,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan",
          browserURL: "https://avalanche.testnet.routescan.io"
        }
      }
    ]
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true,
  },
};
