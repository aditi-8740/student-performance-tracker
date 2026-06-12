import { useState } from "react";
import SignupForm from "../components/SignupForm.jsx";
import OtpVerification from "../components/OtpVerification.jsx";

export default function Signup() {
  const [currentStep, setCurrentStep] = useState("REGISTER");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleRegistrationSuccess = (emailAddress) => {
    setRegisteredEmail(emailAddress);
    setCurrentStep("VERIFY OTP");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {currentStep === "REGISTER" && (
        <SignupForm onSignupSuccess={handleRegistrationSuccess} />
      )}

      {currentStep === "VERIFY OTP" && (
        <OtpVerification
          email={registeredEmail}
        />
      )}
    </div>
  );
}
