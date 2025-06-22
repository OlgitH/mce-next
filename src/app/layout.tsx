import { Sigmar, Libre_Baskerville, Lato } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.scss";

const sigmar = Sigmar({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sigmar",
});

const baskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-baskerville",
});

const lato = Lato({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
});

import { PrismicPreview } from "@prismicio/next";

import { repositoryName } from "@/prismicio";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sigmar.variable} ${lato.variable} ${baskerville.variable} `}
    >
      <body className="overflow-x-hidden antialiased min-h-screen">
        {children}
        <PrismicPreview repositoryName={repositoryName} />
        <GoogleAnalytics gaId="G-MD3KMX44Z1" />
      </body>
    </html>
  );
}
