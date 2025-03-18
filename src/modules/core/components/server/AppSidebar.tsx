import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { FaFirstOrder, FaProductHunt } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { TbCategory } from "react-icons/tb";
const items = [
  {
    title: "Dashboard",
    url: "#",
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
          <SidebarGroupLabel className="text-primary">
            Bazzarify
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
