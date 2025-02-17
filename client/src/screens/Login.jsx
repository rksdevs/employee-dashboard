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
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../mutations/loginMutation";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { loading, error, data }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      if (data.loginUser) {
        navigate("/dashboard");
      }
    },
  });

  const togglePasswordView = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await loginUser({ variables: { email, password } });
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  return (
    <div className="flex flex-col w-full justify-center min-h-[63vh]">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={(e) => handleLogin(e)}>
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
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
