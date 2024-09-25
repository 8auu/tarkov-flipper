"use client";
import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "./_components/theme-providers";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "./_components/ui/toaster";
import { TooltipProvider } from "./_components/ui/tooltip";
import { Navbar } from "./_components/navbar/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.className}`}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body>
        <Analytics />
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <div className="px-2 py-5 text-lg font-semibold xl:container xl:px-0">
                <Navbar />
                {children}
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
