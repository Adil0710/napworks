"use client";

import * as React from "react";

import { MdOutlineStorefront, MdOutlineShowChart } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { LuHouse } from "react-icons/lu";

import { NavMain } from "../components/nav-main";

import { CompanyHeader } from "../components/company-header";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "../components/ui/sidebar";

import Image from "next/image";
import useProductStore from "../store/useProductStore";

const data = {
  company: [
    {
      name: "company",
      logo: () => (
        <Image src="/logo.png" width={42} height={42} alt="NapWorks" />
      ),
      company: "NapWorks",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { products, fetchProducts } = useProductStore();
  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const navMain = [
    {
      title: "Dashboard",
      url: "/",
      icon: LuHouse,
      isActive: true,
    },
    {
      title: "Product",
      url: "/products",
      icon: MdOutlineStorefront,
      count: products.length,
    },
    {
      title: "Transaction",
      url: "/dashboard/transactions",
      icon: FaRegFileAlt,
      count: 441,
    },
    {
      title: "Customer",
      url: "/dashboard/customers",
      icon: FiUsers,
    },
    {
      title: "Sales Report",
      url: "/dashboard/sales-report",
      icon: MdOutlineShowChart,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className=" mt-0">
        <CompanyHeader company={data.company} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
