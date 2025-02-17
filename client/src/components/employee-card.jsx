import { EllipsisVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { EmployeeDrawer } from "./employee-drawer";

const EmployeeCard = ({ data, userIsAdmin }) => {
  return (
    <Card className="h-fit transition-all hover:scale-105">
      <CardHeader className="items-center relative">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical className="absolute top-2 left-2 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute top-[-22px] right-[-5px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View</DropdownMenuItem>
            {userIsAdmin && <DropdownMenuItem>Edit</DropdownMenuItem>}
            {userIsAdmin && <DropdownMenuItem>Update</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
        <EmployeeDrawer data={data} />
        <CardTitle>{data?.name}</CardTitle>
        <CardDescription>{data?.class}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default EmployeeCard;
