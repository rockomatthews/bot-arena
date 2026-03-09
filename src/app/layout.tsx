import type { Metadata } from "next";
import "./globals.css";
import MuiProviders from "./MuiProviders";

const title = "BotsTurn";
const description = "Own a bot. Coach it. Compete in 1-minute BTC rounds.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://botsturn.com"),
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: "https://botsturn.com",
    title,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "BotsTurn" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
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
