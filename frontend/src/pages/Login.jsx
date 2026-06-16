import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "sonner";
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
import { useAuth } from "@/context/AuthContext";
import tokenManager from "@/services/tokenManager.js";
import { GoogleLogin } from "@react-oauth/google";
import { Spinner } from "@/components/ui/spinner";
import AuthOverlay from "@/components/AuthOverlay";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const {setAccessToken, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await API.post("/auth/login", form);

      setAccessToken(res.data.accessToken);
      tokenManager.setAccessToken(res.data.accessToken);
      setUser(res.data.user);

      setIsLoading(false);  

      navigate("/app/classes");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      setIsGoogleLoading(true);
      const res = await API.post("/auth/google", {
        idToken,
      });

      setAccessToken(res.data.accessToken);
      tokenManager.setAccessToken(res.data.accessToken);
      setUser(res.data.user);

      navigate("/app/classes");
    } catch (error) {
      toast.error("Google login failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLoginError = () => {
    toast.error("Google login failed");
  };

  return (
    <>
      {isGoogleLoading && (
        <AuthOverlay
          type="loading"
          title="Signing you in..."
          description="Please wait..."
        />
      )}

      <Toaster position="top-center" />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg px-2 py-8 md:p-8 lg:p-10 mx-4">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Login to your account
            </CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    placeholder="m@example.com"
                    required
                    autoComplete="email"
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <span className="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:cursor-pointer">
                      <Link to="/forgot-password">Forgot your password?</Link>
                    </span>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    placeholder="password"
                    required
                    onChange={handleChange}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full hover:cursor-pointer hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading && <Spinner />}
                  Login
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
