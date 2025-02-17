import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../components/ui/select";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../mutations/registerMutation";
import { useToast } from "../hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registerUser, { loading, error, data }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      console.log(data);
      if (data?.registerUser?.name) {
        navigate("/");
        toast({
          title: `Registration Successful ${data?.registerUser?.name}. Please login.`,
        });
      }
    },
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminValueToPass, setAdminValueToPass] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({
        variables: { name, email, password, isAdmin: adminValueToPass },
      });
    } catch (error) {
      console.error("Login failed:", error.message);
      toast({
        title: "Login failed!",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isAdmin === "Yes, I'm an admin") {
      setAdminValueToPass(true);
    } else {
      setAdminValueToPass(false);
    }
  }, [isAdmin]);

  const togglePasswordView = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex flex-col w-full justify-center min-h-[63vh]">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your details below to register a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={(e) => handleRegister(e)}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="name"
                placeholder="m@example.com"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2 relative">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgotPassword"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type={!showPassword ? "password" : "text"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Eye
                className={`h-4 w-4 absolute top-[38px] right-[10px] text-primary hover:cursor-pointer ${
                  showPassword ? "hidden" : ""
                }`}
                onClick={togglePasswordView}
              />
              <EyeOff
                className={`h-4 w-4 absolute top-[38px] right-[10px] text-primary hover:cursor-pointer ${
                  !showPassword ? "hidden" : ""
                }`}
                onClick={togglePasswordView}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin">Admin</Label>
              <Select
                value={isAdmin}
                onValueChange={(e) => setIsAdmin(e)}
                required
              >
                <SelectTrigger id="admin" aria-label="Select Admin Role">
                  <SelectValue placeholder="No, I'm not an admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"Yes, I'm an admin"}>
                    Yes, I'm an admin
                  </SelectItem>
                  <SelectItem value={"No, I'm not an admin"}>
                    No, I'm not an admin
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
