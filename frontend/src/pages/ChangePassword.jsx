import { ArrowLeft } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import API from "@/api/axios";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/password/change", form);
      toast.success("Password changed successfully", {
        position: "top-center",
      });
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.error(
        error.response?.data?.message ||
          "An error occurred while changing password",
        { position: "top-center" },
      );
    }
  };

  const passwordError =
    !form.currentPassword ||
    !form.confirmPassword ||
    form.newPassword !== form.confirmPassword;

  return (
    <>
      <Toaster />
      <div className="mx-auto my-10 w-[calc(100%-1.5rem)] max-w-4xl rounded-3xl shadow-sm">
        <div className="flex flex-col gap-3 px-5 pt-5 pb-3 sm:px-7 sm:pt-8 justify-start border-b ">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className=" h-10 w-10 py-1 hover:cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight ">
              Change Password
            </h1>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-7">
          <form onSubmit={handleSubmit}>
            <FieldSet className="w-full max-w-xs">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="currentPassword">
                    Type your current password <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="currentPassword"
                    type="text"
                    name="currentPassword"
                    onChange={handleChange}
                    value={form.currentPassword}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="newPassword">
                    Type your new password <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="newPassword"
                    type="text"
                    name="newPassword"
                    onChange={handleChange}
                    value={form.newPassword}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Retype your new password <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="text"
                    onChange={handleChange}
                    value={form.confirmPassword}
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <Button
              type="submit"
              disabled={passwordError}
              className={
                passwordError
                  ? "cursor-not-allowed opacity-50 mt-6"
                  : "hover:bg-primary/90 hover:cursor-pointer mt-6"
              }
            >
              Save Password
            </Button>
          </form>

          <Button
            variant="ghost"
            className="mt-4 hover:cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password
          </Button>
        </div>
      </div>
    </>
  );
}
