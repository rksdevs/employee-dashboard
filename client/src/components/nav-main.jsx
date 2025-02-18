import { ChevronRight, SquareMenu } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EMPLOYEES, GET_ME } from "../queries/employeeQueries";
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
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ADD_EMPLOYEE } from "../mutations/addEmployeeMutation";
import { useToast } from "../hooks/use-toast";

export function NavMain() {
  const navigate = useNavigate();
  const [addEmployee, { loading, error, data }] = useMutation(ADD_EMPLOYEE, {
    onCompleted: (data) => {
      if (data.name) {
        // navigate("/dashboard");
        setOpenAddUserSheet(false);
        toast({
          title: `Employee ${data?.name} Added Successfully!`,
        });
      }
    },
    refetchQueries: [
      {
        query: GET_EMPLOYEES,
        variables: { limit: 10, offset: 0, sortBy: "a-z" },
      },
    ],
  });
  const {
    data: userRole,
    loading: loadingUserRole,
    error: loadingError,
  } = useQuery(GET_ME, { fetchPolicy: "network-only" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);
  const [employeeClass, setEmployeeClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [adminValueToPass, setAdminValueToPass] = useState(false);
  const [addAttendanceDialog, setAddAttendanceDialog] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [openAddUserSheet, setOpenAddUserSheet] = useState(false);
  const { toast } = useToast();

  const handleIndividualAddAttendance = (e) => {
    e.preventDefault();
    setAttendance((prevState) => [
      ...prevState,
      { date: attendanceDate, status: attendanceStatus },
    ]);
    setAddAttendanceDialog(false);
    setAttendanceDate("");
    setAttendanceStatus("");
  };

  const handleSubjectSplits = (str) => {
    return str.split(",");
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    console.log({
      name,
      email,
      age: Number(age),
      class: employeeClass,
      subjects: handleSubjectSplits(subjects),
      attendance,
      address: {
        state: addressState,
        city: addressCity,
        zip: addressZip,
        street: addressStreet,
      },
      isAdmin: adminValueToPass,
    });
    try {
      await addEmployee({
        variables: {
          name,
          email,
          age: Number(age),
          class: employeeClass,
          subjects: handleSubjectSplits(subjects),
          attendance,
          address: {
            state: addressState,
            city: addressCity,
            zip: addressZip,
            street: addressStreet,
          },
          isAdmin: adminValueToPass,
        },
      });
      setOpenAddUserSheet(false);
    } catch (error) {
      console.error("Login failed:", error.message);
      toast({
        title: "Add Employee failed!",
        description: error.message,
        variant: "destructive",
      });
    }
    setOpenAddUserSheet(false);
  };

  useEffect(() => {
    if (isAdmin === "Yes, Employee is an admin") {
      setAdminValueToPass(true);
    } else {
      setAdminValueToPass(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    console.log(attendance);
  }, [attendance]);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"Dashboard"}>
                <SquareMenu />
                <span>Dashboard</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <span>Employees</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
        {userRole?.getUserRole?.isAdmin && (
          <Collapsible asChild defaultOpen={true} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={"Admin Roles"}>
                  <SquareMenu />
                  <span>Admin Roles</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <Sheet
                      open={openAddUserSheet}
                      onOpenChange={setOpenAddUserSheet}
                    >
                      <SheetTrigger asChild>
                        <SidebarMenuSubButton
                          asChild
                          className="hover: cursor-pointer"
                        >
                          <span>Add Employee</span>
                        </SidebarMenuSubButton>
                      </SheetTrigger>
                      <SheetContent className="overflow-y-auto scrollbar">
                        <SheetHeader>
                          <SheetTitle>Add Employee</SheetTitle>
                          <SheetDescription>
                            Add a new employee
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder="Employee name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="m@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="age">Age</Label>
                            <Input
                              id="age"
                              type="number"
                              placeholder="Employee age"
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              required
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeClass">
                              Employee Class
                            </Label>
                            <Input
                              id="employeeClass"
                              type="text"
                              placeholder="Employee class"
                              value={employeeClass}
                              onChange={(e) => setEmployeeClass(e.target.value)}
                              required
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subjects">Subjects</Label>
                            <Input
                              id="subjects"
                              type="text"
                              placeholder="Tech stack separated by comma `,`"
                              value={subjects}
                              onChange={(e) => setSubjects(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <Separator />
                          <span className="font-bold text-muted-foreground">
                            Address Fields
                          </span>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="addressStreet">Street</Label>
                            <Input
                              id="addressStreet"
                              type="text"
                              placeholder="Street"
                              value={addressStreet}
                              onChange={(e) => setAddressStreet(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="addressCity">City</Label>
                            <Input
                              id="addressCity"
                              type="text"
                              placeholder="City"
                              value={addressCity}
                              onChange={(e) => setAddressCity(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="addressState">State</Label>
                            <Input
                              id="addressState"
                              type="text"
                              placeholder="State"
                              value={addressState}
                              onChange={(e) => setAddressState(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="addressZip">Zip</Label>
                            <Input
                              id="addressZip"
                              type="text"
                              placeholder="Zip code"
                              value={addressZip}
                              onChange={(e) => setAddressZip(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <Separator />
                          <span className="font-bold text-muted-foreground">
                            Attendance
                          </span>
                          <Dialog
                            open={addAttendanceDialog}
                            onOpenChange={setAddAttendanceDialog}
                          >
                            <DialogTrigger asChild>
                              <Button className="w-full md:w-1/3">
                                Add Attendance
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Add a new attendance</DialogTitle>
                                <DialogDescription>
                                  addAttendanceDialog here
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-4">
                                  <Label htmlFor="feature-name">Date</Label>
                                  <Input
                                    id="feature-name"
                                    type="text"
                                    value={attendanceDate}
                                    onChange={(e) =>
                                      setAttendanceDate(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="flex flex-col gap-4">
                                  <Label htmlFor="feature-details">
                                    Attendance Status
                                  </Label>
                                  <Select
                                    value={attendanceStatus}
                                    onValueChange={(e) =>
                                      setAttendanceStatus(e)
                                    }
                                    required
                                    className="col-span-3"
                                  >
                                    <SelectTrigger
                                      id="status"
                                      aria-label="Select Status"
                                      className="col-span-3"
                                    >
                                      <SelectValue placeholder="Absent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={"ABSENT"}>
                                        Absent
                                      </SelectItem>
                                      <SelectItem value={"PRESENT"}>
                                        Present
                                      </SelectItem>
                                      <SelectItem value={"LEAVE"}>
                                        Leave
                                      </SelectItem>
                                      <SelectItem value={"WEEKOFF"}>
                                        Week Off
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  type="submit"
                                  onClick={handleIndividualAddAttendance}
                                >
                                  Save changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          {attendance?.length ? (
                            <Table>
                              <TableCaption>Attendance Details</TableCaption>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[100px]">
                                    Date
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Attendance
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {attendance?.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">
                                      {item.date}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {item.status}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            ""
                          )}
                          <Separator />
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="admin">Admin</Label>
                            <Select
                              value={isAdmin}
                              onValueChange={(e) => setIsAdmin(e)}
                              required
                              className="col-span-3"
                            >
                              <SelectTrigger
                                id="admin"
                                aria-label="Select Admin Role"
                                className="col-span-3"
                              >
                                <SelectValue placeholder="No, I'm not an admin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={"Yes, Employee is an admin"}>
                                  Yes, Employee is an admin
                                </SelectItem>
                                <SelectItem
                                  value={"No, Employee is not an admin"}
                                >
                                  No, Employee is not an admin
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <SheetFooter className="mt-16">
                          <SheetClose asChild>
                            <Button
                              type="submit"
                              onClick={(e) => handleAddEmployee(e)}
                            >
                              Save changes
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
