import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import No_classes_yet from "../assets/No_classes_yet.svg";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;

  //fetch classes
  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");
      setClasses(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const loadClasses = async () => {
      try {
        await fetchClasses();
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  //join class (student)
  const handleJoin = async () => {
    try {
      await API.post("/classes/enroll", { joinCode });
      setJoinCode("");
      fetchClasses();
    } catch (error) {
      alert("Failed to join");
    }
  };

  //create class (teacher)
  const handleCreate = async () => {
    const title = prompt("enter class title");
    const subject = prompt("enter subject");
    if (!title || !subject) return;

    try {
      await API.post("/classes", { title, subject });
      fetchClasses();
    } catch (error) {
      alert("Failed to create");
    }
  };

  return (
    <div className="p-3 md:p-4 space-y-6 ">
      <h1 className="text-2xl my-6 font-semibold">My Classes</h1>

      <div className="flex gap-2 mb-8">
        {/* Actions */}
        {role === "student" && (
          <>
            <Input
              placeholder="Enter Join Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <Button
              className="cursor-pointer w-14 lg:w-17 hover:bg-primary/90"
              onClick={handleJoin}
            >
              Join
            </Button>
          </>
        )}

        {role === "teacher" && (
          <button
            className="bg-primary rounded text-white text-sm md:text-base px-2 py-1.5 md:px-4 md:py-2"
            onClick={handleCreate}
          >
            + Create Class
          </button>
        )}
      </div>

      {/* Class Cards */}

      {loading ? (
        <div className="flex justify-center p-10 ">Loading...</div>
      ) : (
        (classes.length === 0 ? (
          <div className="flex flex-col items-center py-10">
            <img
              src={No_classes_yet}
              alt="No classes"
              className="w-64 h-auto -mt-16 md:-mt-15 md:w-70"
            />

            <h2 className="mt-2 text-xl font-semibold">No Classes yet</h2>

            <p className="text-muted-foreground text-center mt-2">
              {role === "student"
                ? "Join a class using a join code above."
                : "Create your first class to get started."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {classes.map((cls) => (
              <Card
                key={cls._id}
                onClick={() => {
                  navigate(`/app/classes/${cls._id}`);
                }}
                className="cursor-pointer"
              >
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-medium md:text-xl text-lg hover:underline hover:underline-offset-4 ">
                    {cls.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{cls.subject}</p>

                  {role === "teacher" && (
                    <p className="text-sm">Code:&nbsp; {cls.joinCode}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
