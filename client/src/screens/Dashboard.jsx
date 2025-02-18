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
import { useEffect, useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import { GET_EMPLOYEES, GET_USER_ROLE } from "../queries/employeeQueries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { ListFilter } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [sortBy, setSortBy] = useState("a-z");
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;
  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: { limit, offset, sortBy },
    fetchPolicy: "cache-and-network",
  });

  // Authentication check
  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((userData) => {
        if (!userData.isAuthenticated) {
          navigate("/");
        } else {
          client.writeQuery({
            query: GET_USER_ROLE,
            data: { isAdmin: userData.user.isAdmin },
          });
        }
      })
      .catch(() => navigate("/"));
  }, [navigate, client]);

  useEffect(() => {
    setPage(1);
    refetch({ limit, offset: 0, sortBy });
  }, [sortBy, refetch, limit]);

  const totalCount = data?.allEmployees?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 pl-4 pr-12 justify-between">
          <div className="flex items-center gap-2">
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
          <DropdownMenu className="pr-4">
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-45">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="a-z">
                  A to Z
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="z-a">
                  Z to A
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {error && (
            <div className="text-red-500">
              <p>Error: {error.message}</p>
            </div>
          )}
          {loading && <p className="text-gray-500">Loading employees...</p>}
          {!loading && !error && data?.allEmployees && (
            <>
              <div className="grid auto-rows-min gap-4 md:grid-cols-5">
                <AllEmployees employeeData={data.allEmployees.employees} />
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "solid" : "outline"}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
