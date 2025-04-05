import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import { FaFirstOrder, FaProductHunt, FaUsers } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { TbCategory } from "react-icons/tb";
import SidebarMenuButtonComponent from "@/modules/core/components/client/SidebarMenuButton";
import { TMenuItem } from "@/modules/core/data";
import { FaHome } from "react-icons/fa";
import Image from "next/image";
import { CgAttribution } from "react-icons/cg";

const items: TMenuItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: FaHome,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: TbCategory,
  },
  {
    title: "Category Attributes",
    path: "/category-attributes",
    icon: CgAttribution,
  },
  {
    title: "Products",
    path: "/products",
    icon: FaProductHunt,
  },
  {
    title: "Order",
    path: "#",
    icon: FaFirstOrder,
  },
  {
    title: "Vendor Products",
    path: "#",
    icon: AiFillProduct,
  },
  {
    title: "Users",
    path: "#",
    icon: FaUsers,
  },
  {
    title: "Vendors",
    path: "#",
    icon: Settings,
  },
];

export async function AppSidebar({ className }: { className?: string }) {
  return (
    <Sidebar className={className}>
      <SidebarContent className="bg-sidebar-primary">
        <SidebarGroup>
          <SidebarGroupLabel className="bg-white py-6">
            <Image src="/logo.png" alt="logo" width="150" height={50} />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="text-sidebar-primary-foreground hover:text-sidebar-accent-foreground"
                >
                  <SidebarMenuButtonComponent
                    routePath={item.path}
                    title={item.title}
                  >
                    <item.icon />
                  </SidebarMenuButtonComponent>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
