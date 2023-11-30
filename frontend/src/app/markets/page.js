"use client";

import { useState,useEffect } from "react";
import { ethers } from "ethers";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GridTable from "../../components/GridTable";
import DepositModal from "../../components/Modal";
import CCIPBnMABI from "../../ABI/ccip-bnm.json";
import MumbaiVaultAddress from "../../ABI/vault.json";
import {totalValueLocked} from "../../utils/readVaultBalance";
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
    const [tableData, setTableData] = useState([
        {
            sno:1,
            token:"CCIP-BnM",
            wallet:"$500",
            deposited:"$20",
            apy:"8.30%",
            dailyAPY:"0.02%",
            tvl:"Loading...",
            actionButton:"Deposit",
            tokenAddress:'0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40',
            abi:CCIPBnMABI,
            vaultAddress:process.env.NEXT_PUBLIC_VAULT_ADDRESS,
            vaultAbi:MumbaiVaultAddress,
            render:(row)=>(
                <div className={styles.action_btn_container}>
                <span className={styles.action_btn} onClick={()=>{
                    console.log("clicking....")
                    setIsDepositModalOpen(true)
                    setSelectedToken(row)
                }}>Deposit</span>
                <span className={styles.action_btn} onClick={()=>{}}>Withdraw</span>
                </div>
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
            tokenAddress:'0xc1c76a8c5bfde1be034bbcd930c668726e7c1987',
            actionButton:"Deposit",
            render:(row)=>(
                <div className={styles.action_btn_container}>
                <span className={styles.action_btn} onClick={()=>{
                    console.log("clicking....")
                    setIsDepositModalOpen(true)
                    setSelectedToken(row)
                }}>Deposit</span>
                <span className={styles.action_btn} onClick={()=>{}}>Withdraw</span>
                </div>
            )
        },
    ]);
    useEffect(()=>{
        getTVL();
    },[]);
    const getTVL=async()=>{
        const tokens =[...tableData];
        let tvl = await totalValueLocked(tokens[0].vaultAddress,tokens[0].vaultAbi);
        tvl=ethers.utils.formatEther(tvl?.toString());
        tvl=parseInt(Number(tvl));
        tokens[0].tvl=`$${tvl}`;
        setTableData(tokens);
    }
    return(
        <ThemeProvider theme={materialUiTheme}>
            <CssBaseline/>
            <div className={styles.markets}>
                <h1>Top Markets</h1>
                <GridTable tableHeading={tableHeading} tableData={tableData}/>
            </div>
                {isDepositModalOpen && <DepositModal selectedToken={selectedToken} open={isDepositModalOpen} setOpen={()=>{setIsDepositModalOpen(false);
                setSelectedToken();
                }} modalHeading={`Deposit ${selectedToken.token}`}/>}
        </ThemeProvider>
    )
}