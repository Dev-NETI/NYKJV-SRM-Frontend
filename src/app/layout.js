import { Poppins } from "next/font/google";
import "./globals.css";
import { EdgeStoreProvider } from "@/lib/edgestore";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "SRM | Supplier Relation Management",
  description: "Supplier Relation Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <EdgeStoreProvider>{children}</EdgeStoreProvider>
      </body>
    </html>
  );
}
