import { ArrowRight } from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function SecurityPage() {
    const navigate = useNavigate();
  return (


      <div className="mx-auto my-10 w-[calc(100%-1.5rem)] max-w-4xl border rounded-xl">
        <div className="flex w-full items-center justify-between p-3 cursor-pointer"
          onClick={() => navigate("/app/settings/security/change-password")}
        >
          <div className="flex-1 pr-4">Change password</div>
          <ArrowRight className="h-6 w-6 flex-shrink-0 ml-2" />
        </div>

        <div className="w-full flex items-center justify-between border-t p-3 cursor-pointer"
          onClick={() => navigate("/app/settings/security/user-sessions")}
        >
          <div className="flex-1 pr-4">Manage devices where you are signed in</div>
          <ArrowRight className="h-6 w-6 flex-shrink-0 ml-2" />
        </div>
      </div>
    
  );
}
