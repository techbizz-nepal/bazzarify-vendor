import {
  getAuthUser,
  getSessionUserUUID,
} from "@/modules/auth/data/lib/auth-lib";
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
import { getCookieStore } from "@/modules/core/lib/utils.session";
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
  const userUuid = await getSessionUserUUID(await getCookieStore());
  const authUser = userUuid ? await getAuthUser(userUuid) : null;
  const isSuperAdmin =
    authUser &&
    typeof authUser === "object" &&
    !("error" in authUser) &&
    authUser.roles.some((role) => role.name === "super-admin");
  const items = isVendor
    ? vendorNavigations
    : adminNavigations.filter((item) =>
        item.path === "/consumers" ? isSuperAdmin : true,
      );
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
