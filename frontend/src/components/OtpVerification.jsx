// src/features/auth/components/OtpVerification.jsx
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Field, FieldLabel } from "../components/ui/field";
import { useEffect, useState } from "react";
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
import AuthOverlay from "./AuthOverlay";

export default function OtpVerification({ email, onChangeEmail }) {
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const { setAccessToken, setUser } = useAuth();
  const navigate = useNavigate();
  const OTP_SLOT_CLASS =
    "border-2 border-gray-300 rounded-lg md:w-10 md:h-10 text-center text-lg md:text-2xl font-semibold";

  useEffect(() => {
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    try {
      setIsVerifying(true);
      const res = await API.post("/auth/verifications", {
        email,
        otp: otpValue,
      });

      setAccessToken(res.data.accessToken);
      tokenManager.setAccessToken(res.data.accessToken);
      setUser(res.data.user);

      navigate("/app/classes");
    } catch (error) {
      setOtpValue("");
      toast.error(error.response?.data?.message || "Otp verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;

    try {
      setOtpValue("");
      await API.post("/auth/otp/resend", { email });

      setResendCountdown(60);

      const interval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      {isVerifying && (
        <AuthOverlay
          type="loading"
          title="Signing you in..."
          description="Please wait..."
        />
      )}

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
                disabled={isVerifying || otpValue.length !== 6}
              >
                {isVerifying && <Spinner />}
                {isVerifying ? "Verifying..." : "Verify & Continue"}
              </Button>
            </div>
          </form>
          <div className="mt-2 w-full flex items-center justify-center">
            <div className="flex items-center gap-1 text-center">
              <span>Didn't receive a code? </span>
              <span
                className="ml-auto inline-block text-sm underline-offset-4 underline cursor-pointer hover:text-primary"
                onClick={() => handleResendOtp()}
              >
                {resendCountdown > 0
                  ? `Send again in ${resendCountdown} seconds`
                  : "Send again"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
//Didnot receive the code? (Send again in 44 seconds ) => (send again)
//successfully logged in to
//redirecting to..
// Incorrect OTP. Please check the OTP and re-enter
// Success logged into smart school
