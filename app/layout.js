import { Manrope } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TabShare",
  description:
    "Split shared expenses, keep everyone’s balance clear, and see who owes what. For trips, roommates, and the everyday things you share.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sans.variable}>{children}</body>
    </html>
  );
}
