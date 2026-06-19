"use client";

import {
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

const menuItems = [
  {
    title: "Workflows",
    icon: ZapIcon,
    url: "/workflows",
    description: "Build automations",
  },
  {
    title: "Credentials",
    icon: KeyIcon,
    url: "/credentials",
    description: "Manage API keys",
  },
  {
    title: "Executions",
    icon: HistoryIcon,
    url: "/executions",
    description: "View run history",
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-white/60 liquid-glass-strong">
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-3 h-12 px-3 hover:bg-transparent">
            <Link href="/" prefetch>
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <ZapIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[15px] tracking-tight text-gray-900">
                Cipher
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>

      <SidebarContent className="liquid-glass-strong pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-0.5">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      asChild
                      className={[
                        "gap-x-3 h-10 px-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-blue-50 border-l-2 border-blue-600 text-blue-700 rounded-l-none"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      ].join(" ")}
                    >
                      <Link href={item.url} prefetch>
                        <item.icon
                          className={[
                            "size-4 flex-shrink-0",
                            isActive ? "text-blue-600" : "text-gray-500",
                          ].join(" ")}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className={["text-sm font-medium leading-none", isActive ? "text-blue-700" : "text-gray-800"].join(" ")}>
                            {item.title}
                          </span>
                          <span className="text-[11px] text-gray-400 leading-none mt-0.5 truncate">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/60 liquid-glass-strong">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              className="gap-x-3 h-10 px-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }
            >
              <LogOutIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
