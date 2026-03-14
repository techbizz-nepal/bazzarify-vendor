import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SidebarMenuButtonComponent from "@/modules/core/components/client/SidebarMenuButton";
import { TMenuItem } from "@/modules/core/data";
import { Settings } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { AiFillProduct } from "react-icons/ai";
import { FaHome, FaImage } from "react-icons/fa";
import { FaFirstOrder, FaProductHunt, FaUsers } from "react-icons/fa6";
import { TbCategory } from "react-icons/tb";

const adminNavigations: TMenuItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: FaHome,
  },
  {
    title: "Sliders",
    path: "/sliders",
    icon: FaImage,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: TbCategory,
  },
  {
    title: "Products",
    path: "/products",
    icon: FaProductHunt,
  },
  {
    title: "Order",
    path: "/orders",
    icon: FaFirstOrder,
  },
  {
    title: "Vendor Products",
    path: "#",
    icon: AiFillProduct,
  },
  {
    title: "Consumers",
    path: "/consumers",
    icon: FaUsers,
  },
  {
    title: "Store Onboarding",
    path: "/settings/store-onboarding",
    icon: Settings,
  },
];

const vendorNavigations: TMenuItem[] = [
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
    title: "Products",
    path: "/products",
    icon: FaProductHunt,
  },
  {
    title: "Sliders",
    path: "/sliders",
    icon: FaImage,
  },
  {
    title: "Order",
    path: "/orders",
    icon: FaFirstOrder,
  },
];

export async function AppSidebar({ className }: { className?: string }) {
  const requestHeaders = await headers();
  const isVendor = requestHeaders.get("host")?.startsWith("vendor.");
  const items = isVendor ? vendorNavigations : adminNavigations;
  return (
    <Sidebar className={className}>
      <SidebarHeader>
        <Image
          src="/logo.png"
          alt="logo"
          width={342}
          height={88}
          priority={true}
        />
      </SidebarHeader>
      <SidebarContent className="bg-sidebar-primary">
        <SidebarGroup>
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
