import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import API from "@/api/axios";
import SessionCard from "@/components/SessionCard";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

export default function UserSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState({
    currentSession: null,
    otherSessions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchSessions() {
      try {
        setIsLoading(true);
        const response = await API.get("/auth/sessions");
        if (!mounted) return;

        setSessions({
          currentSession: response.data?.currentSession ?? null,
          otherSessions: response.data?.otherSessions ?? [],
        });
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load sessions.",
        );
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchSessions();
    return () => {
      mounted = false;
    };
  }, []);

  const { currentSession, otherSessions } = sessions;
  const hasSessions = !!currentSession || otherSessions.length > 0;

  const handleLogoutAll = async () => {
    try {
      await API.post("/auth/logout-all");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out from all devices", {
        position: "top-center",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        Loading sessions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="rounded-3xl bg-rose-50 p-6 text-sm shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!hasSessions) {
    return <div className=" p-8 text-center">No active sessions found.</div>;
  }

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
              Active Sessions
            </h1>
            <p className="mt-1 text-md">
              You're signed in to{" "}
              {(currentSession ? 1 : 0) + otherSessions.length} session(s)
            </p>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-7">
          <div className="space-y-6">
            {currentSession && (
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-base font-semibold text-slate-900">
                    Current session
                  </h2>
                  <span className="text-sm text-slate-500">This device</span>
                </div>
                <SessionCard session={currentSession} label="Current device" />
              </section>
            )}

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Other sessions
                </h2>
                <span className="text-sm text-slate-500">
                  {otherSessions.length} device(s)
                </span>
              </div>

              {otherSessions.length === 0 && (
                <div className="rounded-3xl bg-slate-50 p-6 text-slate-600 shadow-sm">
                  No other devices are currently active.
                </div>
              )}

              {otherSessions.length !== 0 && (
                <div className="space-y-4">
                  {otherSessions.map((session) => (
                    <SessionCard
                      key={session._id}
                      session={session}
                      label="Other device"
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-7">
          <Button
            size="lg"
            className="w-full hover:cursor-pointer "
            onClick={handleLogoutAll}
          >
            Logout all devices
          </Button>
        </div>
      </div>
    </>
  );
}

