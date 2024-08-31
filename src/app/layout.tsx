"use client";
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "./_components/theme-providers";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "./_components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.className}`}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
