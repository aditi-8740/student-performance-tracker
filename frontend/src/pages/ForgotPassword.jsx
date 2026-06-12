import API from "../api/axios";
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
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast, Toaster } from "sonner";

export default function ForgotPassword() {
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email;
    const [localPart, domain] = email.split("@");
    const visibleChars = Math.min(
      3,
      Math.max(1, Math.floor(localPart.length / 2)),
    );
    const maskedPart = `${localPart.slice(0, visibleChars)}${"*".repeat(Math.max(3, localPart.length - visibleChars))}`;
    return `${maskedPart}@${domain}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/password/forgot", {
        email: registeredEmail,
      });

      const message = response?.data?.message;
      const isSuccess = message?.includes("No account found");

      if (!isSuccess) {
        setDialogMessage(message);
        setIsDialogOpen(true);
      } else {
        toast.error(message || "Failed to request password reset.", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Failed to request password reset.", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg px-2 py-8 md:p-8 lg:p-10 mx-4">
          <CardHeader>
            <CardTitle className="text-2xl">Find your account</CardTitle>
            <CardDescription>
              Enter your registered email address
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
                    value={registeredEmail}
                    placeholder="m@example.com"
                    required
                    autoComplete="email"
                    onChange={(e) => setRegisteredEmail(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full cursor-pointer">
                  Find Account
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
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Password reset requested</AlertDialogTitle>
            <AlertDialogDescription>
              {`We texted a password reset link to ${maskEmail(registeredEmail)} if that email is registered.. Tap on the link to reset your password.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
