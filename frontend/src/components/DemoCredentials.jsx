import { Separator } from "@/components/ui/separator";

export default function DemoCredentials({ onFillDemo }) {

  return (
    <>
      <Separator />
      <div className="mt-4 text-sm">
        <p className="font-semibold mb-2">Try Demo</p>

        <button
          type="button"
          onClick={() => onFillDemo("sanjeev@example.com", "password123")}
          className="w-full mb-2 bg-[#644a40b9] rounded-primary text-white py-1 rounded cursor-pointer underline-offset-4 hover:underline"
        >
          Fill as Teacher
        </button>

        <button
          type="button"
          onClick={() => onFillDemo("aditi@gmail.com", "password123")}
          className="w-full bg-[#644a40b9]  text-white py-1 rounded cursor-pointer underline-offset-4 hover:underline"
        >
          Fill as Student
        </button>
      </div>
    </>
  );
}
