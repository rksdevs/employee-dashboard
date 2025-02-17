import { useNavigate } from "react-router-dom";
import AllEmployees from "../components/all-employees";
import { AppSidebar } from "../components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/me", { credentials: "include" }) // Check authentication
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAuthenticated) {
          navigate("/");
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>All Employees</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-5">
            {/* {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-muted/50" />
            ))} */}
            <AllEmployees />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
