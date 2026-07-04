import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import No_classes_yet from "../assets/No_classes_yet.svg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Field, FieldGroup } from "../components/ui/field";
import { Label } from "../components/ui/label";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", title: "" });
  const [isClassCreating, setIsClassCreating] = useState(false);
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
  const handleCreateClass = async (e) => {
    e.preventDefault();

    const { title, subject } = form;
    if (!title || !subject) return;

    try {
      setIsClassCreating(true);

      await API.post("/classes", form);
      setIsDialogOpen(false);
      setForm({ subject: "", title: "" });
      fetchClasses();
    } catch (error) {
      alert("Failed to create");
    } finally {
      setIsClassCreating(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
            className="bg-primary rounded text-white text-sm md:text-base px-2 py-1.5 md:px-4 md:py-2 cursor-pointer hover:bg-primary/90"
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            + Create Class
          </button>
        )}
      </div>

      {/* Class Cards */}

      {loading ? (
        <div className="flex justify-center p-10 ">Loading...</div>
      ) : classes.length === 0 ? (
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
                navigate(`/app/classes/${cls._id}/assignments`);
              }}
              className="cursor-pointer min-h-50"
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
      )}

      {/* create class Overlay */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleCreateClass}>
            <DialogHeader>
              <DialogTitle className="text-xl mb-5">
                Create New Class
              </DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="class-title" className="text-base">
                  Class Title
                </Label>
                <Input
                  id="class-title"
                  name="title"
                  placeholder="e.g. Class-10th Science"
                  required
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <Label htmlFor="class-subject" className="text-base">
                  Class Subject
                </Label>
                <Input
                  id="class-subject"
                  name="subject"
                  placeholder="e.g. Science"
                  required
                  onChange={handleChange}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer" disabled={isClassCreating}>
                {isClassCreating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
