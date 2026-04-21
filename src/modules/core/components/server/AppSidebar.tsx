import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  getAuthUser,
  getSessionUserUUID,
} from "@/modules/auth/data/lib/auth-lib";
import SidebarMenuButtonComponent from "@/modules/core/components/client/SidebarMenuButton";
import SidebarMenuGroupComponent from "@/modules/core/components/client/SidebarMenuGroup";
import { TMenuEntry } from "@/modules/core/data";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { Settings } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { FaHome, FaImage } from "react-icons/fa";
import {
  FaFileImport,
  FaFirstOrder,
  FaProductHunt,
  FaUsers,
} from "react-icons/fa6";
import { TbCategory } from "react-icons/tb";

const productsGroup: TMenuEntry = {
  type: "group",
  title: "Products",
  defaultPath: "/products",
  pathMatch: "/products",
  icon: FaProductHunt,
  children: [
    {
      type: "link",
      title: "All products",
      path: "/products",
      icon: FaProductHunt,
    },
    {
      type: "link",
      title: "Imports",
      path: "/products/imports",
      icon: FaFileImport,
    },
  ],
};

const adminNavigations: TMenuEntry[] = [
  { type: "link", title: "Dashboard", path: "/", icon: FaHome },
  { type: "link", title: "Sliders", path: "/sliders", icon: FaImage },
  { type: "link", title: "Categories", path: "/categories", icon: TbCategory },
  productsGroup,
  { type: "link", title: "Orders", path: "/orders", icon: FaFirstOrder },
  { type: "link", title: "Users", path: "/users", icon: FaUsers },
  {
    type: "group",
    title: "Settings",
    defaultPath: "/settings/store-onboarding",
    pathMatch: "/settings",
    icon: Settings,
    children: [
      {
        type: "link",
        title: "Store onboarding",
        path: "/settings/store-onboarding",
        icon: Settings,
      },
    ],
  },
];

const vendorNavigations: TMenuEntry[] = [
  { type: "link", title: "Dashboard", path: "/", icon: FaHome },
  { type: "link", title: "Categories", path: "/categories", icon: TbCategory },
  productsGroup,
  { type: "link", title: "Sliders", path: "/sliders", icon: FaImage },
  { type: "link", title: "Orders", path: "/orders", icon: FaFirstOrder },
];

function isEntryVisible(entry: TMenuEntry, isSuperAdmin: boolean): boolean {
  if (entry.type === "link" && entry.path === "/users") return isSuperAdmin;
  return true;
}

export async function AppSidebar({ className }: { className?: string }) {
  const requestHeaders = await headers();
  const isVendor = requestHeaders.get("host")?.startsWith("vendor.");
  const userUuid = await getSessionUserUUID(await getCookieStore());
  const authUser = userUuid ? await getAuthUser(userUuid) : null;
  const isSuperAdmin = Boolean(
    authUser &&
      typeof authUser === "object" &&
      !("error" in authUser) &&
      authUser.roles.some((role) => role.name === "super-admin"),
  );
  const entries = (isVendor ? vendorNavigations : adminNavigations).filter(
    (entry) => isEntryVisible(entry, isSuperAdmin),
  );
  return (
    <Sidebar className={className}>
      <SidebarHeader className="p-4 pb-2">
        <div className="rounded-2xl px-4 py-3">
          <Image
            src="/logo.png"
            alt="logo"
            width={342}
            height={88}
            priority={true}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {entries.map((entry) => {
                if (entry.type === "group") {
                  const GroupIcon = entry.icon;
                  return (
                    <SidebarMenuGroupComponent
                      key={entry.title}
                      title={entry.title}
                      defaultPath={entry.defaultPath}
                      pathMatch={entry.pathMatch}
                      icon={<GroupIcon />}
                      items={entry.children.map((child) => {
                        const ChildIcon = child.icon;
                        return {
                          title: child.title,
                          path: child.path,
                          icon: <ChildIcon />,
                        };
                      })}
                    />
                  );
                }
                return (
                  <SidebarMenuItem key={entry.title}>
                    <SidebarMenuButtonComponent
                      routePath={entry.path}
                      title={entry.title}
                    >
                      <entry.icon />
                    </SidebarMenuButtonComponent>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
