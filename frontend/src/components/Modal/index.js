import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import { Modal, Box, OutlinedInput, InputAdornment } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CustomCommonButton from "../CustomButton";
// import {getTokenAmountAfterFee} from "../../utils/getTokenAmountAfterFee";
// import {approveTokens} from "../../utils/approveTokens";
// import {getTranscationFee} from "../../utils/getTranscationFee";
// import {transferTokens} from "../../utils/transferTokens";
// import {getCCIPMessageId} from "../../service/chainlink-ccip";
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
  fromNetwork,
  toNetwork,
  selectedTokens = [],
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
  useEffect(() => {
    let onlySelectedTokens = selectedTokens?.filter(
      (token) => token?.isSelected
    );
    onlySelectedTokens = onlySelectedTokens?.map((token) => ({
      ...token,
      finalAmount: "Loading...",
    }));
    setSelectedTokensList(onlySelectedTokens);
    // getTokenRedeemAmount();
  }, [selectedTokens]);

  const onApproveButtonClick = async () => {
    try {
      for (let i = 0; i < selectedTokensList.length; i++) {
        // await approveTokens(selectedTokensList[i]?.address,fromNetwork?.ccipAddress,selectedTokensList[i]?.abi,selectedTokensList[i]?.amount);
        console.log("selectedTokensList: ", selectedTokensList);
      }
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
      let txnParams = {
        destinationChain: toNetwork?.chainSelector,
        receiver: address,
        tokens: selectedTokensList?.map((token) => token?.address),
        amounts: selectedTokensList?.map((token) =>
          ethers.utils.parseUnits(token?.amount, "ether")
        ),
      };
      //   let fees=await getTranscationFee(fromNetwork?.ccipAddress,fromNetwork?.abi,txnParams);
      txnParams.value = fees;
      console.log("txn::: ", txnParams, fromNetwork, fromNetwork);
      //   let {contract,tx} = await transferTokens(fromNetwork?.ccipAddress,fromNetwork?.abi,txnParams);
      //   contract.on('TokensTransferred',async ()=>{
      //     await navigator.clipboard.writeText(tx?.hash);
      //     setOpenToaster(
      //       {
      //         open:true,
      //         type:'info',
      //         message:<>Transcation ID copied to clipboard. See status at<Link href={selectedTokensList.length>0?`https://ccip.chain.link/tx/${tx?.hash}`:'https://ccip.chain.link/'} target='_blank'>CCIP Explorer</Link></>,
      //       }
      //     );
      //   })
    } catch (error) {
      console.log("Error While Transfering Tokens: ", error);
      setOpenToaster({
        open: true,
        type: "error",
        message: "Error While Depositing Token",
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
                        <button className={styles.max_btn} onClick={() => {}}>
                          Max
                        </button>
                      </InputAdornment>
                    }
                    placeholder="Amount"
                  />
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
