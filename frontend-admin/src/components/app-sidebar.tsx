import * as React from "react";
import { NavLink, useLocation } from "react-router";
import { useAuthStore } from "@/store/auth";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { sidebarLinks } from "@/layouts/sidebarLInks";
import LogoutDropDownMenu from "./LogoutDropDownMenu";
import ProfileDialog from "./ProfileDialog";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  // SidebarRail,
} from "@/components/ui/shadcn/sidebar";

import {
  BookmarkIcon,
  ChartColumnIcon,
  FileIcon,
  FilePlus2Icon,
  SearchIcon,
  UserIcon,
  UserRoundPlus,
  HouseIcon,
  UserRoundIcon,
  BellIcon,
  FileSpreadsheetIcon,
  NetworkIcon,
  TriangleAlertIcon,
} from "lucide-react";

const icons: { [key: string]: React.ElementType } = {
  BookmarkIcon,
  ChartColumnIcon,
  SearchIcon,
  FileIcon,
  FilePlus2Icon,
  UserIcon,
  UserRoundPlus,
  HouseIcon,
  BellIcon,
  FileSpreadsheetIcon,
  NetworkIcon,
};

// * add your route to sidebarLInks.ts then add the icon of your new route here and that is it

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { user } = useAuthStore();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <ProfileDialog>
              <SidebarMenuButton
                size="lg"
                className="hover:bg-gray-200 hover:text-black"
                asChild
              >
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground from-boa-sky to-boa-nightSky flex aspect-square size-8 items-center justify-center rounded-full bg-gradient-to-br">
                    <UserRoundIcon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1.5 leading-none">
                    <span className="font-bold">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <span>{user?.email}</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </ProfileDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarLinks.navMain
              .filter(
                (item) =>
                  user?.is_admin ||
                  (item.title !== "Utilisateur" &&
                    item.title !== "Notifications"),
                // utilisateur and notifications show only for admin
              )
              .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="hover:bg-gray-200 hover:text-black"
                    isActive={!item.items && location.pathname === item.url}
                    asChild
                  >
                    <NavLink to={item.url} className="font-medium">
                      {item.icon &&
                        React.createElement(icons[item.icon], {
                          className: "size-4 mr-2",
                        })}
                      {item.title}
                    </NavLink>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location.pathname === item.url}
                            className="hover:bg-gray-200 hover:text-black"
                          >
                            <NavLink to={item.url}>
                              {item.icon &&
                                React.createElement(icons[item.icon], {
                                  color:
                                    location.pathname === item.url
                                      ? "white"
                                      : "black",
                                  className: `size-4 mr-2`,
                                })}
                              {item.title}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <CountDownTimer />
        <LogoutDropDownMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

/**
 * A countdown timer component that warns the user before their session expires.
 * It uses the useSessionTimer hook to manage the session state.
 */
function CountDownTimer() {
  // These times are in seconds. The warning will show at 50 minute, and the session will expire at 60 minutes.
  const { status, timeLeft } = useSessionTimer(60 * 50, 60 * 60);

  // Helper function to format the time left into MM:SS format.
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  };

  // Render nothing if the session is active and not in a warning state.
  if (status === "active") {
    return null;
  }

  // Show a warning message with a countdown if the session is in the warning state.
  return (
    <div className="rounded-md border border-amber-500/50 px-4 py-3 text-amber-600">
      <p className="text-sm">
        <TriangleAlertIcon
          className="me-3 -mt-0.5 inline-flex opacity-60"
          size={16}
          aria-hidden="true"
        />
        Please Logout and login again for security purposes
        <span> {formatTime(timeLeft)} </span>
      </p>
    </div>
  );
}
