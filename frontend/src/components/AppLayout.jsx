import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "./AppSidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import profile_photo from "../assets/profile_photo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import API from "@/api/axios";
import { toast, Toaster } from "sonner"

export default function AppLayout() {
  const navigate = useNavigate();
  const {user} = useAuth();
  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out", { position: "top-center" });
    }
  };

  return (
    <>
      <Toaster />
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <main className="flex flex-col h-full">
            {/* Top bar */}
            <div className="sticky top-0 z-10 flex justify-between items-center gap-6 px-4 py-3 bg-sidebar ">
              <SidebarTrigger />
            
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 border cursor-pointer hover:opacity-80">
                    <AvatarImage
                      src={profile_photo}
                      alt="@shadcn"
                      className="grayscale"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-65"
                  align="end"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="pt-3 px-4 font-bold ">{user.name}</DropdownMenuLabel>
                    <DropdownMenuLabel className="-mt-3 px-4  text-sm">{user.email}</DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="pt-3 px-4 font text-sm">My Account</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer py-2 px-4" onClick={() => navigate("/app/dashboard")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-2 px-4" onClick={() => navigate("/app/settings/security")}>
                      Security
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer py-2 px-4" onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Content */}
            <div className="flex-1 p-1 lg:p-3  bg-white rounded-4xl">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
