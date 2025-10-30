import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/shadcn/sidebar";
import { Outlet } from "react-router";

export default function HomeLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="fixed top-0 left-0 z-50 h-fit w-fit border-l-0 bg-white/50 p-4 sm:p-2 md:hidden" />
      <main style={{ width: "calc(100vw - 320px)" }}>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

{
  /* // ! DON'T TOUCH THE STYLE OF THE <main> - NEEDED BC OF THE SIDEBAR */
}
