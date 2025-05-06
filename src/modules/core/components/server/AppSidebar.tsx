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
import Image from "next/image";
import { AiFillProduct } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { FaFirstOrder, FaProductHunt, FaUsers } from "react-icons/fa6";
import { TbCategory } from "react-icons/tb";

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
    path: "/users",
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
