import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Modal, Box, OutlinedInput, InputAdornment } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CustomCommonButton from "../CustomButton";
import {approveTokens} from "../../utils/approveTokens";
import {userTokenBalance} from "../../utils/userTokenBalance";
import {depositTokens} from "../../utils/depositTokens";
import styles from "./index.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "black",
  border: "1px solid #B3EC11",
  boxShadow: 24,
  p: 4,
};

const Alert = React.forwardRef(function AlertRender(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ConfirmationModal({
  open,
  setOpen,
  selectedToken,
  modalHeading,
}) {
  const { address } = useWeb3ModalAccount();
  const [selectedTokensList, setSelectedTokensList] = useState([]);
  const [openToaster, setOpenToaster] = useState({
    open: false,
    type: "success",
    message: "Transcation Done",
  });
  const [isTokensApproved, setIsTokensApproved] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [maxTokenBalance, setMaxTokenBalance] = useState();
  useEffect(() => {
    if(Object.keys(selectedToken).length>0 && address){
      getUserTokenBalance();
    }
  }, [selectedToken,address]);

  const getUserTokenBalance=async ()=>{
    try {
      const balance = await userTokenBalance(selectedToken.tokenAddress,selectedToken.abi,address);
      console.log("user token balance: ",ethers.utils.formatEther(balance?.toString()));
      setMaxTokenBalance(ethers.utils.formatEther(balance?.toString()));
    } catch (error) {
      console.log("Error while getting user token balance: ",error);
      setOpenToaster({
        open:true,
        type:"error",
        message:"Error while fetching token balance of user"
      })
    }
  }
  const onApproveButtonClick = async () => {
    try {
      await approveTokens(selectedToken.tokenAddress,selectedToken.vaultAddress,selectedToken.abi,tokenAmount);
      setOpenToaster({
        open: true,
        type: "success",
        message: "Tokens Approved!",
      });
      setIsTokensApproved(true);
    } catch (error) {
      console.log("Error while approving Token: ", error);
      setOpenToaster({
        open: true,
        type: "error",
        message: "Error while approving Token",
      });
    }
  };
  
  const handleConfirmTranscation = async () => {
    try {
      let {contract}= await depositTokens(selectedToken.vaultAddress,selectedToken.vaultAbi,tokenAmount);
        contract.on('Deposit',async ()=>{
          setOpenToaster(
            {
              open:true,
              type:'success',
              message:`${selectedToken.token} Deposited Successfully`,
            }
          );
        })
    } catch (error) {
      console.log("Error While Depositing Tokens: ", error);
      setOpenToaster({
        open: true,
        type: "error",
        message: `Error While Depositing Token ${selectedToken.token}`,
      });
    }
  };
  const handleCloseSnackBar = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToaster({
      ...openToaster,
      open: false,
    });
  };
  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={styles.modal_container}>
            <h2>{modalHeading}</h2>
            <div className={styles.details_container}>
              <div className={styles.token_input_field}>
                <span>
                  <b>Enter Amount</b>
                </span>
                <div className={styles.amount_input}>
                  {maxTokenBalance!==undefined?(
                    <OutlinedInput
                      sx={{ width: "100%" }}
                      id="tokenAmount"
                      size="small"
                      type={"number"}
                      onChange={(e) => {
                        setTokenAmount(e.target.value);
                      }}
                      value={tokenAmount}
                      endAdornment={
                        <InputAdornment position="end">
                          <button className={styles.max_btn} onClick={() => {setTokenAmount(maxTokenBalance)}}>
                            Max
                          </button>
                        </InputAdornment>
                      }
                      placeholder="Amount"
                    />
                  ):<span>Loading User {selectedToken.token} Balance</span>}
                </div>
              </div>
            </div>
            <div className={styles.cta_btns}>
              <CustomCommonButton onClick={onApproveButtonClick}>
                Approve Tokens
              </CustomCommonButton>
              <CustomCommonButton
                disable={!isTokensApproved}
                onClick={handleConfirmTranscation}
              >
                Confirm Transcation
              </CustomCommonButton>
            </div>
          </div>
        </Box>
      </Modal>
      {openToaster?.open && (
        <Snackbar
          open={openToaster?.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
        >
          <Alert
            onClose={handleCloseSnackBar}
            severity={openToaster?.type}
            sx={{ width: "100%", color: "white" }}
          >
            {openToaster?.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
