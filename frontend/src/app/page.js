"use client";

import Image from 'next/image'
import styles from './page.module.css';
import CustomCommonButton from "../components/CustomButton";
import BubbleComponent from "../components/BubblesAnimation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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

export default function Home() {
  return (
    <ThemeProvider theme={materialUiTheme}>
      <CssBaseline />

      <div className={styles.hero_section} style={{position:'relative'}}>
        <h1>
        A Groundbreaking DeFi App That Optimizes Yields <br></br>Across Multiple Blockchains.
        </h1>
      <CustomCommonButton sx={{ width: "13rem", height: "4rem", fontSize: "1.3rem" }}>Enter App</CustomCommonButton>
      <BubbleComponent/>
      </div>
      <div>helllllo</div>
    </ThemeProvider>
  )
}
