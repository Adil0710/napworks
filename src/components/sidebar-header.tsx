"use client";

import { SidebarTrigger } from "../components/ui/sidebar";
import { Bell, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function SiteHeader() {
  const pathname = usePathname();


  const pathSegments = pathname.split("/").filter(Boolean); 
  const pageTitle =
    pathSegments.length > 1
      ? pathSegments[pathSegments.length - 1]
      : "Dashboard";


  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-[76px] border-b-[2px] border-[#e7e7e7] bg-white flex items-center justify-between px-6">
        <SidebarTrigger className="-ml-1" />

        <div className="flex items-center gap-4">
          <div className="relative">
            <Button
              variant="secondary"
              size="icon"
              className="p-2 cursor-pointer"
            >
              <Mail className="h-5 w-5 text-[#323130]" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
              >
                2
              </Badge>
            </Button>
          </div>
          <div className="relative">
            <Button
              variant="secondary"
              size="icon"
              className="p-2 cursor-pointer"
            >
              <Bell className="h-5 w-5 text-[#323130]" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
              >
                1
              </Badge>
            </Button>
          </div>
          <div className=" h-10 w-px bg-[#e7e7e7] ml-2"></div>

          <div className="flex items-center gap-2 ml-2 cursor-pointer">
            <Avatar className="h-10 w-10 rounded-md">
              <AvatarImage src="/admin.png" alt="Guy Hawkins" />
              <AvatarFallback>GH</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-[#2a2a2a]">Guy Hawkins</p>
              <p className="text-xs text-[#727272]">Admin</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
