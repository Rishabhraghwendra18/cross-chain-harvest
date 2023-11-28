import { Outfit } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Cross Chain Harvest",
  description: "Cross Chain Yield Aggregator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Navbar />
        <div id="root">
        {children}
        </div>
      </body>
    </html>
  );
}