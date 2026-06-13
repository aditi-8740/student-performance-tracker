import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import tokenManager from "@/services/tokenManager";
import { Spinner } from "@/components/ui/spinner"
import { toast, Toaster } from "sonner";

export default function SignupForm({ onSignupSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const { setAccessToken, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setForm({ ...form, role: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
    await API.post("/auth/signup", form);
      onSignupSuccess(form.email);

    } catch (err) {
      toast.error( err.response?.data?.message || "Signup failed");
    } finally{
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const res = await API.post("/auth/google", {
        idToken,
      });

      setAccessToken(res.data.accessToken);

      tokenManager.setAccessToken(res.data.accessToken);

      setUser(res.data.user);

      navigate("/app/classes");
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  const handleLoginError = () => {
    toast.error("Google login failed");
  };

  return (
    <>
    <Toaster position="top-center" />
      <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg px-2 py-8 md:p-8 lg:p-10 mx-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your details below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="name"
                  required
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <span className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    <Link to="/forgot-password">Forgot your password?</Link>
                  </span>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>

                <Select value={form.role} onValueChange={handleRoleChange} disabled={loading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>select a Role</SelectLabel>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" 
              className="w-full hover:cursor-pointer hover:bg-primary/90"
              disabled={loading}
              >
                {loading && <Spinner />}
                {loading ? "Signing Up..." : "Signup" }
              </Button>
              <div className="text-center -mt-3 mb-3">or</div>
            </div>
          </form>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div>
            <span>Already a member? </span>
            <span className="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:cursor-pointer hover:text-primary">
              <Link to="/"> Login Here </Link>
            </span>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
