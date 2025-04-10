"use client";

import type React from "react";

import type { LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
    isActive?: boolean;
    count?: number; 
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className=" text-[#727272] text-sm">
        GENERAL
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className={cn(
                " cursor-pointer text-color-2 text-sm mt-1",
                pathname === item.url &&
                  "bg-[#D9EDFF] text-color font-bold hover:bg-[#d9edff]",
                item.url === "/" ||
                  (item.title === "Dashboard" &&
                    "bg-[#D9EDFF] text-color font-bold")
              )}
              tooltip={
                item.count !== undefined
                  ? `${item.title} (${item.count})`
                  : item.title
              }
            >
              <a href={item.url}>
                {item.icon && <item.icon />}
                <span className="relative w-full">
                  {item.title}
                  {item.count !== undefined && <span className=" ml-0.5">({item.count})</span>}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
