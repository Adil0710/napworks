import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";

import { SiteHeader } from "../components/sidebar-header";
import { Toaster } from "../components/ui/sonner";

const PlusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "NapWorks",
  description: "NapWorks Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${PlusJakartaSans.className} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset className=" bg-[#f9fcff]">
            <SiteHeader />
            <main className="flex flex-1 flex-col bg-[#f9fcff]">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                  <Toaster />
                </div>
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
