// src/features/auth/components/OtpVerification.jsx
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Field, FieldLabel } from "../components/ui/field";
import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "./ui/spinner";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/context/AuthContext";
import tokenManager from "@/services/tokenManager";

export default function OtpVerification({ email, onChangeEmail }) {
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAccessToken, setUser } = useAuth();
  const navigate = useNavigate();
  const OTP_SLOT_CLASS =
    "border-2 border-gray-300 rounded-lg md:w-10 md:h-10 text-center text-lg md:text-2xl font-semibold";

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await API.post("/auth/verifications", {
        email,
        otp: otpValue,
      });

      setAccessToken(res.data.accessToken);
      tokenManager.setAccessToken(res.data.accessToken);
      setUser(res.data.user);

      navigate("/app/classes");
    } catch (error) {
      toast(error.response?.data?.message || "Otp verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setOtpValue("");
    try {
      await API.post("/auth/otp/resend", { email });
      toast("OTP resent successfully");
    } catch (error) {
      alert("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg px-2 py-8 md:p-8 lg:p-10 mx-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center">
            Enter the verification code sent to your email{" "}
            <span className="font-semibold">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOtpVerification}>
            <div className="flex flex-col gap-6 items-center">
              <Field className="w-fit">
                <InputOTP
                  id="digits-only"
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  onChange={(value) => setOtpValue(value)}
                  value={otpValue}
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot index={0} className={OTP_SLOT_CLASS} />
                    <InputOTPSlot index={1} className={OTP_SLOT_CLASS} />
                    <InputOTPSlot index={2} className={OTP_SLOT_CLASS} />
                    <InputOTPSlot index={3} className={OTP_SLOT_CLASS} />
                    <InputOTPSlot index={4} className={OTP_SLOT_CLASS} />
                    <InputOTPSlot index={5} className={OTP_SLOT_CLASS} />
                  </InputOTPGroup>
                </InputOTP>
              </Field>

              <Button
                type="submit"
                className="w-full hover:cursor-pointer"
                disabled={isLoading || otpValue.length !== 6}
              >
                {isLoading && <Spinner />}
                {isLoading ? "Verifying OTP..." : "Verify OTP"}
              </Button>
            </div>
          </form>
          <div className="mt-2 w-full flex items-center justify-center">
            <div className="flex items-center gap-1 text-center">
              <span>Didn't receive a code? </span>
              <span
                className="ml-auto inline-block text-sm underline-offset-4 underline hover:cursor-pointer hover:text-primary"
                onClick={() => handleResendOtp()}
              >
                Resend
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
//Send again in 44 seconds  //send again
//successfully logged in to
//redirecting to..
