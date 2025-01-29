import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "./ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import {NextSSRPlugin} from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
// Metadata configuration
export const metadata: Metadata = {
  title: {
    template: "%s | Nest",
    default: "MyApp",
  },
  description: "Your place to share",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)}/>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {/* Global Toaster for notifications */}
              <Toaster />
              {/* Render the children (nested layouts or pages) */}
              {children}
            </ThemeProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
