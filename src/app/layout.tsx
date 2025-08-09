import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Interrobang | Audience Polls for Tangle",
  description: "Interrobang | Audience Polls for Tangle",
  icons: [{ rel: "icon", url: "/logo-square-white.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${GeistSans.variable} ${GeistMono.variable} bg-background text-foreground`}
      >
        <body>
          {children}
          <Toaster richColors theme="light" />
        </body>
      </html>
    </ClerkProvider>
  );
}
