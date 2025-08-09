import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Interrobang | Audience Polls for Tangle",
  description: "Interrobang | Audience Polls for Tangle",
  icons: [{ rel: "icon", url: "/logo-square-white.png" }],
};

const GTAlpinaLight = localFont({
  src: [
    {
      path: "../../public/GT-Alpina-Standard-Thin.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/GT-Alpina-Standard-Light.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-gt-alpina-light",
});

const ABCDiatype = localFont({
  src: [
    {
      path: "../../public/fonts/ABCDiatype-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ABCDiatype-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/ABCDiatype-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ABCDiatype-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/ABCDiatype-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/ABCDiatype-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-abc-diatype",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${GeistSans.variable} ${GeistMono.variable} ${GTAlpinaLight.variable} ${ABCDiatype.variable} bg-foundation text-inkwell`}
      >
        <body>
          {children}
          <Toaster richColors theme="light" />
        </body>
      </html>
    </ClerkProvider>
  );
}
