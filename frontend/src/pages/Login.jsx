import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate("/app/classes");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Login to your account
            </CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    autoComplete="email"
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <span                     
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </span>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" className="w-full cursor-pointer">
              Login
            </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div>
              <span>Not registered? </span>
              <span className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                <Link to="/signup"> Signup Here </Link>
              </span>
            </div>
            
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Login;