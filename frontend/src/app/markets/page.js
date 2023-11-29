"use client";

import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GridTable from "../../components/GridTable";
import DepositModal from "../../components/Modal";
import styles from "./page.module.css";

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

const tableHeading=[
    {
        label:"S.No",
        key:"sno"
    },
    {
        label:"Token",
        key:"token"
    },
    {
        label:"Wallet",
        key:"wallet"
    },
    {
        label:"Deposited",
        key:"desposited"
    },
    {
        label:"APY",
        key:"apy"
    },
    {
        label:"Daily APY",
        key:"dailyApy"
    },
    {
        label:"TVL",
        key:"tvl"
    },
    {
        label:"Action Button",
        key:"actionButton"
    },
];
export default function Markets() {
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState();
    const tableData=[
        {
            sno:1,
            token:"CCIP-BnM",
            wallet:"$500",
            deposited:"$20",
            apy:"8.30%",
            dailyAPY:"0.02%",
            tvl:"$20",
            actionButton:"Deposit",
            render:()=>(
                <span className={styles.action_btn}>Deposit</span>
            )
        },
        {
            sno:2,
            token:"CCIP-LnM",
            wallet:"$600",
            deposited:"$10",
            apy:"10.30%",
            dailyAPY:"0.05%",
            tvl:"$10",
            actionButton:"Deposit",
            render:(row)=>(
                <span className={styles.action_btn} onClick={()=>{
                    console.log("clicking....")
                    setIsDepositModalOpen(true)
                    setSelectedToken(row)
                }}>Deposit</span>
            )
        },
    ];
    return(
        <ThemeProvider theme={materialUiTheme}>
            <CssBaseline/>
            <div className={styles.markets}>
                <h1>Top Markets</h1>
                <GridTable tableHeading={tableHeading} tableData={tableData}/>
            </div>
                {isDepositModalOpen && <DepositModal open={isDepositModalOpen} setOpen={()=>{setIsDepositModalOpen(false);
                setSelectedToken();
                }} modalHeading={`Deposit ${selectedToken.token}`}/>}
        </ThemeProvider>
    )
}