import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif"
});

export const metadata = {
  title: "TabShare",
  description: "A routed, full-stack expense sharing app for trips, roommates, and collaborative budgets."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}

