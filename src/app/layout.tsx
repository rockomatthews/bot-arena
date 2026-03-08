import type { Metadata } from "next";
import "./globals.css";
import MuiProviders from "./MuiProviders";

export const metadata: Metadata = {
  title: "Bot Arena",
  description: "Bot-vs-bot BTC rounds with mining + staking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MuiProviders>{children}</MuiProviders>
      </body>
    </html>
  );
}
