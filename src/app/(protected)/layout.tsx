import Navbar from "@/components/navbar";
import MenuBar from "@/components/MenuBar";
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex  dark:bg-background bg-secondary  min-h-screen flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="max-w-7xl p-1.5 sm:p-4 md:p-5 flex w-full grow gap-5">
        {/* Sidebar MenuBar for Large Screens */}
        <MenuBar
          className="sticky bg-card top-[5.35rem] h-fit hidden sm:block flex-none space-y-3 
          rounded-2xl px-3 py-5 lg:px-5 shadow-sm xl:w-80"
        />
        <div className="flex-grow mb-7">
          {children}
        </div>
      </div>

      {/* Divider */}
      <div className="h-1 w-full bg-gray-300"></div>

      {/* Bottom MenuBar for Small Screens */}
      <MenuBar className="fixed  h-16 bottom-0 flex w-full bg-card shadow-2xl shadow-slate-500 justify-around items-center gap-5 border-t border-gray-200 p-2 sm:hidden" />

      {/* Toaster Notifications */}
      <Toaster />
    </div>
  );
}
