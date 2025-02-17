import { useMediaQuery } from "../hooks/use-media-query";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ProfileDetails from "./profile-details";
import { GET_EMPLOYEE_DETAILS } from "../queries/employeeQueries";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export function EmployeeDrawer({ data }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const {
    loading,
    error,
    data: employeeDetails,
  } = useQuery(GET_EMPLOYEE_DETAILS, {
    variables: { id: data.id },
    skip: !open,
  });

  // useEffect(() => {
  //   console.log("employee details-- ", employeeDetails);
  // }, [employeeDetails]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Avatar className="h-[150px] w-[150px] mb-4 hover:cursor-pointer ">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              Know more about{" "}
              <span className="font-bold text-primary">{data?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <ProfileDetails data={employeeDetails?.employee} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Avatar className="h-[150px] w-[150px] mb-4 hover:cursor-pointer ">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Employee Details</DrawerTitle>
          <DrawerDescription>
            Know more about{" "}
            <span className="font-bold text-primary">{data?.name}</span>
          </DrawerDescription>
        </DrawerHeader>
        <ProfileDetails className="px-4" data={employeeDetails?.employee} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
