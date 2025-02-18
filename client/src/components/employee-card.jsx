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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { SidebarMenuSubButton } from "./ui/sidebar";
import { Label, Separator } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useToast } from "../hooks/use-toast";
import { UPDATE_EMPLOYEE } from "../mutations/updateEmployeeMutation";
import { UserSheet } from "./add-user";
import { DELETE_EMP } from "../mutations/deleteEmployeeMutation";
import { GET_EMPLOYEES } from "../queries/employeeQueries";

const EmployeeCard = ({ data, userIsAdmin }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [deleteEmployee, { loading, error, data: deleteEmpData }] = useMutation(
    DELETE_EMP,
    {
      onCompleted: (data) => {
        if (data.name) {
          setOpen(false);
        }
      },
      refetchQueries: [
        {
          query: GET_EMPLOYEES,
          variables: { limit: 10, offset: 0, sortBy: "a-z" },
        },
      ],
    }
  );

  const handleEmpDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteEmployee({ variables: { id: data?.id } });
      toast({
        title: `User has been deleted successfully!`,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Unable to delete",
        description: error || error?.message,
        variant: "destructive",
      });
    }
  };
  return (
    <Card className="h-fit transition-all hover:scale-105">
      <CardHeader className="items-center relative">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger>
            <EllipsisVertical className="absolute top-2 left-2 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute top-[-22px] right-[-5px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userIsAdmin && <UserSheet data={data?.id} />}
            <DropdownMenuItem
              className="text-sidebar-foreground"
              onClick={(e) => handleEmpDelete(e)}
            >
              Delete User
            </DropdownMenuItem>
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
