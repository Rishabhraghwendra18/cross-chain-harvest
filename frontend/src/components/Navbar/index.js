'use client'

import styles from "./index.module.css";
import { usePathname,useRouter } from 'next/navigation'
import {walletConnectChain} from "../../constants/chain";
import { useWeb3Modal,useWeb3ModalAccount,useDisconnect } from '@web3modal/ethers5/react'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'
import Link from 'next/link';
import CustomButton from "../CustomButton";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const walletConnectMetaData = {
  name: 'UniLink',
  description: 'One stop to bridge all your cryptos in single click',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
}
createWeb3Modal({
  ethersConfig: defaultConfig({ 
    walletConnectMetaData,
    defaultChainId: 80001,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
  }),
  chains: [walletConnectChain.mumbai],
  projectId
});

function Navbar() {
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()
  const { address } = useWeb3ModalAccount();
  const pathname = usePathname();
  const { push } = useRouter();
  const onNavbarButtonClick=()=>{
    if(pathname === "/"){
      push('/bridge');
      return;
    }
    open();
  }
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_contents}>
        <Link href="/">
          <span className={styles.logo} style={{color:'white'}}>CrossChain</span>
          {" "}
          <span className={styles.logo} style={{ color: "#B3EC11" }}>
            Harvest
          </span>
        </Link>

        <div className={styles.navItems}>
          <Link href="/" className={pathname==='/' ? styles.active_link:styles.unactive_link}>Home</Link>
          <Link href="/markets" className={pathname==='/markets' ? styles.active_link:styles.unactive_link}>Markets</Link>
          <span className={styles.unactive_link}>Team</span>
        </div>
        <div>
          {address?<CustomButton onClick={()=>disconnect()}>{address?.slice(0,4)+'....'+address?.slice(-5)}</CustomButton>:<CustomButton onClick={onNavbarButtonClick}>{pathname === "/"?"Enter App":"Connect Wallet"}</CustomButton>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;