"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";
import Link from "next/link";

export function CompanyHeader({
  company,
}: {
  company: {
    name: string;
    logo: React.FC<React.SVGProps<SVGSVGElement>>;
    company: string;
  }[];
}) {
  const [activeTeam] = React.useState(company[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href={"/"}>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer border-[#e7e7e7] border"
          >
            <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
              <activeTeam.logo className="size-7" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-[#B0B0B0]">{activeTeam.name}</span>
              <span className="truncate font-bold text-color text-sm">
                {activeTeam.company}
              </span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
