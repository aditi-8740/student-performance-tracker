import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, LayoutDashboard, BarChart3 ,BookOpen } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        {/* Logo */}
        <div className="px-4 py-4 ml-1 text-2xl font-bold">
          Smart School
        </div>
        
        <SidebarGroup>
          <SidebarMenu>
            {/* Classes */}
            <SidebarMenuItem className="mx-1">
              <SidebarMenuButton asChild>
                <Link to="/app/classes" className="flex items-center gap-2 ">
                  <Home />
                  <span className="font-medium">Classes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Dashboard */}
            <SidebarMenuItem className="mx-1 mt-2">
              <SidebarMenuButton asChild>
                <Link to="/app/dashboard" className="flex items-center gap-2">
                  <BarChart3 size={22} />
                  <span className="font-medium">DashBoard</span>
                </Link>
              </SidebarMenuButton>  
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
