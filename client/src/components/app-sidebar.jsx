import { Settings2, SquareMenu } from "lucide-react";

import { NavMain } from "../components/nav-main";
import { NavUser } from "../components/nav-user";
import { TeamSwitcher } from "../components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../components/ui/sidebar";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../queries/employeeQueries";
import { useEffect, useMemo } from "react";

export function AppSidebar({ ...props }) {
  const {
    data: userRole,
    loading: loadingUserRole,
    error: loadingError,
  } = useQuery(GET_ME, { fetchPolicy: "network-only" });

  const data = useMemo(() => {
    const baseData = {
      user: {
        name: userRole?.getUserRole?.name,
        email: userRole?.getUserRole?.email,
      },
      organization: {
        name: "Demo Inc",
        plan: "Enterprise",
      },
    };
    return baseData;
  }, [userRole]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher organization={data.organization} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userRole?.getUserRole} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
