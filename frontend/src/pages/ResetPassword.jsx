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
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to request password reset
      await API.post(`/auth/password/reset/${resetToken}`, { newPassword });
      toast("Success! Your password has been successfully updated.",{ position: "top-center" },);
      setNewPassword("");
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      toast("Failed to reset password", { position: "top-center" });
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg px-2 py-8 md:p-8 lg:p-10 mx-4">
          <CardHeader>
            <CardTitle className="text-2xl">Create a new password</CardTitle>
            <CardDescription>
              Enter your new password. You'll need this password to log into
              your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">New password</Label>
                  <Input
                    id="email"
                    type="password"
                    name="email"
                    value={newPassword}
                    placeholder="Enter your new password"
                    required
                    autoComplete="email"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full cursor-pointer">
                  Continue
                </Button>
              </div>
            </form>
            <div className="mt-2">
              <span>
                You may receive email notifications from us for security and
                login purposes.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
