import type { Metadata } from "next";
import "./globals.css";
import MuiProviders from "./MuiProviders";

export const metadata: Metadata = {
  title: "BotsTurn",
  description: "Own a bot. Coach it. Compete in 1-minute BTC rounds.",
  metadataBase: new URL("https://botsturn.com"),
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
