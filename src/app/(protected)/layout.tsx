import Navbar from "@/components/navbar";
import MenuBar from "@/components/MenuBar";
import { Toaster } from "@/components/ui/toaster";
// import "./globals.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-200 min-h-screen flex-col">
      <Navbar/>
      <div className="mx-auto max-w-7xl p-5 flex w-full grow gap-5">
        <MenuBar
          className="sticky bg-card top-[5.35rem] h-fit hidden sm:block flex-none space-y-3 
          rounded-2xl px-3 py-5 lg:px-5 shadow-sm xl:w-80"
        />
        {children}
      </div>
      <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t p-3 sm:hidden" />
      <Toaster />
    </div>
  );
}
