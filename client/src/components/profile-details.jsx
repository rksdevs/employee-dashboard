import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Attendance from "./attendance";

const ProfileDetails = ({ data }) => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (data) {
      setAttendance(data?.attendance);
    }
  }, [data]);
  return (
    <Card className="h-fit w-full flex items-center justify-center flex-col">
      <CardHeader className="items-center relative">
        <Avatar className="h-[75px] w-[75px] mb-4 hover:cursor-pointer ">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <CardTitle>{data?.name}</CardTitle>
        <CardDescription>{data?.class}</CardDescription>
      </CardHeader>
      <CardContent className="w-full ">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Card className="overflow-hidden w-full ">
              <CardHeader className="flex flex-row items-center justify-center bg-muted/50">
                <CardTitle className="group gap-2 text-lg">
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Address</div>
                  <ul className="grid gap-3"></ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Street</span>
                      <span>{data?.address?.street}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">City</span>
                      <span>{data?.address?.city}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">State</span>
                      <span>{data?.address?.state}</span>
                    </li>
                    <li className="flex items-center justify-between ">
                      <span className="text-muted-foreground">Zip</span>
                      <span>{data?.address?.zip}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Customer</dt>
                      <dd>{data?.name}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>
                        <a href="mailto:">{data?.email}</a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-3 items-center border-t bg-muted/50 px-6 py-3 justify-between">
                <h3 className="text-primary col-span-1">Admin Actions</h3>
                <div className="col-span-2 gap-4 flex justify-evenly">
                  <Button disabled={!data?.isAdmin}>Edit User</Button>
                  <Button disabled={!data?.isAdmin}>Delete User</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="attendance">
            <Attendance data={data?.attendance} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
