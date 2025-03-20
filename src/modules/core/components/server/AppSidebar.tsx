import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Settings } from "lucide-react";
import { FaFirstOrder, FaProductHunt } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { TbCategory } from "react-icons/tb";
import Image from "next/image";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Categories",
    url: "#",
    icon: TbCategory,
  },
  {
    title: "Order",
    url: "#",
    icon: FaFirstOrder,
  },
  {
    title: "Products",
    url: "#",
    icon: FaProductHunt,
  },
  {
    title: "Vendor Products",
    url: "#",
    icon: AiFillProduct,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-primary text-primary-foreground">
        <SidebarGroup>
          <SidebarGroupLabel className="bg-white py-6">
            <Image src="/logo.png" alt="logo" width="150" height={50} />
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-6">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="py-6">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
