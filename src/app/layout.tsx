import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import {SessionProvider} from "next-auth/react"
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import MenuBar from "@/components/MenuBar";
import { Toast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import TrendsSidebar from "@/components/TrendsSidebar";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title:{
    template:"%s | Twitter",
    default:"Twitter"
  },
  description: "Social Media App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <SessionProvider>
     <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            >
              <div className="flex bg-gray-200 min-h-screen flex-col ">
                <Navbar/>
                <div className="mx-auto max-w-7xl p-5 flex w-full grow gap-5 ">
                  <MenuBar className="sticky bg-card top-[5.35rem] h-fit hidden sm:block flex-none space-y-3 
                    rounded-2xl  px-3 py-5 lg:px-5  shadow-sm xl:w-80
                  "/>
                  {children}
                </div>
                  <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t p-3 sm:hidden"/>
              </div>
          
        {/* <Sidebar></Sidebar> */}
          </ThemeProvider>
          <Toaster/>
      </body>
    </html>
   </SessionProvider>
  );
}
