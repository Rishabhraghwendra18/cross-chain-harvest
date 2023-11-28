"use client";

import Image from "next/image";
import styles from "./page.module.css";
import CustomCommonButton from "../components/CustomButton";
import BubbleComponent from "../components/BubblesAnimation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ethereumLogo from "../assets/ethereum-logo.svg";
import polygonLogo from "../assets/polygon-logo.svg";
import avalancheLogo from "../assets/avalanche-logo.png";
import CssBaseline from "@mui/material/CssBaseline";

const materialUiTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
    },
  },
  typography: {
    fontFamily: ["Outfit", "sans-serif"].join(","),
  },
});

const markets=[
  {
    tokenName:'CCIP-BnM',
    apr:8.30,
    dailyApr:0.002,
  },
  {
    tokenName:'CCIP-LnM',
    apr:10.30,
    dailyApr:0.02,
  },
  {
    tokenName:'USDC',
    apr:6.30,
    dailyApr:0.0005,
    disabled:true
  },
  {
    tokenName:'USDT',
    apr:4.30,
    dailyApr:0.0,
    disabled:true
  },
  {
    tokenName:'MATIC',
    apr:10.30,
    dailyApr:0.05,
    disabled:true
  },
  {
    tokenName:'LINK',
    apr:15.30,
    dailyApr:0.09,
    disabled:true
  },
  {
    tokenName:'DAI',
    apr:7.9,
    dailyApr:0.004,
    disabled:true
  },
  {
    tokenName:'XRP',
    apr:5.5,
    dailyApr:0.002,
    disabled:true
  },
];
const networksList = [
  {
    logo: ethereumLogo,
    name: "Ethereum",
  },
  {
    logo: polygonLogo,
    name: "Polygon",
  },
  {
    logo: avalancheLogo,
    name: "Avalanche",
  },
];
export default function Home() {
  return (
    <ThemeProvider theme={materialUiTheme}>
      <CssBaseline />

      <div
        className={`${styles.hero_section} ${styles.height100}`}
        style={{ position: "relative" }}
      >
        <h1>
          A Groundbreaking DeFi App That Optimizes Yields <br></br>Across
          Multiple Blockchains.
        </h1>
        <CustomCommonButton
          sx={{ width: "13rem", height: "4rem", fontSize: "1.3rem" }}
        >
          Enter App
        </CustomCommonButton>
        <BubbleComponent />
      </div>
      <div className={styles.supported_networks}>
        <h2 className={styles.supported_networks_title}>Supported Networks</h2>
        <div className={styles.networks_list}>
          {networksList.map((network, index) => (
            <div className={styles.network} key={index}>
              <Image
                priority
                src={network.logo}
                width={73}
                height={68}
                className={styles.networkLogo}
              />
              <span>{network.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.markets} ${styles.height100}`}>
        <h2>
          CrossChain Harvest <span style={{ color: "#B3EC11" }}>Markets</span>
        </h2>

        <div className={styles.market_container}>
          {markets.map((market,index)=>(
          <div className={styles.token_market} key={index}>
            <div className={styles.coverup}></div>
            <h4>{market.tokenName}</h4>
            <hr style={{color:'grey'}}></hr>
            <div className={styles.apr}>
              <span>APR: {market.apr}%</span>
              <span>Daily: {market.dailyApr}%</span>
            </div>
          </div>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}
